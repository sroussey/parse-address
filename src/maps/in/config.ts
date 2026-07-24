import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * India (IN) address configuration.
 *
 * Order: house NUMBER first (often "No."/"#"/plot-and-door "12/3", "1-2-3"),
 *        then a SUFFIX-type thoroughfare name ("MG Road", "Anna Salai",
 *        "Linking Road", "2nd Main", "5th Cross").
 * Type: trailing English/Indic suffix — Road/Rd, Marg (Hindi road), Salai
 *        (Tamil road), Sarani (Bengali road), Street/St, Cross, Main, Lane,
 *        Path, Chowk, Circle, Highway. Many roads are type-less (dropped null).
 * Postcode: 6-digit PIN, written AFTER the city, frequently introduced by a
 *        dash ("Bengaluru - 560001", em-dash "Bengaluru — 560034") or the label
 *        "PIN"/"PIN Code" ("PIN 560001"), and sometimes grouped "560 001".
 * State: written EITHER before the PIN ("Bengaluru, Karnataka 560001") — folded
 *        via the county slot — OR after it ("Bengaluru - 560001, Karnataka") —
 *        folded via a helper `in_state` group inside the postal pattern. Output
 *        state is a 2-letter code (KA, MH, TN, DL, ...).
 * Locality chain: an area/locality (Indiranagar, Koramangala, Bandra West, ...)
 *        commonly sits between the street and the city. Because the PIN is after
 *        the city, the ZA-style trick applies: keep the comma chain in the city
 *        capture, then drop the leading localities and keep the routing city.
 *
 * KNOWN GAPS (see research-in.md): a district written AFTER the PIN
 * ("... - 560034, Bengaluru Urban, Karnataka"), grid tokens (Sector/Block/Phase),
 * and alphanumeric flat ids that LEAD ("C-204, Tower 3, ...") are documented
 * failure modes.
 */

// Trailing thoroughfare types, longest-first handled by the ruleset.
const TYPES = [
  "Highway", "Avenue", "Sarani", "Bazaar", "Circle", "Chowk", "Street",
  "Place", "Drive", "Cross", "Salai", "Marg", "Main", "Lane", "Path", "Road",
  "Gali", "Rd", "St",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  marg: "MARG",
  salai: "SALAI",
  sarani: "SARANI",
  street: "ST", st: "ST",
  place: "PL",
  avenue: "AVE",
  drive: "DR",
  cross: "CROSS",
  main: "MAIN",
  lane: "LN",
  path: "PATH",
  chowk: "CHOWK",
  circle: "CIR",
  highway: "HWY",
  bazaar: "BZR",
  gali: "GALI",
};

// States & union territories -> ISO 3166-2:IN / vehicle-registration code.
// Longest / multi-word first for the alternation.
const REGION_MAP: Record<string, string> = {
  "andaman and nicobar islands": "AN",
  "arunachal pradesh": "AR",
  "andhra pradesh": "AP",
  "himachal pradesh": "HP",
  "madhya pradesh": "MP",
  "uttar pradesh": "UP",
  "tamil nadu": "TN",
  "west bengal": "WB",
  "jammu and kashmir": "JK",
  maharashtra: "MH",
  chhattisgarh: "CG",
  uttarakhand: "UK",
  telangana: "TS",
  karnataka: "KA",
  rajasthan: "RJ",
  jharkhand: "JH",
  meghalaya: "ML",
  nagaland: "NL",
  puducherry: "PY",
  pondicherry: "PY",
  chandigarh: "CH",
  lakshadweep: "LD",
  gujarat: "GJ",
  haryana: "HR",
  manipur: "MN",
  mizoram: "MZ",
  tripura: "TR",
  sikkim: "SK",
  ladakh: "LA",
  kerala: "KL",
  punjab: "PB",
  odisha: "OD",
  assam: "AS",
  bihar: "BR",
  delhi: "DL",
  goa: "GA",
};

const STATES = [
  "Andaman and Nicobar Islands", "Arunachal Pradesh", "Andhra Pradesh",
  "Himachal Pradesh", "Madhya Pradesh", "Uttar Pradesh", "Tamil Nadu",
  "West Bengal", "Jammu and Kashmir", "Maharashtra", "Chhattisgarh",
  "Uttarakhand", "Telangana", "Karnataka", "Rajasthan", "Jharkhand",
  "Meghalaya", "Nagaland", "Puducherry", "Pondicherry", "Chandigarh",
  "Lakshadweep", "Gujarat", "Haryana", "Manipur", "Mizoram", "Tripura",
  "Sikkim", "Ladakh", "Kerala", "Punjab", "Odisha", "Assam", "Bihar",
  "Delhi", "Goa",
];

// Escape literal spaces (free-spacing mode) in the alternation.
const STATE_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const inConfig: EuCountryConfig = {
  code: "in",
  country: "IN",
  countryNames: ["India", "Bharat", "IND", "IN"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // PIN: optional dash / "PIN [Code]" label, 6 digits (optionally grouped
  // "560 001"), then an OPTIONAL trailing state (the "- <PIN>, <State>" form),
  // captured in a helper group folded to `state` in postNormalize.
  postalPattern:
    "(?:[-–—]\\s*)?(?:PIN\\s*(?:Code)?\\s*[:\\-]?\\s*)?(?<postal_code>\\d{3}\\s?\\d{3})" +
    `(?:[\\s,]+(?<in_state>${STATE_ALT}))?`,
  postalFormat: (raw: string) => raw.replace(/\s+/g, ""),

  // number: optional "No."/"#"/"Flat No." lead-in, a plot/door number that may
  // carry slashes or hyphens ("12/3", "1-2-3"), and an optional glued letter.
  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)*)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // The routing city may be preceded by a comma-separated locality chain; keep
  // it together, and let a real state (before the PIN) fall into the county slot.
  cityAllowsCommas: true,
  countyPattern: `(?:${STATE_ALT})`,
  regionMap: REGION_MAP,

  // Apartment / Flat / Floor / Door / Shop, leading the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Floor|Door\\s*No\\.?|Room|Shop|Unit|Plot)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    apartment: "Apartment",
    apt: "Apt",
    floor: "Floor",
    "door no": "Door No",
    room: "Room",
    shop: "Shop",
    unit: "Unit",
    plot: "Plot",
  },

  // A leading building whose name ends in a building keyword ("Sunrise
  // Apartments, MG Road, ...", "Raheja Towers, ...").
  buildingKeywords: [
    "Apartments", "Apartment", "Towers", "Tower", "Complex", "Chambers",
    "Bhavan", "Bhawan", "Plaza", "Building", "Sadan", "Niwas", "House",
    "Arcade", "Mansion",
  ],

  // India Post box forms.
  poBoxNames: ["PO Box", "P.O. Box", "Post Box", "GPO Box", "Post Bag"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "post box": "PO Box",
    "gpo box": "GPO Box",
    "post bag": "Post Bag",
  },

  // Fold the locality chain (city holds "Locality, City" or "Loc1, Loc2, City")
  // to the routing city + dropped leading localities, and fold the helper
  // `in_state` (state written after the PIN) into `state` as a 2-letter code.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.in_state === "string" && parsed.in_state) {
      const key = parsed.in_state.toLowerCase().replace(/\s+/g, " ").trim();
      if (!parsed.state) parsed.state = REGION_MAP[key] ?? parsed.in_state;
      delete parsed.in_state;
    }
    keepLastLocality(parsed);
  },
};

export default inConfig;
