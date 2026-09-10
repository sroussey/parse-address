import type { CountryMappings } from "./types/ruleset";
import { AddressParserUS } from "./maps/us/parser";
import { AddressParserCA } from "./maps/ca/parser";
import { AddressParserEU } from "./maps/_eu/parser";
import { euConfigs, euCountryCodes } from "./maps/_eu/registry";
import { AddressParserImpl } from "./types/parser";
import { stateCodesMap } from "./maps/us/states";
import { provinceCodesMap } from "./maps/ca/provinces";
import { enforceTokenPreservation, losesTokens } from "./invariant";
import type { ParsedAddress } from "./types/address";
import { stripLeadingOrganization } from "./preprocess";
import { resolveCountryKey } from "./country";
import { inspectPostalCode, normalizePostalCode } from "./postal";
import type { PostalCodeResult } from "./types/postal";

export { resolveCountryKey, tryResolveCountryKey } from "./country";
export {
  inspectPostalCode,
  normalizePostalCode,
  hasPostalGrammar,
} from "./postal";
export type {
  PostalCodeResult,
  PostalCodeRejection,
  PostalCodeRepair,
} from "./types/postal";
export type {
  ParsedAddress,
  AddressTestCase,
  AddressTestCaseMap,
} from "./types/address";
export type { CountryMappings, AddressRuleset } from "./types/ruleset";
export { AddressParserImpl } from "./types/parser";

export class AddressParser implements AddressParserImpl {
  parser: AddressParserImpl;
  /** The resolved internal key, so postal lookups need not re-resolve it. */
  readonly country: CountryMappings;
  // Accepts an internal ISO key ("us", "de", "ky") or a SEC EDGAR code ("K3").
  constructor(country: string = "us") {
    const key = resolveCountryKey(country);
    this.country = key;
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
  /**
   * Normalize a postal code arriving as its own field, against this parser's
   * country. See {@link normalizePostalCode}.
   */
  normalizePostalCode(value: string | null | undefined): string | null {
    return normalizePostalCode(value, this.country);
  }
  /** The same check, with a reason when the value is refused. */
  inspectPostalCode(value: string | null | undefined): PostalCodeResult {
    return inspectPostalCode(value, this.country);
  }
  private get ignored(): string[] | undefined {
    return this.parser.droppableTokens?.();
  }
  // Parse `address` as written first; strip a leading legal-entity / "c/o"
  // segment (EDGAR "street1") ONLY when the address does not already parse
  // losslessly. In street-first (number-after) layouts the leading segment IS
  // the street, and words like "Capital"/"Group"/"Trust" collide with the
  // org-suffix set -- an unconditional strip would delete the real street. A
  // genuine EDGAR record loses tokens un-stripped, which triggers the strip.
  // `ignored` is read immediately after each parse so it reflects that parse's
  // dropped tokens (droppableTokens() is stateful).
  private run(
    parse: (a: string) => ParsedAddress | null,
    address: string
  ): ParsedAddress | null {
    // A leading legal-entity / "c/o" segment is stripped ONLY when it is a real
    // organization -- not when it is a street. In street-first (number-after)
    // layouts the leading segment IS the street ("Avenida Capital, 12, ...") and
    // its last word ("Capital"/"Group"/"Trust") collides with the org-suffix
    // set; `looksLikeStreet` rejects those (they parse to a street type/number),
    // while a genuine filer name ("Bank of Bermuda (Cayman) Limited") does not.
    // The strip is tried FIRST for a genuine org, because the un-stripped parse
    // of an EDGAR record is often "lossless" only by dumping the org name into
    // `street`, which would otherwise fool the token guard.
    const { cleaned, organization } = stripLeadingOrganization(address);
    if (
      cleaned !== address &&
      organization &&
      !this.looksLikeStreet(parse, organization)
    ) {
      const stripped = parse(cleaned);
      const strippedIgnored = this.ignored;
      if (stripped && !losesTokens(cleaned, stripped, strippedIgnored)) {
        // Surface the removed entity so no part of the input is silently lost.
        stripped.organization = organization;
        return stripped;
      }
    }
    const asIs = parse(address);
    const asIsIgnored = this.ignored;
    return enforceTokenPreservation(address, asIs, asIsIgnored);
  }
  // A removed leading segment is a real STREET, not an organization, when it
  // parses to a street type or a house number under this country's grammar
  // ("Avenida Capital" -> type "Avenida"). Such a segment must never be stripped,
  // even though its last word ("Capital", "Group", "Trust") is in the org-suffix
  // set; a genuine filer name ("Cayman Islands Holdings Ltd") yields neither.
  private looksLikeStreet(
    parse: (a: string) => ParsedAddress | null,
    segment: string
  ): boolean {
    const p = parse(segment);
    return !!(p && (p.type || p.number));
  }
  parseAddress(address: string) {
    return this.run((a) => this.parser.parseAddress(a), address);
  }
  parseStreet(address: string) {
    return this.run((a) => this.parser.parseStreet(a), address);
  }
  parseInformalAddress(address: string) {
    return this.run((a) => this.parser.parseInformalAddress(a), address);
  }
  parsePoAddress(address: string) {
    return this.run((a) => this.parser.parsePoAddress(a), address);
  }
  parseLocation(address: string) {
    return this.run((a) => this.parser.parseLocation(a), address);
  }
  parseIntersection(address: string) {
    return this.parser.parseIntersection(address);
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
    // Offshore jurisdictions / Crown Dependencies. "Jersey" is guarded against
    // the US state "New Jersey".
    ["ky", /\bCayman Islands\b/i],
    ["vg", /\b(?:British Virgin Islands|BVI|B\.V\.I\.)\b/i],
    ["bm", /\bBermuda\b/i],
    ["gi", /\bGibraltar\b/i],
    ["je", /(?<!New\s)\bJersey\b/i],
    ["gg", /\b(?:Guernsey|Alderney|Sark)\b/i],
  ];
  for (const [code, re] of names) {
    if (re.test(address)) return code;
  }
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
 * Explicit country-name matchers built once from every registry config's
 * `countryNames`. Only "full" names are kept (>= 4 chars, and NOT colliding
 * with a US state or CA province name -- so "Georgia" the country never steals
 * a US "..., Georgia" address; that ambiguity is left to state detection). Each
 * matcher requires the name to BE the address's final comma segment (optionally
 * after a postcode), which is where a spelled-out country sits -- so a street
 * named "Jordan" or "Chad" mid-address does not misroute.
 */
const COUNTRY_NAME_MATCHERS: [CountryMappings, RegExp][] = (() => {
  const usNames = new Set(
    Object.keys(stateCodesMap).map((s) => s.toLowerCase())
  );
  const caNames = new Set(
    Object.keys(provinceCodesMap).map((s) => s.toLowerCase())
  );
  const out: [CountryMappings, RegExp][] = [];
  for (const code of euCountryCodes) {
    const cfg = euConfigs[code]!;
    const names = (cfg.countryNames ?? []).filter((n) => {
      const l = n.toLowerCase();
      return n.length >= 4 && !usNames.has(l) && !caNames.has(l);
    });
    if (!names.length) continue;
    const alt = names
      .map((n) =>
        n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")
      )
      .sort((a, b) => b.length - a.length)
      .join("|");
    out.push([code as CountryMappings, new RegExp(`(?:^|\\s)(?:${alt})\\s*$`, "i")]);
  }
  return out;
})();

/**
 * Detect a country from an explicit country name spelled out as the final
 * segment of the address ("..., Melbourne VIC 3000, Australia" -> "au"). Every
 * registry config already declares its `countryNames`; this consults them all,
 * so a spelled-out country routes correctly for every grammar, not just the
 * original two dozen.
 */
function detectCountryByName(address: string): CountryMappings | null {
  const lastSeg = address.split(",").pop()?.trim();
  if (!lastSeg) return null;
  for (const [code, re] of COUNTRY_NAME_MATCHERS) {
    if (re.test(lastSeg)) return code;
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

  // A country spelled out as the final segment routes to its grammar for the
  // full registry (Australia, India, South Africa, UAE, Brasil, ...), not just
  // the two dozen detectEuCountry hardcodes.
  const namedCountry = detectCountryByName(address);
  if (namedCountry) {
    return namedCountry;
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
  // Parsers are built on first use, not up front: eagerly constructing all ~220
  // country parsers compiled every XRegExp grammar on instantiation (~700 ms)
  // even when the caller only ever touches one country.
  private parsers: Partial<Record<CountryMappings, AddressParser>> = {};

  // country accepts an internal ISO key or a SEC EDGAR code ("K3"); omit to auto-detect.
  private pick(address: string, country?: string): AddressParser {
    // Auto-detection runs on the org-stripped string so a leading legal-entity
    // segment ("CAYMAN ISLANDS HOLDINGS LTD, 10 Downing Street, London ...")
    // cannot hijack the country -- the parse itself already strips on demand.
    const resolved = country
      ? resolveCountryKey(country)
      : detectCountry(stripLeadingOrganization(address).cleaned);
    let parser = this.parsers[resolved];
    if (!parser) {
      parser = new AddressParser(resolved);
      this.parsers[resolved] = parser;
    }
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
