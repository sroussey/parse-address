import XRegExp from "xregexp";
import type { CountryMappings } from "./types/ruleset";
import type {
  PostalCodeRepair,
  PostalCodeResult,
} from "./types/postal";
import { tryResolveCountryKey } from "./country";
import { euConfigs } from "./maps/_eu/registry";
import { usPostalRepair } from "./maps/us/postal";
import { caPostalRepair } from "./maps/ca/postal";

/**
 * No postal system anywhere issues an all-zero code; it is the placeholder a
 * filer types to get past a required field. Checked before the country
 * dispatch so it is refused for every jurisdiction -- and so "00000" cannot
 * pass the US rule by virtue of being five digits.
 */
const ALL_ZEROS = /^0+$/;

/**
 * A rule compiled for one country. `repair` is the hand-written field-time
 * rule; `derived` is the fallback built from the country's parse-time
 * `postalPattern` (free-spacing XRegExp) anchored to a whole value, with its
 * `postalFormat` as the canonical rendering.
 */
type CompiledRule =
  | { kind: "repair"; fold?: (upper: string) => string; accept: RegExp[]; canonical: PostalCodeRepair["canonical"] }
  | { kind: "derived"; accept: RegExp[]; format?: (raw: string) => string };

const cache = new Map<CountryMappings, CompiledRule | null>();

/**
 * The body of a named capture group inside a pattern, found by balanced-paren
 * scanning (escapes and character classes skipped), or null when the group is
 * absent, appears twice, or the parens do not balance.
 *
 * Used to recover the shape of the postal code itself from a parse-time
 * fragment that also matches the context around it.
 */
function captureGroupBody(pattern: string, name: string): string | null {
  const open = `(?<${name}>`;
  const at = pattern.indexOf(open);
  if (at === -1 || pattern.indexOf(open, at + 1) !== -1) return null;

  let depth = 1;
  let i = at + open.length;
  const start = i;
  for (; i < pattern.length && depth > 0; i++) {
    const c = pattern[i];
    if (c === "\\") {
      i++;
    } else if (c === "[") {
      // A character class: ] inside it is a literal, and ( ) carry no depth.
      while (i < pattern.length && pattern[i] !== "]") {
        if (pattern[i] === "\\") i++;
        i++;
      }
    } else if (c === "(") {
      depth++;
    } else if (c === ")") {
      depth--;
    }
  }
  return depth === 0 ? pattern.slice(start, i - 1) : null;
}

function compile(key: CountryMappings): CompiledRule | null {
  const repair =
    key === "us" ? usPostalRepair : key === "ca" ? caPostalRepair : euConfigs[key]?.postalRepair;

  if (repair) {
    return {
      kind: "repair",
      fold: repair.fold,
      // Authors write `accept` unanchored; anchoring here is what stops a rule
      // accepting a postal code with junk trailing it, and means no rule can
      // forget to do it.
      accept: repair.accept.map((p) => new RegExp(`^(?:${p})$`)),
      canonical: repair.canonical,
    };
  }

  // US and CA keep their parse-time patterns inside their rulesets rather than
  // an `EuCountryConfig`, so they have no derived fallback -- both are covered
  // by a hand-written rule above.
  const config = euConfigs[key];
  if (!config) return null;

  // "x" for free-spacing (how `postalPattern` is written); "i" because the
  // patterns spell their letter classes as [A-Za-z].
  const accept = [XRegExp(`^\\s*(?:${config.postalPattern})\\s*$`, "xi")];

  // A parse-time pattern may carry context that only exists inside an address
  // line -- Oman's required "PC" marker, Brazil's "CEP", a leading "D-"/"CH-".
  // A field holds the bare code, so also accept the `postal_code` group on its
  // own. The full pattern is tried FIRST, so a value that does carry the
  // context still normalizes to just the code.
  const inner = captureGroupBody(config.postalPattern, "postal_code");
  if (inner !== null) {
    accept.push(XRegExp(`^\\s*(?<postal_code>${inner})\\s*$`, "xi"));
  }

  return { kind: "derived", accept, format: config.postalFormat };
}

function ruleFor(key: CountryMappings): CompiledRule | null {
  if (!cache.has(key)) cache.set(key, compile(key));
  return cache.get(key) ?? null;
}

function applyRule(rule: CompiledRule, upper: string): string | null {
  if (rule.kind === "repair") {
    const folded = rule.fold ? rule.fold(upper) : upper;
    for (const re of rule.accept) {
      const m = folded.match(re);
      if (m) return rule.canonical(m);
    }
    return null;
  }

  for (const re of rule.accept) {
    const m = XRegExp.exec(upper, re) as (RegExpExecArray & Record<string, any>) | null;
    if (!m) continue;
    // `XRegExp.uninstall("namespacing")` puts named groups on the match object
    // itself; native execution puts them under `.groups`. Fall back to the
    // whole match for a fragment whose group spans all of it.
    const raw: string = m.postal_code ?? m.groups?.postal_code ?? m[0];
    return rule.format ? rule.format(raw) : raw.replace(/\s+/g, " ").trim();
  }
  return null;
}

/**
 * Normalize a postal code that arrives as its own field, with a reason when it
 * is refused.
 *
 * A value that does not match its country's format is **not a postal code**,
 * and is rejected rather than passed through. Callers key records on this
 * value: a filer's "N/A", a city name typed into the postal box, or a phone
 * number left there mints a whole second record for a place already stored. A
 * rejection is honest and merges with the same address recorded without a
 * postal code; the junk string is neither.
 *
 * `country` accepts anything {@link tryResolveCountryKey} does -- an ISO
 * alpha-2 code or a SEC EDGAR "State or Country" code ("E9" is the Cayman
 * Islands). A country with no grammar is reported as `no-grammar` rather than
 * throwing, so a caller sweeping a corpus can decide for itself whether to keep
 * the raw value; that policy is deliberately not made here.
 */
export function inspectPostalCode(
  value: string | null | undefined,
  country: string
): PostalCodeResult {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return { ok: false, reason: "empty", input: "" };

  const upper = trimmed.toUpperCase();
  if (ALL_ZEROS.test(upper)) return { ok: false, reason: "placeholder", input: trimmed };

  const key = tryResolveCountryKey(country);
  if (!key) return { ok: false, reason: "no-grammar", input: trimmed };

  const rule = ruleFor(key);
  if (!rule) return { ok: false, reason: "no-grammar", input: trimmed };

  const canonical = applyRule(rule, upper);
  if (canonical === null) return { ok: false, reason: "malformed", input: trimmed };

  return { ok: true, postalCode: canonical, repaired: canonical !== upper };
}

/**
 * The canonical postal code, or null when the value is not one for this
 * country. Sugar over {@link inspectPostalCode} for callers that do not need
 * to distinguish *why* a value was refused.
 */
export function normalizePostalCode(
  value: string | null | undefined,
  country: string
): string | null {
  const result = inspectPostalCode(value, country);
  return result.ok ? result.postalCode : null;
}

/**
 * True when this country has a postal-code grammar to check a value against.
 *
 * Lets a caller tell "we checked and it failed" from "we had nothing to check
 * with" *before* deciding what to store, which is the difference between
 * dropping junk and dropping the only postal code available.
 */
export function hasPostalGrammar(country: string): boolean {
  const key = tryResolveCountryKey(country);
  return key !== null && ruleFor(key) !== null;
}
