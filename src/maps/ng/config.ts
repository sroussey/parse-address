import type { EuCountryConfig } from "../_eu/types";

/**
 * Nigeria (NG) address configuration.
 *
 * Order: house/building NUMBER first, then the street name + trailing English
 *        type suffix ("12 Adeola Odeku Street") — GB/ZA-style number-first.
 * Type: trailing English suffix (Street, Road, Avenue, Close, Crescent, ...).
 *        Many Nigerian roads are type-less ("Awolowo Way" has one, but a bare
 *        "Allen" / estate-road may not); type must be optional.
 * Locality: an AREA / district (Victoria Island, Ikoyi, Wuse II, GRA, ...)
 *        usually sits between the street and the routing city. The engine has a
 *        single city slot, so — as in ZA/IN — the comma chain is kept together
 *        and the leading area(s) are dropped in postNormalize, keeping the last
 *        locality (the city) as `city`.
 * Postcode: 6-digit NIPOST code, written AFTER the city (after-city), and VERY
 *        frequently OMITTED (introduced 2000s, low real-world adoption). Optional.
 * State: the 36 states + FCT (Lagos, Rivers, Kano, ...), written after the city,
 *        commonly with a trailing word "State" ("Lagos State"). May appear
 *        BEFORE the postcode (no code) via the county slot, or AFTER the postcode
 *        ("... Lagos 101241, Lagos State") via a helper `ng_state` group folded
 *        in postNormalize. Output state is a 2-letter code (LA, RI, KN, ...).
 * PO Box: extremely common ("P.O. Box 1234, Marina, Lagos"); the box replaces
 *        the thoroughfare.
 *
 * Sources: NIPOST; UPU S42 NG template; Smarty / PostGrid / GeoPostcodes NG
 * address guides; Universal Postal Union postcode note. See research-ng.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Close", "Crescent", "Boulevard", "Drive",
  "Lane", "Way", "Court", "Place", "Terrace", "Walk", "Gardens", "Circle",
  "Ring", "Loop", "Link", "Rise", "Grove", "Row", "Park", "Mews", "Hill",
  "Highway", "Expressway", "Crescent",
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
  walk: "WLK",
  gardens: "GDNS",
  circle: "CIR",
  ring: "RING",
  loop: "LOOP",
  link: "LINK",
  rise: "RISE",
  grove: "GR",
  row: "ROW",
  park: "PARK",
  mews: "MEWS",
  hill: "HL",
  highway: "HWY", hwy: "HWY",
  expressway: "EXPY",
};

// 36 states + FCT. `[name]` and `[name] State` are both accepted; the map is
// keyed by both the bare name and the "... state" form so either normalises to
// the 2-letter code.
const STATE_CODES: Array<[string, string]> = [
  ["Abia", "AB"], ["Adamawa", "AD"], ["Akwa Ibom", "AK"], ["Anambra", "AN"],
  ["Bauchi", "BA"], ["Bayelsa", "BY"], ["Benue", "BE"], ["Borno", "BO"],
  ["Cross River", "CR"], ["Delta", "DE"], ["Ebonyi", "EB"], ["Edo", "ED"],
  ["Ekiti", "EK"], ["Enugu", "EN"], ["Gombe", "GO"], ["Imo", "IM"],
  ["Jigawa", "JI"], ["Kaduna", "KD"], ["Kano", "KN"], ["Katsina", "KT"],
  ["Kebbi", "KE"], ["Kogi", "KO"], ["Kwara", "KW"], ["Lagos", "LA"],
  ["Nasarawa", "NA"], ["Niger", "NI"], ["Ogun", "OG"], ["Ondo", "ON"],
  ["Osun", "OS"], ["Oyo", "OY"], ["Plateau", "PL"], ["Rivers", "RI"],
  ["Sokoto", "SO"], ["Taraba", "TA"], ["Yobe", "YO"], ["Zamfara", "ZM"],
  ["FCT", "FC"], ["Abuja", "FC"], ["Federal Capital Territory", "FC"],
];

const REGION_MAP: Record<string, string> = {};
for (const [name, code] of STATE_CODES) {
  REGION_MAP[name.toLowerCase()] = code;
  REGION_MAP[`${name.toLowerCase()} state`] = code;
}

// State/county alternation. A bare state name (Lagos, Kano, Rivers) is IDENTICAL
// to a major city name, so matching it as the region would eat the city. We
// therefore only recognise the EXPLICIT region forms — "<Name> State" and the
// capital-territory markers (FCT / Federal Capital Territory) — leaving a bare
// "Lagos" to be kept as the routing city. (A region written as a bare name that
// duplicates the city is a documented failure mode; see research-ng.md.)
const STATE_NAMES = STATE_CODES.map(([n]) => n).filter(
  (n) => n !== "FCT" && n !== "Abuja" && n !== "Federal Capital Territory"
);
const COUNTY_ALT = [
  ...STATE_NAMES.map((n) => `${n.replace(/ /g, "\\s+")}\\s+State`),
  "Federal\\s+Capital\\s+Territory",
  "FCT",
]
  .sort((a, b) => b.length - a.length)
  .join("|");

export const ngConfig: EuCountryConfig = {
  code: "ng",
  country: "NG",
  countryNames: ["Nigeria", "Federal Republic of Nigeria", "NGA", "NG"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 6-digit NIPOST code, then an OPTIONAL trailing state ("101241, Lagos State"),
  // captured in a helper group folded to `state` in postNormalize.
  postalPattern:
    `(?<postal_code>\\d{6})(?:[\\s,]+(?<ng_state>${COUNTY_ALT}))?`,

  // number: plain integer or block form ("A3/11" -> keep "3/11" after the
  // optional letter is handled elsewhere; here "12", "1/3", "5-7"), optional
  // glued letter suffix, optional "No." lead-in.
  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+city locality chain together; a real state (no postcode form)
  // lands in the county slot before the country.
  cityAllowsCommas: true,
  countyPattern: `(?:${COUNTY_ALT})`,
  regionMap: REGION_MAP,

  // Flat / Suite / Block / Floor / Shop lead the address (as in GB/ZA).
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Suite|Block|Floor|Room|Shop|Unit|House)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", suite: "Suite",
    block: "Block", floor: "Floor", room: "Room", shop: "Shop", unit: "Unit",
    house: "House",
  },

  // A leading building/plaza name ("Churchgate Tower, 30 Afribank Street, ...").
  buildingKeywords: [
    "Plaza", "Tower", "Towers", "House", "Building", "Centre", "Center",
    "Complex", "Court", "Mall", "Estate",
  ],

  poBoxNames: ["P.O. Box", "PO Box", "P M B", "P.M.B.", "PMB", "Post Box"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p m b": "PMB",
    "p.m.b.": "PMB", pmb: "PMB", "post box": "PO Box",
  },

  // Fold the helper `ng_state` (state after the postcode) into `state`, and
  // collapse the "area, city" chain to the routing city + dropped area(s).
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.ng_state === "string" && parsed.ng_state) {
      const key = parsed.ng_state.toLowerCase().replace(/\s+/g, " ").trim();
      if (!parsed.state) parsed.state = REGION_MAP[key] ?? parsed.ng_state;
      delete parsed.ng_state;
    }
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s: string) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },
};

export default ngConfig;
