import type { EuCountryConfig } from "../_eu/types";

/**
 * Paraguay (PY) address configuration.
 *
 * Order: street name FIRST with an optional leading vía type (Iberian/LatAm
 *        prefix), then the house number AFTER it ("Avenida Mariscal López 1234",
 *        "Palma 145"). A "N°"/"Nro." marker may precede the number. Many Asunción
 *        streets are BARE names ("Palma", "Estrella", "Chile") and several are
 *        dates/numbers, so digits are allowed inside the name.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., Avda.,
 *        Pje.). Bare-name streets carry no type word.
 * Piso / Departamento follow the number ("Piso 3", "Dpto 2").
 * Barrio: the neighbourhood is written between the street and the CP line
 *        ("..., Barrio Las Mercedes, 1425 Asunción"); it is a routing unit with
 *        no output field, so it is CONSUMED and DROPPED via the optional prefix
 *        baked into `postalPattern` -- which fires ONLY when a CP is present. A
 *        barrio with no CP ("..., Barrio San Roque, Asunción") is a dependent
 *        locality the shared grammar cannot drop (marked __skip).
 * CP: 4 numeric digits ("1209"), written BEFORE the locality (Correo Paraguayo /
 *        UPU S42 order). Optional and, in practice, rarely written.
 * Place tail: ciudad (→ city) then departamento (→ state). Asunción (the capital
 *        district) is written as the city and has no departamento.
 */

const TYPES = [
  // full words
  "Autopista", "Costanera", "Continuación", "Continuacion", "Avenida",
  "Boulevard", "Bulevar", "Peatonal", "Diagonal", "Callejón", "Callejon",
  "Pasaje", "Camino", "Ruta", "Calle",
  // abbreviations (kept verbatim)
  "Avda.", "Av.", "Av", "Bvar.", "Blvr.", "Cno.", "Pje.", "Diag.", "Cont.",
];

// 17 departamentos, with accented and plain spellings, longest-first.
const STATES = [
  "Presidente Hayes", "Alto Paraguay", "Alto Paraná", "Alto Parana",
  "Concepción", "Concepcion", "San Pedro", "Cordillera", "Guairá", "Guaira",
  "Caaguazú", "Caaguazu", "Caazapá", "Caazapa", "Itapúa", "Itapua", "Misiones",
  "Paraguarí", "Paraguari", "Ñeembucú", "Neembucú", "Neembucu", "Amambay",
  "Canindeyú", "Canindeyu", "Boquerón", "Boqueron", "Central",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const pyConfig: EuCountryConfig = {
  code: "py",
  country: "PY",
  countryNames: ["Paraguay", "República del Paraguay", "PRY", "PY"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // 4-digit CP, before the locality. Optional barrio drop-prefix (fires only
  // when a CP is present; the dropped segment must be non-numeric so a numbered
  // street is never eaten). "CP" lead-in tolerated.
  postalPattern:
    "(?:(?<drop>[^,\\d\\n]+?)\\s*,\\s*)?(?:C\\.?P\\.?\\s*)?(?<postal_code>\\d{4})",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional letter suffix;
  // OR "s/n" (sin número).
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "alto parana": "Alto Paraná", concepcion: "Concepción", guaira: "Guairá",
    caaguazu: "Caaguazú", caazapa: "Caazapá", itapua: "Itapúa",
    paraguari: "Paraguarí", "neembucu": "Ñeembucú", "neembucú": "Ñeembucú",
    canindeyu: "Canindeyú", boqueron: "Boquerón",
  },

  // Piso / Departamento / Oficina / Local / Bloque / Torre / Casa / Edificio,
  // or a bare ordinal floor "3°" whose implied type is Piso.
  secUnitPattern:
    "(?:(?<sec_unit_type>Departamento|Depto|Dpto|Dto|Piso|Oficina|Ofic|Of|Local|Unidad|Bloque|Block|Torre|Casa|Edificio|Edif)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*[°ºoª])(?:\\s*-?\\s*[A-Za-z](?![A-Za-z]))?))",
  secUnitDisplayMap: {
    departamento: "Depto", depto: "Depto", dpto: "Depto", dto: "Depto",
    piso: "Piso", oficina: "Of", ofic: "Of", of: "Of", local: "Local",
    unidad: "Unidad", bloque: "Bloque", block: "Bloque", torre: "Torre",
    casa: "Casa", edificio: "Edif", edif: "Edif",
  },
  defaultSecUnitType: "Piso",

  poBoxNames: ["Casilla de Correo", "Casilla", "C.C."],
  poBoxDisplayMap: {
    "casilla de correo": "Casilla de Correo", casilla: "Casilla de Correo",
    "c.c.": "Casilla de Correo",
  },
};

export default pyConfig;
