import type { EuCountryConfig } from "../_eu/types";

/**
 * Guatemalan (GT) address configuration.
 *
 * Order: the numbered-grid street is written NAME-then-TYPE ("6 Avenida",
 *        "13 Calle") -- the ordinal precedes the vía word -- so the type sits as
 *        a SUFFIX. The house number ("13-72" = casa 72 near cross-street 13)
 *        follows the type as a hyphenated block number.
 * Type: suffix (Avenida / Calle / Calzada / Diagonal / Ruta / Vía), kept
 *        verbatim. Named avenues ("Avenida La Reforma", "Calzada Roosevelt")
 *        carry no trailing type word, so they stay whole in `street`.
 * Zona: the routing "Zona N" segment sits between the street and the city; it is
 *        captured as a secondary unit (sec_unit_type "Zona").
 * Postcode: 5 digits (digits 1-2 = departamento, digit 5 = zona), written AFTER
 *        the city with no comma ("Ciudad de Guatemala 01010"). Optional.
 * State: the departamento, comma-delimited after the city when present
 *        ("Cobán, Alta Verapaz 16001"). Guatemala-City lines usually omit it.
 */

const TYPES = [
  "Avenida", "Calzada", "Diagonal", "Boulevard", "Bulevar", "Callejón",
  "Callejon", "Calle", "Ruta", "Vía", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Cja.", "Diag.", "Blvd.", "Calz.",
];

export const gtConfig: EuCountryConfig = {
  code: "gt",
  country: "GT",
  // "Guatemala" is deliberately NOT listed: it is the routing city
  // ("Guatemala" / "Ciudad de Guatemala"), and listing it as a country name lets
  // the trailing-country group steal it, truncating the city to "Ciudad de".
  countryNames: ["GTM", "GUA", "GT"],
  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  // The grid street name IS a number ("6 Avenida", "13 Calle"), so digits are
  // allowed inside the name; the trailing block number is still found.
  allowDigitsInName: true,

  // 5-digit postcode, after the city. Optional (frequently omitted).
  postalPattern: "(?<postal_code>\\d{5})",
  // House/block number: "13-72" (cross-street + house) or a plain run, with an
  // optional trailing letter ("13-72 A") or "No." marker; OR "s/n".
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*)?(?:(?<number>\\d+\\s*-\\s*\\d+|\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  // Departamento, comma-delimited after the city (default county pattern).
  // Guatemala-City lines omit it; the grammar's county is optional.

  // Zona is the dominant secondary unit; a handful of interior words follow.
  secUnitPattern:
    "(?:(?<sec_unit_type>Zona|Zn|Nivel|Local|Oficina|Ofic|Of|Apartamento|Apto|Apt|Edificio|Edif|Casa|Bodega)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    zona: "Zona", zn: "Zona", nivel: "Nivel", local: "Local", oficina: "Of",
    ofic: "Of", of: "Of", apartamento: "Apto", apto: "Apto", apt: "Apto",
    edificio: "Edif", edif: "Edif", casa: "Casa", bodega: "Bodega",
  },

  poBoxNames: ["Apartado Postal", "Apartado"],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
  },
};

export default gtConfig;
