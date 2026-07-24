import type { EuCountryConfig } from "../_eu/types";

// CF (Central African Republic) address configuration -- French, number-first,
// prefix voie type. Numbers frequently absent; B.P. (Boîte Postale) is the
// dominant delivery form. No operational postcode. The 16 prefectures (plus the
// autonomous commune of Bangui) are rarely written -> optional `state`, curated
// disjoint from routing cities. See research-cf.md.

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

export const cfConfig: EuCountryConfig = {
  code: "cf",
  country: "CF",
  countryNames: ["Centrafrique", "République Centrafricaine", "Republique Centrafricaine", "Central African Republic", "RCA", "CAF", "CF"],

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

  // Optional prefecture after the city -> state. Compound (hyphen/apostrophe/
  // space) names ordered longest-first; spaces escaped as \\s+. Curated DISJOINT
  // from routing cities: the autonomous commune "Bangui" is deliberately
  // excluded (it is the dominant routing city, and a region token equal to a
  // city makes the non-greedy street under-match). Each prefecture's capital
  // carries a different name than the prefecture, so the list stays disjoint.
  regionPattern: "(?<state>Bamingui-Bangoran|Basse-Kotto|Haute-Kotto|Haut-Mbomou|Mambéré-Kadéï|Nana-Grébizi|Nana-Mambéré|Ombella-M'Poko|Ouham-Pendé|Sangha-Mbaéré|Kémo|Lobaye|Mbomou|Ouaka|Ouham|Vakaga)",

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

export default cfConfig;
