import type { ParsedAddress } from "./types/address";

// Connector words that appear in the source but not as an addressable token
// (intersections). Extended only if the calibration test surfaces a case.
const FILLER = new Set(["and", "at"]);

// Output fields whose text represents source tokens. Locational fields are
// included so abbreviation/normalization in the street portion can be offset by
// the full text elsewhere; only a genuine drop lowers the total.
const ACCOUNTED_FIELDS: (keyof ParsedAddress)[] = [
  "number", "civic_number_suffix", "prefix", "street", "type", "suffix",
  "street1", "street2", "type1", "type2",
  "sec_unit_type", "sec_unit_num", "city", "province", "state",
  "postal_code", "country",
];

export function countSignificantTokens(text: string): number {
  return text
    .toLowerCase()
    .replace(/[.,#/]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !FILLER.has(t)).length;
}

function outputTokenCount(parsed: ParsedAddress): number {
  // `country` is almost never literal source text (it is inferred from which
  // country-specific grammar matched, not extracted), so its slack is only
  // trustworthy alongside other locational fields that genuinely do echo
  // source text (city/province/state/postal_code). A bare country with no
  // other locational context would otherwise silently absorb a one-token
  // street-name drop.
  const hasOtherLocationalContext = Boolean(
    parsed.city || parsed.province || parsed.state || parsed.postal_code
  );
  return ACCOUNTED_FIELDS.reduce((sum, field) => {
    if (field === "country" && !hasOtherLocationalContext) return sum;
    const value = parsed[field];
    return sum + (typeof value === "string" ? countSignificantTokens(value) : 0);
  }, 0);
}

// A civic-number fraction ("<num> 1/2 <street>...") that the current grammar
// leaves uncaptured (no `civic_number_suffix`) for this number shape is
// dropped by the parser today rather than left dangling as an unaccounted
// street-name token. Only the fraction's own token count is forgiven -- an
// additional genuine drop elsewhere in the same address must still trip the
// detector.
const LEADING_CIVIC_FRACTION = /^\d+\s+(\d+\/\d+)\b/;

export function losesTokens(address: string, parsed: ParsedAddress | null): boolean {
  if (!parsed) return false;
  // Intersections carry two streets; the single-street count model does not apply.
  if (parsed.street2 || parsed.type2) return false;
  // Rural-route / bare box shape: the grammar drops city/province/postal
  // detail after a bare box designator, and the "box" word itself lands in
  // `street` (e.g. "RR 1, Box 123, Smiths Falls, ON K7A 4S4"). The dropped
  // locational text is a known grammar gap here, not a street-token drop.
  if (parsed.street && /^(?:p\.?o\.?\s*)?box$/i.test(parsed.street.trim())) return false;

  let requiredCount = countSignificantTokens(address);
  const fractionMatch = !parsed.civic_number_suffix ? address.trim().match(LEADING_CIVIC_FRACTION) : null;
  if (fractionMatch) requiredCount -= countSignificantTokens(fractionMatch[1] ?? "");

  return outputTokenCount(parsed) < requiredCount;
}
