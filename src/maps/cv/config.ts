import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Cape Verde (CV) address configuration — Portuguese.
 *
 * Order: thoroughfare TYPE + name FIRST ("Avenida Amílcar Cabral"), then the
 *        house number AFTER the name ("Rua 5 de Julho 12"). Same grammar family
 *        as PT/BR/MZ.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., R.).
 *        Particles (de/da/do/dos/das) stay with the name.
 * Bairro / zona: a neighbourhood ("Achada Santo António", "Palmarejo",
 *        "Plateau", "Prainha") sits on its own segment just before the postcode;
 *        it is a real routing unit with no output field, so it is CONSUMED and
 *        DROPPED via the optional `(?<drop>...)` baked into `postalPattern`
 *        (BR/MZ bairro trick). The drop fires only when a postcode follows.
 * Postcode: 4 digits ("7600 Praia", "2110 Mindelo"), written BEFORE the city.
 *        Adoption is patchy, so it is OFTEN OMITTED and therefore OPTIONAL.
 * Ilha -> `state`: the island (Santiago, São Vicente, Sal, ...) may follow the
 *        city; captured to `state`. Island names do not duplicate the major city
 *        names (Praia is on Santiago, Mindelo on São Vicente).
 * Caixa Postal: PO box, "Caixa Postal 123". Common.
 *
 * Sources: Correios de Cabo Verde; UPU S42 CV template; Smarty / GeoPostcodes CV
 * guides; Wikipedia "Islands of Cape Verde". See research-cv.md.
 */

const TYPES = [
  "Avenida", "Travessa", "Alameda", "Estrada", "Largo", "Praça", "Praca",
  "Beco", "Rotunda", "Rua", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Trav.", "Tv.", "Al.", "Estr.", "Lgo.", "Pç.", "Pc.", "R.",
];

// Islands (state). Multi-word / longer first so the alternation prefers longer.
const ISLANDS = [
  "Santo Antão", "São Vicente", "São Nicolau", "Santa Luzia", "Boa Vista",
  "Santiago", "Maio", "Sal", "Fogo", "Brava",
];

export const cvConfig: EuCountryConfig = {
  code: "cv",
  country: "CV",
  countryNames: ["Cabo Verde", "Cape Verde", "Republic of Cabo Verde", "CPV", "CV"],

  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names are common ("5 de Julho", "12 de Setembro").
  allowDigitsInName: true,

  // Optional bairro drop (anchored by the postcode) + optional 4-digit postcode.
  // The drop segment carries NO digits (bairros are word-only), so a numbered
  // street segment can never be swallowed as a neighbourhood.
  postalPattern:
    "(?:(?<drop>[^,\\n\\d]*?[^\\d\\s,]),\\s*)?(?<postal_code>\\d{4})(?![\\d-])",

  // Optional "nº" marker, digits (or range), optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|N\\.?º\\.?)\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Spaces escaped to \s+ (free-spacing mode ignores literal spaces).
  regionPattern: `(?<state>${ISLANDS.map((p) => p.replace(/ /g, "\\s+")).join("|")})`,

  // Portuguese floor/side unit or an explicit-type unit.
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Ap|Bloco|Bl|Andar|Prédio|Predio|Casa|Moradia)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*\\.?\\s*[ºªo]|R/C|RC))\\s*(?<sec_unit_type_2>andar)?)",
  secUnitDisplayMap: {
    apartamento: "Apartamento", apto: "Apartamento", apt: "Apartamento",
    ap: "Apartamento", bloco: "Bloco", bl: "Bloco", andar: "Andar",
    prédio: "Prédio", predio: "Prédio", casa: "Casa", moradia: "Moradia",
  },
  defaultSecUnitType: "Andar",

  poBoxNames: ["Caixa Postal", "CAIXA POSTAL", "C.P.", "CP"],
  poBoxDisplayMap: {
    "caixa postal": "Caixa Postal", "c.p.": "Caixa Postal", cp: "Caixa Postal",
  },
};

export default cvConfig;
