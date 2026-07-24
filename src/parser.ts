import type { CountryMappings } from "./types/ruleset";
import type { ParsedAddress } from "./types/address";
import { AddressParserUS } from "./maps/us/parser";
import { AddressParserCA } from "./maps/ca/parser";
import { AddressParserEU } from "./maps/_eu/parser";
import { euConfigs, euCountryCodes } from "./maps/_eu/registry";
import { AddressParserImpl } from "./types/parser";
import { stateCodesMap } from "./maps/us/states";
import { provinceCodesMap } from "./maps/ca/provinces";
import { enforceTokenPreservation } from "./invariant";
import { secCountryCodes } from "./maps/sec-countries";
import { stripLeadingOrganization } from "./preprocess";

const SUPPORTED_COUNTRIES: CountryMappings[] = [
  "us",
  "ca",
  ...(euCountryCodes as CountryMappings[]),
];

/**
 * True when we have a dedicated address grammar for this internal key.
 * Uses an own-property check: a plain `euConfigs[key]` truthiness test also
 * accepts inherited `Object.prototype` members ("constructor", "__proto__"),
 * which would then be handed to `AddressParserEU` as a config and blow up with
 * an opaque TypeError instead of the descriptive "unsupported country" error.
 */
function isSupportedKey(key: string): key is CountryMappings {
  return (
    key === "us" ||
    key === "ca" ||
    Object.prototype.hasOwnProperty.call(euConfigs, key)
  );
}

// The full supported list is ~220 codes; naming them all makes an unreadable
// ~900-character error. Show a sample and the total instead.
function supportedSummary(): string {
  const head = SUPPORTED_COUNTRIES.slice(0, 12).join(", ");
  return SUPPORTED_COUNTRIES.length > 12
    ? `${head}, ... (${SUPPORTED_COUNTRIES.length} total)`
    : head;
}

/**
 * Resolve a country selector to an internal parser key. Accepts our internal
 * ISO alpha-2 keys ("us", "de", "ky", …) and SEC EDGAR "State or Country" codes
 * ("K3" → Hong Kong, "L3" → Israel, …). A SEC code is resolved to its modern
 * ISO country; an obsolete code with no successor, or a real country we do not
 * have a grammar for yet, throws a descriptive error.
 */
export function resolveCountryKey(input: string): CountryMappings {
  const lower = input.trim().toLowerCase();
  if (isSupportedKey(lower)) return lower;

  const sec = secCountryCodes[input.trim().toUpperCase()];
  if (sec) {
    if (!sec.iso2) {
      throw new Error(
        `SEC code "${input}" (${sec.name}) is an obsolete jurisdiction with no modern country`
      );
    }
    const key = sec.iso2.toLowerCase();
    if (isSupportedKey(key)) return key;
    throw new Error(
      `SEC code "${input}" resolves to ${sec.name} (${sec.iso2}), which has no address grammar yet`
    );
  }
  throw new Error(`Unsupported country "${input}"; supported: ${supportedSummary()}`);
}

export type {
  ParsedAddress,
  AddressTestCase,
  AddressTestCaseMap,
} from "./types/address";
export type { CountryMappings, AddressRuleset } from "./types/ruleset";
export { AddressParserImpl } from "./types/parser";
export { stripLeadingOrganization } from "./preprocess";
export { secCountryCodes, secCodeToIso } from "./maps/sec-countries";
export { euCountryCodes } from "./maps/_eu/registry";

export class AddressParser implements AddressParserImpl {
  parser: AddressParserImpl;
  // Accepts an internal ISO key ("us", "de", "ky") or a SEC EDGAR code ("K3").
  constructor(country: string = "us") {
    const key = resolveCountryKey(country);
    if (key === "us") {
      this.parser = new AddressParserUS();
    } else if (key === "ca") {
      this.parser = new AddressParserCA();
    } else {
      this.parser = new AddressParserEU(euConfigs[key]!);
    }
  }
  normalizeAddress(parts) {
    return this.parser.normalizeAddress(parts);
  }
  private get ignored(): string[] | undefined {
    return this.parser.droppableTokens?.();
  }
  /**
   * Strip a leading legal-entity / "c/o" segment (EDGAR "street1") so the real
   * address parses, run `parse` on the cleaned string (so the token-preservation
   * check sees exactly what was parsed), and carry the removed entity through to
   * the result as `organization` -- it was in the caller's input, so it must not
   * be silently destroyed.
   */
  private run(
    address: string,
    parse: (a: string) => ParsedAddress | null
  ): ParsedAddress | null {
    const { cleaned, organization } = stripLeadingOrganization(address);
    // `this.ignored` must be read AFTER the parse: the EU parser records the
    // tokens the matched grammar dropped while parsing.
    const parsed = parse(cleaned);
    const result = enforceTokenPreservation(cleaned, parsed, this.ignored);
    if (result && organization) result.organization = organization;
    return result;
  }
  parseAddress(address: string) {
    return this.run(address, (a) => this.parser.parseAddress(a));
  }
  parseStreet(address: string) {
    return this.run(address, (a) => this.parser.parseStreet(a));
  }
  parseInformalAddress(address: string) {
    return this.run(address, (a) => this.parser.parseInformalAddress(a));
  }
  parsePoAddress(address: string) {
    return this.run(address, (a) => this.parser.parsePoAddress(a));
  }
  parseLocation(address: string) {
    return this.run(address, (a) => this.parser.parseLocation(a));
  }
  parseIntersection(address: string) {
    // Same leading-entity handling as the other entry points (the token-
    // preservation guard does not apply: an intersection carries two streets).
    const { cleaned, organization } = stripLeadingOrganization(address);
    const result = this.parser.parseIntersection(cleaned) as ParsedAddress | null;
    if (result && organization) result.organization = organization;
    return result;
  }
  findStreetTypeShortCode(streetType?: string): string {
    return this.parser.findStreetTypeShortCode(streetType);
  }
  droppableTokens(): string[] {
    return this.parser.droppableTokens?.() ?? [];
  }
}

/**
 * Check if address contains explicit country name indicators
 */
function hasExplicitCountryIndicators(address: string): CountryMappings | null {
  if (/\b(Canada)\b/i.test(address)) {
    return "ca";
  }
  if (/\b(US|USA|United States)\b/i.test(address)) {
    return "us";
  }
  return null;
}

/**
 * Check for postal code format patterns
 */
function detectCountryByPostalCode(address: string): CountryMappings | null {
  // Canadian postal code pattern: A1A 1A1 or A1A1A1
  const canadianPostalCode = /[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d/;
  
  // US ZIP code pattern: 12345 or 12345-1234
  const usZipCode = /\b\d{5}(?:-?\d{4})?\b/;
  
  if (canadianPostalCode.test(address)) {
    return "ca";
  }
  if (usZipCode.test(address)) {
    return "us";
  }
  return null;
}

/**
 * Country names declared by the country configs themselves, keyed by lowercase
 * name. Built once. Only names that are unambiguous (claimed by exactly one
 * config) and long enough not to collide with an ordinary address word are
 * kept: a 2-3 letter alias ("AU", "ZAF") would match unit numbers and initials,
 * and "USA"/"United States" is claimed by five US-territory configs.
 *
 * A name that is ALSO a US state/territory name is only kept when it names the
 * same jurisdiction: "Puerto Rico"/"Guam"/"American Samoa" are both an EDGAR
 * region and one of our grammars, so detecting them is right, but "Georgia" the
 * country (GE) and Georgia the US state (GA) are different places and the state
 * is by far the likelier reading of "..., Atlanta, Georgia".
 */
const CONFIGURED_COUNTRY_NAMES: ReadonlyMap<string, CountryMappings> = (() => {
  const usNames = stateCodesMap as Record<string, string>;
  const claims = new Map<string, Set<string>>();
  for (const [code, config] of Object.entries(euConfigs)) {
    for (const name of config.countryNames ?? []) {
      const key = String(name).toLowerCase().trim();
      if (key.length < 4) continue;
      const usCode = usNames[key];
      if (usCode && usCode.toLowerCase() !== code) continue;
      if (!claims.has(key)) claims.set(key, new Set());
      claims.get(key)!.add(code);
    }
  }
  const unique = new Map<string, CountryMappings>();
  for (const [name, codes] of claims) {
    if (codes.size === 1) unique.set(name, [...codes][0] as CountryMappings);
  }
  return unique;
})();

/**
 * Detect the country when the address's final comma segment IS a country name
 * ("..., Melbourne VIC 3000, Australia"). Deliberately an exact match on a
 * dedicated segment rather than a search anywhere in the text: country names
 * collide heavily with US place names ("Lebanon OH", "Santa Fe New Mexico",
 * "Peru IN"), and those never sit alone in the trailing segment -- a US line
 * ends with its state and ZIP.
 */
function detectByConfiguredCountryName(address: string): CountryMappings | null {
  const segments = address.split(",");
  if (segments.length < 2) return null;
  const tail = (segments[segments.length - 1] ?? "")
    .trim()
    .replace(/[.\s]+$/, "")
    .toLowerCase();
  if (!tail) return null;
  return CONFIGURED_COUNTRY_NAMES.get(tail) ?? null;
}

/**
 * Crown-Dependency names that are also ordinary US place/street words ("Jersey
 * City NJ", "Sark Lane"). Unlike "Cayman Islands" or "Gibraltar" these cannot be
 * matched anywhere in the text -- they only signal the country when they occupy
 * a WHOLE comma segment, which is how a country is actually written.
 */
const SEGMENT_ONLY_COUNTRY_NAMES: [CountryMappings, RegExp][] = [
  ["je", /^(?:Jersey|Isle of Jersey)$/i],
  ["gg", /^(?:Guernsey|Alderney|Sark|Bailiwick of Guernsey)$/i],
];

function detectBySegmentOnlyName(address: string): CountryMappings | null {
  const segments = address.split(",").map((s) => s.trim().replace(/[.\s]+$/, ""));
  for (const segment of segments) {
    if (!segment) continue;
    for (const [code, re] of SEGMENT_ONLY_COUNTRY_NAMES) {
      if (re.test(segment)) return code;
    }
  }
  return null;
}

/**
 * Strong European signals: an explicit country name, or a country-specific
 * postcode shape distinctive enough not to collide with US ZIP / CA postal.
 * The continental countries (DE/FR/IT/ES) all share a bare 5-digit postcode
 * that is ambiguous with a US ZIP, so without an explicit country name they are
 * left to the US default -- callers who know the country should pass it.
 */
function detectEuCountry(address: string): CountryMappings | null {
  const names: [CountryMappings, RegExp][] = [
    ["de", /\b(?:Deutschland|Germany)\b/i],
    ["fr", /\bFrance\b/i],
    ["it", /\b(?:Italia|Italy)\b/i],
    ["es", /\b(?:España|Espana|Spain)\b/i],
    ["nl", /\b(?:Nederland|Netherlands|Holland)\b/i],
    ["gb", /\b(?:United Kingdom|Great Britain)\b/i],
    ["be", /\b(?:België|Belgie|Belgique|Belgien|Belgium)\b/i],
    // No leading \b: JS word boundaries are ASCII-only and fail before "Ö".
    ["at", /(?:Österreich|Oesterreich|Austria)\b/i],
    ["pl", /\b(?:Polska|Poland)\b/i],
    ["ch", /\b(?:Schweiz|Suisse|Svizzera|Switzerland)\b/i],
    ["pt", /\bPortugal\b/i],
    ["se", /\b(?:Sverige|Sweden)\b/i],
    ["dk", /\b(?:Danmark|Denmark)\b/i],
    ["no", /\b(?:Norge|Noreg|Norway)\b/i],
    ["fi", /\b(?:Suomi|Finland)\b/i],
    ["ie", /\b(?:Ireland|Éire|Eire)\b/i],
    ["cz", /\b(?:Česko|Česká republika|Czech Republic|Czechia)\b/i],
    ["gr", /(?:Ελλάδα|Ελλάς|\bGreece\b|\bHellas\b)/i],
    // Offshore jurisdictions / Crown Dependencies.
    ["ky", /\bCayman Islands\b/i],
    ["vg", /\b(?:British Virgin Islands|BVI|B\.V\.I\.)\b/i],
    ["bm", /\bBermuda\b/i],
    ["gi", /\bGibraltar\b/i],
  ];
  for (const [code, re] of names) {
    if (re.test(address)) return code;
  }
  // Jersey/Guernsey/Alderney/Sark: whole-segment only (see the comment there).
  const segmentOnly = detectBySegmentOnlyName(address);
  if (segmentOnly) return segmentOnly;
  // Every country config declares its own `countryNames`; consult them so the
  // ~200 grammars beyond the hand-tuned list above are auto-detectable too
  // (otherwise "10 Collins Street, Melbourne VIC 3000, Australia" silently
  // defaults to the US parser). Restricted to the address's LAST comma segment,
  // which is where a country is actually written -- an ordinary US line
  // ("123 Main St, Peru, IL 61607") ends with its state+ZIP, not a country name.
  const fromRegistry = detectByConfiguredCountryName(address);
  if (fromRegistry) return fromRegistry;
  // Offshore postcodes, matched BEFORE the generic UK shape below (JE/GY/GX all
  // fit the UK outward+inward pattern, so they must be claimed first).
  if (/\bKY[1-3]-\d{4}\b/i.test(address)) return "ky";
  if (/\bVG\d{4}\b/i.test(address)) return "vg";
  if (/\bGX\d{2}\s*\d[A-Za-z]{2}\b/i.test(address)) return "gi";
  if (/\bJE\d\s*\d[A-Za-z]{2}\b/i.test(address)) return "je";
  if (/\bGY\d{1,2}\s*\d[A-Za-z]{2}\b/i.test(address)) return "gg";
  // Bermuda: a parish/city two-letter code + two chars at the very end.
  if (/\b(?:HM|CR|FL|HS|DV|PG|WK|SN|MA|SB|GE|DD)\s*[0-9A-Z]{2}\s*$/.test(address))
    return "bm";
  // Greek script anywhere is an unambiguous Greece signal.
  if (/[Ͱ-Ͽἀ-῿]/.test(address)) return "gr";
  // Irish Eircode: routing key (letter + digit + digit/"W") + space + 4 chars.
  // Its inward part starts with a letter, so it never matches the UK shape.
  if (/\b[A-Za-z]\d[\dWw]\s+[A-Za-z\d]{4}\b/.test(address)) return "ie";
  // Finnish "FI-"/"FIN-" prefixed 5-digit postcode.
  if (/\bFIN?-\d{5}\b/i.test(address)) return "fi";
  // Distinctive dash postcodes: Polish "NN-NNN", Portuguese "PPPP-PPP". Require
  // a preceding comma (place-tail position) so a leading civic-number range like
  // the Canadian "10-123" is not misread as a Polish postcode.
  if (/,\s*\d{4}-\d{3}\b/.test(address)) return "pt";
  if (/,\s*\d{2}-\d{3}\b/.test(address)) return "pl";
  // Country-prefixed 4-digit postcodes ("CH-1204", "A-1010").
  if (/\bCH-\d{4}\b/i.test(address)) return "ch";
  if (/\bA-\d{4}\b/.test(address)) return "at";
  // UK postcode: outward (1-2 letters, digit, optional letter/digit) + inward
  // (digit + two letters). CA postal ends digit-letter-digit, so it never
  // matches this; US ZIP has no letters.
  if (/\b(?:GIR\s*0AA|[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2})\b/.test(address)) {
    return "gb";
  }
  // NL postcode: 4 digits + 2 letters, followed by a city word. A real Dutch
  // postcode never leads an address (the street comes first), so require some
  // street content before it -- this rejects a leading "1234 AB Cres" house
  // number that would otherwise be misread as a postcode. Also skip when a
  // 5-digit US ZIP is present.
  if (
    /\S.*\b\d{4}\s?[A-Za-z]{2}\b\s+[A-Za-z]/.test(address) &&
    !/^\s*\d{4}\s?[A-Za-z]{2}\b/.test(address) &&
    !/\b\d{5}\b/.test(address)
  ) {
    return "nl";
  }
  return null;
}

/**
 * Check for province or state names (full names)
 */
function detectCountryByRegionNames(address: string): CountryMappings | null {
  const addressLower = address.toLowerCase();
  const canadianProvinces = Object.keys(provinceCodesMap);
  const usStates = Object.keys(stateCodesMap);
  
  // Check for Canadian provinces (full names first)
  for (const province of canadianProvinces) {
    if (addressLower.includes(province.toLowerCase())) {
      return "ca";
    }
  }
  
  // Check for US states (full names)
  for (const state of usStates) {
    if (addressLower.includes(state.toLowerCase())) {
      return "us";
    }
  }
  
  return null;
}

/**
 * Check for province or state codes (abbreviated forms)
 */
function detectCountryByRegionCodes(address: string): CountryMappings | null {
  // SEC EDGAR region codes (A0-B0/Z4) are intentionally NOT used for country
  // detection: they collide with unit numbers ("Apt A8"), so a US address with
  // no ZIP/state would misroute to Canada. They are recognized only by the CA
  // parser itself; a real EDGAR Canadian address auto-detects via its Canadian
  // postal code, which detection matches by shape before region codes.
  const canadianProvinceCodes = Object.values(provinceCodesMap);
  const usStateCodes = Object.values(stateCodesMap);
  
  // Check US state codes first (more common)
  for (const stateCode of usStateCodes) {
    if (new RegExp(`\\b${stateCode}\\b`).test(address)) {
      return "us";
    }
  }
  
  // Check for Canadian province codes (only if not already matched as US)
  for (const provinceCode of canadianProvinceCodes) {
    if (new RegExp(`\\b${provinceCode}\\b`).test(address)) {
      return "ca";
    }
  }
  
  return null;
}

/**
 * Check for French street types (strong indicator of Canada)
 */
function detectCountryByFrenchStreetTypes(address: string): CountryMappings | null {
  const addressLower = address.toLowerCase();
  const frenchStreetTypes = ['rue', 'chemin', 'boulevard', 'avenue', 'allée'];
  
  for (const frenchType of frenchStreetTypes) {
    if (addressLower.includes(frenchType)) {
      return "ca";
    }
  }
  
  return null;
}

/**
 * Resolve the country for an address using a fixed precedence (the documented
 * contract; callers who know the country should pass it explicitly to
 * IntlAddressParser instead of relying on detection):
 *   1. Explicit country name/code in the text ("Canada", "US"/"USA")
 *   2. Postal-code shape (Canadian FSA/LDU vs US ZIP)
 *   3. Full region names (province/state)
 *   4. Region codes (province/state abbreviations; US checked first)
 *   5. French street types (strong Canada signal)
 *   6. Default: US
 */
function detectCountry(address: string): CountryMappings {
  // Check explicit country indicators first
  const explicitCountry = hasExplicitCountryIndicators(address);
  if (explicitCountry) {
    return explicitCountry;
  }

  // Strong European signals (explicit name, or UK/NL postcode shape) before the
  // US-ZIP default, which would otherwise claim continental 5-digit codes.
  const euCountry = detectEuCountry(address);
  if (euCountry) {
    return euCountry;
  }

  // Check postal code formats (more reliable than province/state codes)
  const postalCodeCountry = detectCountryByPostalCode(address);
  if (postalCodeCountry) {
    return postalCodeCountry;
  }
  
  // Check for region names (provinces/states)
  const regionNameCountry = detectCountryByRegionNames(address);
  if (regionNameCountry) {
    return regionNameCountry;
  }
  
  // Check for region codes (province/state abbreviations)
  const regionCodeCountry = detectCountryByRegionCodes(address);
  if (regionCodeCountry) {
    return regionCodeCountry;
  }
  
  // Check for French street types
  const frenchStreetCountry = detectCountryByFrenchStreetTypes(address);
  if (frenchStreetCountry) {
    return frenchStreetCountry;
  }
  
  // Default to US
  return "us";
}

export class IntlAddressParser {
  // Built on demand and memoized: eagerly constructing all ~220 country parsers
  // compiles every grammar up front (~700ms) even though a caller typically
  // touches one or two.
  private parsers: Partial<Record<CountryMappings, AddressParser>> = {};

  // country accepts an internal ISO key or a SEC EDGAR code ("K3"); omit to auto-detect.
  private pick(address: string, country?: string): AddressParser {
    // Auto-detection must see the same string the parse will: a leading entity
    // segment ("CAYMAN ISLANDS HOLDINGS LTD, 10 Downing Street, London SW1A 2AA")
    // otherwise hijacks the country.
    const resolved = country
      ? resolveCountryKey(country)
      : detectCountry(stripLeadingOrganization(address).cleaned);
    const existing = this.parsers[resolved];
    if (existing) return existing;
    if (!isSupportedKey(resolved)) {
      throw new Error(
        `Unsupported country "${resolved}"; supported: ${supportedSummary()}`
      );
    }
    const parser = new AddressParser(resolved);
    this.parsers[resolved] = parser;
    return parser;
  }

  parseLocation(address: string, country?: string) {
    return this.pick(address, country).parseLocation(address);
  }
  parseAddress(address: string, country?: string) {
    return this.pick(address, country).parseAddress(address);
  }
  parseInformalAddress(address: string, country?: string) {
    return this.pick(address, country).parseInformalAddress(address);
  }
  parseStreet(address: string, country?: string) {
    return this.pick(address, country).parseStreet(address);
  }
  parsePoAddress(address: string, country?: string) {
    return this.pick(address, country).parsePoAddress(address);
  }
  parseIntersection(address: string, country?: string) {
    return this.pick(address, country).parseIntersection(address);
  }
}

/** Default US parser instance (convenience for `import addressParser from ...`). */
const addressParser = new AddressParser("us");
export default addressParser;
