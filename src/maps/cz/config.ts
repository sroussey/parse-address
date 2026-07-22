import type { EuCountryConfig } from "../_eu/types";

/**
 * Czech (CZ) address configuration. Most street names have no type word (the
 * name stands alone, e.g. "Národní", "Na Příkopě"); a leading "náměstí"/"nám."
 * (square) or "třída"/"tř." (avenue) may appear. Number after the street.
 * Czech uses a dual house number "descriptive/orientation" ("1903/14a"): the
 * orientation number (after the slash) is `number`, the descriptive number
 * (before the slash) is `civic_number_suffix`. Postcode "NNN NN" before the
 * city, which may carry a district number ("Praha 1").
 */

// Only these leading types are extracted; "nábřeží"/"sady"/"ulice" are kept as
// part of the whole name in the CZ corpus.
const TYPES = ["náměstí", "třída", "nám", "tř"];

export const czConfig: EuCountryConfig = {
  code: "cz",
  country: "CZ",
  countryNames: ["Česko", "Česká republika", "Czechia", "Czech Republic", "CZE", "CZ"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  cityAllowsDigits: true,
  // Date/ordinal street names are common ("28. října", "5. května").
  allowDigitsInName: true,

  // Accept "11000" and normalise to the canonical spaced "110 00".
  postalPattern: "(?<postal_code>\\d{3}\\s?\\d{2})",
  postalFormat: (raw: string) => {
    const d = String(raw).replace(/\s+/g, "");
    return `${d.slice(0, 3)} ${d.slice(3)}`;
  },
  // Dual number "descriptive/orientation": orientation (after "/") is the
  // number, descriptive (before "/") is the suffix; a single number has none.
  houseNumberPattern:
    "(?:(?<civic_number_suffix>\\d+)/)?(?<number>\\d+[a-zA-Z]?)",

  types: TYPES,
  typeDisplayMap: {},
};

export default czConfig;
