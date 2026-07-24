import type { EuCountryConfig } from "../_eu/types";

/**
 * Martinique (MQ) address configuration.
 *
 * A French overseas territory that uses the metropolitan FRENCH address format
 * (La Poste conventions), identical to FR except for the fixed postcode prefix:
 *   Order:    house number FIRST, then the voie type + name ("12 Rue Schoelcher").
 *   Type:     leads the street name (prefix). Particles ("de", "du", "de la",
 *             "des", "d'") stay with the name.
 *   Rep idx:  "bis"/"ter"/"quater" (or a letter) after the number.
 *   Postcode: 5-digit (972\d\d block) BEFORE the commune; "CEDEX nn"
 *             delivery markers after the city are dropped.
 *   No region/state; no province (countyPattern set to never-match).
 */

// French voie types (longest handled first by the builder). Kept verbatim.
const TYPES = [
  "Grande Rue", "Grand Place", "Rond-point", "Rond Point", "Lieu-dit", "Lieudit",
  "Boulevard", "Promenade", "Esplanade", "Passage", "Sentier", "Impasse",
  "Montée", "Montee", "Avenue", "Chemin", "Square", "Parvis", "Hameau",
  "Allée", "Allee", "Place", "Cours", "Route", "Quai", "Villa", "Cité", "Cite",
  "Voie", "Rue", "Rue",
  // abbreviations
  "Av", "Bd", "Bld", "Pl", "Rte", "Imp", "All", "Chem", "Prom", "Sq",
];

const TYPE_DISPLAY: Record<string, string> = {
  rue: "Rue", avenue: "Avenue", av: "Avenue", boulevard: "Boulevard",
  bd: "Boulevard", bld: "Boulevard", place: "Place", pl: "Place",
  impasse: "Impasse", imp: "Impasse", "allée": "Allée", allee: "Allée",
  all: "Allée", chemin: "Chemin", chem: "Chemin", cours: "Cours", quai: "Quai",
  passage: "Passage", square: "Square", sq: "Square", villa: "Villa",
  "cité": "Cité", cite: "Cité", sentier: "Sentier", promenade: "Promenade",
  prom: "Promenade", route: "Route", rte: "Route", voie: "Voie",
  hameau: "Hameau", "montée": "Montée", montee: "Montée", parvis: "Parvis",
  esplanade: "Esplanade", "rond-point": "Rond-point", "rond point": "Rond-point",
  "grande rue": "Grande Rue", "grand place": "Grand Place",
  "lieu-dit": "Lieu-dit", lieudit: "Lieu-dit",
};

const TYPE_SHORT: Record<string, string> = {
  rue: "RUE", avenue: "AV", boulevard: "BD", place: "PL", impasse: "IMP",
  "allée": "ALL", chemin: "CHE", cours: "COU", quai: "QU", passage: "PAS",
  square: "SQ", villa: "VLA", "cité": "CI", sentier: "SEN", promenade: "PROM",
  route: "RTE", voie: "VOIE", hameau: "HAM", "montée": "MTE", parvis: "PARV",
  esplanade: "ESP", "rond-point": "RPT", "grande rue": "GR",
  "grand place": "GPL", "lieu-dit": "LD",
};

export const mqConfig: EuCountryConfig = {
  code: "mq",
  country: "MQ",
  countryNames: ["Martinique", "MTQ", "MQ"],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Like FR, keep the voie type exactly as written (Bd, Av., Rue).
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>972\\d\\d)",
  // French house numbers are <= 4 digits, so a 5-digit run is always a postcode.
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|quater|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // No region/province in these territories; never-match so no county is captured.
  countyPattern: "(?!x)x",

  // Drop the "CEDEX 08" delivery-office marker from the city.
  citySuffixPattern: "\\s+CEDEX(?:\\s+\\d{1,3})?",

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|Bâtiment|Batiment|Bât\\.?|Bat\\.?|Escalier|Esc\\.?|Étage|Etage|Bureau)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement", appt: "Appt", apt: "Appt",
    "bâtiment": "Bât", batiment: "Bât", "bât": "Bât", bat: "Bât",
    escalier: "Escalier", esc: "Escalier", "étage": "Étage", etage: "Étage",
    bureau: "Bureau",
  },

  poBoxNames: ["BP", "CS", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    bp: "BP", cs: "CS", "boîte postale": "BP", "boite postale": "BP",
  },
};

export default mqConfig;
