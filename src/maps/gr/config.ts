import type { EuCountryConfig } from "../_eu/types";

/**
 * Greek (GR) address configuration. Most street names have no type word (just
 * the name + number, e.g. "Ερμού 15"). A leading "Λεωφόρος"/"Λεωφ."/"Λ."
 * (avenue) or "Πλατεία"/"Πλ." (square) may appear. Number after the street;
 * "NNN NN" postcode before the city. Names are in Greek script.
 */

// Abbreviations are listed WITH their dot so they cannot match the first letter
// of a Greek name that merely starts with "Λ" ("Λαδάδικα").
const TYPES = [
  "Λεωφόρος", "Πλατεία", "Πλατεια", "Οδός", "Plateia", "Leof.",
  "Λεωφ.", "Πλ.", "Οδ.", "Λ.",
];

export const grConfig: EuCountryConfig = {
  code: "gr",
  country: "GR",
  countryNames: ["Ελλάδα", "Ελλάς", "Ελλας", "Greece", "Hellas", "GRC", "GR"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names ("25ης Αυγούστου").
  allowDigitsInName: true,

  postalPattern: "(?<postal_code>\\d{3}\\s?\\d{2})",
  // optional "αρ." (αριθμός) marker, number or range ("15-17"), optional single
  // Greek/Latin letter suffix ("15Α").
  houseNumberPattern:
    "(?:αρ\\.?\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[Α-Ωα-ωΆ-ώA-Za-z](?![Α-Ωα-ωΆ-ώA-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Prefecture (νομός) in all-caps Greek after the city -> state.
  regionPattern: "(?<state>[Α-ΩΆΈΉΊΌΎΏΪΫ]{3,})",

  // Floor "3ος όροφος" / "όρ. 2" and apartment "διαμέρισμα 7" / "διαμ. 5". The
  // unit word is kept verbatim (no display map).
  secUnitPattern:
    "(?<sec_unit_num_1>\\d+ος)\\s*(?<sec_unit_type_1>όροφος|όρ\\.?)" +
    "|(?<sec_unit_type_2>όροφος|όρ\\.?|διαμέρισμα|διαμ\\.?)\\.?\\s*(?<sec_unit_num_2>\\d+)",

  // "Τ.Θ." / "ΤΘ" (ταχυδρομική θυρίδα = PO box), kept verbatim.
  poBoxNames: ["Τ.Θ.", "ΤΘ"],
};

export default grConfig;
