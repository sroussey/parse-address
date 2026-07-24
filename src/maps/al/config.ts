import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Albanian (AL) address configuration.
 *
 * Order: street name first, house number after. The generic ALWAYS LEADS in
 *        Albanian ("Rruga Myslym Shyri 8", "Bulevardi Dëshmorët e Kombit 12",
 *        "Sheshi Skënderbej 3"), so unlike the BCMS siblings there is no
 *        trailing-generic case to worry about.
 * Type:  a leading "Rruga" (street), "Bulevardi" (boulevard), "Sheshi" (square)
 *        or "Lagjja" (neighbourhood) is extracted into `type`; the abbreviations
 *        "Rr." / "Bul." are also accepted. A bare untyped name is left whole.
 * Postcode: four digits, BEFORE the city ("1001 Tiranë"), per Google
 *        libaddressinput `AL` (`%A%n%Z %C`, postal regex `\d{4}`). The postcode
 *        is OFTEN OMITTED in practice, so the shared before-city grammar (which
 *        makes the postcode optional) fits: "Rruga Myslym Shyri 8, Tiranë".
 *        NB: some corpora write the postcode AFTER the city ("Durrës 2001");
 *        that ordering is not modelled here (see research §7).
 * No region (qark) line in postal addresses.
 */

const TYPES = [
  "Bulevardi", "Bulevard", "Sheshi", "Lagjja", "Rruga", "Rrugë",
  // common abbreviations
  "Bul", "Rr",
];

export const alConfig: EuCountryConfig = {
  code: "al",
  country: "AL",
  countryNames: ["Shqipëria", "Shqipëri", "Albania", "Shqiperi", "ALB", "AL"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Keep the leading type spelling exactly as written ("Rruga", "Rr.").
  normalizeTypeCase: false,

  // Four digits, before the city; optional international "AL-" prefix captured
  // into a `drop` group (consumed, not emitted) so a boundary trim never strands
  // it as a lost street token (same treatment as HR's "HR-").
  postalPattern: "(?:(?<drop>AL-))?(?<postal_code>\\d{4})",

  // House number plus an optional single-letter suffix ("12a", "8").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
};

export default alConfig;
