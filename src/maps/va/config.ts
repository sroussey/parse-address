import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Vatican City (VA) address configuration — Italian (near-clone of IT).
 *
 * The Vatican uses Italian-style addressing: toponimo (type) + name, then the
 * house number ("Via del Pellegrino 1"). Type leads the name (prefix), kept
 * verbatim including abbreviations (V.le, P.za). Civico: trailing "/A", glued
 * letter ("12A"), "bis"/"ter", or "snc".
 * CAP: FIXED "00120" for the whole Vatican City State, written before the city
 *      ("00120 Città del Vaticano").
 * There is no province: the Vatican is a single city-state, so `state` is never
 *      emitted.
 *
 * Sources: Poste Vaticane; the Vatican's single CAP 00120. See research-va.md.
 */

const TYPES = [
  "Strada Statale", "Piazzale", "Piazzetta", "Piazza", "Viale", "Vicolo",
  "Galleria", "Fondamenta", "Lungomare", "Lungarno", "Passeggiata", "Contrada",
  "Contrà", "Località", "Traversa", "Stradone", "Salita", "Strada", "Corso",
  "Largo", "Borgo", "Campo", "Calle", "Rampa", "Riva", "Molo", "Vico", "Via",
  // abbreviations (kept verbatim)
  "V.le", "Vle", "P.za", "Pza", "P.zza", "C.so", "Cso", "P.le", "Ple",
  "L.go", "Lgo", "V.lo", "Str", "Loc", "V",
];

const TYPE_SHORT: Record<string, string> = {
  via: "V", viale: "VLE", vicolo: "VLO", piazza: "PZA", piazzale: "PLE",
  piazzetta: "PZT", corso: "CSO", largo: "LGO", strada: "STR", borgo: "BG",
  calle: "CL", campo: "CPO", galleria: "GAL", contrada: "CDA", salita: "SAL",
  lungomare: "LGM", lungarno: "LGA", località: "LOC", fondamenta: "FND",
};

export const vaConfig: EuCountryConfig = {
  code: "va",
  country: "VA",
  countryNames: [
    "Città del Vaticano", "Citta del Vaticano", "Vatican City",
    "Vatican City State", "Stato della Città del Vaticano", "Vatican",
    "VAT", "VA",
  ],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Single fixed CAP for the whole city-state.
  postalPattern: "(?<postal_code>00120)",
  // number + civico suffix, OR a bare "snc" (senza numero civico).
  houseNumberPattern:
    "(?:(?<number>\\d+)(?<civic_number_suffix>\\s+(?:bis|ter|rosso|nero)(?:\\s?/\\s?[A-Za-z0-9]+)?|/\\s?[A-Za-z0-9]+|[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>snc))",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // No province in the Vatican city-state.
  countyPattern: "(?!x)x",

  secUnitPattern:
    "(?<sec_unit_type>Interno|Int\\.?|Scala|Sc\\.?|Piano|Palazzo|Pal\\.?|Appartamento|App\\.?)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    interno: "Interno", int: "Interno",
    scala: "Scala", sc: "Scala",
    piano: "Piano",
    palazzo: "Palazzo", pal: "Palazzo",
    appartamento: "Appartamento", app: "Appartamento",
  },

  poBoxNames: ["Casella Postale", "C.P.", "CP"],
  poBoxDisplayMap: {
    "casella postale": "Casella Postale",
    "c.p.": "Casella Postale",
    cp: "Casella Postale",
  },
};

export default vaConfig;
