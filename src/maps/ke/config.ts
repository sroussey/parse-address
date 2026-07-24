import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Kenya (KE) address configuration.
 *
 * Order: house NUMBER first, then the street name + trailing English type
 *        ("8 Kenyatta Avenue") — GB/ZA-style number-first, suffix type.
 * Type: trailing English suffix (Avenue, Road, Street, Lane, Close, Drive, ...).
 * Locality: an ESTATE / area (Kilimani, Westlands, Upper Hill, Karen, ...)
 *        commonly sits between the street and the routing city; as in ZA/IN the
 *        comma chain is kept together and the leading estate(s) dropped in
 *        postNormalize, keeping the last locality (the city).
 * Postcode: 5-digit, written AFTER the city and OFTEN OMITTED. Optional.
 * PO Box: the DOMINANT postal form. Written "P.O. Box 30500-00100, Nairobi",
 *        i.e. a box number, a hyphen, and the 5-digit postal code of the
 *        delivery post office, then the town. Modelled as one captured box token
 *        ("30500-00100") that postNormalize splits into the box number
 *        (sec_unit_num) and the postal_code.
 *
 * Sources: Postal Corporation of Kenya (Posta); UPU S42 KE template & postcode
 * note; Smarty / PostGrid KE address guides. See research-ke.md.
 */

const TYPES = [
  "Avenue", "Road", "Street", "Lane", "Close", "Drive", "Crescent",
  "Boulevard", "Way", "Court", "Place", "Terrace", "Highway", "Ring",
  "Loop", "Rise", "Grove", "Row", "Park", "Gardens", "Walk", "Hill",
  // abbreviations
  "Ave", "Av", "Rd", "St", "Dr", "Cl", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  avenue: "AVE", ave: "AVE", av: "AVE",
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
  lane: "LN",
  close: "CL", cl: "CL",
  drive: "DR", dr: "DR",
  crescent: "CRES", cres: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  way: "WAY",
  court: "CT",
  place: "PL",
  terrace: "TER",
  highway: "HWY", hwy: "HWY",
  ring: "RING",
  loop: "LOOP",
  rise: "RISE",
  grove: "GR",
  row: "ROW",
  park: "PARK",
  gardens: "GDNS",
  walk: "WLK",
  hill: "HL",
};

export const keConfig: EuCountryConfig = {
  code: "ke",
  country: "KE",
  countryNames: ["Kenya", "Republic of Kenya", "KEN", "KE"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postal code, after the city; optional.
  postalPattern: "(?<postal_code>\\d{5})",

  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the estate+city chain together; drop leading estate(s) in postNormalize.
  // Kenya has no address-level region, so the county slot is disabled with a
  // never-match sentinel — otherwise the default county pattern would grab the
  // routing city ("Kilimani, Nairobi" -> city="Kilimani", county="Nairobi").
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

  // A leading building name ("Bishop Magua Centre, Ngong Road, ...").
  buildingKeywords: [
    "Centre", "Center", "House", "Towers", "Tower", "Plaza", "Building",
    "Court", "Mall", "Complex", "Arcade",
  ],

  // PO Box is the dominant form. The captured box token may be a bare box
  // number OR "box-postal" ("30500-00100"); postNormalize splits the latter.
  poBoxNames: ["P.O. Box", "PO Box", "P O Box", "Private Bag", "Post Box"],
  poBoxNumberPattern: "\\d+(?:\\s*[-–]\\s*\\d{5})?",
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p o box": "PO Box",
    "private bag": "Private Bag", "post box": "PO Box",
  },

  // Split a "box-postal" sec_unit_num into the box number + postal code, and
  // collapse the "estate, city" chain to the routing city + dropped estate(s).
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.sec_unit_num === "string") {
      const m = /^(\d+)-(\d{5})$/.exec(parsed.sec_unit_num);
      if (m) {
        parsed.sec_unit_num = m[1];
        if (!parsed.postal_code) parsed.postal_code = m[2];
      }
    }
    keepLastLocality(parsed);
  },
};

export default keConfig;
