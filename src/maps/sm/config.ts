import type { EuCountryConfig } from "../_eu/types";

/**
 * San Marino (SM) address configuration.
 *
 * San Marino uses ITALIAN addressing; Poste San Marino delivers and codes are
 * inside the Italian 5-digit CAP plan (all 4789x):
 *   Order:   toponimo (type) + name, then the house number ("Via Roma 15",
 *            "Contrada Omerelli 20").
 *   Type:    leads the name (prefix), kept verbatim incl. abbreviations (V.le,
 *            C.da, P.za). Particles ("del", "della", "di", "dei", "delle")
 *            stay with the name.
 *   Civico:  trailing "/A", glued letter ("12A"), "bis"/"ter", or "snc".
 *   CAP:     5-digit 4789x written BEFORE the locality (47890 Citta di San
 *            Marino, 47891 Dogana, 47893 Borgo Maggiore, 47899 Serravalle...).
 *   City:    a castello (municipality) or its frazione. A trailing "(RSM)" or
 *            "Rep. San Marino" country marker is consumed. No province line
 *            (San Marino is not an Italian province).
 */

const TYPES = [
  "Strada Statale", "Piazzale", "Piazzetta", "Piazza", "Contrada", "Contrà",
  "Località", "Localita", "Traversa", "Stradone", "Salita", "Strada", "Viale",
  "Vicolo", "Galleria", "Corso", "Largo", "Borgo", "Campo", "Rampa", "Vico",
  "Via",
  // abbreviations (kept verbatim)
  "V.le", "Vle", "P.za", "Pza", "P.zza", "C.da", "Cda", "C.so", "Cso", "P.le",
  "Ple", "L.go", "Lgo", "Str", "Loc", "V",
];

const TYPE_SHORT: Record<string, string> = {
  via: "V", viale: "VLE", vicolo: "VLO", piazza: "PZA", piazzale: "PLE",
  piazzetta: "PZT", corso: "CSO", largo: "LGO", strada: "STR", borgo: "BG",
  contrada: "CDA", "contrà": "CDA", salita: "SAL", campo: "CPO",
  galleria: "GAL", località: "LOC", localita: "LOC",
};

export const smConfig: EuCountryConfig = {
  code: "sm",
  country: "SM",
  // NB: the bare "San Marino" is intentionally NOT a country name here -- it is
  // also the capital's city name ("47890 Citta di San Marino"), and listing it
  // would let the trailing-country group steal "San Marino" out of the city.
  // The unambiguous markers ("(RSM)" via citySuffix, "RSM"/"SM"/"Repubblica di
  // San Marino") cover the country role instead.
  countryNames: [
    "Repubblica di San Marino", "Rep. San Marino", "Rep San Marino",
    "R.S.M.", "RSM", "SMR", "SM",
  ],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // 5-digit CAP, San Marino block 47890-47899.
  postalPattern: "(?<postal_code>4789\\d)",
  // number + civico suffix, OR a bare "snc" (senza numero civico). The civico is
  // capped at 4 digits so a no-number street line ("Via del Serrone, 47892
  // Acquaviva") cannot swallow the 5-digit CAP as the house number.
  houseNumberPattern:
    "(?:(?<number>\\d{1,4})(?<civic_number_suffix>\\s+(?:bis|ter)(?:\\s?/\\s?[A-Za-z0-9]+)?|/\\s?[A-Za-z0-9]+|[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>snc))",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Consume a trailing "(RSM)" country marker left on the locality line.
  citySuffixPattern: "\\s*\\((?:RSM|R\\.S\\.M\\.)\\)",

  secUnitPattern:
    "(?<sec_unit_type>Interno|Int\\.?|Scala|Sc\\.?|Piano|Palazzo|Pal\\.?|Appartamento|App\\.?)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    interno: "Interno", int: "Interno", scala: "Scala", sc: "Scala",
    piano: "Piano", palazzo: "Palazzo", pal: "Palazzo",
    appartamento: "Appartamento", app: "Appartamento",
  },

  poBoxNames: ["Casella Postale", "C.P.", "CP"],
  poBoxDisplayMap: {
    "casella postale": "Casella Postale", "c.p.": "Casella Postale", cp: "Casella Postale",
  },
};

export default smConfig;
