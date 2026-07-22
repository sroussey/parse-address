/**
 * Shared configuration model for the European address parsers.
 *
 * European addressing is far more varied than the US/CA number-first grammar,
 * so instead of hand-writing an XRegExp grammar per country we describe each
 * country declaratively and let `buildEuRuleset` assemble the grammar. The
 * three axes that actually differ between countries are:
 *
 *   1. `order`        - is the house number written before or after the street?
 *                       (FR/GB: number first; DE/NL/IT/ES: street first)
 *   2. `typePlacement`- where the street *type* sits relative to the name:
 *                       prefix (Via Roma), suffix (Downing Street), fused
 *                       (Bäckerstraße -> Bäcker + straße), or none.
 *   3. `postalPlacement` - continental europe writes the postcode before the
 *                       city ("10115 Berlin"); the UK writes it last.
 *
 * Everything else (postcode shape, house-number shape, the type vocabulary,
 * optional region/province, secondary-unit words) is supplied as regex
 * fragments or lookup maps.
 */
export interface EuCountryConfig {
  /** ISO 3166-1 alpha-2 code, lowercase (e.g. "de"). Used as the map key. */
  code: string;
  /** Value written to the `country` output field (e.g. "DE"). */
  country: string;
  /**
   * Country name/code spellings, used both to build the optional trailing
   * `country` capture group and for auto-detection in `IntlAddressParser`.
   */
  countryNames: string[];

  /** House-number position relative to the street. */
  order: "number-street" | "street-number";
  /** Where the street type sits relative to the street name. */
  typePlacement: "prefix" | "suffix" | "fused" | "none";
  /** Postcode position relative to the city. */
  postalPlacement: "before-city" | "after-city";
  /**
   * Allow digits inside the street name even for a street-first (number-after)
   * order. Needed where date/number street names are common (Polish "3 Maja",
   * "11 Listopada"); the trailing house number is still found as the last
   * number token. Defaults to false (digits excluded) for street-first orders.
   */
  allowDigitsInName?: boolean;

  /**
   * XRegExp fragment capturing `(?<postal_code>...)`. Written in free-spacing
   * (`x`) mode, so escape literal spaces as `\ ` or use `\s`.
   */
  postalPattern: string;
  /**
   * Optional canonicaliser for the captured postcode (e.g. upper-case the two
   * letters and normalise the space in a UK/NL code). Defaults to a trim +
   * single-space collapse.
   */
  postalFormat?: (raw: string) => string;
  /**
   * XRegExp fragment capturing `(?<number>...)` and, optionally,
   * `(?<civic_number_suffix>...)` (letter/bis/ter/annex).
   */
  houseNumberPattern: string;

  /**
   * Alternation of street-type spellings (already regex-escaped where needed),
   * longest first. Used for `prefix`/`suffix` placements. Ignored for `fused`.
   */
  types?: string[];
  /**
   * For `fused` placement: the glued type suffixes to peel off the end of a
   * street token, as `[suffixSpelling, canonicalDisplay]` (matched longest-first
   * regardless of order). e.g. `["straße", "Straße"]`. Case-insensitive.
   */
  fusedTypeSuffixes?: Array<[string, string]>;
  /**
   * Minimum length of the remaining name stem for a fused split to apply.
   * Guards against splitting a bare type word ("Ring") or a too-short remnant.
   * Defaults to 3; Swedish stems are often two chars ("Nygatan" -> "Ny"), so SE
   * lowers it to 2.
   */
  minFusedStem?: number;

  /**
   * Whether a fused type written as a *separate* word is still split off.
   * German splits "Leipziger Straße" -> "Leipziger" + "Straße" (true, default);
   * Dutch keeps "Grote Markt" / "Gedempte Oude Gracht" whole (false) and only
   * splits a glued suffix ("Herengracht" -> "Heren" + "gracht").
   */
  splitSpacedType?: boolean;
  /**
   * When splitting a spaced type, whether the last word must *equal* a type
   * exactly. Austrian "Landstraßer Hauptstraße" takes the whole compound last
   * word as the type (false, default); Finnish "Läntinen Brahenkatu" instead
   * splits *within* the compound ("Läntinen Brahen" + "katu"), so the whole-word
   * rule only fires for a bare "... katu" (true).
   */
  spacedTypeExact?: boolean;

  /**
   * When false, the street type is echoed exactly as written (case and trailing
   * dot preserved) instead of being canonicalised via `typeDisplayMap` -- some
   * corpora (e.g. FR) keep the type verbatim. Short codes are still computed
   * from the lower-cased form. Defaults to true.
   */
  normalizeTypeCase?: boolean;

  /**
   * Articles (e.g. "The") that, when they are the *entire* name in front of a
   * suffix type, mean the type word is part of the name: "The Broadway" is the
   * whole street name, not "The" + type "Broadway".
   */
  articleNames?: string[];

  /** lowercased type spelling/abbreviation -> canonical display form. */
  typeDisplayMap: Record<string, string>;
  /** canonical display form (lowercased) -> short code. Optional. */
  typeShortCodeMap?: Record<string, string>;

  /**
   * Optional trailing city qualifier consumed (but not captured) after the city
   * name, e.g. the French "CEDEX 08" delivery-office marker. Regex fragment.
   */
  citySuffixPattern?: string;
  /**
   * Allow digits inside the captured city, for places with a numbered district
   * ("Praha 1"). Defaults to false (a digit ends the city).
   */
  cityAllowsDigits?: boolean;
  /**
   * Allow commas inside the captured city, so a comma-separated locality chain
   * stays together (Irish "Ballsbridge, Dublin 4"). Defaults to false.
   */
  cityAllowsCommas?: boolean;
  /**
   * For after-city layouts, the pattern (regex fragment) the trailing county
   * must match, so it is distinguished from a district that belongs to the city
   * (Irish "Co. Cork"). Defaults to any comma-delimited word run.
   */
  countyPattern?: string;

  /** XRegExp fragment capturing `(?<state>...)` for a region/province. */
  regionPattern?: string;
  /** lowercased region name/code -> normalized region code. */
  regionMap?: Record<string, string>;

  /**
   * XRegExp fragment capturing a secondary unit as `(?<sec_unit_type>...)` and
   * `(?<sec_unit_num>...)`. Placed between the street/number block and the
   * place tail.
   */
  secUnitPattern?: string;
  /**
   * Where the secondary unit sits relative to the street. "before" for the UK
   * "Flat 4, 12 Downing Street" leading unit; "after" (default) for continental
   * trailing units.
   */
  secUnitPlacement?: "before" | "after";
  /** lowercased secondary-unit word -> canonical display form. */
  secUnitDisplayMap?: Record<string, string>;
  /**
   * Type applied to a secondary unit captured with no type word of its own,
   * e.g. a Spanish floor+door "3.º B" whose implied type is "Piso".
   */
  defaultSecUnitType?: string;

  /**
   * Optional final country-specific fixup, run at the end of normalization with
   * the assembled result. Used for structure that the shared grammar cannot
   * express declaratively (e.g. the Austrian "N/M" -> Tür vs "N/M/K" -> Stiege
   * distinction). It should read any helper capture groups it added and delete
   * them so they do not leak into the output.
   */
  postNormalize?: (parsed: Record<string, any>) => void;

  /**
   * PO-box lead-in words (e.g. ["Postfach"], ["BP", "Boîte Postale"]). Used to
   * detect and parse box addresses that replace the street entirely.
   */
  poBoxNames?: string[];
  /** lowercased PO-box word -> canonical display form. */
  poBoxDisplayMap?: Record<string, string>;

  /**
   * Street-name prefixes (prepositions/articles) that mark an *unsplittable*
   * name: when the street starts with one of these, the fused type-suffix
   * splitter is skipped so e.g. "Am Weidendamm" is not cut into "Am Weiden" +
   * "Damm". Matched case-insensitively as whole words at the start.
   */
  unsplittablePrefixes?: string[];

  /**
   * Exact street names (case-insensitive) that are lexicalised as a whole and
   * must not be fuse-split, even though they end in a productive type suffix.
   * e.g. "Neumarkt"/"Altmarkt" are square names, not "Neu"/"Alt" + "Markt".
   */
  unsplittableExact?: string[];
}
