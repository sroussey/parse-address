import type { ParsedAddress } from "./types/address";
import { stateCodesMap } from "./maps/us/states";
import { provinceCodesMap } from "./maps/ca/provinces";

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
  "postal_code", "plus4", "country",
];

// Reverse lookup (abbreviation -> full name) for the multi-word US
// states / Canadian provinces normalized down to a 2-letter code (e.g.
// "New York" -> "NY"). Used only to recognize that a full name actually
// present in the source accounts for more tokens than its abbreviated form.
const US_STATE_FULL_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(stateCodesMap).map(([full, abbr]) => [abbr, full])
);
const CA_PROVINCE_FULL_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(provinceCodesMap).map(([full, abbr]) => [abbr, full])
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function countSignificantTokens(text: string): number {
  return text
    .toLowerCase()
    // Periods are dropped outright (not replaced with a space) so a
    // letter-by-letter abbreviation written with periods in the source
    // ("S.E.", "P.O.") tokenizes to the same single merged token
    // ("se", "po") that the parser's normalized output field uses --
    // otherwise the source side counts one token per letter while the
    // output side counts one token for the whole abbreviation.
    .replace(/\./g, "")
    .replace(/[,#/]/g, " ")
    .split(/\s+/)
    // A token with no letters or digits is stray punctuation (e.g. a bare
    // "-" separator) rather than a dropped word, so it doesn't count on
    // either side of the comparison.
    .filter((t) => t.length > 0 && !FILLER.has(t) && /[a-z0-9]/.test(t)).length;
}

// A state/province field is normalized to its 2-letter code even when the
// source spelled out the full (possibly multi-word) name, e.g. "New Mexico"
// -> "NM". That normalization legitimately drops a token that was never lost
// -- it is still present in the source, just abbreviated on output. Count it
// as the full name's token length only when that full name is actually the
// text the source used; otherwise fall back to the abbreviation's own count.
function locationalFieldTokenCount(
  field: keyof ParsedAddress,
  value: string,
  address: string
): number {
  const fullNames =
    field === "state" ? US_STATE_FULL_NAMES : field === "province" ? CA_PROVINCE_FULL_NAMES : undefined;
  const fullName = fullNames?.[value.toUpperCase()];
  if (fullName && new RegExp(`\\b${escapeRegExp(fullName)}\\b`, "i").test(address)) {
    return countSignificantTokens(fullName);
  }
  return countSignificantTokens(value);
}

function outputTokenCount(parsed: ParsedAddress, address: string): number {
  // `country` is a required field always populated by the parser ("US"/"CA")
  // even though it is inferred from which country-specific grammar matched,
  // not extracted from the source text. Counting it unconditionally inflates
  // the output total and can silently offset a genuine dropped street token.
  // Only count it when the source address actually contains a country word --
  // that keeps both sides of the comparison symmetric (no source word means
  // neither side should count one) and stops it from masking a drop in the
  // ordinary case where city/province/state/postal_code are already present.
  const sourceMentionsCountry = /\b(canada|can|usa?|united states)\b/i.test(address);
  return ACCOUNTED_FIELDS.reduce((sum, field) => {
    if (field === "country" && !sourceMentionsCountry) return sum;
    const value = parsed[field];
    if (typeof value !== "string") return sum;
    return sum + locationalFieldTokenCount(field, value, address);
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
  // `street` (e.g. "RR 1, Box 123, Smiths Falls, ON K7A 4S4"). This is only a
  // known grammar gap when that locational detail is actually missing -- if
  // city/province/state/postal_code are all present, nothing was dropped
  // there and the exemption must not mask a genuine street-token drop
  // elsewhere (e.g. "100 Box Canyon Road, Springfield, IL 62701").
  const missingLocationalContext = !(
    parsed.city || parsed.province || parsed.state || parsed.postal_code
  );
  if (
    missingLocationalContext &&
    parsed.street &&
    /^(?:p\.?o\.?\s*)?box$/i.test(parsed.street.trim())
  )
    return false;

  let requiredCount = countSignificantTokens(address);
  const fractionMatch = !parsed.civic_number_suffix ? address.trim().match(LEADING_CIVIC_FRACTION) : null;
  if (fractionMatch) requiredCount -= countSignificantTokens(fractionMatch[1] ?? "");

  return outputTokenCount(parsed, address) < requiredCount;
}
