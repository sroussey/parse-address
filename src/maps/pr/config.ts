import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Puerto Rico (PR) address configuration -- a US territory, SEC-mapped as a
 * foreign jurisdiction but written in US style.
 *
 * Order: house NUMBER first, then the street name + a TRAILING type suffix
 *        ("1607 Ponce de Leon Ave"). Type echoed verbatim (US set + abbrevs).
 * PR also uses Spanish street words as a PREFIX ("Calle Loíza", "Ave Ponce de
 * León"); modelled as a bare (type-less) street name, which is lossless.
 * State: the territory code "PR" sits before the ZIP, acting like a US state
 *        ("San Juan, PR 00909"); restricted to the PR list so the country name
 *        never leaks into `state`.
 * Postal: a US 5-digit ZIP (optionally ZIP+4), written LAST.
 */

// US street types only. PR's Spanish generics (Calle, Ave, Avenida, Carretera,
// Paseo, Marginal ...) are written as a PREFIX ("Calle Loíza", "Ave Ponce de
// León"), so they are intentionally NOT listed as trailing types -- doing so
// would wrongly split "Calle Marginal" into "Calle" + type "Marginal". Such a
// prefixed name parses as a bare (type-less) street, which is lossless.
const TYPES = [
  "Street", "Avenue", "Boulevard", "Road", "Drive", "Court", "Place", "Lane",
  "Way", "Terrace", "Circle", "Highway", "Plaza", "Parkway", "Trail",
  // abbreviations (kept verbatim)
  "Ave", "Av", "Blvd", "Rd", "Dr", "St", "Ct", "Pl", "Ln", "Ter", "Hwy", "Cir",
  "Pkwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", avenue: "AVE", ave: "AVE", av: "AVE",
  boulevard: "BLVD", blvd: "BLVD", road: "RD", rd: "RD", drive: "DR", dr: "DR",
  court: "CT", ct: "CT", place: "PL", pl: "PL", lane: "LN", ln: "LN",
  way: "WAY", terrace: "TER", ter: "TER", circle: "CIR", cir: "CIR",
  highway: "HWY", hwy: "HWY", plaza: "PLZ", parkway: "PKWY", pkwy: "PKWY",
  trail: "TRL",
};

// Territory code / full name accepted as the "state"; kept off the country name.
const COUNTY = "(?:PR|P\\.R\\.|Puerto\\s+Rico)";

const REGION_MAP: Record<string, string> = {
  pr: "PR",
  "p.r.": "PR",
  "puerto rico": "PR",
};

export const prConfig: EuCountryConfig = {
  code: "pr",
  country: "PR",
  countryNames: ["Puerto Rico", "USA", "United States", "U.S.A."],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  countyPattern: COUNTY,
  regionMap: REGION_MAP,

  // US ZIP, optionally ZIP+4, written LAST.
  postalPattern: "(?<postal_code>\\d{5}(?:-\\d{4})?)",
  // Number first: plain, range ("1607-1609"), optional glued letter, "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // US-style trailing secondary unit ("..., Ste 200, ...").
  secUnitPlacement: "after",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Suite|Ste\\.?|Unit|Room|Rm\\.?|Floor|Fl\\.?|Building|Bldg\\.?|Piso|Departamento|Depto\\.?|PMB)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", suite: "Suite", ste: "Ste",
    unit: "Unit", room: "Room", rm: "Rm", floor: "Floor", fl: "Fl",
    building: "Building", bldg: "Bldg", piso: "Piso",
    departamento: "Departamento", depto: "Depto", pmb: "PMB",
  },

  poBoxNames: ["P.O. Box", "PO Box", "PO BOX", "P O Box", "Apartado", "PMB"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p o box": "PO Box",
    apartado: "Apartado", pmb: "PMB",
  },
};

export default prConfig;
