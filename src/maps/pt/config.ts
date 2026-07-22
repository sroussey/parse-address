import type { EuCountryConfig } from "../_eu/types";

/**
 * Portuguese (PT) address configuration. The thoroughfare type leads
 * ("Rua Augusta"), then the name (keeping particles de/da/do), then the house
 * number, optionally followed by a floor+side unit ("3º Esq", "R/C"). The
 * postcode is "PPPP-PPP", before the locality; no region line.
 */

const TYPES = [
  "Estrada Nacional", "Avenida", "Travessa", "Praceta", "Alameda", "Calçada",
  "Estrada", "Largo", "Praça", "Beco", "Rua",
  // abbreviations (verbatim)
  "Av", "Tv", "Pç", "Cç", "Al", "R",
];

export const ptConfig: EuCountryConfig = {
  code: "pt",
  country: "PT",
  countryNames: ["Portugal", "PRT", "PT"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names are common ("5 de Outubro", "25 de Abril").
  allowDigitsInName: true,

  postalPattern: "(?<postal_code>\\d{4}-\\d{3})",
  // Optional "nº" marker, the number, and an optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº)\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Floor(+side) unit: "3º Esq", "1º", "R/C" -> Andar.
  secUnitPattern:
    "(?<sec_unit_num_2>(?:\\d+\\s*\\.?\\s*[ºªo]|R/C|RC|r/c)" +
    "(?:\\s+(?:Esq\\.?|Dto\\.?|Dta\\.?|Dir\\.?|Frt\\.?|Frente|Esquerdo|Direito|Trás|Tras))?)",
  defaultSecUnitType: "Andar",
};

export default ptConfig;
