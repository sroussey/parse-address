import type { EuCountryConfig } from "../_eu/types";

/**
 * Cameroon (CM) address configuration.
 *
 * Language: French (official administrative language for addressing, alongside
 *   English in the anglophone NW/SW regions).
 * Order: house number FIRST, then the voie type + name ("10 Rue Joffre").
 *   Numbers are frequently ABSENT -- many Cameroonian streets are unnumbered, so
 *   a bare "Boulevard du 20 Mai" is the norm.
 * Type: leads the street name (prefix), French vocabulary (Rue, Avenue, Bd, ...).
 * Postcode: NONE. Cameroon has no operational postal-code system (CAMPOST does
 *   not route on postcodes), so the postal slot never matches.
 * Region: optional -> state. The 10 regions (Centre, Littoral, Ouest, ...) are
 *   rarely written but supported after the city.
 * PO box: "B.P." / "BP" (Boîte Postale) is the DOMINANT delivery form
 *   ("B.P. 1234, Douala"); the box number is not a house number.
 *
 * Sources: CAMPOST; UPU S42 addressing notes; Smarty / PostGrid Cameroon guides;
 *   exampleaddress.com Cameroon corpus. See research-cm.md.
 */

// French voie types recognised at the START of the street (prefix). Longest
// spellings are ordered first by the builder. Kept verbatim (normalizeTypeCase
// false), so the display echoes the source spelling.
const TYPES = [
  "Rond-point", "Rond Point", "Boulevard", "Carrefour", "Avenue", "Impasse",
  "Chemin", "Montée", "Montee", "Place", "Route", "Allée", "Allee", "Ruelle",
  "Rue", "Voie", "Quai",
  // abbreviations
  "Bd", "Bld", "Av", "Rte", "Imp", "Carr",
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
  ruelle: "RLE",
  carrefour: "CARR", carr: "CARR",
  "rond-point": "RPT", "rond point": "RPT",
  montée: "MTE", montee: "MTE",
  voie: "VOIE",
  quai: "QU",
};

// The 10 regions of Cameroon (French + English spellings), longest-first.
const REGIONS = [
  "Extrême-Nord", "Extreme-Nord", "Far North", "Nord-Ouest", "Northwest",
  "North West", "Sud-Ouest", "Southwest", "South West", "Adamaoua", "Adamawa",
  "Littoral", "Centre", "Est", "East", "Ouest", "West", "Nord", "North",
  "Sud", "South",
];

const REGION_MAP: Record<string, string> = {
  adamaoua: "AD", adamawa: "AD",
  centre: "CE",
  est: "ES", east: "ES",
  "extrême-nord": "EN", "extreme-nord": "EN", "far north": "EN",
  littoral: "LT",
  nord: "NO", north: "NO",
  "nord-ouest": "NW", northwest: "NW", "north west": "NW",
  ouest: "OU", west: "OU",
  sud: "SU", south: "SU",
  "sud-ouest": "SW", southwest: "SW", "south west": "SW",
};

export const cmConfig: EuCountryConfig = {
  code: "cm",
  country: "CM",
  countryNames: ["Cameroon", "Cameroun", "CMR", "CM"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // French voie type echoed exactly as written (Bd, Av, Rue).
  normalizeTypeCase: false,

  // No postal code in Cameroon: a never-matching sentinel keeps the (optional)
  // postcode slot inert so the city is read directly after the street.
  postalPattern: "(?<postal_code>(?!x)x)",

  // Small house numbers, optional letter/bis repetition index (as in France).
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // NOTE: the city slot is kept digit- and comma-free (the shared default). This
  // is deliberate: Cameroonian street names are frequently numbered/dated
  // ("Boulevard du 20 Mai", "Rue du 8 Mai") and the prefix-type grammar uses a
  // NON-greedy street name, so allowing digits/commas in the city would let the
  // city claim the numeric tail of the street name. The cost is that a
  // "street, quartier, city" chain is not modelled (single city slot); such
  // multi-locality inputs degrade to a lossless single-street fallback and are
  // marked __skip in the corpus.

  // Optional region after the city -> state.
  regionPattern: `(?<state>${REGIONS.join("|")})`,
  regionMap: REGION_MAP,

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Immeuble|Imm\\.?|Bâtiment|Batiment|Bât\\.?|Bat\\.?|Étage|Etage|Porte)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement",
    appt: "Appt", apt: "Appt", app: "Appt",
    immeuble: "Immeuble", imm: "Immeuble",
    bâtiment: "Bât", batiment: "Bât", bât: "Bât", bat: "Bât",
    étage: "Étage", etage: "Étage",
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

export default cmConfig;
