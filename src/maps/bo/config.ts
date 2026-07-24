import type { EuCountryConfig } from "../_eu/types";

/**
 * Bolivian (BO) address configuration.
 *
 * Order: street TYPE + name FIRST ("Calle Comercio 1290", "Avenida 6 de Agosto
 *        2170"), then the house number AFTER the name, usually with NO comma. A
 *        "N°"/"Nro." marker may precede the number. Several central streets are
 *        numbers/dates ("6 de Agosto", "16 de Julio"), so digits are allowed in
 *        the name.
 * Type: leads the name (prefix), verbatim incl. abbreviations (Av., C., Pje.).
 *        Particles ("de", "de la") stay with the name.
 * Piso / Departamento / Oficina / Local trail the number as a secondary unit.
 * CP: Bolivia has NO operational postal-code system — Correos de Bolivia routes
 *        on city + departamento, and PO boxes use "Casilla". A `postal_code` is
 *        therefore NOT modelled (never-match sentinel); the few aspirational
 *        4-digit tables ("LP 0001") are not used on real mail and are not parsed.
 * Zona: La Paz addresses often carry a "Zona ..." barrio; because the barrio-drop
 *        in this family is gated on a CP (which BO lacks), a separate "Zona ..."
 *        routing segment cannot be dropped and such forms are out-of-scope
 *        (see __skip samples).
 * Place tail: ciudad (→ city) then departamento (→ state).
 */

const TYPES = [
  // full words
  "Prolongación", "Prolongacion", "Avenida", "Pasaje", "Plazuela", "Plaza",
  "Camino", "Callejón", "Callejon", "Calle",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Avda.", "Pje.", "C.", "Cjon.", "Prol.",
];

// 9 departamentos, longest-first (spaces -> \s+ in free-spacing mode).
const STATES = [
  "Santa Cruz", "Cochabamba", "Chuquisaca", "La Paz", "Potosí", "Potosi",
  "Tarija", "Oruro", "Pando", "El Beni", "Beni",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const boConfig: EuCountryConfig = {
  code: "bo",
  country: "BO",
  countryNames: ["Bolivia", "Estado Plurinacional de Bolivia", "BOL", "BO"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names exist ("6 de Agosto", "16 de Julio", "20 de
  // Octubre"); allow digits in the name and still find the trailing number.
  allowDigitsInName: true,

  // Bolivia has no operational postal code: a never-match sentinel keeps the
  // (optional) place-tail CP slot empty, so "Calle ... , City, Departamento"
  // parses with no postal_code and the place-only rule never fires.
  postalPattern: "(?<postal_code>(?!x)x)",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional letter suffix;
  // OR "s/n" (sin número).
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    potosi: "Potosí", "el beni": "Beni",
  },

  // Piso / Departamento / Oficina / Local / Casa.
  secUnitPattern:
    "(?:(?<sec_unit_type>Departamento|Depto|Dpto|Dto|Piso|Oficina|Ofic|Of|Local|Casa)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    departamento: "Depto", depto: "Depto", dpto: "Depto", dto: "Depto",
    piso: "Piso", oficina: "Of", ofic: "Of", of: "Of", local: "Local",
    casa: "Casa",
  },

  poBoxNames: ["Casilla de Correo", "Casilla Postal", "Casilla"],
  poBoxDisplayMap: {
    "casilla de correo": "Casilla", "casilla postal": "Casilla",
    casilla: "Casilla",
  },
};

export default boConfig;
