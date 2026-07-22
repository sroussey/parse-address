import type { EuCountryConfig } from "./types";
import { deConfig } from "../de/config";
import { frConfig } from "../fr/config";
import { gbConfig } from "../gb/config";
import { itConfig } from "../it/config";
import { esConfig } from "../es/config";
import { nlConfig } from "../nl/config";
import { beConfig } from "../be/config";
import { atConfig } from "../at/config";
import { plConfig } from "../pl/config";
import { seConfig } from "../se/config";
import { chConfig } from "../ch/config";
import { ptConfig } from "../pt/config";

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
  be: beConfig,
  at: atConfig,
  pl: plConfig,
  se: seConfig,
  ch: chConfig,
  pt: ptConfig,
};

export const euCountryCodes = Object.keys(euConfigs);
