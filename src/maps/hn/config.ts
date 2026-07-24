import type { EuCountryConfig } from "../_eu/types";

/**
 * Honduran (HN) address configuration.
 *
 * Order: street TYPE + name FIRST ("Avenida República de Chile", "Calle La
 *        Fuente", "Bulevar Morazán"), then the identifier. The house point is
 *        usually a "Casa <N>" (or "Bloque"/"Apto") captured as a SECONDARY UNIT
 *        rather than a bare civic number; a numbered form ("No. 5") is optional.
 * Type: leads the name (prefix), verbatim (Avenida / Av., Calle, Bulevar /
 *        Boulevard, Calzada, Callejón, Carretera). Many streets are bare names.
 * Colonia / Barrio / Residencial: the neighbourhood routing unit. Honduran
 *        addresses often WRITE it first ("Col. Palmira, Ave. República de Chile,
 *        ..."); the shared grammar drops it only in the PRE-CITY position (like
 *        the sibling GT/CR/PA/DO configs), so it is CONSUMED and DROPPED via the
 *        `(?<drop>...)` prefix in `postalPattern` -- which fires only when the
 *        5-digit código postal is present. The colonia-LEADING written order is
 *        a documented limitation (`__skip`).
 * Postcode: 5 digits (Honducor; first digit = departamento). Optional and
 *        lightly used. Written BEFORE the city in this model.
 * State: the departamento (18) follows the city after a comma.
 */

const TYPES = [
  "Prolongación", "Prolongacion", "Boulevard", "Bulevar", "Carretera",
  "Calzada", "Callejón", "Callejon", "Avenida", "Camino", "Calle", "Paseo",
  // abbreviations (kept verbatim)
  "Ave.", "Av.", "Av", "Blvd.", "Bulv.", "Calz.",
];

// 18 departamentos, longest-first, spaces -> \s+.
const STATES = [
  "Francisco Morazán", "Francisco Morazan", "Gracias a Dios",
  "Islas de la Bahía", "Islas de la Bahia", "Santa Bárbara", "Santa Barbara",
  "El Paraíso", "El Paraiso", "La Paz", "Atlántida", "Atlantida", "Comayagua",
  "Choluteca", "Copán", "Copan", "Cortés", "Cortes", "Intibucá", "Intibuca",
  "Ocotepeque", "Lempira", "Olancho", "Colón", "Colon", "Valle", "Yoro",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const hnConfig: EuCountryConfig = {
  code: "hn",
  country: "HN",
  countryNames: ["Honduras", "HND", "HN"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // 5-digit CP, before the city. Optional colonia/barrio drop-prefix (fires only
  // with the CP present; must end in a NON-digit so a numbered street is not
  // eaten by the anchored place-only rule).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{5})",
  // Civic number (when present): optional "No."/"Nº"/"#" marker + digits, or
  // "s/n". The primary identifier is usually the "Casa <N>" secondary unit.
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "francisco morazan": "Francisco Morazán", cortes: "Cortés",
    copan: "Copán", colon: "Colón", atlantida: "Atlántida",
    intibuca: "Intibucá", "el paraiso": "El Paraíso",
    "santa barbara": "Santa Bárbara", "islas de la bahia": "Islas de la Bahía",
  },

  // Casa / Apartamento / Bloque / Local / Piso, captured as a secondary unit.
  secUnitPattern:
    "(?:(?<sec_unit_type>Casa|Apartamento|Apto|Apt|Bloque|Blq|Local|Piso|Nivel|Edificio|Edif|Torre)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    casa: "Casa", apartamento: "Apto", apto: "Apto", apt: "Apto",
    bloque: "Bloque", blq: "Bloque", local: "Local", piso: "Piso",
    nivel: "Nivel", edificio: "Edif", edif: "Edif", torre: "Torre",
  },

  poBoxNames: ["Apartado Postal", "Apartado", "Apdo."],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
    "apdo.": "Apartado Postal",
  },
};

export default hnConfig;
