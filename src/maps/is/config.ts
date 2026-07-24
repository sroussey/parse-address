import type { EuCountryConfig } from "../_eu/types";

/**
 * Icelandic (IS) address configuration.
 *
 * Order: street name FIRST, house number AFTER ("Laugavegur 22").
 * Type: fused into the name as a bound suffix ("-gata", "-vegur", "-braut",
 *       "-stígur", "-stræti", ...). Icelanders never write the generic as a
 *       separate word, so a spaced type is NOT split.
 * Postcode: exactly 3 digits, BEFORE the city ("101 Reykjavík"). No state.
 */

// Productive fused type suffixes, each mapped to its canonical display form.
// Sorted longest-first at use so "stræti" wins over "stígur"/"gata". The
// remainder-length guard (minFusedStem, default 3) protects short whole-word
// names ("Ártún" -> stem "Ár" is 2, left whole).
const FUSED: Array<[string, string]> = [
  ["stræti", "stræti"],
  ["stígur", "stígur"],
  ["vegur", "vegur"],
  ["braut", "braut"],
  ["lundur", "lundur"],
  ["garður", "garður"],
  ["vogur", "vogur"],
  ["múli", "múli"],
  ["mýri", "mýri"],
  ["teigur", "teigur"],
  ["bakki", "bakki"],
  ["holt", "holt"],
  ["hlíð", "hlíð"],
  ["gata", "gata"],
  ["sund", "sund"],
  ["tún", "tún"],
  ["nes", "nes"],
];

const TYPE_SHORT: Record<string, string> = {
  gata: "GATA",
  vegur: "VEG",
  braut: "BRT",
  stígur: "STIG",
  stræti: "STR",
  lundur: "LND",
  garður: "GARD",
  vogur: "VOG",
  múli: "MULI",
  mýri: "MYRI",
  teigur: "TEIG",
  bakki: "BAK",
  holt: "HOLT",
  hlíð: "HLID",
  sund: "SUND",
  tún: "TUN",
  nes: "NES",
};

export const isConfig: EuCountryConfig = {
  code: "is",
  country: "IS",
  countryNames: ["Ísland", "Iceland", "ISL", "IS"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Icelandic street names are single glued words; never split a spaced last
  // word as a type ("Fákafen", "Ártúnsholt" stay intact bar their glued tail).
  splitSpacedType: false,

  postalPattern: "(?<postal_code>\\d{3})",
  // number, then an optional glued/spaced single-letter suffix ("22a") that is
  // not itself the start of a word, or a range tail ("22-24").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-zÁÐÉÍÓÚÝÞÆÖáðéíóúýþæö](?![A-Za-z0-9])|\\s*-\\s*\\d+)?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Apartment "íbúð 302" / floor "2. hæð" (ordinal-first) / "3. h.".
  secUnitPattern:
    "(?<sec_unit_num_1>\\d+)\\.\\s*(?<sec_unit_type_1>hæð|h)(?=[\\s,]|$)" +
    "|(?<sec_unit_type_2>íbúð|íb\\.?|hæð)\\.?\\s*(?<sec_unit_num_2>[\\w-]+)?",
  secUnitDisplayMap: {
    íbúð: "íbúð",
    íb: "íbúð",
    hæð: "hæð",
    h: "hæð",
  },

  poBoxNames: ["Pósthólf", "Pbox", "P.O. Box", "PO Box"],
  poBoxDisplayMap: { pósthólf: "Pósthólf", pox: "Pósthólf" },
};

export default isConfig;
