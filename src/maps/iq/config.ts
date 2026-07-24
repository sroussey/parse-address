import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Iraq (IQ) address configuration -- Latin transliteration for international /
 * SEC filings. Native Arabic RTL script is OUT OF SCOPE (Arabic-script samples
 * are __skip).
 *
 * Iraq introduced a 5-digit national postcode ("Baghdad 10001"), but it is only
 * patchily used and is frequently ABSENT. The place grammar therefore keeps the
 * postcode optional (the after-city branch parses both "..., <Gov> NNNNN" and
 * "..., <District>, <Gov>" with no code).
 *
 * Two dominant forms:
 *   1. PO Box:    "PO Box 3007, Baghdad"  ->  sec_unit PO Box + city.
 *   2. Physical:  "No. 25, Haifa Street, Al-Karrada, Baghdad 10001"
 *                 -> number + street(+type) + district(as city) +
 *                    governorate(as state) + postcode.
 *
 * Order:  a bare/"No." house number LEADS ("No. 25", "25"); often absent.
 * Type:   trailing English suffix (Street/Road/Avenue/...); many arteries are
 *         numbered ("Street 52") or named type-less and parse whole.
 * city  = the DISTRICT / area (Al-Karrada, Al-Mansour, Al-Rusafa, Zayouna, ...).
 * state = the GOVERNORATE (Baghdad, Basra, Najaf, Erbil, ...), kept spelled out
 *         and restricted to a real governorate list so an ordinary district is
 *         never mis-split into state.
 * postal_code = 5 digits, LAST, after the governorate; usually absent.
 *
 * KNOWN GAPS (see research-iq.md): when only ONE locality precedes the postcode
 * the governorate falls into `city` (no district to promote); a numbered
 * building written as its own comma segment, and Arabic RTL script, are skipped.
 */

const TYPES = [
  "Boulevard", "Street", "Avenue", "Road", "Highway", "Expressway",
  "Blvd", "Rd", "St", "Ave", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  road: "RD", rd: "RD",
  highway: "HWY", hwy: "HWY",
  expressway: "EXPY",
};

// The 18 governorates (romanized variants), multi-word spellings space-escaped
// for free-spacing mode, optional trailing "Governorate". Restricted so only a
// real governorate can land in `state`; a district (city) never matches.
const GOVERNORATES = [
  "Baghdad", "Basra", "Basrah", "Nineveh", "Ninawa", "Erbil", "Arbil",
  "Kirkuk", "An Najaf", "Najaf", "Karbala", "Kerbala", "Wasit", "Maysan",
  "Al Qadisiyyah", "Qadisiyyah", "Diwaniyah", "Babil", "Babylon", "Diyala",
  "Dhi Qar", "Thi Qar", "Al Muthanna", "Muthanna", "Al Anbar", "Anbar",
  "Salah al-Din", "Salahuddin", "Saladin", "Dohuk", "Duhok",
  "Sulaymaniyah", "Sulaimaniyah", "Halabja",
];
const GOV_ALT =
  "(?:" + GOVERNORATES.map((s) => s.replace(/ /g, "\\s+")).join("|") +
  ")(?:\\s+Governorate)?";

export const iqConfig: EuCountryConfig = {
  code: "iq",
  country: "IQ",
  countryNames: ["Iraq", "Republic of Iraq", "IRQ", "IQ"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode, LAST, and OPTIONAL (the after-city branch also parses the
  // no-postcode "..., <District>, <Governorate>" form).
  postalPattern: "(?<postal_code>\\d{5})",

  // House number: bare, or introduced by "No." (the marker is skipped). Usually
  // absent -- many lines begin with the street or district.
  houseNumberPattern:
    "(?:No\\.?\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // District (city) then optional governorate (state); the governorate must be a
  // real one, so an ordinary district is not split into state.
  countyPattern: GOV_ALT,

  // Leading unit: house / building / floor / office lead-in ("House No. 25").
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Building|Bldg\\.?|House|Villa|Apartment|Apt\\.?|Flat|Suite|Floor|Office|Unit|Shop)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    building: "Building",
    bldg: "Building",
    house: "House",
    villa: "Villa",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    suite: "Suite",
    floor: "Floor",
    office: "Office",
    unit: "Unit",
    shop: "Shop",
  },

  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default iqConfig;
