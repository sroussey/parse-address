import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Afghanistan (AF) address configuration — Latin transliteration for SEC /
 * international filings. Native Perso-Arabic (Dari/Pashto, RTL) script is OUT OF
 * SCOPE.
 *
 * Dominant transliterated form (small-endian):
 *   "House 12, Street 4, Wazir Akbar Khan, Kabul"
 *   "House 5, Darulaman Road, Karte Se, Kabul"
 *   -> building(House) + street + area(as city) + province(as state).
 *
 * Order: a building "House N" LEADS. It is modelled as a secondary unit
 *        (sec_unit_type "House") rather than a civic number, matching Afghan
 *        usage where "House N" labels the dwelling, not a street-position number.
 * Street: TWO common shapes, both handled by a single suffix grammar with a
 *        digit-admitting name:
 *          - numbered street  "Street 4" / "Kucha 4" -> whole, type-less street
 *            "Street 4" (the name admits the trailing digit).
 *          - named road       "Darulaman Road" -> street "Darulaman" + type
 *            "Road".
 * city  = the AREA / neighbourhood (Wazir Akbar Khan, Shahr-e Naw, Karte Se,
 *        Taimani, ...) — or a numbered district ("District 4", "Nahia 10"), so
 *        the city slot admits digits.
 * state = the PROVINCE, RESTRICTED to the 34-province list so it stays disjoint
 *        from the area/city names (which are never province names). When only one
 *        locality precedes the province, that locality is the city and the
 *        province is the state; a lone locality falls into `city` (documented gap).
 * Postcode: a 4-digit code EXISTS but is rarely written; modelled OPTIONAL,
 *        after-city ("Kabul 1001").
 *
 * KNOWN GAPS (see research-af.md): three-or-more-locality chains
 *   ("Street 3, Karte Se, District 3, Kabul") exceed one area + one province and
 *   are __skip'd; a single locality after the street lands in `city` even when it
 *   is really the province. Native-script samples are __skip'd (out of scope).
 */

const TYPES = [
  "Boulevard", "Highway", "Avenue", "Street", "Road", "Lane", "Watt",
  "Blvd", "Ave", "Rd", "St",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  road: "RD", rd: "RD",
  highway: "HWY",
  lane: "LN",
};

// The 34 provinces (Welayat). Multi-word names have their spaces escaped for
// free-spacing mode. Restricted so only a real province lands in the state slot
// (ordinary area names never match), keeping province disjoint from city.
const PROVINCES = [
  "Kabul", "Herat", "Balkh", "Kandahar", "Nangarhar", "Kunduz", "Ghazni",
  "Bamyan", "Bamiyan", "Badakhshan", "Baghlan", "Helmand", "Paktia", "Paktika",
  "Khost", "Kunar", "Laghman", "Logar", "Maidan Wardak", "Wardak", "Parwan",
  "Panjshir", "Kapisa", "Nuristan", "Nimroz", "Farah", "Ghor", "Daykundi",
  "Uruzgan", "Zabul", "Faryab", "Jowzjan", "Sar-e Pol", "Samangan", "Takhar",
  "Badghis",
];
const PROVINCE_ALT = PROVINCES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const afConfig: EuCountryConfig = {
  code: "af",
  country: "AF",
  countryNames: ["Afghanistan", "AFG", "AF"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  // English suffixes echoed as written (Road, Street).
  normalizeTypeCase: false,

  // 4-digit postcode, OPTIONAL, written after the city ("Kabul 1001"). The
  // after-city grammar keeps the whole place tail (and thus the code) optional.
  postalPattern: "(?<postal_code>\\d{4})",

  // A bare civic number is uncommon (the building is "House N", captured as a
  // secondary unit below); keep a simple optional number for completeness.
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Numbered districts ("District 4", "Nahia 10") and areas land in the city
  // slot, which must therefore admit digits.
  cityAllowsDigits: true,

  // Only a real province may occupy the state slot; ordinary areas do not match,
  // so "..., <Area>, <Province>" splits correctly.
  countyPattern: `(?:${PROVINCE_ALT})`,
  regionPattern: `(?<state>${PROVINCE_ALT})`,

  // "House N" building, plus other leading units, before the street.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>House|Apartment|Apt\\.?|Flat|Floor|Block|Shop|Room|Unit)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    house: "House",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    floor: "Floor",
    block: "Block",
    shop: "Shop",
    room: "Room",
    unit: "Unit",
  },

  // Afghan Post box form.
  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default afConfig;
