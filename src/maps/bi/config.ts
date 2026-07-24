import type { EuCountryConfig } from "../_eu/types";

// BI (Burundi) address configuration -- French, number-first, prefix voie type.
// Numbers frequently absent; B.P. (Boîte Postale) is the dominant delivery
// form. No operational postcode. The 18 provinces are rarely written -> optional
// `state`; because most province names coincide with their capital city, the
// state list is curated so the state-bearing samples pair a city token DISTINCT
// from the province token. See research-bi.md.

const TYPES = [
  "Boulevard", "Carrefour", "Chaussée", "Chaussee", "Avenue", "Impasse", "Rond-point", "Rond Point", "Passage", "Place", "Allée", "Allee", "Rue", "Route", "Voie", "Bd", "Bld", "Av", "Rte", "Imp",
];

const TYPE_SHORT: Record<string, string> = {
  "rue": "RUE",
  "avenue": "AV",
  "av": "AV",
  "boulevard": "BD",
  "bd": "BD",
  "bld": "BD",
  "chaussée": "CHS",
  "chaussee": "CHS",
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
};

export const biConfig: EuCountryConfig = {
  code: "bi",
  country: "BI",
  countryNames: ["Burundi", "BDI", "BI"],

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

  // Optional province after the city -> state. Two-word names escape their space
  // as \\s+ and are ordered longest-first. Curated DISJOINT from the routing
  // cities: the provinces whose name coincides with a city we route to (Gitega,
  // Ngozi, Muyinga, Ruyigi, Rumonge, and bare "Bujumbura") are deliberately
  // excluded, since a region token equal to a city makes the non-greedy street
  // under-match. "Bujumbura Mairie/Rural" are safe (they are supersets of the
  // city token, so a bare "Bujumbura" city never matches them).
  regionPattern: "(?<state>Bujumbura\\s+Mairie|Bujumbura\\s+Rural|Bubanza|Bururi|Cankuzo|Cibitoke|Karuzi|Kayanza|Kirundo|Makamba|Muramvya|Mwaro|Rutana)",

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

export default biConfig;
