import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Somalia (SO) address configuration.
 *
 * Order: house/building NUMBER first (when present), then the street name +
 *        trailing English type ("Maka Al Mukarama Road, Mogadishu") — GB/KE-style
 *        number-first, suffix type. Numbers are usually ABSENT; the type is
 *        optional (many roads are bare: "Corso Somalia").
 * Type: trailing English suffix (Road, Street, Avenue, ...). Somali "Jidka" /
 *        "Wadada" road words are rare in international addressing; English is used.
 * Locality: a DISTRICT / area (Hodan, Wadajir, Hamar Weyne, Waberi, ...) commonly
 *        sits between the street and the routing city. As in KE/TZ the comma chain
 *        is kept together and the leading district(s) dropped in postNormalize,
 *        keeping the last locality (the city).
 * Postcode: Somalia has NO operational postcode system — a never-matching sentinel
 *        keeps the slot inert so no code is ever emitted.
 * Region (-> state): the 18 official regions (Banaadir, Bari, Bay, Mudug, ...) are
 *        written after the city and captured to `state`. The region list is kept
 *        DISJOINT from the routing cities (Banaadir vs Mogadishu, Bay vs Baidoa,
 *        Mudug vs Galkayo, ...) so the restricted county slot never eats a city.
 * PO Box: the DOMINANT postal form ("P.O. Box 1159, Mogadishu"); the box replaces
 *        the thoroughfare.
 *
 * Sources: Somali Postal Service (Somali Post); UPU S42 SO template & postcode
 * note (no operational code); Smarty / GeoPostcodes SO address guides. See
 * research-so.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Close", "Crescent", "Boulevard", "Drive",
  "Lane", "Way", "Court", "Place", "Terrace", "Circle", "Ring", "Loop",
  "Rise", "Grove", "Row", "Park", "Gardens", "Walk", "Hill", "Highway",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cl", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
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
};

// The 18 official regions. Each name is DISTINCT from every routing city we
// recognise (the region capitals — Mogadishu, Baidoa, Galkayo, Bosaso, Garowe,
// Burao, Hargeisa — carry names unlike their region), so recognising the region
// in the restricted county slot cannot swallow the city. Two-word names escape
// their space as \s+ and are ordered longest-first.
const REGIONS = [
  "Awdal", "Bakool", "Banaadir", "Banadir", "Bari", "Bay", "Galguduud",
  "Gedo", "Hiiraan", "Hiran", "Middle Juba", "Lower Juba", "Jubbada Dhexe",
  "Jubbada Hoose", "Mudug", "Nugaal", "Nugal", "Sanaag", "Middle Shabelle",
  "Lower Shabelle", "Shabeellaha Dhexe", "Shabeellaha Hoose", "Sool",
  "Togdheer", "Woqooyi Galbeed",
];

export const soConfig: EuCountryConfig = {
  code: "so",
  country: "SO",
  countryNames: ["Somalia", "Federal Republic of Somalia", "SOM", "SO"],

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

  // A leading building name ("Global Tower, Maka Al Mukarama Road, Mogadishu").
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

export default soConfig;
