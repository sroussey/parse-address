import type { EuCountryConfig } from "../_eu/types";

/**
 * Australia (AU) address configuration.
 *
 * Order: house/building NUMBER first, then street name + type suffix
 *        ("10 Collins Street", "219-241 Cleveland Street").
 * Type: trailing suffix, kept verbatim incl. Australia Post abbreviations
 *        (St, Rd, Ave, Cr/Cres, Tce, Pde, Cct...).
 * Secondary unit LEADS the address ("Unit 3, 17 Adam Street"); the Australian
 *        unit-slash-street form "3/17 Adam Street" (unit 3 at number 17) is
 *        captured in the house-number pattern and folded in postNormalize.
 * Place: SUBURB + STATE + 4-digit POSTCODE on the last line
 *        ("Strawberry Hills NSW 1427"), the state usually NOT comma-delimited,
 *        so the state abbreviation is peeled inside the postcode pattern.
 */

const TYPES = [
  // full words
  "Street", "Road", "Roadway", "Avenue", "Drive", "Lane", "Court", "Place",
  "Parade", "Terrace", "Crescent", "Close", "Circuit", "Boulevard", "Esplanade",
  "Highway", "Freeway", "Square", "Grove", "Way", "Rise", "Cove", "Circle",
  "Loop", "Row", "Vista", "Promenade", "Mall", "Walk", "Quay", "Gardens",
  "Heights", "Chase", "Bend", "Glade", "Glen", "Green", "Hill", "Mews",
  "Nook", "Outlook", "Parkway", "Pass", "Pathway", "Pocket", "Reserve",
  "Ridge", "Retreat", "Serviceway", "Strand", "Track", "Trail", "Turn",
  "Vale", "View", "Waters", "Gate", "Junction", "Link", "Alley", "Arcade",
  // Australia Post abbreviations (verbatim)
  "St", "Rd", "Av", "Ave", "Dr", "Ln", "Ct", "Pl", "Pde", "Tce", "Cr",
  "Cres", "Cct", "Bvd", "Blvd", "Esp", "Sq", "Gr", "Hwy", "Hts", "Gdns",
  "Wlk", "Qy", "Cir", "Prom", "Vsta",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD", roadway: "RD",
  avenue: "AVE", av: "AVE", ave: "AVE",
  drive: "DR", dr: "DR",
  lane: "LN", ln: "LN",
  court: "CT", ct: "CT",
  place: "PL", pl: "PL",
  parade: "PDE", pde: "PDE",
  terrace: "TCE", tce: "TCE",
  crescent: "CRES", cr: "CRES", cres: "CRES",
  close: "CL",
  circuit: "CCT", cct: "CCT",
  boulevard: "BVD", bvd: "BVD", blvd: "BVD",
  esplanade: "ESP", esp: "ESP",
  highway: "HWY", hwy: "HWY",
  freeway: "FWY",
  square: "SQ", sq: "SQ",
  grove: "GR", gr: "GR",
  way: "WAY",
  rise: "RISE",
  cove: "COVE",
  circle: "CIR", cir: "CIR",
  loop: "LOOP",
  row: "ROW",
  vista: "VSTA", vsta: "VSTA",
  promenade: "PROM", prom: "PROM",
  mall: "MALL",
  walk: "WLK", wlk: "WLK",
  quay: "QY", qy: "QY",
  gardens: "GDNS", gdns: "GDNS",
  heights: "HTS", hts: "HTS",
  parkway: "PWY",
  gate: "GTE",
};

// State/territory abbreviations and full names -> canonical code.
const REGION_MAP: Record<string, string> = {
  nsw: "NSW", "new south wales": "NSW",
  vic: "VIC", victoria: "VIC",
  qld: "QLD", queensland: "QLD",
  sa: "SA", "south australia": "SA",
  wa: "WA", "western australia": "WA",
  tas: "TAS", tasmania: "TAS",
  nt: "NT", "northern territory": "NT",
  act: "ACT", "australian capital territory": "ACT",
};

const STATE_ALT =
  "NSW|VIC|QLD|SA|WA|TAS|NT|ACT|" +
  "New\\s+South\\s+Wales|Victoria|Queensland|South\\s+Australia|" +
  "Western\\s+Australia|Tasmania|Northern\\s+Territory|" +
  "Australian\\s+Capital\\s+Territory";

export const auConfig: EuCountryConfig = {
  code: "au",
  country: "AU",
  countryNames: ["Australia", "AUS", "AU"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // Types echoed as written (Street, St, Rd, Tce...).
  normalizeTypeCase: false,

  // The state abbreviation sits between the suburb and the 4-digit postcode and
  // is usually NOT comma-delimited ("Strawberry Hills NSW 1427"), so it is
  // peeled here as an optional prefix of the postcode. `state_3` folds to
  // `state` in normalization (the trailing "_3" is stripped) and is then
  // canonicalised via regionMap; the built-in comma-delimited county capture
  // handles the "Suburb, NSW 1427" data-entry variant.
  postalPattern: `(?:(?<state_3>${STATE_ALT})[\\s,]+)?(?<postal_code>\\d{4})`,

  // House/building number: optional leading unit "N/" (Australian unit-slash-
  // street, "3/17" = unit 3 at number 17), then the number or a range, with an
  // optional glued letter suffix ("17A"). `sec_unit_num_slash` is moved to the
  // secondary unit in postNormalize.
  houseNumberPattern:
    "(?:(?<sec_unit_num_slash>\\d+[A-Za-z]?)\\s*/\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // Constrain the comma-delimited county to real state codes so an ordinary
  // comma-separated locality is not mistaken for a state.
  countyPattern: `(?:${STATE_ALT})`,

  // Region (state) canonicalisation for both the postcode-prefix and the
  // comma-delimited forms.
  regionPattern: `(?<state>${STATE_ALT})`,
  regionMap: REGION_MAP,

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Apartment|Apt\\.?|Flat|Suite|Shop|Level|Office|Villa|Townhouse|Factory|Penthouse|Room|Site|Berth)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    suite: "Suite",
    shop: "Shop",
    level: "Level",
    office: "Office",
    villa: "Villa",
    townhouse: "Townhouse",
    factory: "Factory",
    penthouse: "Penthouse",
    room: "Room",
    site: "Site",
    berth: "Berth",
  },

  poBoxNames: ["PO Box", "P.O. Box", "GPO Box", "Locked Bag", "Private Bag", "RMB", "RSD"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "gpo box": "GPO Box",
    "locked bag": "Locked Bag",
    "private bag": "Private Bag",
    rmb: "RMB",
    rsd: "RSD",
  },
  // PO/GPO box and bag numbers may carry a hyphen.
  poBoxNumberPattern: "[A-Za-z]?\\d[\\d\\s-]*\\d|\\d",

  // Fold the unit-slash-street helper into the secondary unit.
  postNormalize: (parsed: Record<string, any>) => {
    if (parsed.sec_unit_num_slash) {
      parsed.sec_unit_num = parsed.sec_unit_num_slash;
      if (!parsed.sec_unit_type) parsed.sec_unit_type = "Unit";
      delete parsed.sec_unit_num_slash;
    }
  },
};

export default auConfig;
