import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Lesotho (LS) address configuration.
 *
 * Order: house NUMBER first, then street name + trailing English type
 *        ("12 Kingsway Road") — GB-style number-first, suffix type. English is a
 *        co-official language and the language of administration.
 * Type: trailing English suffix (Road, Street, Avenue, Drive, ...) or null.
 * Locality: a suburb / area (Maseru West, Ha Thetsane, Old Europa, ...) may sit
 *        between the street and the town; the comma chain is kept together and
 *        the leading area(s) dropped in postNormalize.
 * Postcode: 3-digit numeric, written AFTER the town ("Maseru 100"), and VERY
 *        frequently OMITTED. Optional.
 * Region: the 10 districts (Maseru, Berea, Leribe, ...) duplicate their capital
 *        town names and are essentially never written on mail, so no `state` is
 *        modelled (county slot disabled to avoid eating the routing town).
 * PO Box / Private Bag: DOMINANT. "P.O. Box 524, Maseru 100",
 *        "Private Bag A1, Maseru".
 *
 * Sources: Lesotho Postal Services; UPU S42 LS template; Smarty / PostGrid LS
 * guides. See research-ls.md.
 */

const TYPES = [
  "Road", "Street", "Avenue", "Drive", "Close", "Crescent", "Boulevard",
  "Highway", "Lane", "Way", "Terrace", "Circle", "Walk", "Row", "Rise",
  // abbreviations
  "Rd", "St", "Ave", "Av", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
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

export const lsConfig: EuCountryConfig = {
  code: "ls",
  country: "LS",
  countryNames: ["Lesotho", "Kingdom of Lesotho", "LSO", "LS"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 3-digit numeric postcode, after the town; optional (frequently omitted).
  postalPattern: "(?<postal_code>\\d{3})",

  houseNumberPattern:
    "(?:Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+town chain together; drop leading area(s) in postNormalize.
  // Districts duplicate town names, so the county slot is disabled to avoid it
  // swallowing the routing town.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

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

  // The "Plot" lead-in is consumed but not emitted, so it is exempted from the
  // token-preservation guard (as ZM does for "Stand"/"Plot").
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed, ["Plot"]),
};

export default lsConfig;
