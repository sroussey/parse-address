import type { EuCountryConfig } from "../_eu/types";

/**
 * Timor-Leste (TL) address configuration — Portuguese (co-official with Tetum).
 *
 * Order: thoroughfare TYPE + name FIRST ("Avenida de Portugal"), then the house
 *        number AFTER the name ("Rua José Maria Marques 15"). Same PT/MZ family.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., Trav.).
 *        Particles (de/da/do/dos/das) stay with the name.
 * Bairro / suco: a neighbourhood ("Colmera", "Farol", "Bairro Pite", "Vila
 *        Verde") sits between the street and the routing town. Dili's bairros are
 *        a KNOWN, closed-ish set, so they are consumed and DROPPED via the shared
 *        `areaNames` mechanism (an occurrence right after the street is eaten,
 *        never emitted, and exempted from the token-preservation guard). Because
 *        the drop is keyed on the KNOWN bairro list — not "any first segment" —
 *        an ordinary town that is NOT a Dili bairro ("Maliana", "Suai") is left
 *        alone and correctly becomes the `city`, with the município as `state`.
 * Postcode: Timor-Leste has NO operational postcode system, so `postalPattern`
 *        is a never-match sentinel and `postal_code` is never emitted.
 * Município (district) -> `state`: the 13 municipalities (Dili, Baucau, Ermera,
 *        Cova Lima, Oecusse, ...) may follow the town; captured to `state` and
 *        mapped to its ISO 3166-2:TL code. "Dili" is both a town and a
 *        municipality — a documented collision handled by the city+region split.
 *
 * Sources: UPU S42 addressing notes; Correios de Timor-Leste; Wikipedia
 * "Municipalities of Timor-Leste" / "Sucos of Dili"; PostGrid/Smarty TL guides.
 * See research-tl.md.
 */

const TYPES = [
  "Avenida", "Travessa", "Estrada", "Alameda", "Largo", "Praça", "Beco",
  "Rua",
  // abbreviations (kept verbatim; trailing dot handled by the grammar)
  "Av.", "Av", "Trav.", "Tv.", "Estr.", "Al.", "Lgo.", "Pç.", "R.",
];

// The 13 municipalities (state) + non-diacritic spellings, longest first.
const MUNICIPALITIES = [
  "Cova Lima", "Oe-Cusse Ambeno", "Oecusse", "Oecussi", "Manufahi",
  "Manatuto", "Liquiçá", "Liquica", "Lautém", "Lautem", "Bobonaro",
  "Baucau", "Ainaro", "Aileu", "Ermera", "Viqueque", "Dili",
];

const REGION_MAP: Record<string, string> = {
  aileu: "TL-AL",
  ainaro: "TL-AN",
  baucau: "TL-BA",
  bobonaro: "TL-BO",
  "cova lima": "TL-CO",
  dili: "TL-DI",
  ermera: "TL-ER",
  "lautém": "TL-LA",
  lautem: "TL-LA",
  "liquiçá": "TL-LI",
  liquica: "TL-LI",
  manatuto: "TL-MT",
  manufahi: "TL-MF",
  oecusse: "TL-OE",
  oecussi: "TL-OE",
  "oe-cusse ambeno": "TL-OE",
  viqueque: "TL-VI",
};

// Known Dili (and a few other) bairros / sucos consumed and dropped. Multi-word
// entries keep their space; the ruleset escapes it to \s+ in free-spacing mode.
const BAIRROS = [
  "Colmera", "Farol", "Bidau", "Lecidere", "Motael", "Vila Verde", "Comoro",
  "Bebonuk", "Fatuhada", "Gricenfor", "Audian", "Caicoli", "Kampung Alor",
  "Mascarenhas", "Culuhun", "Bairro Pite", "Santa Cruz", "Taibesse",
  "Acadiru Hun", "Balide", "Bemori", "Lahane", "Manleuana",
];

export const tlConfig: EuCountryConfig = {
  code: "tl",
  country: "TL",
  countryNames: ["Timor-Leste", "Timor Leste", "East Timor", "TLS", "TL"],

  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names ("Rua 20 de Maio", "Avenida 4 de Setembro").
  allowDigitsInName: true,

  // No postcode system in Timor-Leste: never-match sentinel, so postal_code is
  // never captured and no postcode is ever required.
  postalPattern: "(?<postal_code>(?!x)x)",

  // Optional "nº" marker, digits (or range), optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|N\\.?º\\.?)\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Known bairros/sucos dropped right after the street (see header).
  areaNames: BAIRROS,

  // Município (district) after the town -> state (mapped to ISO code).
  regionPattern: `(?<state>${MUNICIPALITIES.map((p) => p.replace(/ /g, "\\s+")).join("|")})`,
  regionMap: REGION_MAP,

  // Floor(+side) unit like PT: "3º Esq", "1º", "R/C" -> Andar.
  secUnitPattern:
    "(?<sec_unit_num_2>(?:\\d+\\s*\\.?\\s*[ºªo]|R/C|RC|r/c)" +
    "(?:\\s+(?:Esq\\.?|Dto\\.?|Dta\\.?|Dir\\.?|Frt\\.?|Frente|Esquerdo|Direito))?)",
  defaultSecUnitType: "Andar",
};

export default tlConfig;
