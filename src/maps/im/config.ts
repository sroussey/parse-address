import type { EuCountryConfig } from "../_eu/types";

/**
 * Isle of Man (IM) address configuration.
 *
 * The Isle of Man is a British Crown Dependency and uses the UK addressing
 * grammar and Royal Mail postcode system:
 *   - House number FIRST, then the street name + trailing English type
 *     ("1 Bucks Road", "27 Athol Street"). Number letter suffixes glue on.
 *   - Type is a trailing suffix (Road, Street, Avenue, ...), kept verbatim.
 *   - Secondary unit LEADS the address ("Flat 2, 5 Finch Road").
 *   - Postcode comes LAST, after the town, and is a UK-format code in the IM
 *     postcode area ("IM1 3AE", "IM99 1XY").
 *   - No state/region (the island has no counties; its parishes are not part of
 *     the postal address line).
 *
 * Sources: UPU S42 "Isle of Man (United Kingdom)" template
 * (https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/imnEn.pdf);
 * Wikipedia "IM postcode area" (IM1-IM9 districts; IM86/IM87/IM99 large-user);
 * Isle of Man Post Office; PostGrid
 * (https://www.postgrid.com/global-address-format/isle-of-man-address-format/);
 * Smarty (https://www.smarty.com/global-address-formatting/isle-of-man-address-format-examples).
 */

const TYPES = [
  "Street", "Road", "Avenue", "Lane", "Close", "Drive", "Court", "Place",
  "Gardens", "Grove", "Crescent", "Terrace", "Row", "Walk", "Hill", "Rise",
  "Mews", "Green", "Gate", "Parade", "Vale", "Croft", "Square", "Way",
  "Promenade", "View", "Meadow", "Park", "Brooghs", "Bayr",
  // Royal Mail abbreviations
  "St", "Rd", "Ave", "Ln", "Cl", "Dr", "Cres", "Gdns", "Sq", "Pl", "Gr",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE",
  lane: "LN", ln: "LN",
  close: "CL", cl: "CL",
  drive: "DR", dr: "DR",
  court: "CT",
  place: "PL", pl: "PL",
  gardens: "GDNS", gdns: "GDNS",
  grove: "GR",
  crescent: "CRES", cres: "CRES",
  terrace: "TER",
  row: "ROW",
  walk: "WLK",
  hill: "HL",
  rise: "RISE",
  mews: "MEWS",
  green: "GRN",
  gate: "GATE",
  parade: "PDE",
  vale: "VALE",
  croft: "CFT",
  square: "SQ", sq: "SQ",
  way: "WAY",
  promenade: "PROM",
  view: "VIEW",
  meadow: "MDW",
  park: "PK",
};

export const imConfig: EuCountryConfig = {
  code: "im",
  country: "IM",
  countryNames: ["Isle of Man", "Ellan Vannin", "IMN", "IM"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // Manx/British types are echoed as written (Street, St, Rd, ...).
  normalizeTypeCase: false,

  // UK-format postcode restricted to the IM postcode area ("IM1 3AE",
  // "IM99 1XY"). Outward = IM + 1-2 digits; inward = digit + 2 letters.
  postalPattern:
    "(?<postal_code>IM\\d[0-9A-Za-z]?\\s*\\d[A-Za-z]{2})",
  // Normalise to upper-case with a single space before the 3-char inward code.
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, -3)} ${s.slice(-3)}`;
  },
  // House number: a plain number or a range ("10-12"), with an optional glued
  // letter suffix ("2A").
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

export default imConfig;
