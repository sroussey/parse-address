import type { EuCountryConfig } from "../_eu/types";

/**
 * Nepal (NP) address configuration.
 *
 * Order: an optional house NUMBER first ("House No. 41", often omitted), then a
 *        SUFFIX-type thoroughfare / tole name ("Rohini Marg", "Putali Sadak",
 *        "Kamal Pokhari"). Many localities are a bare tole (neighbourhood) with
 *        NO number and NO type, which is the dominant Nepali form.
 * Type: trailing Nepali road suffix -- Marg/Marga (road/avenue), Sadak/Sarak
 *        (road), Path, Chowk (square), Tole (quarter), Bato (road), plus English
 *        Road/Lane. Type is frequently absent (bare tole -> dropped null).
 * Ward: Nepali municipal addresses carry a WARD number ("Ward No. 26"), written
 *        after the tole and before the city. It is modelled as a trailing
 *        secondary unit (sec_unit_type "Ward No", sec_unit_num N).
 * Postcode: a 5-digit code exists but is VERY commonly OMITTED (Nepal's postal
 *        code system is little used in practice), so it is optional; when present
 *        it is written AFTER the city ("Kathmandu 44600").
 * Province: the 7 provinces (Bagmati, Gandaki, Lumbini, ...) -> `state` as a
 *        short code. Written EITHER before the postcode (county slot) OR after it
 *        (helper `np_state`). District names (Kathmandu, Lalitpur, ...) double as
 *        cities and are NOT treated as the province.
 * Locality chain: an older-ward locality ("Old Baneshwor-10") or a suburb sits
 *        between the tole and the city; the IN/ZA locality-drop trick keeps the
 *        routing city and drops the rest.
 *
 * KNOWN GAPS (see research-np.md): a ward glued to the locality with a dash
 * ("Baneshwor-10") is dropped rather than surfaced; a bare tole-only line with no
 * city; and native Devanagari-script addresses are documented failure modes.
 */

const TYPES = [
  "Marga", "Sadak", "Sarak", "Chowk", "Marg", "Tole", "Bato", "Road", "Lane",
  "Path", "Galli",
];

const TYPE_SHORT: Record<string, string> = {
  marg: "MARG", marga: "MARG",
  sadak: "SADAK", sarak: "SADAK",
  chowk: "CHOWK",
  tole: "TOLE",
  bato: "BATO",
  road: "RD",
  lane: "LN",
  path: "PATH",
  galli: "GALLI",
};

// 7 provinces -> short code. Older numeric names ("Province No. 1") not modelled.
const REGION_MAP: Record<string, string> = {
  koshi: "P1", kosi: "P1",
  madhesh: "P2", madhes: "P2",
  bagmati: "P3",
  gandaki: "P4",
  lumbini: "P5",
  karnali: "P6",
  sudurpashchim: "P7", sudurpaschim: "P7",
};

const PROVINCES = [
  "Sudurpashchim", "Sudurpaschim", "Bagmati", "Gandaki", "Lumbini", "Karnali",
  "Madhesh", "Madhes", "Koshi", "Kosi",
];

// Accept an optional trailing "Province"/"Pradesh" word after the name.
const PROV_ALT =
  "(?:" + PROVINCES.map((s) => s.replace(/ /g, "\\s+")).join("|") +
  ")(?:\\s+(?:Province|Pradesh))?";

export const npConfig: EuCountryConfig = {
  code: "np",
  country: "NP",
  countryNames: ["Nepal", "NPL", "NP"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // OPTIONAL 5-digit postcode after the city, then an OPTIONAL trailing province
  // captured in a helper group folded to `state` in postNormalize.
  postalPattern:
    `(?<postal_code>\\d{5})(?:[\\s,]+(?<np_state>${PROV_ALT}))?`,

  // Optional "House No."/"H. No."/"No." lead-in, number with an optional "/n" or
  // "-n" part, optional glued letter suffix. The number is frequently absent.
  houseNumberPattern:
    "(?:House\\s+No\\.?\\s*|H\\.?\\s*No\\.?\\s*|No\\.?\\s*)?(?<number>\\d+(?:[-/]\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the suburb/locality chain together; routing city is the LAST locality
  // before the province/postcode (postNormalize drops the earlier ones). A real
  // province written before the postcode falls into the county slot.
  cityAllowsCommas: true,
  countyPattern: `(?:${PROV_ALT})`,
  regionMap: REGION_MAP,

  // Ward number as a trailing secondary unit ("Ward No. 26"). Flat/Apartment/
  // Floor also lead the address for apartment blocks.
  secUnitPlacement: "after",
  secUnitPattern:
    "(?<sec_unit_type>Ward\\s+No\\.?|Ward)\\.?\\s*(?<sec_unit_num>\\d+)",
  secUnitDisplayMap: {
    "ward no": "Ward No",
    ward: "Ward",
  },

  // A leading building whose name ends in a building keyword.
  buildingKeywords: [
    "Bhawan", "Bhavan", "Tower", "Towers", "Complex", "Plaza", "Building",
    "Centre", "Center", "Sadan", "Niwas",
  ],

  // Nepal Post box forms.
  poBoxNames: ["PO Box", "P.O. Box", "GPO Box", "G.P.O. Box", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "gpo box": "GPO Box",
    "g.p.o. box": "GPO Box",
    "post box": "PO Box",
  },

  // Fold the helper `np_state` (province after the postcode) into `state`, then
  // drop the leading locality chain, keeping the routing city.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.np_state === "string" && parsed.np_state) {
      const key = parsed.np_state
        .toLowerCase()
        .replace(/\s+(province|pradesh)$/, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!parsed.state) parsed.state = REGION_MAP[key] ?? parsed.np_state;
      delete parsed.np_state;
    }
    // "House" is a label-only lead-in (like the stripped "No"): it carries no
    // output field, so it is exempted from the token-preservation guard.
    const dropped: string[] = ["House"];
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        dropped.push(...parts.slice(0, -1));
      }
    }
    parsed.__dropped = dropped;
  },
};

export default npConfig;
