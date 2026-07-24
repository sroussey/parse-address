import type { EuCountryConfig } from "../_eu/types";

/**
 * The Gambia (GM) address configuration.
 *
 * Order: house NUMBER first, then street name + trailing English type
 *        ("12 Kairaba Avenue") — GB-style number-first, suffix type. English is
 *        the official language.
 * Type: trailing English suffix (Avenue, Road, Street, Drive, Highway, ...) or
 *        null (many roads are type-less).
 * Locality: a district / settlement (Fajara, Kololi, Senegambia, Kanifing, ...)
 *        may sit between the street and the routing town; as in KE/ZM the comma
 *        chain is kept together and the leading area(s) dropped in postNormalize.
 * Postcode: NONE. The Gambia has never operated a postal-code system (GAMTEL /
 *        Gambia Post; UPU S42 GM template has no postcode field). Never-match
 *        sentinel; the after-city grammar supplies "..., Town".
 * Region: the divisions (West Coast, Lower River, ...) are essentially never
 *        written on mail; no `state` is modelled (county slot disabled).
 * PO Box / Private Mail Bag: DOMINANT. Most mail goes to a box
 *        ("P.O. Box 3312, Banjul", "Private Mail Bag, Banjul").
 *
 * Sources: Gambia Post (GAMPOST); UPU S42 GM template; Smarty / PostGrid GM
 * guides (postcodes not used). See research-gm.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Drive", "Close", "Crescent", "Boulevard",
  "Highway", "Lane", "Way", "Terrace", "Parade", "Circle", "Walk", "Row",
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
  parade: "PDE",
  circle: "CIR",
  walk: "WLK",
  row: "ROW",
};

export const gmConfig: EuCountryConfig = {
  code: "gm",
  country: "GM",
  countryNames: ["The Gambia", "Gambia", "GMB", "GM"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcode anywhere in The Gambia -> never-match sentinel.
  postalPattern: "(?<postal_code>(?!x)x)",

  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+town chain together; drop leading area(s) in postNormalize.
  // No mailing region, so the county slot is disabled so it cannot eat the town.
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
    "Complex", "Chambers", "Court",
  ],

  poBoxNumberPattern: "[A-Za-z]{0,3}\\s*\\d+",
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Private Mail Bag", "PMB", "Post Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "private mail bag": "PMB", pmb: "PMB",
    "post box": "PO Box",
  },

  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s: string) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },
};

export default gmConfig;
