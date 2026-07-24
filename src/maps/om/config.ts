import type { EuCountryConfig } from "../_eu/types";

/**
 * Oman (OM) address configuration -- Latin transliteration for international /
 * SEC filings. Native Arabic RTL script is OUT OF SCOPE (Arabic-script samples
 * are __skip).
 *
 * Oman is DISTINCTIVE: physical streets are numbered "Way NNNN" (e.g. "Way 3042"),
 * and the postal code is a 3-digit code introduced by the marker "PC" (Postal
 * Code), written BEFORE the locality together with the PO box:
 *   "PO Box 123, PC 133, Al Khuwair".
 *
 * Because the code precedes the locality, the place layout is BEFORE-CITY
 * (postcode then city then optional governorate). The "PC" marker is captured as
 * a drop group (consumed, recorded as dropped, not emitted); only the 3 digits
 * become `postal_code`.
 *
 * Two dominant forms:
 *   1. PO Box:    "PO Box 123, PC 133, Al Khuwair"
 *                 -> sec_unit PO Box + postal_code (133) + city (Al Khuwair).
 *   2. Physical:  "Way 3042, PC 133, Al Khuwair, Muscat"
 *                 -> street ("Way 3042", type-less) + postal_code + district(city)
 *                    + governorate(state).
 *
 * Order:  an optional labelled Building/Villa LEADS ("Building 145"); the numbered
 *         "Way NNNN" is the street (bare, type-less); a few named roads carry a
 *         trailing English type.
 * street = "Way NNNN" kept whole; a named road ("Sultan Qaboos Street") splits its
 *         trailing type.
 * postal_code = the 3 digits after "PC"/"P.C." (marker dropped).
 * city  = the DISTRICT / wilayat area (Al Khuwair, Ruwi, Qurum, Al Ghubra, ...).
 * state = the GOVERNORATE (Muscat, Dhofar, Musandam, Al Batinah, ...), spelled out.
 *
 * KNOWN GAPS (see research-om.md): a city-then-postcode written order (code last)
 * is not modelled -- the "PC NNN" must precede the locality; a numbered building
 * as its own comma segment, and Arabic RTL script, are skipped.
 */

const TYPES = ["Boulevard", "Street", "Avenue", "Road", "Highway", "Blvd", "Rd", "St"];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE",
  road: "RD", rd: "RD",
  highway: "HWY",
};

// The 11 governorates (muhafazat) with romanized variants, space-escaped.
const GOVERNORATES = [
  "Muscat", "Dhofar", "Musandam", "Al Buraimi", "Al Dakhiliyah", "Ad Dakhiliyah",
  "Al Batinah North", "Al Batinah South", "Al Batinah", "Al Sharqiyah North",
  "Al Sharqiyah South", "Al Sharqiyah", "Ash Sharqiyah", "Al Dhahirah",
  "Az Zahirah", "Al Wusta",
];
const GOV_ALT =
  "(?:" + GOVERNORATES.map((s) => s.replace(/ /g, "\\s+")).join("|") +
  ")(?:\\s+Governorate)?";

export const omConfig: EuCountryConfig = {
  code: "om",
  country: "OM",
  countryNames: ["Oman", "Sultanate of Oman", "OMN", "OM"],

  order: "number-street",
  typePlacement: "suffix",
  // The 3-digit "PC NNN" code precedes the locality -> before-city layout.
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // 3-digit postal code introduced by the marker "PC"/"P.C.". The marker is a
  // drop group (consumed + recorded, never emitted); only the digits are the code.
  postalPattern: "(?<drop>P\\.?C\\.?)\\s*(?<postal_code>\\d{3})",

  // No independent leading house number ("Way NNNN" is the street, and the
  // building is a labelled unit); keep a harmless digit run for parity.
  houseNumberPattern: "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Optional governorate after the district -> state, kept spelled out.
  countyPattern: GOV_ALT,
  regionPattern: `(?<state>${GOV_ALT})`,

  // Building / villa / house / flat / office lead-in ("Building 145", "Villa 22").
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Building|Bldg\\.?|Villa|House|Apartment|Apt\\.?|Flat|Suite|Floor|Office|Unit|Shop)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    building: "Building",
    bldg: "Building",
    villa: "Villa",
    house: "House",
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

export default omConfig;
