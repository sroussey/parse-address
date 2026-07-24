import type { EuCountryConfig } from "../_eu/types";

/**
 * Pitcairn Islands (PN) address configuration.
 *
 * British Overseas Territory with a single inhabited settlement, Adamstown.
 * UK addressing model: house NUMBER first (rare), English street/place name +
 * an optional TRAILING type, the settlement as the routing city (Adamstown),
 * and a single territory-wide UK-format POSTCODE LAST — "PCRN 1ZZ".
 *
 * Order: number-first, suffix type. Almost no property is numbered; most lines
 *        are "<place>, Adamstown, PCRN 1ZZ" or a named building.
 * Type: trailing English suffix (Road, Lane, ...) kept verbatim, or null.
 * Postcode: one code for the whole territory — "PCRN 1ZZ". Optional.
 * Locality: Adamstown is the routing place, captured as `city`. No sub-region
 *        (county slot disabled).
 * PO Box: rarely used; supported for completeness.
 *
 * Sources: Royal Mail postcode data (PCRN 1ZZ); Government of the Pitcairn
 * Islands; UPU note. See research-pn.md.
 */

const TYPES = [
  "Road", "Lane", "Street", "Track", "Hill", "Way", "Path", "Drive", "Place",
  "Row", "Walk",
  // abbreviations
  "Rd", "St", "Dr",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  lane: "LN",
  street: "ST", st: "ST",
  track: "TRK",
  hill: "HL",
  way: "WAY",
  path: "PATH",
  drive: "DR", dr: "DR",
  place: "PL",
  row: "ROW",
  walk: "WLK",
};

export const pnConfig: EuCountryConfig = {
  code: "pn",
  country: "PN",
  countryNames: ["Pitcairn Islands", "Pitcairn Island", "Pitcairn", "PCN", "PN"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Single territory-wide UK-format code; optional.
  postalPattern: "(?<postal_code>PCRN\\s*1ZZ)",
  postalFormat: (raw: string) =>
    raw.toUpperCase().replace(/\s+/g, "").replace(/(1ZZ)$/, " $1"),

  // Number first (rare): plain, range, optional glued letter, "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // No sub-region field: forbid anything landing in the state slot.
  countyPattern: "(?!x)x",

  buildingKeywords: [
    "House", "Building", "Hall", "Centre", "Chambers", "Lodge", "Church",
    "Store", "Office", "Court",
  ],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Unit|Apartment|Apt\\.?|Room|House|Suite)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", unit: "Unit", apartment: "Apartment", apt: "Apt",
    room: "Room", house: "House", suite: "Suite",
  },

  poBoxNames: ["Post Office Box", "P.O. Box", "PO Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: {
    "post office box": "PO Box", "p.o. box": "PO Box", "po box": "PO Box",
    "p o box": "PO Box",
  },
};

export default pnConfig;
