import type { EuCountryConfig } from "../_eu/types";

/**
 * Lebanon (LB) address configuration.
 *
 * Modelled on the romanized/Latin business form used in SEC / international
 * filings. Native Arabic (RTL) script is OUT OF SCOPE (marked __skip). Lebanese
 * addressing is largely AREA-based: a national postal code (4-digit + optional
 * 4-digit) exists but is rarely used, so the postcode is OPTIONAL and usually
 * ABSENT. Small-endian order.
 *
 * Two dominant forms:
 *   1. PO Box:    "P.O. Box 11-3644, Beirut"  ->  sec_unit PO Box (the Lebanese
 *                 zone-hyphen box number kept intact) + city.
 *   2. Physical:  "Sofil Center, Charles Malek Avenue, Achrafieh, Beirut"
 *                 -> building ("Sofil Center") + street ("Charles Malek" + type
 *                    "Avenue") + city (Beirut) with the quarter (Achrafieh)
 *                    dropped.
 *
 * Order: number-street (the house number is usually absent). A named building
 *        may LEAD ("Azarieh Building, ...", "Starco Center, ..."); a labelled
 *        floor/apartment/office leads as the secondary unit.
 * Type:  trailing English suffix (Street, Road, Avenue, Boulevard, Highway).
 *        Many arteries use the French/Arabic generic as a PREFIX ("Rue Gouraud",
 *        "Corniche El Nahr"); with one type position and the English suffix
 *        primary, those parse as whole type-less street names.
 * city  = the routing city (Beirut, Tripoli, Sidon, Jounieh, Byblos, Zahle, ...).
 *        A leading quarter (Achrafieh, Gemmayzeh, Verdun, Manara) is captured
 *        with the city and then dropped.
 * state = the GOVERNORATE (muhafazah). The compound names (Mount Lebanon, Beqaa,
 *        Baalbek-Hermel) are matched bare; the names that equal a city (Beirut,
 *        Nabatieh, Akkar) or are bare compass words (North, South) require the
 *        explicit "... Governorate" / "... Lebanon" spelling to stay DISJOINT
 *        from the routing cities.
 * Postcode: OPTIONAL 4-digit (+ optional 4-digit extension), after the city.
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

// Governorate names that equal a city, or are bare compass words, need the
// explicit marker; the distinct compound names are matched bare.
const GOV_MARKED = [
  "Beirut", "Nabatieh", "North", "South", "Akkar", "Mount Lebanon",
  "Beqaa", "Bekaa", "Baalbek-Hermel",
];
const GOV_BARE = [
  "Mount Lebanon", "Beqaa", "Bekaa", "Baalbek-Hermel",
  "North Lebanon", "South Lebanon",
];
const esc = (s: string) => s.replace(/ /g, "\\s+");
const GOV_ALT =
  "(?:(?:" + GOV_MARKED.map(esc).join("|") + ")\\s+Governorate|" +
  GOV_BARE.map(esc).join("|") + ")";

const REGION_MAP: Record<string, string> = {
  "beirut governorate": "BA",
  "mount lebanon": "JL", "mount lebanon governorate": "JL",
  "north lebanon": "AS", "north governorate": "AS",
  "south lebanon": "JA", "south governorate": "JA",
  "nabatieh governorate": "NA",
  "akkar governorate": "AK",
  beqaa: "BI", bekaa: "BI", "beqaa governorate": "BI", "bekaa governorate": "BI",
  "baalbek-hermel": "BH", "baalbek-hermel governorate": "BH",
};

export const lbConfig: EuCountryConfig = {
  code: "lb",
  country: "LB",
  countryNames: ["Lebanon", "Lebanese Republic", "LBN", "LB"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // OPTIONAL 4-digit postcode with an optional 4-digit extension ("2038 3054").
  postalPattern: "(?<postal_code>\\d{4}(?:\\s+\\d{4})?)",

  // Optional house number (usually absent), bare or marked "No.".
  houseNumberPattern:
    "(?:No\\.?\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "Quarter, City" chain together; drop the earlier quarter(s) in
  // postNormalize, keeping the routing city. Only a governorate token lands in
  // the state slot.
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

  // Named building leading the line ("Azarieh Building, ...", "Starco Center").
  buildingKeywords: [
    "Building", "Tower", "Center", "Centre", "Plaza", "Residence", "Complex",
  ],

  // Floor / apartment / office / (numbered) building lead-in.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Floor|Apartment|Apt\\.?|Flat|Office|Suite|Building|Bldg\\.?|Shop|Unit)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    floor: "Floor",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    office: "Office",
    suite: "Suite",
    building: "Building",
    bldg: "Building",
    shop: "Shop",
    unit: "Unit",
  },

  // LibanPost boxes carry a zone-hyphen number ("11-3644").
  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default lbConfig;
