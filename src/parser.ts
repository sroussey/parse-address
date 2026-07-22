import type { CountryMappings } from "./types/ruleset";
import { AddressParserUS } from "./maps/us/parser";
import { AddressParserCA } from "./maps/ca/parser";
import { AddressParserImpl } from "./types/parser";
import { stateCodesMap } from "./maps/us/states";
import { provinceCodesMap } from "./maps/ca/provinces";
import { enforceTokenPreservation } from "./invariant";

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
    switch (country) {
      case "us":
        this.parser = new AddressParserUS();
        break;
      case "ca":
        this.parser = new AddressParserCA();
        break;
      default:
        throw new Error(`Unsupported country "${country}"; supported: us, ca`);
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
  private parsers: Record<CountryMappings, AddressParser>;
  constructor() {
    this.parsers = {
      us: new AddressParser("us"),
      ca: new AddressParser("ca"),
    };
  }

  private pick(address: string, country?: CountryMappings): AddressParser {
    const resolved = country ?? detectCountry(address);
    const parser = this.parsers[resolved];
    if (!parser) {
      throw new Error(`Unsupported country "${resolved}"; supported: us, ca`);
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
