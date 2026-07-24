import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Yemen (YE) address configuration -- Latin transliteration for international /
 * SEC filings. Native Arabic RTL script is OUT OF SCOPE (Arabic-script samples
 * are __skip).
 *
 * THERE IS NO POSTCODE. Yemen operates no functioning national postal-code
 * system; mail routes by PO Box + city, and physical location by street / area /
 * governorate. The postal pattern is a never-match sentinel, so every address
 * parses through the postcode-ABSENT branch of the place grammar.
 *
 * Two dominant forms:
 *   1. PO Box:    "PO Box 1234, Sana'a"  ->  sec_unit PO Box + city.
 *   2. Physical:  "Hadda Street, Hadda, Sana'a"
 *                 -> street(+type) + area(as city) + governorate(as state).
 *
 * Order:  a house number, when present, LEADS ("No. 12"); usually absent.
 * Type:   trailing English suffix (Street/Road/...); many roads are named
 *         type-less.
 * city  = the AREA / district (Hadda, Al-Tahrir, Al-Sabeen, Crater, Khormaksar).
 * state = the GOVERNORATE (Sana'a, Aden, Taiz, Al Hudaydah, Ibb, ...), kept
 *         spelled out and restricted to a real governorate list.
 *
 * KNOWN GAPS (see research-ye.md): with no postcode and governorate names that
 * double as cities (Aden, Taiz, Ibb, ...), a single-locality line puts the
 * governorate in `city` (no area to promote); Arabic RTL script is skipped.
 */

const TYPES = [
  "Boulevard", "Street", "Avenue", "Road", "Highway", "Blvd", "Rd", "St",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE",
  road: "RD", rd: "RD",
  highway: "HWY",
};

// Governorates (romanized variants), multi-word spellings space-escaped,
// optional trailing "Governorate". Restricted so only a real governorate lands
// in `state`; an ordinary area (city) never matches.
const GOVERNORATES = [
  "Amanat Al Asimah", "Sana'a", "Sanaa", "Aden", "Ta'izz", "Taizz", "Taiz",
  "Al Hudaydah", "Hodeidah", "Hudaydah", "Ibb", "Dhamar", "Hadhramaut",
  "Hadramawt", "Hajjah", "Al Bayda", "Lahij", "Abyan", "Sa'dah", "Saada",
  "Shabwah", "Al Mahwit", "Al Mahweet", "Ma'rib", "Marib", "Al Jawf", "Amran",
  "Al Dhale'e", "Al Dhalea", "Raymah", "Al Mahrah", "Socotra",
];
const GOV_ALT =
  "(?:" + GOVERNORATES.map((s) => s.replace(/ /g, "\\s+")).join("|") +
  ")(?:\\s+Governorate)?";

export const yeConfig: EuCountryConfig = {
  code: "ye",
  country: "YE",
  countryNames: ["Yemen", "Republic of Yemen", "YEM", "YE"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // NO postal code: never-match sentinel -> postcode-absent place branch.
  postalPattern: "(?<postal_code>(?!x)x)",

  // House number, when present, leads ("No. 12"); usually absent.
  houseNumberPattern:
    "(?:No\\.?\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Area (city) then optional governorate (state); the governorate must be a
  // real one, so an ordinary area is not split into state.
  countyPattern: GOV_ALT,

  // Leading unit: building / floor / office / flat lead-in.
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

export default yeConfig;
