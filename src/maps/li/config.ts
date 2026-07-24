import type { EuCountryConfig } from "../_eu/types";

/**
 * Liechtenstein (LI) address configuration.
 *
 * Liechtenstein is inside the Swiss postal area (Swiss Post delivers; codes are
 * part of the Swiss 4-digit plan). Addressing is German, in the Swiss
 * orthography (never "ß" -> always "ss"):
 *   Order:   street name FIRST, house number AFTER ("Äulestrasse 56").
 *   Type:    FUSED into the name as a bound suffix ("-strasse", "-weg",
 *            "-gasse", "-platz"); a spaced form ("Feldkircher Strasse") splits
 *            too, and the "Str." abbreviation normalises to "Strasse".
 *   Postcode: 4-digit BEFORE the city; Liechtenstein uses 9485-9498 only. An
 *            optional legacy "FL-" prefix ("FL-9490 Vaduz") is accepted.
 *   City:    one of the 11 Gemeinden (Vaduz, Schaan, Triesen, Balzers, Eschen,
 *            Mauren, Triesenberg, Ruggell, Gamprin, Schellenberg, Planken) or a
 *            village (Nendeln, Schaanwald, Bendern). NO state/canton line.
 */

// Fused type suffixes -> canonical display form (Swiss "ss" spelling). Sorted
// longest-first at use so "strasse" wins over "str". Only productive suffixes
// that reliably carry a base name; ambiguous whole-word streets (Markt, Ring)
// are protected by the remainder-length guard, prepositional names by
// `unsplittablePrefixes`.
const FUSED: Array<[string, string]> = [
  ["strasse", "Strasse"],
  ["straße", "Strasse"],
  ["promenade", "Promenade"],
  ["platz", "Platz"],
  ["gasse", "Gasse"],
  ["halde", "Halde"],
  ["rank", "Rank"],
  ["ring", "Ring"],
  ["weg", "Weg"],
  ["hof", "Hof"],
  ["str", "Strasse"],
];

const TYPE_DISPLAY: Record<string, string> = {
  strasse: "Strasse", straße: "Strasse", str: "Strasse",
  weg: "Weg", platz: "Platz", gasse: "Gasse", halde: "Halde",
  rank: "Rank", ring: "Ring", hof: "Hof", promenade: "Promenade",
};

const TYPE_SHORT: Record<string, string> = {
  strasse: "STR", weg: "WEG", platz: "PL", gasse: "GA", halde: "HLD",
  rank: "RK", ring: "RG", hof: "HF", promenade: "PR",
};

export const liConfig: EuCountryConfig = {
  code: "li",
  country: "LI",
  countryNames: ["Liechtenstein", "Fürstentum Liechtenstein", "Fuerstentum Liechtenstein", "LIE", "FL", "LI"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",

  // 4-digit PLZ, Liechtenstein range 9485-9498; optional legacy "FL-" prefix.
  postalPattern: "(?:FL[-\\s]?)?(?<postal_code>9[45]\\d\\d)",
  // number, then optional letter suffix (glued/spaced) OR a "-14" range tail.
  houseNumberPattern:
    "(?<number>\\d+(?:\\s?[-–]\\s?\\d+)?)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?",

  fusedTypeSuffixes: FUSED,
  // A hyphen-glued last word ("St. Luzi-Strasse") must split WITHIN the word
  // ("St. Luzi" + "Strasse"), so a spaced type only wins when the last word IS
  // the type exactly ("Feldkircher Strasse").
  spacedTypeExact: true,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // Prepositional / article-led names stay whole ("Im Bretscha", "Beim Bild").
  unsplittablePrefixes: [
    "Am", "An", "An der", "Auf", "Beim", "Bei", "Im", "In", "Unter", "Ob",
    "Ober", "Unter der", "Zum", "Zur",
  ],

  // German floor/room units: "2. OG" (ordinal-first) or "Whg 4".
  secUnitPattern:
    "(?<sec_unit_num_1>\\d+)\\.\\s*(?<sec_unit_type_1>OG|UG|EG|Stock)\\b" +
    "|(?<sec_unit_type_2>Whg\\.?|Wohnung|Zimmer|Zi\\.?|Top|Stock|OG|UG|EG|Postfach)\\.?\\s*(?<sec_unit_num_2>\\d+)?",
  secUnitDisplayMap: {
    og: "OG", ug: "UG", eg: "EG", stock: "Stock", whg: "Whg",
    wohnung: "Wohnung", zimmer: "Zimmer", zi: "Zimmer", top: "Top",
  },

  poBoxNames: ["Postfach", "Pf"],
  poBoxDisplayMap: { postfach: "Postfach", pf: "Postfach" },
};

export default liConfig;
