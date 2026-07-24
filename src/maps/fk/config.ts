import type { EuCountryConfig } from "../_eu/types";

/**
 * Falkland Islands (FK) address configuration.
 *
 * British Overseas Territory using the UK addressing model: house NUMBER first,
 * English street name + a TRAILING type ("2 Ross Road"), the settlement as the
 * routing city (Stanley, or a "Camp" settlement such as Goose Green), and a
 * single territory-wide UK-format postcode LAST (after-city).
 *
 * Order: number-first, suffix type. Many addresses carry no house number (a
 *        named house or a bare street on a settlement).
 * Type: trailing English suffix (Road, Street, Lane, ...) kept verbatim, or null.
 * Postcode: one code for the whole territory — "FIQQ 1ZZ". Optional (routinely
 *        omitted on internal mail).
 * Locality: the settlement IS the routing place, captured as `city`. No
 *        sub-region is modelled (county slot disabled).
 * PO Box: used ("PO Box 25, Stanley").
 *
 * Sources: Royal Mail postcode data (FIQQ 1ZZ); Falkland Islands Government;
 * UPU note. See research-fk.md.
 */

const TYPES = [
  "Road", "Street", "Lane", "Drive", "Place", "Close", "Hill", "Row", "Walk",
  "Avenue", "Crescent", "Terrace", "Way", "Court", "Rise", "Path",
  // abbreviations
  "Rd", "St", "Ave", "Av", "Dr", "Cres",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
  lane: "LN",
  drive: "DR", dr: "DR",
  place: "PL",
  close: "CL",
  hill: "HL",
  row: "ROW",
  walk: "WLK",
  avenue: "AVE", ave: "AVE", av: "AVE",
  crescent: "CRES", cres: "CRES",
  terrace: "TER",
  way: "WAY",
  court: "CT",
  rise: "RISE",
  path: "PATH",
};

export const fkConfig: EuCountryConfig = {
  code: "fk",
  country: "FK",
  countryNames: ["Falkland Islands", "Falklands", "FLK", "FK"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Single territory-wide UK-format code; optional.
  postalPattern: "(?<postal_code>FIQQ\\s*1ZZ)",
  postalFormat: (raw: string) =>
    raw.toUpperCase().replace(/\s+/g, "").replace(/(1ZZ)$/, " $1"),

  // Number first: plain, range ("2-4"), optional glued letter ("2A"), "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // No sub-region field: forbid anything landing in the state slot.
  countyPattern: "(?!x)x",

  buildingKeywords: [
    "House", "Building", "Cottage", "Cottages", "Lodge", "Chambers", "Centre",
    "Hall", "Farm", "Court",
  ],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Unit|Suite|Floor|Room|House)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", unit: "Unit",
    suite: "Suite", floor: "Floor", room: "Room", house: "House",
  },

  poBoxNames: ["Post Office Box", "P.O. Box", "PO Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: {
    "post office box": "PO Box", "p.o. box": "PO Box", "po box": "PO Box",
    "p o box": "PO Box",
  },
};

export default fkConfig;
