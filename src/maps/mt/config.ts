import type { EuCountryConfig } from "../_eu/types";

/**
 * Malta (MT) address configuration.
 *
 * Order: house/door number FIRST (often followed by a comma), then the Maltese
 *        thoroughfare type + name ("36, Triq San Pawl"). Very many Maltese
 *        addresses use a building NAME instead of a number ("Dar Malta, Triq...")
 *        or a bare building name with no Triq at all.
 * Type: leads the name (prefix) -- Maltese vocabulary (Triq = street, Vjal =
 *       avenue, Misraħ = square, Sqaq = alley, Pjazza = plaza, Xatt = wharf).
 *       English "... Street/Road" forms occur but are less common in official
 *       addressing; a bare English name simply parses with no type.
 * Secondary unit LEADS ("Flat 5, ...", "Block C, Flat 2, ..."). Only the first
 *       leading unit is captured.
 * Postcode: 3 letters + space + 4 digits ("VLT 1117"), AFTER the town.
 */

// Maltese thoroughfare types (prefix), longest handled first by the builder.
// The generic ("Triq") is a single word; the leading article of the name
// ("il-", "ir-", "tal-", "ta'", "San") stays with the NAME, not the type -- so
// composite forms are deliberately NOT listed. English "... Street/Road" forms
// are suffix-typed and out of scope here: such a name parses untyped.
const TYPES = [
  "Misraħ", "Misrah", "Pjazza", "Wesgħa", "Wesgha", "Daħla", "Dahla",
  "Trejqa", "Vjal", "Xatt", "Sqaq", "Ġnien", "Gnien", "Triq",
];

const TYPE_DISPLAY: Record<string, string> = {
  triq: "Triq",
  trejqa: "Trejqa",
  vjal: "Vjal",
  misraħ: "Misraħ",
  misrah: "Misraħ",
  pjazza: "Pjazza",
  sqaq: "Sqaq",
  xatt: "Xatt",
  wesgħa: "Wesgħa",
  wesgha: "Wesgħa",
  daħla: "Daħla",
  dahla: "Daħla",
  "ġnien": "Ġnien",
  gnien: "Ġnien",
};

const TYPE_SHORT: Record<string, string> = {
  triq: "TRQ",
  trejqa: "TRQ",
  vjal: "VJL",
  misraħ: "MSH",
  pjazza: "PJZ",
  sqaq: "SQ",
  xatt: "XATT",
  wesgħa: "WSG",
  daħla: "DHL",
  "ġnien": "GNN",
};

export const mtConfig: EuCountryConfig = {
  code: "mt",
  country: "MT",
  countryNames: ["Malta", "MLT", "MT"],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 3 letters + optional space + 4 digits. Normalised to "AAA 9999".
  postalPattern: "(?<postal_code>[A-Za-z]{3}\\s?\\d{4})",
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, 3)} ${s.slice(3)}`;
  },
  // Door number, optional letter suffix ("36A") or range ("36-38").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>\\s*[-–]\\s*\\d+|\\s*[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // The ONLY region qualifier that legitimately trails a Maltese town is the
  // island "Gozo" (Għawdex). Restricting the county slot to it is essential:
  // with the default permissive county pattern, a multi-word street name that
  // abuts the town with no comma ("Triq San Pawl, Valletta") gets mis-split --
  // the lazy prefix name stops after "San", "Pawl" is taken as the city and
  // "Valletta" as the county. Pinning the county to Gozo removes that escape
  // route, so the street name is forced to grow to the comma.
  countyPattern: "(?:Gozo|G[ħh]awdex)",

  // Building names commonly replace the number: "Milano Court", "St Rita Flats".
  buildingKeywords: ["Flats", "Buildings", "Court", "House", "Mansions"],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Maisonette|Penthouse|Block|Unit|Shop|Level)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    apartment: "Apartment",
    apt: "Apt",
    maisonette: "Maisonette",
    penthouse: "Penthouse",
    block: "Block",
    unit: "Unit",
    shop: "Shop",
    level: "Level",
  },

  poBoxNames: ["P.O. Box", "PO Box", "P O Box"],
  poBoxDisplayMap: { "p.o. box": "PO Box", "po box": "PO Box" },
};

export default mtConfig;
