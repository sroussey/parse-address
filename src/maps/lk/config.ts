import type { EuCountryConfig } from "../_eu/types";

/**
 * Sri Lanka (LK) address configuration.
 *
 * Order: house NUMBER first (often an assessment number "478", "56/2", or a
 *        "No." lead-in "No. 123"), then a SUFFIX-type thoroughfare name
 *        ("Galle Road", "Baseline Road", "Bauddhaloka Mawatha", "1st Lane").
 * Type: trailing English/Sinhala suffix -- Road/Rd, Street/St, Lane, Avenue/Ave,
 *        Place, Mawatha (Sinhala avenue/road, romanised), Terrace, Crescent,
 *        Junction, Drive, Row, Vidiya (Sinhala street), Path. Many roads carry
 *        no type ("Galle Face", type-less -> dropped null).
 * Postcode: 5-digit numeric, written AFTER the city ("Kandy 20000",
 *        "Maharagama 10230", "Colombo 00300"). Leading zeros are significant
 *        (Colombo codes start 00xxx), so it is captured as `\d{5}` verbatim.
 * Province: the 9 provinces (Western, Central, Southern, ...) -> `state` as a
 *        2-letter code (WP/CP/SP/...). Written EITHER before the postcode (folded
 *        via the county slot) OR after it (helper `lk_state` group inside the
 *        postal pattern). District/suburb names are localities, not the province.
 * Locality chain: a suburb/area (Bambalapitiya, Nugegoda, Dehiwala, ...) commonly
 *        sits between the street and the city. Because the postcode is after the
 *        city, the IN/ZA trick applies: keep the comma chain in the city capture,
 *        then drop the leading localities and keep the routing city.
 *
 * KNOWN GAPS (see research-lk.md): the Colombo district-number written INTO the
 * city ("Colombo 3" / "Colombo 03"); a glued "City-NN" ward-style suffix; and
 * native Sinhala/Tamil-script addresses are documented failure modes.
 */

// Trailing thoroughfare types, longest / multi-word first (also handled by the ruleset).
const TYPES = [
  "Cross Street", "Mawatha", "Terrace", "Crescent", "Junction", "Avenue",
  "Street", "Place", "Drive", "Vidiya", "Road", "Lane", "Path", "Row",
  "Mw", "Rd", "St", "Ave",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
  "cross street": "CRST",
  lane: "LN",
  avenue: "AVE", ave: "AVE",
  place: "PL",
  mawatha: "MW", mw: "MW",
  terrace: "TER",
  crescent: "CRES",
  junction: "JCT",
  drive: "DR",
  row: "ROW",
  vidiya: "VID",
  path: "PATH",
};

// 9 provinces -> ISO 3166-2:LK-style 2-letter code. Multi-word longest-first.
const REGION_MAP: Record<string, string> = {
  "north western": "NW",
  "north central": "NC",
  "sabaragamuwa": "SG",
  "western": "WP",
  "central": "CP",
  "southern": "SP",
  "northern": "NP",
  "eastern": "EP",
  "uva": "UV",
};

const PROVINCES = [
  "North Western", "North Central", "Sabaragamuwa", "Western", "Central",
  "Southern", "Northern", "Eastern", "Uva",
];

// Accept an optional trailing "Province" word after the name.
const PROV_ALT =
  "(?:" + PROVINCES.map((s) => s.replace(/ /g, "\\s+")).join("|") + ")(?:\\s+Province)?";

export const lkConfig: EuCountryConfig = {
  code: "lk",
  country: "LK",
  countryNames: ["Sri Lanka", "LKA", "LK", "Ceylon"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode after the city, then an OPTIONAL trailing province captured
  // in a helper group folded to `state` in postNormalize ("Kandy 20000, Central
  // Province").
  postalPattern:
    `(?<postal_code>\\d{5})(?:[\\s,]+(?<lk_state>${PROV_ALT}))?`,

  // Optional "No."/"#" lead-in, an assessment number that may carry a slash or
  // hyphen ("56/2", "12-3"), and an optional glued letter suffix.
  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)*)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the suburb/area chain together; the routing city is the LAST locality
  // before the province/postcode (postNormalize drops the earlier ones). A real
  // province written before the postcode falls into the county slot.
  cityAllowsCommas: true,
  countyPattern: `(?:${PROV_ALT})`,
  regionMap: REGION_MAP,

  // Flat / Apartment / Floor / Level / Unit / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Floor|Level|Unit|Suite|Room)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    apartment: "Apartment", apt: "Apt",
    floor: "Floor",
    level: "Level",
    unit: "Unit",
    suite: "Suite",
    room: "Room",
  },

  // A leading building whose name ends in a building keyword ("World Trade
  // Centre, ...", "Liberty Plaza, ...").
  buildingKeywords: [
    "Towers", "Tower", "Building", "Buildings", "Centre", "Center", "Complex",
    "Chambers", "Plaza", "Arcade", "Mawatha House", "House",
  ],

  // Sri Lanka Post box forms.
  poBoxNames: ["PO Box", "P.O. Box", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "post box": "PO Box",
  },

  // Fold the helper `lk_state` (province after the postcode) into `state`, then
  // drop the leading suburb chain, keeping the routing city.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.lk_state === "string" && parsed.lk_state) {
      const key = parsed.lk_state
        .toLowerCase()
        .replace(/\s+province$/, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!parsed.state) parsed.state = REGION_MAP[key] ?? parsed.lk_state;
      delete parsed.lk_state;
    }
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },
};

export default lkConfig;
