// Shared `postNormalize` helper for the many countries whose grammar captures a
// whole locality chain in the single `city` slot ("Suburb, District, City").
//
// The routing city is the LAST locality; everything before it is a
// neighbourhood/sector/area with no output field of its own. Those earlier
// values are reported through `__dropped` so the token-preservation guard does
// not score them as lost street tokens.
//
// Without this helper the same eight lines were copy-pasted verbatim into ~30
// country configs (plus five that only prepend a number-label word), so a fix
// to the drop bookkeeping had to be made in thirty places.

/**
 * Collapse a comma-separated locality chain in `parsed.city` down to its last
 * element and record the earlier ones as dropped.
 *
 * @param parsed  the in-progress parse result, mutated in place
 * @param labels  number-label words the grammar consumes but never emits
 *                ("Plot", "House"); always reported as dropped
 */
export function keepLastLocality(
  parsed: Record<string, any>,
  labels: readonly string[] = []
): void {
  const dropped: string[] = [...labels];
  if (typeof parsed.city === "string" && parsed.city.includes(",")) {
    const parts = parsed.city
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    if (parts.length) {
      parsed.city = parts[parts.length - 1];
      dropped.push(...parts.slice(0, -1));
    }
  }
  if (dropped.length) parsed.__dropped = dropped;
}
