import type { EuCountryConfig } from "../_eu/types";

/**
 * Belize (BZ) address configuration.
 *
 * The only officially English-speaking country in Central America, so British-
 * derived convention: house NUMBER first, street name + TRAILING type
 * ("35 Albert Street"). Type echoed verbatim (incl. Rd/Ave/Dr/Blvd). Number is
 * optional (many town/village addresses are street- or landmark-only).
 *
 * Postcode: Belize has NO postcode system. The place tail is the city/town then
 * the DISTRICT, with no numeric code, so `postalPattern` is a never-match
 * sentinel and the layout is after-city.
 *
 * State: the DISTRICT (6 of them) is the last comma segment and maps to
 * `state`. It is written either bare ("Belize") or with a trailing "District"
 * ("Belize District", "Cayo District"); the trailing word is consumed. County
 * is restricted to the district list so the country name never lands in `state`.
 *
 * PO Box: "P.O. Box 123" -- plain numeric. Most Belize mail goes to PO boxes.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close", "Court", "Place",
  "Crescent", "Terrace", "Boulevard", "Way", "Gardens", "Grove", "Walk",
  "Heights", "Park", "Circle", "Row", "Hill", "Highway", "Extension", "Alley",
  // abbreviations (kept verbatim)
  "Rd", "Ave", "Av", "Dr", "St", "Cres", "Blvd", "Hwy", "Pl", "Cl", "Ln", "Ext",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  av: "AVE", lane: "LN", ln: "LN", drive: "DR", dr: "DR", close: "CL", cl: "CL",
  court: "CT", place: "PL", pl: "PL", crescent: "CRES", cres: "CRES",
  terrace: "TER", boulevard: "BLVD", blvd: "BLVD", way: "WAY", gardens: "GDNS",
  grove: "GR", walk: "WLK", heights: "HTS", park: "PK", circle: "CIR",
  row: "ROW", hill: "HL", highway: "HWY", hwy: "HWY", extension: "EXT",
  ext: "EXT", alley: "ALY",
};

// The 6 districts, optionally written with a trailing "District".
const DISTRICTS = [
  "Belize", "Cayo", "Corozal", "Orange Walk", "Stann Creek", "Toledo",
];
const DISTRICT_ALT = DISTRICTS.map((s) => s.replace(/ /g, "\\s+"))
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {};
for (const d of DISTRICTS) {
  REGION_MAP[d.toLowerCase()] = d;
  REGION_MAP[`${d.toLowerCase()} district`] = d;
}

export const bzConfig: EuCountryConfig = {
  code: "bz",
  country: "BZ",
  countryNames: ["Belize", "BLZ", "BZ"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // County restricted to the district list (+ optional trailing "District").
  countyPattern: `(?:${DISTRICT_ALT})(?:\\s+District)?`,

  // No postcode system: a never-match sentinel so the place tail is city+district.
  postalPattern: "(?<postal_code>(?!x)x)",
  // Number first: plain, range ("35-37"), optional glued letter ("35A"), "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // District -> state; the trailing "District" word is folded away by the map.
  regionPattern: `(?<state>(?:${DISTRICT_ALT})(?:\\s+District)?)`,
  regionMap: REGION_MAP,

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

export default bzConfig;
