import type { EuCountryConfig } from "../_eu/types";

/**
 * Dominican Republic (DO) address configuration.
 *
 * Order: street TYPE + name FIRST ("Calle El Conde", "Avenida Winston
 *        Churchill"), then the house number AFTER the name, often with a "#" or
 *        "No." marker ("Calle Duarte #15"). `C/` is a very common written form
 *        of "Calle".
 * Type: leads the name (prefix), kept verbatim (Calle / C/, Avenida / Av.,
 *        Autopista, Carretera, Prolongación, Callejón, Marginal).
 * Sector (barrio / ensanche / residencial — Gazcue, Piantini, Naco, Bella Vista,
 *        Zona Colonial): a real neighbourhood with NO output field. It is
 *        CONSUMED and DROPPED via the optional prefix in `postalPattern`, which
 *        fires only when the 5-digit código postal follows.
 * Código postal: 5 digits (INPOSDOM), written BEFORE the city in this model
 *        ("..., Piantini, 10148 Santo Domingo, Distrito Nacional"); usage is
 *        still light, so most street lines carry no code. The city+postcode-last
 *        variant ("Santo Domingo 10210") is a documented limitation (__skip).
 * State: the provincia (31 + Distrito Nacional) follows the city after a comma.
 */

const TYPES = [
  "Prolongación", "Prolongacion", "Autopista", "Carretera", "Callejón",
  "Callejon", "Marginal", "Avenida", "Camino", "Calle",
  // abbreviations / written forms (kept verbatim)
  "Av.", "Av", "C/", "Aut.", "Carr.", "Prol.",
];

// 31 provincias + Distrito Nacional, longest-first, spaces -> \s+.
const STATES = [
  "Distrito Nacional", "Santo Domingo", "San Pedro de Macorís",
  "San Pedro de Macoris", "San José de Ocoa", "San Jose de Ocoa",
  "San Juan", "San Cristóbal", "San Cristobal", "Hermanas Mirabal",
  "Monte Cristi", "Montecristi", "Monte Plata", "Puerto Plata",
  "María Trinidad Sánchez", "Maria Trinidad Sanchez", "Hato Mayor",
  "El Seibo", "El Seybo", "La Altagracia", "La Romana", "La Vega",
  "Santiago Rodríguez", "Santiago Rodriguez", "Santiago", "Valverde",
  "Barahona", "Azua", "Baoruco", "Bahoruco", "Dajabón", "Dajabon",
  "Duarte", "Elías Piña", "Elias Pina", "Espaillat", "Independencia",
  "Pedernales", "Peravia", "Samaná", "Samana", "Sánchez Ramírez",
  "Sanchez Ramirez", "Nagua",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const doConfig: EuCountryConfig = {
  code: "do",
  country: "DO",
  countryNames: ["República Dominicana", "Republica Dominicana", "Rep. Dom.", "DOM", "DO"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered / date street names exist ("Calle 30 de Marzo", "Calle 27 de
  // Febrero"); allow digits in the name and still find the trailing number.
  allowDigitsInName: true,

  // 5-digit CP, before the city. Optional sector drop-prefix (fires only with a
  // CP present; must end in a NON-digit so a numbered street is not eaten).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{5})",
  // Number: optional "#"/"No."/"Nº" marker, digits, optional letter or "-N"
  // suffix; OR "s/n".
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z])|-\\d+|-[A-Za-z])?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "distrito nacional": "Distrito Nacional", "d.n.": "Distrito Nacional",
    dn: "Distrito Nacional", montecristi: "Monte Cristi", bahoruco: "Baoruco",
    dajabon: "Dajabón", samana: "Samaná",
  },

  // Apartamento / Edificio / Suite / Local / Piso / Torre / Residencial.
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Edificio|Edif|Suite|Local|Piso|Nivel|Torre|Residencial|Res)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    apartamento: "Apto", apto: "Apto", apt: "Apto", edificio: "Edif",
    edif: "Edif", suite: "Suite", local: "Local", piso: "Piso", nivel: "Nivel",
    torre: "Torre", residencial: "Residencial", res: "Residencial",
  },

  poBoxNames: ["Apartado Postal", "Apartado"],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
  },
};

export default doConfig;
