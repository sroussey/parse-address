import XRegExp from "xregexp";
import { AddressParserImpl } from "../../types/parser";
import type { EuCountryConfig } from "./types";
import { buildEuRuleset, type EuRuleset } from "./ruleset";

const NUMERIC = /^\d+$/;

/**
 * Generic, configuration-driven parser for European addresses. One instance per
 * country, built from an `EuCountryConfig`. Implements the same surface as the
 * US/CA parsers so it drops straight into the `AddressParser` facade.
 */
export class AddressParserEU implements AddressParserImpl {
  readonly config: EuCountryConfig;
  private readonly ruleset: EuRuleset;
  // Precomputed once per country (these are invariant across parse calls).
  private readonly poAnywhereRe: RegExp;
  private readonly fusedSuffixesSorted: Array<[string, string]>;
  private readonly unsplittablePrefixRe: RegExp | null;
  // Locational tokens the most recent parse deliberately dropped (e.g. a ZA
  // suburb superseded by the routing city), so the token-preservation guard
  // does not score them as lost. postNormalize records them via `parsed.__dropped`.
  private lastDropped: string[] = [];

  constructor(config: EuCountryConfig) {
    this.config = config;
    this.ruleset = buildEuRuleset(config);
    // Detect the PO-box word anywhere: it may lead the line, or sit after a
    // leading building ("Sea Meadow House, PO Box 116, ..."). The anchored
    // po_address grammar simply returns null when it does not actually fit.
    this.poAnywhereRe = XRegExp(`(?:${this.ruleset.po_box})(?![A-Za-z])`, "xi");
    // Longest suffix first so "strasse" wins over "str" regardless of config order.
    this.fusedSuffixesSorted = [...(config.fusedTypeSuffixes ?? [])].sort(
      (a, b) => b[0].length - a[0].length
    );
    const prefixes = config.unsplittablePrefixes ?? [];
    this.unsplittablePrefixRe = prefixes.length
      ? new RegExp(`^(?:${prefixes.map((p) => XRegExp.escape(p)).join("|")})\\s`, "i")
      : null;
  }

  // --- public surface -------------------------------------------------------

  parseAddress(address: string) {
    return this.normalizeAddress(XRegExp.exec(address, this.ruleset.address));
  }

  parseStreet(streetaddress: string) {
    return this.normalizeAddress(
      XRegExp.exec(streetaddress, this.ruleset.street_address)
    );
  }

  parseInformalAddress(address: string) {
    return this.normalizeAddress(
      XRegExp.exec(address, this.ruleset.informal_address)
    );
  }

  parsePoAddress(address: string) {
    return this.normalizeAddress(XRegExp.exec(address, this.ruleset.po_address));
  }

  parseLocation(address: string) {
    if (this.poAnywhereRe.test(address)) {
      const po = this.parsePoAddress(address);
      if (po) return po;
    }
    // A pure location line (postcode + city, no street) is anchored end-to-end,
    // so a real street line can never match it -- try it before the street
    // grammar, which otherwise swallows a bare postcode as a numeric street.
    // Only for postcode-first (continental) layouts: with the postcode last, a
    // number-less street line ("Bruntsfield Place, Edinburgh, GIR 0AA") is
    // indistinguishable from "city, county, postcode", so we must parse it as a
    // street instead.
    if (this.config.postalPlacement === "before-city") {
      const placeOnly = this.normalizeAddress(
        XRegExp.exec(address, this.ruleset.place_only)
      );
      if (placeOnly) return placeOnly;
    }

    // A settlement-only line ("Bodden Town, Grand Cayman, KY1-1601") has no
    // street; its required island suffix keeps it from claiming a real street,
    // so try it before parseAddress (which would take the settlement as street).
    if (this.ruleset.settlement_only) {
      const s = this.normalizeAddress(
        XRegExp.exec(address, this.ruleset.settlement_only)
      );
      if (s) return s;
    }

    // A building-only line ("OMC Chambers, Wickhams Cay 1, Road Town, ...") has
    // no street of its own; its mandatory area marker keeps it from competing
    // with an ordinary building-then-street line, so try it before parseAddress.
    if (this.ruleset.building_address) {
      const b = this.normalizeAddress(
        XRegExp.exec(address, this.ruleset.building_address)
      );
      if (b) return b;
    }

    return this.parseAddress(address) || this.parseInformalAddress(address);
  }

  // European addresses do not use US-style street intersections; expose the
  // method for interface parity but return null.
  parseIntersection(_address: string) {
    return null;
  }

  droppableTokens(): string[] {
    return [...(this.config.areaNames ?? []), ...this.lastDropped];
  }

  findStreetTypeShortCode(streetType?: string): string {
    const blank = "BL";
    if (!streetType) return blank;
    const map = this.config.typeShortCodeMap;
    if (!map) return blank;
    const key = streetType.toLowerCase();
    const direct = map[key];
    if (direct) return direct;
    // The caller may pass a raw spelling/abbreviation; canonicalise first.
    const display = this.config.typeDisplayMap[key];
    const viaDisplay = display ? map[display.toLowerCase()] : undefined;
    if (viaDisplay) return viaDisplay;
    return blank;
  }

  // --- normalization --------------------------------------------------------

  normalizeAddress(parts: Record<string, any> | null) {
    if (!parts) return null;

    const parsed: Record<string, any> = {};
    // Values captured by a `drop` group (a neighbourhood/bairro/colonia the
    // grammar consumes but does not emit) are recorded as dropped so the
    // token-preservation guard does not score them as lost.
    const dropped: string[] = [];
    Object.keys(parts).forEach((part) => {
      if (["input", "index"].includes(part) || NUMERIC.test(part)) return;
      // Group names may carry a numeric disambiguation suffix (street_1); the
      // logical field is the name with that suffix removed.
      const tail = part.split("_").pop();
      const key =
        tail && NUMERIC.test(tail)
          ? part.split("_").slice(0, -1).join("_")
          : part;
      const value = parts[part];
      if (value == null) return;
      const cleaned = this.cleanValue(String(value));
      if (!cleaned) return;
      if (key === "drop") dropped.push(cleaned);
      else parsed[key] = cleaned;
    });

    if (Object.keys(parsed).length === 0) return null;

    this.normalizeNumberSuffix(parsed);
    this.applyFusedType(parsed);
    this.foldArticleType(parsed);
    this.normalizeType(parsed);
    this.normalizeSecUnit(parsed);
    this.normalizePostal(parsed);
    this.normalizeRegion(parsed);
    this.tidyCity(parsed);

    this.lastDropped = dropped;
    if (this.config.postNormalize) this.config.postNormalize(parsed);
    // postNormalize may report further dropped locational tokens (open-ended
    // values that cannot be listed in `areaNames`), exempting them too.
    if (Array.isArray(parsed.__dropped)) {
      this.lastDropped = [
        ...dropped,
        ...parsed.__dropped.filter((t: unknown) => typeof t === "string"),
      ];
      delete parsed.__dropped;
    }

    parsed.country = this.config.country;
    return parsed;
  }

  /**
   * Tidy a civic-number suffix: collapse whitespace around a range dash
   * ("24 - 26" -> "24-26") and trim the ends, but keep an internal space in
   * markers like the Spanish "km 176".
   */
  private normalizeNumberSuffix(parsed: Record<string, any>) {
    if (parsed.civic_number_suffix) {
      parsed.civic_number_suffix = String(parsed.civic_number_suffix)
        .replace(/\s*-\s*/g, "-")
        .replace(/^[\s]+|[\s]+$/g, "");
    }
  }

  /** Trim surrounding whitespace/commas while preserving accents and casing. */
  private cleanValue(value: string): string {
    return value
      .replace(/\s+/g, " ")
      .replace(/^[\s,]+/, "")
      .replace(/[\s,]+$/, "")
      .trim();
  }

  /**
   * Peel a glued street type off the end of the name (DE/NL "Bäckerstraße").
   * Runs for any country that supplies `fusedTypeSuffixes` -- including
   * mixed-grammar countries (BE/CH) whose `prefix` French/Italian streets are
   * already typed (so this is a no-op there) but whose Dutch/German streets
   * arrive here untyped.
   */
  private applyFusedType(parsed: Record<string, any>) {
    if (!this.config.fusedTypeSuffixes?.length) return;
    if (!parsed.street || parsed.type) return;

    // Prepositional/article-led names ("Am Weidendamm", "Unter den Linden") are
    // unsplittable: keep the whole name and leave the type empty.
    if (this.unsplittablePrefixRe && this.unsplittablePrefixRe.test(parsed.street)) {
      return;
    }
    const exact = this.config.unsplittableExact ?? [];
    if (exact.some((n) => n.toLowerCase() === parsed.street.toLowerCase())) return;

    // A trailing abbreviation dot ("Berliner Str.") should not defeat the match.
    const base = String(parsed.street).replace(/\.\s*$/, "");
    const lower = base.toLowerCase();
    const splitSpaced = this.config.splitSpacedType !== false;
    for (const [spelling, display] of this.fusedSuffixesSorted) {
      const s = spelling.toLowerCase();
      if (!lower.endsWith(s)) continue;

      // When the type is a *separate word* ("Kärntner Straße", "Landstraßer
      // Hauptstraße"), the type is that whole last word -- not a mid-word split
      // ("...Haupt" + "straße"). This applies only where spaced types split.
      const lastSpace = base.lastIndexOf(" ");
      if (splitSpaced && lastSpace >= 1) {
        const lastWord = base.slice(lastSpace + 1);
        const lw = lastWord.toLowerCase();
        const isWholeType = this.config.spacedTypeExact ? lw === s : lw.endsWith(s);
        if (isWholeType) {
          parsed.street = base.slice(0, lastSpace).replace(/[\s-]+$/, "").trim();
          parsed.type = lastWord; // normalizeType canonicalises it afterwards
          return;
        }
      }

      // Otherwise peel the glued suffix from within the single word.
      const remainder = base.slice(0, base.length - s.length);
      if (remainder.trim().length < (this.config.minFusedStem ?? 3)) continue;
      // When spaced types are not split (Dutch/Belgian), a preceding *space*
      // means the suffix is a separate word ("Grote Markt") that stays whole; a
      // hyphen still counts as joined ("Albert I-laan" -> "Albert I" + "laan").
      if (!splitSpaced && /\s$/.test(remainder)) continue;
      parsed.street = remainder.replace(/[\s-]+$/, "").trim();
      parsed.type = display;
      return;
    }
  }

  /** "The" + suffix type ("The Broadway") is one whole name, not a split. */
  private foldArticleType(parsed: Record<string, any>) {
    const articles = this.config.articleNames ?? [];
    if (!parsed.type || !parsed.street || !articles.length) return;
    if (articles.some((a) => a.toLowerCase() === parsed.street.toLowerCase())) {
      parsed.street = `${parsed.street} ${parsed.type}`.trim();
      delete parsed.type;
    }
  }

  /** Canonicalise the street type display form and compute its short code. */
  private normalizeType(parsed: Record<string, any>) {
    if (!parsed.type) return;
    const raw = String(parsed.type).replace(/\.$/, "").toLowerCase();
    if (this.config.normalizeTypeCase === false) {
      // Keep the type exactly as written; only derive the short code.
      const short = this.findStreetTypeShortCode(raw);
      if (short !== "BL") parsed.short_street_type = short;
      return;
    }
    const display = this.config.typeDisplayMap[raw] ?? this.titleCase(parsed.type);
    parsed.type = display;
    const short = this.findStreetTypeShortCode(display);
    if (short !== "BL") parsed.short_street_type = short;
  }

  private normalizeSecUnit(parsed: Record<string, any>) {
    if (parsed.sec_unit_type) {
      const rawLower = String(parsed.sec_unit_type).toLowerCase();
      const key = rawLower.replace(/\.$/, "");
      const sm = this.config.secUnitDisplayMap ?? {};
      const pm = this.config.poBoxDisplayMap ?? {};
      const display = sm[key] || sm[rawLower] || pm[key] || pm[rawLower];
      if (display) parsed.sec_unit_type = display;
    }
    // A secondary unit captured without its own type word (e.g. a Spanish floor
    // "3.º B") gets the country's default type ("Piso").
    if (!parsed.sec_unit_type && parsed.sec_unit_num && this.config.defaultSecUnitType) {
      parsed.sec_unit_type = this.config.defaultSecUnitType;
    }
    // Grouped PO-box numbers ("10 01 20") join into one token ("100120"). Only
    // all-digit grouped runs are collapsed; a floor like "3.º B" keeps its space.
    if (parsed.sec_unit_num && /^\d[\d\s-]*\d$/.test(parsed.sec_unit_num)) {
      parsed.sec_unit_num = String(parsed.sec_unit_num).replace(/\s+/g, "");
    }
  }

  private normalizePostal(parsed: Record<string, any>) {
    if (!parsed.postal_code) return;
    const fmt = this.config.postalFormat;
    parsed.postal_code = fmt
      ? fmt(parsed.postal_code)
      : String(parsed.postal_code).replace(/\s+/g, " ").trim();
  }

  private normalizeRegion(parsed: Record<string, any>) {
    if (!parsed.state) return;
    const map = this.config.regionMap;
    const key = String(parsed.state).toLowerCase().replace(/[()]/g, "").trim();
    const mapped = map && map[key];
    if (mapped) {
      parsed.state = mapped;
    } else if (/^[a-z]{2}$/i.test(key)) {
      parsed.state = key.toUpperCase();
    } else {
      // Free-form region/county (e.g. UK "Surrey"): keep as written, trimmed.
      parsed.state = String(parsed.state).replace(/^[\s,]+|[\s,]+$/g, "");
    }
  }

  private tidyCity(parsed: Record<string, any>) {
    if (!parsed.city) return;
    parsed.city = String(parsed.city).replace(/\s+/g, " ").trim();
  }

  private titleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }
}
