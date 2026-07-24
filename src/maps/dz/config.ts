import type { EuCountryConfig } from "../_eu/types";

/**
 * Algeria (DZ) address configuration.
 *
 * Language: French (co-official with Arabic for addressing; Latin-script French
 *   is the form parsed here).
 * Order: house number FIRST, then the voie type + name. A comma frequently
 *   follows the number in the official style ("2, rue de l'Indépendance").
 * Type: leads the street name (prefix), French vocabulary (Rue, Avenue, Bd, ...).
 * Postcode: exactly 5 digits, written BEFORE the commune/locality
 *   ("16027 ALGIERS", per UPU). First 2 digits = wilaya. Optional.
 * Wilaya (province): optional -> state, written after the city, often as
 *   "Wilaya d'Alger".
 * PO box: "B.P." / "BP" (Boîte Postale).
 *
 * Sources: UPU Postal addressing systems (Algeria, 07/2002 -- example
 *   "2, rue de l'Indépendance / 16027 ALGIERS"); GeoPostcodes / Smarty /
 *   PostGrid Algeria guides. See research-dz.md.
 */

const TYPES = [
  "Rond-point", "Boulevard", "Carrefour", "Avenue", "Impasse", "Chemin",
  "Passage", "Place", "Route", "Allée", "Allee", "Cité", "Cite", "Rampe",
  "Rue", "Voie", "Quai",
  // abbreviations
  "Bd", "Bld", "Av", "Rte", "Imp",
];

const TYPE_SHORT: Record<string, string> = {
  rue: "RUE",
  avenue: "AV", av: "AV",
  boulevard: "BD", bd: "BD", bld: "BD",
  place: "PL",
  impasse: "IMP", imp: "IMP",
  chemin: "CHE",
  route: "RTE", rte: "RTE",
  allée: "ALL", allee: "ALL",
  cité: "CI", cite: "CI",
  passage: "PAS",
  carrefour: "CARR",
  rampe: "RMP",
  "rond-point": "RPT",
  voie: "VOIE",
  quai: "QU",
};

// A representative set of the 58 wilayas (name + 2-digit wilaya number code,
// matching ISO 3166-2:DZ). The optional "Wilaya d'/de " lead-in is consumed but
// not captured, so `state` holds just the wilaya name for mapping.
const WILAYAS = [
  "Tizi Ouzou", "Aïn Defla", "Ain Defla", "Aïn Témouchent", "Ain Temouchent",
  "Sidi Bel Abbès", "Sidi Bel Abbes", "Bordj Bou Arréridj",
  "Bordj Bou Arreridj", "Constantine", "Tamanrasset", "Mostaganem",
  "Tlemcen", "Ghardaïa", "Ghardaia", "Boumerdès", "Boumerdes", "Annaba",
  "Béjaïa", "Bejaia", "Ouargla", "Béchar", "Bechar", "Djelfa", "Batna",
  "Blida", "Sétif", "Setif", "Adrar", "Alger", "Oran", "Biskra", "Skikda",
  "Médéa", "Medea", "Chlef", "Tébessa", "Tebessa", "Tiaret", "Jijel",
  "Mascara", "Saïda", "Saida", "Guelma", "Laghouat",
];

const WILAYA_MAP: Record<string, string> = {
  adrar: "01", chlef: "02", laghouat: "03", batna: "05",
  "béjaïa": "06", bejaia: "06", biskra: "07", "béchar": "08", bechar: "08",
  blida: "09", tamanrasset: "11", "tébessa": "12", tebessa: "12",
  tlemcen: "13", tiaret: "14", "tizi ouzou": "15", alger: "16", djelfa: "17",
  jijel: "18", "sétif": "19", setif: "19", saïda: "20", saida: "20",
  skikda: "21", "sidi bel abbès": "22", "sidi bel abbes": "22", annaba: "23",
  guelma: "24", constantine: "25", "médéa": "26", medea: "26",
  mostaganem: "27", mascara: "29", ouargla: "30", oran: "31",
  "bordj bou arréridj": "34", "bordj bou arreridj": "34",
  boumerdès: "35", boumerdes: "35",
  "aïn defla": "44", "ain defla": "44",
  "aïn témouchent": "46", "ain temouchent": "46",
  "ghardaïa": "47", ghardaia: "47",
};

export const dzConfig: EuCountryConfig = {
  code: "dz",
  country: "DZ",
  countryNames: ["Algeria", "Algérie", "Algerie", "DZA", "DZ"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // 5-digit numeric postcode, leading digits significant.
  postalPattern: "(?<postal_code>\\d{5})",

  // Small house numbers (<=4 digits, so a 5-digit run is always a postcode),
  // with an optional bis/ter/letter repetition index.
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Optional wilaya after the city -> state; the "Wilaya d'/de " lead-in is
  // consumed but not captured.
  regionPattern: `(?:Wilaya\\s+d['e]\\s*)?(?<state>${WILAYAS.join("|")})`,
  regionMap: WILAYA_MAP,

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Immeuble|Imm\\.?|Bâtiment|Batiment|Bât\\.?|Bat\\.?|Étage|Etage|Villa|Porte)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement",
    appt: "Appt", apt: "Appt", app: "Appt",
    immeuble: "Immeuble", imm: "Immeuble",
    bâtiment: "Bât", batiment: "Bât", bât: "Bât", bat: "Bât",
    étage: "Étage", etage: "Étage",
    villa: "Villa",
    porte: "Porte",
  },

  poBoxNames: ["B.P.", "BP", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    "b.p.": "BP",
    bp: "BP",
    "boîte postale": "BP",
    "boite postale": "BP",
  },
};

export default dzConfig;
