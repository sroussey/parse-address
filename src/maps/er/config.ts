import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Eritrea (ER) address configuration.
 *
 * Order: house/building NUMBER first (when present), then the street name +
 *        trailing English type ("Harnet Avenue, Asmara") — GB/KE-style
 *        number-first, suffix type. Many roads are type-less (bare Italian-era
 *        names); the type is optional.
 * Type: trailing English suffix (Avenue, Street, Road, ...). Asmara's grid keeps
 *        strong Italian influence, but international addressing is written in
 *        English/Latin; native Tigrinya script is OUT OF SCOPE.
 * Locality: a DISTRICT / area commonly sits between the street and the routing
 *        city. As in KE/TZ the comma chain is kept together and the leading
 *        district(s) dropped in postNormalize, keeping the last locality (the city).
 * Postcode: Eritrea has NO operational postcode system — a never-matching sentinel
 *        keeps the slot inert so no code is ever emitted.
 * Region (-> state): the six regions ("zoba": Maekel, Anseba, Debub, Gash-Barka,
 *        Northern Red Sea, Southern Red Sea) are written after the city and
 *        captured to `state`. The region list is kept DISJOINT from the routing
 *        cities (Maekel vs Asmara, Anseba vs Keren, ...), so the restricted county
 *        slot never eats a city.
 * PO Box: the DOMINANT postal form ("P.O. Box 254, Asmara"); the box replaces the
 *        thoroughfare.
 *
 * Sources: Eritrean Postal Service; UPU S42 ER template & postcode note (no
 * operational code); Smarty / GeoPostcodes ER address guides. See research-er.md.
 */

const TYPES = [
  "Avenue", "Street", "Road", "Close", "Crescent", "Boulevard", "Drive",
  "Lane", "Way", "Court", "Place", "Terrace", "Circle", "Ring", "Loop",
  "Rise", "Grove", "Row", "Park", "Gardens", "Walk", "Hill", "Highway",
  "Square",
  // abbreviations
  "Ave", "Av", "St", "Rd", "Dr", "Cl", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  avenue: "AVE", ave: "AVE", av: "AVE",
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  close: "CL", cl: "CL",
  crescent: "CRES", cres: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  drive: "DR", dr: "DR",
  lane: "LN",
  way: "WAY",
  court: "CT",
  place: "PL",
  terrace: "TER",
  circle: "CIR",
  ring: "RING",
  loop: "LOOP",
  rise: "RISE",
  grove: "GR",
  row: "ROW",
  park: "PARK",
  gardens: "GDNS",
  walk: "WLK",
  hill: "HL",
  highway: "HWY", hwy: "HWY",
  square: "SQ",
};

// The six regions (zobas). Each name is DISTINCT from every routing city we
// recognise (Maekel vs Asmara, Anseba vs Keren, Gash-Barka vs Barentu, Northern
// Red Sea vs Massawa, ...), so recognising the region in the restricted county
// slot cannot swallow the city. Two-word names escape their space as \s+.
const REGIONS = [
  "Maekel", "Anseba", "Debub", "Gash-Barka", "Gash Barka",
  "Northern Red Sea", "Southern Red Sea",
  "Semenawi Keyih Bahri", "Debubawi Keyih Bahri",
];

export const erConfig: EuCountryConfig = {
  code: "er",
  country: "ER",
  countryNames: ["Eritrea", "State of Eritrea", "ERI", "ER"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No operational postcode: a never-matching sentinel keeps the slot inert.
  postalPattern: "(?<postal_code>(?!x)x)",

  // number FIRST, optional "No."/"#" lead-in, optional range/subdivision, optional
  // glued letter suffix.
  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the district+city chain together; drop leading district(s) in
  // postNormalize. Only a non-colliding region name may land in the state slot.
  cityAllowsCommas: true,
  countyPattern: `(?:${REGIONS.map((r) => r.replace(/ /g, "\\s+")).join("|")})`,

  // Flat / Apartment / House / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("Nakfa House, Harnet Avenue, Asmara").
  buildingKeywords: [
    "Tower", "Towers", "House", "Centre", "Center", "Plaza", "Building",
    "Mall", "Complex", "Arcade",
  ],

  // PO Box is dominant.
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Post Box", "Private Bag"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "post box": "PO Box", "private bag": "Private Bag",
  },

  // Collapse the "district, city" chain to the routing city + dropped district(s).
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default erConfig;
