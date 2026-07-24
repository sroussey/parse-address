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
import { fiConfig } from "../fi/config";
import { dkConfig } from "../dk/config";
import { noConfig } from "../no/config";
import { czConfig } from "../cz/config";
import { grConfig } from "../gr/config";
import { ieConfig } from "../ie/config";
import { jeConfig } from "../je/config";
import { ggConfig } from "../gg/config";
import { kyConfig } from "../ky/config";
import { vgConfig } from "../vg/config";
import { bmConfig } from "../bm/config";
import { giConfig } from "../gi/config";
import { auConfig } from "../au/config";
import { nzConfig } from "../nz/config";
import { sgConfig } from "../sg/config";
import { ilConfig } from "../il/config";
import { zaConfig } from "../za/config";
import { trConfig } from "../tr/config";
import { brConfig } from "../br/config";
import { mxConfig } from "../mx/config";
import { arConfig } from "../ar/config";

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
  fi: fiConfig,
  dk: dkConfig,
  no: noConfig,
  cz: czConfig,
  gr: grConfig,
  ie: ieConfig,
  je: jeConfig,
  gg: ggConfig,
  ky: kyConfig,
  vg: vgConfig,
  bm: bmConfig,
  gi: giConfig,
  au: auConfig,
  nz: nzConfig,
  sg: sgConfig,
  il: ilConfig,
  za: zaConfig,
  tr: trConfig,
  br: brConfig,
  mx: mxConfig,
  ar: arConfig,
};

export const euCountryCodes = Object.keys(euConfigs);
