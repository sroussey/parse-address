import type { EuCountryConfig } from "../_eu/types";

/**
 * New Zealand (NZ) address configuration.
 *
 * Order: house NUMBER first, then street name + type suffix ("43 Vogel Street").
 * Type: trailing suffix, kept verbatim; NZ Post prefers the full word (Street,
 *        Road, Avenue) but abbreviations (St, Rd, Ave, Tce) occur.
 * Secondary unit LEADS the address ("Flat 2, 43 Vogel Street"); the unit-slash-
 *        street form "2/43 Vogel Street" (flat 2 at number 43) is captured in the
 *        house-number pattern and folded in postNormalize.
 * Place: town/CITY + 4-digit POSTCODE on the last line ("Palmerston North 4414"),
 *        NO state/region (region is optional and usually omitted). When a suburb
 *        precedes the city, the LAST locality is the routing city.
 */

const TYPES = [
  // full words
  "Street", "Road", "Avenue", "Drive", "Lane", "Court", "Place", "Parade",
  "Terrace", "Crescent", "Close", "Quay", "Highway", "Boulevard", "Square",
  "Grove", "Way", "Rise", "Mall", "Walk", "Esplanade", "Promenade", "Heights",
  "Bay", "Bend", "Circle", "Cove", "Glade", "Glen", "Green", "Grange", "Hill",
  "Line", "Loop", "Mews", "Nook", "Outlook", "Pass", "Pathway", "Ridge", "Row",
  "Straight", "Strand", "Track", "Vale", "View", "Views", "Vista",
  // abbreviations (verbatim)
  "St", "Rd", "Ave", "Dr", "Ln", "Ct", "Pl", "Pde", "Tce", "Cres", "Cl",
  "Hwy", "Sq", "Gr", "Hts", "Esp", "Prom", "Wk",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE",
  drive: "DR", dr: "DR",
  lane: "LN", ln: "LN",
  court: "CT", ct: "CT",
  place: "PL", pl: "PL",
  parade: "PDE", pde: "PDE",
  terrace: "TCE", tce: "TCE",
  crescent: "CRES", cres: "CRES",
  close: "CL", cl: "CL",
  quay: "QY",
  highway: "HWY", hwy: "HWY",
  boulevard: "BVD",
  square: "SQ", sq: "SQ",
  grove: "GR", gr: "GR",
  way: "WAY",
  rise: "RISE",
  mall: "MALL",
  walk: "WLK", wk: "WLK",
  esplanade: "ESP", esp: "ESP",
  promenade: "PROM", prom: "PROM",
  heights: "HTS", hts: "HTS",
};

export const nzConfig: EuCountryConfig = {
  code: "nz",
  country: "NZ",
  countryNames: ["New Zealand", "Aotearoa", "NZL", "NZ"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Plain 4-digit postcode, no state token (leading zeros are significant).
  postalPattern: "(?<postal_code>\\d{4})",

  // Optional leading unit "N/" (unit-slash-street, "2/43" = flat 2 at number 43),
  // then the number or a range, with an optional glued letter suffix ("43A").
  houseNumberPattern:
    "(?:(?<sec_unit_num_slash>\\d+[A-Za-z]?)\\s*/\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Unit|Apartment|Apt\\.?|Suite|Level|Room|Villa|Shop|Office)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    unit: "Unit",
    apartment: "Apartment",
    apt: "Apt",
    suite: "Suite",
    level: "Level",
    room: "Room",
    villa: "Villa",
    shop: "Shop",
    office: "Office",
  },

  poBoxNames: ["PO Box", "P.O. Box", "Private Bag"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "private bag": "Private Bag",
  },
  // NZ PO Box / Private Bag numbers are often hyphenated ("30-123").
  poBoxNumberPattern: "\\d[\\d\\s-]*\\d|\\d",

  // Fold the unit-slash-street helper into the secondary unit (implied Flat).
  postNormalize: (parsed: Record<string, any>) => {
    if (parsed.sec_unit_num_slash) {
      parsed.sec_unit_num = parsed.sec_unit_num_slash;
      if (!parsed.sec_unit_type) parsed.sec_unit_type = "Flat";
      delete parsed.sec_unit_num_slash;
    }
  },
};

export default nzConfig;
