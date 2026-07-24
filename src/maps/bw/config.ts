import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Botswana (BW) address configuration.
 *
 * Order: the plot/house NUMBER first, then (optionally) a street name + trailing
 *        English type ("Plot 50371, Fairgrounds" / "5 Queens Road") — GB-style
 *        number-first, suffix type. English is the language of administration.
 * "Plot": the cadastral stand number is the primary physical identifier and is
 *        usually written "Plot NNNNN" (also "Stand NNNN"). The "Plot"/"Stand"
 *        marker is KEPT inside the `number` field ("Plot 50371") so no source
 *        token is lost. A following segment is often a suburb/ward written where
 *        a street would sit ("Plot 50371, Fairgrounds, Gaborone"); with no
 *        street slot of its own it lands in `street` (untyped) — lossless.
 * Type: trailing English suffix (Road, Street, Avenue, Drive, Crescent, ...) or
 *        null (many plots have no named street).
 * Postcode: NONE. Botswana has NEVER operated a postcode system (BotswanaPost
 *        confirms; UPU S42 BW template has no postcode field). The postcode slot
 *        is a never-match sentinel; the after-city grammar's postcode-absent
 *        branch supplies "..., City".
 * Region: districts (South-East, Kgatleng, ...) are essentially never written on
 *        mail; no `state` is modelled (county slot disabled).
 * PO Box / Private Bag: DOMINANT. Most Botswana mail is delivered to a box:
 *        "P O Box 1234, Gaborone", "Private Bag 0057, Gaborone" (bag numbers may
 *        carry a 1-3 letter prefix, "Private Bag BR 129", "Private Bag F317").
 *
 * Sources: BotswanaPost; UPU S42 BW template (bwaEn.pdf); Smarty / PostGrid /
 * GeoPostcodes BW guides; Umbrex "How to address a letter to Botswana"
 * (postcodes not used). See research-bw.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Drive", "Lane", "Close", "Crescent",
  "Boulevard", "Way", "Terrace", "Mall", "Circle", "Rise",
  "Walk", "Row", "Highway",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  drive: "DR", dr: "DR",
  lane: "LN",
  close: "CL",
  crescent: "CRES", cres: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  way: "WAY",
  terrace: "TER",
  mall: "MALL",
  circle: "CIR",
  rise: "RISE",
  walk: "WLK",
  row: "ROW",
  highway: "HWY", hwy: "HWY",
};

export const bwConfig: EuCountryConfig = {
  code: "bw",
  country: "BW",
  countryNames: ["Botswana", "BWA", "BW"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcode anywhere in Botswana -> never-match sentinel; the after-city
  // grammar falls through to its "..., City" (postcode-absent) branch.
  postalPattern: "(?<postal_code>(?!x)x)",

  // "Plot"/"Stand" marker is retained inside the number so it is not scored as a
  // lost token; then a plain integer (or range) and an optional glued letter.
  houseNumberPattern:
    "(?<number>(?:Plot|Stand)\\s+\\d+|\\d+(?:\\s*[-–]\\s*\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep any "suburb/ward, town" chain together; drop the leading suburb(s) in
  // postNormalize, keeping the last locality as the routing town. No mailing
  // region, so the county slot is disabled so it cannot swallow the town.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  // Unit / Flat / Shop / Office lead the address (GB-style).
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Flat|Apartment|Apt\\.?|Suite|Office|Floor|Room|Block|Shop)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit", flat: "Flat", apartment: "Apartment", apt: "Apt",
    suite: "Suite", office: "Office", floor: "Floor", room: "Room",
    block: "Block", shop: "Shop",
  },

  // A leading building name ("Tshomarelo House, ...", "Barclays House, ...").
  buildingKeywords: [
    "House", "Building", "Centre", "Center", "Plaza", "Towers",
    "Tower", "Chambers", "Court", "Complex",
  ],

  // Private Bag numbers may carry a 1-3 letter prefix ("Private Bag BR 129").
  poBoxNumberPattern: "[A-Za-z]{0,3}\\s*\\d+",
  poBoxNames: ["P O Box", "P.O. Box", "PO Box", "Private Bag", "Box"],
  poBoxDisplayMap: {
    "p o box": "PO Box", "p.o. box": "PO Box", "po box": "PO Box",
    "private bag": "Private Bag", box: "PO Box",
  },

  // Collapse a "suburb, town" chain to the routing town + dropped suburb(s).
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default bwConfig;
