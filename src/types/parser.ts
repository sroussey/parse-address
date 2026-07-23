export abstract class AddressParserImpl {
  abstract normalizeAddress(_parts);
  abstract parseAddress(address: string);
  abstract parseStreet(streetaddress: string);
  abstract parseInformalAddress(address: string);
  abstract parsePoAddress(address: string);
  abstract parseLocation(address: string);
  abstract parseIntersection(address: string);
  abstract findStreetTypeShortCode(_streetType?: string);
  /**
   * Phrases this parser intentionally drops from the structured result
   * (development/area names), so the token-preservation guard does not score
   * them as lost street tokens. Optional; defaults to none.
   */
  droppableTokens?(): string[];
}
