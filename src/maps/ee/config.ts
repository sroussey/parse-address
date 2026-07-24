import type { EuCountryConfig } from "../_eu/types";

/**
 * Estonian (EE) address configuration.
 *
 * Order: street name FIRST, then house number ("Pikk 41", "Mäe 40").
 * Type: the generic word is a SEPARATE trailing suffix word, written with a
 *       space -- "Pärnu maantee", "Endla tänav", "Vabaduse puiestee" -- and is
 *       frequently ABSENT (the name stands alone: "Pikk", "Lai", "Gonsiori").
 *       So `suffix` placement with the type optional (bare names fall through to
 *       the untyped alternative). Common abbreviations: mnt (maantee), pst
 *       (puiestee), tn (tänav).
 * Postcode: 5-digit index BEFORE the city ("80040 Pärnu"), leading zeros kept.
 * A trailing "-NN" on the house number is the apartment (korter): "Aardla
 *       130-44" = house 130, apt 44.
 * No state/region on the delivery line (a 3-letter county code sometimes trails
 *       on domestic mail; not modelled).
 *
 * Sources: Google libaddressinput EE (fmt "%N%n%O%n%A%n%Z %C", zip "\\d{5}");
 * Omniva (omniva.ee) postcode search; Smarty/PostGrid Estonia format guides.
 */

const TYPES = [
  // full words (longest first is handled by the builder)
  "maantee", "puiestee", "tänav", "väljak", "põik", "allee", "plats", "tee",
  // abbreviations, dotted and bare
  "mnt.", "pst.", "tn.", "mnt", "pst", "tn",
];

export const eeConfig: EuCountryConfig = {
  code: "ee",
  country: "EE",
  countryNames: ["Eesti", "Estonia", "EST", "EE"],
  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "before-city",
  // Estonian type words/abbreviations are echoed as written.
  normalizeTypeCase: false,

  // 5-digit index, leading zeros significant.
  postalPattern: "(?<postal_code>\\d{5})",
  // number, optional single-letter civic suffix (glued or spaced: "5a", "18 A"),
  // and an optional "-NN" apartment (korter) glued to the number ("130-44").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?(?:\\s*-\\s*(?<sec_unit_num>\\d+[A-Za-z]?))?",

  types: TYPES,
  typeDisplayMap: {},

  // The hyphen apartment has no keyword of its own -> label it korter.
  defaultSecUnitType: "krt",
  secUnitDisplayMap: { krt: "krt" },

  // PO box: "Postkast" / "P.K." (also seen as PK).
  poBoxNames: ["Postkast", "P.K.", "PK", "Pk"],
  poBoxDisplayMap: { postkast: "Postkast", "p.k.": "Postkast", pk: "Postkast" },
};

export default eeConfig;
