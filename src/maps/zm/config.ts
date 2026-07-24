import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Zambia (ZM) address configuration.
 *
 * Order: house/stand NUMBER first, then the street name + trailing English type
 *        ("10 Great East Road") — number-first, suffix type. Zambian addresses
 *        commonly lead with a cadastral "Stand No. <n>" or "Plot <n>".
 * Type: trailing English suffix (Road, Street, Avenue, Close, Drive, ...). Many
 *        roads are type-less; the type must be optional.
 * Locality: an AREA / township / suburb (Rhodes Park, Kabulonga, Woodlands,
 *        Northmead, Roma, Olympia, ...) sits between the street and the routing
 *        city. As in KE/ZA the comma chain is kept together and the leading
 *        area(s) are dropped in postNormalize, keeping the last locality (city).
 * Postcode: a 5-digit numeric postcode exists (e.g. Lusaka "10101") but is very
 *        frequently OMITTED. Written AFTER the city (after-city). Optional.
 * Province (-> state): the 10 provinces (Lusaka, Copperbelt, Southern, ...) are
 *        occasionally written. Because several province names duplicate a city
 *        (Lusaka, Central), only the explicit "<Name> Province" form (plus the
 *        unambiguous "Copperbelt") is recognised in the county slot, so a bare
 *        "Area, City" pair is never mis-split with the city taken as the province.
 * PO Box: very common ("P.O. Box 30234, Lusaka"). The box replaces the
 *        thoroughfare.
 *
 * Sources: Zambia Postal Services Corporation (Zampost); UPU S42 ZM template;
 * Smarty / PostGrid / GeoPostcodes ZM address guides. See research-zm.md.
 */

const TYPES = [
  "Road", "Street", "Avenue", "Close", "Crescent", "Boulevard", "Drive",
  "Lane", "Way", "Court", "Place", "Terrace", "Circle", "Ring", "Loop",
  "Rise", "Grove", "Row", "Park", "Gardens", "Walk", "Hill", "Highway",
  "Mews", "Bypass",
  // abbreviations
  "Rd", "St", "Ave", "Av", "Dr", "Cl", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
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
  mews: "MEWS",
  bypass: "BYP",
};

// 10 provinces. Recognised only in the explicit "<Name> Province" form (plus the
// unambiguous single-word "Copperbelt"/"North-Western"), so a bare province name
// that duplicates a city (Lusaka, Central) never eats the routing city.
const PROVINCES = [
  "Lusaka", "Copperbelt", "Southern", "Eastern", "Northern", "Western",
  "Central", "Luapula", "Muchinga", "North-Western", "North Western",
];
const PROVINCE_ALT = [
  ...PROVINCES.map((p) => `${p.replace(/ /g, "\\s+")}\\s+Province`),
  "Copperbelt",
  "North-Western",
]
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {};
for (const p of PROVINCES) {
  REGION_MAP[`${p.toLowerCase()} province`] = p;
}
REGION_MAP["copperbelt"] = "Copperbelt";
REGION_MAP["north-western"] = "North-Western";

export const zmConfig: EuCountryConfig = {
  code: "zm",
  country: "ZM",
  countryNames: ["Zambia", "Republic of Zambia", "ZMB", "ZM"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode, after the city; optional (frequently omitted).
  postalPattern: "(?<postal_code>\\d{5})",

  // number FIRST, optional "Stand"/"Plot"/"No."/"#" lead-in, optional
  // range/subdivision ("2374/M"), optional glued letter suffix.
  houseNumberPattern:
    "(?:Stand\\s+(?:No\\.?\\s*)?|Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+city chain together; drop leading area(s) in postNormalize.
  cityAllowsCommas: true,
  // Only an explicit province form may land in the state slot.
  countyPattern: `(?:${PROVINCE_ALT})`,
  regionMap: REGION_MAP,

  // Flat / Apartment / House / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("Findeco House, Cairo Road, Lusaka").
  buildingKeywords: [
    "House", "Tower", "Towers", "Centre", "Center", "Plaza", "Building",
    "Mall", "Complex", "Arcade",
  ],

  // A Zambian Private Bag number may carry a 1-2 letter exchange prefix
  // ("Private Bag E123"); a plain PO Box number stays all-digits.
  poBoxNumberPattern: "[A-Za-z]{0,2}\\s*\\d+",
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Post Box", "Private Bag", "P/Bag"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "post box": "PO Box",
    "private bag": "Private Bag", "p/bag": "Private Bag",
  },

  // Collapse the "area, city" chain to the routing city + dropped area(s). The
  // "Stand"/"Plot" number lead-ins are consumed but not emitted, so they are
  // exempted from the token-preservation guard here (as PK does for "House"/"Plot").
  postNormalize: (parsed: Record<string, any>) => {
    keepLastLocality(parsed, ["Stand", "Plot"]);
  },
};

export default zmConfig;
