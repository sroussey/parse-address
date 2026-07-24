import type { EuCountryConfig } from "../_eu/types";

/**
 * Belgian (BE) address configuration. Bilingual: French streets lead with a
 * type ("Rue de la Loi 16"), Dutch streets fuse the type as a suffix
 * ("Meirstraat" -> "Meir" + "straat"). Both put the house number AFTER the
 * street; the 4-digit postcode precedes the city. A leading French type is
 * captured by the prefix grammar; an untyped Dutch name is fuse-split.
 */

// French/Walloon leading types (kept verbatim, with or without accent).
const TYPES = [
  "Boulevard", "Chaussée", "Chaussee", "Avenue", "Impasse", "Sentier",
  "Venelle", "Drève", "Dreve", "Square", "Chemin", "Place", "Allée", "Allee",
  "Clos", "Quai", "Rue",
];

// Dutch (+ German East-Cantons) fused suffixes; kept lowercase/verbatim. Famous
// squares written as separate words ("Grote Markt") stay whole (splitSpacedType
// is false), and single whole-word names are protected by the remainder guard.
const FUSED: Array<[string, string]> = [
  ["steenweg", "steenweg"],
  ["straat", "straat"],
  ["strasse", "strasse"],
  ["plein", "plein"],
  ["dreef", "dreef"],
  ["kaai", "kaai"],
  ["laan", "laan"],
  ["baan", "baan"],
  ["dijk", "dijk"],
  ["weg", "weg"],
  ["lei", "lei"],
  ["rui", "rui"],
];
// Note: "markt" is deliberately NOT fused -- Belgian market-square names
// ("Korenmarkt", "Grote Markt") are lexicalised wholes (type null).

export const beConfig: EuCountryConfig = {
  code: "be",
  country: "BE",
  countryNames: ["België", "Belgie", "Belgique", "Belgien", "Belgium", "BEL", "BE"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{4})",
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  fusedTypeSuffixes: FUSED,
  splitSpacedType: false,

  // "bus 3" (Dutch) / "bte 3" / "boîte 3" (French) box/unit.
  secUnitPattern:
    "(?<sec_unit_type>bus|bte|boîte|boite)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    bus: "bus",
    bte: "bte",
    "boîte": "bte",
    boite: "bte",
  },
};

export default beConfig;
