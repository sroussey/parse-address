import type { EuCountryConfig } from "../_eu/types";

/**
 * Guyana (GY) address configuration.
 *
 * The only English-speaking country in South America: British-derived
 * convention, house NUMBER first, street name + TRAILING type
 * ("15 Church Street"). Type echoed verbatim (incl. Rd/Ave/Dr). Number optional.
 *
 * Postcode: Guyana has NO postcode in everyday use (a 7-digit scheme exists on
 * paper but is effectively never written), so `postalPattern` is a never-match
 * sentinel and the layout is after-city.
 *
 * Locality chain: an address usually carries a WARD / neighbourhood
 * ("Kingston", "Cummingsburg", "Werk-en-Rust", "Bel Air Park") before the post
 * town ("Georgetown", "New Amsterdam", "Linden"). Like the ZA suburb+city case,
 * both localities precede the (absent) postcode; `cityAllowsCommas` keeps the
 * chain together and `postNormalize` keeps the LAST locality as the routing city
 * and drops the leading ward(s).
 *
 * State: the administrative REGION is optional -> state. It is written as a
 * number ("Region 4"), an official name ("Demerara-Mahaica"), or a colloquial
 * coastal band ("East Bank Demerara"). County is restricted to that region list
 * so an ordinary ward is never mis-read as a region.
 *
 * PO Box: "P.O. Box 123" -- plain numeric.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close", "Court", "Place",
  "Crescent", "Terrace", "Boulevard", "Way", "Gardens", "Grove", "Walk",
  "Heights", "Park", "Circle", "Row", "Hill", "Highway", "Dam", "Scheme",
  "Alley", "Path",
  // abbreviations (kept verbatim)
  "Rd", "Ave", "Av", "Dr", "St", "Cres", "Blvd", "Hwy", "Pl", "Cl", "Ln", "Gdns",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  av: "AVE", lane: "LN", ln: "LN", drive: "DR", dr: "DR", close: "CL", cl: "CL",
  court: "CT", place: "PL", pl: "PL", crescent: "CRES", cres: "CRES",
  terrace: "TER", boulevard: "BLVD", blvd: "BLVD", way: "WAY", gardens: "GDNS",
  gdns: "GDNS", grove: "GR", walk: "WLK", heights: "HTS", park: "PK",
  circle: "CIR", row: "ROW", hill: "HL", highway: "HWY", hwy: "HWY",
  dam: "DAM", scheme: "SCHM", alley: "ALY", path: "PATH",
};

// The 10 administrative regions: number form ("Region 4"), official name, and
// the common coastal-band names actually written on mail.
const REGION_NAMES = [
  "Barima-Waini", "Pomeroon-Supenaam", "Essequibo Islands-West Demerara",
  "Demerara-Mahaica", "Mahaica-Berbice", "East Berbice-Corentyne",
  "Cuyuni-Mazaruni", "Potaro-Siparuni", "Upper Takutu-Upper Essequibo",
  "Upper Demerara-Berbice",
  // colloquial coastal bands written in day-to-day addresses
  "East Bank Demerara", "East Coast Demerara", "West Bank Demerara",
  "West Coast Demerara", "East Bank Essequibo", "West Coast Berbice",
];
const REGION_ALT = REGION_NAMES.concat(["Region\\s+\\d+"])
  .map((s) => s.replace(/ /g, "\\s+"))
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {};
for (const r of REGION_NAMES) REGION_MAP[r.toLowerCase()] = r;

export const gyConfig: EuCountryConfig = {
  code: "gy",
  country: "GY",
  countryNames: ["Guyana", "GUY", "GY"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcode: a never-match sentinel so the tail is (ward,) city (, region).
  postalPattern: "(?<postal_code>(?!x)x)",
  // Number first: plain, range ("15-17"), optional glued letter ("15A"), "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // Keep the ward+town locality chain together; the routing city is the LAST
  // locality (postNormalize drops the earlier ward(s)).
  cityAllowsCommas: true,
  // Only a real region may land in the state slot, so a "ward, town" pair is
  // never mis-split with the town taken as region.
  countyPattern: `(?:${REGION_ALT})`,

  // Optional region after the city -> state.
  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: REGION_MAP,

  // The city capture may hold "Ward, Town" (and rarely "Ward, Town, Region");
  // keep the last non-region locality as the city and drop the leading ward(s).
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.indexOf(",") !== -1) {
      const parts = parsed.city
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      const last = parts.length ? parts[parts.length - 1]! : "";
      if (REGION_MAP[last.toLowerCase()]) {
        if (!parsed.state) parsed.state = REGION_MAP[last.toLowerCase()];
        parts.pop();
      }
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Unit|Suite|Shop|Lot|Room|Floor|Block)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", flat: "Flat", unit: "Unit",
    suite: "Suite", shop: "Shop", lot: "Lot", room: "Room", floor: "Floor",
    block: "Block",
  },

  poBoxNames: ["P.O. Box", "PO Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p o box": "PO Box",
  },
};

export default gyConfig;
