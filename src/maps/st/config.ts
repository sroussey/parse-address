import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * São Tomé and Príncipe (ST) address configuration — Portuguese.
 *
 * Order: thoroughfare TYPE + name FIRST ("Avenida da Independência"), then the
 *        house number AFTER the name. Same grammar family as PT/AO.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., R.).
 *        Particles (de/da/do/dos/das) stay with the name.
 * Bairro / zona: a neighbourhood ("Riboque", "Boa Morte", "Bairro do Hospital",
 *        "Praia Cruz", ...) commonly sits between the street and the city; it is
 *        not a routing field, so a RECOGNISED bairro is CONSUMED and DROPPED
 *        (areaNames). Unknown bairros are a documented failure mode.
 * City: usually São Tomé or another town ("Trindade", "Neves", "Santana",
 *        "Santo António" on Príncipe).
 * Distrito -> `state`: the 6 districts + the autonomous region of Príncipe
 *        (Água Grande, Mé-Zóchi, Cantagalo, Caué, Lembá, Lobata, Príncipe) may
 *        be written last; captured to `state`.
 * Postcode: NONE. São Tomé and Príncipe does not operate a postal-code system.
 *        Never-match sentinel.
 * Caixa Postal: PO box, "Caixa Postal 123" (abbr. "C.P."). Common.
 *
 * Sources: Correios de São Tomé e Príncipe (CST); Smarty / GeoPostcodes ST
 * guides (no postcodes); Wikipedia "Districts of São Tomé and Príncipe". See
 * research-st.md.
 */

const TYPES = [
  "Avenida", "Travessa", "Alameda", "Estrada", "Largo", "Praça", "Praca",
  "Beco", "Rotunda", "Rua", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Trav.", "Tv.", "Al.", "Estr.", "Lgo.", "Pç.", "Pc.", "R.",
];

// Districts (state) + the autonomous region of Príncipe. Multi-word first.
const DISTRICTS = [
  "Água Grande", "Agua Grande", "Mé-Zóchi", "Me-Zochi", "Cantagalo",
  "Príncipe", "Principe", "Lobata", "Lembá", "Lemba", "Caué", "Caue",
];

export const stConfig: EuCountryConfig = {
  code: "st",
  country: "ST",
  countryNames: [
    "São Tomé e Príncipe", "Sao Tome e Principe", "São Tomé and Príncipe",
    "Sao Tome and Principe", "STP", "ST",
  ],

  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names are common ("12 de Julho", "3 de Fevereiro").
  allowDigitsInName: true,

  // No real postcode -> never-match sentinel (the before-city grammar makes the
  // postcode block optional, so it is simply skipped).
  postalPattern: "(?<postal_code>(?!x)x)",

  // Optional "nº"/"n.º" marker, digits (or range), optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|N\\.?º\\.?)\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Recognised bairros consumed + dropped. Only names >= 5 chars that are not a
  // substring of a common street word are listed (the token-preservation
  // stripper matches areaNames without word boundaries).
  areaNames: [
    "Quinta de Santo António", "Bairro do Hospital", "Praia Cruz",
    "Boa Morte", "Bela Vista", "Madre Deus", "Riboque", "Pantufo", "Chácara",
  ],

  // Spaces escaped to \s+ (free-spacing mode ignores literal spaces).
  regionPattern: `(?<state>${DISTRICTS.map((p) => p.replace(/ /g, "\\s+")).join("|")})`,

  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Ap|Bloco|Bl|Andar|Prédio|Predio|Casa|Moradia)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*\\.?\\s*[ºªo]|R/C|RC))\\s*(?<sec_unit_type_2>andar)?)",
  secUnitDisplayMap: {
    apartamento: "Apartamento", apto: "Apartamento", apt: "Apartamento",
    ap: "Apartamento", bloco: "Bloco", bl: "Bloco", andar: "Andar",
    prédio: "Prédio", predio: "Prédio", casa: "Casa", moradia: "Moradia",
  },
  defaultSecUnitType: "Andar",

  poBoxNames: ["Caixa Postal", "CAIXA POSTAL", "C.P.", "CP"],
  poBoxDisplayMap: {
    "caixa postal": "Caixa Postal", "c.p.": "Caixa Postal", cp: "Caixa Postal",
  },
};

export default stConfig;
