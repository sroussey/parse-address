import type { EuCountryConfig } from "../_eu/types";

/**
 * Luxembourg (LU) address configuration.
 *
 * Order: house number FIRST, conventionally followed by a comma, then the
 *        French voie type + name ("71, Route de Longwy").
 * Type: leads the street name (prefix) -- French vocabulary (Rue, Route, Avenue,
 *       Boulevard, Grand-Rue, ...). A handful of Luxembourgish prepositional
 *       names ("Op der Heed", "An der Gaass") carry no type.
 * Postcode: 4 digits, optionally written with an "L-" prefix, BEFORE the
 *       commune ("L-4750 Pétange"). Normalised to "L-####" on output.
 * No region/state on the address line (the Grand Duchy has no provinces).
 */

// French voie types recognised at the START of the street (after the number).
// Longest handled first by the builder. Luxembourg is officially trilingual but
// street signage is overwhelmingly French.
const TYPES = [
  "Grand-Rue", "Grand Rue", "Rond-Point", "Rond Point",
  "Boulevard", "Promenade", "Esplanade", "Impasse", "Passage",
  "Avenue", "Chemin", "Montée", "Montee", "Allée", "Allee", "Place",
  "Route", "Coin", "Quai", "Villa", "Cité", "Cite", "Rue", "Val", "Zone",
  "Parc", "Plateau", "Cour", "Dernier Sol",
  // abbreviations
  "Bd", "Bld", "Av", "Rte", "Imp", "Pl", "All",
];

const TYPE_DISPLAY: Record<string, string> = {
  rue: "Rue",
  route: "Route",
  rte: "Route",
  avenue: "Avenue",
  av: "Avenue",
  boulevard: "Boulevard",
  bd: "Boulevard",
  bld: "Boulevard",
  place: "Place",
  pl: "Place",
  impasse: "Impasse",
  imp: "Impasse",
  allée: "Allée",
  allee: "Allée",
  all: "Allée",
  chemin: "Chemin",
  montée: "Montée",
  montee: "Montée",
  coin: "Coin",
  quai: "Quai",
  passage: "Passage",
  villa: "Villa",
  cité: "Cité",
  cite: "Cité",
  val: "Val",
  zone: "Zone",
  parc: "Parc",
  plateau: "Plateau",
  cour: "Cour",
  promenade: "Promenade",
  esplanade: "Esplanade",
  "grand-rue": "Grand-Rue",
  "grand rue": "Grand-Rue",
  "rond-point": "Rond-Point",
  "rond point": "Rond-Point",
  "dernier sol": "Dernier Sol",
};

const TYPE_SHORT: Record<string, string> = {
  rue: "RUE",
  route: "RTE",
  avenue: "AV",
  boulevard: "BD",
  place: "PL",
  impasse: "IMP",
  allée: "ALL",
  chemin: "CHE",
  coin: "COIN",
  quai: "QU",
  passage: "PAS",
  villa: "VLA",
  cité: "CI",
  val: "VAL",
  zone: "ZONE",
  parc: "PARC",
  plateau: "PLAT",
  cour: "COUR",
  promenade: "PROM",
  esplanade: "ESP",
  "grand-rue": "GR",
  "rond-point": "RPT",
  "dernier sol": "DS",
};

export const luConfig: EuCountryConfig = {
  code: "lu",
  country: "LU",
  countryNames: [
    "Luxembourg", "Luxemburg", "Lëtzebuerg",
    "Grand Duchy of Luxembourg", "Grand-Duché de Luxembourg",
    "LUX", "LU",
  ],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // The corpus keeps the voie type as written (Route, rte, Bd).
  normalizeTypeCase: false,

  // 4-digit CAP, with an OPTIONAL "L-" prefix captured INTO the group so the
  // canonical form echoes the source: "L-1660" stays "L-1660", bare "1660"
  // stays "1660". (Forcing an "L-" onto a bare source would make the postcode
  // unfindable in the input and trip the token-preservation guard.)
  postalPattern: "(?<postal_code>(?:L\\s?-\\s?)?\\d{4})",
  postalFormat: (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return /l/i.test(raw) ? `L-${digits}` : digits;
  },
  // House number <= 4 digits with an optional letter suffix ("18A") or a range
  // tail ("2-4"). A 4-digit postcode can never be mistaken for it because the
  // number is consumed at the front of a number-first line.
  houseNumberPattern:
    "(?<number>\\d{1,4})(?<civic_number_suffix>\\s*[-–]\\s*\\d+|\\s*[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|Étage|Etage|Bâtiment|Batiment|Bloc|Escalier|Esc\\.?)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement",
    appt: "Appt",
    apt: "Appt",
    étage: "Étage",
    etage: "Étage",
    bâtiment: "Bâtiment",
    batiment: "Bâtiment",
    bloc: "Bloc",
    escalier: "Escalier",
    esc: "Escalier",
  },

  poBoxNames: ["Boîte Postale", "Boite Postale", "B.P.", "BP"],
  poBoxDisplayMap: {
    "boîte postale": "BP",
    "boite postale": "BP",
    "b.p.": "BP",
    bp: "BP",
  },
};

export default luConfig;
