import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Turkmenistan (TM) address configuration — romanized (Latin) SEC / international
 * filing form. Turkmen is officially written in Latin script.
 *
 * Order: street NAME first, English thoroughfare TYPE as a trailing SUFFIX
 *        ("Magtymguly Avenue", "Bitarap Turkmenistan Avenue"), building number
 *        AFTER the type ("Magtymguly Avenue 74"). `order: street-number`,
 *        `typePlacement: suffix`.
 * Type: English generic — Avenue, Street, Boulevard, Highway, Lane, Square,
 *        Road, Passage, plus abbreviations Ave/St/Blvd/Hwy. Echoed verbatim.
 * Postcode: six digits, AFTER the city ("Ashgabat 744000").
 * Region (welayat): disjoint from the routing city, written between the city and
 *        the postcode ("Mary, Mary Region 745400"); mapped to `state`.
 *        `countyPattern` is restricted to the five real welayatlar, each with a
 *        trailing "Region"/"welayaty" marker (so Mary/Balkanabat the city is
 *        never taken as a region).
 * Secondary unit: apartment "kv."/"kvartira"/"apt", office "office"/"ofis".
 *
 * KNOWN GAPS (see research-tm.md): Russian-style prefix generics
 * ("ulitsa"/"prospekt"), the Turkmen "koçesi" suffix minority spelling, the
 * house/kod (H/K) block form, big-endian order and native Cyrillic script are
 * OUT OF SCOPE and marked __skip losslessly.
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

// The five welayatlar (regions), romanized. A trailing "Region"/"welayaty"
// marker is required, disambiguating a region from a like-named city (Mary).
const REGIONS = [
  "Ahal", "Balkan", "Dashoguz", "Lebap", "Mary",
];

export const tmConfig: EuCountryConfig = {
  code: "tm",
  country: "TM",
  countryNames: ["Turkmenistan", "TKM", "TM"],

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

  countyPattern: `(?:${REGIONS.join("|")})\\s+(?:Region|welayaty)`,

  secUnitPattern:
    "(?<sec_unit_type>kvartira|apartment|office|ofis|apt|kv|of)\\.?\\s*(?<sec_unit_num>\\d+[A-Za-z]?)",
  secUnitDisplayMap: {
    kv: "kv.", kvartira: "kv.",
    apt: "apt", apartment: "apt",
    office: "office", ofis: "office", of: "office",
  },
};

export default tmConfig;
