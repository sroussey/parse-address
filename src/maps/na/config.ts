import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Namibia (NA) address configuration.
 *
 * Order: the house/erf NUMBER first, then the street name + trailing English
 *        type ("71 Robert Mugabe Avenue") — GB-style number-first, suffix type.
 *        English is the sole official language.
 * "Erf": the cadastral erf (plot) number is a common physical identifier,
 *        written "Erf NNNN" (e.g. "Erf 8225, Nguni Street"). The "Erf" marker is
 *        KEPT inside `number` so no token is lost. A leading suburb/industrial
 *        area before the town lands in `street` (untyped) when no named street
 *        is present — lossless.
 * Type: trailing English suffix (Avenue, Street, Road, Drive, ...) or null.
 * Postcode: a 5-digit code EXISTS — NamPost introduced it in December 2018 after
 *        28 years with none (first two digits = region, third = 0, last two =
 *        post office; e.g. Windhoek 10005, Swakopmund 13001). Adoption is still
 *        low and it is FREQUENTLY OMITTED, so it is OPTIONAL and written AFTER
 *        the town ("Windhoek 10001"). Older mail carries no code at all.
 * Region: the 14 regions are not part of the mailing address; no `state`
 *        (county slot disabled).
 * PO Box / Private Bag: DOMINANT — most Namibian mail goes to a box
 *        ("P.O. Box 24, Windhoek", "Private Bag 13289, Windhoek").
 *
 * Sources: NamPost; "Postal codes in Namibia" (Wikipedia — Dec 2018 rollout);
 * UPU S42 NA template; Smarty / PostGrid NA guides. See research-na.md.
 */

const TYPES = [
  "Avenue", "Street", "Road", "Drive", "Lane", "Close", "Crescent",
  "Boulevard", "Way", "Terrace", "Circle", "Rise", "Weg", "Strasse",
  "Straat", "Walk", "Row", "Highway",
  // abbreviations
  "Ave", "Av", "St", "Rd", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  avenue: "AVE", ave: "AVE", av: "AVE",
  street: "ST", st: "ST", straat: "ST",
  road: "RD", rd: "RD", weg: "RD",
  drive: "DR", dr: "DR",
  lane: "LN",
  close: "CL",
  crescent: "CRES", cres: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  way: "WAY",
  terrace: "TER",
  circle: "CIR",
  rise: "RISE",
  strasse: "ST",
  walk: "WLK",
  row: "ROW",
  highway: "HWY", hwy: "HWY",
};

export const naConfig: EuCountryConfig = {
  code: "na",
  country: "NA",
  countryNames: ["Namibia", "NAM", "NA"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Optional 5-digit code (NamPost, 2018); often omitted. The after-city grammar
  // uses its postcode-absent branch when no code is written.
  postalPattern: "(?<postal_code>\\d{5})",

  // "Erf" marker kept inside the number; then an integer (or range) + optional
  // glued letter suffix.
  houseNumberPattern:
    "(?<number>Erf\\s+\\d+|\\d+(?:\\s*[-–]\\s*\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep an "area/suburb, town" chain together; drop the leading area(s) in
  // postNormalize. No mailing region -> county slot disabled.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  // Unit / Flat / Shop / Office lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Flat|Apartment|Apt\\.?|Suite|Office|Floor|Room|Block|Shop)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit", flat: "Flat", apartment: "Apartment", apt: "Apt",
    suite: "Suite", office: "Office", floor: "Floor", room: "Room",
    block: "Block", shop: "Shop",
  },

  buildingKeywords: [
    "House", "Building", "Centre", "Center", "Mall", "Plaza", "Towers",
    "Tower", "Chambers", "Court", "Complex",
  ],

  poBoxNumberPattern: "[A-Za-z]{0,3}\\s*\\d+",
  poBoxNames: ["P.O. Box", "P O Box", "PO Box", "Private Bag", "Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "p o box": "PO Box", "po box": "PO Box",
    "private bag": "Private Bag", box: "PO Box",
  },

  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default naConfig;
