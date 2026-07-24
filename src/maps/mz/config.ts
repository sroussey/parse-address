import type { EuCountryConfig } from "../_eu/types";

/**
 * Mozambique (MZ) address configuration — Portuguese.
 *
 * Order: thoroughfare TYPE + name FIRST ("Avenida Eduardo Mondlane"), then the
 *        house number AFTER the name ("Avenida Eduardo Mondlane 1234"). Same
 *        grammar family as PT/BR.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., R.).
 *        Particles (de/da/do/dos/das) stay with the name.
 * Bairro: a neighbourhood ("Bairro Central", "Polana", "Sommerschield") sits on
 *        its own segment just before the postcode line; it is a real routing
 *        unit but has no output field, so it is CONSUMED and DROPPED via the
 *        optional `(?<drop>...)` baked into `postalPattern` (BR bairro trick).
 *        The drop fires only when a postcode follows (the postcode anchors it),
 *        so a numbered street is never mistaken for a neighbourhood.
 * Postcode: 4 digits, written BEFORE the city ("1100 Maputo"). Structure: first
 *        digit = region, last three = delivery area/office (Maputo 1100, Matola
 *        1300, Beira 2100, Nampula 3000). Adoption is patchy, so it is OFTEN
 *        OMITTED and therefore OPTIONAL.
 * Província -> `state`: the 10 provinces + Cidade de Maputo (Gaza, Sofala,
 *        Nampula, ...) may follow the city; captured to `state`. "Maputo" is
 *        both a city and a province — a documented collision.
 * Caixa Postal: PO box, "Caixa Postal 1234". Common.
 *
 * Sources: Correios de Moçambique (CTT / Correios); UPU S42 MZ template
 * (MOZ.pdf); Smarty / GetPostalCodes MZ guides; Wikipedia "Provinces of
 * Mozambique". See research-mz.md.
 */

const TYPES = [
  "Avenida", "Travessa", "Alameda", "Estrada", "Largo", "Praça", "Beco",
  "Rotunda", "Rua", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Trav.", "Tv.", "Al.", "Estr.", "Lgo.", "Pç.", "Pc.", "R.",
];

// Provinces (state) + the capital city with provincial status. Longest first.
const PROVINCES = [
  "Cidade de Maputo", "Cabo Delgado", "Maputo Cidade", "Inhambane",
  "Zambézia", "Zambezia", "Nampula", "Niassa", "Manica", "Sofala",
  "Maputo", "Gaza", "Tete",
];

export const mzConfig: EuCountryConfig = {
  code: "mz",
  country: "MZ",
  countryNames: ["Mozambique", "Moçambique", "Mocambique", "MOZ", "MZ"],

  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names are common ("24 de Julho", "25 de Setembro").
  allowDigitsInName: true,

  // Optional bairro drop (anchored by the postcode) + optional 4-digit postcode.
  // The drop segment carries NO digits (bairros are word-only), so a numbered
  // street segment ("... 1234A,") can never be swallowed as a neighbourhood --
  // this also stops the bare place-only rule from eating a street line.
  postalPattern:
    "(?:(?<drop>[^,\\n\\d]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{4})(?![\\d-])",

  // Optional "nº" marker, digits (or range), optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|N\\.?º\\.?)\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Spaces escaped to \s+ (free-spacing mode ignores literal spaces).
  regionPattern: `(?<state>${PROVINCES.map((p) => p.replace(/ /g, "\\s+")).join("|")})`,

  // Complemento: floor-first "5º andar", or an explicit-type unit
  // ("Apartamento 4", "Bloco B", "Flat 3", "R/C").
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Ap|Bloco|Bl|Andar|Prédio|Predio|Flat|Casa|Moradia)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*\\.?\\s*[ºªo]|R/C|RC))\\s*(?<sec_unit_type_2>andar)?)",
  secUnitDisplayMap: {
    apartamento: "Apartamento", apto: "Apartamento", apt: "Apartamento",
    ap: "Apartamento", bloco: "Bloco", bl: "Bloco", andar: "Andar",
    prédio: "Prédio", predio: "Prédio", flat: "Flat", casa: "Casa",
    moradia: "Moradia",
  },
  defaultSecUnitType: "Andar",

  poBoxNames: ["Caixa Postal", "CAIXA POSTAL", "C.P.", "CP"],
  poBoxDisplayMap: {
    "caixa postal": "Caixa Postal", "c.p.": "Caixa Postal", cp: "Caixa Postal",
  },
};

export default mzConfig;
