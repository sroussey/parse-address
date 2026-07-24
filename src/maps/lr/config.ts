import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Liberia (LR) address configuration.
 *
 * Order: house NUMBER first, then street name + trailing English type
 *        ("20 Broad Street") — GB/US-style number-first, suffix type. English is
 *        the official language. Monrovia has numbered cross-streets written as
 *        the street name itself ("12th Street, Sinkor").
 * Type: trailing English suffix (Street, Boulevard, Road, Avenue, Drive, ...).
 * Locality: a district / community (Sinkor, Congo Town, Mamba Point, ...) sits
 *        between the street and the city; the comma chain is kept together and
 *        the leading area(s) dropped in postNormalize.
 * Postcode: 4-digit numeric, written AFTER the city, and VERY frequently OMITTED
 *        (low adoption; traditional Monrovia mail uses a zone number "Monrovia
 *        10" instead, which is not modelled). Optional.
 * County (-> state): the 15 counties (Montserrado, Nimba, Bong, ...) may follow
 *        the city; captured to `state`. County names do not duplicate the major
 *        city names (Monrovia is in Montserrado), so a restricted county list is
 *        recognised.
 * PO Box: very common ("P.O. Box 1234, Monrovia").
 *
 * Sources: Liberia Post Office; UPU S42 LR template; Smarty / PostGrid LR
 * guides. See research-lr.md.
 */

const TYPES = [
  "Street", "Boulevard", "Road", "Avenue", "Drive", "Close", "Crescent",
  "Lane", "Way", "Highway", "Terrace", "Circle", "Walk", "Row",
  // abbreviations
  "St", "Blvd", "Rd", "Ave", "Av", "Dr", "Cres", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  boulevard: "BLVD", blvd: "BLVD",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  drive: "DR", dr: "DR",
  close: "CL",
  crescent: "CRES", cres: "CRES",
  lane: "LN",
  way: "WAY",
  highway: "HWY", hwy: "HWY",
  terrace: "TER",
  circle: "CIR",
  walk: "WLK",
  row: "ROW",
};

// 15 counties -> canonical county name. None duplicates a major city name.
const COUNTIES = [
  "Montserrado", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh", "Grand Kru",
  "River Cess", "River Gee", "Nimba", "Bong", "Lofa", "Margibi", "Maryland",
  "Sinoe", "Bomi", "Gbarpolu",
];
const COUNTY_ALT = COUNTIES.map((c) => c.replace(/ /g, "\\s+"))
  .sort((a, b) => b.length - a.length)
  .join("|");
const REGION_MAP: Record<string, string> = {};
for (const c of COUNTIES) REGION_MAP[c.toLowerCase()] = c;

export const lrConfig: EuCountryConfig = {
  code: "lr",
  country: "LR",
  countryNames: ["Liberia", "Republic of Liberia", "LBR", "LR"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 4-digit numeric postcode, after the city; optional (frequently omitted).
  postalPattern: "(?<postal_code>\\d{4})",

  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the community+city chain together; drop leading area(s) in postNormalize.
  cityAllowsCommas: true,
  // Only a real county may land in the state slot.
  countyPattern: `(?:${COUNTY_ALT})`,
  regionMap: REGION_MAP,

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit|Office)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit", office: "Office",
  },

  buildingKeywords: [
    "House", "Building", "Centre", "Center", "Plaza", "Towers", "Tower",
    "Complex", "Chambers", "Court", "Mall",
  ],

  poBoxNumberPattern: "[A-Za-z]{0,3}\\s*\\d+",
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Private Bag", "Post Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "private bag": "Private Bag", "post box": "PO Box",
  },

  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default lrConfig;
