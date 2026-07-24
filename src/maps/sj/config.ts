import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Svalbard and Jan Mayen (SJ) address configuration — Norwegian (near-clone of
 * NO).
 *
 * Svalbard is a Norwegian territory and uses the Norwegian postal system. Street
 * type is fused ("Vei 200" style number-roads exist, but named roads such as
 * "Skjæringa" and settlement roads follow NO grammar) or written as a separate
 * lowercase last word. Number after the street; 4-digit postcode before the city
 * ("9170 Longyearbyen", "9173 Ny-Ålesund"). A trailing dwelling code ("H0203")
 * is the apartment (leil.).
 *
 * Sources: Posten Norge postcode ranges (91xx for Svalbard); Norwegian
 * addressing conventions. See research-sj.md.
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

export const sjConfig: EuCountryConfig = {
  code: "sj",
  country: "SJ",
  countryNames: [
    "Svalbard", "Jan Mayen", "Svalbard and Jan Mayen", "Svalbard og Jan Mayen",
    "SJM", "SJ",
  ],
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

  // No real region on Svalbard/Jan Mayen.
  countyPattern: "(?!x)x",

  // "leil. 3" or a bare dwelling code "H0203"/"U0101" -> leil.
  secUnitPattern:
    "(?<sec_unit_type>leil)\\.?\\s*(?<sec_unit_num>[\\w]+)" +
    "|(?:Bolignummer\\s+)?(?<sec_unit_num_2>[HULhul]\\d{4})",
  secUnitDisplayMap: { leil: "leil." },
  defaultSecUnitType: "leil.",
};

export default sjConfig;
