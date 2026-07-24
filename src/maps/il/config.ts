import type { EuCountryConfig } from "../_eu/types";

/**
 * Israel (IL) address configuration. SEC code L3.
 *
 * Order: house NUMBER first, then the street name ("3 Ben Yehuda"). No street
 *        type word in the normal case (typePlacement "none"); descriptors such
 *        as Sderot/Derech/Rehov/Kikar are part of the street NAME, not a type.
 * Postcode: 5-digit (legacy) or 7-digit (mic7, 2013+), written LAST after the
 *        city in the romanized comma form this parser targets (after-city).
 * No state/region: Israeli addresses carry no admin district on the label.
 *
 * NOTE ON ORDER: Israel Post's official multi-line label writes the postcode
 * BEFORE the city ("6100000 Tel Aviv-Yafo"). This config targets the far more
 * common romanized single-line business form ("..., Tel Aviv-Yafo, 6100000")
 * and treats the label order as an unhandled failure mode (see research-il.md).
 */

export const ilConfig: EuCountryConfig = {
  code: "il",
  country: "IL",
  countryNames: ["Israel", "Yisrael", "ISR", "IL", "ישראל"],

  order: "number-street",
  // Most Israeli streets carry no type word (the Hebrew descriptor Sderot/Derech/
  // Rehov/Kikar leads the name and stays in it); a minority of romanized addresses
  // use an English trailing type ("HaArba'a Street"). "suffix" with a greedy name
  // captures the whole multi-word name ("Ben Yehuda") and peels a trailing English
  // type when present. Hebrew descriptors are deliberately NOT in the type list.
  typePlacement: "suffix",
  normalizeTypeCase: false,
  postalPlacement: "after-city",

  // 7-digit mic7 (5 + optional space + 2) OR legacy 5-digit. Normalised to
  // digits-only by postalFormat.
  postalPattern: "(?<postal_code>\\d{5}(?:\\s?\\d{2})?)",
  postalFormat: (raw: string) => raw.replace(/\s+/g, ""),

  // number (or "24-26" range kept in number), then an optional glued
  // single-letter civic suffix ("12A" -> number 12, suffix A).
  houseNumberPattern:
    "(?<number>\\d+(?:\\s*[-–]\\s*\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  // English trailing types only; Hebrew descriptors stay inside the name.
  types: ["Street", "Road", "Boulevard", "Avenue", "Lane", "Way"],
  typeDisplayMap: {},
  typeShortCodeMap: {
    street: "ST", road: "RD", boulevard: "BLVD", avenue: "AVE", lane: "LN", way: "WAY",
  },

  // Multi-word, hyphenated and apostrophed cities (Tel Aviv-Yafo, Be'er Sheva,
  // Rishon LeZion). Commas are NOT allowed inside the city.
  // (city capture is handled by the shared grammar; no citySuffix needed.)

  // Apartment / entrance / floor, trailing after the street. Entrance number
  // may be a bare letter ("Entrance B").
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Dira|Entrance|Entr\\.?|Knisa|Floor|Koma|Fl\\.?)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    apartment: "Apartment",
    apt: "Apt",
    dira: "Apartment",
    entrance: "Entrance",
    entr: "Entrance",
    knisa: "Entrance",
    floor: "Floor",
    koma: "Floor",
    fl: "Floor",
  },

  poBoxNames: ["PO Box", "P.O. Box", "PO BOX", "T.D.", "TD"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "t.d.": "T.D.",
    td: "T.D.",
  },
};

export default ilConfig;
