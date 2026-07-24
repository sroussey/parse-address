import type { EuCountryConfig } from "../_eu/types";

/**
 * Cyprus (CY) address configuration (Latin-script / English-language form, the
 * usual international rendering; the Greek prefix form "Λεωφόρος Μακαρίου" is
 * out of scope for this best-effort config).
 *
 * Order: house number FIRST ("25 Makariou Avenue"), British-influenced.
 * Type: trailing suffix (Street, Avenue, Road, ...), a legacy of British rule.
 *       A bare transliterated name with no generic ("Onasagorou") parses with no
 *       type.
 * Postcode: 4 digits, BEFORE the city ("1065 Nicosia"); an "CY-" prefix is added
 *       for inbound international mail and is tolerated. No state on the line.
 */

const TYPES = [
  "Boulevard", "Avenue", "Street", "Square", "Court", "Drive", "Road",
  "Lane", "Circle", "Park",
  // abbreviations
  "Ave", "Str", "St", "Rd", "Blvd", "Sq",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST",
  str: "ST",
  st: "ST",
  avenue: "AVE",
  ave: "AVE",
  road: "RD",
  rd: "RD",
  boulevard: "BLVD",
  blvd: "BLVD",
  square: "SQ",
  sq: "SQ",
  court: "CT",
  drive: "DR",
  lane: "LN",
  circle: "CIR",
  park: "PK",
};

export const cyConfig: EuCountryConfig = {
  code: "cy",
  country: "CY",
  countryNames: ["Cyprus", "Κύπρος", "Kypros", "CYP", "CY"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // 4-digit CAP, with the optional inbound "CY-" prefix captured INTO the group
  // and echoed as written ("CY-1065" stays "CY-1065", bare "1065" stays "1065").
  // Forcing or stripping the prefix would desync the postcode from the source
  // and trip the token-preservation guard.
  postalPattern: "(?<postal_code>(?:CY\\s?-\\s?)?\\d{4})",
  postalFormat: (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    return /cy/i.test(raw) ? `CY-${digits}` : digits;
  },
  // House number, optional letter suffix ("25A") or range ("25-27").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s*[-–]\\s*\\d+|\\s*[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Office|Shop|Floor|Suite|Block)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    apartment: "Apartment",
    apt: "Apt",
    office: "Office",
    shop: "Shop",
    floor: "Floor",
    suite: "Suite",
    block: "Block",
  },

  poBoxNames: ["P.O. Box", "PO Box", "P O Box", "T.Θ."],
  poBoxDisplayMap: { "p.o. box": "PO Box", "po box": "PO Box" },
};

export default cyConfig;
