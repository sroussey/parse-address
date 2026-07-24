import type { EuCountryConfig } from "../_eu/types";

/**
 * Kazakhstan (KZ) address configuration — romanized (Latin) SEC / international
 * filing form.
 *
 * Order: street NAME first, then an English thoroughfare TYPE as a trailing
 *        SUFFIX ("Abay Avenue", "Dostyk Avenue", "Zheltoksan Street"), then the
 *        building number AFTER the type ("Abay Avenue 10"). Modeled
 *        `order: street-number`, `typePlacement: suffix`.
 * Type: English generic — Avenue, Street, Boulevard, Highway, Lane, Square,
 *        Road, Passage, plus the abbreviations Ave/St/Blvd/Hwy. Echoed as
 *        written (`normalizeTypeCase: false`); a short code is derived.
 * Number: after the type, optional range/slash ("10/2") and a single glued
 *        letter ("12A" -> number 12, civic_number_suffix A).
 * Postcode: six digits, written AFTER the city ("Almaty 050000") per the
 *        international small-endian envelope. `postalPlacement: after-city`.
 * Region (oblys): disjoint from the routing city and written between the city
 *        and the postcode ("Kokshetau, Akmola Region 020000"); mapped to
 *        `state`. `countyPattern` is restricted to the 17 real oblys names, each
 *        requiring a trailing "Region"/"oblysy" marker so a bare city name
 *        (Almaty is both a city and a region) is never mistaken for a region.
 * Secondary unit: apartment "kv."/"kvartira"/"apt", office "office"/"ofis".
 *
 * KNOWN GAPS (see research-kz.md): the Russian-style prefix form
 * ("ulitsa Abaya 10", "prospekt Abaya"), the microdistrict form
 * ("Microdistrict Samal 2, house 5"), the big-endian postcode-first order, and
 * native Cyrillic script are OUT OF SCOPE and marked __skip losslessly.
 */

const TYPES = [
  "Avenue", "Boulevard", "Highway", "Passage", "Street", "Square", "Lane",
  "Road",
  // abbreviations (trailing dot optional; matched as whole trailing words)
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

// The 17 oblystar (regions), romanized. Each is written with a trailing
// "Region"/"oblysy" marker, which is what disambiguates a region from a
// like-named city (Almaty, Turkistan are both).
const REGIONS = [
  "East\\s+Kazakhstan", "North\\s+Kazakhstan", "West\\s+Kazakhstan",
  "Almaty", "Akmola", "Aktobe", "Atyrau", "Abai", "Jambyl", "Jetisu",
  "Karaganda", "Kostanay", "Kyzylorda", "Mangystau", "Pavlodar",
  "Turkistan", "Ulytau",
];

export const kzConfig: EuCountryConfig = {
  code: "kz",
  country: "KZ",
  countryNames: ["Kazakhstan", "Qazaqstan", "KAZ", "KZ"],

  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English type words echoed verbatim; only the short code is derived.
  normalizeTypeCase: false,

  // Six-digit index, written after the city.
  postalPattern: "(?<postal_code>\\d{6})",

  // Building number after the type; optional range/slash and one glued letter.
  houseNumberPattern:
    "(?<number>\\d+(?:\\s*[-/]\\s*\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // oblys (region) sits between the city and the postcode. Restricted to the
  // real region list; a trailing "Region"/"oblysy" marker is required.
  countyPattern: `(?:${REGIONS.join("|")})\\s+(?:Region|oblysy)`,

  // Apartment / office secondary unit ("kv. 5", "apt 12", "office 3").
  secUnitPattern:
    "(?<sec_unit_type>kvartira|apartment|office|ofis|apt|kv|of)\\.?\\s*(?<sec_unit_num>\\d+[A-Za-z]?)",
  secUnitDisplayMap: {
    kv: "kv.", kvartira: "kv.",
    apt: "apt", apartment: "apt",
    office: "office", ofis: "office", of: "office",
  },
};

export default kzConfig;
