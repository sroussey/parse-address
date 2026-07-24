import type { EuCountryConfig } from "../_eu/types";

/**
 * Jordan (JO) address configuration.
 *
 * Modelled on the romanized/Latin business form used in SEC / international
 * filings. Native Arabic (RTL) script is OUT OF SCOPE (marked __skip in the
 * samples). Small-endian order: an optional house number ("No. 12" or a bare
 * civic number, frequently ABSENT) leads, then the street.
 *
 * Two dominant forms:
 *   1. PO Box:    "P.O. Box 940631, Amman 11194"  ->  sec_unit PO Box + city +
 *                 postal.
 *   2. Physical:  "No. 12, Zahran Street, Abdoun, Amman 11118"
 *                 -> number 12 + street ("Zahran" + type "Street") + city (Amman,
 *                    the routing/postcode-bearing locality) with the sub-district
 *                    (Abdoun) dropped.
 *
 * Order: number-street. The house number is optional and often absent; when a
 *        labelled unit/building leads ("Building 5", "Flat 3") it is captured as
 *        the secondary unit.
 * Type:  trailing English suffix (Street, Road, Avenue, Highway, Boulevard,
 *        Circle). Many arteries carry the Arabic generic as a PREFIX ("Shari
 *        Al-Quds", "Sharia Al-Madina"); since the engine takes one type position
 *        and the English suffix is primary, a Shari-prefixed name parses as a
 *        whole type-less street name.
 * city  = the AREA / routing city (Amman, Irbid, Zarqa, Aqaba, ...). A leading
 *        sub-district (Abdoun, Shmeisani, Sweifieh) is captured with the city and
 *        then dropped (recorded so the token guard does not score it as lost).
 * state = the GOVERNORATE, but ONLY when spelled with the explicit "Governorate"
 *        marker -- the bare governorate names equal their capital cities (Amman,
 *        Irbid, Zarqa, ...) and would otherwise steal the routing-city slot.
 * Postcode: 5 digits LAST, after the city ("Amman 11118"). Optional (many lines
 *        carry no postcode), so the postcode-absent place branch also parses.
 */

const TYPES = [
  "Boulevard", "Highway", "Street", "Avenue", "Circle", "Road",
  "Blvd", "Hwy", "St", "Ave", "Rd",
];

const TYPE_SHORT: Record<string, string> = {
  boulevard: "BLVD", blvd: "BLVD",
  highway: "HWY", hwy: "HWY",
  street: "ST", st: "ST",
  avenue: "AVE", ave: "AVE",
  circle: "CIR",
  road: "RD", rd: "RD",
};

// The 12 governorates, modelled ONLY in their explicit "... Governorate" form so
// they stay DISJOINT from the routing cities they share a name with.
const GOVERNORATES = [
  "Amman", "Irbid", "Zarqa", "Balqa", "Madaba", "Mafraq", "Jerash", "Ajloun",
  "Karak", "Tafilah", "Ma'an", "Aqaba",
];
const GOV_ALT =
  "(?:" + GOVERNORATES.map((s) => s.replace(/ /g, "\\s+")).join("|") + ")\\s+Governorate";

const REGION_MAP: Record<string, string> = {
  "amman governorate": "AM",
  "irbid governorate": "IR",
  "zarqa governorate": "AZ",
  "balqa governorate": "BA",
  "madaba governorate": "MD",
  "mafraq governorate": "MA",
  "jerash governorate": "JA",
  "ajloun governorate": "AJ",
  "karak governorate": "KA",
  "tafilah governorate": "AT",
  "ma'an governorate": "MN",
  "aqaba governorate": "AQ",
};

export const joConfig: EuCountryConfig = {
  code: "jo",
  country: "JO",
  countryNames: ["Jordan", "Hashemite Kingdom of Jordan", "JOR", "JO"],

  order: "number-street",
  typePlacement: "suffix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode, after the city; optional in the grammar.
  postalPattern: "(?<postal_code>\\d{5})",

  // Optional house number: bare, or introduced by "No." (the marker is folded).
  houseNumberPattern:
    "(?:No\\.?\\s*)?(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the "Sub-district, City" chain together; drop the earlier district(s) in
  // postNormalize, keeping the routing city. Only a "Governorate"-marked token
  // lands in the state slot.
  cityAllowsCommas: true,
  countyPattern: GOV_ALT,
  regionPattern: `(?<state>${GOV_ALT})`,
  regionMap: REGION_MAP,

  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      const last = (parts[parts.length - 1] ?? "").toLowerCase();
      // Fold a trailing "... Governorate" token to state only if the grammar did
      // not already capture one (its bare form equals a city, so match the full
      // "governorate"-marked spelling).
      if (!parsed.state && REGION_MAP[last]) {
        parsed.state = REGION_MAP[last];
        parts.pop();
      }
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        if (parts.length > 1) parsed.__dropped = parts.slice(0, -1);
      }
    }
  },

  // Building / flat / office / floor lead-in.
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Apartment|Apt\\.?|Flat|Suite|Floor|Office|Building|Bldg\\.?|Villa|Shop|Unit|Room)\\.?\\s*(?:No\\.?\\s*)?(?<sec_unit_num>\\d+[A-Za-z0-9\\-/]*)",
  secUnitDisplayMap: {
    apartment: "Apartment",
    apt: "Apt",
    flat: "Flat",
    suite: "Suite",
    floor: "Floor",
    office: "Office",
    building: "Building",
    bldg: "Building",
    villa: "Villa",
    shop: "Shop",
    unit: "Unit",
    room: "Room",
  },

  // Jordan Post box forms.
  poBoxNames: ["PO Box", "P.O. Box", "P O Box", "POB", "Post Box"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "p o box": "PO Box",
    pob: "PO Box",
    "post box": "PO Box",
  },
};

export default joConfig;
