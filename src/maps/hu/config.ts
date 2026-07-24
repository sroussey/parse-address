import type { EuCountryConfig } from "../_eu/types";

/**
 * Hungarian (HU) address configuration.
 *
 * NATIVE ORDER IS PLACE-FIRST and BIG-ENDIAN: the postcode + city lead, then
 * the street: "1051 Budapest, Váci utca 1." (Google libaddressinput HU fmt
 * "%N%n%O%n%Z %C%n%A" -> postcode+city BEFORE the address line). The shared EU
 * ruleset only expresses STREET-core-then-PLACE, so the native place-first form
 * is NOT modellable here and is marked `__skip` in the corpus.
 *
 * What IS modelled is the STREET-FIRST rendering that international carriers and
 * databases use when normalising Hungarian addresses to the common Western
 * order: "Váci utca 1, 1051 Budapest".
 *   - Order: street name FIRST, then house number.
 *   - Type: SEPARATE trailing suffix noun -- utca (u.), út, tér, körút (krt.),
 *     köz, sétány, rakpart, fasor, sor, liget, dűlő, park. `suffix` placement.
 *   - Postcode: 4 digits, BEFORE the city on the trailing place line
 *     ("1051 Budapest"). Budapest's 1XYZ code encodes the district (XY).
 *   - House number may carry a "/A" sub-designator ("Váci utca 1/A") and a
 *     trailing dot ("1.").
 *   - Secondary unit: a floor marker "em." (emelet) / "fszt." (földszint) with
 *     its number. Floor-FIRST ("2. em. 3"), roman-floor ("II. em.") and slash
 *     floor/door ("III/21") forms are not modelled (marked `__skip`).
 *
 * Sources: Google libaddressinput HU (fmt "%N%n%O%n%Z %C%n%A", zip "\\d{4}");
 * UPU S42 Hungary profile; PostGrid/Smarty Hungary guides;
 * inyourpocket.com Budapest "Addresses".
 */

const TYPES = [
  "körútja", "sugárút", "körtér", "körút", "sétány", "rakpart", "utcája",
  "utca", "fasor", "liget", "dűlő", "köz", "sor", "útja", "tere", "tér",
  "park", "út",
  // abbreviations
  "krt.", "u.", "krt", "u",
];

export const huConfig: EuCountryConfig = {
  code: "hu",
  country: "HU",
  countryNames: ["Magyarország", "Hungary", "HUN", "HU"],
  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{4})",
  // number + optional "/A" sub-designator or "-3" building range, optional
  // trailing dot, optional single-letter civic suffix.
  houseNumberPattern:
    "(?<number>\\d+(?:[-/][A-Za-z0-9]+)?)\\.?(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Floor marker + number: "em. 5", "emelet 5", "fszt. 2".
  secUnitPattern:
    "(?<sec_unit_type>emelet|fszt|fsz|em)\\.?\\s*(?<sec_unit_num>\\d+)",
  secUnitDisplayMap: {
    em: "em.",
    emelet: "em.",
    fszt: "fszt.",
    fsz: "fszt.",
  },

  // PO box: "Postafiók" / "Pf." .
  poBoxNames: ["Postafiók", "Pf.", "Pf"],
  poBoxDisplayMap: { postafiók: "Pf.", "pf.": "Pf.", pf: "Pf." },
};

export default huConfig;
