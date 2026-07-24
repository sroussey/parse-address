import type { EuCountryConfig } from "../_eu/types";

/**
 * Saudi Arabia (SA) address configuration.
 *
 * Modelled on the SPL "National Address" (Al-Aw'nan al-Watani / Wasel). A full
 * National Address has six parts:
 *   Building Number (4 digits) · Street Name · Secondary/Additional Number
 *   (4 digits) · District (Hayy) · City · Postal Code (5 digits).
 * The romanized business form used here keeps the machine-routable core:
 *   "<building no> <Street Name>, <District>, <City> <NNNNN[-NNNN]>"
 *   e.g. "8228 King Fahd Road, Al Olaya, Riyadh 12214".
 *
 * Order: BUILDING NUMBER first (bare, or "Building No. 8228"), then the street
 *        name + trailing English type suffix (Road/Street/...). Many arteries are
 *        named ("King Fahd Road", "Prince Sultan Street", "Olaya Street").
 * Type:  trailing suffix (Road, Street, Avenue, Boulevard, ...); many romanized
 *        Arabic names carry no type and parse type-less.
 * Postcode: 5 digits LAST, after the city (after-city), with an OPTIONAL 4-digit
 *        additional-number extension kept attached ("12214-2937").
 * District (Hayy): a sub-city locality that sits BEFORE the city. The engine has
 *        one city slot, so the district+city chain is captured together and the
 *        LAST locality (the routing city) is kept; the earlier district(s) are
 *        dropped (recorded so the token guard does not score them as lost).
 * Region (Province): optional -> state (Riyadh Region, Makkah Region, Eastern
 *        Province, ...); usually omitted because the postcode already routes.
 *
 * PO Box remains extremely common: "P.O. Box 2727, Riyadh 11461".
 */

const TYPES = [
  "Boulevard", "Street", "Avenue", "Road", "Highway", "Expressway",
  "Blvd", "Rd", "St", "Ave", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  road: "RD", rd: "RD",
  highway: "HWY", hwy: "HWY",
  expressway: "EXPY",
};

// 13 administrative regions. Only the EXPLICITLY region-marked spellings are
// modelled ("... Region" / "... Province" / distinctive romanizations), because
// most bare region names equal their principal city (Makkah, Tabuk, Hail, Jazan,
// Najran, Al Bahah, ...) and would otherwise steal the city slot.
const REGIONS = [
  "Riyadh Region", "Makkah Region", "Madinah Region", "Al Madinah Region",
  "Eastern Province", "Ash Sharqiyah", "Al Qassim Region", "Qassim Region",
  "Hail Region", "Ha'il Region", "Tabuk Region", "Northern Borders Region",
  "Al Hudud ash Shamaliyah", "Jazan Region", "Najran Region", "Al Bahah Region",
  "Al Jawf Region", "Asir Region", "Aseer Region",
];
const REGION_ALT = REGIONS.map((s) => s.replace(/ /g, "\\s+")).join("|");

const REGION_MAP: Record<string, string> = {
  "riyadh region": "01",
  "makkah region": "02",
  "madinah region": "03", "al madinah region": "03",
  "eastern province": "04", "ash sharqiyah": "04",
  "al qassim region": "05", "qassim region": "05",
  "hail region": "06", "ha'il region": "06",
  "tabuk region": "07",
  "northern borders region": "08", "al hudud ash shamaliyah": "08",
  "jazan region": "09",
  "najran region": "10",
  "al bahah region": "11",
  "al jawf region": "12",
  "asir region": "14", "aseer region": "14",
};

export const saConfig: EuCountryConfig = {
  code: "sa",
  country: "SA",
  countryNames: [
    "Saudi Arabia", "Kingdom of Saudi Arabia", "KSA", "SAU", "SA",
  ],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English types echoed as written (Road, Street, Blvd).
  normalizeTypeCase: false,

  // 5-digit postcode with an OPTIONAL 4-digit additional-number extension.
  postalPattern: "(?<postal_code>\\d{5}(?:\\s*-\\s*\\d{4})?)",
  postalFormat: (raw: string) => raw.replace(/\s*-\s*/, "-").replace(/\s+/g, "").trim(),

  // Building number: bare, or introduced by "Building No."/"Bldg" (the label is
  // captured as a drop group so it is consumed but not emitted, and the "No"
  // number-marker is skipped). 1-5 digits (National-Address building numbers are
  // 4 digits; short civic numbers also occur).
  houseNumberPattern:
    "(?:(?<drop>Building|Bldg)\\.?\\s+(?:No\\.?\\s*)?)?(?<number>\\d{1,5})(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "District, City" locality chain together, then drop the earlier
  // district(s) in postNormalize, keeping the routing city. Only a real region
  // name may land in the state slot (so an ordinary district is not mis-split).
  cityAllowsCommas: true,
  countyPattern: `(?:${REGION_ALT})`,
  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: REGION_MAP,

  // The city capture may hold "District, City" (rarely "District, City, Region").
  // Keep the LAST non-region locality as the city; drop the earlier district(s).
  // When a region trails the postcode ("Riyadh 13515, Riyadh Region"), the shared
  // after-city grammar cannot separate the code, so lift a trailing 5(+4)-digit
  // postcode off the kept city here.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      const last = (parts[parts.length - 1] ?? "").toLowerCase();
      if (REGION_MAP[last]) {
        if (!parsed.state) parsed.state = REGION_MAP[last];
        parts.pop();
      }
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
    if (typeof parsed.city === "string" && !parsed.postal_code) {
      const m = /^(.*?)\s+(\d{5}(?:-\d{4})?)$/.exec(parsed.city.trim());
      if (m) {
        parsed.city = m[1];
        parsed.postal_code = m[2];
      }
    }
  },

  // Unit / floor / office lead-in (before the number, as in GB).
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Unit|Suite|Floor|Office|Villa|Shop)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    unit: "Unit",
    suite: "Suite",
    floor: "Floor",
    office: "Office",
    villa: "Villa",
    shop: "Shop",
  },

  // Saudi Post / SPL box forms.
  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default saConfig;
