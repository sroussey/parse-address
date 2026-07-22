import type { EuCountryConfig } from "../_eu/types";

/**
 * Norwegian (NO) address configuration. The street type is fused
 * ("Storgata" -> "Stor" + "gata", "Kirkeveien" -> "Kirke" + "veien") or written
 * as a separate lowercase last word ("Karl Johans gate" -> "Karl Johans" +
 * "gate"). Number after the street; 4-digit postcode before the city. A trailing
 * dwelling code ("H0203") is the apartment (leil.).
 */

const FUSED: Array<[string, string]> = [
  ["allmenningen", "almenningen"],
  ["almenningen", "almenningen"],
  ["torget", "torget"],
  ["veien", "veien"],
  ["vegen", "vegen"],
  ["gaten", "gaten"],
  ["plassen", "plassen"],
  ["svingen", "svingen"],
  ["bakken", "bakken"],
  ["gata", "gata"],
  ["gate", "gate"],
  ["alle", "alle"],
  ["allé", "allé"],
  ["vei", "vei"],
  ["veg", "veg"],
  ["sti", "sti"],
];

const TYPE_SHORT: Record<string, string> = {
  gata: "GT", gate: "GT", gaten: "GT", veien: "VN", vei: "VN", vegen: "VN",
  veg: "VN", torget: "TG", plassen: "PL", allé: "ALL", alle: "ALL",
  almenningen: "ALM", svingen: "SV", bakken: "BK", sti: "STI",
};

export const noConfig: EuCountryConfig = {
  code: "no",
  country: "NO",
  countryNames: ["Norge", "Noreg", "Norway", "NOR", "NO"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  splitSpacedType: true,
  spacedTypeExact: true,

  postalPattern: "(?<postal_code>\\d{4})",
  // number, then a (possibly spaced) letter suffix NOT followed by digits (so a
  // dwelling code "H0203" is left for the unit), or a range tail ("-14").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z0-9])|\\s*-\\s*\\d+)?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // "leil. 3" or a bare dwelling code "H0203"/"U0101" -> leil.
  secUnitPattern:
    "(?<sec_unit_type>leil)\\.?\\s*(?<sec_unit_num>[\\w]+)" +
    "|(?:Bolignummer\\s+)?(?<sec_unit_num_2>[HULhul]\\d{4})",
  secUnitDisplayMap: { leil: "leil." },
  defaultSecUnitType: "leil.",
};

export default noConfig;
