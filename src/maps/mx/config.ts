import type { EuCountryConfig } from "../_eu/types";

/**
 * Mexican (MX) address configuration.
 *
 * Order: street TYPE + name FIRST ("Avenida Insurgentes Sur"), then the
 *        exterior number AFTER the name ("... Sur 1602"); no comma is required.
 *        An interior number ("Int. 5", "Depto 3") trails as a secondary unit.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., Blvd.,
 *        Calz., Priv., Prol., C.). The type is frequently OMITTED (bare name).
 * Colonia (asentamiento / neighbourhood) sits on its own line before the C.P.
 *        line; it has no output field and is CONSUMED and DROPPED via the
 *        optional prefix in `postalPattern`.
 * C.P.: 5 digits, written BEFORE the city; the estado follows the city after a
 *        comma ("06600 Cuauhtémoc, CDMX", "44360 Guadalajara, Jalisco").
 */

const TYPES = [
  "Prolongación", "Circunvalación", "Boulevard", "Bulevar", "Privada",
  "Calzada", "Diagonal", "Andador", "Circuito", "Cerrada", "Retorno",
  "Carretera", "Callejón", "Corredor", "Peatonal", "Viaducto", "Ampliación",
  "Avenida", "Camino", "Paseo", "Eje", "Calle",
  // abbreviations (kept verbatim)
  "Blvd.", "Blvd", "Calz.", "Priv.", "Prol.", "Cda.", "Cto.", "Ret.",
  "Diag.", "And.", "Carr.", "Av.", "Av", "C.",
];

// 32 federal entities + common abbreviations, longest-first so multi-word names
// (Baja California Sur, Ciudad de México) win over their prefixes. Literal
// spaces are escaped to \s+ because the grammar compiles in free-spacing mode.
const STATES = [
  "Baja California Sur", "Baja California", "San Luis Potosí", "Quintana Roo",
  "Ciudad de México", "Estado de México", "Nuevo León", "Nuevo Leon",
  "Aguascalientes",
  "Guanajuato", "Chihuahua", "Michoacán", "Michoacan", "Tamaulipas",
  "Zacatecas", "Querétaro", "Queretaro", "Campeche", "Coahuila", "Durango",
  "Guerrero", "Hidalgo", "Jalisco", "Morelos", "Nayarit", "Sinaloa", "Sonora",
  "Tabasco", "Tlaxcala", "Veracruz", "Yucatán", "Yucatan", "Chiapas", "Colima",
  "Oaxaca", "Puebla", "México", "Mexico", "CDMX", "Edomex",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const mxConfig: EuCountryConfig = {
  code: "mx",
  country: "MX",
  countryNames: ["México", "Mexico", "Estados Unidos Mexicanos", "MEX", "MX"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered street names are common ("Calle 5 de Mayo", "Eje 1 Norte",
  // "Calle 16 de Septiembre").
  allowDigitsInName: true,

  // C.P. is 5 digits. The optional drop-prefix consumes the single colonia
  // segment that precedes the C.P. line; the dropped segment must end in a
  // NON-digit so a numbered street ("... 1500,") is never eaten by the anchored
  // place-only rule. "C.P."/"CP" lead-in tolerated.
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?:C\\.?\\s*P\\.?\\s*|CP\\s+)?(?<postal_code>\\d{5})",
  // Exterior number: optional "No."/"Núm."/"#" marker, digits, optional letter
  // or "-N" suffix; OR "S/N" (sin número).
  houseNumberPattern:
    "(?:(?:No\\.?|N[úu]m\\.?|N[ºo]\\.?|\\#)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z])|-\\d+|-[A-Za-z])?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    cdmx: "CDMX", "ciudad de méxico": "CDMX", "c.d.m.x.": "CDMX",
    "d.f.": "CDMX", df: "CDMX", "estado de méxico": "México",
    edomex: "México", mexico: "México", méxico: "México",
    "nuevo leon": "Nuevo León", queretaro: "Querétaro", yucatan: "Yucatán",
    michoacan: "Michoacán",
  },

  // Interior unit: "Int. 5", "Depto 3", "Piso 2", "Local 4", "Edif. B".
  secUnitPattern:
    "(?<sec_unit_type>Interior|Int|Departamento|Depto|Dpto|Piso|Local|Loc|Nivel|Edificio|Edif|Manzana|Mz|Lote|Lt)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?",
  secUnitDisplayMap: {
    interior: "Int", int: "Int", departamento: "Depto", depto: "Depto",
    dpto: "Depto", piso: "Piso", local: "Local", loc: "Local",
    nivel: "Nivel", edificio: "Edif", edif: "Edif", manzana: "Mz",
    mz: "Mz", lote: "Lote", lt: "Lote",
  },

  poBoxNames: ["Apartado Postal", "Apdo. Postal", "Apdo Postal", "Apartado"],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", "apdo. postal": "Apartado Postal",
    "apdo postal": "Apartado Postal", apartado: "Apartado Postal",
  },
};

export default mxConfig;
