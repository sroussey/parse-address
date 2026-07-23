import type { EuCountryConfig } from "../_eu/types";

/**
 * Bermuda (BM) address configuration. British convention: house number first,
 * street name + trailing type, the parish (or the City of Hamilton) as the
 * locality, and the postcode LAST written with NO comma before it
 * ("12 Church Street, Hamilton HM 11"). The postcode is two letters + space +
 * two chars; a street postcode ends in digits ("HM 11", "FL 07"), a PO-box
 * postcode ends in letters ("HM FX", "DV BX"). Corporate registered offices
 * lead with a named building ("Clarendon House, 2 Church Street, Hamilton
 * HM 11"), so `buildingKeywords` is enabled.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close", "Hill", "Way", "Court",
  "Crescent", "Terrace", "Boulevard", "Place", "Rd", "Ave", "Dr",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  lane: "LN", drive: "DR", dr: "DR", close: "CL", hill: "HL", way: "WAY",
  court: "CT", crescent: "CRES", terrace: "TER", boulevard: "BLVD", place: "PL",
};

export const bmConfig: EuCountryConfig = {
  code: "bm",
  country: "BM",
  countryNames: ["Bermuda", "BM", "BMU"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Two letters + optional space + two alphanumerics ("HM 11", "FL07", "DV BX").
  postalPattern: "(?<postal_code>[A-Za-z]{2}\\s*[A-Za-z0-9]{2})",
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, 2)} ${s.slice(2)}`;
  },
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",
  // Bermuda PO boxes carry a parish-letter prefix ("PO Box HM 1561").
  poBoxNumberPattern: "[A-Za-z]{2}\\s*\\d+",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // Pure building nouns (never a street type). "Mall" is a building word here.
  buildingKeywords: [
    "House", "Building", "Hall", "Chambers", "Centre", "Center", "Tower",
    "Towers", "Mall",
  ],
  // Court/Place double as street types: a building only when a number follows.
  buildingTypeKeywords: ["Court", "Place"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>PO\\s?Box|P\\.O\\.\\s?Box|Floor|Suite|Unit|Apartment|Apt\\.?|Flat|Office|Room)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    floor: "Floor", suite: "Suite", unit: "Unit", apartment: "Apartment",
    apt: "Apt", flat: "Flat", office: "Office", room: "Room",
  },

  poBoxNames: ["PO Box", "P.O. Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: { "po box": "PO Box", "p.o. box": "PO Box", "p o box": "PO Box" },
};

export default bmConfig;
