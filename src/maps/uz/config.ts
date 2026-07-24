import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Uzbekistan (UZ) address configuration — romanized (Latin) form. Uzbek is
 * officially written in Latin script; the native generic street noun is used.
 *
 * Order: street NAME first, then the Uzbek thoroughfare TYPE (izafet noun) as a
 *        trailing SUFFIX ("Amir Temur ko'chasi", "Mustaqillik ko'chasi"), then
 *        the building number AFTER the type ("Amir Temur ko'chasi 15"). Modeled
 *        `order: street-number`, `typePlacement: suffix`.
 * Type: suffix noun — ko'chasi / ko'cha (street), prospekti (avenue), maydoni
 *        (square), yo'li (road); abbreviation ko'ch. The ASCII apostrophe form
 *        of oʻ/gʻ (ko'chasi, yo'li) is handled. Echoed verbatim
 *        (`normalizeTypeCase: false`); a short code is derived.
 * Number: after the type, optional range/slash ("15/2") and one glued letter
 *        ("15A" -> number 15, civic_number_suffix A).
 * Postcode: six digits, AFTER the city ("Tashkent 100000").
 * Region (viloyat): disjoint from the routing city, written between the city and
 *        the postcode ("Samarkand, Samarkand Region 140100"); mapped to `state`.
 *        `countyPattern` is restricted to the real viloyatlar, each with a
 *        trailing "Region"/"viloyati" marker (so Tashkent/Samarkand the city is
 *        never taken as a region).
 * Secondary unit: apartment "xonadon"/"kv."/"kvartira"/"apt", office "ofis".
 *
 * KNOWN GAPS (see research-uz.md): Russian-style prefix generics
 * ("ulitsa"/"prospekt"), the mahalla / kvartal (housing-block) form, big-endian
 * order and native Cyrillic script are OUT OF SCOPE and marked __skip losslessly.
 */

const TYPES = [
  "ko'chasi", "prospekti", "maydoni", "ko'cha", "yo'li",
  // abbreviation (trailing dot kept)
  "ko'ch.",
];

const TYPE_SHORT: Record<string, string> = {
  "ko'chasi": "KUC", "ko'cha": "KUC", "ko'ch": "KUC",
  prospekti: "PR",
  maydoni: "MAY",
  "yo'li": "YOL",
};

// The 12 viloyatlar (regions), romanized. A trailing "Region"/"viloyati" marker
// is required, disambiguating a region from a like-named city.
const REGIONS = [
  "Andijan", "Bukhara", "Fergana", "Jizzakh", "Namangan", "Navoiy",
  "Kashkadarya", "Samarkand", "Sirdaryo", "Surkhandarya", "Tashkent",
  "Khorezm",
];

export const uzConfig: EuCountryConfig = {
  code: "uz",
  country: "UZ",
  countryNames: ["Uzbekistan", "O'zbekiston", "Ozbekiston", "UZB", "UZ"],

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
    "(?<sec_unit_type>xonadon|kvartira|apartment|office|ofis|apt|kv|of)\\.?\\s*(?<sec_unit_num>\\d+[A-Za-z]?)",
  secUnitDisplayMap: {
    xonadon: "xonadon",
    kv: "kv.", kvartira: "kv.",
    apt: "apt", apartment: "apt",
    office: "office", ofis: "office", of: "office",
  },
};

export default uzConfig;
