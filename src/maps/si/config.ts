import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Slovenian (SI) address configuration.
 *
 * Order: street name first, house number after ("Slovenska cesta 58",
 *        "Čopova 12a").
 * Type:  the generic is usually TRAILING ("Slovenska cesta", "Trubarjeva
 *        ulica", "Dunajska cesta") and stays inside the name with `type` null.
 *        A leading generic -- "Trg" (square), "Ulica", "Cesta", "Pot",
 *        "Nabrežje" -- is extracted into `type` ("Trg republike",
 *        "Cesta na Brdo").
 * Number: plain number with an optional single-letter suffix ("12a").
 * Postcode: four digits, BEFORE the city ("1000 Ljubljana"), with an optional
 *        international "SI-" prefix ("SI-2000 Maribor"). The prefix is captured
 *        into a `drop` group so a boundary trim never strands it as a token.
 */

// "Nabrežje" is intentionally NOT listed: it commonly stands alone as the whole
// street name ("Nabrežje 10"), where treating it as a prefix would wrongly pull
// the house number into the name.
const TYPES = ["Ulica", "Cesta", "Trg", "Pot", "Ul"];

export const siConfig: EuCountryConfig = {
  code: "si",
  country: "SI",
  countryNames: ["Slovenija", "Slovenia", "SVN", "SI"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Occasional date/number street names ("Cesta 24. junija").
  allowDigitsInName: true,

  // Four digits, before the city; optional "SI-" prefix dropped (see above).
  postalPattern: "(?:(?<drop>SI-))?(?<postal_code>\\d{4})",

  // House number plus an optional single-letter suffix ("12a").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
};

export default siConfig;
