import type { EuCountryConfig } from "../_eu/types";

/**
 * Georgia (GE) address configuration -- ROMANIZED (Latin) form used for
 * international / SEC filings. Native Georgian (Mkhedruli) script
 * ("რუსთაველის გამზირი 12") is OUT OF SCOPE and marked __skip in the samples.
 *
 * Order: house number FIRST, then the street name + English-language type
 *        SUFFIX ("12 Rustaveli Avenue", "8 Kostava Street"). This is the form
 *        Georgian addresses take when transliterated for foreign use.
 * Type:  trailing suffix (Avenue, Street, Square, Lane, ...), kept verbatim
 *        (normalizeTypeCase: false). A bare untyped name is left whole.
 * Number: a plain number or range, with an optional glued letter ("12a").
 * Postcode: FOUR digits, written AFTER the city ("Tbilisi 0108"); the first
 *        two digits encode the region/city. The shared after-city grammar
 *        makes the postcode present-or-absent forms both parse.
 * Region (mkhare): rarely written; when present it follows the city, comma-
 *        delimited ("Telavi, Kakheti 2200"). Restricted to the curated list
 *        of the nine regions + Adjara/Tbilisi autonomies, disjoint from
 *        city names, so `state` never swallows a district.
 */

const TYPES = [
  "Avenue", "Street", "Square", "Highway", "Lane", "Alley", "Ascent",
  "Turn", "Dead End", "Drive", "Ave", "St",
];

// Nine mkhare (regions) + the Adjara autonomous republic. Multi-word names
// escape their space as \s+ (free-spacing xi mode). Kept disjoint from cities.
const REGIONS =
  "Kakheti|Imereti|Adjara|Guria|Samtskhe-Javakheti|Mtskheta-Mtianeti" +
  "|Racha-Lechkhumi|Samegrelo(?:-Zemo\\s+Svaneti)?|Kvemo\\s+Kartli" +
  "|Shida\\s+Kartli";

export const geConfig: EuCountryConfig = {
  code: "ge",
  country: "GE",
  countryNames: ["Georgia", "Sakartvelo", "GEO", "GE"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English type words echoed as written (Avenue, Street, ...).
  normalizeTypeCase: false,

  // Four-digit postal index, after the city.
  postalPattern: "(?<postal_code>\\d{4})",

  // House number: a plain number or a range ("12-14"), with an optional glued
  // letter suffix ("12a").
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // mkhare (region) after the city -> state. Curated, disjoint from cities.
  countyPattern: REGIONS,
};

export default geConfig;
