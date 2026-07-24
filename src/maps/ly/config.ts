import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Libya (LY) address configuration — Latin (romanized) form.
 *
 * THERE IS NO POSTCODE. Libya Post operates no functioning national postal-code
 * system; mail is routed by street/area + city (and PO box). The postal pattern
 * is a never-match sentinel, so every address parses through the postcode-ABSENT
 * place branch.
 *
 * Language: romanized Arabic, with a French/Italian colonial layer. The dominant
 *   form is an English street suffix ("Omar Al-Mukhtar Street, Tripoli"); the
 *   Arabic generic "Sharia"/"Shari"/"Share" and French "Rue"/"Avenue" also appear
 *   as a PREFIX ("Sharia Al-Jumhuria", "Rue de la Republique") and are peeled to
 *   `type` in postNormalize when the suffix grammar found no English type.
 * Order: house number FIRST, usually ABSENT.
 * Area/district = city: a district ("Al-Andalus", "Ben Ashour", "Gargaresh") may
 *   precede the routing city (Tripoli, Benghazi, Misrata, ...); the LAST locality
 *   is kept as the city and any earlier district is dropped. There is no
 *   governorate/state field in a romanized Libyan address.
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

// Romanized Arabic generic + French colonial prefix "street/road", written BEFORE
// the name. Peeled into `type` when no trailing English suffix type was captured.
const PREFIX_TYPE_RE =
  /^(El\s+Sharia|Sharia|Sharie|Shari|Sharaa|Share|Rue|Avenue|Boulevard)\s+(.+)$/i;

export const lyConfig: EuCountryConfig = {
  code: "ly",
  country: "LY",
  countryNames: ["Libya", "State of Libya", "Libyan Arab Jamahiriya", "LBY", "LY"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // NO postal code: never-match sentinel -> postcode-absent place branch.
  postalPattern: "(?<postal_code>(?!x)x)",

  // Building number 1-4 digits, optional single-letter index; usually absent.
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // No state field: never-match county sentinel. Keep the district+city chain
  // together and drop earlier districts in postNormalize.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  postNormalize: (parsed: Record<string, any>) => {
    // Peel a romanized/French prefix type into `type` when no English suffix
    // type was captured.
    if (!parsed.type && typeof parsed.street === "string") {
      const m = PREFIX_TYPE_RE.exec(parsed.street);
      if (m && m[2]) {
        parsed.type = m[1];
        parsed.street = m[2];
      }
    }
    // Keep the last locality as the routing city, dropping earlier districts.
    keepLastLocality(parsed);
  },

  // Flat / floor / apartment / building lead-in.
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

export default lyConfig;
