import type { EuCountryConfig } from "../_eu/types";

/**
 * Malawi (MW) address configuration.
 *
 * Order: house/plot NUMBER first, then street name + trailing English type
 *        ("10 Glyn Jones Road") — GB-style number-first, suffix type. English is
 *        an official language. Lilongwe/Blantyre are laid out in numbered
 *        "Areas" ("Area 47", "Area 3"), which sit where a street would and, with
 *        no street slot of their own, land in `street` (untyped) — lossless.
 * Type: trailing English suffix (Road, Avenue, Street, Drive, ...) or null.
 * Locality: a township / area may sit between the street and the city; the comma
 *        chain is kept together and the leading area(s) dropped in postNormalize.
 * Postcode: NONE. Malawi has never operated a postal-code system (Malawi Posts
 *        Corporation; UPU S42 MW template has no postcode field). Never-match
 *        sentinel; the after-city grammar supplies "..., City".
 * Region: the 3 regions / 28 districts are essentially never written on mail; no
 *        `state` is modelled (county slot disabled so it cannot eat the city).
 * PO Box / Private Bag: DOMINANT. "P.O. Box 30390, Lilongwe",
 *        "Private Bag 1, Zomba".
 *
 * Sources: Malawi Posts Corporation (MPC); UPU S42 MW template; Smarty /
 * PostGrid MW guides (postcodes not used). See research-mw.md.
 */

const TYPES = [
  "Road", "Avenue", "Street", "Drive", "Close", "Crescent", "Boulevard",
  "Highway", "Lane", "Way", "Terrace", "Circle", "Walk", "Row", "Rise",
  // abbreviations
  "Rd", "Ave", "Av", "St", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  street: "ST", st: "ST",
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

export const mwConfig: EuCountryConfig = {
  code: "mw",
  country: "MW",
  countryNames: ["Malawi", "Republic of Malawi", "MWI", "MW"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcode anywhere in Malawi -> never-match sentinel.
  postalPattern: "(?<postal_code>(?!x)x)",

  houseNumberPattern:
    "(?:Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+city chain together; drop leading area(s) in postNormalize.
  // No mailing region, so the county slot is disabled so it cannot eat the city.
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

  // Collapse the "area, city" chain; the "Plot" lead-in is consumed but not
  // emitted, so it is exempted from the token-preservation guard.
  postNormalize: (parsed: Record<string, any>) => {
    const dropped: string[] = ["Plot"];
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s: string) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        for (const p of parts.slice(0, -1)) dropped.push(p);
      }
    }
    parsed.__dropped = dropped;
  },
};

export default mwConfig;
