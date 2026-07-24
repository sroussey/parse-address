import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

// HT (Haiti) address configuration -- French, number-first, prefix voie type.
// Numbers frequently absent; B.P. (Boîte Postale) is a common delivery form.
// Haiti has an OPTIONAL 4-digit postal code, usually written with an "HT"
// prefix before the city ("HT6110 Port-au-Prince") but also as a bare 4-digit
// ("6110 Port-au-Prince"); most addresses carry no code. Departments (10) are
// rarely written -> optional `state`, curated disjoint from routing cities.
// See research-ht.md.

const TYPES = [
  "Boulevard", "Carrefour", "Avenue", "Impasse", "Rond-point", "Rond Point", "Passage", "Chemin", "Place", "Route", "Allée", "Allee", "Ruelle", "Rue", "Voie", "Cité", "Cite", "Bd", "Bld", "Av", "Rte", "Imp",
];

const TYPE_SHORT: Record<string, string> = {
  "rue": "RUE",
  "avenue": "AV",
  "av": "AV",
  "boulevard": "BD",
  "bd": "BD",
  "bld": "BD",
  "place": "PL",
  "impasse": "IMP",
  "imp": "IMP",
  "route": "RTE",
  "rte": "RTE",
  "allée": "ALL",
  "allee": "ALL",
  "ruelle": "RLE",
  "chemin": "CHE",
  "carrefour": "CARR",
  "passage": "PAS",
  "voie": "VOIE",
  "rond-point": "RPT",
  "rond point": "RPT",
  "cité": "CI",
  "cite": "CI",
};

export const htConfig: EuCountryConfig = {
  code: "ht",
  country: "HT",
  countryNames: ["Haïti", "Haiti", "HTI", "HT"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Optional 4-digit code, with or without the "HT" prefix, before the city.
  // Usually absent, so the whole postal slot is optional in the grammar.
  postalPattern: "(?<postal_code>HT\\d{4}|\\d{4})",

  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Optional department after the city -> state. Restricted to the 10 real
  // departments; two-word/prefix names are ordered longest-first so "Nord-Ouest"
  // wins over "Nord". Curated disjoint from routing cities.
  regionPattern: "(?<state>Artibonite|Grand'Anse|Nord-Ouest|Nord-Est|Nord|Sud-Est|Sud|Centre|Nippes|Ouest)",

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Immeuble|Imm\\.?|Bâtiment|Batiment|Bât\\.?|Bat\\.?|Étage|Etage|Villa|Porte)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    "appartement": "Appartement",
    "appt": "Appt",
    "apt": "Appt",
    "app": "Appt",
    "immeuble": "Immeuble",
    "imm": "Immeuble",
    "bâtiment": "Bât",
    "batiment": "Bât",
    "bât": "Bât",
    "bat": "Bât",
    "étage": "Étage",
    "etage": "Étage",
    "villa": "Villa",
    "porte": "Porte",
  },

  poBoxNames: ["B.P.", "BP", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    "b.p.": "BP",
    "bp": "BP",
    "boîte postale": "BP",
    "boite postale": "BP",
  },
};

export default htConfig;
