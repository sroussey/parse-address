import type { EuCountryConfig } from "../_eu/types";

/**
 * Uruguayan (UY) address configuration.
 *
 * Order: street name FIRST (with an optional leading vía type), then the house
 *        number AFTER it ("Av. 18 de Julio 1234", "Sarandí 690"). A "N°"/"Nro."
 *        marker may precede the number. Most Montevideo streets are BARE names
 *        (no type word), and several are numbers/dates ("18 de Julio", "8 de
 *        Octubre"), so digits are allowed in the name.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., Bvar.,
 *        Cno., Pje.). Particles ("de", "del") stay with the name.
 * Piso + Apartamento follow the number ("Piso 3, Apto 2", "3°").
 * Barrio (Montevideo neighbourhood) sometimes precedes the CP line; it is a real
 *        routing unit with no output field here, so it is CONSUMED and DROPPED
 *        via the optional prefix baked into `postalPattern` (fires when a CP is
 *        present).
 * CP: 5 numeric digits ("11000"). Correo Uruguayo writes it BEFORE the locality
 *        in the S42 template, though everyday mail often puts it AFTER the city
 *        ("Montevideo 11100"); this config models the before-city order (the LatAm
 *        sibling convention) and treats the trailing-CP form as a limitation.
 * Place tail: localidad (→ city) then departamento (→ state). In Montevideo the
 *        city and the department share the name "Montevideo".
 */

const TYPES = [
  // full words
  "Continuación", "Continuacion", "Avenida", "Boulevard", "Bulevar", "Peatonal",
  "Diagonal", "Pasaje", "Rambla", "Camino", "Calle", "Ruta", "Paso",
  // abbreviations (kept verbatim)
  "Avda.", "Av.", "Av", "Bvar.", "Blvr.", "Bv.", "Cno.", "Pje.", "Pje.",
  "Rbla.", "Cont.", "Rta.",
];

// 19 departamentos, longest-first (spaces -> \s+ in free-spacing mode).
const STATES = [
  "Treinta y Tres", "Cerro Largo", "Río Negro", "Rio Negro", "San José",
  "San Jose", "Montevideo", "Maldonado", "Canelones", "Paysandú", "Paysandu",
  "Tacuarembó", "Tacuarembo", "Lavalleja", "Durazno", "Florida", "Soriano",
  "Artigas", "Colonia", "Rivera", "Flores", "Salto", "Rocha",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const uyConfig: EuCountryConfig = {
  code: "uy",
  country: "UY",
  countryNames: ["Uruguay", "República Oriental del Uruguay", "URY", "UY"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names are common ("18 de Julio", "8 de Octubre",
  // "25 de Mayo"); allow digits in the name and still find the trailing number.
  allowDigitsInName: true,

  // 5-digit CP, before the locality. Optional barrio drop-prefix (fires when a
  // CP is present; the dropped segment must end in a NON-digit so a numbered
  // street is never eaten). "CP" lead-in tolerated.
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?:C\\.?P\\.?\\s*)?(?<postal_code>\\d{5})",
  // Number: optional "N°"/"Nro."/"No." marker, digits, optional letter suffix;
  // OR "s/n" (sin número).
  houseNumberPattern:
    "(?:(?:N[°ºo]\\.?|Nro\\.?|No\\.?)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    "rio negro": "Río Negro", "san jose": "San José",
    paysandu: "Paysandú", tacuarembo: "Tacuarembó",
  },

  // Piso / Apartamento / Oficina / Local / Unidad / Torre, or a bare ordinal
  // floor "3°" whose implied type is Piso.
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Ap|Piso|Oficina|Ofic|Of|Local|Unidad|Torre|Block|Bloque)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*[°ºoª])(?:\\s*-?\\s*[A-Za-z](?![A-Za-z]))?))",
  secUnitDisplayMap: {
    apartamento: "Apto", apto: "Apto", apt: "Apto", ap: "Apto", piso: "Piso",
    oficina: "Of", ofic: "Of", of: "Of", local: "Local", unidad: "Unidad",
    torre: "Torre", block: "Block", bloque: "Block",
  },
  defaultSecUnitType: "Piso",

  poBoxNames: ["Casilla de Correo", "Casilla", "C.C."],
  poBoxDisplayMap: {
    "casilla de correo": "Casilla de Correo", casilla: "Casilla de Correo",
    "c.c.": "Casilla de Correo",
  },
};

export default uyConfig;
