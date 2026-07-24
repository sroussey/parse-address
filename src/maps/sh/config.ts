import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Saint Helena (SH) address configuration.
 *
 * A British Overseas Territory (Saint Helena, Ascension and Tristan da Cunha)
 * that uses the UK addressing model: house NUMBER first, English street type,
 * and a single UK-format postcode written LAST (after-city).
 *
 * Order: number-first, suffix type. Many small-island addresses carry no house
 *        number (a named house or a bare street on a district).
 * Type: trailing English suffix (Street, Road, Lane, ...) or null.
 * Postcode: a single territory-wide code per island — "STHL 1ZZ" (Saint Helena),
 *        "ASCN 1ZZ" (Ascension), "TDCU 1ZZ" (Tristan da Cunha) — written last.
 *        Optional (frequently omitted on internal mail).
 * Locality: the district IS the routing place (Jamestown, Half Tree Hollow,
 *        Longwood, Alarm Forest, ...), captured as `city`. No sub-region is
 *        modelled (county slot disabled).
 * PO Box: used ("Post Office Box 42, Jamestown").
 *
 * Sources: Saint Helena Government; Royal Mail postcode data (STHL/ASCN/TDCU
 * 1ZZ); UPU note. See research-sh.md.
 */

const TYPES = [
  "Street", "Road", "Lane", "Avenue", "Drive", "Close", "Crescent", "Hill",
  "Way", "Terrace", "Walk", "Row", "Gardens", "Parade", "Steps",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cres",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  lane: "LN",
  avenue: "AVE", ave: "AVE", av: "AVE",
  drive: "DR", dr: "DR",
  close: "CL",
  crescent: "CRES", cres: "CRES",
  hill: "HL",
  way: "WAY",
  terrace: "TER",
  walk: "WLK",
  row: "ROW",
  gardens: "GDNS",
  parade: "PDE",
  steps: "STPS",
};

export const shConfig: EuCountryConfig = {
  code: "sh",
  country: "SH",
  countryNames: [
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Helena", "St Helena", "St. Helena", "Ascension", "Tristan da Cunha",
    "SHN", "SH",
  ],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Single UK-format territory code per island; optional.
  postalPattern: "(?<postal_code>(?:STHL|ASCN|TDCU)\\s*1ZZ)",
  postalFormat: (raw: string) =>
    raw.toUpperCase().replace(/\s+/g, "").replace(/(1ZZ)$/, " $1"),

  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // The district is the routing place; keep any "area, district" chain together
  // and drop the leading area(s). No sub-region, so the county slot is disabled.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Floor|Room|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", floor: "Floor", room: "Room", unit: "Unit",
  },

  buildingKeywords: [
    "House", "Building", "Cottage", "Cottages", "Villa", "Lodge", "Chambers",
    "Centre", "Court", "Castle", "Place",
  ],

  poBoxNames: ["Post Office Box", "P.O. Box", "PO Box", "P O Box", "Box"],
  poBoxDisplayMap: {
    "post office box": "PO Box", "p.o. box": "PO Box", "po box": "PO Box",
    "p o box": "PO Box", box: "PO Box",
  },

  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default shConfig;
