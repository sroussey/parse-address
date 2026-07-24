import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

// CG address configuration -- French, number-first, prefix voie type.
// Numbers frequently absent; B.P. (Boîte Postale) is the dominant delivery
// form. Region/province optional (restricted list). See research-cg.md.

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

// Neighbourhoods dropped when written between the street and the routing city.
const QUARTIERS = [
  "Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï", "Makélékélé",
  "Mfilou", "Plateau des 15 Ans", "Mpila",
];

export const cgConfig: EuCountryConfig = {
  code: "cg",
  country: "CG",
  countryNames: ["Congo", "République du Congo", "COG", "CG"],

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

  // Optional region/province after the city -> state. Restricted to a real
  // region list (spaces escaped as \\s+ for the free-spacing grammar); names
  // that double as cities are excluded so the city is never mis-read as a state.
  regionPattern: "(?<state>Bouenza|Cuvette|Cuvette-Ouest|Kouilou|Lékoumou|Likouala|Niari|Plateaux|Pool|Sangha)",

  // A recognised quartier between the street and the city is consumed/dropped.
  areaNames: QUARTIERS,

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Immeuble|Imm\\.?|Bâtiment|Batiment|Bât\\.?|Bat\\.?|Étage|Etage|Villa|Porte|Lot)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
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
    "lot": "Lot",
  },

  poBoxNames: ["B.P.", "BP", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    "b.p.": "BP",
    "bp": "BP",
    "boîte postale": "BP",
    "boite postale": "BP",
  },
};

export default cgConfig;
