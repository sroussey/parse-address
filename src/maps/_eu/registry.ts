import type { EuCountryConfig } from "./types";
import { deConfig } from "../de/config";
import { frConfig } from "../fr/config";
import { gbConfig } from "../gb/config";
import { itConfig } from "../it/config";
import { esConfig } from "../es/config";
import { nlConfig } from "../nl/config";

/**
 * Registry of the supported European country configurations, keyed by ISO
 * alpha-2 (lowercase). Adding a country is a one-line addition here plus its
 * `config.ts`; the `AddressParser` facade builds an `AddressParserEU` from
 * whichever config this map returns.
 */
export const euConfigs: Record<string, EuCountryConfig> = {
  de: deConfig,
  fr: frConfig,
  gb: gbConfig,
  it: itConfig,
  es: esConfig,
  nl: nlConfig,
};

export const euCountryCodes = Object.keys(euConfigs);
