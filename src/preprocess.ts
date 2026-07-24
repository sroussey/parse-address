// Address-string preprocessing applied before country dispatch.
//
// EDGAR / filing addresses frequently concatenate a legal-entity name ("street1")
// in front of the real street line, e.g.
//   "BANK OF BERMUDA (CAYMAN) LIMITED, 6 FRONT STREET, HAMILTON HM11, BERMUDA"
//   "c/o Maples Corporate Services Limited, PO Box 309, Ugland House, ..."
// The entity is not an address component, so the structured parse cannot use it
// and would otherwise fall back to dumping the whole line into `street`.
// Stripping a recognizable leading organization segment lets the real address
// parse; the removed text is returned so the caller can keep it (the facade
// surfaces it as `organization`) rather than destroying it silently.

// Unambiguous legal-form suffixes: whole words that never appear as the last
// word of a street or building name. Matched case-insensitively.
const STRONG_ORG_SUFFIX =
  /^(?:limited|ltd|l\.?l\.?c|inc|incorporated|corp|corporation|company|plc|l\.?l\.?p|gmbh|s\.?a\.?r\.?l|sarl|s\.?r\.?l|pty|ulc)\.?$/i;

// Short legal-form abbreviations that collide with ordinary words in the
// languages this library parses ("Rua da Sa", "Piazza SpA", Spanish "Co").
// They only mark an organization in their conventional written forms: dotted
// ("S.A.", "N.V.", "A.G.") or all-caps ("SA", "NV", "BV", "AG", "LP", "GP",
// "CO", "SPA"). A title-cased "Sa"/"Co" inside a street name does not qualify.
const ABBREV_ORG_SUFFIX = /^(?:co|s\.?a|n\.?v|b\.?v|a\.?g|l\.?p|g\.?p|s\.?p\.?a)\.?$/i;
const DOTTED = /\./;

// Descriptive nouns that are common in entity names ("Blackstone Capital
// Partners") but equally common in street and building names ("Avenida
// Capital", "Harbour Trust", "The Fund"). They only mark an organization when
// the segment is long enough to read as a company name (3+ words).
const WEAK_ORG_SUFFIX =
  /^(?:trust|holdings|partners|ventures|capital|group|associates|foundation|fund)\.?$/i;
const WEAK_MIN_WORDS = 3;

// A segment that is nothing but a house number ("100", "12A", "24-26"). In the
// street-first (number-after) layouts most of these grammars use, the number
// sits alone in the segment right after the street name -- so a preceding
// segment followed by one of these is a STREET, not an organization ("Rua
// Cidade Capital, 100, 01304-001 Sao Paulo"). A genuine entity is followed by a
// real address line ("Blackstone Capital Partners, 345 Park Avenue, ...").
const BARE_HOUSE_NUMBER = /^\d+[A-Za-z]?(?:\s*[-/]\s*\d+[A-Za-z]?)?$/;

// A leading "care of" / "attention" marker.
const CO_PREFIX = /^(?:c\/o|care of|attn\.?|attention|for the attention of)\b/i;

/**
 * True when the first comma segment reads as an organization rather than a
 * street line. `rest` is the remainder of the address after that segment; it
 * only disambiguates the weak (descriptive-noun) tier.
 */
function looksLikeOrganization(first: string, rest: string): boolean {
  // A segment that starts with a house number (or #/PO box) is an address line,
  // never an organization.
  if (/^[#\d]/.test(first) || /^p\.?o\.?\s*box\b/i.test(first)) return false;
  if (CO_PREFIX.test(first)) return true;

  // Compare the last word against the org-suffix sets (ignoring a trailing
  // parenthetical like "(Bermuda)" and any trailing period/paren).
  const words = first
    .replace(/\([^)]*\)\s*$/, "")
    .trim()
    .split(/\s+/);
  const lastWord = words[words.length - 1] ?? "";
  if (!lastWord) return false;

  if (STRONG_ORG_SUFFIX.test(lastWord)) return true;
  if (
    ABBREV_ORG_SUFFIX.test(lastWord) &&
    (DOTTED.test(lastWord) || lastWord === lastWord.toUpperCase())
  ) {
    return true;
  }
  if (!WEAK_ORG_SUFFIX.test(lastWord) || words.length < WEAK_MIN_WORDS) return false;
  const nextSegment = (rest.split(",")[0] ?? "").trim();
  return !BARE_HOUSE_NUMBER.test(nextSegment);
}

/**
 * Remove leading legal-entity / "c/o" segments from an address string. Returns
 * the cleaned string and, when any were removed, the organization text (joined
 * with ", " when a record stacks several, e.g. "ACME LTD, c/o Agent Limited,
 * PO Box 1, ..."). A segment is only stripped when it does not begin with a
 * house number (so a real "6 Front Street, ..." is never stripped) and there is
 * still address content after it.
 */
export function stripLeadingOrganization(address: string): {
  cleaned: string;
  organization?: string;
} {
  let remaining = address.trim();
  const removed: string[] = [];

  for (;;) {
    const comma = remaining.indexOf(",");
    if (comma < 0) break;
    const first = remaining.slice(0, comma).trim();
    const rest = remaining.slice(comma + 1).trim();
    if (!first || !rest) break;
    if (!looksLikeOrganization(first, rest)) break;
    removed.push(first);
    remaining = rest;
  }

  if (!removed.length) return { cleaned: address };
  return { cleaned: remaining, organization: removed.join(", ") };
}
