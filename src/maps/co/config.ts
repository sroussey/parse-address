import type { EuCountryConfig } from "../_eu/types";

/**
 * Colombian (CO) address configuration.
 *
 * Order: vía TYPE + designator FIRST ("Calle 100", "Carrera 13", "Avenida El
 *        Dorado"), then the cross-street block after a "#" ("# 8-60"), then the
 *        city. The vía designator is USUALLY A NUMBER (Calle 100 = 100th street)
 *        but can be a name ("Avenida El Dorado", "Carrera Séptima").
 *
 * The "# 8-60" block (the KEY feature of Colombian nomenclature):
 *   - "8"  = the "generatriz" / cross-street number (here Carrera 8) at which
 *            the property sits.
 *   - "60" = the "placa" — the distance in metres from that intersection to the
 *            door.
 *   These two are read together as one spoken number ("ocho sesenta") and are
 *   the building's actual address number. We therefore model the whole
 *   "8-60" as the `number` field (NOT split into number + civic_number_suffix),
 *   with the "#"/"No."/"N°" marker stripped. This keeps the composite intact and
 *   matches how libpostal / Google tag Colombian house numbers. A trailing
 *   letter on either part ("95A-55", "25G-30") is kept.
 *
 * Type: leads the designator (prefix), verbatim incl. abbreviations (Cra., Cl.,
 *        Dg., Tv., Av.).
 * Apto / Piso / Torre / Oficina / Local / Interior trail as a secondary unit.
 * Postal code: 6 digits (introduced 2011, low adoption — usually OMITTED),
 *        written BEFORE the city on the UPU S42 line. When a code is present the
 *        optional drop-prefix consumes one preceding barrio/localidad segment.
 * Place tail: city (→ city) then departamento (→ state); Bogotá is a Capital
 *        District with no department.
 */

const TYPES = [
  // multiword first (avenida + numbered axis)
  "Avenida Carrera", "Avenida Calle", "Avenida Cra", "Avenida Cll",
  // full words
  "Autopista", "Transversal", "Diagonal", "Carrera", "Avenida", "Circular",
  "Calle", "Vía", "Via",
  // abbreviations (kept verbatim)
  "Autop.", "Trans.", "Transv.", "Tv.", "Diag.", "Dg.", "Cra.", "Cra", "Crra.",
  "Kra.", "Kra", "Cr.", "Kr.", "Av.", "Av", "Cll.", "Cll", "Cl.", "Cl", "Ac.",
  "Ak.", "Dg", "Tv",
];

// 32 departamentos + Bogotá D.C., longest-first (spaces -> \s+).
const STATES = [
  "Archipiélago de San Andrés, Providencia y Santa Catalina",
  "San Andrés y Providencia", "Norte de Santander", "Valle del Cauca",
  "Bogotá D.C.", "Bogotá D. C.", "Cundinamarca", "La Guajira", "Magdalena",
  "Antioquia", "Atlántico", "Santander", "Risaralda", "Casanare", "Putumayo",
  "Amazonas", "Guaviare", "Vaupés", "Vaupes", "Caquetá", "Caqueta", "Córdoba",
  "Cordoba", "Bolívar", "Bolivar", "Boyacá", "Boyaca", "Caldas", "Chocó",
  "Choco", "Nariño", "Narino", "Quindío", "Quindio", "Arauca", "Guainía",
  "Guainia", "Vichada", "Sucre", "Tolima", "Huila", "Cauca", "Cesar", "Meta",
  "D.C.", "D. C.",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const coConfig: EuCountryConfig = {
  code: "co",
  country: "CO",
  countryNames: ["Colombia", "COL", "CO"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // The vía designator is normally a number (Calle 100), so digits are part of
  // the street name; the "# ..." block is the number and is found via the marker.
  allowDigitsInName: true,

  // 6-digit CP (optional, usually absent), before the city. Optional
  // barrio/localidad drop-prefix (fires when a CP is present; must end in a
  // NON-digit so a numbered vía is never eaten).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{6})",
  // The "# generatriz-placa" block. A "#" / "No." / "Nro." / "N°" marker is
  // REQUIRED, then the composite number: generatriz (digits + optional letter),
  // optional "-placa" (digits + optional letter), with an optional trailing
  // cardinal ("Sur"/"Este"/"Norte"/"Oeste"). Captured whole as `number`.
  houseNumberPattern:
    "(?:\\#|No\\.?|Nro\\.?|N[°º]\\.?)\\s*(?<number>\\d+[A-Za-z]?(?:\\s+(?:Sur|Este|Norte|Oeste))?(?:\\s*-\\s*\\d+[A-Za-z]?(?:\\s+(?:Sur|Este|Norte|Oeste))?)?)",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "d.c.": "Bogotá D.C.", "d. c.": "Bogotá D.C.",
    "bogotá d. c.": "Bogotá D.C.", "bogota d.c.": "Bogotá D.C.",
    "valle del cauca": "Valle del Cauca", "norte de santander": "Norte de Santander",
    bolivar: "Bolívar", boyaca: "Boyacá", choco: "Chocó", narino: "Nariño",
    quindio: "Quindío", cordoba: "Córdoba", caqueta: "Caquetá",
    guainia: "Guainía", vaupes: "Vaupés",
    "san andrés y providencia": "San Andrés y Providencia",
  },

  // Apartamento / Piso / Torre / Oficina / Local / Interior / Bloque / Casa.
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apart|Apt|Piso|Torre|Oficina|Ofic|Of|Local|Loc|Interior|Int|Bloque|Bl|Casa)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    apartamento: "Apto", apto: "Apto", apart: "Apto", apt: "Apto",
    piso: "Piso", torre: "Torre", oficina: "Of", ofic: "Of", of: "Of",
    local: "Local", loc: "Local", interior: "Int", int: "Int",
    bloque: "Bloque", bl: "Bloque", casa: "Casa",
  },

  poBoxNames: ["Apartado Aéreo", "Apartado Aereo", "Apartado", "A.A."],
  poBoxDisplayMap: {
    "apartado aéreo": "Apartado Aéreo", "apartado aereo": "Apartado Aéreo",
    apartado: "Apartado Aéreo", "a.a.": "Apartado Aéreo",
  },
};

export default coConfig;
