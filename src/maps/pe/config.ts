import type { EuCountryConfig } from "../_eu/types";

/**
 * Peruvian (PE) address configuration.
 *
 * Order: street TYPE + name FIRST, then the house number AFTER the name
 *        ("Avenida Arequipa 1234", "Jirón de la Unión 300"). The type is nearly
 *        always present and usually abbreviated (Av., Jr., Ca., Psje.).
 * Type: leads the name (prefix), verbatim. Particles ("de la") stay with name.
 * Dpto / Int / Piso / Oficina trail the number as a secondary unit.
 * Urbanización (Urb.) — a named housing estate — often sits between the street
 *        and the district; it is CONSUMED and DROPPED via the postalPattern
 *        drop-prefix (fires when a CP follows).
 * Código Postal: 5 digits, written BEFORE the district. The legacy Lima-zone
 *        form ("Lima 27") writes a 1-2 digit zone AFTER the city; the before-city
 *        grammar does not capture it (documented limitation) — city = "Lima" and
 *        the trailing zone is dropped.
 * Place tail: distrito (→ city) then departamento/provincia (→ state).
 */

const TYPES = [
  // full words
  "Prolongación", "Prolongacion", "Avenida", "Malecón", "Malecon", "Alameda",
  "Pasaje", "Jirón", "Jiron", "Óvalo", "Ovalo", "Parque", "Plaza", "Calle",
  "Carretera", "Vía", "Via",
  // abbreviations (kept verbatim)
  "Prol.", "Av.", "Av", "Jr.", "Jr", "Ca.", "Cl.", "Psje.", "Pje.", "Pasje.",
  "Mlc.", "Malec.", "Alam.", "Prolong.", "Carr.",
];

// 24 departamentos + Callao + Lima (provincia/departamento), longest-first.
const STATES = [
  "Madre de Dios", "San Martín", "San Martin", "La Libertad", "Amazonas",
  "Ancash", "Áncash", "Apurímac", "Apurimac", "Arequipa", "Ayacucho",
  "Cajamarca", "Cusco", "Cuzco", "Huancavelica", "Huánuco", "Huanuco", "Ica",
  "Junín", "Junin", "Lambayeque", "Loreto", "Moquegua", "Pasco", "Piura",
  "Puno", "Tacna", "Tumbes", "Ucayali", "Callao", "Lima",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const peConfig: EuCountryConfig = {
  code: "pe",
  country: "PE",
  countryNames: ["Perú", "Peru", "PER", "PE"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered street names exist ("Calle 7", "Avenida 28 de Julio"); allow digits
  // in the name and still find the trailing house number.
  allowDigitsInName: true,

  // 5-digit CP (optional), before the district. Optional urbanización/sector
  // drop-prefix (fires when a CP is present; must end in a NON-digit).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{5})",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional letter suffix;
  // OR "s/n" (sin número).
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "san martin": "San Martín", ancash: "Áncash", apurimac: "Apurímac",
    huanuco: "Huánuco", junin: "Junín", cuzco: "Cusco",
  },

  // Departamento / Interior / Piso / Oficina / Manzana / Lote.
  secUnitPattern:
    "(?:(?<sec_unit_type>Departamento|Depto|Dpto|Dpt|Dep|Interior|Int|Piso|Oficina|Ofic|Of|Manzana|Mz|Lote|Lt|Block|Blq)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    departamento: "Dpto", depto: "Dpto", dpto: "Dpto", dpt: "Dpto", dep: "Dpto",
    interior: "Int", int: "Int", piso: "Piso", oficina: "Of", ofic: "Of",
    of: "Of", manzana: "Mz", mz: "Mz", lote: "Lote", lt: "Lote",
    block: "Block", blq: "Block",
  },

  poBoxNames: ["Apartado Postal", "Apartado", "Casilla"],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
    casilla: "Apartado Postal",
  },
};

export default peConfig;
