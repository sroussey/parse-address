import type { EuCountryConfig } from "../_eu/types";

/**
 * Azerbaijan (AZ) address configuration — Azerbaijani, Latin script.
 *
 * Order: street NAME first, then the thoroughfare TYPE as a trailing SUFFIX
 *        ("28 May küçəsi", "Neftçilər prospekti"), then the building number
 *        AFTER the type ("28 May küçəsi 5"). This is the dominant written form,
 *        modeled `order: street-number`, `typePlacement: suffix`. The number may
 *        be introduced by "ev" (house) and carry a range/sub-part or a glued
 *        letter ("5A", "5/7").
 * Type (izafet suffix noun): küçəsi (street), prospekti (avenue), döngəsi (lane),
 *        şosesi (highway/road), meydanı (square), yolu (road); abbreviations
 *        küç. / pr. Echoed as written (`normalizeTypeCase: false`).
 * Names with numbers ("28 May", "8 Noyabr", "20 Yanvar") are common, so
 *        `allowDigitsInName: true`; the trailing building number is still the
 *        last number token.
 * Postcode: "AZ" + 4 digits ("AZ1000"), written BEFORE the city (per the task
 *        brief). Optional. Internal space ("AZ 1000") normalised away.
 * Rayon (district): "<name> rayonu" is an administrative sublayer with no output
 *        field; when a city follows, it is consumed and DROPPED via a
 *        keyword-anchored `(?<drop>...)` (anchored on the "rayon"/"rayonu" word,
 *        digit-free so it can never swallow a numbered street). The routing
 *        `city` is Baku (Bakı), Ganja (Gəncə), Sumqayıt, etc.
 * City suffix: an optional "şəhəri" / "ş." (= city) after the city name is
 *        consumed ("Bakı şəhəri" -> city Bakı).
 *
 * KNOWN GAPS (see research-az.md): big-endian ordering ("Bakı, Nəsimi rayonu,
 * 28 May küçəsi 5") and the international-envelope form that writes the postcode
 * AFTER the city ("BAKU AZ1010") are not modeled — the dominant small-endian,
 * postcode-before-city form is; other forms are marked `__skip` losslessly.
 *
 * Sources: PostGrid / Smarty Azerbaijan address-format guides; Wikipedia "Postal
 * codes in Azerbaijan" (AZ + 4 digits); Azərpoçt. See research-az.md.
 */

// Suffix type nouns, longest-first is handled by the ruleset.
const TYPES = [
  "prospekti", "küçəsi", "döngəsi", "şosesi", "meydanı", "yolu",
  // abbreviations (trailing dot kept)
  "küç.", "pr.",
];

const TYPE_DISPLAY: Record<string, string> = {
  "küçəsi": "küçəsi", "küç.": "küçəsi",
  prospekti: "prospekti", "pr.": "prospekti",
  "döngəsi": "döngəsi",
  "şosesi": "şosesi",
  "meydanı": "meydanı",
  yolu: "yolu",
};

const TYPE_SHORT: Record<string, string> = {
  "küçəsi": "KUC",
  prospekti: "PR",
  "döngəsi": "DNG",
  "şosesi": "SOS",
  "meydanı": "MEY",
  yolu: "YOL",
};

export const azConfig: EuCountryConfig = {
  code: "az",
  country: "AZ",
  countryNames: ["Azərbaycan", "Azerbaijan", "AZE", "AZ"],

  order: "street-number",
  typePlacement: "suffix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,
  // Numbered street names: "28 May", "8 Noyabr", "20 Yanvar".
  allowDigitsInName: true,

  // "AZ" + 4 digits, before the city; OR a rayon drop (+ optional internal
  // postcode). Postcode tried first so a bare code is never mistaken for a rayon.
  // The rayon drop is anchored on "rayon"/"rayonu" and carries NO digits, so a
  // numbered street can never be swallowed.
  postalPattern:
    "(?:(?<postal_code>AZ\\s?\\d{4})" +
    "|(?<drop>[^,\\d\\n]*?rayonu?)(?:\\s*,\\s*(?<postal_code_2>AZ\\s?\\d{4}))?)",
  postalFormat: (raw: string) => raw.replace(/\s+/g, "").toUpperCase(),

  // Building number AFTER the type; optional "ev" (house) / № / # lead-in, an
  // optional range or slash sub-part, and an optional glued letter suffix.
  houseNumberPattern:
    "(?:(?:ev|№|\\#)\\s*)?(?<number>\\d+(?:\\s*[-/]\\s*\\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  types: TYPES,
  typeDisplayMap: TYPE_DISPLAY,
  typeShortCodeMap: TYPE_SHORT,

  // Optional "şəhəri"/"ş." (city) qualifier after the city name.
  citySuffixPattern: "\\s*(?:şəhəri|ş\\.)",

  // Apartment / block secondary unit: "mənzil 12" / "m. 12", "blok B".
  secUnitPattern:
    "(?<sec_unit_type>mənzil|blok|m\\.)\\s*\\.?\\s*(?<sec_unit_num>\\d+[A-Za-z]?|[A-Za-z])",
  secUnitDisplayMap: {
    "mənzil": "mənzil", "m.": "mənzil", blok: "blok",
  },
};

export default azConfig;
