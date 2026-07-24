import type { EuCountryConfig } from "../_eu/types";

/**
 * Cayman Islands (KY) address configuration. British-convention addressing:
 * house number first, street name + trailing type, then a district ("George
 * Town"), the island as the routing region ("Grand Cayman"), and the postcode
 * LAST (`KY[1-3]-NNNN`, introduced 2006). Real-world Cayman data is dominated by
 * corporate registered-agent addresses that lead with a named building
 * ("Ugland House, South Church Street, George Town, Grand Cayman, KY1-1104")
 * and/or a PO box, so `buildingKeywords` and PO-box handling carry most of the
 * weight. The island name is captured into `state`.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Drive", "Way", "Close", "Lane", "Court",
  "Square", "Highway", "Plaza", "Place", "Bay", "Crescent", "Terrace", "Rd", "Ave", "Dr", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  drive: "DR", dr: "DR", way: "WAY", close: "CL", lane: "LN", court: "CT",
  square: "SQ", highway: "HWY", hwy: "HWY", plaza: "PLZ", place: "PL",
  crescent: "CRES", terrace: "TER",
};

export const kyConfig: EuCountryConfig = {
  code: "ky",
  country: "KY",
  // NB: no bare "Cayman" -- it would be consumed as a country token out of the
  // island name "Grand Cayman", truncating the city to "Grand".
  countryNames: ["Cayman Islands", "KY", "CYM"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  countyPattern: "(?!x)x", // no county/state field in these jurisdictions
  // The island ("Grand Cayman") functions as the post town: when a district
  // (George Town) is the city, the island trails it and is dropped, not emitted.
  citySuffixPattern: "[,\\s]+(?:Grand\\s+Cayman|Cayman\\s+Brac|Little\\s+Cayman)",
  // Only true developments are dropped. "Camana Bay" / "Seven Mile Beach" are
  // routing cities in their own right and must NOT be listed here.
  areaNames: ["Cricket Square", "Windward 3"],

  postalPattern: "(?<postal_code>KY[1-3]-\\d{4})",
  postalFormat: (raw: string) => raw.toUpperCase().replace(/\s+/g, ""),
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // Pure building nouns only -- disjoint from TYPES (no Court/Square/Place).
  buildingKeywords: [
    "House", "Chambers", "Building", "Centre", "Center", "Hall", "Yard",
    "Pavilion", "Tower", "Towers", "Park",
  ],
  // Court/Place/Square double as street types (Harbour Place, Landmark Square):
  // a building only when a house number follows.
  buildingTypeKeywords: ["Court", "Place", "Square"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>PO\\s?Box|P\\.O\\.\\s?Box|Floor|Suite|Unit|Apartment|Apt\\.?|Office|Room)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    floor: "Floor", suite: "Suite", unit: "Unit", apartment: "Apartment",
    apt: "Apt", office: "Office", room: "Room",
  },

  poBoxNames: ["PO Box", "P.O. Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: { "po box": "PO Box", "p.o. box": "PO Box", "p o box": "PO Box" },
};

export default kyConfig;
