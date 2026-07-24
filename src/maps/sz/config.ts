import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Eswatini (SZ) address configuration.
 *
 * Order: house NUMBER first, then street name + trailing English type
 *        ("12 Gwamile Street") — GB-style number-first, suffix type. English is
 *        an official language.
 * Type: trailing English suffix (Street, Road, Avenue, Drive, ...) or null.
 * Locality: a suburb may sit between the street and the town; the comma chain is
 *        kept together and the leading area(s) dropped in postNormalize.
 * Postcode: a REGION-letter + 3 digits ("H100" Mbabane, "M200" Manzini,
 *        "L300" Lubombo, "S400" Shiselweni), written AFTER the town
 *        ("Mbabane H100"). Adoption is patchy, so it is OFTEN OMITTED. Optional.
 * Region (-> state): the 4 regions (Hhohho, Manzini, Lubombo, Shiselweni) may
 *        follow the town. "Manzini" duplicates a major city, so only the
 *        explicit "Manzini Region" form is recognised for it; the other three
 *        are recognised bare.
 * PO Box / Private Bag: DOMINANT ("P.O. Box 1234, Mbabane").
 *
 * Sources: Eswatini Posts and Telecommunications (EPTC); UPU S42 SZ template;
 * Smarty / PostGrid SZ guides. See research-sz.md.
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

// 4 regions. "Manzini" needs its explicit "Region" form (duplicates the city);
// the other three are unambiguous bare.
const REGION_ALT = [
  "Hhohho\\s+Region",
  "Manzini\\s+Region",
  "Lubombo\\s+Region",
  "Shiselweni\\s+Region",
  "Hhohho",
  "Lubombo",
  "Shiselweni",
]
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {
  "hhohho region": "Hhohho",
  "manzini region": "Manzini",
  "lubombo region": "Lubombo",
  "shiselweni region": "Shiselweni",
  hhohho: "Hhohho",
  lubombo: "Lubombo",
  shiselweni: "Shiselweni",
};

export const szConfig: EuCountryConfig = {
  code: "sz",
  country: "SZ",
  countryNames: ["Eswatini", "Swaziland", "Kingdom of Eswatini", "SWZ", "SZ"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Region-letter + 3 digits, after the town; optional (often omitted).
  postalPattern: "(?<postal_code>[HMLS]\\d{3})",
  postalFormat: (raw: string) => raw.toUpperCase().replace(/\s+/g, ""),

  houseNumberPattern:
    "(?:Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

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
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Private Bag", "Post Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "private bag": "Private Bag", "post box": "PO Box",
  },

  // Collapse the "area, town" chain; the "Plot" lead-in is consumed but not
  // emitted, so it is exempted from the token-preservation guard.
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed, ["Plot"]),
};

export default szConfig;
