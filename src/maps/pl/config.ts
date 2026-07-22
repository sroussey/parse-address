import type { EuCountryConfig } from "../_eu/types";

/**
 * Polish (PL) address configuration. The thoroughfare type leads, usually
 * abbreviated ("ul." = ulica, "al." = aleja, "pl." = plac), then the name, then
 * the building number. A glued "/N" or a spaced "m. N" / "lok. N" is the
 * apartment. The postcode is "NN-NNN", before the city; no region line.
 */

const TYPES = [
  "ulica", "aleja", "plac", "bulwar", "rondo", "skwer",
  "ul", "al", "pl", "os", "bulw",
];

export const plConfig: EuCountryConfig = {
  code: "pl",
  country: "PL",
  countryNames: ["Polska", "Poland", "POL", "PL"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Date/number street names are common ("3 Maja", "11 Listopada").
  allowDigitsInName: true,

  // Accept a missing dash ("00950") and reformat to the canonical "NN-NNN".
  postalPattern: "(?<postal_code>\\d{2}-?\\d{3})",
  postalFormat: (raw: string) =>
    String(raw).replace(/^(\d{2})-?(\d{3})$/, "$1-$2"),
  // building number, optional glued letter, and an optional glued "/N" apartment
  // (spaced "m. N" / "lok. N" forms are handled by secUnitPattern).
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?(?:\\s*/\\s*(?<sec_unit_num_2>\\w+))?",

  types: TYPES,
  // The type normalizes to its abbreviated form (aleja -> al., plac -> pl.).
  typeDisplayMap: {
    ul: "ul.", ulica: "ul.",
    al: "al.", aleja: "al.",
    pl: "pl.", plac: "pl.",
    os: "os.",
    bulw: "bulw.", bulwar: "bulw.",
    rondo: "rondo", skwer: "skwer",
  },

  secUnitPattern:
    "(?<sec_unit_type>m|lok|mieszkanie|lokal)\\.?\\s*(?<sec_unit_num>[\\w-]+)",
  secUnitDisplayMap: {
    m: "m.", lok: "lok.", mieszkanie: "m.", lokal: "lok.",
  },
  // A bare "/N" apartment has no marker word; it defaults to "m." (mieszkanie).
  defaultSecUnitType: "m.",
};

export default plConfig;
