import type { EuCountryConfig } from "../_eu/types";

/**
 * Venezuelan (VE) address configuration.
 *
 * Order: street TYPE + name FIRST ("Avenida Urdaneta 45", "Calle 12 15"), then
 *        the house number AFTER the name. Many streets ARE numbers ("Calle 12",
 *        "Avenida 4"), so digits are allowed in the name.
 * Type: leads the name (prefix), verbatim incl. abbreviations (Av., Cl.).
 *        Particles ("de", "El") stay with the name.
 * Building-heavy addresses ("Avenida Francisco de Miranda, Torre Delta, Piso 5,
 *        Oficina 5-A, Urbanización Los Palos Grandes, ...") stack an edificio /
 *        quinta / torre with several units and are the DOMINANT urban form in
 *        Venezuela; the single-street grammar captures at most ONE unit, so those
 *        stacked forms are documented as out-of-scope (see __skip samples). A
 *        single Edificio / Quinta / Casa is captured as the secondary unit.
 * CP: 4 numeric digits ("1010"), optionally a hyphen + letter ("1010-A"), from
 *        IPOSTEL. Real Venezuelan mail writes it AFTER the city ("Caracas 1010,
 *        Miranda"); this config follows the LatAm sibling before-city order
 *        ("1010 Caracas, Miranda") and treats the trailing-CP form as a
 *        limitation (postal adoption is low, so the CP is frequently omitted).
 * Place tail: ciudad (→ city) then estado (→ state). Caracas' central parishes
 *        sit in the Distrito Capital (no estado of their own).
 */

const TYPES = [
  // full words
  "Prolongación", "Prolongacion", "Avenida", "Autopista", "Transversal",
  "Callejón", "Callejon", "Carrera", "Bulevar", "Pasaje", "Vereda", "Calle",
  "Vía", "Via", "Redoma",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Cl.", "Cra.", "Tvsal.", "Pje.", "Prol.",
];

// 23 estados + Distrito Capital + Dependencias Federales, longest-first.
const STATES = [
  "Dependencias Federales", "Distrito Capital", "Distrito Federal",
  "Delta Amacuro", "Nueva Esparta", "Anzoátegui", "Anzoategui", "Portuguesa",
  "Carabobo", "Cojedes", "La Guaira", "Monagas", "Trujillo", "Yaracuy",
  "Amazonas", "Barinas", "Bolívar", "Bolivar", "Falcón", "Falcon", "Guárico",
  "Guarico", "Miranda", "Táchira", "Tachira", "Aragua", "Mérida", "Merida",
  "Vargas", "Sucre", "Apure", "Lara", "Zulia",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const veConfig: EuCountryConfig = {
  code: "ve",
  country: "VE",
  countryNames: ["Venezuela", "República Bolivariana de Venezuela", "VEN", "VE"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered streets are the norm in Maracaibo/Zulia ("Calle 72", "Avenida 4");
  // allow digits in the name and still find the trailing house number.
  allowDigitsInName: true,

  // 4-digit CP with an optional "-letter" ("1010", "1010-A"), before the city.
  // Optional urbanización/sector drop-prefix (fires when a CP is present; must
  // end in a NON-digit so a numbered street is never eaten).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?:CP\\s*)?(?<postal_code>\\d{4}(?:-[A-Za-z])?)",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional letter suffix;
  // OR "s/n" (sin número).
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "distrito federal": "Distrito Capital", vargas: "La Guaira",
    anzoategui: "Anzoátegui", bolivar: "Bolívar", falcon: "Falcón",
    guarico: "Guárico", tachira: "Táchira", merida: "Mérida",
  },

  // A single Piso / Apartamento / Oficina / Local / Nivel, or a single
  // Edificio / Quinta / Casa / Torre named building captured as the unit.
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Ap|Piso|Oficina|Ofic|Of|Local|Nivel|Edificio|Edif|Quinta|Qta|Casa|Torre)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    apartamento: "Apto", apto: "Apto", apt: "Apto", ap: "Apto", piso: "Piso",
    oficina: "Of", ofic: "Of", of: "Of", local: "Local", nivel: "Nivel",
    edificio: "Edif", edif: "Edif", quinta: "Qta", qta: "Qta", casa: "Casa",
    torre: "Torre",
  },

  poBoxNames: ["Apartado Postal", "Apartado"],
  poBoxDisplayMap: {
    "apartado postal": "Apartado", apartado: "Apartado",
  },
};

export default veConfig;
