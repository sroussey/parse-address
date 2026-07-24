import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Zimbabwe (ZW) address configuration.
 *
 * Order: house/stand NUMBER first, then the street name + trailing English type
 *        ("7 Fife Avenue") — number-first, suffix type. A cadastral "Stand No.
 *        <n>" or "Number <n>" lead-in is common, especially in the townships.
 * Type: trailing English suffix (Street, Road, Avenue, Close, Drive, ...). Many
 *        roads/streets are type-less; the type must be optional.
 * Locality: a SUBURB / township (Avondale, Borrowdale, Mount Pleasant, Hillside,
 *        Msasa, Belvedere, ...) sits between the street and the routing city. As
 *        in KE/ZA the comma chain is kept together and the leading suburb(s) are
 *        dropped in postNormalize, keeping the last locality (the city).
 * Postcode: Zimbabwe has NO operational postal-code system; nothing is written.
 *        The postcode capture is a never-match sentinel, and the place tail
 *        simply ends at the city.
 * Province (-> state): the 10 provinces (Harare, Bulawayo, Manicaland, ...) are
 *        essentially never written; the two metropolitan provinces (Harare,
 *        Bulawayo) duplicate the city name. The county slot is disabled with a
 *        never-match sentinel so the generic county pattern does not swallow the
 *        routing city. No `state` is modelled.
 * PO Box: the DOMINANT postal form ("P.O. Box 1234, Harare"; also the Zimbabwean
 *        "P.O. Box A123, Avondale, Harare" and "Private Bag"). The box replaces
 *        the thoroughfare.
 *
 * Sources: Zimbabwe Posts (Zimpost); UPU S42 ZW template & postcode note ("no
 * postal code"); Smarty / PostGrid ZW address guides. See research-zw.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Close", "Crescent", "Boulevard", "Drive",
  "Lane", "Way", "Court", "Place", "Terrace", "Circle", "Ring", "Loop",
  "Rise", "Grove", "Row", "Park", "Gardens", "Walk", "Hill", "Highway",
  "Mews", "Bypass",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cl", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  close: "CL", cl: "CL",
  crescent: "CRES", cres: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  drive: "DR", dr: "DR",
  lane: "LN",
  way: "WAY",
  court: "CT",
  place: "PL",
  terrace: "TER",
  circle: "CIR",
  ring: "RING",
  loop: "LOOP",
  rise: "RISE",
  grove: "GR",
  row: "ROW",
  park: "PARK",
  gardens: "GDNS",
  walk: "WLK",
  hill: "HL",
  highway: "HWY", hwy: "HWY",
  mews: "MEWS",
  bypass: "BYP",
};

export const zwConfig: EuCountryConfig = {
  code: "zw",
  country: "ZW",
  countryNames: ["Zimbabwe", "Republic of Zimbabwe", "ZWE", "ZW"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Zimbabwe has NO postcode: never-match sentinel keeps a stray number out of it.
  postalPattern: "(?<postal_code>(?!x)x)",

  // number FIRST, optional "Stand"/"Number"/"Plot"/"No."/"#" lead-in, optional
  // range/subdivision ("1234/5"), optional glued letter suffix ("29B").
  houseNumberPattern:
    "(?:Stand\\s+(?:No\\.?\\s*)?|Number\\s+|Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the suburb+city chain together; drop leading suburb(s) in postNormalize.
  // Zimbabwe has no address-level region, so the county slot is disabled with a
  // never-match sentinel — otherwise the default county pattern would grab the
  // routing city ("Avondale, Harare" -> city="Avondale", county="Harare").
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  // Flat / Apartment / House / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("Karigamombe Centre, Julius Nyerere Way, Harare").
  buildingKeywords: [
    "Centre", "Center", "House", "Tower", "Towers", "Plaza", "Building",
    "Mall", "Complex", "Chambers",
  ],

  // Zimbabwe boxes often carry a 1-letter exchange prefix ("P.O. Box A123").
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Post Box", "Private Bag", "P. Bag", "P/Bag"],
  poBoxNumberPattern: "[A-Za-z]{0,2}\\s*\\d+",
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "post box": "PO Box",
    "private bag": "Private Bag", "p. bag": "Private Bag", "p/bag": "Private Bag",
  },

  // Collapse the "suburb, city" chain to the routing city + dropped suburb(s). The
  // "Stand"/"Number"/"Plot" number lead-ins are consumed but not emitted, so they
  // are exempted from the token-preservation guard here (as PK does for
  // "House"/"Plot").
  postNormalize: (parsed: Record<string, any>) => {
    keepLastLocality(parsed, ["Stand", "Number", "Plot"]);
  },
};

export default zwConfig;
