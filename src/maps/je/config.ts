import type { EuCountryConfig } from "../_eu/types";

/**
 * Jersey (JE) address configuration. A British Crown Dependency, addressed in
 * UK style: house number first, street name + trailing type, the parish as the
 * locality, an optional country line ("Jersey"), and a UK-format postcode LAST
 * with the fixed `JE` area (`JE1 1AA` .. `JE4 9WG`).
 *
 * A large share of real Jersey addresses are offshore-finance registered
 * offices that lead with a named building ("Ogier House, The Esplanade,
 * St Helier, JE4 9WG"), so `buildingKeywords` is enabled. "Esplanade" is kept
 * as part of the street name (not a separated type), matching local usage
 * ("44 Esplanade" -> street "Esplanade"); Norman/French road names (Les Banques,
 * Le Truchot) carry no type and pass through whole.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Terrace", "Place", "Row", "Court",
  "Crescent", "Gardens", "Close", "Way", "Drive", "Hill", "Green", "Square", "Rd", "Ave", "Ln", "Dr",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  lane: "LN", ln: "LN", terrace: "TER", place: "PL", row: "ROW", court: "CT",
  crescent: "CRES", gardens: "GDNS", close: "CL", way: "WAY", drive: "DR",
  dr: "DR", hill: "HL", green: "GRN", square: "SQ",
};

export const jeConfig: EuCountryConfig = {
  code: "je",
  country: "JE",
  countryNames: ["Jersey", "JE", "JEY"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  countyPattern: "(?!x)x", // no county/state field in these jurisdictions

  // UK-format postcode with the fixed Jersey area letters.
  postalPattern: "(?<postal_code>JE\\d\\s*\\d[A-Za-z]{2})",
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, -3)} ${s.slice(-3)}`;
  },
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  // "The Esplanade", "The Parade", "The Grange" are whole street names.
  articleNames: ["The"],

  // Pure building nouns only -- disjoint from TYPES (no Court/Place), so a real
  // street like "9 Halkett Place" is never mistaken for a building.
  buildingKeywords: [
    "House", "Chambers", "Centre", "Center", "Building", "Wing", "Hall",
    "Tower", "Towers", "Manor", "Farm", "Cottages", "Villa", "Lodge",
  ],
  buildingTypeKeywords: ["Court", "Place"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>PO\\s?Box|P\\.O\\.\\s?Box|Floor|Suite|Unit|Apartment|Apt\\.?|Flat|Office|Room)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    floor: "Floor", suite: "Suite", unit: "Unit", apartment: "Apartment",
    apt: "Apt", flat: "Flat", office: "Office", room: "Room",
  },

  poBoxNames: ["PO Box", "P.O. Box", "PO BOX"],
  poBoxDisplayMap: { "po box": "PO Box", "p.o. box": "PO Box" },
};

export default jeConfig;
