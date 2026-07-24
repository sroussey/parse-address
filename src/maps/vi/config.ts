import type { EuCountryConfig } from "../_eu/types";

/**
 * U.S. Virgin Islands (VI) address configuration -- a US territory, SEC-mapped
 * as foreign but written in US style.
 *
 * Order: house NUMBER first, then street name + TRAILING type ("14 Norre Gade").
 * The USVI keeps Danish-era "Gade" (street) as a trailing type and the "Estate
 * <Name>" prefix as a bare (type-less) locality-street ("5000 Estate Enighed").
 * State: the territory code "VI" sits before the ZIP, like a US state; kept off
 *        the country name via a restricted county list.
 * Postal: a US 5-digit ZIP (optionally ZIP+4), LAST.
 */

const TYPES = [
  "Street", "Avenue", "Boulevard", "Road", "Drive", "Court", "Place", "Lane",
  "Way", "Terrace", "Circle", "Highway", "Plaza", "Gade",
  // abbreviations (kept verbatim)
  "Ave", "Av", "Blvd", "Rd", "Dr", "St", "Ct", "Pl", "Ln", "Ter", "Hwy", "Cir",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", avenue: "AVE", ave: "AVE", av: "AVE",
  boulevard: "BLVD", blvd: "BLVD", road: "RD", rd: "RD", drive: "DR", dr: "DR",
  court: "CT", ct: "CT", place: "PL", pl: "PL", lane: "LN", ln: "LN",
  way: "WAY", terrace: "TER", ter: "TER", circle: "CIR", cir: "CIR",
  highway: "HWY", hwy: "HWY", plaza: "PLZ", gade: "GADE",
};

const COUNTY =
  "(?:VI|V\\.I\\.|United\\s+States\\s+Virgin\\s+Islands|U\\.S\\.\\s+Virgin\\s+Islands|US\\s+Virgin\\s+Islands|Virgin\\s+Islands)";

const REGION_MAP: Record<string, string> = {
  vi: "VI",
  "v.i.": "VI",
  "virgin islands": "VI",
  "u.s. virgin islands": "VI",
  "us virgin islands": "VI",
  "united states virgin islands": "VI",
};

export const viConfig: EuCountryConfig = {
  code: "vi",
  country: "VI",
  countryNames: [
    "United States Virgin Islands", "U.S. Virgin Islands", "US Virgin Islands",
    "USVI", "USA", "United States",
  ],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  countyPattern: COUNTY,
  regionMap: REGION_MAP,

  postalPattern: "(?<postal_code>\\d{5}(?:-\\d{4})?)",
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  secUnitPlacement: "after",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Suite|Ste\\.?|Unit|Room|Rm\\.?|Floor|Fl\\.?|Building|Bldg\\.?|PMB)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", suite: "Suite", ste: "Ste",
    unit: "Unit", room: "Room", rm: "Rm", floor: "Floor", fl: "Fl",
    building: "Building", bldg: "Bldg", pmb: "PMB",
  },

  poBoxNames: ["P.O. Box", "PO Box", "PO BOX", "P O Box", "PMB"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p o box": "PO Box", pmb: "PMB",
  },
};

export default viConfig;
