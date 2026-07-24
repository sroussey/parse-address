import type { EuCountryConfig } from "../_eu/types";

/**
 * Barbados (BB) address configuration.
 *
 * British-derived convention: house NUMBER first, then the street name + a
 * TRAILING type ("12 Broad Street", "Rendezvous Gap"). The type is echoed
 * verbatim (incl. Rd/Ave/Dr/Cres and the very Barbadian "Gap"). Many rural
 * houses are named rather than numbered, so the number is optional.
 *
 * Postcode: Barbados introduced postcodes in 2007 -- "BB" + 5 digits
 * ("BB11000" Bridgetown, "BB26025" Speightstown). It sits LAST, on the same
 * line as the locality, and is very often omitted. So `postalPattern` matches
 * the BB##### shape but the whole place tail is optional (after-city).
 *
 * State: the PARISH (11 of them, e.g. "St. Michael", "Christ Church") is the
 * last comma-delimited segment before the postcode and maps to `state`. County
 * is restricted to the parish list so the country name ("Barbados") never lands
 * in `state` and an ordinary district (Worthing, Wildey) is not read as a parish.
 *
 * PO Box: "P.O. Box 123" -- plain numeric.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close", "Court", "Place",
  "Crescent", "Terrace", "Boulevard", "Way", "Gardens", "Grove", "Walk",
  "Heights", "Park", "Circle", "Row", "Hill", "Gate", "Path", "Alley",
  "Highway", "Gap", "Land", "Main", "Rise", "Ridge",
  // abbreviations (kept verbatim)
  "Rd", "Ave", "Av", "Dr", "St", "Cres", "Blvd", "Hwy", "Pl", "Cl", "Ln", "Gdns",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  av: "AVE", lane: "LN", ln: "LN", drive: "DR", dr: "DR", close: "CL", cl: "CL",
  court: "CT", place: "PL", pl: "PL", crescent: "CRES", cres: "CRES",
  terrace: "TER", boulevard: "BLVD", blvd: "BLVD", way: "WAY", gardens: "GDNS",
  gdns: "GDNS", grove: "GR", walk: "WLK", heights: "HTS", park: "PK",
  circle: "CIR", row: "ROW", hill: "HL", gate: "GATE", path: "PATH",
  alley: "ALY", highway: "HWY", hwy: "HWY", gap: "GAP", rise: "RISE",
  ridge: "RDG",
};

// The 11 parishes. Christ Church has no "Saint"; the rest are "St." with
// St / Saint spelling variants.
const PARISHES = [
  "Christ Church", "St. Michael", "St. George", "St. Philip", "St. James",
  "St. Thomas", "St. Joseph", "St. Andrew", "St. John", "St. Peter",
  "St. Lucy",
];

function parishVariants(p: string): string[] {
  if (!p.startsWith("St. ")) return [p];
  const rest = p.slice(4);
  return [p, `St ${rest}`, `Saint ${rest}`];
}

const PARISH_ALT = ([] as string[])
  .concat(...PARISHES.map(parishVariants))
  .map((s) => s.replace(/\./g, "\\.").replace(/ /g, "\\s+"))
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {};
for (const p of PARISHES) {
  for (const v of parishVariants(p)) REGION_MAP[v.toLowerCase()] = p;
}

export const bbConfig: EuCountryConfig = {
  code: "bb",
  country: "BB",
  countryNames: ["Barbados", "BRB", "BB"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // County restricted to the parish list (keeps "Barbados"/districts out).
  countyPattern: `(?:${PARISH_ALT})`,

  // "BB" + 5 digits, written LAST; frequently omitted (place tail optional).
  postalPattern: "(?<postal_code>BB\\d{5})",
  // Number first: plain, range ("12-14"), optional glued letter ("12A"), "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],
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

export default bbConfig;
