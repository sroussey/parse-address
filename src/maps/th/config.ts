import type { EuCountryConfig } from "../_eu/types";

/**
 * Thailand (TH) address configuration — romanized/English form.
 *
 * Order: house/plot NUMBER first (optionally "Ban"/"No."), then a PREFIX-type
 *        road name ("Thanon Sukhumvit", "Soi Sukhumvit 40", "Trok Wat Prayun").
 * Type: leading PREFIX noun — Thanon (road, abbrev "Th."), Soi (lane/alley),
 *        Trok (small alley). Romanized road names routinely carry a trailing
 *        number ("Soi Sukhumvit 40", "Sukhumvit 63"), kept inside the name
 *        because the house number is captured first.
 * Postcode: 5-digit numeric, written LAST after the city (after-city). Leading
 *        zeros significant; an occasional +4 extension ("10210-0299") is consumed
 *        but not captured.
 * Province (Changwat): written just before the postcode -> state (Chiang Mai,
 *        Nakhon Ratchasima, Phuket, ...). BANGKOK (Krung Thep Maha Nakhon) is
 *        both province and routing city, so it is treated as the CITY (not the
 *        state) and is deliberately excluded from the province alternation.
 * Locality chain: the subdistrict (Khwaeng in Bangkok / Tambon in provinces) and
 *        district (Khet in Bangkok / Amphoe in provinces) sit between the street
 *        and the city. Because the postcode is LAST and the number is FIRST, the
 *        IN/ZA locality-drop trick applies cleanly: keep the comma chain in the
 *        city capture, then drop the leading khwaeng/khet (tambon/amphoe) and
 *        keep the routing city.
 *
 * KNOWN GAPS (see research-th.md): native Thai-script addresses; a rural "Moo"/
 * "M." village-group token; and an English-suffix road ("Sukhumvit Road") which
 * parses type-less (name kept whole, lossless) are documented failure modes.
 */

// Leading (prefix) road types. Longest-first handled by the ruleset.
const TYPES = ["Thanon", "Soi", "Trok", "Th"];

const TYPE_SHORT: Record<string, string> = {
  thanon: "TH", th: "TH",
  soi: "SOI",
  trok: "TROK",
};

// 76 provinces (Bangkok deliberately excluded — it is the city). Multi-word
// longest-first; spaces escaped to \s+ in the alternation.
const PROVINCES = [
  "Phra Nakhon Si Ayutthaya", "Nakhon Si Thammarat", "Prachuap Khiri Khan",
  "Ubon Ratchathani", "Nakhon Ratchasima", "Nong Bua Lamphu", "Samut Songkhram",
  "Kamphaeng Phet", "Maha Sarakham", "Nakhon Pathom", "Nakhon Phanom",
  "Nakhon Sawan", "Nakhon Nayok", "Samut Prakan", "Samut Sakhon", "Mae Hong Son",
  "Suphan Buri", "Prachinburi", "Chachoengsao", "Chaiyaphum", "Kanchanaburi",
  "Ratchaburi", "Sisaket", "Sing Buri", "Chai Nat", "Chiang Mai", "Chiang Rai",
  "Sakon Nakhon", "Surat Thani", "Ang Thong", "Amnat Charoen", "Bueng Kan",
  "Chanthaburi", "Phetchabun", "Phetchaburi", "Phitsanulok", "Kalasin",
  "Khon Kaen", "Lampang", "Lamphun", "Loei", "Lopburi", "Mukdahan", "Nan",
  "Narathiwat", "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani",
  "Phangnga", "Phatthalung", "Phayao", "Phichit", "Phrae", "Phuket", "Ranong",
  "Rayong", "Roi Et", "Sa Kaeo", "Saraburi", "Satun", "Songkhla", "Sukhothai",
  "Surin", "Tak", "Trang", "Trat", "Udon Thani", "Uthai Thani", "Uttaradit",
  "Yala", "Yasothon", "Buriram", "Chonburi", "Chumphon", "Krabi",
];

const PROV_ALT = PROVINCES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const thConfig: EuCountryConfig = {
  code: "th",
  country: "TH",
  countryNames: ["Thailand", "THA", "TH"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // 5-digit postcode LAST; an optional +4 extension is consumed, not captured.
  postalPattern: "(?<postal_code>\\d{5})(?:-\\d{4})?",

  // Optional "Ban"/"No." lead-in, number (with optional "/n" plot part kept in
  // number), optional glued letter suffix.
  houseNumberPattern:
    "(?:Ban\\s+|No\\.?\\s*)?(?<number>\\d+(?:/\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Keep the khwaeng/khet (tambon/amphoe) + city chain together; routing city is
  // the LAST locality before the province/postcode (postNormalize drops the
  // earlier ones). A real province (before the postcode) -> county slot -> state.
  cityAllowsCommas: true,
  countyPattern: `(?:${PROV_ALT})`,

  // Floor / Room / Unit lead the address (romanized: Chan = floor, Hong = room).
  secUnitPlacement: "before",
  secUnitPattern:
    "(?<sec_unit_type>Floor|Room|Unit|Suite|Chan|Hong)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    floor: "Floor",
    room: "Room",
    unit: "Unit",
    suite: "Suite",
    chan: "Chan",
    hong: "Hong",
  },

  // Thailand Post box forms.
  poBoxNames: ["PO Box", "P.O. Box", "GPO Box", "G.P.O. Box", "Tu Por"],
  poBoxDisplayMap: {
    "po box": "PO Box",
    "p.o. box": "PO Box",
    "gpo box": "GPO Box",
    "g.p.o. box": "GPO Box",
    "tu por": "PO Box",
  },

  // Drop the leading subdistrict/district chain (Khwaeng/Khet, Tambon/Amphoe),
  // keeping the routing city.
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes(",")) {
      const parts = parsed.city.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        parsed.city = parts[parts.length - 1];
        parsed.__dropped = parts.slice(0, -1);
      }
    }
  },
};

export default thConfig;
