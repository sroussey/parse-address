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
// the value itself; the earliest match among all candidates wins. (City is
// handled separately by `cityBoundaryIndex` -- see its comment -- since its
// abbreviated fallback must not compete with a found exact match.)
function boundaryCandidates(
  field: keyof ParsedAddress,
  value: string,
  parsed: ParsedAddress
): string[] {
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

function lastIndexOfValue(addressLower: string, value: string): number {
  const escaped = value.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b${escaped}\\b`, "g");
  let idx = -1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(addressLower)) !== null) {
    idx = match.index;
  }
  return idx;
}

// A city value's boundary position is a single candidate, not a competing
// pair: prefer the exact parsed value when it occurs in the source at all,
// and only fall back to the compass-abbreviated spelling ("n bay" for "North
// Bay") when the exact form is absent. The abbreviated form can otherwise
// match earlier, inside the street segment itself (e.g. "N Bay" as a street
// prefix), and wrongly cut real street words into the excluded tail. When the
// fallback is used, the city sits in the address's locational tail, so match
// its rightmost occurrence rather than any earlier in-street collision.
function cityBoundaryIndex(addressLower: string, value: string): number {
  const exactIdx = firstIndexOfValue(addressLower, value);
  if (exactIdx >= 0) return exactIdx;

  const lower = value.toLowerCase();
  for (const [full, abbr] of CITY_DIRECTION_PREFIXES) {
    if (lower.startsWith(`${full} `)) {
      const abbreviated = `${abbr}${value.slice(full.length)}`;
      return lastIndexOfValue(addressLower, abbreviated);
    }
  }
  return -1;
}

// The source up to the earliest locational-field occurrence (whole-word match,
// so a short region code like "ON" does not match inside "Onondaga").
export function streetSegment(address: string, parsed: ParsedAddress): string {
  const lower = address.toLowerCase();
  let cut = address.length;
  for (const field of BOUNDARY_FIELDS) {
    const value = parsed[field];
    if (typeof value !== "string" || !value) continue;
    if (field === "city") {
      const idx = cityBoundaryIndex(lower, value);
      if (idx >= 0) cut = Math.min(cut, idx);
      continue;
    }
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

  const segment = streetSegment(address, parsed);
  const requiredCount = countSignificantTokens(segment) - fractionDiscount(segment, parsed);
  return outputStreetTokenCount(parsed) < requiredCount;
}

// Locational fields kept as-is when rebuilding a minimal, guaranteed-lossless
// result: the same boundary fields `streetSegment` strips from the tail (so
// the street/locational split stays one consistent notion across the
// detector and the fallback), plus the postal-code-adjacent `fsa`/`ldu`.
const KEPT_LOCATIONAL_FIELDS: (keyof ParsedAddress)[] = [...BOUNDARY_FIELDS, "fsa", "ldu"];

/**
 * A minimal, guaranteed-lossless parse: leading civic number (+ attached letter
 * suffix) and the entire remaining street segment intact in `street`. Reuses
 * `streetSegment` -- the same street-segment isolation `losesTokens` uses --
 * so the fallback and the detector never disagree on where the street portion
 * ends. Keeps the high-confidence locational fields the raw parse already
 * found; drops the (untrusted) prefix/type/suffix/unit structure rather than
 * risk a partial, lossy split.
 */
export function minimalLosslessParse(address: string, parsed: ParsedAddress): ParsedAddress {
  const segment = streetSegment(address, parsed)
    .replace(/[\s,]+$/, "")
    .replace(/^[\s,#]+/, "")
    .trim();

  const result: ParsedAddress = { country: parsed.country };
  for (const field of KEPT_LOCATIONAL_FIELDS) {
    const value = parsed[field];
    if (typeof value === "string" && value)
      (result as unknown as Record<string, string>)[field] = value;
  }

  const m = /^(\d+)([A-Za-z])?\s+(.*\S)\s*$/.exec(segment);
  if (m) {
    result.number = m[1];
    if (m[2]) result.civic_number_suffix = m[2];
    result.street = m[3];
  } else if (segment) {
    result.street = segment;
  } else {
    // No street segment survived stripping; keep the raw parse rather than blank it.
    return parsed;
  }
  return result;
}

/**
 * Guard applied at the `AddressParser` facade: passes a lossless parse
 * through unchanged, and replaces a truncating one with `minimalLosslessParse`.
 */
export function enforceTokenPreservation(
  address: string,
  parsed: ParsedAddress | null
): ParsedAddress | null {
  if (!losesTokens(address, parsed)) return parsed;
  return minimalLosslessParse(address, parsed as ParsedAddress);
}
