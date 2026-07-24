import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Uganda (UG) address configuration.
 *
 * Order: "Plot" NUMBER first, then the street name + trailing English type
 *        ("Plot 29 Kampala Road") — number-first, suffix type. Ugandan physical
 *        addresses characteristically lead with the cadastral "Plot <n>".
 * Type: trailing English suffix (Road, Street, Avenue, Close, Lane, Drive, ...).
 *        Many roads are type-less; the type must be optional.
 * Locality: an AREA / division / suburb (Nakasero, Kololo, Bugolobi, Ntinda,
 *        Bukoto, Naguru, Muyenga, ...) sits between the street and the routing
 *        city. As in KE/ZA the comma chain is kept together and the leading
 *        area(s) are dropped in postNormalize, keeping the last locality (city).
 * Postcode: Uganda has NO postal-code system; nothing is ever written. The
 *        postcode capture is a never-match sentinel so a stray number is never
 *        misread as a code, and the place tail simply ends at the city.
 * Region/district: the 4 regions (Central/Eastern/Northern/Western) and 100+
 *        districts are essentially never written in a mailing address, and every
 *        district name duplicates a town (Wakiso, Mukono, Jinja, ...). The county
 *        slot is disabled with a never-match sentinel so the generic county
 *        pattern does not swallow the routing city. No `state` is modelled.
 * PO Box: the DOMINANT postal form ("P.O. Box 7062, Kampala"). The box replaces
 *        the thoroughfare.
 *
 * Sources: Posta Uganda; UPU S42 UG template & postcode note ("no postal code");
 * Smarty / PostGrid UG address guides. See research-ug.md.
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

export const ugConfig: EuCountryConfig = {
  code: "ug",
  country: "UG",
  countryNames: ["Uganda", "Republic of Uganda", "UGA", "UG"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Uganda has NO postcode: never-match sentinel keeps a stray number out of it.
  postalPattern: "(?<postal_code>(?!x)x)",

  // "Plot <n>" leads; also accept a bare number, optional "No."/"#", a
  // range/subdivision ("15/3"), and an optional glued letter suffix ("29B").
  houseNumberPattern:
    "(?:Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+city chain together; drop leading area(s) in postNormalize.
  // Uganda has no address-level region, so the county slot is disabled with a
  // never-match sentinel — otherwise the default county pattern would grab the
  // routing city ("Nakasero, Kampala" -> city="Nakasero", county="Kampala").
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  // Flat / Apartment / House / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("Workers House, Plot 1 Pilkington Road, Kampala").
  buildingKeywords: [
    "House", "Tower", "Towers", "Centre", "Center", "Plaza", "Building",
    "Mall", "Complex", "Arcade",
  ],

  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Post Box", "Private Bag"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "post box": "PO Box", "private bag": "Private Bag",
  },

  // Collapse the "area, city" chain to the routing city + dropped area(s). The
  // "Plot" number lead-in is consumed but not emitted, so it is exempted from the
  // token-preservation guard here (as PK does for "House"/"Plot").
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed, ["Plot"]),
};

export default ugConfig;
