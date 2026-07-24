import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Åland Islands (AX) address configuration — Finnish/Swedish (near-clone of FI).
 *
 * Åland is an autonomous, Swedish-speaking region of Finland and uses the
 * Finnish postal system. Street type is fused as a lowercase suffix — chiefly
 * the Swedish "-gatan"/"-vägen" ("Torggatan" -> "Torg" + "gatan") but also the
 * Finnish forms — or written as a separate last word. Number after the street;
 * 5-digit postcode (Åland codes are 22xxx) before the city ("22100 Mariehamn").
 * A trailing "A 5" (stairwell + apartment) or "as. 5" is the secondary unit.
 *
 * Sources: Posti / Åland Post postcode ranges (22xxx); Finnish addressing
 * conventions. See research-ax.md.
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

export const axConfig: EuCountryConfig = {
  code: "ax",
  country: "AX",
  countryNames: ["Åland", "Aland", "Åland Islands", "Åländer", "ALA", "AX"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Optional "AX-"/"FI-"/"FIN-" prefix before the 5-digit postcode.
  postalPattern: "(?:(?:AX|FIN?)-)?(?<postal_code>\\d{5})",
  // number (optionally a range "6-8" or a dual "160/10"), then an optional
  // lowercase letter suffix that is NOT a stairwell letter (a stairwell is
  // upper-case and followed by " <apartment number>").
  houseNumberPattern:
    "(?<number>\\d+(?:[-–/]\\d+)?)(?<civic_number_suffix>\\s?[A-Za-zÅÄÖåäö](?!\\s*\\d)(?![A-Za-zÅÄÖåäö]))?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  spacedTypeExact: true,

  // No real region on Åland.
  countyPattern: "(?!x)x",

  // "as. 5" (apartment) or a bare "A 5" (stairwell + apartment) -> as.
  secUnitPattern:
    "(?<sec_unit_type>as|bst|bostad)\\.?\\s*(?<sec_unit_num>\\d+)" +
    "|(?<sec_unit_num_2>[A-ZÅÄÖ]\\s+\\d+)",
  secUnitDisplayMap: { as: "as.", bst: "as.", bostad: "as." },
  defaultSecUnitType: "as.",
};

export default axConfig;
