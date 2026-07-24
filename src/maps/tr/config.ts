import type { EuCountryConfig } from "../_eu/types";

/**
 * Turkey (TR) address configuration. SEC code W8.
 *
 * Order: street NAME first, then the type noun (izafet) as a trailing SUFFIX
 *        ("Atatürk Bulvarı", "İstiklal Caddesi"), then the building number
 *        introduced by "No:" ("No:191"). Because the number is explicitly
 *        labelled, the houseNumberPattern consumes the "No:" lead-in.
 * Type: suffix noun — Caddesi/Cad., Sokak/Sok., Bulvarı/Bulv., Meydanı, Yolu.
 * Number: "No:<n>", optional "/A" block letter (civic_number_suffix), ranges.
 * Secondary unit: Daire ("D:<n>"), Kat ("K:<n>"), Blok.
 * Postcode: 5-digit, BEFORE the district (before-city). First two digits are
 *        the province plate code (06 Ankara, 34 İstanbul, ...).
 * city = district (ilçe); state = province (il), after the district, usually
 *        separated by a slash ("Çankaya/Ankara").
 *
 * KNOWN GAPS (see research-tr.md): the neighbourhood (Mahalle/Mah.) and any
 * Apartman/Site building name have no engine field and are dropped/noted;
 * Turkish diacritics (ç ğ ı İ ö ş ü) must be preserved by the shared grammar's
 * Unicode-aware name/city classes; numbered street names ("1234. Sokak") rely
 * on allowDigitsInName.
 */

const TYPES = [
  // full izafet forms, longest first
  "Caddesi", "Sokağı", "Sokak", "Bulvarı", "Meydanı", "Yolu", "Cadde",
  "Bulvar",
  // abbreviations (with trailing dot so they cannot eat a name's first word)
  "Cad.", "Cd.", "Sok.", "Sk.", "Bulv.", "Blv.", "Bul.", "Meyd.",
];

const TYPE_DISPLAY: Record<string, string> = {
  caddesi: "Caddesi", cadde: "Caddesi", "cad.": "Caddesi", "cd.": "Caddesi",
  sokak: "Sokak", "sokağı": "Sokak", "sok.": "Sokak", "sk.": "Sokak",
  "bulvarı": "Bulvarı", bulvar: "Bulvarı", "bulv.": "Bulvarı",
  "blv.": "Bulvarı", "bul.": "Bulvarı",
  "meydanı": "Meydanı", "meyd.": "Meydanı",
  yolu: "Yolu",
};

const TYPE_SHORT: Record<string, string> = {
  caddesi: "CAD",
  sokak: "SOK",
  "bulvarı": "BLV",
  "meydanı": "MEYD",
  yolu: "YOLU",
};

// 81 Turkish provinces (il) -> plate-code string. Used to detect the trailing
// province after the district. Kept as display names; plate code is the norm.
const PROVINCES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara",
  "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman",
  "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne",
  "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
  "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
  "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri",
  "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya",
  "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş",
  "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun",
  "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
];

export const trConfig: EuCountryConfig = {
  code: "tr",
  country: "TR",
  countryNames: ["Türkiye", "Turkey", "TUR", "TR"],

  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "before-city",
  // Type echoed as written (Caddesi, Cad., Bulvarı) but canonicalised via map.
  normalizeTypeCase: false,
  // Numbered street names: "1234. Sokak", "100. Yıl Bulvarı", "8. Cadde".
  allowDigitsInName: true,

  // 5-digit posta kodu (leading zeros significant).
  postalPattern: "(?<postal_code>\\d{5})",

  // "No:" lead-in (also No. / No / Nu.), then the building number ("10-12"
  // range kept in number), then an optional "/A" block letter as the civic
  // suffix ("No:12/B" -> number 12, suffix B).
  houseNumberPattern:
    "(?:No|Nu)\\s*[:.]?\\s*(?<number>\\d+(?:\\s*[-–]\\s*\\d+)?)(?:\\s*/\\s*(?<civic_number_suffix>[A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // District (ilçe) can carry Turkish letters; province follows after a slash or
  // comma. regionPattern optionally eats the leading "/" separator.
  // (Extend/adjust separator handling when validating against samples.)
  regionPattern: `[/,]?\\s*(?<state>${PROVINCES.join("|")})`,

  // Daire (apartment) "D:5" / "Daire:7", Kat (floor) "Kat:3" / "K:2", and Blok
  // ("A Blok" letter-first, or "Blok:B"). One slot; a second unit is noted.
  secUnitPattern:
    "(?<sec_unit_type>Daire|Kat|Blok|Da|Blk|D|K)\\s*[:.]?\\s*(?<sec_unit_num>[\\w-]+)" +
    "|(?<sec_unit_num_2>[A-Za-z0-9]+)\\s*(?<sec_unit_type_2>Blok)",
  secUnitDisplayMap: {
    daire: "Daire", d: "D", da: "D",
    kat: "Kat", k: "Kat",
    blok: "Blok", blk: "Blok",
  },

  // The trailing "district/province" ("Kadıköy/İstanbul") is captured whole in
  // the city (the "/" is not a place delimiter the shared grammar splits on), so
  // split it here: city = ilçe (district), state = il (province).
  postNormalize: (parsed: Record<string, any>) => {
    if (typeof parsed.city === "string" && parsed.city.includes("/")) {
      const [city, province] = parsed.city.split("/");
      parsed.city = (city ?? "").trim();
      if (province && !parsed.state) parsed.state = province.trim();
    }
  },

  // Named building / gated complex leading the address (Gül Apartmanı, ... Sitesi).
  buildingKeywords: [
    "Apartmanı", "Apartman", "Apt", "Sitesi", "Site", "Plaza", "İş Merkezi",
    "Han", "Rezidans", "Konutları",
  ],

  // PTT: PK (posta kutusu) box.
  poBoxNames: ["PK", "P.K.", "Posta Kutusu"],
  poBoxDisplayMap: { pk: "PK", "p.k.": "PK", "posta kutusu": "PK" },
};

export default trConfig;
