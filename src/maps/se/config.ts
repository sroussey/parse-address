import type { EuCountryConfig } from "../_eu/types";

/**
 * Swedish (SE) address configuration. The street type is fused as a (usually
 * definite-form) lowercase suffix: "Drottninggatan" -> "Drottning" + "gatan",
 * "Sveavägen" -> "Svea" + "vägen". Number after the street; postcode "PPP PP"
 * before the city. Only glued suffixes split (splitSpacedType false), so a
 * modifier word stays with the name ("Stora Nygatan" -> "Stora Ny" + "gatan").
 */

const FUSED: Array<[string, string]> = [
  ["platsen", "platsen"],
  ["brinken", "brinken"],
  ["backen", "backen"],
  ["stigen", "stigen"],
  ["torget", "torget"],
  ["vägen", "vägen"],
  ["gatan", "gatan"],
  ["gränd", "gränd"],
  ["leden", "leden"],
  ["allén", "allén"],
  ["gata", "gata"],
  ["stig", "stig"],
  ["plan", "plan"],
  ["väg", "väg"],
];

const TYPE_SHORT: Record<string, string> = {
  gatan: "GT", gata: "GT", vägen: "VG", väg: "VG", torget: "TG", plan: "PL",
  platsen: "PS", gränd: "GR", brinken: "BR", leden: "LD", stigen: "ST",
  stig: "ST", backen: "BK", allén: "AL",
};

export const seConfig: EuCountryConfig = {
  code: "se",
  country: "SE",
  countryNames: ["Sverige", "Sweden", "SWE", "SE"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  splitSpacedType: false,
  minFusedStem: 2,

  // The SE corpus keeps the postcode exactly as written (spaced or not), so no
  // reformatting -- the default trim/space-collapse is enough.
  postalPattern: "(?<postal_code>\\d{3}\\s?\\d{2})",
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z])|\\s*-\\s*\\d+)?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  // Square lexicalised as a whole name (ends in -plan).
  unsplittableExact: ["Slussplan"],

  // "lgh 1201" (apartment); "tr" (floor) in either order ("3 tr" / "tr 4").
  secUnitPattern:
    "(?<sec_unit_type>lgh|lägenhet)\\.?\\s*(?<sec_unit_num>\\d+)" +
    "|(?<sec_unit_num_1>\\d+)\\s*(?<sec_unit_type_1>tr)\\b" +
    "|(?<sec_unit_type_2>tr)\\.?\\s*(?<sec_unit_num_2>\\d+)",
  secUnitDisplayMap: { lgh: "lgh", "lägenhet": "lgh", tr: "tr" },
};

export default seConfig;
