import type { EuCountryConfig } from "../_eu/types";

/**
 * Gibraltar (GI) address configuration. A British Overseas Territory addressed
 * in UK style; the whole territory shares effectively ONE postcode, `GX11 1AA`,
 * which is optional for local mail (many valid addresses omit it). The locality
 * is always "Gibraltar" (which doubles as the country line). Many streets have
 * no trailing type (Town Range, Queensway, Irish Town). Corporate offices lead
 * with a named building and frequently carry a Suite/Unit/Block with a dotted
 * compound number ("Suite 4.3.02"), so `buildingKeywords` is enabled and the
 * unit number allows dots.
 */

const TYPES = [
  "Street", "Road", "Lane", "Avenue", "Close", "Court", "Terrace", "Place",
  "Ramp", "Steps", "Passage", "Way", "Wharf", "Square", "Parade", "Rd",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", road: "RD", rd: "RD", lane: "LN", avenue: "AVE",
  close: "CL", court: "CT", terrace: "TER", place: "PL", way: "WAY",
  wharf: "WHF", passage: "PAS", square: "SQ", parade: "PDE",
};

export const giConfig: EuCountryConfig = {
  code: "gi",
  country: "GI",
  countryNames: ["Gibraltar", "GI", "GIB"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  countyPattern: "(?!x)x", // no county/state field in these jurisdictions
  // Only "Midtown" is a dropped district; Ocean Village / Marina Bay etc. are
  // streets or building names in real usage, so they are NOT listed here.
  areaNames: ["Midtown"],

  // The single Gibraltar postcode; optional (the shared place grammar allows a
  // city-only tail with no postcode).
  postalPattern: "(?<postal_code>GX\\d{2}\\s*\\d[A-Za-z]{2})",
  postalFormat: (raw: string) => {
    const s = raw.toUpperCase().replace(/\s+/g, "");
    return `${s.slice(0, -3)} ${s.slice(-3)}`;
  },
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // Pure building nouns only -- disjoint from TYPES (no Court/Place/Wharf).
  buildingKeywords: [
    "House", "Building", "Centre", "Center", "Tower", "Towers", "Chambers",
    "Hall", "Suites", "ICC", "Complex",
  ],
  buildingTypeKeywords: ["Court", "Place"],

  secUnitPlacement: "before",
  // Gibraltar units carry dotted/compound numbers ("4.3.02", "F7").
  secUnitPattern:
    "(?<sec_unit_type>PO\\s?Box|P\\.O\\.\\s?Box|Floor|Suite|Unit|Block|Apartment|Apt\\.?|Flat|Office|Room)\\.?\\s*(?<sec_unit_num>[\\w.-]+)?",
  secUnitDisplayMap: {
    floor: "Floor", suite: "Suite", unit: "Unit", block: "Block",
    apartment: "Apartment", apt: "Apt", flat: "Flat", office: "Office",
    room: "Room",
  },

  poBoxNames: ["PO Box", "P.O. Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: { "po box": "PO Box", "p.o. box": "PO Box", "p o box": "PO Box" },
};

export default giConfig;
