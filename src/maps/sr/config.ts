import type { EuCountryConfig } from "../_eu/types";

/**
 * Suriname (SR) address configuration.
 *
 * Suriname is a former Dutch colony and Dutch is the official language, so its
 * street grammar follows the Dutch (NL) model, NOT the English Caribbean one:
 *
 * Order: street name FIRST, house number AFTER ("Domineestraat 26",
 *        "Waterkant 15", "Kwattaweg 123").
 * Type: fused into the name as a glued lowercase suffix ("-straat", "-weg",
 *        "-laan", "-dreef", "-kade"); kept verbatim. Many names have no
 *        separable type ("Waterkant", "Rust en Vrede", "Combé").
 * Toevoeging: "12a", "12-13".
 *
 * Postcode: Suriname has NO postcode system in daily use, so `postalPattern` is
 * a never-match sentinel. The layout is still "before-city" (Dutch skeleton):
 * the place tail is just the city and, optionally, the district.
 *
 * State: the DISTRICT (10 of them: Paramaribo, Wanica, Nickerie, ...) is written
 * after the city and maps to `state`; optional.
 *
 * City: Paramaribo (capital), Lelydorp, Nieuw Nickerie, Moengo, Albina, ...
 *
 * PO Box: "Postbus 1234" -- the Dutch box word.
 */

const FUSED: Array<[string, string]> = [
  ["straat", "straat"],
  ["gracht", "gracht"],
  ["singel", "singel"],
  ["plein", "plein"],
  ["dreef", "dreef"],
  ["steeg", "steeg"],
  ["kade", "kade"],
  ["laan", "laan"],
  ["hof", "hof"],
  ["weg", "weg"],
  ["pad", "pad"],
];

const TYPE_SHORT: Record<string, string> = {
  straat: "STR", gracht: "GR", singel: "SNG", plein: "PLN", dreef: "DRF",
  steeg: "STG", kade: "KD", laan: "LN", hof: "HF", weg: "WG", pad: "PD",
};

// The 10 districts, longest-first, spaces -> \s+.
const DISTRICTS = [
  "Paramaribo", "Wanica", "Nickerie", "Commewijne", "Marowijne", "Para",
  "Saramacca", "Coronie", "Brokopondo", "Sipaliwini",
];
const DISTRICT_ALT = DISTRICTS.map((s) => s.replace(/ /g, "\\s+"))
  .sort((a, b) => b.length - a.length)
  .join("|");

const REGION_MAP: Record<string, string> = {};
for (const d of DISTRICTS) REGION_MAP[d.toLowerCase()] = d;

export const srConfig: EuCountryConfig = {
  code: "sr",
  country: "SR",
  countryNames: ["Suriname", "Surinam", "SUR", "SR"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  // Dutch fused types are lowercase and kept verbatim ("straat", "weg").
  normalizeTypeCase: false,

  // No postcode system: a never-match sentinel (place tail is city + district).
  postalPattern: "(?<postal_code>(?!x)x)",
  // number, then an optional "-<toevoeging>" (dash dropped) or a glued letter
  // block ("12a", "12 A").
  houseNumberPattern:
    "(?<number>\\d+)(?:-\\s?(?<civic_number_suffix>\\w+)|\\s?(?<civic_number_suffix_2>[A-Za-z]{1,2}(?![A-Za-z])))?",

  fusedTypeSuffixes: FUSED,
  splitSpacedType: false,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Optional district after the city -> state.
  regionPattern: `(?<state>${DISTRICT_ALT})`,
  regionMap: REGION_MAP,

  poBoxNames: ["Postbus", "PO Box", "P.O. Box"],
  poBoxDisplayMap: {
    postbus: "Postbus", "po box": "PO Box", "p.o. box": "PO Box",
  },
};

export default srConfig;
