import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Moldova (MD) address configuration.
 *
 * Moldova follows the Romanian addressing grammar (shared history/language):
 *   - Street TYPE leads ("Strada Ștefan cel Mare", "Bulevardul Dacia",
 *     "str. Alba-Iulia"), then the name, then the house number.
 *   - The house number is written after the name, optionally introduced by the
 *     marker "nr." (număr), which is consumed into a `drop` group.
 *   - The postal code is 4 digits with an "MD-" prefix ("MD-2001"), written
 *     BEFORE the city ("MD-2012 Chișinău"). The "MD-" literal is captured into a
 *     `drop` group so it is consumed (and excluded from token preservation).
 *   - No state/region is used in the address line.
 *
 * Sources: Poșta Moldovei (UPU member); Wikipedia "Postal codes in Moldova"
 * (MD-NNNN, first digit = postal zone); Smarty
 * (https://www.smarty.com/global-address-formatting/moldova-address-format-examples);
 * PostGrid (https://www.postgrid.com/global-address-format/moldova-address-format/);
 * GeoPostcodes (https://www.geopostcodes.com/country/moldova/address-format/).
 *
 * NOTE ON PLACEMENT: an international/courier variant writes the code LAST
 * ("..., Chișinău, MD-2012"); the domestic Poșta Moldovei order is
 * postcode-before-city (like Romania), which the parser models. Postcode-last
 * and stacked apartment-marker chains are marked __skip in the samples.
 */

const TYPES = [
  // full words (longest-first handled by the builder)
  "Bulevardul", "Șoseaua", "Soseaua", "Stradela", "Fundătura", "Intrarea",
  "Strada", "Aleea", "Calea", "Piața", "Piata", "Drumul", "Bulevard",
  // abbreviations
  "B-dul", "Bdul", "Blvd", "Bd", "Str", "Șos", "Sos", "Intr", "Ale",
  "Al", "Dr",
];

export const mdConfig: EuCountryConfig = {
  code: "md",
  country: "MD",
  countryNames: ["Republica Moldova", "Moldova", "MDA", "MD"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Keep the type spelling/abbreviation exactly as written (str. vs Strada).
  normalizeTypeCase: false,
  // Number/date street names occur ("Strada 31 August 1989", "Bulevardul
  // Cuza-Vodă"); the trailing house number (usually after "nr.") is still found
  // as the last number token.
  allowDigitsInName: true,

  // 4 digits with an optional "MD-" prefix. The prefix is captured into a drop
  // group (named `drop_1` so it does not clash with the `nr.` drop group; the
  // normalizer folds the numeric suffix, treating it as a `drop`), consumed but
  // not emitted and exempt from token preservation.
  postalPattern: "(?:(?<drop_1>MD-))?(?<postal_code>\\d{4})",

  // Optional "nr." marker (dropped), the number or "N-M" range, optional
  // one-letter suffix ("5A").
  houseNumberPattern:
    "(?:(?<drop>nr\\.?)[\\s]*)?(?<number>\\d+(?:[-–]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},

  // A single trailing unit ("ap. 25", "bl. 12"). Stacked bl./sc./et./ap. chains
  // exceed this one slot and are marked __skip in the samples.
  secUnitPattern:
    "(?<sec_unit_type>apartament|scara|scară|etaj|bloc|ap|bl|sc|et)\\.?[\\s]*(?<sec_unit_num>[\\w-]+)",
  secUnitDisplayMap: {
    ap: "ap.", apartament: "ap.",
    bl: "bl.", bloc: "bl.",
    sc: "sc.", scara: "sc.", "scară": "sc.",
    et: "et.", etaj: "et.",
  },
};

export default mdConfig;
