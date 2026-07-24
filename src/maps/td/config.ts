import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

// TD (Chad / Tchad) address configuration -- French, number-first, prefix voie
// type. Numbers frequently absent; B.P. (Boîte Postale) is the dominant delivery
// form. No operational postcode. Chad is also Arabic-speaking, but international
// mail is written in Latin/French; only the French form is modelled here. The
// 23 provinces are rarely written -> optional `state`, curated disjoint from
// routing cities. See research-td.md.

const TYPES = [
  "Boulevard", "Carrefour", "Avenue", "Impasse", "Rond-point", "Rond Point", "Passage", "Place", "Allée", "Allee", "Rue", "Route", "Voie", "Cité", "Cite", "Bd", "Bld", "Av", "Rte", "Imp",
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
  "carrefour": "CARR",
  "passage": "PAS",
  "voie": "VOIE",
  "rond-point": "RPT",
  "rond point": "RPT",
  "cité": "CI",
  "cite": "CI",
};

export const tdConfig: EuCountryConfig = {
  code: "td",
  country: "TD",
  countryNames: ["Tchad", "Chad", "TCD", "TD"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // No operational postcode: a never-matching sentinel keeps the slot inert.
  postalPattern: "(?<postal_code>(?!x)x)",

  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Optional province after the city -> state. Compound (hyphen/space) names
  // ordered longest-first; spaces escaped as \\s+. Curated disjoint from routing
  // cities (each province's chief town carries a different name).
  regionPattern: "(?<state>Barh-el-Gazel|Chari-Baguirmi|Ennedi-Est|Ennedi-Ouest|Hadjer-Lamis|Logone\\s+Occidental|Logone\\s+Oriental|Mayo-Kebbi\\s+Est|Mayo-Kebbi\\s+Ouest|Moyen-Chari|Wadi\\s+Fira|Ouaddaï|Tandjilé|Batha|Borkou|Guéra|Kanem|Mandoul|Salamat|Sila|Tibesti)",

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

export default tdConfig;
