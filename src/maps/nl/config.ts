import type { EuCountryConfig } from "../_eu/types";

/**
 * Dutch (NL) address configuration.
 *
 * Order: street name first, house number after ("Kalverstraat 92").
 * Type: fused into the name as a glued lowercase suffix ("-straat", "-gracht",
 *       "-plein"); kept verbatim. Many streets have no separable type.
 * Toevoeging (addition): "92A", "92-3", "130hs", "16-II", "27bis".
 * Postcode: 4 digits + 2 letters ("1012 PH"), before the city; apostrophe-s
 *       city names ("'s-Gravenhage") are kept intact.
 */

const FUSED: Array<[string, string]> = [
  ["straat", "straat"],
  ["gracht", "gracht"],
  ["singel", "singel"],
  ["schans", "schans"],
  ["plein", "plein"],
  ["dreef", "dreef"],
  ["markt", "markt"],
  ["steeg", "steeg"],
  ["kade", "kade"],
  ["dijk", "dijk"],
  ["laan", "laan"],
  ["baan", "baan"],
  ["hof", "hof"],
  ["weg", "weg"],
  ["pad", "pad"],
];

const TYPE_SHORT: Record<string, string> = {
  straat: "STR", gracht: "GR", singel: "SNG", schans: "SCH", plein: "PLN",
  dreef: "DRF", markt: "MKT", steeg: "STG", kade: "KD", dijk: "DK",
  laan: "LN", baan: "BN", hof: "HF", weg: "WG", pad: "PD",
};

export const nlConfig: EuCountryConfig = {
  code: "nl",
  country: "NL",
  countryNames: ["The Netherlands", "Nederland", "Netherlands", "Holland", "NLD", "NL"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  // Dutch fused types are lowercase and kept verbatim ("straat", "gracht").
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{4}\\s?[A-Za-z]{2})",
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, 4)} ${s.slice(4)}`;
  },
  // number, then either a "-<toevoeging>" (dash dropped: "92-3" -> "3",
  // "16-II" -> "II") or a (possibly spaced) letter block ("92A", "130hs",
  // "27bis", "158 bis", "82 bis A", "114 C").
  houseNumberPattern:
    "(?<number>\\d+)(?:-\\s?(?<civic_number_suffix>\\w+)|\\s?(?<civic_number_suffix_2>bis(?:\\s+[A-Za-z](?![A-Za-z]))?|[A-Za-z]{1,3}(?![A-Za-z])))?",

  fusedTypeSuffixes: FUSED,
  splitSpacedType: false,
  unsplittableExact: ["Vrijthof"],
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  poBoxNames: ["Postbus", "Antwoordnummer"],
  poBoxDisplayMap: { postbus: "Postbus", antwoordnummer: "Antwoordnummer" },
};

export default nlConfig;
