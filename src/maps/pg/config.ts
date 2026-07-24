import type { EuCountryConfig } from "../_eu/types";

/**
 * Papua New Guinea (PG) address configuration.
 *
 * Language: English.
 * Order: house NUMBER first, then the street name + trailing type suffix
 *   ("123 Independence Avenue") -- GB/ZA-style number-first, suffix-type. Many
 *   urban lots use the cadastral form "Section N Lot N" (a numbered allotment
 *   with no street type); with a number-first grammar this is captured whole as
 *   the street name.
 * Type: trailing English suffix (Street, Avenue, Road, Drive, Highway, ...),
 *   kept verbatim (incl. St, Ave, Rd, Hwy).
 * Postcode: 3 digits, written AFTER the city, and VERY OFTEN OMITTED
 *   ("Port Moresby 121" or just "Port Moresby").
 * Province: optional -> state (National Capital District, Morobe, Western
 *   Highlands, ...).
 * PO box: "P.O. Box" / "PO Box", plus "Private Mail Bag".
 *
 * A suburb frequently sits between the street and the city
 * ("Section 34 Lot 12, Hohola, Port Moresby"); like ZA, PG has a single city
 * slot, so cityAllowsCommas keeps the chain together and postNormalize keeps the
 * routing city (last locality), folding a trailing province to state and
 * dropping the earlier suburb(s).
 *
 * Sources: Post PNG; UPU addressing note (PNG); Smarty / PostGrid PNG guides;
 *   PNG National Gazette cadastral (Section/Allotment) records. See research-pg.md.
 */

const TYPES = [
  "Street", "Avenue", "Road", "Drive", "Highway", "Boulevard", "Place",
  "Crescent", "Parade", "Close", "Court", "Lane", "Terrace", "Esplanade",
  "Way", "Loop", "Circuit",
  // abbreviations
  "St", "Ave", "Av", "Rd", "Dr", "Hwy", "Cres", "Pde",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE", av: "AVE",
  road: "RD", rd: "RD",
  drive: "DR", dr: "DR",
  highway: "HWY", hwy: "HWY",
  boulevard: "BLVD",
  place: "PL",
  crescent: "CRES", cres: "CRES",
  parade: "PDE", pde: "PDE",
  close: "CL",
  court: "CT",
  lane: "LN",
  terrace: "TER",
  esplanade: "ESP",
  way: "WAY",
  loop: "LOOP",
  circuit: "CCT",
};

// Provinces (and the National Capital District), longest spellings first.
const PROVINCES = [
  "National Capital District", "Autonomous Region of Bougainville",
  "Bougainville", "Western Highlands", "Eastern Highlands",
  "Southern Highlands", "East New Britain", "West New Britain", "East Sepik",
  "West Sepik", "Sandaun", "Milne Bay", "New Ireland", "Manus", "Madang",
  "Morobe", "Central", "Chimbu", "Simbu", "Enga", "Gulf", "Hela", "Jiwaka",
  "Northern", "Oro", "Western",
];

const REGION_MAP: Record<string, string> = {
  "national capital district": "NCD", ncd: "NCD",
  central: "CPM",
  chimbu: "CPK", simbu: "CPK",
  "east new britain": "EBR",
  "eastern highlands": "EHG",
  enga: "EPW",
  "east sepik": "ESW",
  gulf: "GPK",
  hela: "HLA",
  jiwaka: "JWK",
  "milne bay": "MBA",
  madang: "MPM",
  morobe: "MPL",
  manus: "MRL",
  "new ireland": "NIK",
  northern: "NPP", oro: "NPP",
  bougainville: "NSB", "autonomous region of bougainville": "NSB",
  "west sepik": "SAN", sandaun: "SAN",
  "southern highlands": "SHM",
  "west new britain": "WBK",
  "western highlands": "WHM",
  western: "WPD",
};

export const pgConfig: EuCountryConfig = {
  code: "pg",
  country: "PG",
  countryNames: ["Papua New Guinea", "PNG", "PG"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 3-digit numeric postcode (optional in the grammar -- routinely omitted).
  postalPattern: "(?<postal_code>\\d{3})",

  // Number or "12-14" range with an optional glued letter suffix.
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "suburb, city" chain together; only a real province may land in the
  // state slot, so an ordinary "suburb, city" pair is not mis-split.
  cityAllowsCommas: true,
  countyPattern: `(?:${PROVINCES.join("|")})`,

  regionPattern: `(?<state>${PROVINCES.join("|")})`,
  regionMap: REGION_MAP,

  // The city capture may hold "Suburb, City" (and rarely a trailing province);
  // keep the last non-province locality as the city, fold a trailing province to
  // state, and drop the earlier suburb(s).
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
        parsed.__dropped = parts.slice(0, -1);
      }
    }
    // A 3-digit postcode written after the city sometimes lands inside the city
    // slot (e.g. when a province follows: "Port Moresby 121, National Capital
    // District"). Peel a trailing 3-digit run off the final city into postal_code.
    if (!parsed.postal_code && typeof parsed.city === "string") {
      const m = /^(.+?)\s+(\d{3})$/.exec(parsed.city.trim());
      if (m) {
        parsed.city = m[1];
        parsed.postal_code = m[2];
      }
    }
  },

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Unit|Flat|Suite|Floor|Room|Haus)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt",
    unit: "Unit",
    flat: "Flat",
    suite: "Suite",
    floor: "Floor",
    room: "Room",
    haus: "Haus",
  },

  poBoxNames: [
    "P.O. Box", "PO Box", "Post Office Box", "Private Mail Bag", "P.M.B.",
    "PMB", "Box",
  ],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "post office box": "PO Box",
    "private mail bag": "Private Mail Bag", "p.m.b.": "PMB", pmb: "PMB",
    box: "PO Box",
  },
};

export default pgConfig;
