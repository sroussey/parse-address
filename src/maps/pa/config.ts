import type { EuCountryConfig } from "../_eu/types";

/**
 * Panamanian (PA) address configuration.
 *
 * Order: street TYPE + name FIRST ("Calle 50", "Vía España", "Avenida Balboa").
 *        A house number is usually ABSENT — Panamanian addresses identify the
 *        point by a named building (Edificio) rather than a civic number — so the
 *        number is optional and streets frequently ARE numbers ("Calle 50",
 *        "Calle 53 Este"): digits are allowed in the name.
 * Type: leads the name (prefix), verbatim (Calle, Avenida / Av., Vía, Boulevard,
 *        Transístmica, Autopista, Callejón, Camino).
 * Building: "Edificio <Name>" / "Casa <n>" / "PH <Name>" / "Torre <Name>" and
 *        floor/office words follow the street as a SECONDARY UNIT; the unit
 *        number may be a multi-word building name ("Edificio Global Bank").
 * Corregimiento (the neighbourhood — Bella Vista, San Francisco, El Cangrejo,
 *        Obarrio): usually the SECOND-to-last place segment. With no postcode it
 *        maps to `city` and the provincia to `state`. When a 4-digit código
 *        postal is present, the corregimiento is CONSUMED and DROPPED (via the
 *        postalPattern drop-prefix) and the distrito/ciudad becomes the city.
 * Postcode: Panama's 4-digit zona postal is GENERALLY ABSENT; when written it
 *        precedes the city. Provincia (10 + comarcas) is the trailing state.
 */

const TYPES = [
  "Transístmica", "Transistmica", "Autopista", "Boulevard", "Bulevar",
  "Callejón", "Callejon", "Avenida", "Camino", "Calle", "Vía", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Blvd.",
];

// 10 provincias + 3 comarcas indígenas, longest-first (Panamá Oeste before
// Panamá), spaces -> \s+.
const STATES = [
  "Panamá Oeste", "Panama Oeste", "Bocas del Toro", "Los Santos",
  "Ngäbe-Buglé", "Ngabe-Bugle", "Emberá-Wounaan", "Embera-Wounaan",
  "Guna Yala", "Kuna Yala", "Chiriquí", "Chiriqui", "Veraguas", "Herrera",
  "Darién", "Darien", "Coclé", "Cocle", "Colón", "Colon", "Panamá", "Panama",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const paConfig: EuCountryConfig = {
  code: "pa",
  country: "PA",
  // "Panamá" is deliberately NOT a country name here: it is also the routing city
  // AND the provincia, and listing it lets the trailing-country group steal it.
  countryNames: ["República de Panamá", "Republica de Panama", "PAN", "PA"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // Optional 4-digit zona postal, before the city. Optional corregimiento
  // drop-prefix that fires ONLY when the postcode is present (so a plain
  // "corregimiento, provincia" tail is NOT eaten — corregimiento stays as city).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{4})",
  // Number (usually absent). A civic number, when written, carries a REQUIRED
  // "No."/"Nº"/"#" marker ("Calle 8, No. 12") -- this stops a bare 4-digit zona
  // postal that directly follows the street from being mis-read as a house
  // number. "s/n" (sin número) is also accepted.
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z])|-\\d+)?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  regionPattern: `(?<state>${REGION_ALT})`,
  regionMap: {
    panama: "Panamá", "panama oeste": "Panamá Oeste", chiriqui: "Chiriquí",
    cocle: "Coclé", colon: "Colón", darien: "Darién", "kuna yala": "Guna Yala",
    "ngabe-bugle": "Ngäbe-Buglé", "embera-wounaan": "Emberá-Wounaan",
  },

  // Building / floor / office. The unit number may be a multi-word building name
  // ("Edificio Global Bank"), so it is a non-greedy comma-bounded run.
  secUnitPattern:
    "(?:(?<sec_unit_type>Edificio|Edif|Casa|Apartamento|Apto|Apt|Piso|Local|Oficina|Ofic|Of|PH|Penthouse|Torre)\\.?\\s*(?<sec_unit_num>[^,\\n]+?)?)",
  secUnitDisplayMap: {
    edificio: "Edificio", edif: "Edificio", casa: "Casa", apartamento: "Apto",
    apto: "Apto", apt: "Apto", piso: "Piso", local: "Local", oficina: "Of",
    ofic: "Of", of: "Of", ph: "PH", penthouse: "PH", torre: "Torre",
  },

  poBoxNames: ["Apartado Postal", "Apartado"],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
  },
};

export default paConfig;
