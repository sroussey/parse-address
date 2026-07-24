import type { EuCountryConfig } from "../_eu/types";

/**
 * Irish (IE) address configuration. Like the UK: house number first, street
 * name + trailing type ("10 Grafton Street"), a post town / Dublin postal
 * district, an optional county, and the Eircode LAST. Many Irish addresses have
 * no Eircode at all. Type is kept verbatim.
 */

const TYPES = [
  "Street", "Avenue", "Terrace", "Crescent", "Heights", "Square", "Close",
  "Court", "Place", "Grove", "Drive", "Green", "Road", "Lane", "Park", "Quay",
  "Walk", "Hill", "Rise", "Row", "Mall", "View", "Gardens",
  "St", "Rd", "Ave", "Ln", "Dr",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", avenue: "AVE", ave: "AVE",
  lane: "LN", ln: "LN", close: "CL", drive: "DR", dr: "DR", court: "CT",
  place: "PL", terrace: "TER", row: "ROW", park: "PK", green: "GRN",
  grove: "GR", crescent: "CRES", quay: "QY", square: "SQ", walk: "WLK",
  hill: "HL", rise: "RISE", heights: "HTS", view: "VW", gardens: "GDNS",
};

export const ieConfig: EuCountryConfig = {
  code: "ie",
  country: "IE",
  countryNames: ["Ireland", "Éire", "Eire", "IRL", "IE"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  cityAllowsDigits: true, // "Dublin 2"
  cityAllowsCommas: true, // "Ballsbridge, Dublin 4"
  countyPattern: "Co\\.?\\s+[^,\\d\\n]+?", // "Co. Cork"

  // Eircode: routing key (letter + digit + digit/"W") + space + 4 chars.
  postalPattern:
    "(?<postal_code>[A-Za-z]\\d[\\dWw]\\s+[A-Za-z\\d]{4})",
  // House number: a plain number or range ("10-12"), optional glued letter.
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Unit|Suite|Room|Floor)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", flat: "Flat", unit: "Unit",
    suite: "Suite", room: "Room", floor: "Floor",
  },
};

export default ieConfig;
