import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Armenia (AM) address configuration -- ROMANIZED (Latin) form used for
 * international / SEC filings. Native Armenian script ("Աբովյան փողոց 12") is
 * OUT OF SCOPE and marked __skip in the samples.
 *
 * Order: house number FIRST, then the street name + English-language type
 *        SUFFIX ("12 Abovyan Street", "5 Mashtots Avenue"). This is the form
 *        Armenian addresses take when transliterated for foreign use.
 * Type:  trailing suffix (Street, Avenue, Lane, Square, ...), kept verbatim
 *        (normalizeTypeCase: false). A bare untyped name is left whole.
 * Number: a plain number or range, with an optional glued letter ("12a").
 * Postcode: FOUR digits, written AFTER the city ("Yerevan 0010"). The shared
 *        after-city grammar makes the postcode present-or-absent forms parse.
 * Region (marz): rarely written; when present it follows the city, comma-
 *        delimited ("Ijevan, Tavush 3901"). Restricted to the curated list of
 *        the ten marzer, disjoint from city names (Yerevan is a city, not a
 *        marz), so `state` never swallows a district.
 */

const TYPES = [
  "Avenue", "Street", "Square", "Highway", "Lane", "Alley", "Ave", "St",
];

// Ten marzer (provinces). Multi-word Vayots Dzor escapes its space as \s+
// (free-spacing xi mode). Kept disjoint from city names.
const REGIONS =
  "Aragatsotn|Ararat|Armavir|Gegharkunik|Kotayk|Lori|Shirak|Syunik|Tavush" +
  "|Vayots\\s+Dzor";

export const amConfig: EuCountryConfig = {
  code: "am",
  country: "AM",
  countryNames: ["Armenia", "Hayastan", "ARM", "AM"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English type words echoed as written (Street, Avenue, ...).
  normalizeTypeCase: false,

  // Four-digit postal index, after the city.
  postalPattern: "(?<postal_code>\\d{4})",

  // House number: a plain number or a range ("12-14"), with an optional glued
  // letter suffix ("12a").
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // marz (province) after the city -> state. Curated, disjoint from cities.
  countyPattern: REGIONS,
};

export default amConfig;
