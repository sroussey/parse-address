import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Romanian (RO) address configuration.
 *
 * Order: street TYPE leads ("Strada Popa Nan", "Calea Victoriei",
 *        "Bulevardul Unirii"), then the name, then the house number.
 * Number: written after the name, optionally introduced by the marker "nr."
 *        (număr). The marker is captured into a `drop` group so it is consumed
 *        but not emitted (and excluded from the token-preservation count). A
 *        range ("49-53") stays whole in `number`; a trailing letter ("5A") goes
 *        to `civic_number_suffix`.
 * Region: județ (county), written AFTER the city with a "jud."/"județul"
 *        marker, mapped to `state` (marker consumed, county name kept as-is).
 * Postcode: six digits, no space, BEFORE the city ("415101 București"), per
 *        Poșta Română / UPU / Google libaddressinput ("%Z %C").
 *
 * NOTE ON PLACEMENT: some couriers write the postcode last ("City, jud., NNNNNN")
 * and stack unit markers "bl./sc./et./ap." between the number and the place.
 * The authoritative postal order is postcode-before-city with a single trailing
 * unit; postcode-last and multi-unit stacks are marked __skip in the samples.
 */

const TYPES = [
  // full words (longest-first handled by the builder)
  "Bulevardul", "Șoseaua", "Soseaua", "Splaiul", "Intrarea", "Fundătura",
  "Strada", "Aleea", "Calea", "Piața", "Piata", "Drumul", "Bulevard",
  // abbreviations
  "B-dul", "Bdul", "Blvd", "Bd", "Str", "Șos", "Sos", "Splai", "Intr",
  "Ale", "Dr", "Al",
];

export const roConfig: EuCountryConfig = {
  code: "ro",
  country: "RO",
  countryNames: ["România", "Romania", "ROU", "RO"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Keep the type spelling/abbreviation exactly as written (Str. vs Strada).
  normalizeTypeCase: false,
  // Number/date street names occur ("Bulevardul 1 Decembrie 1918",
  // "Strada 13 Septembrie", "Calea 9 Mai"); the trailing house number (usually
  // after "nr.") is still found as the last number token.
  allowDigitsInName: true,

  // Six digits, no separator, before the city.
  postalPattern: "(?<postal_code>\\d{6})",

  // Optional "nr." marker (dropped), the number or "N-M" range, optional
  // one-letter suffix ("5A").
  houseNumberPattern:
    "(?:(?<drop>nr\\.?)[\\s]*)?(?<number>\\d+(?:[-–]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},

  // județ (county) -> state. Marker consumed; county name kept verbatim.
  regionPattern:
    "(?:jude[țt]ul|jude[țt]|jud\\.?)[\\s]+(?<state>[^,\\d\\n]+?)",

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

export default roConfig;
