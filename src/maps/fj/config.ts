import type { EuCountryConfig } from "../_eu/types";

/**
 * Fiji (FJ) address configuration.
 *
 * Language: English.
 * Order: house/building NUMBER first, then the street name + trailing type
 *   suffix ("14 Viria Street") -- GB/ZA-style number-first, suffix-type.
 * Type: trailing English suffix (Street, Road, Avenue, Drive, Place, ...) kept
 *   verbatim, incl. abbreviations (St, Rd, Ave).
 * Postcode: NONE. Fiji has no postal-code system, so the postal slot never
 *   matches; a "street, suburb, city" chain ends at the routing city.
 * Region/state: NONE routinely written (the 4 divisions are seldom used in mail).
 * PO box: "PO Box", and the Suva head office "G.P.O. Box".
 *
 * A settlement/suburb is frequently written between the street and the city
 * ("14 Viria Street, Vatuwaqa, Suva"). Fiji, like ZA, has a single city slot;
 * cityAllowsCommas keeps the locality chain together and postNormalize keeps the
 * LAST locality (the routing city), dropping the earlier suburb(s).
 *
 * Sources: Post Fiji; UPU addressing note (Fiji); Smarty / PostGrid Fiji guides.
 * See research-fj.md.
 */

const TYPES = [
  "Street", "Road", "Avenue", "Drive", "Place", "Lane", "Terrace", "Parade",
  "Crescent", "Close", "Court", "Circle", "Highway", "Boulevard", "Way",
  "Rise", "Loop", "Esplanade", "Quay",
  // abbreviations
  "St", "Rd", "Ave", "Av", "Dr", "Pde", "Tce", "Cres", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  road: "RD", rd: "RD",
  avenue: "AVE", ave: "AVE", av: "AVE",
  drive: "DR", dr: "DR",
  place: "PL",
  lane: "LN",
  terrace: "TER", tce: "TER",
  parade: "PDE", pde: "PDE",
  crescent: "CRES", cres: "CRES",
  close: "CL",
  court: "CT",
  circle: "CIR",
  highway: "HWY", hwy: "HWY",
  boulevard: "BLVD",
  way: "WAY",
  rise: "RISE",
  loop: "LOOP",
  esplanade: "ESP",
  quay: "QY",
};

export const fjConfig: EuCountryConfig = {
  code: "fj",
  country: "FJ",
  countryNames: ["Fiji", "FJI", "FJ"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English types echoed as written (Street, St, Rd).
  normalizeTypeCase: false,

  // Fiji has no postcodes: a never-matching sentinel keeps the postal slot inert
  // so the postcode-absent place branch (city / city-chain) is always used.
  postalPattern: "(?<postal_code>(?!x)x)",

  // Number or "12-14" range, with an optional glued letter suffix ("14A").
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "suburb, city" locality chain together; postNormalize keeps the
  // routing city (last locality) and drops the earlier suburb(s).
  cityAllowsCommas: true,
  // Fiji has no addressable region; forbid anything landing in the state slot so
  // an ordinary "suburb, city" pair is never mis-split with the city as state.
  countyPattern: "(?!x)x",

  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  // Unit/Flat/Apartment leads the address ("Ap. 5 14 Papaya Court").
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Ap\\.?|Flat|Unit|Suite|Floor|Room|Lot)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment", apt: "Apt", ap: "Apt",
    flat: "Flat",
    unit: "Unit",
    suite: "Suite",
    floor: "Floor",
    room: "Room",
    lot: "Lot",
  },

  poBoxNames: [
    "G.P.O. Box", "GPO Box", "P.O. Box", "PO Box", "Post Office Box",
    "Private Mail Bag", "P.M.B.", "PMB",
  ],
  poBoxDisplayMap: {
    "g.p.o. box": "GPO Box", "gpo box": "GPO Box",
    "p.o. box": "PO Box", "po box": "PO Box", "post office box": "PO Box",
    "private mail bag": "Private Mail Bag", "p.m.b.": "PMB", pmb: "PMB",
  },
};

export default fjConfig;
