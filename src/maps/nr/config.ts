import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Nauru (NR) address configuration.
 *
 * Language: English. Order: house NUMBER first, then the street name + a
 * TRAILING English type suffix ("2 Island Ring Road"). Type echoed verbatim.
 * Postcode: NONE. Nauru has no postal-code system, so the postal slot never matches and the place tail ends at the city (and optional island).
 * Region: none written; districts/villages are the routing locality (city).
 * PO Box is the dominant address form in Nauru; "PO Box", "P.O. Box",
 * "Private Bag" and "Private Mail Bag" are all supported. A bare
 * "village, island" carries no street token and is treated as a place line
 * (village -> city, island -> state) or skipped when it has no street.
 *
 * See research-nr.md.
 */

const TYPES = [
    "Street",
    "Road",
    "Avenue",
    "Drive",
    "Lane",
    "Place",
    "Court",
    "Close",
    "Terrace",
    "Crescent",
    "Highway",
    "Boulevard",
    "Way",
    "Circle",
    "Parade",
    "Bay",
    "Point",
    "Ridge",
    "Loop",
    "Esplanade",
    "Quay",
    "Alley",
    "Centre",
    "St",
    "Rd",
    "Ave",
    "Av",
    "Dr",
    "Hwy",
    "Pl",
    "Ct",
    "Tce",
    "Cres",
  ];

const TYPE_SHORT: Record<string, string> = {
    "street": "ST",
    "st": "ST",
    "road": "RD",
    "rd": "RD",
    "avenue": "AVE",
    "ave": "AVE",
    "av": "AVE",
    "drive": "DR",
    "dr": "DR",
    "lane": "LN",
    "place": "PL",
    "pl": "PL",
    "court": "CT",
    "ct": "CT",
    "close": "CL",
    "terrace": "TER",
    "tce": "TER",
    "crescent": "CRES",
    "cres": "CRES",
    "highway": "HWY",
    "hwy": "HWY",
    "boulevard": "BLVD",
    "way": "WAY",
    "circle": "CIR",
    "parade": "PDE",
    "bay": "BAY",
    "point": "PT",
    "ridge": "RDG",
    "loop": "LOOP",
    "esplanade": "ESP",
    "quay": "QY",
    "alley": "ALY",
    "centre": "CTR",
  };


export const nrConfig: EuCountryConfig = {
  code: "nr",
  country: "NR",
  countryNames: ["Nauru", "NRU", "NR"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>(?!x)x)",
  houseNumberPattern:
    "(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep a "suburb, city" locality chain together; only a real island/region
  // may land in the state slot, so the country name never lands there.
  cityAllowsCommas: true,
  countyPattern: "(?!x)x",

  // The city capture may hold "suburb, city"; keep the last locality as the
  // routing city and drop the earlier suburb(s) losslessly.
  postNormalize: (parsed: Record<string, any>) => keepLastLocality(parsed),

  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Unit|Apartment|Apt\\.?|Suite|Room|Floor|Level)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    "flat": "Flat",
    "unit": "Unit",
    "apartment": "Apartment",
    "apt": "Apt",
    "suite": "Suite",
    "room": "Room",
    "floor": "Floor",
    "level": "Level",
  },

  poBoxNames: ["Post Office Box", "P.O. Box", "PO Box", "Private Mail Bag", "Private Bag", "P.M.B.", "PMB"],
  poBoxDisplayMap: {
    "post office box": "PO Box",
    "p.o. box": "PO Box",
    "po box": "PO Box",
    "private mail bag": "Private Mail Bag",
    "private bag": "Private Bag",
    "p.m.b.": "PMB",
    "pmb": "PMB",
  },
};

export default nrConfig;
