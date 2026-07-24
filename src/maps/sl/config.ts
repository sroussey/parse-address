import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Sierra Leone (SL) address configuration.
 *
 * Order: house NUMBER first, then street name + trailing English type
 *        ("12 Siaka Stevens Street") — GB-style number-first, suffix type.
 *        English is the official language.
 * Type: trailing English suffix (Street, Road, Avenue, Drive, ...) or null.
 * Locality: a Freetown neighbourhood (Aberdeen, Lumley, Congo Cross, Murray
 *        Town, ...) may sit between the street and the city; the comma chain is
 *        kept together and the leading area(s) dropped in postNormalize.
 * Postcode: NONE. Sierra Leone has never operated a postal-code system (Sierra
 *        Leone Postal Services, SALPOST; UPU S42 SL template has no postcode
 *        field). Never-match sentinel; the after-city grammar supplies "..., City".
 * Region (-> state): the provinces + Western Area (Northern, Southern, Eastern,
 *        Western Area) may follow the city; only the explicit province/area
 *        forms are recognised so a bare city is never eaten.
 * PO Box / Private Mail Bag: DOMINANT ("P.O. Box 1234, Freetown").
 *
 * Sources: SALPOST; UPU S42 SL template; Smarty / PostGrid SL guides (postcodes
 * not used). See research-sl.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Drive", "Close", "Crescent", "Boulevard",
  "Highway", "Lane", "Way", "Terrace", "Circle", "Walk", "Row", "Rise",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  drive: "DR", dr: "DR",
  close: "CL",
  crescent: "CRES", cres: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  highway: "HWY", hwy: "HWY",
  lane: "LN",
  way: "WAY",
  terrace: "TER",
  circle: "CIR",
  walk: "WLK",
  row: "ROW",
  rise: "RISE",
};

// Provinces + Western Area. Explicit forms + the unambiguous "Western Area".
const REGION_ALT = [
  "Western\\s+Area\\s+Urban",
  "Western\\s+Area\\s+Rural",
  "Western\\s+Area",
  "Northern\\s+Province",
  "Southern\\s+Province",
  "Eastern\\s+Province",
  "North\\s+West\\s+Province",
  "Northern",
  "Southern",
  "Eastern",
]
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {
  "western area urban": "Western Area",
  "western area rural": "Western Area",
  "western area": "Western Area",
  "northern province": "Northern",
  "southern province": "Southern",
  "eastern province": "Eastern",
  "north west province": "North West",
  northern: "Northern",
  southern: "Southern",
  eastern: "Eastern",
};

export const slConfig: EuCountryConfig = {
  code: "sl",
  country: "SL",
  countryNames: ["Sierra Leone", "Republic of Sierra Leone", "SLE", "SL"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcode anywhere in Sierra Leone -> never-match sentinel.
  postalPattern: "(?<postal_code>(?!x)x)",

  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+city chain together; drop leading area(s) in postNormalize.
  cityAllowsCommas: true,
  countyPattern: `(?:${REGION_ALT})`,
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
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Private Mail Bag", "PMB", "Post Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "private mail bag": "PMB", pmb: "PMB",
    "post box": "PO Box",
  },

  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default slConfig;
