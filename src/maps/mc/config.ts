import type { EuCountryConfig } from "../_eu/types";

/**
 * Monaco (MC) address configuration.
 *
 * Monaco follows FRENCH addressing (La Poste conventions; Monaco's postal
 * service is operated jointly and codes are inside the French 5-digit plan):
 *   Order:   house number FIRST, then the voie type + name ("2 Boulevard des
 *            Moulins"). A comma after the number is common ("2, Boulevard ...").
 *   Type:    leads the street name (prefix). Particles ("de", "du", "de la",
 *            "des", "d'") stay with the name.
 *   Rep idx: "bis"/"ter"/"quater" (or a letter) after the number.
 *   Postcode: 5-digit 980xx BEFORE the locality; the whole Principality shares
 *            the 980xx block (98000 is by far the most common). The locality is
 *            one of the quartiers/wards ("Monaco", "Monte-Carlo", "La Condamine",
 *            "Fontvieille", "Monaco-Ville", ...). An optional "MC" / "MC-" may
 *            precede the code. "CEDEX nn" delivery markers after the city drop.
 *   No region/state; no province.
 */

// French voie types (longest handled first by the builder). Kept verbatim.
const TYPES = [
  "Rond-point", "Rond Point", "Boulevard", "Promenade", "Esplanade", "Descente",
  "Passage", "Sentier", "Impasse", "Montée", "Montee", "Avenue", "Chemin",
  "Square", "Parvis", "Allée", "Allee", "Place", "Cours", "Route", "Quai",
  "Villa", "Voie", "Rue", "Ruelle", "Escalier", "Rampe", "Galerie", "Accès",
  "Acces",
  // abbreviations
  "Av", "Bd", "Bld", "Pl", "Rte", "Imp", "All", "Chem", "Prom", "Sq",
];

const TYPE_DISPLAY: Record<string, string> = {
  rue: "Rue", avenue: "Avenue", av: "Avenue", boulevard: "Boulevard",
  bd: "Boulevard", bld: "Boulevard", place: "Place", pl: "Place",
  impasse: "Impasse", imp: "Impasse", allée: "Allée", allee: "Allée",
  all: "Allée", chemin: "Chemin", chem: "Chemin", cours: "Cours", quai: "Quai",
  passage: "Passage", square: "Square", sq: "Square", villa: "Villa",
  sentier: "Sentier", promenade: "Promenade", prom: "Promenade", route: "Route",
  rte: "Route", voie: "Voie", montée: "Montée", montee: "Montée",
  parvis: "Parvis", esplanade: "Esplanade", descente: "Descente",
  ruelle: "Ruelle", escalier: "Escalier", rampe: "Rampe", galerie: "Galerie",
  accès: "Accès", acces: "Accès",
  "rond-point": "Rond-point", "rond point": "Rond-point",
};

const TYPE_SHORT: Record<string, string> = {
  rue: "RUE", avenue: "AV", boulevard: "BD", place: "PL", impasse: "IMP",
  allée: "ALL", chemin: "CHE", cours: "COU", quai: "QU", passage: "PAS",
  square: "SQ", villa: "VLA", sentier: "SEN", promenade: "PROM", route: "RTE",
  voie: "VOIE", montée: "MTE", parvis: "PARV", esplanade: "ESP",
  descente: "DSC", ruelle: "RLE", "rond-point": "RPT",
};

export const mcConfig: EuCountryConfig = {
  code: "mc",
  country: "MC",
  countryNames: ["Principauté de Monaco", "Principaute de Monaco", "Monaco", "MCO", "MC"],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Like FR, keep the voie type exactly as written (Bd, Av., Rue).
  normalizeTypeCase: false,

  // 980xx, optional "MC"/"MC-" prefix. Monaco house numbers are <= 4 digits.
  postalPattern: "(?:MC[-\\s]?)?(?<postal_code>980\\d\\d)",
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|quater|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // Drop a "CEDEX nn" delivery marker from the locality.
  citySuffixPattern: "\\s+CEDEX(?:\\s+\\d{1,3})?",

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|Bâtiment|Batiment|Bât\\.?|Bat\\.?|Escalier|Esc\\.?|Étage|Etage|Bloc|Bureau)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement", appt: "Appt", apt: "Appt",
    bâtiment: "Bât", batiment: "Bât", bât: "Bât", bat: "Bât",
    escalier: "Escalier", esc: "Escalier", étage: "Étage", etage: "Étage",
    bloc: "Bloc", bureau: "Bureau",
  },

  poBoxNames: ["BP", "CS", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    bp: "BP", cs: "CS", "boîte postale": "BP", "boite postale": "BP",
  },
};

export default mcConfig;
