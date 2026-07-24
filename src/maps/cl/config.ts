import type { EuCountryConfig } from "../_eu/types";

/**
 * Chilean (CL) address configuration.
 *
 * Order: street TYPE + name FIRST, then the house number AFTER the name, usually
 *        with NO comma ("Avenida Providencia 1234", "Agustinas 1022"). The type
 *        is frequently OMITTED (bare name) — Chile writes many streets with no
 *        vía word at all.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., Pje.,
 *        Cno.).
 * Piso / Departamento / Oficina trail the number as a secondary unit.
 * Código Postal: 7 digits, written BEFORE the comuna, but VERY OFTEN OMITTED —
 *        Chilean everyday/business mail routes on comuna + región alone.
 * Place tail: comuna (→ city) then región (→ state). The big-city name
 *        "Santiago" is accepted in the región slot and mapped to Región
 *        Metropolitana, so "..., Las Condes, Santiago" parses (comuna Las Condes,
 *        región RM).
 */

const TYPES = [
  // multiword first
  "Gran Avenida",
  // full words
  "Avenida", "Pasaje", "Callejón", "Camino", "Costanera", "Diagonal",
  "Autopista", "Rotonda", "Subida", "Bajada", "Peatonal", "Calle", "Ruta",
  "Vía",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Avda.", "Pje.", "Psje.", "Pasje.", "Cjon.", "Cno.", "Diag.",
];

// 16 region NAME forms (the leading "Región de / del" is stripped by the
// regionPattern prefix, so only the bare names are listed here), + common
// spellings/short forms, longest-first (spaces -> \s+ in free-spacing mode).
// "Santiago" is a big-city proxy for the Región Metropolitana.
const STATES = [
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena",
  "Libertador General Bernardo O'Higgins", "Metropolitana de Santiago",
  "Arica y Parinacota", "La Araucanía", "La Araucania", "Metropolitana",
  "Antofagasta", "Valparaíso", "Valparaiso", "Magallanes", "Tarapacá",
  "Tarapaca", "Atacama", "Coquimbo", "O'Higgins", "OHiggins", "Araucanía",
  "Araucania", "Los Ríos", "Los Rios", "Los Lagos", "Aysén", "Aysen", "Maule",
  "Ñuble", "Nuble", "Biobío", "Bío-Bío", "Bio-Bio", "Biobio", "Santiago",
  "R.M.", "RM",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const clConfig: EuCountryConfig = {
  code: "cl",
  country: "CL",
  countryNames: ["Chile", "CHL", "CL"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered street names exist ("Pasaje 5", "Calle Uno" numbers), so digits are
  // allowed in the name and the trailing house number is still the last number.
  allowDigitsInName: true,

  // 7-digit CP, OPTIONAL, written before the comuna. The optional drop-prefix
  // eats one preceding sector/villa segment when a CP is present (it must end in
  // a NON-digit so a numbered street is never eaten). "C.P."/"Código Postal"
  // lead-in tolerated.
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?:C\\.?\\s*P\\.?\\s*|Código\\s+Postal\\s*|Codigo\\s+Postal\\s*)?(?<postal_code>\\d{7})",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional glued/spaced
  // letter suffix; OR "s/n" (sin número).
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  // A leading "Región de / del / de la" is consumed (not captured); the bare
  // region name is captured and canonicalised via regionMap.
  regionPattern: `(?:Regi[oó]n\\s+(?:de\\s+la\\s+|de\\s+|del\\s+)?)?(?<state>${REGION_ALT})`,
  regionMap: {
    santiago: "Región Metropolitana", rm: "Región Metropolitana",
    "r.m.": "Región Metropolitana", metropolitana: "Región Metropolitana",
    "metropolitana de santiago": "Región Metropolitana",
    valparaiso: "Valparaíso", tarapaca: "Tarapacá",
    araucania: "La Araucanía", "la araucania": "La Araucanía",
    "araucanía": "La Araucanía",
    "libertador general bernardo o'higgins": "O'Higgins",
    ohiggins: "O'Higgins", "los rios": "Los Ríos", nuble: "Ñuble",
    "bío-bío": "Biobío", "bio-bio": "Biobío", biobio: "Biobío",
    aysen: "Aysén",
    "aysén del general carlos ibáñez del campo": "Aysén",
    "magallanes y de la antártica chilena": "Magallanes",
  },

  // Piso / Departamento / Oficina / Local / Casa / Torre / Block.
  secUnitPattern:
    "(?:(?<sec_unit_type>Departamento|Depto|Dpto|Dto|Oficina|Ofic|Of|Piso|Local|Loc|Casa|Torre|Block|Bloque|Blq)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    departamento: "Depto", depto: "Depto", dpto: "Depto", dto: "Depto",
    oficina: "Of", ofic: "Of", of: "Of", piso: "Piso", local: "Local",
    loc: "Local", casa: "Casa", torre: "Torre", block: "Block",
    bloque: "Block", blq: "Block",
  },

  poBoxNames: ["Casilla de Correo", "Casilla"],
  poBoxDisplayMap: {
    "casilla de correo": "Casilla", casilla: "Casilla",
  },
};

export default clConfig;
