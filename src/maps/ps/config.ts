import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Palestine (PS) address configuration.
 *
 * Modelled on the romanized/Latin business form used in SEC / international
 * filings. Native Arabic (RTL) script is OUT OF SCOPE (marked __skip).
 *
 * THERE IS NO POSTCODE in general use, so the postal pattern is a never-match
 * sentinel and every address parses through the postcode-ABSENT branch of the
 * place grammar. Small-endian.
 *
 * Two dominant forms:
 *   1. PO Box:    "P.O. Box 4, Ramallah"  ->  sec_unit PO Box + city.
 *   2. Physical:  "Rukab Street, Al-Masyoun, Ramallah"
 *                 -> street ("Rukab" + type "Street") + city (Ramallah) with the
 *                    quarter (Al-Masyoun) dropped.
 *
 * Order: number-street (the house number is usually absent). A labelled
 *        building/floor/apartment/office may lead as the secondary unit.
 * Type:  trailing English suffix (Street, Road, Avenue, Boulevard, Highway).
 *        The Arabic generic appears as a PREFIX ("Shari Al-Quds", "Sharia
 *        Jaffa"); with one type position and the English suffix primary, those
 *        parse as whole type-less street names.
 * city  = the routing city (Ramallah, Nablus, Hebron, Bethlehem, Gaza, Jenin,
 *        Khan Yunis, Rafah, ...). A leading quarter (Al-Masyoun, Rafidia, ...) is
 *        captured with the city and then dropped.
 * state = the GOVERNORATE. The governorate names equal their principal cities, so
 *        the state pattern matches ONLY the explicit "... Governorate" spelling,
 *        plus the two territory names ("West Bank", "Gaza Strip") which are
 *        distinct from any routing city -- keeping it DISJOINT.
 * Postcode: none (never-match sentinel).
 */

const TYPES = [
  "Boulevard", "Highway", "Street", "Avenue", "Road",
  "Blvd", "Hwy", "St", "Ave", "Rd",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  highway: "HWY", hwy: "HWY",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  road: "RD", rd: "RD",
};

// Governorates that equal a city need the explicit marker; the two distinct
// territory names are matched bare.
const GOV_MARKED = [
  "Jenin", "Tubas", "Tulkarm", "Nablus", "Qalqilya", "Salfit",
  "Ramallah and al-Bireh", "Ramallah", "Jericho", "Jerusalem", "Bethlehem",
  "Hebron", "North Gaza", "Gaza", "Deir al-Balah", "Khan Yunis", "Rafah",
];
const GOV_BARE = ["West Bank", "Gaza Strip"];
const esc = (s: string) => s.replace(/ /g, "\\s+");
const GOV_ALT =
  "(?:(?:" + GOV_MARKED.map(esc).join("|") + ")\\s+Governorate|" +
  GOV_BARE.map(esc).join("|") + ")";

const REGION_MAP: Record<string, string> = {
  "jenin governorate": "JEN",
  "tubas governorate": "TBS",
  "tulkarm governorate": "TKM",
  "nablus governorate": "NBS",
  "qalqilya governorate": "QQA",
  "salfit governorate": "SLT",
  "ramallah governorate": "RBH",
  "ramallah and al-bireh governorate": "RBH",
  "jericho governorate": "JRH",
  "jerusalem governorate": "JEM",
  "bethlehem governorate": "BTH",
  "hebron governorate": "HBN",
  "north gaza governorate": "NGZ",
  "gaza governorate": "GZA",
  "deir al-balah governorate": "DEB",
  "khan yunis governorate": "KYS",
  "rafah governorate": "RFH",
  "west bank": "WB",
  "gaza strip": "GZ",
};

export const psConfig: EuCountryConfig = {
  code: "ps",
  country: "PS",
  countryNames: [
    "Palestine", "State of Palestine", "Palestinian Territory",
    "Palestinian Territories", "PSE", "PS",
  ],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // NO postal code: never-match sentinel -> postcode-absent place branch.
  postalPattern: "(?<postal_code>(?!x)x)",

  // Optional house number (usually absent), bare or marked "No.".
  houseNumberPattern:
    "(?:No\\.?\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "Quarter, City" chain together; drop the earlier quarter(s), keeping
  // the routing city. Only a governorate / territory token lands in the state slot.
  cityAllowsCommas: true,
  countyPattern: GOV_ALT,
  regionPattern: `(?<state>${GOV_ALT})`,
  regionMap: REGION_MAP,

  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      const last = (parts[parts.length - 1] ?? "").toLowerCase();
      if (!parsed.state && REGION_MAP[last]) {
        parsed.state = REGION_MAP[last];
        parts.pop();
      }
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        if (parts.length > 1) parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  // Building / floor / apartment / office lead-in.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Building|Bldg\\.?|Floor|Apartment|Apt\\.?|Flat|Office|Suite|Shop|Unit)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    building: "Building",
    bldg: "Building",
    floor: "Floor",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    office: "Office",
    suite: "Suite",
    shop: "Shop",
    unit: "Unit",
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

export default psConfig;
