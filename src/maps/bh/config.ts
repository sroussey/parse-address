import type { EuCountryConfig } from "../_eu/types";

/**
 * Bahrain (BH) address configuration.
 *
 * Bahrain uses a Building / Road / Block numbering system instead of named
 * streets and house numbers. The BLOCK number (3-4 digits) is the routing code:
 * UPU/Bahrain Post treat it as the postal code, written after the city
 * ("Manama 319"). In the street body it is written "Block 319". Both forms are
 * supported; the block number is emitted as `postal_code`.
 *
 * Two dominant forms:
 *   1. PO Box:    "P.O. Box 1234, Manama"  ->  sec_unit PO Box + city.
 *   2. Physical:  "Building 50, Road 1901, Block 319, Manama"
 *                 -> sec_unit Building + street ("Road 1901") + postal_code (319,
 *                    from the Block) + city (Manama). The postal form
 *                    "Building 50, Road 1901, Manama 319" parses identically.
 *
 * Order: the labelled BUILDING leads ("Building 50"); then the numbered road
 *        ("Road 1901"), then the Block, then the city/area.
 * Type:  Bahraini roads are numbered ("Road 1901") and parse as a whole type-less
 *        name; a few named roads carry a trailing type (Avenue, Highway, ...).
 * postal_code = the BLOCK number (3-4 digits).
 * city  = the area / town (Manama, Muharraq, Riffa, Isa Town, Hamad Town, ...).
 * state = optional governorate -> Capital (CAP), Muharraq (MUH), Northern (NOR),
 *        Southern (SOU).
 *
 * KNOWN GAPS (see research-bh.md): a building written as its own comma segment
 * after the block, and an area-first written order, are documented failure modes.
 */

const TYPES = [
  "Avenue", "Highway", "Road", "Street", "Boulevard", "Ave", "Hwy", "Rd", "St",
];

const TYPE_SHORT: Record<string, string> = {
  avenue: "AVE", ave: "AVE",
  highway: "HWY", hwy: "HWY",
  road: "RD", rd: "RD",
  street: "ST", st: "ST",
  boulevard: "BLVD",
};

// Four governorates (Bahrain Post abbreviations).
const GOVERNORATES = ["Capital", "Muharraq", "Northern", "Southern"];
const GOV_ALT =
  "(?:" + GOVERNORATES.join("|") + ")(?:\\s+Governorate)?";

const REGION_MAP: Record<string, string> = {
  capital: "CAP", "capital governorate": "CAP",
  muharraq: "MUH", "muharraq governorate": "MUH",
  northern: "NOR", "northern governorate": "NOR",
  southern: "SOU", "southern governorate": "SOU",
};

const BLOCK_RE = /^Block\s+(\d{3,4})$/i;

export const bhConfig: EuCountryConfig = {
  code: "bh",
  country: "BH",
  countryNames: ["Bahrain", "Kingdom of Bahrain", "BHR", "BH"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Block number used as the postal code: 3-4 digits, after the city.
  postalPattern: "(?<postal_code>\\d{3,4})",

  // No independent leading house number (the building is labelled and handled as
  // a unit); keep a harmless digit run for parity.
  houseNumberPattern: "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "Block NNN, Area[, Governorate]" chain together; in postNormalize
  // lift the Block number to postal_code (dropping the "Block" word) and keep the
  // area as the city. Only a real governorate lands in state.
  cityAllowsCommas: true,
  countyPattern: GOV_ALT,
  regionPattern: `(?<state>${GOV_ALT})`,
  regionMap: REGION_MAP,

  postNormalize: (parsed: Record<string, any>) => {
    const dropped: string[] = [];
    const lift = (part: string): boolean => {
      const m = BLOCK_RE.exec(part.trim());
      if (m) {
        if (!parsed.postal_code) parsed.postal_code = m[1];
        // Drop the whole "Block NNN" and the bare word "Block" so the token guard
        // exempts the residue left before the postal-code cut.
        dropped.push(part.trim(), "Block");
        return true;
      }
      return false;
    };

    if (typeof parsed.city === "string") {
      if (parsed.city.includes(",")) {
        let parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
        const last = (parts[parts.length - 1] ?? "").toLowerCase().replace(/\s+governorate$/, "");
        // Only fold a trailing governorate here when the grammar has NOT already
        // captured one (otherwise this word is the AREA the city slot needs, e.g.
        // "..., Muharraq, Muharraq" -> area Muharraq + governorate Muharraq).
        if (!parsed.state && REGION_MAP[last]) {
          parsed.state = REGION_MAP[last];
          parts.pop();
        }
        parts = parts.filter((p) => !lift(p));
        if (parts.length) {
          parsed.city = parts[parts.length - 1];
          if (parts.length > 1) dropped.push(...parts.slice(0, -1));
        } else {
          delete parsed.city;
        }
      } else if (lift(parsed.city)) {
        // "Block 319" as the sole locality: became the postal code, no city.
        delete parsed.city;
      }
    }
    if (dropped.length) parsed.__dropped = dropped;
  },

  // Building / villa / flat / office lead-in ("Building 50", "Bldg No. 50").
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Building|Bldg\\.?|Villa|Flat|Apartment|Apt\\.?|Office|Floor|Unit|Shop)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    building: "Building",
    bldg: "Building",
    villa: "Villa",
    flat: "Flat",
    apartment: "Apartment",
    apt: "Apt",
    office: "Office",
    floor: "Floor",
    unit: "Unit",
    shop: "Shop",
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

export default bhConfig;
