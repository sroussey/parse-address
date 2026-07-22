import type { ParsedAddress } from "./types/address";

// Intersection connector words that appear in source but are not addressable tokens.
const FILLER = new Set(["and", "at"]);

// Count significant tokens. A run like "S.E." / "P.O." (single letter + period,
// abutting another single-letter+period) collapses to one token; every other
// period, comma, hash, slash, or hyphen is a separator.
export function countSignificantTokens(text: string): number {
  const collapsed = text.toLowerCase().replace(/\b([a-z])\.(?=[a-z]\b)/g, "$1");
  return collapsed
    .replace(/[.,#/\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !FILLER.has(t)).length;
}

// Street-relevant output fields. Locational fields are deliberately excluded.
const STREET_FIELDS: (keyof ParsedAddress)[] = [
  "number", "civic_number_suffix", "prefix", "street", "type", "suffix",
  "sec_unit_type", "sec_unit_num",
];

// Locational values mark where the street segment ends. `country` is synthetic
// (often absent from the source, and its code can collide inside street words),
// and fsa/ldu are substrings of postal_code, so both are excluded.
const BOUNDARY_FIELDS: (keyof ParsedAddress)[] = [
  "city", "province", "state", "postal_code",
];

// Calibration fix: a city value is sometimes normalized from an abbreviated
// compass direction in the source ("N Sebastopol" / "NW Edmonton" ->
// "North Sebastopol" / "Northwest Edmonton"). Matching only the normalized form
// misses the source's boundary entirely and lets the whole locational tail
// spill into the street segment (corpus: "1005 Gravenstein Hwy, N Sebastopol
// CA", "14205 96 Ave NW NW Edmonton AB T5N 0C2", "1 First St, e San Jose CA").
// Compound directions are listed before their single-word components so they
// match first (e.g. "northwest" before "north"/"west").
const CITY_DIRECTION_PREFIXES: readonly (readonly [string, string])[] = [
  ["northeast", "ne"],
  ["northwest", "nw"],
  ["southeast", "se"],
  ["southwest", "sw"],
  ["north", "n"],
  ["south", "s"],
  ["east", "e"],
  ["west", "w"],
];

// Alternate source spellings for a boundary field's value, tried in addition to
// the value itself; the earliest match among all candidates wins.
function boundaryCandidates(
  field: keyof ParsedAddress,
  value: string,
  parsed: ParsedAddress
): string[] {
  if (field === "city") {
    const lower = value.toLowerCase();
    for (const [full, abbr] of CITY_DIRECTION_PREFIXES) {
      if (lower.startsWith(`${full} `)) {
        return [value, `${abbr}${value.slice(full.length)}`];
      }
    }
  }
  // Calibration fix: a ZIP+4 is sometimes written as one unbroken digit run
  // ("606066306"), so the stand-alone postal_code has no trailing word
  // boundary to match against; try the concatenated form first (corpus:
  // "233 S Wacker Dr 606066306").
  if (field === "postal_code" && typeof parsed.plus4 === "string" && parsed.plus4) {
    return [`${value}${parsed.plus4}`, value];
  }
  return [value];
}

function firstIndexOfValue(addressLower: string, value: string): number {
  const escaped = value.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`\\b${escaped}\\b`).exec(addressLower);
  return match ? match.index : -1;
}

// The source up to the earliest locational-field occurrence (whole-word match,
// so a short region code like "ON" does not match inside "Onondaga").
function streetSegment(address: string, parsed: ParsedAddress): string {
  const lower = address.toLowerCase();
  let cut = address.length;
  for (const field of BOUNDARY_FIELDS) {
    const value = parsed[field];
    if (typeof value !== "string" || !value) continue;
    for (const candidate of boundaryCandidates(field, value, parsed)) {
      const idx = firstIndexOfValue(lower, candidate);
      if (idx >= 0) cut = Math.min(cut, idx);
    }
  }
  return address.slice(0, cut);
}

function outputStreetTokenCount(parsed: ParsedAddress): number {
  return STREET_FIELDS.reduce((sum, field) => {
    const value = parsed[field];
    return sum + (typeof value === "string" ? countSignificantTokens(value) : 0);
  }, 0);
}

// Calibration fix: a civic-number fraction ("<num> 1/2 <street>...") that the
// current grammar leaves uncaptured (no `civic_number_suffix`) is dropped by
// the parser today rather than left dangling as an unaccounted street-name
// token. Only the fraction's own token count is forgiven -- a genuine drop
// elsewhere in the same segment still trips the detector (corpus: "3813 1/2
// Some Road, Los Angeles, CA").
const LEADING_CIVIC_FRACTION = /^\d+\s+(\d+\/\d+)\b/;

function fractionDiscount(segment: string, parsed: ParsedAddress): number {
  if (parsed.civic_number_suffix) return 0;
  const match = segment.trim().match(LEADING_CIVIC_FRACTION);
  return match ? countSignificantTokens(match[1] ?? "") : 0;
}

export function losesTokens(address: string, parsed: ParsedAddress | null): boolean {
  if (!parsed) return false;
  // Intersections carry two streets; the single-street count model does not apply.
  if (parsed.street2 || parsed.type2) return false;

  // Calibration fix: rural-route / bare box shape. The grammar drops all
  // locational detail after a bare box designator, and the "box" word itself
  // lands in `street` (e.g. "RR 1, Box 123, Smiths Falls, ON K7A 4S4"). With no
  // city/province/state/postal_code to bound it, the street segment would
  // otherwise swallow that whole (uncaptured, not dropped) locational tail.
  // Scoped to when locational context is entirely absent -- if any of those
  // fields are present, nothing was left uncaptured and this must not mask a
  // genuine street-token drop (e.g. "100 Box Canyon Road, Springfield, IL
  // 62701").
  const missingLocationalContext = !(
    parsed.city || parsed.province || parsed.state || parsed.postal_code
  );
  if (
    missingLocationalContext &&
    parsed.street &&
    /^(?:p\.?o\.?\s*)?box$/i.test(parsed.street.trim())
  )
    return false;

  const segment = streetSegment(address, parsed);
  const requiredCount = countSignificantTokens(segment) - fractionDiscount(segment, parsed);
  return outputStreetTokenCount(parsed) < requiredCount;
}
