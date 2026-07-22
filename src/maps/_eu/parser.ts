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

  constructor(config: EuCountryConfig) {
    this.config = config;
    this.ruleset = buildEuRuleset(config);
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
    if (XRegExp(`^\\s*(?:${this.ruleset.po_box})(?![A-Za-z])`, "xi").test(address)) {
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

    return this.parseAddress(address) || this.parseInformalAddress(address);
  }

  // European addresses do not use US-style street intersections; expose the
  // method for interface parity but return null.
  parseIntersection(_address: string) {
    return null;
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
      if (cleaned) parsed[key] = cleaned;
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

  /** Peel a glued street type off the end of the name (DE/NL style). */
  private applyFusedType(parsed: Record<string, any>) {
    if (this.config.typePlacement !== "fused") return;
    if (!parsed.street || parsed.type) return;

    // Prepositional/article-led names ("Am Weidendamm", "Unter den Linden") are
    // unsplittable: keep the whole name and leave the type empty.
    const prefixes = this.config.unsplittablePrefixes ?? [];
    if (prefixes.length) {
      const re = new RegExp(`^(?:${prefixes.join("|")})\\s`, "i");
      if (re.test(parsed.street)) return;
    }
    const exact = this.config.unsplittableExact ?? [];
    if (exact.some((n) => n.toLowerCase() === parsed.street.toLowerCase())) return;

    // A trailing abbreviation dot ("Berliner Str.") should not defeat the match.
    const base = String(parsed.street).replace(/\.\s*$/, "");
    const lower = base.toLowerCase();
    // Longest suffix first so "strasse" wins over "str" regardless of config order.
    const suffixes = [...(this.config.fusedTypeSuffixes ?? [])].sort(
      (a, b) => b[0].length - a[0].length
    );
    const splitSpaced = this.config.splitSpacedType !== false;
    for (const [spelling, display] of suffixes) {
      const s = spelling.toLowerCase();
      if (lower.endsWith(s)) {
        const remainder = base.slice(0, base.length - s.length);
        if (remainder.trim().length < 3) continue;
        // When spaced types are not split (Dutch), only peel a *glued* suffix:
        // the char before it must be a letter, not a word boundary.
        if (!splitSpaced && /[\s-]$/.test(remainder)) continue;
        parsed.street = remainder.replace(/[\s-]+$/, "").trim();
        parsed.type = display;
        break;
      }
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
