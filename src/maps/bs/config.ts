import type { EuCountryConfig } from "../_eu/types";

/**
 * The Bahamas (BS) address configuration.
 *
 * British-derived convention: house NUMBER first (often written "#12"), street
 * name + TRAILING type ("West Bay Street"). Type echoed verbatim.
 *
 * Postcode: The Bahamas has NO postcode system; the place tail is the
 * settlement/city and then the ISLAND, with no numeric code. So `postalPattern`
 * is a never-match sentinel and the layout is after-city.
 *
 * State: the ISLAND ("New Providence", "Grand Bahama", "Abaco", "Eleuthera",
 * ...) is the last comma segment and maps to `state`. County is restricted to
 * the island list so the country name ("Bahamas") never lands in `state` and an
 * ordinary district (Palmdale, Oakes Field) does not masquerade as a region.
 *
 * PO Box: LETTER-PREFIXED -- "P.O. Box N-4818", "P.O. Box SS-6301",
 * "P.O. Box EE-15071". The one/two-letter prefix (a routing zone) is kept as
 * part of the box number.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Drive", "Lane", "Highway", "Boulevard", "Court",
  "Close", "Terrace", "Way", "Circle", "Crescent", "Hill", "Gardens", "Row",
  "Corner", "Heights", "Estates", "Park", "Walk", "Alley",
  // abbreviations (kept verbatim)
  "Rd", "Ave", "Av", "Dr", "St", "Hwy", "Blvd", "Cres", "Ln",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  av: "AVE", drive: "DR", dr: "DR", lane: "LN", ln: "LN", highway: "HWY",
  hwy: "HWY", boulevard: "BLVD", blvd: "BLVD", court: "CT", close: "CL",
  terrace: "TER", way: "WAY", circle: "CIR", crescent: "CRES", cres: "CRES",
  hill: "HL", gardens: "GDNS", row: "ROW", corner: "COR", heights: "HTS",
  park: "PK", walk: "WLK",
};

// The inhabited islands / districts, longest-first (spaces -> \s+).
const ISLANDS = [
  "New Providence", "Grand Bahama", "Great Abaco", "Little Abaco", "Abaco",
  "Great Exuma", "Exuma", "North Andros", "South Andros", "Andros",
  "North Eleuthera", "Eleuthera", "Harbour Island", "Spanish Wells",
  "Cat Island", "Long Island", "Ragged Island", "San Salvador", "Rum Cay",
  "Great Inagua", "Inagua", "Mayaguana", "Acklins", "Crooked Island",
  "Berry Islands", "Bimini", "Grand Cay",
];
const ISLAND_ALT = ISLANDS.map((s) => s.replace(/ /g, "\\s+"))
  .sort((a, b) => b.length - a.length)
  .join("|");

export const bsConfig: EuCountryConfig = {
  code: "bs",
  country: "BS",
  countryNames: ["The Bahamas", "Bahamas", "BHS", "BS"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // County restricted to the island list (keeps "Bahamas" / districts out).
  countyPattern: `(?:${ISLAND_ALT})`,

  // No postcode system: a never-match sentinel so the place tail is city+island.
  postalPattern: "(?<postal_code>(?!x)x)",
  // Number first, often "#12"; plain, range, optional glued letter.
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",
  // Letter-prefixed box ("N-4818"); the plain-numeric form is tolerated too.
  poBoxNumberPattern: "(?:[A-Za-z]{1,2}\\s*-?\\s*)?\\d+",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Unit|Suite|Shop|Lot|Room|Floor|Block)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", flat: "Flat", unit: "Unit",
    suite: "Suite", shop: "Shop", lot: "Lot", room: "Room", floor: "Floor",
    block: "Block",
  },

  poBoxNames: ["P.O. Box", "PO Box", "PO BOX", "P O Box", "P. O. Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p o box": "PO Box",
    "p. o. box": "PO Box",
  },
};

export default bsConfig;
