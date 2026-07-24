import type { EuCountryConfig } from "../_eu/types";

/**
 * Cuban (CU) address configuration.
 *
 * Order: street TYPE + name FIRST, where the name is usually a grid number or
 *        letter ("Calle 23", "Avenida 5ta", "Calle L"), then an optional house
 *        number with a "#"/"No." marker ("Calle 23 #456"), then the
 *        BETWEEN-STREETS reference ("e/ L y M" = entre L y M) captured as a
 *        SECONDARY UNIT. Digits are allowed in the name (the name IS a number).
 * Type: leads the name (prefix), verbatim (Calle / C., Avenida / Ave. / Av.,
 *        Callejón, Carretera, Autopista, Calzada / Calz., Rotonda).
 * Cross-street unit: "e/ A y B" (or "entre A y B", "esq. a X") -- the
 *        characteristic Cuban locator -- is captured as `sec_unit_type` = "e/"
 *        and `sec_unit_num` = "A y B".
 * Reparto / barrio: an optional neighbourhood written after the cross-street and
 *        before the municipio; it has no output field and is CONSUMED and DROPPED
 *        via a lazy `(?<drop>...)` that only fires when the remaining tail still
 *        parses as municipio + provincia (restricted) + CP.
 * Postcode: 5 digits (Correos de Cuba), written LAST after the provincia
 *        ("La Habana 10400"). Optional. Modelled as `after-city`.
 * State: the provincia (15 + the Isla de la Juventud special municipality)
 *        follows the municipio after a comma; `countyPattern` is restricted to
 *        that list so the country name is never captured as the region.
 */

const TYPES = [
  "Carretera", "Autopista", "Callejón", "Callejon", "Avenida", "Calzada",
  "Rotonda", "Calle",
  // abbreviations / written forms (kept verbatim)
  "Ave.", "Av.", "Av", "Calz.", "C.",
];

// 15 provincias + Isla de la Juventud (special municipality), longest-first,
// spaces -> \s+.
const STATES = [
  "Santiago de Cuba", "Isla de la Juventud", "Sancti Spíritus",
  "Sancti Spiritus", "Ciego de Ávila", "Ciego de Avila", "Pinar del Río",
  "Pinar del Rio", "Villa Clara", "Las Tunas", "Guantánamo", "Guantanamo",
  "Cienfuegos", "Camagüey", "Camaguey", "La Habana", "Mayabeque", "Matanzas",
  "Artemisa", "Holguín", "Holguin", "Granma",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const cuConfig: EuCountryConfig = {
  code: "cu",
  country: "CU",
  countryNames: ["Cuba", "CUB", "CU"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // 5-digit CP, LAST (after the provincia). Optional.
  postalPattern: "(?<postal_code>\\d{5})",
  // Optional house number: "#"/"No."/"Nº" marker + digits, or "s/n".
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  // Provincia captured after the municipio; restricted to the real list so a
  // trailing country name is not mistaken for the region.
  countyPattern: `(?:${REGION_ALT})`,
  regionMap: {
    "pinar del rio": "Pinar del Río", "sancti spiritus": "Sancti Spíritus",
    "ciego de avila": "Ciego de Ávila", camaguey: "Camagüey",
    holguin: "Holguín", guantanamo: "Guantánamo",
  },

  // Cross-street "e/ A y B" (entre A y B) captured as a secondary unit, followed
  // by an OPTIONAL, LAZY reparto drop. The lazy drop only fires when leaving it
  // in would break the municipio + provincia(restricted) + CP tail match.
  secUnitPattern:
    "(?:(?<sec_unit_type>esquina|esq\\.?|entre|e/)\\s*(?<sec_unit_num>[^,\\n]+))(?:\\s*,\\s*(?<drop>[^,\\n]+?))??",
  secUnitDisplayMap: {
    "e/": "e/", entre: "e/", esq: "esq", esquina: "esq",
  },

  poBoxNames: ["Apartado Postal", "Apartado", "Apdo."],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
    "apdo.": "Apartado Postal",
  },
};

export default cuConfig;
