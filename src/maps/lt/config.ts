import type { EuCountryConfig } from "../_eu/types";

/**
 * Lithuanian (LT) address configuration.
 *
 * Order: street name FIRST, then house number ("Gedimino pr. 9",
 *        "Vilniaus g. 1").
 * Type: SEPARATE trailing suffix noun, almost always ABBREVIATED with a dot --
 *        "g." (gatvė, street), "pr." (prospektas, avenue), "al." (alėja),
 *        "a." (aikštė, square) -- so `suffix` placement with the dotted forms in
 *        the type list; the type is optional.
 * Postcode: 5 digits, canonical "LT-" prefix, written BEFORE the city
 *        ("LT-01103 Vilnius"; the prefix is often dropped domestically:
 *        "08117 Vilnius"). Normalised to "LT-NNNNN".
 * A trailing "-NN" on the house number is the apartment (butas): "g. 5-12".
 *
 * NOTE ON ORDER: the task brief sketched LT as "City LT-NNNNN" (postcode after
 * city), but Google libaddressinput (fmt "%O%n%N%n%A%nLT-%Z %C") and postal
 * guides (Smarty "08117 Vilnius") place the postcode BEFORE the city. Following
 * the sourced canonical order, this config uses `before-city`; the after-city
 * rendering is included in the corpus as `__skip`.
 *
 * Sources: Google libaddressinput LT (fmt "%O%n%N%n%A%nLT-%Z %C", zip "\\d{5}",
 * postprefix "LT-"); Smarty/Umbrex Lithuania format guides.
 */

const TYPES = [
  "prospektas", "skersgatvis", "aikštė", "gatvė", "alėja", "kelias",
  "plentas", "krantinė", "takas",
  // abbreviations (dotted)
  "pr.", "al.", "pl.", "g.", "a.",
];

export const ltConfig: EuCountryConfig = {
  code: "lt",
  country: "LT",
  countryNames: ["Lietuva", "Lithuania", "LTU", "LT"],
  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Optional "LT-" prefix + 5 digits, normalised to the canonical "LT-NNNNN".
  postalPattern: "(?<postal_code>(?:LT[-\\s]?)?\\d{5})",
  postalFormat: (raw: string) => `LT-${String(raw).replace(/[^\d]/g, "")}`,

  // The street type is a separate word here (unlike the fused DE/FI streets that
  // absorb a country postcode prefix into their split), so a source WITHOUT the
  // "LT-" prefix would leave the bare 5 digits sitting in the street segment and
  // be miscounted as a lost street token. Exempt the bare digits from the
  // token-preservation guard so both "LT-08117 Vilnius" and "08117 Vilnius" pass.
  postNormalize: (parsed: Record<string, any>) => {
    if (parsed.postal_code) {
      parsed.__dropped = [String(parsed.postal_code).replace(/[^\d]/g, "")];
    }
  },

  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?(?:\\s*-\\s*(?<sec_unit_num>\\d+[A-Za-z]?))?",

  types: TYPES,
  typeDisplayMap: {},

  defaultSecUnitType: "bt.",
  secUnitDisplayMap: { "bt.": "bt.", bt: "bt." },

  // PO box: "a. d." / "a.d." (abonentinė dėžutė).
  poBoxNames: ["a. d.", "a.d.", "Abonentinė dėžutė"],
  poBoxDisplayMap: {
    "a. d.": "a.d.",
    "a.d.": "a.d.",
    "abonentinė dėžutė": "a.d.",
  },
};

export default ltConfig;
