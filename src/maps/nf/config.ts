import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Norfolk Island (NF) address configuration.
 *
 * An Australian external territory using the Australian addressing model:
 * house NUMBER first, English street name + a TRAILING type ("12 Taylors Road"),
 * the locality as the routing city (Burnt Pine, Kingston, Cascade, ...), and a
 * single Australian-style 4-digit POSTCODE — "2899" — written LAST (after-city).
 *
 * Order: number-first, suffix type. Many rural properties are named or use only
 *        the road, so the number is optional.
 * Type: trailing English suffix (Road, Drive, Lane, ...) kept verbatim, or null.
 * Postcode: the single territory code "2899".
 * Locality: the settlement/locality is captured as `city`. No state/region is
 *        written (county slot disabled).
 * PO Box: used ("PO Box 95, Norfolk Island").
 *
 * Sources: Australia Post postcode 2899; Norfolk Island Regional Council; UPU
 * note. See research-nf.md.
 */

const TYPES = [
  "Road", "Drive", "Lane", "Avenue", "Street", "Place", "Close", "Court",
  "Way", "Row", "Terrace", "Hill", "Track", "Rise", "Circle", "Esplanade",
  "Parade", "Crescent",
  // abbreviations
  "Rd", "Dr", "Ave", "Av", "St", "Ln", "Ct", "Pl", "Tce", "Cres", "Cir",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  drive: "DR", dr: "DR",
  lane: "LN", ln: "LN",
  avenue: "AVE", ave: "AVE", av: "AVE",
  street: "ST", st: "ST",
  place: "PL", pl: "PL",
  close: "CL",
  court: "CT", ct: "CT",
  way: "WAY",
  row: "ROW",
  terrace: "TCE", tce: "TCE",
  hill: "HL",
  track: "TRK",
  rise: "RISE",
  circle: "CIR", cir: "CIR",
  esplanade: "ESP",
  parade: "PDE",
  crescent: "CRES", cres: "CRES",
};

export const nfConfig: EuCountryConfig = {
  code: "nf",
  country: "NF",
  countryNames: ["Norfolk Island", "NFK", "NF"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // The single territory-wide 4-digit code.
  postalPattern: "(?<postal_code>2899)",

  // Number first: plain, range ("12-14"), optional glued letter ("12A"), "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // No state/region field: forbid anything landing in the state slot.
  countyPattern: "(?!x)x",

  buildingKeywords: [
    "House", "Building", "Cottage", "Cottages", "Lodge", "Chambers", "Centre",
    "Hall", "Court",
  ],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Flat|Apartment|Apt\\.?|Suite|Villa|Shop|Floor|Room)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit", flat: "Flat", apartment: "Apartment", apt: "Apt",
    suite: "Suite", villa: "Villa", shop: "Shop", floor: "Floor", room: "Room",
  },

  poBoxNames: ["Post Office Box", "P.O. Box", "PO Box", "PO BOX", "P O Box", "Locked Bag"],
  poBoxDisplayMap: {
    "post office box": "PO Box", "p.o. box": "PO Box", "po box": "PO Box",
    "p o box": "PO Box", "locked bag": "Locked Bag",
  },
};

export default nfConfig;
