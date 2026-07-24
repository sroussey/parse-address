import type { EuCountryConfig } from "../_eu/types";

/**
 * Bangladesh (BD) address configuration.
 *
 * Order: house NUMBER first (introduced by "House"/"Ho."/"Plot"/"Holding"),
 *        then a numbered thoroughfare written as a PREFIX type + number
 *        ("Road 5", "Road No. 12"). This "Road N" form is the dominant modelable
 *        urban pattern (Dhanmondi, Gulshan, Banani, Uttara planned areas).
 * Type: leading "Road"/"Rd" whose "name" is the road number, plus "Lane"/"Avenue"
 *        /"Sarak" (Bengali road). Named roads with a trailing type ("Dhanmondi
 *        Road", "Kemal Ataturk Avenue") do NOT fit the prefix form and are marked
 *        __skip (documented gap).
 * Postcode: 4-digit numeric, written AFTER the city. In real Bangladeshi usage
 *        it is very commonly GLUED to the city with a hyphen ("Dhaka-1212"); the
 *        space/comma form ("Dhaka 1209") also occurs. Both are supported -- the
 *        space form via the shared place grammar, the hyphen-glued form via a
 *        `postNormalize` split of the city tail.
 * Division: the 8 divisions (Dhaka, Chattogram/Chittagong, Khulna, ...) -> `state`
 *        as a 2-letter code. Optional; usually omitted (the postcode routes it).
 * Block / area: a Block ("Block C"), Sector ("Sector 7") and the area/thana
 *        (Gulshan, Dhanmondi, Banani, Uttara) sit between the street and the city;
 *        the IN/ZA locality-drop trick keeps the routing city and drops the rest.
 *
 * KNOWN GAPS (see research-bd.md): named/suffix roads ("Dhanmondi Road"); a
 * building-name-led corporate line; and native Bangla-script addresses are
 * documented failure modes.
 */

// A "No."/"No" between the type and the number ("Road No. 12") is folded into
// the type spelling so the road number stays the street name; the display map
// canonicalises every spelling back to the bare type.
const TYPES = [
  "Road No.", "Road No", "Rd No.", "Rd No", "Avenue", "Sarani", "Sarak",
  "Road", "Lane", "Rd",
];

const TYPE_DISPLAY: Record<string, string> = {
  "road no": "Road", "rd no": "Road",
  road: "Road", rd: "Road",
  lane: "Lane",
  avenue: "Avenue",
  sarak: "Sarak",
  sarani: "Sarani",
};

const TYPE_SHORT: Record<string, string> = {
  road: "RD",
  lane: "LN",
  avenue: "AVE",
  sarak: "SARAK",
  sarani: "SARANI",
};

// 8 divisions -> 2-letter code. Bengali/anglicised spellings both listed.
const REGION_MAP: Record<string, string> = {
  dhaka: "DH",
  chattogram: "CT", chittagong: "CT",
  khulna: "KH",
  rajshahi: "RJ",
  barishal: "BR", barisal: "BR",
  sylhet: "SY",
  rangpur: "RP",
  mymensingh: "MY",
};

const DIVISIONS = [
  "Chattogram", "Chittagong", "Mymensingh", "Rajshahi", "Barishal", "Barisal",
  "Rangpur", "Khulna", "Sylhet", "Dhaka",
];

// After the postcode a bare division name is unambiguous ("1212, Dhaka").
const DIV_ALT =
  "(?:" + DIVISIONS.map((s) => s.replace(/ /g, "\\s+")).join("|") + ")(?:\\s+Division)?";
// BEFORE the postcode, a bare division name collides with the city (Dhaka,
// Chattogram, Sylhet, ... are cities AND divisions), so the county slot requires
// the explicit "Division" word to avoid stealing the routing city.
const DIV_STRICT =
  "(?:" + DIVISIONS.map((s) => s.replace(/ /g, "\\s+")).join("|") + ")\\s+Division";

export const bdConfig: EuCountryConfig = {
  code: "bd",
  country: "BD",
  countryNames: ["Bangladesh", "BGD", "BD"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  // English types are canonicalised via typeDisplayMap ("Road No." -> "Road").
  normalizeTypeCase: true,

  // 4-digit postcode after the city (space/comma form), then an OPTIONAL trailing
  // division captured in a helper group folded to `state` in postNormalize
  // ("Dhaka 1212, Dhaka Division"). The hyphen-glued form ("Dhaka-1212") is not
  // seen here -- it is recovered from the city tail in postNormalize.
  postalPattern:
    `(?<postal_code>\\d{4})(?:[\\s,]+(?<bd_state>${DIV_ALT}))?`,

  // "House"/"Ho."/"Holding"/"Plot"/"No." lead-in, number, optional "/n" sub-part
  // and a glued letter suffix ("House 12/A" -> 12/A; "Plot 7-B" -> 7 + B).
  houseNumberPattern:
    "(?:House\\s+(?:No\\.?\\s*)?|Ho\\.?\\s*|Holding\\s+(?:No\\.?\\s*)?|Plot\\s+(?:No\\.?\\s*)?|No\\.?\\s*)?(?<number>\\d+(?:/[0-9A-Za-z]+)?)(?:-)?(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // Keep the Block/Sector/area chain together; routing city is the LAST locality
  // before the division/postcode (postNormalize drops the earlier ones).
  cityAllowsCommas: true,
  countyPattern: `(?:${DIV_STRICT})`,
  regionMap: REGION_MAP,

  // Flat / Apartment / Floor / Suite / Room lead the address.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Flat|Apartment|Apt\\.?|Floor|Suite|Room|Unit)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    flat: "Flat",
    apartment: "Apartment", apt: "Apt",
    floor: "Floor",
    suite: "Suite",
    room: "Room",
    unit: "Unit",
  },

  // A leading building whose name ends in a building keyword ("BSEC Bhaban, ...",
  // "City Centre, ..."). "House" is intentionally NOT a building keyword (it is
  // the number lead-in word).
  buildingKeywords: [
    "Bhaban", "Bhawan", "Tower", "Towers", "Centre", "Center", "Complex",
    "Plaza", "Building", "Chamber", "Chambers", "Heights",
  ],

  // Bangladesh Post box forms.
  poBoxNames: ["PO Box", "P.O. Box", "GPO Box", "G.P.O. Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "gpo box": "GPO Box",
    "g.p.o. box": "GPO Box",
  },

  // Fold the helper `bd_state` (division after a space-form postcode); then walk
  // the locality chain. In the hyphen-glued form the whole "..., Dhaka-1212"
  // (optionally "..., Dhaka-1212, <Division>") lands in the city capture with no
  // grammar-parsed postcode, so: pop a trailing division into `state`, then peel
  // a "-NNNN"/" NNNN" postcode off the routing city, and drop the earlier
  // localities. The "House"/"Plot" number labels carry no output field, so they
  // are added to the dropped set to keep the token guard from miscounting them.
  postNormalize: (parsed: Record<string, any>) => {
    const dropped: string[] = ["House", "Ho", "Plot", "Holding"];

    const foldDivision = (raw: string): string | null => {
      const key = raw.toLowerCase().replace(/\s+division$/, "").replace(/\s+/g, " ").trim();
      return REGION_MAP[key] ?? null;
    };

    // Division captured by the grammar helper after a space-form postcode.
    if (typeof parsed.bd_state === "string" && parsed.bd_state) {
      if (!parsed.state) parsed.state = foldDivision(parsed.bd_state) ?? parsed.bd_state;
      delete parsed.bd_state;
    }
    // A division captured verbatim ("Dhaka Division") by the branch-B county slot
    // is folded to its code (the shared regionMap keys the bare division name).
    if (typeof parsed.state === "string") {
      const code = foldDivision(parsed.state);
      if (code) parsed.state = code;
    }

    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);

      if (parsed.postal_code) {
        // Space-form: the grammar already found the postcode (and any division
        // via bd_state), so the chain is just localities + the routing city. The
        // last part is the city even when it equals a division name ("Dhaka").
        if (parts.length) {
          parsed.city = parts[parts.length - 1]!;
          parsed.__dropped = [...dropped, ...parts.slice(0, -1)];
        }
        return;
      }

      // Hyphen-glued form: the postcode is glued to the routing-city part
      // ("Dhaka-1212"); any parts AFTER it are the division. Find that part.
      let idx = -1;
      for (let i = parts.length - 1; i >= 0; i--) {
        if (/[\s-]\d{4}$/.test(parts[i]!)) { idx = i; break; }
      }
      if (idx >= 0) {
        const m = /^(.*?)[\s-]+(\d{4})$/.exec(parts[idx]!);
        if (m) {
          parsed.city = m[1]!.trim();
          parsed.postal_code = m[2]!;
        }
        for (const p of parts.slice(idx + 1)) {
          const code = foldDivision(p);
          if (code && !parsed.state) parsed.state = code;
        }
        parsed.__dropped = [
          ...dropped,
          ...parts.slice(0, idx),
          ...parts.slice(idx + 1),
        ];
        return;
      }

      // No glued postcode anywhere: keep the last as the routing city.
      parsed.city = parts[parts.length - 1]!;
      parsed.__dropped = [...dropped, ...parts.slice(0, -1)];
      return;
    }

    // Single-token city (no comma chain) hyphen-glued to the postcode.
    if (typeof parsed.city === "string" && !parsed.postal_code) {
      const m = /^(.*?)[\s-]+(\d{4})$/.exec(parsed.city);
      if (m) {
        parsed.city = m[1]!.trim();
        parsed.postal_code = m[2]!;
      }
    }
    parsed.__dropped = dropped;
  },
};

export default bdConfig;
