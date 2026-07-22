import type { EuCountryConfig } from "../_eu/types";

/**
 * German (DE) address configuration.
 *
 * Order: street name first, house number after ("Bäckerstraße 12").
 * Type: fused into the name as a bound suffix ("-straße", "-weg", "-platz");
 *       also handles spaced forms ("Leipziger Straße") and the "Str." abbrev.
 * Postcode: 5-digit PLZ before the city ("10115 Berlin"), leading zeros kept.
 * No Bundesland in the address line.
 */

// Fused type suffixes, each mapped to its canonical display form. Sorted
// longest-first at use so "strasse" wins over "str". Only productive suffixes
// that reliably carry a base name are listed; ambiguous whole-word streets
// (Markt, Ring, Graben ...) are protected by the remainder-length guard, and
// prepositional names by `unsplittablePrefixes`.
const FUSED: Array<[string, string]> = [
  ["chaussee", "Chaussee"],
  ["promenade", "Promenade"],
  ["strasse", "Straße"],
  ["straße", "Straße"],
  ["allee", "Allee"],
  ["brücke", "Brücke"],
  ["brucke", "Brücke"],
  ["gasse", "Gasse"],
  ["platz", "Platz"],
  ["markt", "Markt"],
  ["stieg", "Stieg"],
  ["steig", "Steig"],
  ["deich", "Deich"],
  ["wiese", "Wiese"],
  ["zeile", "Zeile"],
  ["damm", "Damm"],
  ["ring", "Ring"],
  ["ufer", "Ufer"],
  ["pfad", "Pfad"],
  ["wall", "Wall"],
  ["weg", "Weg"],
  ["hof", "Hof"],
  ["str", "Straße"],
];

const TYPE_DISPLAY: Record<string, string> = {
  straße: "Straße",
  strasse: "Straße",
  str: "Straße",
  weg: "Weg",
  platz: "Platz",
  pl: "Platz",
  allee: "Allee",
  gasse: "Gasse",
  damm: "Damm",
  ufer: "Ufer",
  chaussee: "Chaussee",
  promenade: "Promenade",
  ring: "Ring",
  pfad: "Pfad",
  zeile: "Zeile",
  hof: "Hof",
  markt: "Markt",
  wall: "Wall",
  stieg: "Stieg",
  steig: "Steig",
  brücke: "Brücke",
  brucke: "Brücke",
  deich: "Deich",
  wiese: "Wiese",
};

const TYPE_SHORT: Record<string, string> = {
  straße: "STR",
  weg: "WEG",
  platz: "PL",
  allee: "AL",
  gasse: "GA",
  damm: "DM",
  ufer: "UF",
  chaussee: "CH",
  promenade: "PR",
  ring: "RG",
  pfad: "PF",
  zeile: "ZE",
  hof: "HF",
  markt: "MKT",
  wall: "WL",
  stieg: "STG",
  steig: "STG",
  brücke: "BR",
  deich: "DE",
  wiese: "WS",
};

export const deConfig: EuCountryConfig = {
  code: "de",
  country: "DE",
  countryNames: ["Deutschland", "Germany", "DEU", "DE"],
  order: "street-number",
  typePlacement: "fused",
  postalPlacement: "before-city",

  // Optional legacy "D-" prefix before the 5-digit PLZ ("D-10115 Berlin").
  postalPattern: "(?:D-)?(?<postal_code>\\d{5})",
  // number, then optional letter suffix (glued/spaced) OR a "-14" range tail.
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s*[-–]\\s*\\d+|\\s*[A-Za-z](?![A-Za-z0-9]))?",

  fusedTypeSuffixes: FUSED,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  unsplittablePrefixes: [
    "Am", "An", "An der", "Auf", "Auf dem", "Auf der", "Aus", "Bei", "Beim",
    "Bei den", "Hinter", "Hinter der", "Im", "In", "In der", "Unter", "Unter den",
    "Vor", "Vor dem", "Zum", "Zur", "Zu den",
  ],
  // Lexicalised square names that end in "-markt" but are single names.
  unsplittableExact: ["Neumarkt", "Altmarkt"],

  // Floor/room units in either order: "2. OG" (ordinal-first) or "Whg 4".
  secUnitPattern:
    "(?<sec_unit_num_1>\\d+)\\.\\s*(?<sec_unit_type_1>OG|UG|EG|Stock|Etage|Obergeschoss|Untergeschoss)\\b" +
    "|(?<sec_unit_type_2>Whg\\.?|Wohnung|Zimmer|Zi\\.?|Etage|Stock|OG|UG|EG|Aufgang|Aufg\\.?|Eingang)\\.?\\s*(?<sec_unit_num_2>\\d+)?",
  secUnitDisplayMap: {
    og: "OG",
    ug: "UG",
    eg: "EG",
    stock: "Stock",
    etage: "Etage",
    whg: "Whg",
    wohnung: "Wohnung",
    zimmer: "Zimmer",
    zi: "Zimmer",
    aufgang: "Aufgang",
    aufg: "Aufgang",
    eingang: "Eingang",
    obergeschoss: "OG",
    untergeschoss: "UG",
  },

  poBoxNames: ["Postfach", "Pf"],
  poBoxDisplayMap: { postfach: "Postfach", pf: "Postfach" },
};

export default deConfig;
