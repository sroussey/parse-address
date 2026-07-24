import type { EuCountryConfig } from "../_eu/types";

/**
 * North Macedonia (MK) address configuration -- ROMANIZED (Latin) form used
 * for international / SEC filings. Native Cyrillic ("ул. Македонија 15") is
 * OUT OF SCOPE and marked __skip in the samples.
 *
 * Order: street name first, house number AFTER, with a generic type word
 *        LEADING the name -- "ul." / "ulica" (street), "bul." / "bulevar"
 *        (boulevard), "pl." / "plostad" (square): "ul. Makedonija 15".
 * Type:  a leading generic is extracted into `type`, kept verbatim
 *        (normalizeTypeCase: false). A bare untyped name is left whole.
 * Postcode: FOUR digits, AFTER the city ("Skopje 1000"), matching the form
 *        used in international filings; the shared after-city grammar makes
 *        the postcode present-or-absent forms both parse.
 * Region: the eight statistical regions are administrative-only and never
 *        written in postal addresses -> the `state` (county) slot is a
 *        never-match sentinel, disjoint from cities.
 */

const TYPES = [
  // full romanized generics (longest-first handled by the builder)
  "bulevar", "plostad", "ulica",
  // abbreviations, listed WITH the dot so they cannot eat a name's first word
  "bul.", "ul.", "pl.",
];

export const mkConfig: EuCountryConfig = {
  code: "mk",
  country: "MK",
  countryNames: [
    "North Macedonia", "Macedonia", "Severna Makedonija", "Makedonija",
    "MKD", "MK",
  ],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  // Keep the leading generic exactly as written ("ul.", "bulevar").
  normalizeTypeCase: false,

  // Four digits, after the city.
  postalPattern: "(?<postal_code>\\d{4})",

  // House number plus an optional single-letter suffix ("15a", "8").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Statistical regions are not written in addresses -> never-match sentinel
  // keeps `state` disjoint from city names.
  countyPattern: "(?!x)x",
};

export default mkConfig;
