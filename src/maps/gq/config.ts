import type { EuCountryConfig } from "../_eu/types";

/**
 * Equatorial Guinea (GQ) address configuration — Spanish (near-clone of ES).
 *
 * Spanish is the main official language and addressing follows the Spanish
 * pattern: vía type + name, then the house number ("Calle de Alcalá, 42"). Type
 * leads the name (prefix), kept verbatim including abbreviations (C/, Avda.).
 * Particles ("de", "de la", "del") stay with the name. Floor+door ("3.º B",
 * "n.º 2") become a secondary unit; "s/n" / "km" mark the absence of a house
 * number.
 * Postcode: NONE. Equatorial Guinea has no postal-code system, so the postcode
 *        slot is a never-match sentinel and the place tail is just the city
 *        ("Malabo", "Bata", "Ebebiyín").
 *
 * Sources: Universal Postal Union — Equatorial Guinea has no postcode; Spanish
 * addressing conventions. See research-gq.md.
 */

const TYPES = [
  // multiword first
  "Gran Vía", "Gran Via",
  // full words (Castilian + Catalan/Valencian/Galician/Basque)
  "Avenida", "Avinguda", "Carretera", "Travesía", "Callejón", "Urbanización",
  "Polígono", "Explanada", "Glorieta", "Boulevard", "Passeig", "Carrer",
  "Bulevar", "Camino", "Pasaje", "Cuesta", "Ronda", "Rambla", "Paseo", "Plaça",
  "Plaza", "Calle", "Rúa", "Vía", "Kalea",
  // abbreviations (verbatim)
  "C/", "Avda.", "Avda", "Av.", "Pza.", "Pl.", "P.º", "Po", "Ctra.", "Rda.",
  "Cno.", "Trav.", "Psje.", "C.",
];

export const gqConfig: EuCountryConfig = {
  code: "gq",
  country: "GQ",
  countryNames: [
    "Guinea Ecuatorial", "Equatorial Guinea", "Guinée équatoriale",
    "Guiné Equatorial", "GNQ", "GQ",
  ],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // No postcode system -> never-match sentinel (the before-city grammar makes
  // the postcode block optional, so it is simply skipped).
  postalPattern: "(?<postal_code>(?!x)x)",
  // Optional "número" marker (nº/núm.) then the number or a range, with an
  // optional (possibly spaced) letter/bis suffix; OR the no-number markers
  // "s/n" / "km NN".
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|núm\\.?)\\s*)?(?:(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z])|\\s?bis|\\s?dup(?:do)?)?|(?<civic_number_suffix_2>s/n))",

  types: TYPES,
  typeDisplayMap: {},

  // No routing province is used in Equatorial Guinean addresses.
  countyPattern: "(?!x)x",

  // "km NN" -> km; "puerta N" / "n.º N" -> Puerta; a floor/floor+door
  // (Castilian & Catalan ordinals, "Bajo"/"Àtic"/"Baixos"/... , or "3 D") -> Piso.
  secUnitPattern:
    "(?:(?<sec_unit_type>km|puerta|pta\\.?|n\\.?º|nº|núm\\.?)\\s*(?<sec_unit_num>[\\dA-Za-zºª.-]+)" +
    "|(?<sec_unit_num_2>" +
    "(?:\\d+\\s*\\.?\\s*[ºªoa]|\\d+\\s*[rnt]|\\d+\\s*è|bajos?|áticos?|aticos?|àtic|baixos?|bxs|entresòl|entresol|entresuelo|principal|pral\\.?|sótano|sotano)" +
    "(?:[\\s-]+(?:izda\\.?|izq\\.?|dcha\\.?|der\\.?|izquierda|derecha|centro|\\d+[ºªa]?|[A-Za-z](?![A-Za-z])))?" +
    "|\\d+[\\s-]+[A-Za-z](?![A-Za-z])))",
  secUnitDisplayMap: {
    km: "km",
    "n.º": "Puerta", "nº": "Puerta", "núm": "Puerta", "núm.": "Puerta",
    puerta: "Puerta", pta: "Puerta",
  },
  defaultSecUnitType: "Piso",
};

export default gqConfig;
