import type { EuCountryConfig } from "../_eu/types";

/**
 * Angola (AO) address configuration — Portuguese.
 *
 * Order: thoroughfare TYPE + name FIRST ("Rua Amílcar Cabral"), then the house
 *        number AFTER the name, often with a "nº" marker ("Rua Rainha Ginga,
 *        nº 12"). Same grammar family as PT/BR.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., R.,
 *        Lgo.). Particles (de/da/do/dos/das) stay with the name.
 * Bairro / município: a neighbourhood or urban municipality ("Ingombota",
 *        "Maianga", "Talatona") commonly sits between the street and the city;
 *        it is not a routing field, so a RECOGNISED bairro is CONSUMED and
 *        DROPPED (areaNames). Unknown bairros are a documented failure mode.
 * City: usually the provincial capital ("Luanda", "Lubango", "Benguela").
 * Província -> `state`: Angola's provinces (Luanda, Benguela, Huíla, ...) may be
 *        written last; captured to `state`. NB several province names are also
 *        the capital city's name (Luanda, Benguela, Huambo, Namibe, Cabinda) — a
 *        documented city/province collision.
 * Postcode: NONE. Angola does not operate a postcode system (Smarty / Umbrex
 *        confirm mail is descriptive only). Some geodata sets show a 4-digit
 *        "1000"-style pseudo-code for Luanda; that is not a real postal code and
 *        is treated as a documented failure mode, NOT modelled. Sentinel slot.
 * Caixa Postal: PO box, "Caixa Postal 1234" (abbr. "C.P."/"CP"). Common.
 *
 * Sources: Correios de Angola (ENCTA); Smarty / GeoPostcodes AO guides; Umbrex
 * "How to address a letter to Angola" (no postcodes); Wikipedia "Provinces of
 * Angola". See research-ao.md.
 */

const TYPES = [
  "Avenida", "Travessa", "Alameda", "Estrada", "Largo", "Praça", "Beco",
  "Rotunda", "Rua", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Trav.", "Tv.", "Al.", "Estr.", "Lgo.", "Pç.", "Pc.", "R.",
];

// Provinces (state). 18 classic + the 2024 additions and common alt spellings.
// Multi-word first so the alternation prefers the longer match.
const PROVINCES = [
  "Cuando Cubango", "Kuando Kubango", "Cuanza Norte", "Kwanza Norte",
  "Cuanza Sul", "Kwanza Sul", "Lunda Norte", "Lunda Sul", "Icolo e Bengo",
  "Moxico Leste", "Benguela", "Cabinda", "Cunene", "Huambo", "Malanje",
  "Moxico", "Namibe", "Luanda", "Bengo", "Bié", "Huíla", "Uíge", "Zaire",
  "Cuando",
];

export const aoConfig: EuCountryConfig = {
  code: "ao",
  country: "AO",
  countryNames: ["Angola", "AGO", "AO"],

  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names are common ("4 de Fevereiro", "1º de Maio").
  allowDigitsInName: true,

  // No real postcode -> never-match sentinel (the before-city grammar makes the
  // postcode block optional, so it is simply skipped).
  postalPattern: "(?<postal_code>(?!x)x)",

  // Optional "nº"/"n.º" marker, digits (or range), optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|N\\.?º\\.?)\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Recognised Luanda (and a few other) bairros / municípios consumed + dropped.
  areaNames: [
    "Kilamba Kiaxi", "Patrice Lumumba", "Rocha Pinto", "Morro Bento",
    "Bairro Azul", "Cidade Alta", "Nova Vida", "Vila Alice", "São Paulo",
    "Ingombota", "Maculusso", "Sambizanga", "Talatona", "Alvalade",
    "Miramar", "Mutamba", "Cassequel", "Maianga", "Cazenga", "Cacuaco",
    "Kilamba", "Marçal", "Prenda", "Rangel", "Camama", "Benfica", "Golfe",
    "Viana", "Belas", "Samba", "Zango", "Bairro",
  ],

  // Spaces are escaped to \s+ because the grammar runs in free-spacing (x) mode,
  // where a literal space is ignored (would turn "Cuando Cubango" into
  // "CuandoCubango" and never match).
  regionPattern: `(?<state>${PROVINCES.map((p) => p.replace(/ /g, "\\s+")).join("|")})`,

  // Portuguese floor/side unit: "2º andar", "3º Esq", "R/C", or "Apartamento 4".
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Ap|Bloco|Bl|Andar|Prédio|Predio|Casa|Moradia)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*\\.?\\s*[ºªo]|R/C|RC)" +
    "(?:\\s+(?:Esq\\.?|Dto\\.?|Dta\\.?|Dir\\.?|Frt\\.?))?)\\s*(?<sec_unit_type_2>andar|piso)?)",
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

export default aoConfig;
