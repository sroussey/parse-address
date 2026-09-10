import type { CountryMappings } from "./types/ruleset";
import { euConfigs, euCountryCodes } from "./maps/_eu/registry";
import { secCountryCodes } from "./maps/sec-countries";

export const SUPPORTED_COUNTRIES: CountryMappings[] = [
  "us",
  "ca",
  ...(euCountryCodes as CountryMappings[]),
];

/** True when we have a dedicated address grammar for this internal key. */
export function isSupportedKey(key: string): key is CountryMappings {
  // `hasOwnProperty`, not `Boolean(euConfigs[key])`: the latter is truthy for
  // inherited Object.prototype members ("constructor", "__proto__", "toString"),
  // which would then resolve as "supported" and blow up with an opaque TypeError.
  return (
    key === "us" ||
    key === "ca" ||
    Object.prototype.hasOwnProperty.call(euConfigs, key)
  );
}

/**
 * Resolve a country selector to an internal parser key, or null when it does
 * not name a jurisdiction we have a grammar for -- an unknown string, an
 * obsolete SEC code with no successor, or a real country not yet covered.
 *
 * The non-throwing half of {@link resolveCountryKey}, for callers sweeping a
 * corpus where "we have no grammar for this one" is an ordinary outcome to be
 * counted rather than an error to be caught. Constructing a parser still
 * throws, because there a missing grammar leaves nothing to return.
 */
export function tryResolveCountryKey(input: string): CountryMappings | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (isSupportedKey(lower)) return lower;

  const sec = secCountryCodes[trimmed.toUpperCase()];
  if (!sec?.iso2) return null;

  const key = sec.iso2.toLowerCase();
  return isSupportedKey(key) ? key : null;
}

/**
 * Resolve a country selector to an internal parser key. Accepts our internal
 * ISO alpha-2 keys ("us", "de", "ky", …) and SEC EDGAR "State or Country" codes
 * ("K3" → Hong Kong, "L3" → Israel, …). A SEC code is resolved to its modern
 * ISO country; an obsolete code with no successor, or a real country we do not
 * have a grammar for yet, throws a descriptive error.
 */
export function resolveCountryKey(input: string): CountryMappings {
  const lower = input.trim().toLowerCase();
  if (isSupportedKey(lower)) return lower;

  const sec = secCountryCodes[input.trim().toUpperCase()];
  if (sec) {
    if (!sec.iso2) {
      throw new Error(
        `SEC code "${input}" (${sec.name}) is an obsolete jurisdiction with no modern country`
      );
    }
    const key = sec.iso2.toLowerCase();
    if (isSupportedKey(key)) return key;
    throw new Error(
      `SEC code "${input}" resolves to ${sec.name} (${sec.iso2}), which has no address grammar yet`
    );
  }
  throw new Error(
    `Unsupported country "${input}" (${SUPPORTED_COUNTRIES.length} supported ISO/SEC codes; pass a valid ISO alpha-2 or SEC "State or Country" code)`
  );
}
