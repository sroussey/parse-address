import type { EuCountryConfig } from "../_eu/types";

/**
 * Italian (IT) address configuration.
 *
 * Order: toponimo (type) + name, then the house number ("Via Roma 15").
 * Type: leads the name (prefix), kept verbatim incl. abbreviations (V.le, C.so).
 * Civico: trailing "/A", glued letter ("12A"), "5r"/"rosso", "bis"/"ter", or
 *         "snc" (no civic number).
 * CAP: 5-digit before the comune ("00184 Roma"); the 2-letter province sigla
 *      follows the city ("Roma RM" or "Roma (RM)") -> `state`.
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

// Italian province sigle (incl. legacy CI/OG/OT/VS and 2016 SU).
const PROVINCES =
  "AG AL AN AO AP AQ AR AT AV BA BT BL BN BG BI BO BZ BS BR CA CL CB CI CE CT " +
  "CZ CH CO CS CR KR CN EN FM FE FI FG FC FR GE GO GR IM IS SP LT LE LC LI LO " +
  "LU MC MN MS MT VS ME MI MO MB NA NO NU OG OT OR PD PA PR PV PG PU PE PC PI " +
  "PT PN PZ PO RG RA RC RE RI RM RN RO SA SS SV SI SR SO SU TA TE TR TO TP TN TV " +
  "TS UD VA VE VB VC VR VV VI VT";

export const itConfig: EuCountryConfig = {
  code: "it",
  country: "IT",
  countryNames: ["Italia", "Italy", "ITA", "IT"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{5})",
  // number + civico suffix, OR a bare "snc" (senza numero civico).
  houseNumberPattern:
    "(?:(?<number>\\d+)(?<civic_number_suffix>\\s+(?:bis|ter|rosso|nero)(?:\\s?/\\s?[A-Za-z0-9]+)?|/\\s?[A-Za-z0-9]+|[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>snc))",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  regionPattern: `\\(?(?<state>${PROVINCES.split(" ").join("|")})\\)?`,

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

export default itConfig;
