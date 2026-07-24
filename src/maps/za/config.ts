import type { EuCountryConfig } from "../_eu/types";

/**
 * South Africa (ZA) address configuration. SEC code T3.
 *
 * Order: house/building NUMBER first, then the street name + trailing type
 *        suffix ("300 Kempston Road") — GB-style number-first, suffix-type.
 * Type: trailing English suffix (Street, Road, Avenue, Drive, ...) or spaced
 *        Afrikaans equivalent (Straat, Laan, Weg, Rylaan, Singel). Fused
 *        Afrikaans forms ("Kerkstraat") are a documented failure mode.
 * Postcode: 4-digit numeric, LAST after the suburb/city (after-city). Leading
 *        zeros are significant ("0002").
 * Province: optional -> state (Gauteng, Western Cape, KwaZulu-Natal, ...).
 *
 * NOTE: SA addresses often carry BOTH a suburb and a city before the postcode
 * (e.g. "Yeoville, Johannesburg"). The engine has a single city slot; the
 * suburb+city chain is a documented failure mode (see research-za.md). Enabling
 * cityAllowsCommas keeps the locality chain together rather than truncating it.
 */

const TYPES = [
  // English (suffix)
  "Street", "Road", "Avenue", "Drive", "Lane", "Close", "Crescent",
  "Boulevard", "Terrace", "Court", "Grove", "Heights", "Circle", "Ring",
  "Row", "Mews", "Gardens", "Walk", "Highway", "Freeway", "Loop", "Link",
  "Bend", "Rise", "View", "Way", "Place", "Park",
  // Afrikaans (spaced form; fused form handled as failure mode)
  "Straat", "Laan", "Weg", "Rylaan", "Singel",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Cres", "Blvd", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", straat: "ST",
  road: "RD", rd: "RD", weg: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE", laan: "AVE",
  drive: "DR", dr: "DR", rylaan: "DR",
  lane: "LN",
  close: "CL",
  crescent: "CRES", cres: "CRES", singel: "CRES",
  boulevard: "BLVD", blvd: "BLVD",
  terrace: "TER",
  court: "CT",
  grove: "GR",
  heights: "HTS",
  circle: "CIR",
  ring: "RING",
  row: "ROW",
  mews: "MEWS",
  gardens: "GDNS",
  walk: "WLK",
  highway: "HWY", hwy: "HWY",
  freeway: "FWY",
  loop: "LOOP",
  link: "LINK",
  bend: "BEND",
  rise: "RISE",
  view: "VIEW",
  way: "WAY",
  place: "PL",
  park: "PARK",
};

// Nine provinces, spelled out (multi-word ones longest-first via alternation).
const PROVINCES = [
  "Eastern Cape", "Western Cape", "Northern Cape", "North West",
  "Free State", "KwaZulu-Natal", "KwaZulu Natal", "Gauteng", "Limpopo",
  "Mpumalanga",
];

const REGION_MAP: Record<string, string> = {
  "eastern cape": "EC",
  "western cape": "WC",
  "northern cape": "NC",
  "north west": "NW",
  "free state": "FS",
  "kwazulu-natal": "KZN",
  "kwazulu natal": "KZN",
  gauteng: "GP",
  limpopo: "LP",
  mpumalanga: "MP",
};

export const zaConfig: EuCountryConfig = {
  code: "za",
  country: "ZA",
  countryNames: ["South Africa", "Suid-Afrika", "RSA", "ZAF", "ZA"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English/Afrikaans types echoed as written (Road, Straat, Laan).
  normalizeTypeCase: false,

  // 4-digit numeric, leading zeros kept.
  postalPattern: "(?<postal_code>\\d{4})",

  // number (or "10-12" range kept in number), then an optional glued letter
  // civic suffix ("12A" -> number 12, suffix A).
  houseNumberPattern:
    "(?<number>\\d+(?:\\s*[-–]\\s*\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the suburb+city locality chain together instead of truncating it; the
  // real routing city is the LAST locality before the postcode (postNormalize
  // drops the earlier suburb(s)).
  cityAllowsCommas: true,
  // Only a real province may land in the state slot, so an ordinary "suburb,
  // city" pair is not mis-split with the city taken as state.
  countyPattern: `(?:${PROVINCES.join("|")})`,

  // Optional province after the city -> state.
  regionPattern: `(?<state>${PROVINCES.join("|")})`,
  regionMap: REGION_MAP,

  // The city capture may hold "Suburb, City" (and rarely "Suburb, City,
  // Province"); keep the last non-province locality as the city and drop the
  // leading suburb(s). A trailing province is folded to state.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      const last = parts[parts.length - 1] ?? "";
      if (REGION_MAP[last.toLowerCase()]) {
        if (!parsed.state) parsed.state = REGION_MAP[last.toLowerCase()];
        parts.pop();
      }
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        // The earlier locality/localities are suburbs, dropped from the output;
        // report them so they are not counted as lost tokens.
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  // Unit/Flat/Shop/Suite lead the address (before the number), as in GB.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Flat|Apartment|Apt\\.?|Suite|Floor|Room|Block|Door|Shop|Cottage)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit",
    flat: "Flat",
    apartment: "Apartment",
    apt: "Apt",
    suite: "Suite",
    floor: "Floor",
    room: "Room",
    block: "Block",
    door: "Door",
    shop: "Shop",
    cottage: "Cottage",
  },

  // Building name may lead a corporate address ("Sandton City, 83 Rivonia Road").
  buildingKeywords: [
    "Building", "House", "Centre", "Center", "City", "Chambers", "Towers",
    "Tower", "Place", "Court", "Mall", "Park", "Plaza",
  ],

  // "Private Bag X9" carries an X-prefixed number; Postnet Suite is a private box.
  poBoxNumberPattern: "[A-Za-z]?\\s*\\d+",
  poBoxNames: ["PO Box", "P.O. Box", "Private Bag", "Postnet Suite", "Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "private bag": "Private Bag",
    "postnet suite": "Postnet Suite",
    box: "PO Box",
  },
};

export default zaConfig;
