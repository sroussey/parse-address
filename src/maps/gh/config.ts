import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Ghana (GH) address configuration.
 *
 * Ghana has TWO addressing systems, both modelled here:
 *
 *  (1) GhanaPostGPS digital address — a national digital address of the shape
 *      "AA-NNN-NNNN" (two letters + 3-digit area + 4-digit unique), e.g.
 *      "GA-183-8164" (Greater Accra) or "AK-039-5028" (Ashanti/Kumasi). The
 *      first letter is the region, the second the district; "GA-183" alone is
 *      the postcode. We capture the whole code as `postal_code`. Because Ghana
 *      writes the code BEFORE the town ("GA-183-8164, Accra"), the country is
 *      configured postcode-first (before-city), and the code is also recognised
 *      when it trails a street ("Kingsway Road, GA-183-8164, Accra").
 *
 *  (2) Descriptive / physical address — "House No. 5, Kingsway Road, Adabraka,
 *      Accra, Greater Accra", number-first with a trailing English type, an area
 *      that is dropped, the town, and the region -> state.
 *
 * Postcode: the GhanaPostGPS code (letters+digits) OR absent (traditional Ghana
 *      had NO postal codes and used PO boxes). Optional.
 * Region (-> state): the 16 regions (Greater Accra, Ashanti, Western, ...),
 *      written after the city, optionally suffixed "Region". Output is a
 *      2-letter code (AA, AH, WP, ...).
 * PO Box: very common; box numbers often carry a 1-3 letter exchange prefix
 *      ("P.O. Box CT 1234", "P. O. Box M 38").
 *
 * KNOWN GAP: a BARE digital code with no town ("GA-183-8164" alone) has no
 * locality for the street/place grammar and parses as a street rather than a
 * postcode; such bare-code samples are marked __skip. Delivered forms carry a
 * town, which parses correctly.
 *
 * Sources: GhanaPostGPS (Ghana Post); Ghana Post GPS (Wikipedia); Regions and
 * District Codes (ghanapostgps.com); Smarty / PostGrid GH guides. See
 * research-gh.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Close", "Crescent", "Boulevard", "Drive",
  "Lane", "Way", "Circle", "Highway", "Court", "Place", "Walk", "Link",
  "Loop", "Ring", "Row", "Park",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  close: "CL",
  crescent: "CRES", cres: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  drive: "DR", dr: "DR",
  lane: "LN",
  way: "WAY",
  circle: "CIR",
  highway: "HWY", hwy: "HWY",
  court: "CT",
  place: "PL",
  walk: "WLK",
  link: "LINK",
  loop: "LOOP",
  ring: "RING",
  row: "ROW",
  park: "PARK",
};

// 16 regions -> ISO 3166-2:GH region code.
const REGION_CODES: Array<[string, string]> = [
  ["Greater Accra", "AA"], ["Western North", "WN"], ["Bono East", "BE"],
  ["North East", "NE"], ["Upper East", "UE"], ["Upper West", "UW"],
  ["Ashanti", "AH"], ["Central", "CP"], ["Eastern", "EP"], ["Northern", "NP"],
  ["Volta", "TV"], ["Western", "WP"], ["Bono", "BO"], ["Ahafo", "AF"],
  ["Oti", "OT"], ["Savannah", "SV"],
];

const REGION_MAP: Record<string, string> = {};
for (const [name, code] of REGION_CODES) {
  REGION_MAP[name.toLowerCase()] = code;
  REGION_MAP[`${name.toLowerCase()} region`] = code;
}

// Alternation: "<Name> Region" (longest) OR bare "<Name>"; longest-first.
const REGION_ALT = [
  ...REGION_CODES.map(([n]) => `${n.replace(/ /g, "\\s+")}\\s+Region`),
  ...REGION_CODES.map(([n]) => n.replace(/ /g, "\\s+")),
]
  .sort((a, b) => b.length - a.length)
  .join("|");

export const ghConfig: EuCountryConfig = {
  code: "gh",
  country: "GH",
  countryNames: ["Ghana", "Republic of Ghana", "GHA", "GH"],

  order: "number-street",
  typePlacement: "suffix",
  // GhanaPostGPS code is written BEFORE the town.
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // GhanaPostGPS digital address: 2 letters, "-", 3-digit area, optional
  // "-", 4-digit unique. "GA-183" (postcode only) and "GA-183-8164" (full).
  postalPattern: "(?<postal_code>[A-Za-z]{2}-\\d{3}(?:-\\d{4})?)",
  postalFormat: (raw: string) => raw.toUpperCase().replace(/\s+/g, ""),

  // number: optional "House No."/"Plot"/"No."/"#" lead-in, a plot/house number
  // that may carry slashes ("F123/4" keeps "123/4"), optional glued letter.
  houseNumberPattern:
    "(?:House\\s+No\\.?\\s*|Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)*)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+city chain together; drop leading area(s) in postNormalize.
  cityAllowsCommas: true,

  // Region after the city -> state.
  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: REGION_MAP,

  // Flat / House / Apartment / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("Ridge Towers, Independence Avenue, Accra").
  buildingKeywords: [
    "Towers", "Tower", "House", "Centre", "Center", "Plaza", "Building",
    "Court", "Mall", "Complex",
  ],

  // Ghana Post boxes: box number often has a 1-3 letter exchange prefix.
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "Private Mail Bag", "PMB", "Post Box"],
  poBoxNumberPattern: "[A-Za-z]{0,3}\\s*\\d+",
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "private mail bag": "PMB", pmb: "PMB", "post box": "PO Box",
  },

  // Collapse the "area, city" chain to the routing city + dropped area(s).
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default ghConfig;
