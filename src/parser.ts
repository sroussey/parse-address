import type { CountryMappings } from "./types/ruleset";
import { AddressParserUS } from "./maps/us/parser";
import { AddressParserCA } from "./maps/ca/parser";
import { AddressParserEU } from "./maps/_eu/parser";
import { euConfigs, euCountryCodes } from "./maps/_eu/registry";
import { AddressParserImpl } from "./types/parser";
import { stateCodesMap } from "./maps/us/states";
import { provinceCodesMap } from "./maps/ca/provinces";
import { enforceTokenPreservation } from "./invariant";

const SUPPORTED_COUNTRIES: CountryMappings[] = [
  "us",
  "ca",
  ...(euCountryCodes as CountryMappings[]),
];

export type {
  ParsedAddress,
  AddressTestCase,
  AddressTestCaseMap,
} from "./types/address";
export type { CountryMappings, AddressRuleset } from "./types/ruleset";
export { AddressParserImpl } from "./types/parser";

export class AddressParser implements AddressParserImpl {
  parser: AddressParserImpl;
  constructor(country: CountryMappings = "us") {
    if (country === "us") {
      this.parser = new AddressParserUS();
    } else if (country === "ca") {
      this.parser = new AddressParserCA();
    } else if (euConfigs[country]) {
      this.parser = new AddressParserEU(euConfigs[country]);
    } else {
      throw new Error(
        `Unsupported country "${country}"; supported: ${SUPPORTED_COUNTRIES.join(", ")}`
      );
    }
  }
  normalizeAddress(parts) {
    return this.parser.normalizeAddress(parts);
  }
  parseAddress(address: string) {
    return enforceTokenPreservation(address, this.parser.parseAddress(address));
  }
  parseStreet(address: string) {
    return enforceTokenPreservation(address, this.parser.parseStreet(address));
  }
  parseInformalAddress(address: string) {
    return enforceTokenPreservation(address, this.parser.parseInformalAddress(address));
  }
  parsePoAddress(address: string) {
    return enforceTokenPreservation(address, this.parser.parsePoAddress(address));
  }
  parseLocation(address: string) {
    return enforceTokenPreservation(address, this.parser.parseLocation(address));
  }
  parseIntersection(address: string) {
    return this.parser.parseIntersection(address);
  }
  findStreetTypeShortCode(streetType?: string): string {
    return this.parser.findStreetTypeShortCode(streetType);
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
  ];
  for (const [code, re] of names) {
    if (re.test(address)) return code;
  }
  // UK postcode: outward (1-2 letters, digit, optional letter/digit) + inward
  // (digit + two letters). CA postal ends digit-letter-digit, so it never
  // matches this; US ZIP has no letters.
  if (/\b(?:GIR\s*0AA|[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2})\b/.test(address)) {
    return "gb";
  }
  // NL postcode: 4 digits + 2 letters. Require a following city word so a bare
  // "1234 AB" house-number-plus-region does not trip it.
  if (/\b\d{4}\s?[A-Za-z]{2}\b\s+[A-Za-z]/.test(address) && !/\b\d{5}\b/.test(address)) {
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
  private parsers: Partial<Record<CountryMappings, AddressParser>>;
  constructor() {
    this.parsers = {};
    for (const code of SUPPORTED_COUNTRIES) {
      this.parsers[code] = new AddressParser(code);
    }
  }

  private pick(address: string, country?: CountryMappings): AddressParser {
    const resolved = country ?? detectCountry(address);
    const parser = this.parsers[resolved];
    if (!parser) {
      throw new Error(
        `Unsupported country "${resolved}"; supported: ${SUPPORTED_COUNTRIES.join(", ")}`
      );
    }
    return parser;
  }

  parseLocation(address: string, country?: CountryMappings) {
    return this.pick(address, country).parseLocation(address);
  }
  parseAddress(address: string, country?: CountryMappings) {
    return this.pick(address, country).parseAddress(address);
  }
  parseInformalAddress(address: string, country?: CountryMappings) {
    return this.pick(address, country).parseInformalAddress(address);
  }
  parseStreet(address: string, country?: CountryMappings) {
    return this.pick(address, country).parseStreet(address);
  }
  parsePoAddress(address: string, country?: CountryMappings) {
    return this.pick(address, country).parsePoAddress(address);
  }
  parseIntersection(address: string, country?: CountryMappings) {
    return this.pick(address, country).parseIntersection(address);
  }
}

/** Default US parser instance (convenience for `import addressParser from ...`). */
const addressParser = new AddressParser("us");
export default addressParser;
