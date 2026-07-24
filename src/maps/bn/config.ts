import type { EuCountryConfig } from "../_eu/types";

/**
 * Brunei Darussalam (BN) address configuration.
 *
 * Order: house/lot NUMBER first (often introduced by "No"/"No."/"Lot"), then a
 *        PREFIX-type road name ("Jalan Sultan", "Simpang 88", "Lorong 3"). Malay
 *        grammar, essentially identical to Malaysia's.
 * Type: leading PREFIX noun -- Jalan (road), Simpang (junction/branch road),
 *        Lorong (lane), plus the abbreviations Jln/Spg/Lrg. Brunei road names
 *        routinely carry a numeric tag ("Simpang 88", "Jalan Muara").
 * Postcode: ALPHANUMERIC -- two letters then four alphanumerics ("BS8811",
 *        "KA1131", "BE1718"). The first letter is the district (B=Brunei-Muara,
 *        K=Belait, T=Tutong, P=Temburong). Written AFTER the city.
 * District: the 4 districts (Brunei-Muara, Belait, Tutong, Temburong) -> `state`
 *        as a short code; usually omitted (the postcode already encodes it).
 * Area (Kampong): a Kampong/Kampung/Mukim area, or a bare suburb (Gadong, Kiulap,
 *        Beribi, Berakas, ...), sits between the street and the city. The IN/ZA
 *        locality-drop trick keeps the routing city and drops the area. Because a
 *        PREFIX type name is captured NON-GREEDILY, a comma-permissive city also
 *        pulls the tail words of a multi-word Malay name ("Jalan Kumbang Pasang")
 *        into the dropped chain; postNormalize therefore reclassifies each dropped
 *        segment -- an AREA marker (Kampong/Simpang/known suburb) is dropped, any
 *        other fragment is a leaked street-name word and is appended back to the
 *        street. This keeps both multi-word names AND area-drop working.
 *
 * KNOWN GAPS (see research-bn.md): an UNLISTED bare-suburb area (not in the area
 * set) is appended to the street instead of dropped; a "Spg N-M" hyphen-tagged
 * simpang; a unit/lot that LEADS with a letter; and native Jawi-script addresses
 * are documented failure modes.
 */

// Bare suburb/area words (no "Kampong" marker) that must be dropped, not folded
// back into a street name. Lower-cased set; matched on the Kampong-stripped form.
const AREA_WORDS = new Set([
  "gadong", "kiulap", "beribi", "berakas", "menglait", "kiarong", "serusop",
  "sengkurong", "jerudong", "muara", "bunut", "ayer",
]);

// Prefix road types, spelled out. Longest-first handled by the ruleset.
const TYPES = ["Simpang", "Lorong", "Jalan", "Jln", "Spg", "Lrg"];

const TYPE_SHORT: Record<string, string> = {
  jalan: "JLN", jln: "JLN",
  simpang: "SPG", spg: "SPG",
  lorong: "LRG", lrg: "LRG",
};

// 4 districts -> short code. Longest-first for the alternation.
const REGION_MAP: Record<string, string> = {
  "brunei-muara": "BM", "brunei muara": "BM",
  temburong: "TE",
  belait: "BL",
  tutong: "TU",
};

const DISTRICTS = ["Brunei-Muara", "Brunei Muara", "Temburong", "Belait", "Tutong"];

// After the postcode a bare district name is unambiguous.
const DIST_ALT =
  "(?:" + DISTRICTS.map((s) => s.replace(/ /g, "\\s+")).join("|") + ")(?:\\s+District)?";
// BEFORE the postcode, a bare district name collides with the town of the same
// name (Tutong, Temburong/Bangar), so the county slot requires the explicit
// "District" word to avoid stealing the routing city.
const DIST_STRICT =
  "(?:" + DISTRICTS.map((s) => s.replace(/ /g, "\\s+")).join("|") + ")\\s+District";

export const bnConfig: EuCountryConfig = {
  code: "bn",
  country: "BN",
  countryNames: ["Brunei Darussalam", "Brunei", "BRN", "BN"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  // Malay type words echoed as written (Jalan, Simpang, Lorong).
  normalizeTypeCase: false,

  // Alphanumeric postcode: two letters + four alphanumerics ("BS8811", "KA1131").
  // Uppercased in postalFormat. An OPTIONAL trailing district is captured in a
  // helper group folded to `state` in postNormalize.
  postalPattern:
    `(?<postal_code>[A-Za-z]{2}[A-Za-z0-9]{4})(?:[\\s,]+(?<bn_state>${DIST_ALT}))?`,
  postalFormat: (raw: string) => raw.toUpperCase().replace(/\s+/g, ""),

  // Optional "No"/"No."/"Lot"/"Unit" lead-in, number (with an optional "-n"
  // block/unit part), optional glued letter suffix ("No 12A" -> 12 + A).
  houseNumberPattern:
    "(?:No\\.?\\s*|Lot\\s+|Unit\\s+)?(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the Kampong/area chain together; routing city is the LAST locality
  // before the district/postcode (postNormalize drops the earlier ones).
  cityAllowsCommas: true,
  countyPattern: `(?:${DIST_STRICT})`,
  regionMap: REGION_MAP,

  // Unit / floor lead-in (Malay Tingkat/Aras or English Unit/Lot/Floor).
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Unit|Apartment|Apt\\.?|Suite|Tingkat|Aras|Floor|Block)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    unit: "Unit",
    apartment: "Apartment", apt: "Apt",
    suite: "Suite",
    tingkat: "Tingkat",
    aras: "Aras",
    floor: "Floor",
    block: "Block",
  },

  // A leading building whose name ends in a building keyword ("Yayasan Complex,
  // ...", "Wisma ..."). Bangunan = building; Wisma = commercial block.
  buildingKeywords: [
    "Complex", "Building", "Bangunan", "Wisma", "Tower", "Towers", "Plaza",
    "Mall", "Centre", "Center",
  ],

  // Brunei Postal Services box forms.
  poBoxNames: ["PO Box", "P.O. Box", "Peti Surat"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "peti surat": "Peti Surat",
  },

  // Fold the helper `bn_state` (district after the postcode) into `state`, then
  // drop the leading Kampong/area chain, keeping the routing city.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.bn_state === "string" && parsed.bn_state) {
      const key = parsed.bn_state
        .toLowerCase()
        .replace(/\s+district$/, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!parsed.state) parsed.state = REGION_MAP[key] ?? parsed.bn_state;
      delete parsed.bn_state;
    }
    // "Lot" is a label-only number lead-in (like the stripped "No"): it carries
    // no output field, so it is exempted from the token-preservation guard.
    const dropped: string[] = ["Lot"];

    const isArea = (p: string): boolean => {
      const stripped = p
        .replace(/^(?:kampong|kampung|kg\.?|mukim)\s+/i, "")
        .toLowerCase()
        .trim();
      return (
        // Kampong/Mukim area, OR a second stacked street led by a type word
        // (Jalan/Lorong/Simpang) that the single-street grammar cannot keep.
        /^(?:kampong|kampung|kg\.?|mukim|jalan|jln\.?|lorong|lrg\.?|simpang|spg\.?)\b/i.test(p) ||
        AREA_WORDS.has(stripped) ||
        AREA_WORDS.has(p.toLowerCase().trim())
      );
    };

    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        // Last part is the routing city; the middle parts are a mix of areas
        // (dropped) and leaked street-name fragments (appended to the street).
        parsed.city = parts[parts.length - 1];
        const middle = parts.slice(0, -1);
        const nameFrags: string[] = [];
        for (const p of middle) {
          if (isArea(p)) dropped.push(p);
          else nameFrags.push(p);
        }
        if (nameFrags.length && typeof parsed.street === "string") {
          parsed.street = [parsed.street, ...nameFrags].join(" ");
        } else {
          dropped.push(...nameFrags);
        }
      }
    }
    parsed.__dropped = dropped;
  },
};

export default bnConfig;
