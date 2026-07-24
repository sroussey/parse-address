import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Slovak (SK) address configuration. Closely parallels Czech.
 *
 * Order: street name first, house number after ("Obchodná 12").
 * Type:  most street names carry NO type word (the name stands alone:
 *        "Obchodná", "Hlavná", "Michalská"). A leading "Námestie"/"nám."
 *        (square), "trieda"/"tr." (avenue) or "Nábrežie" (embankment) is
 *        extracted into `type`; a TRAILING one ("Hlavné námestie",
 *        "Obchodná trieda") stays inside the name with `type` null.
 * Number: like Czech, a building can carry a dual "súpisné/orientačné" number
 *        ("4015/12"): the orientation number (after "/") is `number`, the
 *        súpisné (registration) number (before "/") is `civic_number_suffix`.
 *        A single number goes to `number`.
 * Postcode: "NNN NN" (3 + space + 2) before the city, accepted unspaced too
 *        and normalised to the spaced form.
 */

const TYPES = ["námestie", "nábrežie", "trieda", "nám", "nábr", "tr"];

export const skConfig: EuCountryConfig = {
  code: "sk",
  country: "SK",
  countryNames: ["Slovensko", "Slovenská republika", "Slovakia", "SVK", "SK"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  cityAllowsDigits: true,
  // Date/ordinal street names occur ("29. augusta", "1. mája").
  allowDigitsInName: true,

  // Accept "81101" and normalise to the canonical spaced "811 01".
  postalPattern: "(?<postal_code>\\d{3}\\s?\\d{2})",
  postalFormat: (raw: string) => {
    const d = String(raw).replace(/\s+/g, "");
    return `${d.slice(0, 3)} ${d.slice(3)}`;
  },
  // Dual number "súpisné/orientačné": orientation (after "/") -> number,
  // súpisné (before "/") -> civic_number_suffix; a single number has none.
  houseNumberPattern:
    "(?:(?<civic_number_suffix>\\d+)/)?(?<number>\\d+[a-zA-Z]?)",

  types: TYPES,
  typeDisplayMap: {},
};

export default skConfig;
