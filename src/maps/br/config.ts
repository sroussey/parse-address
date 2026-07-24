import type { EuCountryConfig } from "../_eu/types";

/**
 * Brazilian (BR) address configuration.
 *
 * Order: logradouro TYPE + name FIRST ("Avenida Paulista"), then the house
 *        number AFTER the name, usually after a comma ("Avenida Paulista, 1578").
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (Av., R.,
 *        Al., Rod., Estr.). Particles (das/de/dos/do) stay with the name.
 * Complemento (apto/bloco/andar/sala/casa/conjunto...) follows the number.
 * Neighbourhood (bairro) sits on its own line just before the CEP line; it is a
 *        real routing unit but has no output field here, so it is CONSUMED and
 *        DROPPED via the optional prefix baked into `postalPattern`.
 * CEP: "NNNNN-NNN", written BEFORE the city on the final line, with the 2-letter
 *        UF state code after the city ("01310-100 São Paulo - SP").
 */

const TYPES = [
  // full words
  "Avenida", "Alameda", "Travessa", "Rodovia", "Estrada", "Passagem",
  "Passarela", "Viaduto", "Ladeira", "Loteamento", "Condomínio", "Residencial",
  "Esplanada", "Quadra", "Conjunto", "Viela", "Largo", "Praça", "Parque",
  "Jardim", "Recanto", "Setor", "Vereda", "Trecho", "Beco", "Bosque", "Vila",
  "Rua", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Al.", "Al", "Tv.", "Trav.", "Estr.", "Rod.", "Pça.", "Pca.",
  "Pç.", "Lgo.", "Pq.", "Jd.", "Cj.", "Cond.", "Lot.", "R.",
];

export const brConfig: EuCountryConfig = {
  code: "br",
  country: "BR",
  countryNames: ["Brasil", "Brazil", "BRA", "BR"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered / date street names are common ("Rua 25 de Março", "Avenida 23 de
  // Maio", "Rua 7 de Setembro"); allow digits in the name and still find the
  // trailing civic number.
  allowDigitsInName: true,

  // CEP "NNNNN-NNN". The optional leading drop-prefix swallows a single
  // preceding comma-segment -- the bairro line that always precedes the CEP
  // ("..., Jardim Paulista, 01310-100 São Paulo - SP") -- so the neighbourhood
  // is dropped, not mis-parsed as the city. The dropped segment must end in a
  // NON-digit ([^\d\s,] before the comma): a bairro ends in a letter, whereas a
  // "Street 1578," ends in a digit -- this stops the anchored place-only rule
  // from cannibalising a numbered street as if it were a neighbourhood. The
  // optional "CEP" lead-in tolerates "CEP 01310-100" (Correios discourages it).
  postalPattern:
    "(?:(?<drop>[^,\\n]*?[^\\d\\s,]),\\s*)?(?:CEP\\.?:?\\s*)?(?<postal_code>\\d{5}-\\d{3})",
  // Number: optional "nº" marker, digits (or a range), optional glued/spaced
  // letter suffix; OR "s/n" (sem número).
  houseNumberPattern:
    "(?:(?:n[ºo]\\.?|N[ºo]\\.?)\\s*)?(?:(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  // UF state code after the city, preceded by a hyphen / en-dash / slash or a
  // comma ("São Paulo - SP", "São Paulo, SP", "São Paulo / SP"). The leading
  // "[\s,]+" is supplied by the ruleset's region wrapper; a bare 2-letter code
  // is auto-upper-cased by normalizeRegion, so no regionMap is needed.
  regionPattern: "[-–/]?\\s*(?<state>[A-Za-z]{2})(?![A-Za-z])",

  // Complemento: an explicit-type unit ("Apto 12", "Bloco B", "Sala 501",
  // "Casa 2", "Conjunto 42") OR a number-first floor ("10º andar").
  secUnitPattern:
    "(?:(?<sec_unit_type>Apartamento|Apto|Apt|Ap|Bloco|Bl|Casa|Cs|Sala|Sl|Conjunto|Conj|Cj|Loja|Lj|Sobreloja|Cobertura|Cob|Andar|Fundos|Fds|Sobrado|Galpão|Quadra|Qd|Lote|Lt)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?" +
    "|(?<sec_unit_num_2>\\d+\\s*[ºªo°]?)\\s+(?<sec_unit_type_2>andar))",
  secUnitDisplayMap: {
    apartamento: "Apto", apto: "Apto", apt: "Apto", ap: "Apto",
    bloco: "Bloco", bl: "Bloco", casa: "Casa", cs: "Casa", sala: "Sala",
    sl: "Sala", conjunto: "Conjunto", conj: "Conjunto", cj: "Conjunto",
    loja: "Loja", lj: "Loja", sobreloja: "Sobreloja", cobertura: "Cobertura",
    cob: "Cobertura", andar: "Andar", fundos: "Fundos", fds: "Fundos",
    sobrado: "Sobrado", quadra: "Quadra", qd: "Quadra", lote: "Lote",
    lt: "Lote",
  },

  poBoxNames: ["Caixa Postal", "CAIXA POSTAL"],
  poBoxDisplayMap: { "caixa postal": "Caixa Postal" },
};

export default brConfig;
