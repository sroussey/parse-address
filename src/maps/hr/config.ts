import type { EuCountryConfig } from "../_eu/types";

/**
 * Croatian (HR) address configuration.
 *
 * Order: street name first, house number after ("Ilica 5", "Ulica kralja
 *        Tomislava 12", "Ksaverska cesta 2f").
 * Type:  a leading generic ("Ulica", "Trg", "Avenija", "Aleja", "Put",
 *        "Obala", "Prolaz", "Poljana", "Šetalište") is extracted; the very
 *        common TRAILING generic ("Vukovarska ulica", "Nova cesta",
 *        "Slavonska avenija") is not a leading word, so it stays inside the
 *        name and `type` is null -- the same convention the CZ config uses.
 * Postcode: five digits, no space, BEFORE the city ("10000 Zagreb"), with an
 *        optional international "HR-" prefix ("HR-21000 Split").
 * No county (županija) line in postal addresses.
 */

const TYPES = [
  "Šetalište", "Setaliste", "Avenija", "Prolaz", "Poljana", "Obala",
  "Ulica", "Aleja", "Trg", "Put",
  // rare abbreviation
  "Ul",
];

export const hrConfig: EuCountryConfig = {
  code: "hr",
  country: "HR",
  countryNames: ["Hrvatska", "Croatia", "HRV", "HR"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Keep the leading type spelling exactly as written.
  normalizeTypeCase: false,

  // Five digits, before the city, with an optional international "HR-" prefix.
  // The prefix is captured into a `drop` group (consumed, not emitted) so that
  // when the postcode boundary trims the digits, the stranded "HR-" is not
  // scored as a lost street token.
  postalPattern: "(?:(?<drop>HR-))?(?<postal_code>\\d{5})",

  // House number plus an optional single-letter suffix ("31a", "2f").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
};

export default hrConfig;
