import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Anguilla (AI) address configuration.
 *
 * UK-derived convention: house NUMBER first, street name + a TRAILING type
 * ("12 Market Street"). The type is echoed verbatim (incl. Rd/Ave/Dr/Cres).
 * Many small-island addresses have no house number, so the number is optional.
 *
 * Postcode: Single national code (AI-2640); OPTIONAL (the whole place tail is).
 *
 * State: the parish/island is the last comma-delimited segment and maps to
 * `state`; the county is restricted to the real region list so a trailing
 * country name never lands in `state`. PO boxes are very common.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close",
  "Court", "Place", "Crescent", "Terrace", "Boulevard", "Way",
  "Gardens", "Grove", "Walk", "Heights", "Park", "Circle",
  "Circus", "Row", "Hill", "Gate", "Path", "Highway",
  "Alley", "Rise", "Bypass", "Mall", "Square", "Extension",
  "Rd", "Ave", "Av", "Dr", "St", "Cres",
  "Blvd", "Hwy", "Pl", "Cl", "Ln", "Gdns",
  "Ext",
];

const TYPE_SHORT: Record<string, string> = {
  "street": "ST",
  "st": "ST",
  "road": "RD",
  "rd": "RD",
  "avenue": "AVE",
  "ave": "AVE",
  "av": "AVE",
  "lane": "LN",
  "ln": "LN",
  "drive": "DR",
  "dr": "DR",
  "close": "CL",
  "cl": "CL",
  "court": "CT",
  "place": "PL",
  "pl": "PL",
  "crescent": "CRES",
  "cres": "CRES",
  "terrace": "TER",
  "boulevard": "BLVD",
  "blvd": "BLVD",
  "way": "WAY",
  "gardens": "GDNS",
  "gdns": "GDNS",
  "grove": "GR",
  "walk": "WLK",
  "heights": "HTS",
  "park": "PK",
  "circle": "CIR",
  "row": "ROW",
  "hill": "HL",
  "gate": "GATE",
  "path": "PATH",
  "highway": "HWY",
  "hwy": "HWY",
  "alley": "ALY",
  "rise": "RISE",
  "mall": "MALL",
  "square": "SQ",
  "extension": "EXT",
  "ext": "EXT",
};

export const aiConfig: EuCountryConfig = {
  code: "ai",
  country: "AI",
  countryNames: ["Anguilla", "AIA", "AI"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // County restricted to the real region list (keeps the country name out).
  countyPattern: "(?!x)x",

  postalPattern: "(?<postal_code>AI-2640)",
  // Number first: plain, range ("10-12"), optional glued letter ("12A"), "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

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

export default aiConfig;
