import type { CountryMappings } from "./types/ruleset";
import { AddressParserUS } from "./maps/us/parser";
import { AddressParserCA } from "./maps/ca/parser";
import { AddressParserImpl } from "./types/parser";
import { stateCodesMap } from "./maps/us/states";
import { provinceCodesMap } from "./maps/ca/provinces";

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
    }
  }
  normalizeAddress(parts) {
    return this.parser.normalizeAddress(parts);
  }
  parseAddress(address: string) {
    return this.parser.parseAddress(address);
  }
  parseStreet(address: string) {
    return this.parser.parseStreet(address);
  }
  parseInformalAddress(address: string) {
    return this.parser.parseInformalAddress(address);
  }
  parsePoAddress(address: string) {
    return this.parser.parsePoAddress(address);
  }
  parseLocation(address: string) {
    return this.parser.parseLocation(address);
  }
  parseIntersection(address: string) {
    return this.parser.parseIntersection(address);
  }
  findStreetTypeShortCode(streetType?: string): string {
    return this.parser.findStreetTypeShortCode(streetType);
  }
}

function detectCountry(address: string): CountryMappings {
  // Canadian postal code pattern: A1A 1A1 or A1A1A1
  const canadianPostalCode = /[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d/;
  
  // US ZIP code pattern: 12345 or 12345-1234
  const usZipCode = /\b\d{5}(?:-?\d{4})?\b/;
  
  // Check for explicit country indicators
  if (/\b(Canada)\b/i.test(address)) {
    return "ca";
  }
  if (/\b(US|USA|United States)\b/i.test(address)) {
    return "us";
  }
  
  // Check postal code formats first (more reliable than province/state codes)
  if (canadianPostalCode.test(address)) {
    return "ca";
  }
  if (usZipCode.test(address)) {
    return "us";
  }
  
  // Check for Canadian provinces vs US states
  const addressLower = address.toLowerCase();
  const canadianProvinces = Object.keys(provinceCodesMap);
  const canadianProvinceCodes = Object.values(provinceCodesMap);
  const usStates = Object.keys(stateCodesMap);
  const usStateCodes = Object.values(stateCodesMap);
  
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
  
  // Check for state/province codes - be more specific to avoid conflicts
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
  
  // Check for French street types (strong indicator of Canada)
  const frenchStreetTypes = ['rue', 'chemin', 'boulevard', 'avenue', 'allée'];
  for (const frenchType of frenchStreetTypes) {
    if (addressLower.includes(frenchType)) {
      return "ca";
    }
  }
  
  // Default to US
  return "us";
}

export class IntlAddressParser {
  private parsers: Record<CountryMappings, AddressParser>;
  constructor() {
    this.parsers = { 
      us: new AddressParser("us"),
      ca: new AddressParser("ca")
    };
  }

  // must end in country name or country code
  parseLocation(address: string) {
    const country = detectCountry(address);
    return this.parsers[country].parseLocation(address);
  }
  // must end in country name or country code
  parseAddress(address: string) {
    const country = detectCountry(address);
    return this.parsers[country].parseAddress(address);
  }
  // must end in country name or country code
  parseInformalAddress(address: string) {
    const country = detectCountry(address);
    return this.parsers[country].parseInformalAddress(address);
  }
  parseStreet(address: string, country: CountryMappings) {
    return this.parsers[country].parseStreet(address);
  }
}
