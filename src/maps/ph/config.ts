import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Philippines (PH) address configuration.
 *
 * Order: house/building NUMBER first, then the street name + trailing English
 *        type suffix ("9 Central Avenue", "197 Wilson Street", "24 11th Street").
 * Type: trailing English suffix (Street, Avenue, Road, Boulevard, Drive, Lane,
 *        Highway, Extension, ...). Numbered streets ("11th Street") keep the
 *        ordinal in the name (house number captured first). Type-less named
 *        roads ("EDSA", "Katipunan") parse with an empty type.
 * Postcode: 4-digit numeric, written LAST after the city and region (after-city):
 *        "..., Quezon City, Metro Manila 1101". Leading zeros significant.
 * Region / Province: the region ("Metro Manila") or province ("Laguna", "Cebu")
 *        written just before the postcode -> state.
 * Barangay: the barangay / subdivision sits between the street and the city.
 *        Since the postcode is LAST and the number FIRST, the IN/ZA locality-drop
 *        trick applies: keep the comma chain in the city capture, then drop the
 *        leading barangay/subdivision and keep the routing city/municipality.
 *
 * KNOWN GAPS (see research-ph.md): the alternative "City ZIP Region" order (ZIP
 * written BEFORE the region, per Smarty/PHLPost) is not modelled — this config
 * targets the "City, Region ZIP" order (ZIP last); a Spanish/Filipino-script
 * form; and a leading unit/floor stacked with a building are documented modes.
 */

// Trailing (suffix) English road types. Longest-first handled by the ruleset.
const TYPES = [
  "Boulevard", "Extension", "Highway", "Terrace", "Crescent", "Avenue",
  "Street", "Circle", "Drive", "Court", "Place", "Lane", "Loop", "Road",
  "Row", "Park", "Blvd", "Hwy", "Ext", "Ave", "Cor", "Rd", "St", "Dr", "Ln",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  road: "RD", rd: "RD",
  boulevard: "BLVD", blvd: "BLVD",
  drive: "DR", dr: "DR",
  lane: "LN", ln: "LN",
  highway: "HWY", hwy: "HWY",
  extension: "EXT", ext: "EXT",
  circle: "CIR",
  court: "CT",
  place: "PL",
  terrace: "TER",
  crescent: "CRES",
  loop: "LOOP",
  row: "ROW",
  park: "PARK",
  corner: "COR", cor: "COR",
};

// Regions/provinces used as the state slot (before the postcode). Metro Manila +
// the major provinces; multi-word longest-first, spaces escaped to \s+.
const REGIONS = [
  "National Capital Region", "Metro Manila", "Davao del Sur", "Davao del Norte",
  "Negros Occidental", "Negros Oriental", "Camarines Sur", "Camarines Norte",
  "Misamis Oriental", "Misamis Occidental", "Zamboanga del Sur",
  "Nueva Ecija", "Nueva Vizcaya", "Ilocos Norte", "Ilocos Sur", "Lanao del Norte",
  "Lanao del Sur", "Agusan del Norte", "Agusan del Sur", "Surigao del Norte",
  "Surigao del Sur", "Cotabato", "South Cotabato", "Occidental Mindoro",
  "Oriental Mindoro", "Metro Cebu", "Batangas", "Pampanga", "Bulacan", "Cavite",
  "Laguna", "Rizal", "Quezon", "Pangasinan", "Cebu", "Bohol", "Iloilo", "Aklan",
  "Antique", "Capiz", "Leyte", "Samar", "Albay", "Sorsogon", "Benguet",
  "Isabela", "Cagayan", "Tarlac", "Zambales", "Bataan", "Palawan", "Bukidnon",
  "Marinduque", "Romblon", "Masbate", "Catanduanes", "Abra", "Kalinga",
  "Apayao", "Ifugao", "Mountain Province", "Guimaras", "Sarangani", "NCR",
];

const REGION_ALT = REGIONS.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const phConfig: EuCountryConfig = {
  code: "ph",
  country: "PH",
  countryNames: ["Philippines", "PHL", "PH", "Pilipinas"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 4-digit postcode LAST (leading zeros kept).
  postalPattern: "(?<postal_code>\\d{4})",

  // number (or "10-24" range kept in number), optional glued letter suffix.
  houseNumberPattern:
    "(?:No\\.?\\s*|\\#\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the barangay/subdivision + city chain together; routing city is the LAST
  // locality before the region/postcode (postNormalize drops the earlier ones).
  // A real region/province (before the postcode) -> county slot -> state.
  cityAllowsCommas: true,
  countyPattern: `(?:${REGION_ALT})`,

  // Unit / Room / Floor / Suite lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Room|Rm\\.?|Floor|Flr\\.?|Suite|Ste\\.?|Apartment|Apt\\.?)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit",
    room: "Room", rm: "Room",
    floor: "Floor", flr: "Floor",
    suite: "Suite", ste: "Suite",
    apartment: "Apartment", apt: "Apt",
  },

  // A leading building whose name ends in a building keyword ("Ayala Tower One,
  // Ayala Avenue, ...", "SM Megamall, ...").
  buildingKeywords: [
    "Building", "Bldg", "Tower", "Towers", "Plaza", "Center", "Centre",
    "Mall", "Megamall", "Condominium", "Complex", "Arcade", "House",
  ],

  // PHLPost box forms.
  poBoxNames: ["PO Box", "P.O. Box", "Post Office Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "post office box": "PO Box",
  },

  // Drop the leading barangay/subdivision chain, keeping the routing city.
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),
};

export default phConfig;
