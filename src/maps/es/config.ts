import type { EuCountryConfig } from "../_eu/types";

/**
 * Spanish (ES) address configuration.
 *
 * Order: vía type + name, comma, then the house number ("Calle de Alcalá, 42").
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (C/, Avda.)
 *       and regional variants (Carrer, Passeig, Rúa). Particles ("de", "de la",
 *       "del") stay with the name.
 * Floor+door ("3.º B", "n.º 2") become a secondary unit; "s/n" / "km" mark the
 *       absence of a house number.
 * CP: 5-digit before the municipio; the province may follow in parentheses
 *       ("(Málaga)") -> `state`.
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

export const esConfig: EuCountryConfig = {
  code: "es",
  country: "ES",
  countryNames: ["España", "Espana", "Spain", "ESP", "ES"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{5})",
  // Optional "número" marker (nº/núm.) then the number or a range, with an
  // optional (possibly spaced) letter/bis suffix; OR the no-number markers
  // "s/n" / "km NN".
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|núm\\.?)\\s*)?(?:(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z])|\\s?bis|\\s?dup(?:do)?)?|(?<civic_number_suffix_2>s/n))",

  types: TYPES,
  typeDisplayMap: {},

  // Province in parentheses after the city: "(Málaga)", "(A Coruña)".
  regionPattern: "\\(\\s*(?<state>[^)\\n]+?)\\s*\\)",

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

export default esConfig;
