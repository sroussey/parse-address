import type { EuCountryConfig } from "../_eu/types";

/**
 * Trinidad and Tobago (TT) address configuration.
 *
 * British-derived convention: house NUMBER first, street name + TRAILING type
 * ("12 Frederick Street"). Type echoed verbatim (incl. Rd/Ave/Dr/Blvd/Cres).
 *
 * Postcode: T&T normally has NO postcode. TTPost introduced a six-digit code in
 * 2012 (e.g. "Port of Spain 120110"), but it is rarely written; it is accepted
 * (LAST, after the city) but seldom seen.
 *
 * Region/city: the routing town/city is the last comma segment ("Port of
 * Spain", "San Fernando"). The one region that IS routinely written is the
 * island -- Tobago -- so `state` is restricted to "Tobago" ("Scarborough,
 * Tobago"); a district that precedes the city (Woodbrook, Curepe) is a dependent
 * locality that the shared grammar does not model (marked __skip).
 *
 * PO Box: "P.O. Box 1234" -- plain numeric.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close", "Court", "Place",
  "Crescent", "Terrace", "Boulevard", "Way", "Gardens", "Grove", "Walk",
  "Square", "Heights", "Park", "Circular", "Circle", "Trace", "Branch",
  "Junction",
  "Highway", "Extension", "Hill", "Gate", "Mall", "Village",
  // abbreviations (kept verbatim)
  "Rd", "Ave", "Av", "Dr", "St", "Cres", "Blvd", "Hwy", "Pl", "Cl", "Ln",
  "Ext", "Ext.",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  av: "AVE", lane: "LN", ln: "LN", drive: "DR", dr: "DR", close: "CL", cl: "CL",
  court: "CT", place: "PL", pl: "PL", crescent: "CRES", cres: "CRES",
  terrace: "TER", boulevard: "BLVD", blvd: "BLVD", way: "WAY", gardens: "GDNS",
  grove: "GR", walk: "WLK", square: "SQ", heights: "HTS", park: "PK",
  trace: "TRCE",
  highway: "HWY", hwy: "HWY", hill: "HL", extension: "EXT", ext: "EXT",
  circular: "CIR", circle: "CIR", mall: "MALL",
};

export const ttConfig: EuCountryConfig = {
  code: "tt",
  country: "TT",
  countryNames: [
    "Trinidad and Tobago", "Trinidad & Tobago", "Trinidad", "TTO", "TT",
  ],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Only the island (Tobago) is written as a region; keeps the country name and
  // ordinary districts out of `state`.
  countyPattern: "(?:Tobago)",

  // Rare TTPost 6-digit code, LAST (after the city). Optional in practice.
  postalPattern: "(?<postal_code>\\d{6})",
  // Number first: plain, range, optional glued letter, "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Unit|Suite|Shop|Lot|Room|Floor|Block|LP)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", flat: "Flat", unit: "Unit",
    suite: "Suite", shop: "Shop", lot: "Lot", room: "Room", floor: "Floor",
    block: "Block", lp: "LP",
  },

  poBoxNames: ["P.O. Box", "PO Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p o box": "PO Box",
  },
};

export default ttConfig;
