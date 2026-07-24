import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Faroe Islands (FO) address configuration.
 *
 * The Faroes are a Danish autonomous territory and use the Danish postal
 * grammar:
 *   - Street name FIRST, house number AFTER ("Niels Finsens gøta 17",
 *     "Óðinshædd 2"). The Faroese generic ("-gøta" street, "-vegur" road,
 *     "-brekka" slope) is fused into a single word ("Reynagøta" -> "Reyna" +
 *     "gøta") or written as a separate lowercase word ("Niels Finsens gøta").
 *   - Postcode is exactly 3 digits with an "FO-" prefix ("FO-100"), written
 *     BEFORE the city ("FO-100 Tórshavn"). The "FO-" literal is captured into a
 *     `drop` group so it is consumed (and excluded from token preservation). A
 *     bare "100 Tórshavn" (domestic form) also parses.
 *   - No state/region.
 *
 * Sources: UPU S42 "Faroe Islands (Denmark)" template
 * (https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/froEn.pdf
 *  -> "Óðinshædd 2 / FO-100 Tórshavn"); Wikipedia "Postal codes in the Faroe
 * Islands" (FO + 3 digits); Posta / www.post.fo; Smarty
 * (https://www.smarty.com/global-address-formatting/faroe-islands-address-format-examples);
 * geohints street-suffix reference (gøta, vegur, brekka).
 */

// Productive Faroese fused generics, each mapped to its lowercase display form.
// Conservative on purpose: only the clearly productive generics are peeled, so a
// lexicalised name that merely ends in a similar syllable stays whole.
const FUSED: Array<[string, string]> = [
  ["brekka", "brekka"], // slope
  ["vegur", "vegur"],   // road
  ["gøta", "gøta"],     // street
];

const TYPE_SHORT: Record<string, string> = {
  "gøta": "GOTA",
  vegur: "VEG",
  brekka: "BREK",
};

const TYPE_DISPLAY: Record<string, string> = {};
for (const pair of FUSED) TYPE_DISPLAY[pair[0]] = pair[1];

export const foConfig: EuCountryConfig = {
  code: "fo",
  country: "FO",
  countryNames: ["Føroyar", "Faroe Islands", "Faeroe Islands", "FRO", "FO"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Spaced generics split ("Niels Finsens gøta" -> "Niels Finsens" + "gøta"),
  // only when the last word is exactly a generic. Glued stems can be short
  // ("Bøgøta" -> "Bø").
  splitSpacedType: true,
  spacedTypeExact: true,
  minFusedStem: 2,

  // 3 digits with an optional "FO-" prefix (dropped), before the city.
  postalPattern: "(?:(?<drop>FO-))?(?<postal_code>\\d{3})",
  // number, then a glued letter suffix ("12A") or a range tail ("-14").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z])|\\s*-\\s*\\d+)?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // Floor + side, Danish-style: "3. tv", "st. th", "1. sal".
  secUnitPattern:
    "(?<sec_unit_num_2>(?:\\d+\\.|st\\.)(?:\\s+(?:tv|th|mf|sal))?)",
  defaultSecUnitType: "sal",

  poBoxNames: ["Postboks", "Postrúm", "PO Box", "P.O. Box"],
  poBoxDisplayMap: { postboks: "Postboks", "postrúm": "Postboks", "po box": "PO Box", "p.o. box": "PO Box" },
};

export default foConfig;
