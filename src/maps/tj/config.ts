import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Tajikistan (TJ) address configuration — romanized (Latin) SEC / international
 * filing form.
 *
 * Order: street NAME first, English thoroughfare TYPE as a trailing SUFFIX
 *        ("Rudaki Avenue", "Somoni Avenue"), building number AFTER the type
 *        ("Rudaki Avenue 25"). `order: street-number`, `typePlacement: suffix`.
 * Type: English generic — Avenue, Street, Boulevard, Highway, Lane, Square,
 *        Road, Passage, plus abbreviations Ave/St/Blvd/Hwy. Echoed verbatim.
 * Postcode: six digits, AFTER the city ("Dushanbe 734000").
 * Region (viloyat): disjoint from the routing city, written between the city and
 *        the postcode ("Khujand, Sughd Region 735700"); mapped to `state`.
 *        `countyPattern` is restricted to the real regions, each with a trailing
 *        "Region"/"viloyati" marker.
 * Secondary unit: apartment "kv."/"kvartira"/"apt", office "office"/"ofis".
 *
 * KNOWN GAPS (see research-tj.md): Russian-style prefix generics
 * ("ulitsa"/"prospekt"), the microdistrict form, big-endian order and native
 * Cyrillic script are OUT OF SCOPE and marked __skip losslessly.
 */

const TYPES = [
  "Avenue", "Boulevard", "Highway", "Passage", "Street", "Square", "Lane",
  "Road",
  "Blvd", "Hwy", "Ave", "St",
];

const TYPE_SHORT: Record<string, string> = {
  avenue: "AVE", ave: "AVE",
  street: "ST", st: "ST",
  boulevard: "BLVD", blvd: "BLVD",
  highway: "HWY", hwy: "HWY",
  lane: "LN",
  square: "SQ",
  road: "RD",
  passage: "PSG",
};

// Regions (viloyatho) + the autonomous province, romanized. A trailing
// "Region"/"viloyati" marker is required.
const REGIONS = [
  "Gorno-Badakhshan", "Sughd", "Khatlon",
];

export const tjConfig: EuCountryConfig = {
  code: "tj",
  country: "TJ",
  countryNames: ["Tajikistan", "Tojikiston", "TJK", "TJ"],

  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{6})",

  houseNumberPattern:
    "(?<number>\\d+(?:\\s*[-/]\\s*\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  countyPattern: `(?:${REGIONS.join("|")})\\s+(?:Region|viloyati)`,

  secUnitPattern:
    "(?<sec_unit_type>kvartira|apartment|office|ofis|apt|kv|of)\\.?\\s*(?<sec_unit_num>\\d+[A-Za-z]?)",
  secUnitDisplayMap: {
    kv: "kv.", kvartira: "kv.",
    apt: "apt", apartment: "apt",
    office: "office", ofis: "office", of: "office",
  },
};

export default tjConfig;
