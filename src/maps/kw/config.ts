import type { EuCountryConfig } from "../_eu/types";

/**
 * Kuwait (KW) address configuration.
 *
 * Kuwait routes physical mail by the AREA + BLOCK (Qita) + STREET (Share) +
 * BUILDING/HOUSE hierarchy, with a Governorate. A national "postal number"
 * (5-digit) exists but is used almost exclusively on PO-box lines
 * ("Safat 13001", "Salmiya 22003"); ordinary street lines carry no postcode. The
 * postal pattern is therefore OPTIONAL (a 5-digit run), so both the postcode-
 * present PO form and the postcode-absent physical form parse.
 *
 * Two dominant forms:
 *   1. PO Box:    "P.O. Box 1234, Safat 13001"  ->  sec_unit PO Box + city + code.
 *   2. Physical:  "Block 5, Street 8, Building 22, Salmiya, Hawally"
 *                 -> sec_unit Block + street ("Street 8") + city (Salmiya area) +
 *                    state (Hawally governorate); the building is folded into the
 *                    street when comma-less ("Street 8 Building 22") or dropped
 *                    when it is its own comma segment.
 *
 * Order: the labelled BLOCK leads ("Block 5"); then the numbered street
 *        ("Street 8"), then the building, then the AREA, then the GOVERNORATE.
 * Type:  Kuwaiti streets are numbered ("Street 8") and parse as a whole type-less
 *        name.
 * city  = the AREA (Salmiya, Salwa, Hawalli, Jabriya, Farwaniya, ...).
 * state = the GOVERNORATE (Al Asimah/Capital, Hawalli, Al Farwaniyah, Al Ahmadi,
 *        Al Jahra, Mubarak Al-Kabeer).
 *
 * KNOWN GAPS (see research-kw.md): Block is mapped to the single secondary-unit
 * slot, so a Building written as its OWN comma segment is dropped (documented);
 * an area-first written order is a documented failure mode.
 */

// Six governorates (romanized variants), optional trailing "Governorate". The
// bare short forms (Farwaniya / Ahmadi / Jahra) are intentionally EXCLUDED: they
// double as area names and would steal the city slot.
const GOVERNORATES = [
  "Al Asimah", "Al Assemah", "Capital", "Hawalli", "Hawally",
  "Al Farwaniyah", "Al Ahmadi", "Al Jahra",
  "Mubarak Al-Kabeer", "Mubarak Al Kabeer", "Mubarak Al-Kabir",
];
const GOV_ALT =
  "(?:" + GOVERNORATES.map((s) => s.replace(/ /g, "\\s+")).join("|") + ")(?:\\s+Governorate)?";

const REGION_MAP: Record<string, string> = {
  "al asimah": "KU", "al assemah": "KU", capital: "KU",
  "al asimah governorate": "KU", "capital governorate": "KU",
  hawalli: "HA", hawally: "HA",
  "hawalli governorate": "HA", "hawally governorate": "HA",
  "al farwaniyah": "FA", "al farwaniyah governorate": "FA",
  "al ahmadi": "AH", "al ahmadi governorate": "AH",
  "al jahra": "JA", "al jahra governorate": "JA",
  "mubarak al-kabeer": "MU", "mubarak al kabeer": "MU", "mubarak al-kabir": "MU",
  "mubarak al-kabeer governorate": "MU",
};

export const kwConfig: EuCountryConfig = {
  code: "kw",
  country: "KW",
  countryNames: ["Kuwait", "State of Kuwait", "KWT", "KW"],

  order: "number-street",
  // Suffix placement (with a small type list) so the bare street-name capture is
  // GREEDY and keeps the whole "Street 8 Building 22" segment intact; a named
  // street ("Salem Al Mubarak Street") still splits off its trailing type.
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit "postal number" (optional in the grammar; present on PO-box lines).
  postalPattern: "(?<postal_code>\\d{5})",

  // No independent leading house number (the building is labelled and handled as
  // a unit / folded into the street); keep a harmless digit run for parity.
  houseNumberPattern: "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: ["Expressway", "Highway", "Avenue", "Street", "Road", "Motorway"],
  typeDisplayMap: {},
  typeShortCodeMap: {
    expressway: "EXPY",
    highway: "HWY",
    avenue: "AVE",
    street: "ST",
    road: "RD",
    motorway: "MWY",
  },

  // Keep the "[Building N,] Area[, Governorate]" chain together; drop everything
  // but the routing area in postNormalize. Only a real governorate lands in state.
  cityAllowsCommas: true,
  countyPattern: GOV_ALT,
  regionPattern: `(?<state>${GOV_ALT})`,
  regionMap: REGION_MAP,

  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      const last = (parts[parts.length - 1] ?? "").toLowerCase().replace(/\s+governorate$/, "");
      // Only fold a trailing governorate here when the grammar has NOT already
      // captured one (otherwise this word is the AREA the city slot needs).
      if (!parsed.state && (REGION_MAP[last] || REGION_MAP[`${last} governorate`])) {
        parsed.state = REGION_MAP[last] ?? REGION_MAP[`${last} governorate`];
        parts.pop();
      }
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  // Block / building / house / floor lead-in ("Block 5", "Building 22").
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Block|Building|Bldg\\.?|House|Villa|Floor|Apartment|Apt\\.?|Flat|Office|Unit|Shop|Jada)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    block: "Block",
    building: "Building",
    bldg: "Building",
    house: "House",
    villa: "Villa",
    floor: "Floor",
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    office: "Office",
    unit: "Unit",
    shop: "Shop",
    jada: "Jada",
  },

  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default kwConfig;
