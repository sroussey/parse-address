import type { EuCountryConfig } from "../_eu/types";

/**
 * United Arab Emirates (AE) address configuration.
 *
 * THERE IS NO POSTCODE. The UAE operates no national postal-code system; mail is
 * routed by PO Box + emirate, and physical dispatch by building / area / emirate
 * (and, increasingly, the 10-digit Makani geocode, which is not an admin field).
 * The postal pattern is therefore a never-match sentinel, so every address parses
 * through the postcode-ABSENT branch of the shared place grammar.
 *
 * Two dominant forms:
 *   1. PO Box:      "PO Box 9222, Dubai"  ->  sec_unit PO Box + emirate.
 *   2. Physical:    "Villa 12, Al Wasl Road, Jumeirah, Dubai"
 *                   ->  unit + street(+type) + area(as city) + emirate(as state).
 *
 * Order: a unit / villa / office LEADS ("Villa 12", "Office 1102"); a bare
 *        building number is rare, so `number` is usually absent.
 * Type: trailing English suffix — Road, Street, Boulevard, Avenue. Many named
 *        roads ("Al Wasl Road", "Sheikh Zayed Road") and communities ("Al Barsha
 *        2", "Business Bay") carry no type and parse as type-less names.
 * city  = the AREA / community (Jumeirah, Deira, Al Barsha, Business Bay).
 * state = the EMIRATE (Dubai, Abu Dhabi, Sharjah, ...), kept spelled out (no
 *        admin code is used in practice).
 *
 * KNOWN GAPS (see research-ae.md): with no postcode and no reliable delimiter,
 * a fully-loaded line (unit + building + community + PO Box + emirate) exceeds the
 * single street/city/state slots; when only ONE locality precedes the emirate the
 * emirate falls into `city` (no area to promote); numbered buildings ("Tower 1")
 * defeat the suffix building capture. These are documented failure modes.
 */

const TYPES = ["Boulevard", "Street", "Avenue", "Road", "Blvd", "Rd", "St"];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE",
  road: "RD", rd: "RD",
};

// The seven emirates (+ Al Ain, an emirate-level city commonly written like one),
// longest / multi-word first, spaces escaped for free-spacing mode.
const EMIRATES = [
  "Umm Al Quwain", "Umm al-Quwain", "Ras Al Khaimah", "Ras al-Khaimah",
  "Abu Dhabi", "Al Ain", "Fujairah", "Sharjah", "Ajman", "Dubai",
];
const EMIRATE_ALT = EMIRATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const aeConfig: EuCountryConfig = {
  code: "ae",
  country: "AE",
  countryNames: [
    "United Arab Emirates", "U.A.E.", "UAE", "Emirates", "ARE", "AE",
  ],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // NO postal code: a sentinel that can never match, forcing the postcode-absent
  // place branch (emirate captured as the trailing "county" -> state).
  postalPattern: "(?<postal_code>(?!x)x)",

  // A bare building number, rarely present ("Building 5"); mostly the unit leads.
  houseNumberPattern:
    "(?:No\\.?\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Emirate after the area -> state, kept spelled out (no regionMap).
  countyPattern: `(?:${EMIRATE_ALT})`,
  // Dubai communities are numbered ("Jumeirah 3", "Al Barsha 2"), so the city
  // slot must admit digits.
  cityAllowsDigits: true,

  // Unit / villa / office / apartment lead-in.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Office|Apartment|Apt\\.?|Flat|Villa|Suite|Floor|Shop|Unit|Room|Warehouse|Mezzanine)\\.?\\s*(?<sec_unit_num>[A-Za-z]?\\d+[\\w-]*)",
  secUnitDisplayMap: {
    office: "Office",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    villa: "Villa",
    suite: "Suite",
    floor: "Floor",
    shop: "Shop",
    unit: "Unit",
    room: "Room",
    warehouse: "Warehouse",
    mezzanine: "Mezzanine",
  },

  // A leading building whose name ENDS in a keyword ("Burjuman Business Tower,
  // Sheikh Zayed Road, ..."). Numbered buildings ("... Tower 1") are a noted gap.
  buildingKeywords: [
    "Tower", "Towers", "Building", "Plaza", "Centre", "Center", "Mall",
    "Residence", "Residences",
  ],

  // Emirates Post uses PO Box exclusively (no street-delivery postcode).
  poBoxNames: ["PO Box", "P.O. Box", "POB", "Post Box", "P O Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default aeConfig;
