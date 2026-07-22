import type { EuCountryConfig } from "../_eu/types";

/**
 * Finnish (FI) address configuration. The street type is fused as a lowercase
 * suffix ("Mannerheimintie" -> "Mannerheimin" + "tie", "Aleksanterinkatu" ->
 * "Aleksanterin" + "katu"), or written as a separate last word ("Aleksis Kiven
 * katu"). Number after the street; 5-digit postcode before the city. A trailing
 * "A 5" (stairwell + apartment) or "as. 5" is the secondary unit.
 */

const FUSED: Array<[string, string]> = [
  ["laituri", "laituri"],
  ["raitti", "raitti"],
  ["väylä", "väylä"],
  ["penger", "penger"],
  ["ranta", "ranta"],
  ["polku", "polku"],
  ["rinne", "rinne"],
  ["gatan", "gatan"],
  ["vägen", "vägen"],
  ["kaari", "kaari"],
  ["silta", "silta"],
  ["kuja", "kuja"],
  ["katu", "katu"],
  ["tori", "tori"],
  ["tie", "tie"],
];

const TYPE_SHORT: Record<string, string> = {
  katu: "KATU", tie: "TIE", kuja: "KUJA", polku: "PLK", tori: "TORI",
  ranta: "RTA", kaari: "KRI", väylä: "VLA", raitti: "RTT", silta: "SLT",
  gatan: "GT", vägen: "VG",
};

export const fiConfig: EuCountryConfig = {
  code: "fi",
  country: "FI",
  countryNames: ["Suomi", "Finland", "FIN", "FI"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Optional "FI-"/"FIN-" prefix before the 5-digit postcode.
  postalPattern: "(?:FIN?-)?(?<postal_code>\\d{5})",
  // number (optionally a range "6-8" or a dual "160/10"), then an optional
  // lowercase letter suffix that is NOT a stairwell letter (a stairwell is
  // upper-case and followed by " <apartment number>").
  houseNumberPattern:
    "(?<number>\\d+(?:[-–/]\\d+)?)(?<civic_number_suffix>\\s?[A-Za-zÅÄÖåäö](?!\\s*\\d)(?![A-Za-zÅÄÖåäö]))?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  spacedTypeExact: true,

  // "as. 5" (apartment) or a bare "A 5" (stairwell + apartment) -> as.
  secUnitPattern:
    "(?<sec_unit_type>as|bst|bostad)\\.?\\s*(?<sec_unit_num>\\d+)" +
    "|(?<sec_unit_num_2>[A-ZÅÄÖ]\\s+\\d+)",
  secUnitDisplayMap: { as: "as.", bst: "as.", bostad: "as." },
  defaultSecUnitType: "as.",
};

export default fiConfig;
