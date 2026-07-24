import type { EuCountryConfig } from "../_eu/types";

/**
 * Seychelles (SC) address configuration.
 *
 * English convention (a former British colony): house NUMBER first, then the
 * street name + a TRAILING type ("Revolution Avenue", "Albert Street"). The
 * type is echoed verbatim (incl. Rd/Ave/Dr). Many houses are named or use only
 * the district, so the number is optional.
 *
 * Postcode: NONE. Seychelles has no postal-code system, so the postal slot is a
 * never-matching sentinel and the place tail parses without it.
 *
 * Place model: the administrative DISTRICT is the routing locality and maps to
 * `city` (Victoria, Beau Vallon, Anse Royale, Bel Air, Mont Fleuri, ...). The
 * main ISLAND (Mahé, Praslin, La Digue, Silhouette) is the last comma-delimited
 * segment and maps to `state`; the county is restricted to that island list so
 * an ordinary district is never read as an island and the country name never
 * lands in `state`.
 *
 * PO Box: very common ("P.O. Box 56, Victoria, Mahé"). A bare "district, island"
 * line with no street token is not addressable as a pure locality (no postcode
 * to anchor a place-only parse), so those are marked __skip in the corpus.
 *
 * Sources: SeyPost; UPU addressing note (Seychelles); district list of Seychelles.
 * See research-sc.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close", "Court", "Place",
  "Crescent", "Terrace", "Boulevard", "Way", "Highway", "Path", "Hill",
  "Rise", "Walk", "Steps",
  // abbreviations (kept verbatim)
  "St", "Rd", "Ave", "Av", "Dr", "Cres", "Hwy", "Blvd",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  lane: "LN",
  drive: "DR", dr: "DR",
  close: "CL",
  court: "CT",
  place: "PL",
  crescent: "CRES", cres: "CRES",
  terrace: "TER",
  boulevard: "BLVD", blvd: "BLVD",
  way: "WAY",
  highway: "HWY", hwy: "HWY",
  path: "PATH",
  hill: "HL",
  rise: "RISE",
  walk: "WLK",
  steps: "STPS",
};

// The main inhabited islands act as the region/state. Accept "Mahe"/"Mahé".
const REGION_MAP: Record<string, string> = {
  "mahe": "Mahé",
  "mahé": "Mahé",
  "praslin": "Praslin",
  "la digue": "La Digue",
  "silhouette": "Silhouette",
};

export const scConfig: EuCountryConfig = {
  code: "sc",
  country: "SC",
  countryNames: ["Seychelles", "SYC", "SC"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcodes: never-matching sentinel keeps the place tail postcode-free.
  postalPattern: "(?<postal_code>(?!x)x)",

  // Number first: plain, range ("12-14"), optional glued letter ("12A"), "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // State restricted to the island list (keeps districts and "Seychelles" out).
  countyPattern: "(?:Mah(?:e|é)|Praslin|La\\s+Digue|Silhouette)",
  regionMap: REGION_MAP,

  buildingKeywords: [
    "House", "Building", "Complex", "Chambers", "Centre", "Center", "Tower",
    "Arcade", "Mall",
  ],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Unit|Suite|Floor|Room|Shop|Villa|Lot)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", flat: "Flat", unit: "Unit",
    suite: "Suite", floor: "Floor", room: "Room", shop: "Shop",
    villa: "Villa", lot: "Lot",
  },

  poBoxNames: ["Post Office Box", "P.O. Box", "PO Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: {
    "post office box": "PO Box", "p.o. box": "PO Box", "po box": "PO Box",
    "p o box": "PO Box",
  },
};

export default scConfig;
