import type { EuCountryConfig } from "../_eu/types";

/**
 * Tanzania (TZ) address configuration.
 *
 * Order: house/building NUMBER first, then the street name + trailing English
 *        type ("12 Samora Avenue") — GB/KE-style number-first, suffix type.
 * Type: trailing English suffix (Street, Road, Avenue, Close, Drive, ...). Many
 *        Tanzanian roads are type-less (bare "Uhuru", "Bibi Titi Mohamed"); the
 *        type must be optional.
 * Locality: an AREA / ward (Kariakoo, Upanga, Masaki, Oysterbay, Kijitonyama,
 *        Mikocheni, ...) commonly sits between the street and the routing city.
 *        As in KE/ZA the comma chain is kept together and the leading area(s) are
 *        dropped in postNormalize, keeping the last locality (the city).
 * Postcode: a 5-digit postcode was introduced c.2022 (TPC — Tanzania Posts
 *        Corporation, e.g. Dar es Salaam CBD "11101") but has very low adoption;
 *        the vast majority of addresses carry NO postcode. Optional, after-city.
 * Region (-> state): Tanzania's regions (Kilimanjaro, Mwanza, Kagera, ...) are
 *        rarely written on mail. Where a region IS given it is captured to
 *        `state`. Because most region names are IDENTICAL to their capital city
 *        (Arusha, Mwanza, Dodoma, Mbeya, Tanga, Morogoro, Dar es Salaam), only
 *        the region names that do NOT collide with a city name are recognised in
 *        the county slot, so a bare "Area, City" pair is never mis-split with the
 *        city taken as the region. (A region written as a bare city-name duplicate
 *        is a documented failure mode; see research-tz.md.)
 * PO Box: the DOMINANT postal form. English "P.O. Box 9084, Dar es Salaam" and
 *        the Swahili "S.L.P. 9084, Dar es Salaam" (Sanduku la Posta). The box
 *        replaces the thoroughfare.
 *
 * Sources: Tanzania Posts Corporation (TPC / Posta); UPU S42 TZ template; Smarty
 * / PostGrid TZ address guides; Wikipedia "Postal codes in Tanzania". See
 * research-tz.md.
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

// Region names that are NOT also a major city/town name (so recognising them in
// the county slot cannot eat the routing city). The many regions whose name
// duplicates their capital (Arusha, Mwanza, Dodoma, Mbeya, Tanga, Morogoro,
// Dar es Salaam, Iringa, Mtwara, Lindi, Songwe, Tabora, Kigoma, Musoma/Mara) are
// intentionally left out — a bare duplicate is a documented failure mode.
const REGIONS = [
  "Kilimanjaro", "Kagera", "Pwani", "Manyara", "Ruvuma", "Rukwa", "Katavi",
  "Geita", "Simiyu", "Njombe", "Shinyanga", "Singida", "Coast",
  "Pemba North", "Pemba South", "Kaskazini Unguja", "Kusini Unguja",
  "Mjini Magharibi",
];

export const tzConfig: EuCountryConfig = {
  code: "tz",
  country: "TZ",
  countryNames: ["Tanzania", "United Republic of Tanzania", "TZA", "TZ"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit TPC postcode (rare), after the city; optional.
  postalPattern: "(?<postal_code>\\d{5})",

  // number FIRST, optional "Plot"/"No."/"#" lead-in, optional range/subdivision
  // ("12/3"), optional glued letter suffix ("12A").
  houseNumberPattern:
    "(?:Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the area+city chain together; drop leading area(s) in postNormalize.
  cityAllowsCommas: true,
  // Only a non-colliding region name may land in the state slot.
  countyPattern: `(?:${REGIONS.map((r) => r.replace(/ /g, "\\s+")).join("|")})`,

  // Flat / Apartment / House / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|House|Suite|Block|Floor|Room|Shop|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", apartment: "Apartment", apt: "Apt", house: "House",
    suite: "Suite", block: "Block", floor: "Floor", room: "Room",
    shop: "Shop", unit: "Unit",
  },

  // A leading building name ("PPF Tower, Ohio Street, Dar es Salaam").
  buildingKeywords: [
    "Tower", "Towers", "House", "Centre", "Center", "Plaza", "Building",
    "Mall", "Complex", "Chambers", "Arcade",
  ],

  // PO Box is dominant: English "P.O. Box" and Swahili "S.L.P." (Sanduku la Posta).
  poBoxNames: ["P.O. Box", "PO Box", "P. O. Box", "P O Box", "S.L.P.", "SLP", "Post Box", "Private Bag"],
  poBoxDisplayMap: {
    "p.o. box": "PO Box", "po box": "PO Box", "p. o. box": "PO Box",
    "p o box": "PO Box", "s.l.p.": "PO Box", slp: "PO Box",
    "post box": "PO Box", "private bag": "Private Bag",
  },

  // Collapse the "area, city" chain to the routing city + dropped area(s). The
  // "Plot" number lead-in is consumed but not emitted, so it is exempted from the
  // token-preservation guard here (as PK does for "House"/"Plot").
  postNormalize: (parsed: Record<string, any>) => {
    const dropped: string[] = ["Plot"];
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s: string) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        for (const p of parts.slice(0, -1)) dropped.push(p);
      }
    }
    parsed.__dropped = dropped;
  },
};

export default tzConfig;
