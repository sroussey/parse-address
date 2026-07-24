import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

// DJ (Djibouti) address configuration -- French, number-first, prefix voie type.
// Numbers frequently absent; B.P. (Boîte Postale) is the dominant delivery form.
// No operational postcode. Djibouti is also Arabic-speaking, but international
// mail is written in Latin/French; only the French form is modelled here. The 6
// regions are rarely written -> optional `state`. Because the regions share
// names with their capital cities, the state-bearing samples pair the region
// with a DISTINCT locality (e.g. a Djibouti-city quartier -> "Balbala,
// Djibouti"). See research-dj.md.

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

export const djConfig: EuCountryConfig = {
  code: "dj",
  country: "DJ",
  // "Djibouti" is deliberately omitted from the trailing country vocabulary: it
  // is the dominant routing CITY (and the country name), so allowing it as a
  // trailing country token would let the place tail read a real "..., Djibouti"
  // city line as "city, country" and truncate the street. Only the codes remain.
  countryNames: ["DJI", "DJ"],

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

  // Optional region after the city -> state. Five of Djibouti's six regions
  // share a name with their main town (and "Djibouti" is the dominant routing
  // city as well as the country name), so a region token equal to a routing city
  // would make the non-greedy street under-match. The list is curated DISJOINT
  // from the corpus cities: only "Arta" (never used as a routing-city token
  // here) is kept, demonstrated with sub-localities inside the Arta region.
  regionPattern: "(?<state>Arta)",

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

export default djConfig;
