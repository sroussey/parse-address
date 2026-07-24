import type { EuCountryConfig } from "../_eu/types";

/**
 * Guinea-Bissau (GW) address configuration — Portuguese.
 *
 * Order: thoroughfare TYPE + name FIRST ("Avenida Amílcar Cabral"), then the
 *        house number AFTER the name ("Avenida Amílcar Cabral 12"). Same grammar
 *        family as PT/AO.
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., R.).
 *        Particles (de/da/do/dos/das) stay with the name.
 * Bairro: a Bissau neighbourhood ("Bandim", "Chão de Papel", "Bairro Militar",
 *        "Cuntum", ...) commonly sits between the street and the city; it is not
 *        a routing field, so a RECOGNISED bairro is CONSUMED and DROPPED
 *        (areaNames). Unknown bairros are a documented failure mode.
 * City: usually Bissau or a regional capital ("Bafatá", "Gabú", "Bissorã").
 * Região -> `state`: the 8 regions + the Bissau autonomous sector (Bafatá,
 *        Biombo, Cacheu, Oio, ...) may be written last; captured to `state`.
 *        Several region names are also a city name (Bafatá, Gabú, Cacheu,
 *        Bolama) — a documented city/region collision.
 * Postcode: NONE. Guinea-Bissau does not operate a postal-code system. Sentinel.
 * Caixa Postal: PO box, "Caixa Postal 123" (abbr. "C.P."). Common.
 *
 * Sources: Correios da Guiné-Bissau; Smarty / GeoPostcodes GW guides (no
 * postcodes); Wikipedia "Regions of Guinea-Bissau". See research-gw.md.
 */

const TYPES = [
  "Avenida", "Travessa", "Alameda", "Estrada", "Largo", "Praça", "Praca",
  "Beco", "Rotunda", "Rua", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Trav.", "Tv.", "Al.", "Estr.", "Lgo.", "Pç.", "Pc.", "R.",
];

// Regions (state) + the Bissau autonomous sector. Multi-word first.
const REGIONS = [
  "Bolama-Bijagós", "Bolama Bijagós", "Bafatá", "Biombo", "Cacheu", "Gabú",
  "Quinara", "Tombali", "Bolama", "Bissau", "Oio",
];

export const gwConfig: EuCountryConfig = {
  code: "gw",
  country: "GW",
  countryNames: ["Guiné-Bissau", "Guinea-Bissau", "Guine-Bissau", "GNB", "GW"],

  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Date/number street names are common ("14 de Novembro", "3 de Agosto").
  allowDigitsInName: true,

  // No real postcode -> never-match sentinel (the before-city grammar makes the
  // postcode block optional, so it is simply skipped).
  postalPattern: "(?<postal_code>(?!x)x)",

  // Optional "nº"/"n.º" marker, digits (or range), optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|nº|N\\.?º\\.?)\\s*)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Recognised Bissau bairros consumed + dropped.
  // NB: only names >= 4 chars and not a substring of a common street word are
  // listed -- the token-preservation stripper matches areaNames without word
  // boundaries, so a short name like "Bra" would split "Cabral" and inflate the
  // count (see research-gw.md).
  areaNames: [
    "Chão de Papel", "Bairro Militar", "Bissau Velho", "Santa Luzia",
    "Bandim", "Cuntum", "Antula", "Missirá", "Quelele", "Cupelão", "Ajuda",
    "Belém", "Penha", "Pluba",
  ],

  // Spaces escaped to \s+ (free-spacing mode ignores literal spaces).
  regionPattern: `(?<state>${REGIONS.map((p) => p.replace(/ /g, "\\s+")).join("|")})`,

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

export default gwConfig;
