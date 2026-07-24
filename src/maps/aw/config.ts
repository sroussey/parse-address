import type { EuCountryConfig } from "../_eu/types";

/**
 * Aruba (AW) address configuration — Dutch (near-clone of NL).
 *
 * Aruba is a constituent country of the Kingdom of the Netherlands and uses
 * Dutch-style addressing: street name FIRST, house number AFTER
 * ("Wilhelminastraat 4"). Street type is fused as a glued lowercase suffix
 * ("-straat", "-weg", "-plein"), kept verbatim; many streets ("Caya G.F. Betico
 * Croes", "L.G. Smith Boulevard") carry no separable fused type.
 * Postcode: NONE. Aruba has no postal-code system (mail is routed by
 *        town/district), so the postcode slot is a never-match sentinel and the
 *        place tail is just the town ("Oranjestad", "San Nicolas", "Noord").
 *
 * Sources: Aruban addressing conventions (Kingdom of the Netherlands); Universal
 * Postal Union — Aruba has no postcode. See research-aw.md.
 */

const FUSED: Array<[string, string]> = [
  ["straat", "straat"],
  ["gracht", "gracht"],
  ["singel", "singel"],
  ["schans", "schans"],
  ["plein", "plein"],
  ["dreef", "dreef"],
  ["markt", "markt"],
  ["steeg", "steeg"],
  ["kade", "kade"],
  ["dijk", "dijk"],
  ["laan", "laan"],
  ["baan", "baan"],
  ["hof", "hof"],
  ["weg", "weg"],
  ["pad", "pad"],
];

const TYPE_SHORT: Record<string, string> = {
  straat: "STR", gracht: "GR", singel: "SNG", schans: "SCH", plein: "PLN",
  dreef: "DRF", markt: "MKT", steeg: "STG", kade: "KD", dijk: "DK",
  laan: "LN", baan: "BN", hof: "HF", weg: "WG", pad: "PD",
};

export const awConfig: EuCountryConfig = {
  code: "aw",
  country: "AW",
  countryNames: ["Aruba", "ABW", "AW"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",
  // Dutch fused types are lowercase and kept verbatim ("straat", "weg").
  normalizeTypeCase: false,

  // No postcode system -> never-match sentinel (the before-city grammar makes
  // the postcode block optional, so it is simply skipped).
  postalPattern: "(?<postal_code>(?!x)x)",
  // number, then either a "-<toevoeging>" (dash dropped: "92-3" -> "3") or a
  // (possibly spaced) letter block ("92A", "27bis", "114 C").
  houseNumberPattern:
    "(?<number>\\d+)(?:-\\s?(?<civic_number_suffix>\\w+)|\\s?(?<civic_number_suffix_2>bis(?:\\s+[A-Za-z](?![A-Za-z]))?|[A-Za-z]{1,3}(?![A-Za-z])))?",

  fusedTypeSuffixes: FUSED,
  splitSpacedType: false,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // No real region on Aruba.
  countyPattern: "(?!x)x",

  poBoxNames: ["Postbus", "Antwoordnummer"],
  poBoxDisplayMap: { postbus: "Postbus", antwoordnummer: "Antwoordnummer" },
};

export default awConfig;
