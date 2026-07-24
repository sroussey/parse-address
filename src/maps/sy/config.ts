import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Syria (SY) address configuration.
 *
 * Modelled on the romanized/Latin business form used in SEC / international
 * filings. Native Arabic (RTL) script is OUT OF SCOPE (marked __skip).
 *
 * THERE IS NO POSTCODE in practice: a national code system exists on paper but is
 * not used, so the postal pattern is a never-match sentinel and every address
 * parses through the postcode-ABSENT branch of the place grammar. Small-endian.
 *
 * Two dominant forms:
 *   1. PO Box:    "P.O. Box 3320, Damascus"  ->  sec_unit PO Box + city.
 *   2. Physical:  "Baghdad Street, Al-Malki, Damascus"
 *                 -> street ("Baghdad" + type "Street") + city (Damascus) with the
 *                    quarter (Al-Malki) dropped.
 *
 * Order: number-street (the house number is usually absent). A labelled
 *        building/floor/apartment may lead as the secondary unit.
 * Type:  trailing English suffix (Street, Road, Avenue, Boulevard, Highway).
 *        The Arabic generic appears as a PREFIX ("Shari Al-Thawra", "Sharia
 *        Baghdad"); with one type position and the English suffix primary, those
 *        parse as whole type-less street names.
 * city  = the routing city (Damascus, Aleppo, Homs, Hama, Latakia, Tartus, ...).
 *        A leading quarter (Al-Malki, Abu Rummaneh, Mezzeh, Al-Aziziyah) is
 *        captured with the city and then dropped.
 * state = the GOVERNORATE. Because the bare governorate names equal their capital
 *        cities (Aleppo, Homs, Hama, Latakia, Tartus, Idlib, Daraa, ...), the
 *        state pattern matches ONLY the explicit "... Governorate" spelling, plus
 *        the distinct "Rif Dimashq" (Damascus countryside), keeping it DISJOINT
 *        from the routing cities.
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

// 14 governorates. The names that equal a city require the explicit marker; the
// distinct "Rif Dimashq" is matched bare.
const GOV_MARKED = [
  "Damascus", "Aleppo", "Homs", "Hama", "Latakia", "Tartus", "Idlib",
  "Deir ez-Zor", "Raqqa", "Al-Hasakah", "Hasakah", "Daraa", "As-Suwayda",
  "Suwayda", "Quneitra", "Rif Dimashq",
];
const GOV_BARE = ["Rif Dimashq"];
const esc = (s: string) => s.replace(/ /g, "\\s+");
const GOV_ALT =
  "(?:(?:" + GOV_MARKED.map(esc).join("|") + ")\\s+Governorate|" +
  GOV_BARE.map(esc).join("|") + ")";

const REGION_MAP: Record<string, string> = {
  "damascus governorate": "DI",
  "rif dimashq": "RD", "rif dimashq governorate": "RD",
  "aleppo governorate": "HL",
  "homs governorate": "HI",
  "hama governorate": "HM",
  "latakia governorate": "LA",
  "tartus governorate": "TA",
  "idlib governorate": "ID",
  "deir ez-zor governorate": "DY",
  "raqqa governorate": "RA",
  "al-hasakah governorate": "HA", "hasakah governorate": "HA",
  "daraa governorate": "DR",
  "as-suwayda governorate": "SU", "suwayda governorate": "SU",
  "quneitra governorate": "QU",
};

export const syConfig: EuCountryConfig = {
  code: "sy",
  country: "SY",
  countryNames: ["Syria", "Syrian Arab Republic", "SYR", "SY"],

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
  // the routing city. Only a governorate token lands in the state slot.
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

export default syConfig;
