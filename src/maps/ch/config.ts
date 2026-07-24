import type { EuCountryConfig } from "../_eu/types";

/**
 * Swiss (CH) address configuration. Multilingual: German streets fuse the type
 * as a lowercase suffix ("Bahnhofstrasse" -> "Bahnhof" + "strasse"; note Swiss
 * German never uses ß), while French ("Rue du Rhône") and Italian ("Via Nassa")
 * streets lead with the type. Number after the street; 4-digit postcode before
 * the city.
 */

// French + Italian leading types (kept verbatim).
const TYPES = [
  "Boulevard", "Avenue", "Chemin", "Route", "Place", "Quai", "Ruelle",
  "Sentier", "Piazza", "Viale", "Vicolo", "Salita", "Strada", "Corso", "Rue",
  "Via",
];

// German fused suffixes (lowercase). Swiss German writes "strasse", but inputs
// may still arrive with ß or the "str." abbreviation -> normalize to "strasse".
const FUSED: Array<[string, string]> = [
  ["strasse", "strasse"],
  ["straße", "strasse"],
  ["vorstadt", "vorstadt"],
  ["platz", "platz"],
  ["halde", "halde"],
  ["gasse", "gasse"],
  ["quai", "quai"],
  ["rain", "rain"],
  ["ring", "ring"],
  ["weg", "weg"],
  ["hof", "hof"],
  ["str", "strasse"],
];

export const chConfig: EuCountryConfig = {
  code: "ch",
  country: "CH",
  countryNames: ["Schweiz", "Suisse", "Svizzera", "Switzerland", "CHE", "CH"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Swiss German compounds are glued; a spaced modifier ("Innere ...strasse")
  // stays with the name, so only split a glued suffix.
  splitSpacedType: false,

  // Optional legacy "CH-" prefix before the 4-digit PLZ/NPA.
  postalPattern: "(?:CH-)?(?<postal_code>\\d{4})",
  // A range stays as the number ("12-14"); a trailing letter is the suffix.
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>\\s?[a-zA-Z](?![a-zA-Z]))?",

  types: TYPES,
  typeDisplayMap: {},
  fusedTypeSuffixes: FUSED,

  // Zürich street lexicalised as a whole name (ends in -weg).
  unsplittableExact: ["Rennweg"],

  poBoxNames: ["Postfach", "Case postale", "Casella postale"],
  poBoxDisplayMap: {
    postfach: "Postfach",
    "case postale": "Case postale",
    "casella postale": "Casella postale",
  },
};

export default chConfig;
