import type { EuCountryConfig } from "../_eu/types";

/**
 * Nicaraguan (NI) address configuration.
 *
 * Nicaragua has TWO living address systems:
 *  (1) the dominant DESCRIPTIVE / landmark form ("De la iglesia El Carmen, 2
 *      cuadras al norte, 1 abajo, casa color verde") -- reckoned from a known
 *      reference point with cardinal directions and block counts. It is NOT
 *      modellable by a structured street grammar and is marked `__skip`.
 *  (2) a STRUCTURED minority form ("Calle <Name>, Barrio <X>, <Ciudad>,
 *      <Departamento>") that this config models.
 *
 * Order: the vía TYPE + name leads ("Calle Central", "Avenida Bolívar"); most
 *        streets are BARE names, so the type is optional. A civic number is
 *        essentially unused; when written it carries a "No."/"#" marker.
 * Barrio / Reparto: the neighbourhood unit; CONSUMED and DROPPED (it has no
 *        output field) via a `(?<drop>...)` inside `secUnitPattern`.
 * Postcode: Nicaragua has a 5-digit code system (Correos de Nicaragua) but it is
 *        almost never written; addresses carry NONE. Modelled as `after-city`
 *        with the departamento as the trailing region.
 * State: the departamento (15 + 2 autonomous Caribbean regions), the last comma
 *        segment after the city. `countyPattern` is restricted to that list so
 *        the country name ("Nicaragua") is never captured as the region.
 */

// 15 departamentos + 2 autonomous Caribbean regions, longest-first, spaces -> \s+.
const STATES = [
  "Costa Caribe Norte", "Costa Caribe Sur", "Región Autónoma de la Costa Caribe Norte",
  "Región Autónoma de la Costa Caribe Sur", "Nueva Segovia", "Río San Juan",
  "RACCN", "RACCS", "Chinandega", "Chontales", "Matagalpa", "Jinotega",
  "Managua", "Masaya", "Granada", "Carazo", "Estelí", "Esteli", "Madriz",
  "Boaco", "León", "Leon", "Rivas", "Madríz",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

const TYPES = [
  "Carretera", "Avenida", "Callejón", "Callejon", "Rotonda", "Pista", "Paseo",
  "Camino", "Calle",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Cra.", "Ctra.",
];

export const niConfig: EuCountryConfig = {
  code: "ni",
  country: "NI",
  countryNames: ["Nicaragua", "NIC", "NI"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // No postcode is written in practice; the pattern exists only so the
  // after-city grammar compiles. When absent, the postcode-less place branch
  // (city + departamento) is used.
  postalPattern: "(?<postal_code>\\d{5})",
  // Civic number (rare): optional "No."/"Nº"/"#" marker + digits, or "s/n".
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  // Departamento captured after the city; restricted to the real region list so
  // a trailing country name is not mistaken for the region.
  countyPattern: `(?:${REGION_ALT})`,
  regionMap: {
    esteli: "Estelí", leon: "León", "madriz": "Madriz",
    raccn: "Costa Caribe Norte", raccs: "Costa Caribe Sur",
    "región autónoma de la costa caribe norte": "Costa Caribe Norte",
    "región autónoma de la costa caribe sur": "Costa Caribe Sur",
  },

  // Barrio / Reparto / Residencial neighbourhood, consumed and dropped.
  secUnitPattern:
    "(?<drop>(?:Barrio|Bo\\.?|Reparto|Repto\\.?|Residencial|Resid\\.?|Res\\.?|Colonia|Col\\.?|Anexo)\\s+[^,\\n]+)",

  poBoxNames: ["Apartado Postal", "Apartado", "Apdo."],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
    "apdo.": "Apartado Postal",
  },
};

export default niConfig;
