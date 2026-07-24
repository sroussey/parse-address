import type { EuCountryConfig } from "../_eu/types";

/**
 * Jamaica (JM) address configuration.
 *
 * British-derived convention: house NUMBER first, then the street name + a
 * TRAILING type ("12 Hope Road"). The type is echoed verbatim (incl. the Royal
 * Mail style abbreviations Rd/Ave/Dr/Blvd/Cres).
 *
 * Postcode: Jamaica has no nationwide postcode in daily use. Kingston (and the
 * Corporate Area) uses a legacy one/two-digit POSTAL ZONE written AFTER the town
 * with no comma -- "Kingston 10", "Kingston 5", "Kingston 20". A newer 5-digit
 * scheme (Jamaica Post, launched 2007) was assigned but effectively abandoned
 * and is only rarely written, so it is accepted but seldom seen. The postcode
 * therefore sits LAST (after the city), the UK/BM order.
 *
 * State: the PARISH (14 of them) is written as the last comma-delimited segment
 * ("Ocho Rios, St. Ann") and maps to `state`. County is restricted to the parish
 * list so a trailing country ("Jamaica") is never mistaken for a parish.
 *
 * PO Box: "P.O. Box 123" -- plain numeric (no letter prefix, unlike Bermuda).
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Drive", "Close", "Court", "Place",
  "Crescent", "Terrace", "Boulevard", "Way", "Gardens", "Grove", "Walk",
  "Heights", "Park", "Circle", "Circus", "Mews", "Rise", "Row", "Hill", "Gate",
  "Plaza", "Mall", "Path", "Pen", "Run", "Acres", "Manor", "Meadows", "Gap",
  "Highway", "Boulevarde",
  // abbreviations (kept verbatim)
  "Rd", "Ave", "Av", "Dr", "St", "Cres", "Blvd", "Hwy", "Pl", "Cl", "Ln", "Gdns",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  av: "AVE", lane: "LN", ln: "LN", drive: "DR", dr: "DR", close: "CL", cl: "CL",
  court: "CT", place: "PL", pl: "PL", crescent: "CRES", cres: "CRES",
  terrace: "TER", boulevard: "BLVD", blvd: "BLVD", way: "WAY", gardens: "GDNS",
  gdns: "GDNS", grove: "GR", walk: "WLK", heights: "HTS", park: "PK",
  circle: "CIR", mews: "MEWS", rise: "RISE", row: "ROW", hill: "HL", gate: "GATE",
  plaza: "PLZ", mall: "MALL", highway: "HWY", hwy: "HWY",
};

// The 14 parishes (+ Kingston), with "St." / "St" / "Saint" spelling variants.
const PARISHES = [
  "Kingston", "St. Andrew", "St. Catherine", "Clarendon", "Manchester",
  "St. Elizabeth", "Westmoreland", "Hanover", "St. James", "Trelawny",
  "St. Ann", "St. Mary", "Portland", "St. Thomas",
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

export const jmConfig: EuCountryConfig = {
  code: "jm",
  country: "JM",
  countryNames: ["Jamaica", "JAM", "JM"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // County restricted to the parish list (keeps "Jamaica" out of `state`).
  countyPattern: `(?:${PARISH_ALT})`,

  // Kingston postal zone (1-2 digits) or the rare 5-digit code, written LAST.
  postalPattern: "(?<postal_code>\\d{5}|\\d{1,2})",
  // Number first: plain, range ("10-12"), optional glued letter ("12A"), "#".
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

export default jmConfig;
