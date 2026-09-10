import type { EuCountryConfig } from "../_eu/types";

/**
 * United Kingdom (GB) address configuration.
 *
 * Order: house number FIRST, then the street name + type suffix
 *        ("10 Downing Street"). Number letter suffixes glue on ("221B").
 * Type: trailing suffix (Street, Road, ...), kept verbatim (incl. Royal Mail
 *       abbreviations St/Rd/Ave...).
 * Secondary unit LEADS the address ("Flat 4, 12 Abbey Road").
 * Postcode: comes LAST, after the post town and optional county.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Close", "Drive", "Court", "Place",
  "Gardens", "Grove", "Crescent", "Terrace", "Row", "Walk", "Hill", "Rise",
  "Mews", "Green", "Gate", "Wharf", "Parade", "Broadway", "Vale", "Croft",
  "Square", "Way", "Plaza", "Boulevard", "Quay", "Quadrant", "Axe", "Embankment",
  "Approach", "Circus", "Dene", "Rise",
  // Royal Mail abbreviations
  "St", "Rd", "Ave", "Ln", "Cl", "Dr", "Cres", "Gdns", "Sq", "Pl", "Gr",
];

// Short codes are derived from the lower-cased type; the display form is kept
// verbatim (normalizeTypeCase: false).
const TYPE_SHORT: Record<string, string> = {
  street: "ST",
  st: "ST",
  road: "RD",
  rd: "RD",
  avenue: "AVE",
  ave: "AVE",
  lane: "LN",
  ln: "LN",
  close: "CL",
  cl: "CL",
  drive: "DR",
  dr: "DR",
  court: "CT",
  place: "PL",
  pl: "PL",
  gardens: "GDNS",
  gdns: "GDNS",
  grove: "GR",
  crescent: "CRES",
  cres: "CRES",
  terrace: "TER",
  row: "ROW",
  walk: "WLK",
  hill: "HL",
  rise: "RISE",
  mews: "MEWS",
  green: "GRN",
  gate: "GATE",
  wharf: "WHF",
  parade: "PDE",
  broadway: "BWY",
  vale: "VALE",
  croft: "CFT",
  square: "SQ",
  sq: "SQ",
  way: "WAY",
  plaza: "PLZ",
  boulevard: "BLVD",
  quay: "QY",
  axe: "AXE",
};

export const gbConfig: EuCountryConfig = {
  code: "gb",
  country: "GB",
  countryNames: [
    "United Kingdom", "Great Britain", "England", "Scotland", "Wales",
    "Northern Ireland", "UK", "GB",
  ],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // British types are echoed as written (Street, St, Rd, ...).
  normalizeTypeCase: false,

  // Full UK postcode (outward + inward), incl. the special GIR 0AA.
  postalPattern:
    "(?<postal_code>GIR\\s*0AA|[A-Za-z]{1,2}\\d[A-Za-z\\d]?\\s*\\d[A-Za-z]{2})",
  // Normalise to upper-case with a single space before the 3-char inward code.
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, -3)} ${s.slice(-3)}`;
  },
  // House number: a plain number or a range ("10-12"), with an optional glued
  // letter suffix ("221B", "10A").
  // Field-time repair. Same shape as `postalPattern`, but anchored to a whole
  // value and tolerant of the space being absent ("M11AA") or the whole code
  // being run together, because nothing adjacent can be stolen from.
  postalRepair: {
    accept: [
      "GIR\\s*0AA",
      "[A-Z]{1,2}[0-9][A-Z0-9]?\\s*[0-9][A-Z]{2}",
    ],
    canonical: (m) => {
      const s = m[0].replace(/\s+/g, "");
      return `${s.slice(0, -3)} ${s.slice(-3)}`;
    },
  },
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Unit|Suite|Studio|Maisonette|Penthouse|Room|Floor|Block)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    apartment: "Apartment",
    apt: "Apt",
    unit: "Unit",
    suite: "Suite",
    studio: "Studio",
    maisonette: "Maisonette",
    penthouse: "Penthouse",
    room: "Room",
    floor: "Floor",
    block: "Block",
  },

  poBoxNames: ["PO Box", "P.O. Box", "PO BOX"],
  poBoxDisplayMap: { "po box": "PO Box", "p.o. box": "PO Box" },
};

export default gbConfig;
