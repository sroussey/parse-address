import type { EuCountryConfig } from "../_eu/types";

/**
 * Guernsey (GG) address configuration. A British Crown Dependency (which also
 * covers Alderney and Sark), addressed in UK style: house number first, street
 * name + trailing type, the parish/island as the locality, an optional country
 * line ("Guernsey"), and a UK-format postcode LAST with the fixed `GY` area.
 * Note GY10 (Sark) has TWO digits before the space -- `GY\d{1,2} \d[A-Z]{2}`.
 *
 * The ISO country code is `GG` even though the postcode prefix is `GY`. Like
 * Jersey, offshore-finance registered offices dominate, so `buildingKeywords`
 * is enabled ("Trafalgar Court, Les Banques, St Peter Port, GY1 3DA"). Norman/
 * French road names (Les Banques, Le Pollet) carry no type.
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

export const ggConfig: EuCountryConfig = {
  code: "gg",
  country: "GG",
  // NB: Alderney/Sark are localities (city/state), not country tokens -- keeping
  // them out of countryNames stops them being consumed before the postcode.
  countryNames: ["Guernsey", "GG", "GGY"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  // Only the islands are a region; the country line ("Guernsey") must not be
  // grabbed into state.
  countyPattern: "(?:Alderney|Sark|Herm)",

  // UK-format postcode with the fixed Guernsey area (one OR two outward digits).
  postalPattern: "(?<postal_code>GY\\d{1,2}\\s*\\d[A-Za-z]{2})",
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, -3)} ${s.slice(-3)}`;
  },
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // Pure building nouns only -- disjoint from TYPES (no Court/Place).
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

export default ggConfig;
