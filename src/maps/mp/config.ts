import type { EuCountryConfig } from "../_eu/types";

/**
 * Northern Mariana Islands (MP / CNMI) address configuration -- a US territory,
 * SEC-mapped as foreign but written in US style.
 *
 * Order: house NUMBER first, then street name + TRAILING type ("As Lito Road").
 * The Chamorro street word "Chalan" leads a name ("Chalan Monsignor Guerrero")
 * and parses as a bare (type-less) street -- lossless. Mail is often PO-box /
 * PMB based, routed to the island ("Saipan"/"Rota"/"Tinian") as the "city".
 * State: the territory code "MP" (or CNMI) sits before the ZIP, like a US
 *        state; restricted so the country name never leaks into `state`.
 * Postal: a US 5-digit ZIP (optionally ZIP+4), LAST (CNMI ZIPs are 9695x).
 */

const TYPES = [
  "Street", "Avenue", "Boulevard", "Road", "Drive", "Court", "Place", "Lane",
  "Way", "Terrace", "Circle", "Highway", "Plaza", "Loop",
  // abbreviations (kept verbatim)
  "Ave", "Av", "Blvd", "Rd", "Dr", "St", "Ct", "Pl", "Ln", "Ter", "Hwy", "Cir",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", avenue: "AVE", ave: "AVE", av: "AVE",
  boulevard: "BLVD", blvd: "BLVD", road: "RD", rd: "RD", drive: "DR", dr: "DR",
  court: "CT", ct: "CT", place: "PL", pl: "PL", lane: "LN", ln: "LN",
  way: "WAY", terrace: "TER", ter: "TER", circle: "CIR", cir: "CIR",
  highway: "HWY", hwy: "HWY", plaza: "PLZ", loop: "LOOP",
};

const COUNTY = "(?:MP|Northern\\s+Mariana\\s+Islands|CNMI)";

const REGION_MAP: Record<string, string> = {
  mp: "MP",
  cnmi: "MP",
  "northern mariana islands": "MP",
};

export const mpConfig: EuCountryConfig = {
  code: "mp",
  country: "MP",
  countryNames: [
    "Northern Mariana Islands", "CNMI", "USA", "United States",
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

export default mpConfig;
