import type { EuCountryConfig } from "../_eu/types";

/**
 * Qatar (QA) address configuration.
 *
 * THERE IS NO POSTCODE. Qatar Post (Q-Post) operates no national postal-code
 * system; mail is delivered to PO boxes, and physical location uses the QNAS /
 * "Inwani" triple: Zone number, Street number, Building number. The postal
 * pattern is therefore a never-match sentinel, so every address parses through
 * the postcode-ABSENT branch of the place grammar.
 *
 * Two dominant forms:
 *   1. PO Box:    "P.O. Box 24449, Doha"  ->  sec_unit PO Box + city.
 *   2. Physical:  "Building 7, Street 830, Zone 55, Doha"
 *                 -> sec_unit Building + street ("Street 830") + city (Doha),
 *                    with the Zone (and any district) dropped.
 *
 * Order: the labelled BUILDING leads ("Building 7", "Bldg No. 7"); then the
 *        numbered street ("Street 830"), then the Zone, then the city.
 * Type:  Qatari streets are numbered ("Street 830") and parse as a whole type-
 *        less name; a few named roads carry a trailing type (Road, ...).
 * city  = the routing city (Doha, Al Rayyan, Al Wakrah, Al Khor, ...). A Zone
 *        number and any intervening district are captured with the city and then
 *        dropped (recorded so the token guard does not score them as lost) --
 *        there is no Zone field in the shared schema.
 * state = optional municipality, spelled out; usually absent (city carries it).
 *
 * KNOWN GAPS (see research-qa.md): the Zone number is not represented (no schema
 * field); a Zone-first / Street-first written order (rather than Building-first)
 * is a documented failure mode; a "Building No." with the "No" marker is folded.
 */

const TYPES = ["Boulevard", "Street", "Avenue", "Road", "Corniche", "Blvd", "Rd", "St"];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE",
  road: "RD", rd: "RD",
};

// NOTE: Qatar's municipality names (Al Rayyan, Al Wakrah, Al Khor, ...) double as
// the CITY on most labels, so they are intentionally NOT modelled as a distinct
// `state`; a trailing municipality is kept as the routing `city`. There is no
// separate state field for Qatar.

export const qaConfig: EuCountryConfig = {
  code: "qa",
  country: "QA",
  countryNames: ["Qatar", "State of Qatar", "QAT", "QA"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // NO postal code: never-match sentinel -> postcode-absent place branch.
  postalPattern: "(?<postal_code>(?!x)x)",

  // A bare leading building number is rare (the labelled "Building N" leads via
  // the secondary unit); keep a permissive digit run for the odd untagged case.
  houseNumberPattern: "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "Zone NN, [District,] City" chain together; drop everything but the
  // routing city in postNormalize. A never-match county sentinel stops the shared
  // grammar from splitting a locality (e.g. a municipality-named city) into state.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  // Building / villa / office / floor lead-in ("Building 7", "Bldg No. 7").
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Building|Bldg\\.?|Villa|Office|Apartment|Apt\\.?|Flat|Floor|Unit|Shop|Tower)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    building: "Building",
    bldg: "Building",
    villa: "Villa",
    office: "Office",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    floor: "Floor",
    unit: "Unit",
    shop: "Shop",
    tower: "Tower",
  },

  // Q-Post uses PO Box exclusively (no street-delivery postcode).
  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default qaConfig;
