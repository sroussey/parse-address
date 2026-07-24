import type { EuCountryConfig } from "../_eu/types";
import { keepLastLocality } from "../_eu/localityChain";

/**
 * Pakistan (PK) address configuration.
 *
 * Order: house NUMBER first (introduced by "House"/"H.No."/"Plot"), then a
 *        numbered street written as a PREFIX type + number ("Street 5",
 *        "Street No. 12"). This "Street N" form is the dominant modelable urban
 *        pattern (DHA, PECHS, Bahria, Islamabad sector grid).
 * Type: leading "Street"/"St" whose "name" is the street number. Named roads
 *        with a trailing English/Urdu type ("Main Boulevard", "Jinnah Avenue",
 *        "Khayaban-e-Iqbal", "Shahrah-e-Faisal") do NOT fit the prefix form and
 *        parse either type-less or are marked __skip (see gaps).
 * Postcode: 5-digit numeric, written after the city. In real usage it is glued
 *        to the city with a hyphen ("Karachi-75400"); the shared place grammar
 *        needs a space/comma separator, so hyphen-glued forms are a documented
 *        failure mode. Samples use the space/comma form ("Karachi 75400").
 * Province: Sindh, Punjab, Khyber Pakhtunkhwa, Balochistan (+ territories) ->
 *        state, either before the postcode (county slot) or after it (helper
 *        `pk_state`). Frequently omitted (postcode/city routes it).
 * Grid localities: Block, Sector, Phase and the area/scheme name (PECHS,
 *        Gulshan-e-Iqbal, DHA, Gulberg) sit between the street and the city; the
 *        IN/ZA locality-drop trick keeps the routing city and drops the rest.
 *
 * KNOWN GAPS (see research-pk.md): hyphen-glued "City-NNNNN"; a letter-led house
 * number ("House C-25"); named/hyphenated roads ("Khayaban-e-Iqbal"); and
 * Urdu-script addresses are documented failure modes.
 */

const TYPES = ["Street", "St", "Lane", "Gali"];

const TYPE_SHORT: Record<string, string> = {
  street: "ST", st: "ST",
  lane: "LN",
  gali: "GALI",
};

// 4 provinces + 3 territories -> code. Multi-word longest-first, spaces -> \s+.
const REGION_MAP: Record<string, string> = {
  "azad jammu and kashmir": "AK",
  "azad kashmir": "AK",
  "islamabad capital territory": "IS",
  "khyber pakhtunkhwa": "KP",
  "gilgit-baltistan": "GB",
  "gilgit baltistan": "GB",
  balochistan: "BA",
  baluchistan: "BA",
  punjab: "PB",
  sindh: "SD",
};

const PROVINCES = [
  "Islamabad Capital Territory", "Azad Jammu and Kashmir", "Khyber Pakhtunkhwa",
  "Gilgit-Baltistan", "Gilgit Baltistan", "Azad Kashmir", "Balochistan",
  "Baluchistan", "Punjab", "Sindh",
];

const PROV_ALT = PROVINCES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const pkConfig: EuCountryConfig = {
  code: "pk",
  country: "PK",
  countryNames: ["Pakistan", "PAK", "PK"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode; an optional trailing province is captured in a helper
  // group folded to `state` in postNormalize ("Karachi 75400, Sindh").
  postalPattern:
    `(?<postal_code>\\d{5})(?:[\\s,]+(?<pk_state>${PROV_ALT}))?`,

  // "House"/"H.No."/"Plot"/"No." lead-in, number, optional "-A" / glued letter
  // civic suffix ("House 17-B" -> 17 + B).
  houseNumberPattern:
    "(?:House\\s+(?:No\\.?\\s*)?|H\\.?\\s*No\\.?\\s*|Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*)?(?<number>\\d+)(?:-)?(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the Block/Sector/Phase/area chain together; routing city is the LAST
  // locality before the province/postcode (postNormalize drops the earlier ones).
  cityAllowsCommas: true,
  countyPattern: `(?:${PROV_ALT})`,
  regionMap: REGION_MAP,

  // Flat / Apartment / Floor / Office / Shop / Portion lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Floor|Suite|Room|Office|Shop|Portion)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    apartment: "Apartment", apt: "Apt",
    floor: "Floor",
    suite: "Suite",
    room: "Room",
    office: "Office",
    shop: "Shop",
    portion: "Portion",
  },

  // A leading building whose name ends in a building keyword ("Habib Bank Plaza,
  // ..."). "House" is intentionally NOT a building keyword (it is the number
  // lead-in).
  buildingKeywords: [
    "Plaza", "Tower", "Towers", "Centre", "Center", "Arcade", "Chambers",
    "Building", "Mall", "Heights", "Complex",
  ],

  // Pakistan Post box forms.
  poBoxNames: ["PO Box", "P.O. Box", "GPO Box", "G.P.O. Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "gpo box": "GPO Box",
    "g.p.o. box": "GPO Box",
  },

  // Fold the helper `pk_state` (province after the postcode), then drop the
  // leading grid/area chain, keeping the routing city. The "House"/"Plot"
  // number-label words are label-only (like the stripped "No"): they carry no
  // output field, so they are added to the dropped set to keep the shared
  // token-preservation guard from miscounting them as lost street tokens.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.pk_state === "string" && parsed.pk_state) {
      const key = parsed.pk_state.toLowerCase().replace(/\s+/g, " ").trim();
      if (!parsed.state) parsed.state = REGION_MAP[key] ?? parsed.pk_state;
      delete parsed.pk_state;
    }
    keepLastLocality(parsed, ["House", "Plot"]);
  },
};

export default pkConfig;
