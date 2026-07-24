import type { EuCountryConfig } from "../_eu/types";

/**
 * Kyrgyzstan (KG) address configuration — romanized (Latin) SEC / international
 * filing form.
 *
 * Order: street NAME first, English thoroughfare TYPE as a trailing SUFFIX
 *        ("Chuy Avenue", "Sovietskaya Street"), building number AFTER the type
 *        ("Chuy Avenue 120"). `order: street-number`, `typePlacement: suffix`.
 * Type: English generic — Avenue, Street, Boulevard, Highway, Lane, Square,
 *        Road, Passage, plus abbreviations Ave/St/Blvd/Hwy. Echoed verbatim.
 * Postcode: six digits, AFTER the city ("Bishkek 720000").
 * Region (oblast): disjoint from the routing city, written between the city and
 *        the postcode ("Karakol, Issyk-Kul Region 722200"); mapped to `state`.
 *        `countyPattern` is restricted to the seven real oblasttar, each with a
 *        trailing "Region"/"oblasty" marker (so Osh the city is never taken as
 *        a region).
 * Secondary unit: apartment "kv."/"kvartira"/"apt", office "office"/"ofis".
 *
 * KNOWN GAPS (see research-kg.md): Russian-style prefix generics
 * ("ulitsa"/"prospekt" leading), the microdistrict form, big-endian order and
 * native Cyrillic script are OUT OF SCOPE and marked __skip losslessly.
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

// The seven oblasttar (regions), romanized. A trailing "Region"/"oblasty"
// marker is required, disambiguating a region from the like-named city (Osh).
const REGIONS = [
  "Issyk-Kul", "Jalal-Abad", "Batken", "Chuy", "Naryn", "Talas", "Osh",
];

export const kgConfig: EuCountryConfig = {
  code: "kg",
  country: "KG",
  countryNames: ["Kyrgyzstan", "Kyrgyz Republic", "KGZ", "KG"],

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

  countyPattern: `(?:${REGIONS.join("|")})\\s+(?:Region|oblasty)`,

  secUnitPattern:
    "(?<sec_unit_type>kvartira|apartment|office|ofis|apt|kv|of)\\.?\\s*(?<sec_unit_num>\\d+[A-Za-z]?)",
  secUnitDisplayMap: {
    kv: "kv.", kvartira: "kv.",
    apt: "apt", apartment: "apt",
    office: "office", ofis: "office", of: "office",
  },
};

export default kgConfig;
