import type { EuCountryConfig } from "../_eu/types";

/**
 * Austrian (AT) address configuration. Like Germany (street name first, house
 * number after, fused/spaced German street types) but with a 4-digit PLZ (not
 * 5) and Viennese sub-building units: "Top" (apartment), "Stiege" (staircase),
 * and the slash form where "N/M" is a Tür (door) and "N/M/K" a Stiege.
 */

const FUSED: Array<[string, string]> = [
  ["bundesstraße", "Bundesstraße"],
  ["hauptstraße", "Hauptstraße"],
  ["wienzeile", "Wienzeile"],
  ["strasse", "Straße"],
  ["straße", "Straße"],
  ["promenade", "Promenade"],
  ["gürtel", "Gürtel"],
  ["gasse", "Gasse"],
  ["platz", "Platz"],
  ["allee", "Allee"],
  ["markt", "Markt"],
  ["zeile", "Zeile"],
  ["lände", "Lände"],
  ["ring", "Ring"],
  ["kai", "Kai"],
  ["weg", "Weg"],
  ["str", "Straße"],
];

const TYPE_SHORT: Record<string, string> = {
  straße: "STR", hauptstraße: "HSTR", bundesstraße: "BSTR", gasse: "GA",
  platz: "PL", allee: "AL", markt: "MKT", zeile: "ZE", ring: "RG", weg: "WEG",
  gürtel: "GT", kai: "KAI", lände: "LD", wienzeile: "WZ", promenade: "PR",
};

export const atConfig: EuCountryConfig = {
  code: "at",
  country: "AT",
  countryNames: ["Österreich", "Oesterreich", "Austria", "AUT", "AT"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Optional legacy "A-" prefix before the 4-digit PLZ ("A-1010 Wien").
  postalPattern: "(?:A-)?(?<postal_code>\\d{4})",
  // number, optional letter/range suffix, and an optional slash sub-unit tail
  // ("/3" or "/2/19"), resolved to Tür/Stiege in postNormalize.
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[a-zA-Z](?![a-zA-Z0-9])|\\s*-\\s*\\d+)?(?<at_slash>(?:/\\d+)+)?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  unsplittablePrefixes: [
    "Am", "An", "An der", "Auf", "Auf der", "Bei", "Beim", "Hinter", "Im",
    "In", "In der", "Unter", "Vor", "Zum", "Zur",
  ],
  // Market-square names lexicalised as whole names (end in -markt).
  unsplittableExact: ["Kohlmarkt", "Naschmarkt", "Niedermarkt"],

  // Spaced units: "Top 5", "Stiege 3" / "Stg. 3", "Tür 4".
  secUnitPattern:
    "(?<sec_unit_type>Top|Stiege|Stg\\.?|Tür|Tuer)\\.?\\s*(?<sec_unit_num>\\d+)?",
  secUnitDisplayMap: {
    top: "Top", stiege: "Stiege", stg: "Stiege", "tür": "Tür", tuer: "Tür",
  },

  poBoxNames: ["Postfach"],
  poBoxDisplayMap: { postfach: "Postfach" },

  postNormalize: (parsed) => {
    // "N/M" -> Tür M; "N/M/K..." -> Stiege M (first sub-number).
    if (parsed.at_slash) {
      const parts = String(parsed.at_slash).split("/").filter(Boolean);
      if (!parsed.sec_unit_type && parts.length) {
        parsed.sec_unit_type = parts.length >= 2 ? "Stiege" : "Tür";
        parsed.sec_unit_num = parts[0];
      }
      delete parsed.at_slash;
    }
  },
};

export default atConfig;
