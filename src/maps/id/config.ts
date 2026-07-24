import type { EuCountryConfig } from "../_eu/types";

/**
 * Indonesia (ID) address configuration.
 *
 * Order: PREFIX-type road name ("Jalan"/"Jl."), then the NUMBER written AFTER
 *        the name and introduced by "No." ("Jalan Merdeka No. 45"). So this is a
 *        STREET-NUMBER order with a leading (prefix) type.
 * Type: leading "Jalan" (road/street) or its abbreviation "Jl."/"Jln.". Lesser
 *        forms: Gang/Gg (alley), Lorong. Echoed as written.
 * Postcode: 5-digit numeric, written LAST (after the city and province):
 *        "... Kota Bandung, Jawa Barat 40111" (after-city). Leading zeros kept.
 * Province: the "Provinsi" written just before the postcode -> state
 *        (DKI Jakarta, Jawa Barat, Bali, ...). Optional; frequently present.
 * Locality chain (PRIMARY FAILURE MODE, see research-id.md): an RT/RW
 *        neighbourhood, a Kelurahan (subdistrict) and a Kecamatan (district) sit
 *        BETWEEN the street and the city. The IN/ZA locality-drop trick (keep the
 *        comma chain in the city capture, drop the leading localities) requires
 *        `cityAllowsCommas`, which lets the city capture also swallow DIGITS.
 *        Because Indonesia writes the house number LAST ("... No. 45") and the
 *        shared prefix-type street name is NON-GREEDY, a digit-permissive city
 *        then absorbs the trailing "No. 45" into a dropped locality and the
 *        `number` is lost. Preserving the number is more important, so
 *        `cityAllowsCommas` is OFF: single-locality lines ("Jalan Name No. N,
 *        City[, Province] NNNNN") parse fully WITH the number; multi-locality
 *        Kelurahan/Kecamatan lines are marked `__skip`.
 *
 * KNOWN GAPS (see research-id.md): native-script addresses; a plot marker
 * "Kav."/"Blok C-2" that LEADS with a letter; and a province written AFTER the
 * postcode is helper-handled (`id_state`).
 */

// Leading (prefix) road types. Longest-first handled by the ruleset.
const TYPES = ["Jalan", "Lorong", "Gang", "Jln", "Jl", "Gg"];

const TYPE_SHORT: Record<string, string> = {
  jalan: "JL", jln: "JL", jl: "JL",
  gang: "GG", gg: "GG",
  lorong: "LRG",
};

// 34-38 provinces -> ISO 3166-2:ID-style code. Bangkok-style special capital
// "DKI Jakarta" is a province (and doubles as the city). Multi-word, longest
// first for the alternation; spaces escaped to \s+ in the pattern.
const REGION_MAP: Record<string, string> = {
  "daerah khusus ibukota jakarta": "JK",
  "dki jakarta": "JK",
  "di yogyakarta": "YO",
  "daerah istimewa yogyakarta": "YO",
  "jawa barat": "JB",
  "jawa tengah": "JT",
  "jawa timur": "JI",
  "nusa tenggara barat": "NB",
  "nusa tenggara timur": "NT",
  "kalimantan barat": "KB",
  "kalimantan tengah": "KT",
  "kalimantan selatan": "KS",
  "kalimantan timur": "KI",
  "kalimantan utara": "KU",
  "sumatera barat": "SB",
  "sumatera utara": "SU",
  "sumatera selatan": "SS",
  "sulawesi utara": "SA",
  "sulawesi tengah": "ST",
  "sulawesi selatan": "SN",
  "sulawesi tenggara": "SG",
  "sulawesi barat": "SR",
  "kepulauan riau": "KR",
  "kepulauan bangka belitung": "BB",
  "bangka belitung": "BB",
  "maluku utara": "MU",
  "papua barat": "PB",
  aceh: "AC",
  riau: "RI",
  jambi: "JA",
  bengkulu: "BE",
  lampung: "LA",
  banten: "BT",
  bali: "BA",
  gorontalo: "GO",
  maluku: "MA",
  papua: "PA",
  yogyakarta: "YO",
};

// Full spelled-out province list (multi-word longest-first), for the alternation.
const PROVINCES = [
  "Daerah Khusus Ibukota Jakarta", "Daerah Istimewa Yogyakarta",
  "Kepulauan Bangka Belitung", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur",
  "Kalimantan Utara", "Kalimantan Barat", "Sulawesi Tenggara",
  "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Utara", "Sulawesi Barat",
  "Sumatera Selatan", "Sumatera Utara", "Sumatera Barat", "Kepulauan Riau",
  "DKI Jakarta", "DI Yogyakarta", "Bangka Belitung", "Maluku Utara",
  "Papua Barat", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Yogyakarta",
  "Gorontalo", "Bengkulu", "Lampung", "Banten", "Maluku", "Papua", "Aceh",
  "Riau", "Jambi", "Bali",
];

const PROV_ALT = PROVINCES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const idConfig: EuCountryConfig = {
  code: "id",
  country: "ID",
  countryNames: ["Indonesia", "IDN", "ID"],

  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode LAST; an OPTIONAL province may trail it ("Bandung 40111,
  // Jawa Barat"), captured in a helper group folded to `state` in postNormalize.
  postalPattern:
    `(?<postal_code>\\d{5})(?:[\\s,]+(?<id_state>${PROV_ALT}))?`,

  // "No." lead-in then the number, optional glued letter suffix; a "/n" sub-part
  // ("No. 12/A", "No. 5/7") is kept in the number.
  houseNumberPattern:
    "(?:No\\.?\\s*)?(?<number>\\d+(?:/\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // A real province (written before the postcode) falls into the county slot ->
  // state. cityAllowsCommas is intentionally OFF (see header): it would let the
  // city swallow the trailing "No. N" number.
  countyPattern: `(?:${PROV_ALT})`,
  regionMap: REGION_MAP,

  // Lantai (floor), Unit, Ruang (room), Blok, Kamar; lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Lantai|Lt\\.?|Unit|Ruang|Kamar|Suite|Blok|Floor)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    lantai: "Lantai",
    lt: "Lantai",
    unit: "Unit",
    ruang: "Ruang",
    kamar: "Kamar",
    suite: "Suite",
    blok: "Blok",
    floor: "Floor",
  },

  // Pos Indonesia box forms.
  poBoxNames: ["PO Box", "P.O. Box", "Kotak Pos", "Tromol Pos"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "kotak pos": "Kotak Pos",
    "tromol pos": "Tromol Pos",
  },

  // Fold the helper `id_state` (province written after the postcode) into `state`.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.id_state === "string" && parsed.id_state) {
      const key = parsed.id_state.toLowerCase().replace(/\s+/g, " ").trim();
      if (!parsed.state) parsed.state = REGION_MAP[key] ?? parsed.id_state;
      delete parsed.id_state;
    }
  },
};

export default idConfig;
