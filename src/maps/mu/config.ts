import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Mauritius (MU) address configuration.
 *
 * Order: house NUMBER first (often omitted — many roads use only a name), then
 *        the street name + trailing English type ("25 Royal Road") — GB-style
 *        number-first, suffix type. English is the language of administration;
 *        "Royal Road" is the near-ubiquitous main road in every village.
 * Type: trailing English suffix (Road, Street, Avenue, Lane, Close, Crescent,
 *        Drive, ...). Type may be null.
 * Locality: a VILLAGE or TOWN. Usually a single locality; occasionally an area
 *        + town chain, handled with the ZA/IN drop trick.
 * Postcode: 5-character, introduced 2014 — five digits, OR a letter (A =
 *        Agaléga, R = Rodrigues) + four digits for the outer islands. Written
 *        AFTER the village/town. VERY OFTEN OMITTED (low adoption); optional.
 * Region: the 9 districts are essentially never written in an address; no
 *        `state` is modelled (county slot disabled).
 * PO Box: common ("P.O. Box 123, Port Louis").
 *
 * Sources: Mauritius Post; Postal codes in Mauritius (Wikipedia); UPU S42 MU
 * template (MUS.pdf); Smarty / PostGrid MU guides. See research-mu.md.
 */

const TYPES = [
  "Road", "Street", "Avenue", "Lane", "Close", "Crescent", "Drive",
  "Boulevard", "Way", "Court", "Place", "Terrace", "Highway", "Motorway",
  "Circle", "Rise", "Walk", "Row", "Square",
  // abbreviations
  "Rd", "St", "Ave", "Av", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE", av: "AVE",
  lane: "LN",
  close: "CL",
  crescent: "CRES", cres: "CRES",
  drive: "DR", dr: "DR",
  boulevard: "BLVD", blvd: "BLVD",
  way: "WAY",
  court: "CT",
  place: "PL",
  terrace: "TER",
  highway: "HWY", hwy: "HWY",
  motorway: "MWY",
  circle: "CIR",
  rise: "RISE",
  walk: "WLK",
  row: "ROW",
  square: "SQ",
};

export const muConfig: EuCountryConfig = {
  code: "mu",
  country: "MU",
  countryNames: ["Mauritius", "Republic of Mauritius", "Maurice", "MUS", "MU"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit code, OR a letter (A/R) + 4 digits for the outer islands. Optional.
  postalPattern: "(?<postal_code>\\d{5}|[AaRr]\\d{4})",
  postalFormat: (raw: string) => raw.toUpperCase().replace(/\s+/g, ""),

  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep any area+town chain together; drop leading area(s) in postNormalize.
  // No address-level region, so the county slot is disabled (never-match) to
  // stop the default county pattern from swallowing the routing town.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  // Flat / Apartment / House / Morcellement lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("Chancery House, Lislet Geoffroy Street, ...").
  buildingKeywords: [
    "House", "Tower", "Towers", "Centre", "Center", "Court", "Building",
    "Plaza", "Mall", "Complex",
  ],

  poBoxNames: ["P.O. Box", "PO Box", "P O Box", "Post Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p o box": "PO Box",
    "post box": "PO Box",
  },

  // Collapse an "area, town" chain to the routing town + dropped area(s).
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default muConfig;
