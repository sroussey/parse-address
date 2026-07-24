import type { EuCountryConfig } from "../_eu/types";

/**
 * Ecuadorian (EC) address configuration.
 *
 * Order: street TYPE + name FIRST ("Avenida Amazonas 2345", "Calle Rocafuerte
 *        812"), then the house number AFTER the name. A "N°"/"Nro." marker may
 *        precede the number. Coastal cities (Guayaquil) use plain house numbers;
 *        Quito's odonym numbering ("Av. Amazonas N23-45 y Veintimilla", where
 *        "N23-45" is the metric placa and "y Veintimilla" is the CROSS STREET) is
 *        NOT expressible in the single-street grammar and is documented as
 *        out-of-scope (see research notes / __skip samples).
 * Type: leads the name (prefix), verbatim incl. abbreviations (Av., Pje.).
 *        Particles ("de", "de los") stay with the name.
 * Piso / Departamento / Oficina / Local trail the number as a secondary unit.
 * Ciudadela / Urbanización (a named housing estate) often sits between the street
 *        and the city; it is CONSUMED and DROPPED via the postalPattern
 *        drop-prefix (fires when a CP follows).
 * CP: 6 numeric digits ("170515"), format PPCCDD (province, cantón, zona),
 *        introduced 2007 by Correos del Ecuador. Written BEFORE the city.
 * Place tail: ciudad/cantón (→ city) then provincia (→ state).
 */

const TYPES = [
  // full words
  "Prolongación", "Prolongacion", "Avenida", "Autopista", "Malecón", "Malecon",
  "Callejón", "Callejon", "Pasaje", "Camino", "Calle", "Vía", "Via",
  "Redondel", "Peatonal",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Pje.", "Cjon.", "Prol.", "Malec.",
];

// 24 provincias, longest-first (spaces -> \s+ in free-spacing mode).
const STATES = [
  "Santo Domingo de los Tsáchilas", "Santo Domingo de los Tsachilas",
  "Zamora Chinchipe", "Morona Santiago", "Santa Elena", "Esmeraldas",
  "Chimborazo", "Tungurahua", "Sucumbíos", "Sucumbios", "Galápagos",
  "Galapagos", "Imbabura", "Cotopaxi", "Orellana", "Pastaza", "Bolívar",
  "Bolivar", "Pichincha", "Los Ríos", "Los Rios", "Manabí", "Manabi", "El Oro",
  "Guayas", "Carchi", "Cañar", "Canar", "Azuay", "Napo", "Loja",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const ecConfig: EuCountryConfig = {
  code: "ec",
  country: "EC",
  countryNames: ["Ecuador", "República del Ecuador", "ECU", "EC"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered / date street names exist ("Calle 10 de Agosto", "Av. 9 de
  // Octubre"); allow digits in the name and still find the trailing number.
  allowDigitsInName: true,

  // 6-digit CP, before the city. Optional ciudadela/urbanización drop-prefix
  // (fires when a CP is present; must end in a NON-digit so a numbered street is
  // never eaten). "CP"/"EC" lead-in tolerated.
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?:(?:CP|EC)\\s*)?(?<postal_code>\\d{6})",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional letter suffix;
  // OR "s/n" (sin número).
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    bolivar: "Bolívar", "los rios": "Los Ríos", manabi: "Manabí",
    canar: "Cañar", galapagos: "Galápagos", sucumbios: "Sucumbíos",
    "santo domingo de los tsachilas": "Santo Domingo de los Tsáchilas",
  },

  // Piso / Departamento / Oficina / Local / Bloque / Suite.
  secUnitPattern:
    "(?:(?<sec_unit_type>Departamento|Depto|Dpto|Dpt|Piso|Oficina|Ofic|Of|Local|Bloque|Bl|Suite|Casa)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    departamento: "Depto", depto: "Depto", dpto: "Depto", dpt: "Depto",
    piso: "Piso", oficina: "Of", ofic: "Of", of: "Of", local: "Local",
    bloque: "Bloque", bl: "Bloque", suite: "Suite", casa: "Casa",
  },

  poBoxNames: ["Casilla Postal", "Casilla", "Apartado Postal", "Apartado"],
  poBoxDisplayMap: {
    "casilla postal": "Casilla", casilla: "Casilla",
    "apartado postal": "Casilla", apartado: "Casilla",
  },
};

export default ecConfig;
