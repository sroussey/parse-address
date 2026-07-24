import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * American Samoa (AS) address configuration -- a US territory, SEC-mapped as
 * foreign but written in US style.
 *
 * American Samoa has very few named/numbered streets; mail is overwhelmingly
 * PO-box based ("PO Box 1234, Pago Pago, AS 96799") with the village as the
 * routing "city". Where a road exists it is number-first + trailing US type
 * ("Route 001" parses as a bare, type-less street -- lossless).
 * State: the territory code "AS" sits before the ZIP, like a US state; kept off
 *        the country name via a restricted county list. Every AS ZIP is 96799.
 */

const TYPES = [
  "Street", "Avenue", "Boulevard", "Road", "Drive", "Court", "Place", "Lane",
  "Way", "Terrace", "Circle", "Highway", "Plaza",
  // abbreviations (kept verbatim)
  "Ave", "Av", "Blvd", "Rd", "Dr", "St", "Ct", "Pl", "Ln", "Ter", "Hwy", "Cir",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", avenue: "AVE", ave: "AVE", av: "AVE",
  boulevard: "BLVD", blvd: "BLVD", road: "RD", rd: "RD", drive: "DR", dr: "DR",
  court: "CT", ct: "CT", place: "PL", pl: "PL", lane: "LN", ln: "LN",
  way: "WAY", terrace: "TER", ter: "TER", circle: "CIR", cir: "CIR",
  highway: "HWY", hwy: "HWY", plaza: "PLZ",
};

const COUNTY = "(?:AS|American\\s+Samoa)";

const REGION_MAP: Record<string, string> = { as: "AS", "american samoa": "AS" };

export const asConfig: EuCountryConfig = {
  code: "as",
  country: "AS",
  countryNames: ["American Samoa", "USA", "United States"],
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

export default asConfig;
