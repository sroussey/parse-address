import type { EuCountryConfig } from "../_eu/types";

/**
 * Bulgaria (BG) address configuration -- ROMANIZED (Latin) form used for
 * international / SEC filings. Native Cyrillic ("ул. Витоша 15") is OUT OF
 * SCOPE and marked __skip in the samples (the type/city vocab and the
 * `[^,\d]` name classes are Latin).
 *
 * Order: street name first, house number AFTER, with a generic type word
 *        LEADING the name -- "ul." / "ulitsa" (street), "bul." / "bulevard"
 *        (boulevard), "pl." / "ploshtad" (square): "ul. Vitosha 15".
 * Type:  a leading generic is extracted into `type`, kept verbatim
 *        (normalizeTypeCase: false) so "ul." echoes as "ul.". A bare untyped
 *        name is left whole.
 * Postcode: FOUR digits, no space, BEFORE the city ("1000 Sofia"), per the
 *        Bulgarian Posts / UPU / Google libaddressinput order ("%Z %C"). The
 *        shared before-city grammar makes the postcode optional, so
 *        "ul. Vitosha 15, Sofia" (postcode omitted) also parses.
 * Region (oblast): rarely written and almost always shares its name with a
 *        city (Plovdiv, Varna, Burgas...), so it is left unmodelled -- the
 *        `state` group is a never-match sentinel to keep it disjoint from
 *        cities.
 */

const TYPES = [
  // full romanized generics (longest-first handled by the builder)
  "bulevard", "ulitsa", "ploshtad",
  // abbreviations, listed WITH the dot so they cannot eat a name's first word
  "bul.", "ul.", "pl.",
];

export const bgConfig: EuCountryConfig = {
  code: "bg",
  country: "BG",
  countryNames: ["Bulgaria", "Bulgariya", "BGR", "BG"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  // Keep the leading generic exactly as written ("ul.", "bulevard").
  normalizeTypeCase: false,

  // Four digits, before the city.
  postalPattern: "(?<postal_code>\\d{4})",

  // House number plus an optional single-letter suffix ("15A", "8").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Oblast shares names with cities and is rarely written -> never-match.
  regionPattern: "(?<state>(?!x)x)",
};

export default bgConfig;
