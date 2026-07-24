import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Egypt (EG) address configuration — Latin (romanized) form.
 *
 * Language: romanized Arabic. The dominant written form uses an English street
 *   suffix ("Talaat Harb Street", "26 July Street"); the Arabic generic
 *   "Sharia"/"Shari"/"Share"/"El Sharia" ("street") also appears as a PREFIX
 *   ("Sharia Qasr El Nil"), and French "Avenue"/"Corniche" survive from the
 *   colonial layer. Numbered streets/roads are very common in the planned
 *   districts ("Road 9", "Street 100" in Maadi).
 * Order: house number FIRST, then the street; often ABSENT (many labels give the
 *   street/area only). A leading "26" in "26 July Street" is read as a house
 *   number by the grammar (documented limitation — the street is really named
 *   "26 July").
 * Type: trailing English suffix (Street/Road/Avenue/...). A leading Arabic
 *   generic ("Sharia X") is peeled to `type` = "Sharia" in postNormalize when no
 *   suffix type was found. Numbered arteries ("Road 9") carry the type-word first
 *   and parse as a whole type-less name.
 * Area/district = city (Maadi, Zamalek, Nasr City, Downtown, Heliopolis, ...); an
 *   earlier district in a district+area chain is dropped, keeping the routing one.
 * Governorate = state (Cairo, Giza, Alexandria, ...), a restricted list disjoint
 *   from the districts, kept spelled out.
 * Postcode: 5 digits, NEW and low-adoption, usually ABSENT; when present it sits
 *   after the city (after-city).
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

// The 27 governorates -> state. Multi-word names have their spaces escaped for
// free-spacing mode. This list is intentionally the ONLY thing allowed into the
// trailing state slot, so an ordinary district is never mis-split as a state.
const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Qalyubia", "Port Said", "Suez", "Dakahlia",
  "Sharqia", "Gharbia", "Monufia", "Beheira", "Kafr El Sheikh", "Damietta",
  "Ismailia", "Fayoum", "Beni Suef", "Minya", "Asyut", "Sohag", "Qena",
  "Luxor", "Aswan", "Red Sea", "New Valley", "Matrouh", "North Sinai",
  "South Sinai",
];
const GOV_ALT = GOVERNORATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

// Romanized Arabic generic "street" written as a PREFIX. Peeled off the street
// name into `type` when the suffix grammar found no English type.
const SHARIA_RE = /^(El\s+Sharia|Sharia|Sharie|Shari|Sharaa|Share)\s+(.+)$/i;

export const egConfig: EuCountryConfig = {
  code: "eg",
  country: "EG",
  countryNames: ["Egypt", "Arab Republic of Egypt", "EGY", "EG"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English/romanized types echoed as written (Street, Road, Sharia).
  normalizeTypeCase: false,

  // 5-digit postcode (low adoption, often absent), after the city.
  postalPattern: "(?<postal_code>\\d{5})",

  // Building number 1-4 digits (a 5-digit run is always a postcode), optional
  // single-letter repetition index. Number-street order keeps digits legal inside
  // the street name, so a numbered road ("Road 9") stays in the street slot.
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "[District,] Area, Governorate" chain together; only a real
  // governorate lands in state. postNormalize peels a leading "Sharia" prefix and
  // drops any earlier district, keeping the routing area as the city.
  cityAllowsCommas: true,
  countyPattern: `(?:${GOV_ALT})`,

  postNormalize: (parsed: Record<string, any>) => {
    // Peel a romanized "Sharia X" prefix into type when no English suffix type
    // was captured.
    if (!parsed.type && typeof parsed.street === "string") {
      const m = SHARIA_RE.exec(parsed.street);
      if (m && m[2]) {
        parsed.type = m[1];
        parsed.street = m[2];
      }
    }
    // Drop earlier district(s), keep the last locality as the routing city.
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  // Flat / floor / apartment / building lead-in ("Apartment 5", "Floor 3").
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Floor|Building|Bldg\\.?|Villa|Office|Suite|Unit|Shop)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
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

export default egConfig;
