import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Tokelau (TK) address configuration.
 *
 * A tiny New Zealand territory of three atolls (Atafu, Nukunonu, Fakaofo) with
 * NO formal street naming and NO postal-code system. Mail is routed by PO box /
 * general delivery via Apia, Samoa, addressed to a person and their atoll
 * village.
 *
 * Convention (English): where a street token exists it is number-first with a
 * trailing type, but in practice almost no addresses carry a street. The atoll /
 * village is the routing locality and maps to `city`. There is no postcode
 * (never-matching sentinel) and no sub-region (county slot disabled), so a bare
 * "village, Tokelau" line has no anchor to parse as a pure locality and is
 * marked __skip; addressable lines are PO-box lines whose village lands in
 * `city`.
 *
 * PO Box: the normal form ("PO Box 10, Atafu, Tokelau").
 *
 * Sources: New Zealand Post / Tokelau addressing note; UPU note. See
 * research-tk.md.
 */

const TYPES = [
  "Road", "Street", "Lane", "Avenue", "Drive", "Way", "Path",
  // abbreviations
  "Rd", "St", "Ave", "Dr",
];

const TYPE_SHORT: Record<string, string> = {
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
  lane: "LN",
  avenue: "AVE", ave: "AVE",
  drive: "DR", dr: "DR",
  way: "WAY",
  path: "PATH",
};

export const tkConfig: EuCountryConfig = {
  code: "tk",
  country: "TK",
  countryNames: ["Tokelau", "TKL", "TK"],
  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // No postcodes: never-matching sentinel keeps the place tail postcode-free.
  postalPattern: "(?<postal_code>(?!x)x)",

  // Number first (rare): plain, range, optional glued letter, "#".
  houseNumberPattern:
    "\\#?\\s*(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,
  articleNames: ["The"],

  // No sub-region field: forbid anything landing in the state slot.
  countyPattern: "(?!x)x",

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Unit|Apartment|Apt\\.?|Room|House)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat", unit: "Unit", apartment: "Apartment", apt: "Apt",
    room: "Room", house: "House",
  },

  poBoxNames: ["Post Office Box", "P.O. Box", "PO Box", "PO BOX", "P O Box", "Private Bag"],
  poBoxDisplayMap: {
    "post office box": "PO Box", "p.o. box": "PO Box", "po box": "PO Box",
    "p o box": "PO Box", "private bag": "Private Bag",
  },
};

export default tkConfig;
