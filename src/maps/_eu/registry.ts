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
import { clConfig } from "../cl/config";
import { coConfig } from "../co/config";
import { peConfig } from "../pe/config";
import { inConfig } from "../in/config";
import { myConfig } from "../my/config";
import { aeConfig } from "../ae/config";
import { luConfig } from "../lu/config";
import { isConfig } from "../is/config";
import { mtConfig } from "../mt/config";
import { cyConfig } from "../cy/config";
import { uyConfig } from "../uy/config";
import { ecConfig } from "../ec/config";
import { veConfig } from "../ve/config";
import { boConfig } from "../bo/config";
import { roConfig } from "../ro/config";
import { hrConfig } from "../hr/config";
import { skConfig } from "../sk/config";
import { siConfig } from "../si/config";
import { crConfig } from "../cr/config";
import { saConfig } from "../sa/config";
import { qaConfig } from "../qa/config";
import { kwConfig } from "../kw/config";
import { bhConfig } from "../bh/config";
import { paConfig } from "../pa/config";
import { gtConfig } from "../gt/config";
import { doConfig } from "../do/config";
import { eeConfig } from "../ee/config";
import { lvConfig } from "../lv/config";
import { ltConfig } from "../lt/config";
import { huConfig } from "../hu/config";
import { thConfig } from "../th/config";
import { phConfig } from "../ph/config";
import { idConfig } from "../id/config";
import { pkConfig } from "../pk/config";
import { alConfig } from "../al/config";
import { rsConfig } from "../rs/config";
import { baConfig } from "../ba/config";
import { meConfig } from "../me/config";
import { mcConfig } from "../mc/config";
import { liConfig } from "../li/config";
import { adConfig } from "../ad/config";
import { smConfig } from "../sm/config";
import { ngConfig } from "../ng/config";
import { keConfig } from "../ke/config";
import { ghConfig } from "../gh/config";
import { muConfig } from "../mu/config";
import { jmConfig } from "../jm/config";
import { ttConfig } from "../tt/config";
import { bsConfig } from "../bs/config";
import { pyConfig } from "../py/config";
import { maConfig } from "../ma/config";
import { tnConfig } from "../tn/config";
import { snConfig } from "../sn/config";
import { ciConfig } from "../ci/config";
import { lkConfig } from "../lk/config";
import { bdConfig } from "../bd/config";
import { npConfig } from "../np/config";
import { bnConfig } from "../bn/config";
import { tzConfig } from "../tz/config";
import { ugConfig } from "../ug/config";
import { zmConfig } from "../zm/config";
import { zwConfig } from "../zw/config";
import { bbConfig } from "../bb/config";
import { bzConfig } from "../bz/config";
import { gyConfig } from "../gy/config";
import { srConfig } from "../sr/config";
import { mdConfig } from "../md/config";
import { foConfig } from "../fo/config";
import { glConfig } from "../gl/config";
import { imConfig } from "../im/config";
import { cmConfig } from "../cm/config";
import { dzConfig } from "../dz/config";
import { fjConfig } from "../fj/config";
import { pgConfig } from "../pg/config";
import { niConfig } from "../ni/config";
import { hnConfig } from "../hn/config";
import { svConfig } from "../sv/config";
import { cuConfig } from "../cu/config";
import { bwConfig } from "../bw/config";
import { naConfig } from "../na/config";
import { aoConfig } from "../ao/config";
import { mzConfig } from "../mz/config";
import { gfConfig } from "../gf/config";
import { gpConfig } from "../gp/config";
import { mqConfig } from "../mq/config";
import { reConfig } from "../re/config";
import { ytConfig } from "../yt/config";
import { ncConfig } from "../nc/config";
import { pfConfig } from "../pf/config";
import { wfConfig } from "../wf/config";
import { pmConfig } from "../pm/config";
import { blConfig } from "../bl/config";
import { mfConfig } from "../mf/config";
import { agConfig } from "../ag/config";
import { aiConfig } from "../ai/config";
import { dmConfig } from "../dm/config";
import { gdConfig } from "../gd/config";
import { knConfig } from "../kn/config";
import { lcConfig } from "../lc/config";
import { msConfig } from "../ms/config";
import { tcConfig } from "../tc/config";
import { vcConfig } from "../vc/config";

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
  cl: clConfig,
  co: coConfig,
  pe: peConfig,
  in: inConfig,
  my: myConfig,
  ae: aeConfig,
  lu: luConfig,
  is: isConfig,
  mt: mtConfig,
  cy: cyConfig,
  uy: uyConfig,
  ec: ecConfig,
  ve: veConfig,
  bo: boConfig,
  ro: roConfig,
  hr: hrConfig,
  sk: skConfig,
  si: siConfig,
  cr: crConfig,
  sa: saConfig,
  qa: qaConfig,
  kw: kwConfig,
  bh: bhConfig,
  pa: paConfig,
  gt: gtConfig,
  do: doConfig,
  ee: eeConfig,
  lv: lvConfig,
  lt: ltConfig,
  hu: huConfig,
  th: thConfig,
  ph: phConfig,
  id: idConfig,
  pk: pkConfig,
  al: alConfig,
  rs: rsConfig,
  ba: baConfig,
  me: meConfig,
  mc: mcConfig,
  li: liConfig,
  ad: adConfig,
  sm: smConfig,
  ng: ngConfig,
  ke: keConfig,
  gh: ghConfig,
  mu: muConfig,
  jm: jmConfig,
  tt: ttConfig,
  bs: bsConfig,
  py: pyConfig,
  ma: maConfig,
  tn: tnConfig,
  sn: snConfig,
  ci: ciConfig,
  lk: lkConfig,
  bd: bdConfig,
  np: npConfig,
  bn: bnConfig,
  tz: tzConfig,
  ug: ugConfig,
  zm: zmConfig,
  zw: zwConfig,
  bb: bbConfig,
  bz: bzConfig,
  gy: gyConfig,
  sr: srConfig,
  md: mdConfig,
  fo: foConfig,
  gl: glConfig,
  im: imConfig,
  cm: cmConfig,
  dz: dzConfig,
  fj: fjConfig,
  pg: pgConfig,
  ni: niConfig,
  hn: hnConfig,
  sv: svConfig,
  cu: cuConfig,
  bw: bwConfig,
  na: naConfig,
  ao: aoConfig,
  mz: mzConfig,
  gf: gfConfig,
  gp: gpConfig,
  mq: mqConfig,
  re: reConfig,
  yt: ytConfig,
  nc: ncConfig,
  pf: pfConfig,
  wf: wfConfig,
  pm: pmConfig,
  bl: blConfig,
  mf: mfConfig,
  ag: agConfig,
  ai: aiConfig,
  dm: dmConfig,
  gd: gdConfig,
  kn: knConfig,
  lc: lcConfig,
  ms: msConfig,
  tc: tcConfig,
  vc: vcConfig,
};

export const euCountryCodes = Object.keys(euConfigs);
