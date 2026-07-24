// Address-string preprocessing applied before country dispatch.
//
// EDGAR / filing addresses frequently concatenate a legal-entity name ("street1")
// in front of the real street line, e.g.
//   "BANK OF BERMUDA (CAYMAN) LIMITED, 6 FRONT STREET, HAMILTON HM11, BERMUDA"
//   "c/o Maples Corporate Services Limited, PO Box 309, Ugland House, ..."
// The entity is not an address component and has no field to hold it, so the
// structured parse cannot use it and would otherwise fall back to dumping the
// whole line into `street`. Stripping a recognizable leading organization
// segment lets the real address parse. Because the cleaned string is used for
// BOTH the parse and the token-preservation check, nothing is scored as lost.

// Corporate/legal-entity suffixes that mark the leading segment as an org name.
// Anchored to the WHOLE last word (^…$) so that ordinary words ending in these
// letters — "Franco", "Francisco", "Eivissa" — are not mistaken for "co"/"sa".
const ORG_SUFFIX =
  /^(?:limited|ltd|l\.?l\.?c|inc|incorporated|corp|corporation|company|co|plc|l\.?l\.?p|l\.?p|g\.?p|trust|holdings|partners|ventures|capital|group|associates|foundation|fund|n\.?v|s\.?a\.?r\.?l|s\.?a|gmbh|a\.?g|b\.?v|pty|ulc|sarl|spa|s\.?p\.?a|s\.?r\.?l)\.?$/i;

// A leading "care of" / "attention" marker.
const CO_PREFIX = /^(?:c\/o|care of|attn\.?|attention|for the attention of)\b/i;

/**
 * Remove a leading legal-entity / "c/o" segment from an address string. Returns
 * the cleaned string and, when one was removed, the organization text. Only the
 * FIRST comma-delimited segment is considered, and only when it does not begin
 * with a house number (so a real "6 Front Street, ..." is never stripped) and
 * there is still address content after it.
 */
export function stripLeadingOrganization(address: string): {
  cleaned: string;
  organization?: string;
} {
  const trimmed = address.trim();
  const comma = trimmed.indexOf(",");
  if (comma < 0) return { cleaned: address };

  const first = trimmed.slice(0, comma).trim();
  const rest = trimmed.slice(comma + 1).trim();
  if (!first || !rest) return { cleaned: address };

  // A segment that starts with a house number (or #/PO box) is an address line,
  // never an organization.
  if (/^[#\d]/.test(first) || /^p\.?o\.?\s*box\b/i.test(first)) {
    return { cleaned: address };
  }

  const isCareOf = CO_PREFIX.test(first);
  // Compare the last word against the org-suffix set (ignoring a trailing
  // parenthetical like "(Bermuda)" and any trailing period/paren).
  const lastWord = first
    .replace(/\([^)]*\)\s*$/, "")
    .trim()
    .split(/\s+/)
    .pop() ?? "";
  const looksOrg = ORG_SUFFIX.test(lastWord);

  if (isCareOf || looksOrg) {
    return { cleaned: rest, organization: first };
  }
  return { cleaned: address };
}
