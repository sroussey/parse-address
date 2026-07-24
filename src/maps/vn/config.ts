import type { EuCountryConfig } from "../_eu/types";

/**
 * Vietnam (VN) address configuration — Vietnamese, Latin script with diacritics.
 *
 * Order: SMALL-ENDIAN — the house NUMBER leads ("123 Đường Lê Lợi",
 *        "56 Nguyễn Huệ", "25/7 Hai Bà Trưng"). Modeled `order: number-street`.
 * Type: an optional leading GENERIC ("Đường"=street, "Phố"=street[Hanoi],
 *        "Đại lộ"=avenue/boulevard, "Ngõ"=lane[Hanoi], "Hẻm"=alley[HCMC]).
 *        Many streets OMIT the generic ("56 Nguyễn Huệ"), so the type is optional
 *        — the shared prefix grammar already makes a bare (typeless) name a valid
 *        alternative. `typePlacement: prefix`, echoed verbatim.
 * Number: may carry a slash sub-part ("25/7", "12/3A") or a glued letter ("12A").
 *
 * Locality layers (smallest → largest):
 *   ward   — Phường (urban) / Xã (rural commune) / Thị trấn (township)
 *   district — Quận (urban) / Huyện (rural) / Thị xã / Thành phố (provincial city)
 *   province — 63 provinces incl. 5 centrally-governed municipalities.
 *
 * - **Ward → dropped** via a keyword-anchored `(?<drop>...)` baked into the
 *   `postalPattern` slot (which sits between the street and the city). Two forms
 *   are dropped: (a) a MARKED ward ("Phường Bến Nghé", "Xã Tân Thông Hội",
 *   "Phường 12"); (b) a MARKERLESS ward — a bare segment — but ONLY when the
 *   segment that follows begins with a district marker (Quận/Huyện/TP/Thị xã),
 *   so "56 Nguyễn Huệ, Bến Nghé, Quận 1" drops "Bến Nghé" and keeps "Quận 1" as
 *   the city, while a district-only line ("..., Quận 1") never has its district
 *   dropped. The drop is recorded so the token guard exempts it.
 * - **District → `city`.** Numbered ("Quận 1") and named ("Quận Ba Đình",
 *   "Huyện Củ Chi") districts alike; `cityAllowsDigits: true` so a numbered
 *   district survives.
 * - **Province → `state`** via `regionPattern` (kept as written; municipalities
 *   like "TP. Hồ Chí Minh" / "Hà Nội" are included).
 *
 * Postcode: the 2018 six-digit system has near-zero adoption. Modeled OPTIONAL,
 *        BEFORE the city (in the same slot as the ward drop): "..., 700000,
 *        Quận 1, ..." or "..., 700000 Bình Thạnh". `postal_code: \d{6}`.
 *
 * Diacritics: the engine's word boundaries are Unicode-aware, so accented names
 * (Nguyễn, Lê Lợi, Hồ Chí Minh) are matched fine. Everything is lossless.
 *
 * Sources: Smarty / VALO Vietnam / Vietnam Discovery address-format guides;
 * Vietnam Post six-digit postcode (2018); Wikipedia "Provinces of Vietnam".
 * See research-vn.md.
 */

// Optional leading generic thoroughfare word. Longest first handled by ruleset.
const TYPES = ["Đại lộ", "Đại Lộ", "Đường", "Phố", "Ngõ", "Ngách", "Hẻm", "Đ."];

const TYPE_SHORT: Record<string, string> = {
  "đường": "D", "đ.": "D",
  "phố": "PHO",
  "đại lộ": "DL", "đại lộ ": "DL",
  "ngõ": "NGO",
  "hẻm": "HEM",
};

// 63 provinces + centrally-governed municipalities (with common spellings).
// Longest first for the alternation; spaces escaped to \s+ by the config.
const PROVINCES = [
  "Thành phố Hồ Chí Minh", "TP. Hồ Chí Minh", "TP Hồ Chí Minh", "Hồ Chí Minh",
  "Thành phố Hà Nội", "TP. Hà Nội", "TP Hà Nội", "Hà Nội",
  "Thành phố Hải Phòng", "TP. Hải Phòng", "Hải Phòng",
  "Thành phố Đà Nẵng", "TP. Đà Nẵng", "Đà Nẵng",
  "Thành phố Cần Thơ", "TP. Cần Thơ", "Cần Thơ",
  "Bà Rịa - Vũng Tàu", "Bà Rịa – Vũng Tàu", "Thừa Thiên Huế", "Thừa Thiên - Huế",
  "An Giang", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre",
  "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng",
  "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai",
  "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
  "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình",
  "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi",
  "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình",
  "Thái Nguyên", "Thanh Hóa", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
];

const esc = (s: string) => s.replace(/ /g, "\\s+");

// Marked ward lead-ins that are consumed and dropped.
const WARD_KW = "Phường|Phuong|Xã|Xa|Thị\\s+trấn|Thị\\s+Trấn|Thi\\s+tran";

export const vnConfig: EuCountryConfig = {
  code: "vn",
  country: "VN",
  countryNames: ["Việt Nam", "Viet Nam", "Vietnam", "VNM", "VN"],

  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // District names carry digits ("Quận 1", "Phường 12" as a dropped ward too).
  cityAllowsDigits: true,

  // The "postal slot" sits between the street and the city as
  //   SEP1  (?: PATTERN  SEP2 )?  CITY      (SEP = [\s,]+, supplied by engine).
  // PATTERN carries an OPTIONAL 6-digit postcode and/or an OPTIONAL MARKED ward
  // drop — postcode tried FIRST so a bare "700000" is never mistaken for a ward:
  //   alt 1: postcode only                        "700000"
  //   alt 2: a MARKED ward drop (+ optional internal postcode)
  //            "Phường Bến Nghé", "Phường 12", "Xã Tân Thông Hội", "Thị trấn ..."
  //
  // Only MARKED wards are dropped. A markerless ward ("..., Bến Nghé, Quận 1")
  // is indistinguishable from the last word of a two-word street name once the
  // ward marker is gone, so it is NOT dropped (see research-vn.md). The far more
  // common ward-OMITTED form ("70 Nguyễn Huệ, Quận 1, TP. HCM") then parses
  // cleanly with city = district and state = province.
  postalPattern:
    "(?:(?<postal_code>\\d{6})" +
    "|(?<drop>(?:" + WARD_KW + ")[^,\\n]*)(?:\\s*,\\s*(?<postal_code_2>\\d{6}))?)",

  // Small-endian: leading house number. Slash sub-part ("25/7", "12/3A") kept in
  // number; a single glued trailing letter is the civic suffix ("12A" -> 12 + A).
  houseNumberPattern:
    "(?<number>\\d+(?:/\\d+[A-Za-z]?)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: {},
  typeShortCodeMap: TYPE_SHORT,

  // Province after the district -> state (kept as written).
  regionPattern: `(?<state>${PROVINCES.map(esc).join("|")})`,

  // Floor / apartment / block unit (Vietnamese Tầng/Lầu, English Floor/Room).
  secUnitPattern:
    "(?<sec_unit_type>Tầng|Lầu|Phòng|Căn|Lô|Block|Floor|Room)\\.?\\s*(?<sec_unit_num>[\\w-]+)",
  secUnitDisplayMap: {
    "tầng": "Tầng", "lầu": "Lầu", "phòng": "Phòng", "căn": "Căn",
    "lô": "Lô", block: "Block", floor: "Floor", room: "Room",
  },
};

export default vnConfig;
