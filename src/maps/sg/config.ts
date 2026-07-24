import type { EuCountryConfig } from "../_eu/types";

/**
 * Singapore (SG) address configuration.
 *
 * Order: BLOCK / building NUMBER first ("Blk 35 Mandalay Road", "1 Raffles
 *        Place"), then the road name + type suffix.
 * Type: trailing suffix (Road, Avenue, Street, Lane, Drive, Crescent, Close,
 *        Walk, Link, Rise, Place, Way, Central, ...). Numbered roads
 *        ("Ang Mo Kio Avenue 3") and Malay/Tamil-prefixed roads ("Jalan Besar",
 *        "Lorong 3 Geylang") carry no trailing English type and parse type-less.
 * Secondary unit TRAILS the street: the "#floor-unit" form "#12-34"
 *        (sec_unit_type "#", sec_unit_num "12-34"); also written "Unit 12-34".
 * Place: the word "Singapore" (the country marker) then a 6-digit POSTCODE.
 *        There is NO state and NO city line.
 *
 * NOTE (known limitation / failure mode #1): the shared after-city place grammar
 * has an optional city capture positioned before the postcode; because the
 * routing marker "Singapore" is an ordinary word to that capture, it may be
 * assigned to `city` instead of being consumed as the country. The correct
 * output has `city` null and `country` = SG. A follow-up engine fix should
 * exclude a lone country name from the city capture (or prefer the countryBefore
 * consumption). The samples encode the correct (city-null) ground truth.
 */

const TYPES = [
  "Road", "Street", "Avenue", "Lane", "Drive", "Crescent", "Close", "Walk",
  "Link", "Rise", "Terrace", "Place", "Way", "Park", "Green", "View",
  "Gardens", "Grove", "Loop", "Boulevard", "Quay", "Circle", "Central",
  "Heights", "Hill", "Vale", "Ring", "Plaza", "Promenade", "Mall", "Circus",
  "Bank", "Field", "Turn", "Gateway", "Square", "Court", "Farmway", "Way",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD",
  street: "ST",
  avenue: "AVE",
  lane: "LN",
  drive: "DR",
  crescent: "CRES",
  close: "CL",
  walk: "WLK",
  link: "LINK",
  rise: "RISE",
  terrace: "TCE",
  place: "PL",
  way: "WAY",
  park: "PK",
  green: "GRN",
  view: "VIEW",
  gardens: "GDNS",
  grove: "GR",
  loop: "LOOP",
  boulevard: "BVD",
  quay: "QY",
  circle: "CIR",
  central: "CTRL",
  heights: "HTS",
  plaza: "PLZ",
  promenade: "PROM",
  mall: "MALL",
  gateway: "GTWY",
  square: "SQ",
  court: "CT",
};

export const sgConfig: EuCountryConfig = {
  code: "sg",
  country: "SG",
  countryNames: ["Singapore", "Republic of Singapore", "S'pore", "SGP", "SG"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 6-digit postal code (leading zeros significant). The preceding "Singapore"
  // is consumed as the country marker (countryBefore) in the place grammar.
  postalPattern: "(?<postal_code>\\d{6})",

  // Block / building number: optional "Blk"/"Block" lead-in, then the number
  // with an optional glued letter suffix ("Blk 123A").
  houseNumberPattern:
    "(?:Blk\\.?\\s+|Block\\s+)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Trailing "#floor-unit" (the literal '#' MUST be escaped in free-spacing
  // mode) or the word "Unit". The unit part is floor-unit ("12-34"), optionally
  // basement-prefixed ("B1-44") or ranged ("20-01/02").
  secUnitPlacement: "after",
  secUnitPattern:
    "(?<sec_unit_type>\\#|Unit|Apartment|Apt\\.?)\\s*(?<sec_unit_num>[A-Za-z]?\\d+[A-Za-z]?-[A-Za-z0-9]+(?:/[A-Za-z0-9]+)?)",
  secUnitDisplayMap: {
    "#": "#",
    unit: "Unit",
    apartment: "Apartment",
    apt: "Apt",
  },

  poBoxNames: ["PO Box", "P.O. Box", "Locked Bag", "Robinson Road PO Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "locked bag": "Locked Bag",
  },
};

export default sgConfig;
