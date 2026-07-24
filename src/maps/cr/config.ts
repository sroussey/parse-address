import type { EuCountryConfig } from "../_eu/types";

/**
 * Costa Rican (CR) address configuration.
 *
 * Costa Rica has TWO living address systems:
 *  (1) the old DESCRIPTIVE / landmark form ("Del parque central, 200 metros
 *      norte y 50 este, casa amarilla") -- still dominant, and NOT modellable by
 *      a structured street grammar: these are marked `__skip`.
 *  (2) the newer STRUCTURED grid form promoted by Correos de Costa Rica:
 *      "Avenida N, Calle N, distrito, cantón, provincia, código postal".
 * This config models (2).
 *
 * Order: the vía TYPE + name leads ("Avenida Central", "Avenida 2", "Calle 5",
 *        "Paseo Colón"). The cross grid reference ("Calle 5" after an avenida, or
 *        "Avenida 2" after a calle) is captured as a SECONDARY UNIT.
 * Type: prefix (Avenida / Av., Calle / C., Paseo, Boulevard, Autopista,
 *        Carretera, Diagonal, Vía, Transversal), verbatim. Grid names ARE numbers
 *        ("Avenida 2"), so digits are allowed in the name.
 * Distrito: the neighbourhood-level unit; CONSUMED and DROPPED via the
 *        postalPattern drop-prefix (fires only when the 5-digit código postal is
 *        present). Cantón -> `city`; provincia (7) -> `state`.
 * Código postal: 5 digits (provincia|cantón|distrito). Officially written on the
 *        province line; this model writes it BEFORE the cantón. Frequently
 *        omitted (the descriptive form carries none).
 */

const TYPES = [
  "Transversal", "Autopista", "Boulevard", "Bulevar", "Carretera", "Diagonal",
  "Avenida", "Paseo", "Calle", "Vía", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "C.",
];

// 7 provincias, longest-first, spaces -> \s+.
const STATES = [
  "San José", "San Jose", "Puntarenas", "Guanacaste", "Alajuela", "Cartago",
  "Heredia", "Limón", "Limon",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const crConfig: EuCountryConfig = {
  code: "cr",
  country: "CR",
  countryNames: ["Costa Rica", "COSTA RICA", "CRI", "CR"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // 5-digit CP, before the cantón. Optional distrito drop-prefix (fires only
  // with the CP present; must end in a NON-digit so a numbered grid name is not
  // eaten).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{5})",
  // Civic numbers are essentially unused (the grid + landmark systems replace
  // them); a written one needs a "No."/"#" marker so a bare 5-digit CP that
  // follows the street is never mis-read as a house number. "s/n" accepted.
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "san jose": "San José", limon: "Limón",
  },

  // Cross grid reference (Calle/Avenida) OR an interior unit. The cross word is
  // ALSO a street type; here it sits AFTER the primary vía as the second grid
  // coordinate ("Avenida Central, Calle 5" -> unit Calle 5).
  secUnitPattern:
    "(?:(?<sec_unit_type>Calle|Avenida|Av|Diagonal|Apartamento|Apto|Casa|Local|Oficina|Ofic|Of|Piso|Edificio|Edif)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    calle: "Calle", avenida: "Avenida", av: "Avenida", diagonal: "Diagonal",
    apartamento: "Apto", apto: "Apto", casa: "Casa", local: "Local",
    oficina: "Of", ofic: "Of", of: "Of", piso: "Piso", edificio: "Edif",
    edif: "Edif",
  },

  poBoxNames: ["Apartado Postal", "Apartado", "Apdo."],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
    "apdo.": "Apartado Postal",
  },
};

export default crConfig;
