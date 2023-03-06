import type { CountryMappings } from "./types/ruleset";
import { AddressParserUS } from "./maps/us/parser";
import { AddressParserImpl } from "./types/parser";

export class AddressParser implements AddressParserImpl {
  parser: AddressParserImpl;
  constructor(country: CountryMappings = "us") {
    switch (country) {
      case "us":
        this.parser = new AddressParserUS();
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

export class IntlAddressParser {
  private parsers: Record<CountryMappings, AddressParser>;
  constructor() {
    this.parsers = { us: new AddressParser("us") };
  }

  // must end in country name or country code
  parseLocation(address: string) {
    // TODO: determine country
    let country = "us";
    return this.parsers[country].parseLocation(address);
  }
  // must end in country name or country code
  parseAddress(address: string) {
    // TODO: determine country
    let country = "us";
    return this.parsers[country].parseAddress(address);
  }
  // must end in country name or country code
  parseInformalAddress(address: string) {
    // TODO: determine country
    let country = "us";
    return this.parsers[country].parseInformalAddress(address);
  }
  parseStreet(address: string, country: CountryMappings) {
    return this.parsers[country].parseStreet(address);
  }
}
