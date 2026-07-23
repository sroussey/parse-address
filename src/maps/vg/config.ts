import type { EuCountryConfig } from "../_eu/types";

/**
 * British Virgin Islands (VG) address configuration. Like Cayman: British
 * convention (number first, trailing type), a two-level locality "Road Town,
 * Tortola" where the settlement is the city and the island is dropped, and the
 * postcode LAST (`VGNNNN`, introduced 2010 and FREQUENTLY OMITTED). Corporate
 * registered-agent addresses dominate: a named building and/or a PO box, often
 * on the reclaimed-land developments "Wickhams Cay 1 / II" (area names, not
 * streets). The postcode is optional throughout.
 */

const TYPES = [
  "Street", "Drive", "Road", "Highway", "Hill", "Bay", "Avenue", "Lane", "Way", "Rd", "Ave", "Dr", "Hwy",
];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST", drive: "DR", dr: "DR", road: "RD", rd: "RD",
  highway: "HWY", hwy: "HWY", hill: "HL", avenue: "AVE", ave: "AVE",
  lane: "LN", way: "WAY",
};

export const vgConfig: EuCountryConfig = {
  code: "vg",
  country: "VG",
  countryNames: [
    "British Virgin Islands", "Virgin Islands (British)", "BVI", "B.V.I.",
    "VG", "VGB",
  ],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  // The island ("Tortola", "Virgin Gorda", ...) trails the settlement and is
  // dropped when the settlement is the city.
  citySuffixPattern:
    "[,\\s]+(?:Tortola|Virgin\\s+Gorda|Anegada|Jost\\s+Van\\s+Dyke)",
  areaNames: [
    "Wickhams Cay 1", "Wickhams Cay 2", "Wickhams Cay I", "Wickhams Cay II",
    "Wickhams Cay", "Pasea Estate", "Road Reef",
  ],

  // VGNNNN, no separator; OPTIONAL (the shared place grammar makes the postcode
  // optional and falls back to the city-only path).
  postalPattern: "(?<postal_code>VG\\d{4})",
  postalFormat: (raw: string) => raw.toUpperCase().replace(/\s+/g, ""),
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  buildingKeywords: [
    "House", "Chambers", "Building", "Centre", "Center", "Place", "Court",
    "Mall", "Hall", "Plaza",
  ],

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>PO\\s?Box|P\\.O\\.\\s?Box|Floor|Suite|Unit|Apartment|Apt\\.?|Office|Room)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    floor: "Floor", suite: "Suite", unit: "Unit", apartment: "Apartment",
    apt: "Apt", office: "Office", room: "Room",
  },

  poBoxNames: ["PO Box", "P.O. Box", "PO BOX", "P O Box"],
  poBoxDisplayMap: { "po box": "PO Box", "p.o. box": "PO Box", "p o box": "PO Box" },
};

export default vgConfig;
