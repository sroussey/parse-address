/**
 * Field-time postal-code normalization.
 *
 * This is a different job from the `postal_code` capture inside a full-address
 * parse, and it wants the opposite strictness:
 *
 *   - **Parse-time** (`EuCountryConfig.postalPattern`) runs unanchored in the
 *     middle of a line, so it must be TIGHT. A loose pattern steals tokens from
 *     the city or the street.
 *   - **Field-time** (this API) is handed a value that is *claimed* to be a
 *     postal code and nothing else -- a structured field from a form, a CSV
 *     column, an EDGAR `zipCode`. There is nothing adjacent to steal from, so
 *     it can afford to be LENIENT about separators and typo'd confusables, and
 *     it must REJECT junk rather than pass it through: a caller keying records
 *     on the value turns a filer's "N/A" into a second copy of a place it
 *     already has.
 *
 * Hence a separate optional rule per country ({@link PostalCodeRepair}) rather
 * than a re-export of the parse-time pattern. Countries without one fall back
 * to their `postalPattern` + `postalFormat`, anchored -- which is why every
 * supported jurisdiction has a working normalizer without hand-writing 220 of
 * them.
 */

/** Why a value is not this country's postal code. */
export type PostalCodeRejection =
  /** Null, undefined, or whitespace only. */
  | "empty"
  /** A stand-in typed to satisfy a required field (e.g. "00000"). */
  | "placeholder"
  /** A real value that is not this country's postal code shape. */
  | "malformed"
  /** No address grammar for this country, so there is nothing to check against. */
  | "no-grammar";

export type PostalCodeResult =
  | {
      ok: true;
      /** The canonical spelling. */
      postalCode: string;
      /** True when the canonical form differs from the trimmed, upper-cased input. */
      repaired: boolean;
    }
  | {
      ok: false;
      reason: PostalCodeRejection;
      /** The trimmed input, echoed back so a caller can log what it refused. */
      input: string;
    };

/**
 * A country's field-time repair rule.
 *
 * Patterns are written UNANCHORED and against upper-cased input; the engine
 * anchors each one to the whole string, so a rule can never accept a postal
 * code with junk trailing it.
 */
export interface PostalCodeRepair {
  /**
   * Character folds applied to the trimmed, upper-cased value before matching.
   *
   * Only for confusables a country's own alphabet makes unambiguous -- Canada
   * Post issues no O or I in any position, so both are always a mistyped 0 or
   * 1. A fold that has to *guess* (S vs 5 in Canada, where both are real) would
   * assign a real address to a wrong postal code and must not be written here.
   */
  fold?: (upper: string) => string;
  /**
   * Accepted shapes, tried in order, first match wins. Order matters where one
   * shape is a prefix of another: put the longest/most specific first.
   */
  accept: string[];
  /** Canonical rendering from the winning match. */
  canonical: (match: RegExpMatchArray) => string;
}
