import type { EuCountryConfig } from "../_eu/types";

/**
 * Argentine (AR) address configuration.
 *
 * Order: street name FIRST, then the house number ("altura") AFTER it
 *        ("Av. Corrientes 1234", "Florida 234"). A "N°"/"Nro." marker may
 *        precede the number.
 * Type: a leading vía type when present (Av., Pasaje, Diagonal, Bulevar), kept
 *        verbatim; MOST Argentine streets carry NO type word (bare name), and
 *        many streets ARE numbers ("Calle 39"), so digits are allowed in names.
 * Piso + Departamento follow the number ("Piso 3 Dto B", "3° B").
 * CPA: "C1043AAZ" (letter + 4 digits + 3 letters); the legacy 4-digit CP still
 *        appears. Written BEFORE the locality; the provincia follows after a
 *        comma ("S2000EKF Rosario, Santa Fe"). CABA addresses often omit it.
 */

const TYPES = [
  "Autopista", "Colectora", "Costanera", "Diagonal", "Boulevard", "Bulevar",
  "Peatonal", "Pasaje", "Avenida", "Camino", "Calle", "Ruta",
  // abbreviations (kept verbatim)
  "Avda.", "Av.", "Av", "Pje.", "Diag.", "Blvr.", "Blv.", "Bv.", "Cno.",
  "Rta.",
];

// 23 provinces + CABA (with its common spellings), longest-first, spaces -> \s+.
const STATES = [
  "Ciudad Autónoma de Buenos Aires", "Santiago del Estero",
  "Tierra del Fuego", "Provincia de Buenos Aires", "Capital Federal",
  "Buenos Aires", "Entre Ríos", "Corrientes", "Catamarca", "La Pampa",
  "La Rioja", "Río Negro", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Misiones", "Neuquén", "Mendoza", "Tucumán", "Formosa", "Córdoba",
  "Chubut", "Chaco", "Salta", "Jujuy", "CABA",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const arConfig: EuCountryConfig = {
  code: "ar",
  country: "AR",
  countryNames: ["Argentina", "República Argentina", "ARG", "AR"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // CPA (letter+4 digits+3 letters) preferred, else the short "letter+4 digits"
  // form ("B1900"), else the legacy 4-digit CP; optional "CP" lead-in and
  // parentheses "(1425)". Optional barrio drop-prefix (must end in a non-digit
  // so a numbered street is not eaten by the anchored place-only rule).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?:CP\\s*)?\\(?(?<postal_code>[A-Za-z]\\d{4}[A-Za-z]{3}|[A-Za-z]\\d{4}|\\d{4})\\)?",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional "bis"/letter
  // suffix; OR "s/n".
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?bis|\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    caba: "CABA", "capital federal": "CABA",
    "ciudad autónoma de buenos aires": "CABA",
    "provincia de buenos aires": "Buenos Aires",
  },

  // Floor+door: explicit "Piso 3 Dto B" (first unit captured) OR an ordinal
  // floor "3° B" / "PB" whose implied type is Piso.
  secUnitPattern:
    "(?:(?<sec_unit_type>Piso|Departamento|Depto|Dpto|Dto|Local|Oficina|Of|Unidad|Torre)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*[°ºoª]|PB|P\\.?B\\.?)(?:\\s*-?\\s*[A-Za-z](?![A-Za-z]))?))",
  secUnitDisplayMap: {
    piso: "Piso", departamento: "Depto", depto: "Depto", dpto: "Depto",
    dto: "Depto", local: "Local", oficina: "Of", of: "Of", unidad: "Unidad",
    torre: "Torre",
  },
  defaultSecUnitType: "Piso",

  poBoxNames: ["Casilla de Correo", "Casilla", "C.C."],
  poBoxDisplayMap: {
    "casilla de correo": "Casilla de Correo", casilla: "Casilla de Correo",
    "c.c.": "Casilla de Correo",
  },
};

export default arConfig;
