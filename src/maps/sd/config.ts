import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Sudan (SD) address configuration — Latin (romanized) form.
 *
 * Language: romanized Arabic. The dominant form is an English street suffix
 *   ("Africa Street", "Airport Road") with numbered planned streets ("Street 15",
 *   "Street 41"); the Arabic generic "Sharia"/"Shari"/"Share" also appears as a
 *   PREFIX ("Sharia Al-Jamhouria") and is peeled to `type` in postNormalize when
 *   the suffix grammar found no English type.
 * Order: house number FIRST, usually ABSENT.
 * Area/district = city: a block/district ("Al-Amarat", "Al-Riyadh", "Burri",
 *   "Al-Sahafa") sits before the routing city and is captured as the city; an
 *   earlier district in a chain is dropped.
 * Governorate (wilaya) = state: Khartoum, Gezira, Kassala, Red Sea, River Nile,
 *   ... — a restricted list DISJOINT from the districts, kept spelled out.
 * Postcode: 5 digits, RARE and usually ABSENT; after the city when present.
 * PO box: "PO Box" / "P.O. Box".
 */

const TYPES = [
  "Boulevard", "Corniche", "Street", "Avenue", "Square", "Road", "Highway",
  "Blvd", "Ave", "Rd", "St",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  corniche: "COR",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  square: "SQ",
  road: "RD", rd: "RD",
  highway: "HWY",
};

// The 18 states (wilayat) -> state. Multi-word names have their spaces escaped
// for free-spacing mode. This is the ONLY thing allowed into the trailing state
// slot, so an ordinary district is never mis-split as a state.
const STATES = [
  "Khartoum", "Gezira", "Al Jazirah", "Kassala", "Red Sea", "River Nile",
  "Northern", "White Nile", "Blue Nile", "North Kordofan", "South Kordofan",
  "West Kordofan", "North Darfur", "South Darfur", "West Darfur",
  "East Darfur", "Central Darfur", "Gedaref", "Al Qadarif", "Sennar",
];
const STATE_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

// Romanized Arabic generic "street", written BEFORE the name. Peeled into `type`
// when no trailing English suffix type was captured.
const SHARIA_RE = /^(El\s+Sharia|Sharia|Sharie|Shari|Sharaa|Share)\s+(.+)$/i;

export const sdConfig: EuCountryConfig = {
  code: "sd",
  country: "SD",
  countryNames: ["Sudan", "Republic of the Sudan", "SDN", "SD"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode (rare, often absent), after the city.
  postalPattern: "(?<postal_code>\\d{5})",

  // Building number 1-4 digits, optional single-letter index; usually absent.
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "[District,] Area, State" chain together; only a real state lands in
  // the state slot. postNormalize peels a leading "Sharia" and drops any earlier
  // district, keeping the routing area as the city.
  cityAllowsCommas: true,
  countyPattern: `(?:${STATE_ALT})`,

  postNormalize: (parsed: Record<string, any>) => {
    if (!parsed.type && typeof parsed.street === "string") {
      const m = SHARIA_RE.exec(parsed.street);
      if (m && m[2]) {
        parsed.type = m[1];
        parsed.street = m[2];
      }
    }
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Floor|Building|Bldg\\.?|Villa|Office|Suite|Unit|Shop|House)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    floor: "Floor",
    building: "Building",
    bldg: "Building",
    villa: "Villa",
    office: "Office",
    suite: "Suite",
    unit: "Unit",
    shop: "Shop",
    house: "House",
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

export default sdConfig;
