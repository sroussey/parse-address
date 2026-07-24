import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Ethiopia (ET) address configuration.
 *
 * Order: house/building NUMBER first (when present), then the street name +
 *        trailing English type ("Bole Road, Addis Ababa") — GB/KE-style
 *        number-first, suffix type. Numbers are usually ABSENT and many roads
 *        are type-less (bare "Churchill", "Bole Medhanealem"); the type is
 *        optional.
 * Type: trailing English suffix (Road, Street, Avenue, ...). Native Amharic
 *        script is OUT OF SCOPE; international addressing uses English/Latin.
 * Locality: Addis Ababa is organised as sub-city ("kifle ketema") + woreda +
 *        kebele; these are written like an area chain between the street and the
 *        routing city ("Bole Road, Bole Sub City, Woreda 03, Addis Ababa"). As in
 *        KE/TZ the comma chain is kept together and the leading area(s) dropped in
 *        postNormalize, keeping the last locality (the city).
 * Postcode: a 4-digit postcode exists but has very low adoption; written AFTER the
 *        city ("Addis Ababa 1000") and OPTIONAL — absent on the vast majority of
 *        addresses.
 * Region (-> state): the regional states (Oromia, Amhara, Tigray, Afar, ...) are
 *        written after the city and captured to `state`. The list is kept DISJOINT
 *        from the routing cities — the chartered city-regions Addis Ababa and Dire
 *        Dawa (which ARE cities) are intentionally excluded, so a bare "..., Addis
 *        Ababa" stays the routing city and is never mis-taken as the region.
 * PO Box: the DOMINANT postal form ("P.O. Box 1234, Addis Ababa"); the box
 *        replaces the thoroughfare.
 *
 * Sources: Ethiopian Postal Service (Ethio Post); UPU S42 ET template & postcode
 * note (4-digit, low adoption); Smarty / GeoPostcodes ET address guides. See
 * research-et.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Close", "Crescent", "Boulevard", "Drive",
  "Lane", "Way", "Court", "Place", "Terrace", "Circle", "Ring", "Loop",
  "Rise", "Grove", "Row", "Park", "Gardens", "Walk", "Hill", "Highway",
  "Square",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cl", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
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
  square: "SQ",
};

// Regional states, kept DISJOINT from the routing cities. The two chartered
// city-regions — Addis Ababa and Dire Dawa — are cities in their own right and
// are deliberately LEFT OUT (a bare duplicate would eat the routing city, a
// documented failure mode). Two-word names escape their space as \s+.
const REGIONS = [
  "Oromia", "Amhara", "Tigray", "Afar", "Sidama", "Harari",
  "Benishangul-Gumuz", "Benishangul Gumuz", "Gambella Region",
];

export const etConfig: EuCountryConfig = {
  code: "et",
  country: "ET",
  countryNames: ["Ethiopia", "Federal Democratic Republic of Ethiopia", "ETH", "ET"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 4-digit postcode (rare), after the city; optional.
  postalPattern: "(?<postal_code>\\d{4})",

  // number FIRST, optional "No."/"#" lead-in, optional range/subdivision, optional
  // glued letter suffix.
  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the sub-city/woreda/kebele + city chain together; drop leading area(s) in
  // postNormalize. Only a non-colliding region name may land in the state slot.
  cityAllowsCommas: true,
  countyPattern: `(?:${REGIONS.map((r) => r.replace(/ /g, "\\s+")).join("|")})`,

  // Flat / Apartment / House / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("Dembel City Center, Bole Road, Addis Ababa").
  buildingKeywords: [
    "Tower", "Towers", "House", "Centre", "Center", "Plaza", "Building",
    "Mall", "Complex", "Arcade",
  ],

  // PO Box is dominant.
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "P.O.Box", "Post Box", "Private Bag"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "p.o.box": "PO Box", "post box": "PO Box",
    "private bag": "Private Bag",
  },

  // Collapse the "area, city" chain to the routing city + dropped area(s).
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default etConfig;
