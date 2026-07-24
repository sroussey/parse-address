import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Iran (IR) address configuration — Latin transliteration for SEC / international
 * filings. Native Perso-Arabic (RTL) script is OUT OF SCOPE.
 *
 * Dominant transliterated form (small-endian):
 *   "No. 12, Vali-e Asr Street, Tehran"
 *   "Plaque 8, Ferdowsi Avenue, Isfahan 8173954411"
 *   -> number + street(+English suffix) + city (+ optional 10-digit postcode).
 *
 * Order: HOUSE NUMBER first, written "No. N", "Plaque N" or "Pelak N". "No." is a
 *        non-addressable number marker (stripped by the shared token model);
 *        "Plaque"/"Pelak" are consumed via a `(?<drop>...)` group so they are not
 *        scored as lost street tokens.
 * Type:  trailing English suffix — Street, Avenue, Boulevard, Square, Highway,
 *        Expressway, Lane, Alley. Persian generics that LEAD the name
 *        ("Khiaban <X>" = <X> Street, "Bozorgraah <X>" = <X> Highway,
 *        "Kucheh <X>" = <X> Alley) carry no suffix and parse type-less, whole,
 *        into `street` (lossless — nothing is dropped).
 * Postcode: a distinctive 10-DIGIT code, OPTIONAL, written LAST after the city
 *        ("Tehran 1968834111"). Modelled after-city so a code-less line still
 *        parses.
 * city  = Tehran / Isfahan / Mashhad / Shiraz / ...  (the routing city).
 * state = the province (Ostan), RESTRICTED to explicitly province-marked
 *        spellings ("Tehran Province", "Ostan-e Isfahan") so it stays DISJOINT
 *        from the many province names that equal their principal city (Tehran,
 *        Isfahan, Kerman, Qom, Yazd, Ardabil, Hamadan, ...) and never steals the
 *        city slot.
 *
 * KNOWN GAPS (see research-ir.md): deep alley→main-street chains
 *   ("No. 5, Kucheh Yas, Vali-e Asr Street, Tehran") exceed the single street
 *   slot and are __skip'd; a bare alley as the sole street ("Kucheh Yas, Tehran")
 *   parses type-less. Native-script samples are __skip'd (out of scope).
 */

const TYPES = [
  "Boulevard", "Expressway", "Highway", "Avenue", "Street", "Square",
  "Alley", "Lane", "Blvd", "Ave", "Sq", "St",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  square: "SQ", sq: "SQ",
  highway: "HWY",
  expressway: "EXPY",
  lane: "LN",
  alley: "ALY",
};

// Provinces (Ostans) — ONLY the explicitly province-marked spellings, because
// most bare province names equal their principal city and would otherwise steal
// the city slot. Both "<Name> Province" and the romanized "Ostan-e <Name>".
const PROVINCE_NAMES = [
  "Tehran Province", "Isfahan Province", "Esfahan Province", "Fars Province",
  "Razavi Khorasan Province", "Khorasan Razavi Province",
  "East Azerbaijan Province", "West Azerbaijan Province",
  "Mazandaran Province", "Gilan Province", "Kerman Province",
  "Khuzestan Province", "Alborz Province", "Qom Province", "Yazd Province",
  "Markazi Province", "Hormozgan Province", "Kermanshah Province",
  "Golestan Province", "Hamadan Province", "Kurdistan Province",
  "Lorestan Province", "Ardabil Province", "Bushehr Province",
  "Zanjan Province", "Qazvin Province", "Semnan Province", "Ilam Province",
  "North Khorasan Province", "South Khorasan Province",
  "Sistan and Baluchestan Province",
  "Chaharmahal and Bakhtiari Province",
  "Kohgiluyeh and Boyer-Ahmad Province",
  "Ostan-e Tehran", "Ostan-e Isfahan", "Ostan-e Fars",
];
const PROVINCE_ALT = PROVINCE_NAMES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const irConfig: EuCountryConfig = {
  code: "ir",
  country: "IR",
  countryNames: ["Islamic Republic of Iran", "Iran", "IRN", "IR"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English suffixes echoed as written (Street, Avenue, Blvd).
  normalizeTypeCase: false,

  // Distinctive 10-digit postcode, OPTIONAL (the after-city grammar makes the
  // whole place tail optional and offers a postcode-absent branch).
  postalPattern: "(?<postal_code>\\d{10})",

  // House number: bare digits, optionally introduced by "No." / "Plaque" /
  // "Pelak". "No." is a generic number marker (auto-stripped by the token
  // model); "Plaque"/"Pelak" are captured as a drop group (no digits) so they
  // are consumed but not scored as lost.
  houseNumberPattern:
    "(?:No\\.?\\s*|(?<drop>Plaque|Pelak)\\.?\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Province only in the state slot (restricted list); ordinary cities never
  // match it, so a "..., City, Province" tail splits correctly.
  countyPattern: `(?:${PROVINCE_ALT})`,
  regionPattern: `(?<state>${PROVINCE_ALT})`,

  // Optional leading unit ("Unit 3", "Apt. 5", "Floor 2") before the number.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Unit|Suite|Floor|Room|Block|Shop)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-]*)",
  secUnitDisplayMap: {
    apartment: "Apartment",
    apt: "Apt",
    unit: "Unit",
    suite: "Suite",
    floor: "Floor",
    room: "Room",
    block: "Block",
    shop: "Shop",
  },

  // National Post box form ("PO Box 1837, Tehran").
  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default irConfig;
