import type { EuCountryConfig } from "../_eu/types";

/**
 * Malaysia (MY) address configuration.
 *
 * Order: house/lot NUMBER first (often introduced by "No"/"No."/"Lot"), then a
 *        PREFIX-type road name ("Jalan Kenari", "Lorong 3", "Persiaran Perdana").
 * Type: leading PREFIX noun — Jalan (road), Lorong (lane), Persiaran (avenue/
 *        boulevard), Lebuh (main road), Lebuhraya (highway), Lingkaran (ring),
 *        Lengkok (crescent), Susur (slip road). Malay road names routinely carry
 *        alphanumeric tags ("Jalan SS2/24", "Jalan PJU 5/1", "Jalan Ampang 3").
 * Postcode: 5-digit, BEFORE the city (before-city): "43000 Kajang".
 * State: after the city (Selangor, Johor, Pulau Pinang, Wilayah Persekutuan ...)
 *        -> state; frequently omitted because the postcode already routes it.
 *
 * KNOWN GAP (see research-my.md): the neighbourhood / township line
 * ("Taman ...", "Kampung ...", "Bandar ...", "Seksyen ...") sits BETWEEN the
 * street and the postcode. Because Malaysia writes the postcode before the city,
 * the shared place grammar has no slot for a locality that precedes the postcode,
 * and the comma before it stops the street-name capture. Taman-line addresses are
 * therefore a documented failure mode; single-locality addresses parse fully.
 */

// Prefix road types, spelled out. Longest-first is handled by the ruleset.
const TYPES = [
  "Lebuhraya", "Persiaran", "Lingkaran", "Lengkok", "Lorong", "Lebuh",
  "Jalan", "Susur", "Jln", "Lrg",
];

const TYPE_SHORT: Record<string, string> = {
  jalan: "JLN", jln: "JLN",
  lorong: "LRG", lrg: "LRG",
  persiaran: "PSN",
  lebuh: "LBH",
  lebuhraya: "LBR",
  lingkaran: "LGK",
  lengkok: "LGK",
  susur: "SSR",
};

// 13 states + 3 federal territories, longest-first for the alternation.
const STATES = [
  "Wilayah Persekutuan Kuala Lumpur", "Wilayah Persekutuan Putrajaya",
  "Wilayah Persekutuan Labuan", "Wilayah Persekutuan",
  "Negeri Sembilan", "Pulau Pinang", "Terengganu", "Selangor", "Sarawak",
  "Kelantan", "Putrajaya", "Melaka", "Malacca", "Pahang", "Penang", "Perlis",
  "Johor", "Kedah", "Perak", "Sabah", "Labuan",
];

const REGION_MAP: Record<string, string> = {
  "wilayah persekutuan kuala lumpur": "KUL",
  "wilayah persekutuan putrajaya": "PJY",
  "wilayah persekutuan labuan": "LBN",
  "wilayah persekutuan": "KUL",
  johor: "JHR",
  kedah: "KDH",
  kelantan: "KTN",
  melaka: "MLK",
  malacca: "MLK",
  "negeri sembilan": "NSN",
  pahang: "PHG",
  perak: "PRK",
  perlis: "PLS",
  "pulau pinang": "PNG",
  penang: "PNG",
  sabah: "SBH",
  sarawak: "SWK",
  selangor: "SGR",
  terengganu: "TRG",
  "kuala lumpur": "KUL",
  labuan: "LBN",
  putrajaya: "PJY",
};

export const myConfig: EuCountryConfig = {
  code: "my",
  country: "MY",
  countryNames: ["Malaysia", "MYS", "MY"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Malay type words echoed as written (Jalan, Lorong, Persiaran).
  normalizeTypeCase: false,

  // 5-digit postcode (leading zeros significant), written before the city.
  postalPattern: "(?<postal_code>\\d{5})",

  // Optional "No"/"No."/"Lot"/"PT" lead-in, then the number (with an optional
  // "-<n>" block/unit part kept in number) and an optional glued letter suffix
  // ("No 12A" -> 12 + A; "No 3-2" -> "3-2").
  houseNumberPattern:
    "(?:No\\.?\\s*|Lot\\s+|PT\\s+)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Optional state after the city -> state (Selangor, Johor, Wilayah ...).
  // Literal spaces are escaped to \s+ because the grammar compiles in
  // free-spacing (x) mode, where a bare space is ignored.
  regionPattern: `(?<state>${STATES.map((s) => s.replace(/ /g, "\\s+")).join("|")})`,
  regionMap: REGION_MAP,

  // Unit / floor lead-in (Malay Tingkat/Aras or English Unit/Apartment).
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Apartment|Apt\\.?|Suite|Tingkat|Aras|Floor)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit",
    apartment: "Apartment",
    apt: "Apt",
    suite: "Suite",
    tingkat: "Tingkat",
    aras: "Aras",
    floor: "Floor",
  },

  // Pos Malaysia box forms: Peti Surat (PO Box), Beg Berkunci (Locked Bag).
  poBoxNames: ["PO Box", "P.O. Box", "Peti Surat", "Beg Berkunci", "Locked Bag"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "peti surat": "Peti Surat",
    "beg berkunci": "Beg Berkunci",
    "locked bag": "Locked Bag",
  },
};

export default myConfig;
