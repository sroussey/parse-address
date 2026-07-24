import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Rwanda (RW) address configuration.
 *
 * Kigali uses a systematic CODED street grammar: a 2-letter zone code
 * (KG = Gasabo, KN = Nyarugenge, KK = Kicukiro), a road number, and an English
 * type abbreviation — "KG 11 Ave", "KN 5 Rd", "KK 15 Ave", "KG 546 St". The
 * coded stem ("KG 11") is the street NAME and the trailing word ("Ave"/"St"/
 * "Rd") is the TYPE. Modelled as ordinary number-first, suffix-type: with no
 * leading house number the whole "KG 11 Ave" parses as street "KG 11" + type
 * "Ave"; a leading house number ("24 KG 11 Ave") is consumed first.
 *
 * Order: number-first, suffix type. Type: trailing English suffix (Ave, St, Rd,
 *        Blvd, ...) kept verbatim; many lines are type-less.
 * Locality: a Kigali sector (Kacyiru, Kimihurura, Remera, Nyarutarama, ...) may
 *        sit between the street and the city; the comma chain is kept together
 *        and the leading sector(s) dropped in postNormalize.
 * Postcode: NONE. Rwanda does not operate a postal-code system. Never-match
 *        sentinel; the after-city grammar supplies "..., City".
 * Province (-> state): the 5 provinces (Kigali City, Northern, Southern,
 *        Eastern, Western) may follow the city; only the explicit province forms
 *        are recognised so a bare city ("Kigali") is never eaten.
 * PO Box: very common ("P.O. Box 6912, Kigali").
 *
 * KNOWN GAP: a Rwandan address that writes the house number AFTER the coded
 * street ("KG 11 Ave, 24, Kigali") is irregular and marked __skip.
 *
 * Sources: Rwanda's Kigali street-addressing system (City of Kigali); UPU note;
 * Smarty / GeoPostcodes RW guides. See research-rw.md.
 */

const TYPES = [
  "Avenue", "Street", "Road", "Boulevard", "Drive", "Close", "Lane", "Way",
  "Circle",
  // abbreviations (kept verbatim, the Kigali coded form)
  "Ave", "Av", "St", "Rd", "Blvd", "Dr",
];

const TYPE_SHORT: Record<string, string> = {
  avenue: "AVE", ave: "AVE", av: "AVE",
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  boulevard: "BLVD", blvd: "BLVD",
  drive: "DR", dr: "DR",
  close: "CL",
  lane: "LN",
  way: "WAY",
  circle: "CIR",
};

// 5 provinces. Only the explicit forms are recognised (a bare "Kigali" is the
// city). Northern/Southern/Eastern/Western do not duplicate a city name.
const PROVINCE_ALT = [
  "Kigali\\s+City",
  "City\\s+of\\s+Kigali",
  "Northern\\s+Province",
  "Southern\\s+Province",
  "Eastern\\s+Province",
  "Western\\s+Province",
  "Northern",
  "Southern",
  "Eastern",
  "Western",
]
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {
  "kigali city": "Kigali City",
  "city of kigali": "Kigali City",
  "northern province": "Northern",
  "southern province": "Southern",
  "eastern province": "Eastern",
  "western province": "Western",
  northern: "Northern",
  southern: "Southern",
  eastern: "Eastern",
  western: "Western",
};

export const rwConfig: EuCountryConfig = {
  code: "rw",
  country: "RW",
  countryNames: ["Rwanda", "Republic of Rwanda", "RWA", "RW"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcode anywhere in Rwanda -> never-match sentinel.
  postalPattern: "(?<postal_code>(?!x)x)",

  houseNumberPattern:
    "(?:House\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the sector+city chain together; drop leading sector(s) in postNormalize.
  cityAllowsCommas: true,
  countyPattern: `(?:${PROVINCE_ALT})`,
  regionMap: REGION_MAP,

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit|Office)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit", office: "Office",
  },

  buildingKeywords: [
    "House", "Building", "Centre", "Center", "Plaza", "Towers", "Tower",
    "Complex", "Chambers", "Court", "Mall",
  ],

  poBoxNumberPattern: "[A-Za-z]{0,3}\\s*\\d+",
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "Private Bag", "Post Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "private bag": "Private Bag", "post box": "PO Box",
  },

  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s: string) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },
};

export default rwConfig;
