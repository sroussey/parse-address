import type { EuCountryConfig } from "../_eu/types";

/**
 * Danish (DK) address configuration. The street type is fused as a lowercase
 * suffix, often in its definite form ("Nørregade" -> "Nørre" + "gade",
 * "Strandvejen" -> "Strand" + "vejen"). Number after the street; 4-digit
 * postcode before the city. A trailing "3. tv" / "st." (floor + side) is the
 * secondary unit.
 */

const FUSED: Array<[string, string]> = [
  ["boulevarden", "boulevarden"],
  ["boulevard", "boulevard"],
  ["pladsen", "pladsen"],
  ["stræde", "stræde"],
  ["torvet", "torvet"],
  ["vænget", "vænget"],
  ["parken", "parken"],
  ["bakken", "bakken"],
  ["holmen", "holmen"],
  ["vejen", "vejen"],
  ["haven", "haven"],
  ["gade", "gade"],
  ["allé", "allé"],
  ["alle", "allé"],
  ["torv", "torv"],
  ["plads", "plads"],
  ["vænge", "vænge"],
  ["vej", "vej"],
];

const TYPE_SHORT: Record<string, string> = {
  gade: "GD", vej: "VEJ", vejen: "VEJ", stræde: "STR", allé: "ALL",
  torv: "TORV", torvet: "TORV", plads: "PL", pladsen: "PL", boulevard: "BLV",
  boulevarden: "BLV", vænget: "VG", parken: "PK", haven: "HV", bakken: "BK",
};

// The DK corpus lower-cases the type, whether fused or written as a separate
// word ("Falkoner Allé" -> type "allé"). Map each variant to its lowercase form.
const TYPE_DISPLAY: Record<string, string> = {};
for (const [spelling, display] of FUSED) TYPE_DISPLAY[spelling] = display;

export const dkConfig: EuCountryConfig = {
  code: "dk",
  country: "DK",
  countryNames: ["Danmark", "Denmark", "DNK", "DK"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  // Spaced types split ("Falkoner Allé" -> "Falkoner" + "allé"), only when the
  // last word is exactly a type; glued stems can be a single letter ("Å").
  splitSpacedType: true,
  spacedTypeExact: true,
  minFusedStem: 1,

  postalPattern: "(?<postal_code>\\d{4})",
  // number, then a glued letter suffix ("12A") or a range tail ("-14").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z])|\\s*-\\s*\\d+)?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,
  // Famous square lexicalised as a whole name (ends in -torv).
  unsplittableExact: ["Amagertorv"],

  // Floor + side: "3. tv", "st. th", "4. mf", "st.", "1. sal" -> sal.
  secUnitPattern:
    "(?<sec_unit_num_2>(?:\\d+\\.|st\\.)(?:\\s+(?:tv|th|mf|sal))?)",
  defaultSecUnitType: "sal",
};

export default dkConfig;
