import type { EuCountryConfig } from "../_eu/types";

/**
 * Latvian (LV) address configuration.
 *
 * Order: street name FIRST, then house number ("Brīvības iela 1").
 * Type: SEPARATE trailing suffix noun -- "iela" (street) by far the most common
 *       ("Brīvības iela", "Elizabetes iela", "Krišjāņa Barona iela"), also
 *       bulvāris, prospekts, gatve, laukums, šoseja, aleja, līnija, krastmala.
 *       So `suffix` placement; the type is optional so a rare bare name still
 *       parses.
 * Postcode: 4 digits with a MANDATORY "LV-" prefix, written LAST -- AFTER the
 *       city ("Rīga, LV-1010"). Little-endian: street, city, then postcode.
 * A trailing "-NN" on the house number is the apartment (dzīvoklis): "Brīvības
 *       iela 15-5" = house 15, apt 5.
 *
 * Sources: Google libaddressinput LV (fmt "%O%n%N%n%A%n%C, %Z", zip "LV-\\d{4}");
 * UPU S42 Latvia profile; Smarty/PostGrid Latvia format guides;
 * en.wikipedia.org/wiki/Postal_codes_in_Latvia.
 */

const TYPES = [
  "bulvāris", "prospekts", "krastmala", "laukums", "šoseja", "līnija",
  "dambis", "pārvads", "gatve", "aleja", "iela", "ceļš", "tilts",
  // abbreviations
  "bulv.", "prosp.", "lauk.",
];

export const lvConfig: EuCountryConfig = {
  code: "lv",
  country: "LV",
  countryNames: ["Latvija", "Latvia", "LVA", "LV"],
  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // "LV-1010" (also seen as "LV 1010" / "LV1010"); normalised to "LV-NNNN".
  postalPattern: "(?<postal_code>LV[-\\s]?\\d{4})",
  postalFormat: (raw: string) => `LV-${String(raw).replace(/[^\d]/g, "")}`,

  // number, optional single-letter civic suffix, optional "-NN" apartment.
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?(?:\\s*-\\s*(?<sec_unit_num>\\d+[A-Za-z]?))?",

  types: TYPES,
  typeDisplayMap: {},

  defaultSecUnitType: "dz.",
  secUnitDisplayMap: { "dz.": "dz.", dz: "dz." },

  // PO box: "a/k" (abonenta kastīte); "p/k" also seen.
  poBoxNames: ["a/k", "a.k.", "p/k", "Abonenta kastīte"],
  poBoxDisplayMap: {
    "a/k": "a/k",
    "a.k.": "a/k",
    "p/k": "a/k",
    "abonenta kastīte": "a/k",
  },
};

export default lvConfig;
