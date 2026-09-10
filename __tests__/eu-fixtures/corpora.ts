// Ground-truth corpora for every country with an `EuCountryConfig`, keyed by
// ISO alpha-2. Extracted from eu.spec.ts so more than one suite can assert
// against the same fixtures -- the parse tests in eu.spec.ts and the
// postal-code round-trip in postal-code.spec.ts.
import type { EuSample } from "./types";
import { deSamples } from "./de";
import { frSamples } from "./fr";
import { gbSamples } from "./gb";
import { itSamples } from "./it";
import { esSamples } from "./es";
import { nlSamples } from "./nl";
import { beSamples } from "./be";
import { atSamples } from "./at";
import { plSamples } from "./pl";
import { seSamples } from "./se";
import { chSamples } from "./ch";
import { ptSamples } from "./pt";
import { fiSamples } from "./fi";
import { dkSamples } from "./dk";
import { noSamples } from "./no";
import { czSamples } from "./cz";
import { grSamples } from "./gr";
import { ieSamples } from "./ie";
import { jeSamples } from "./je";
import { ggSamples } from "./gg";
import { kySamples } from "./ky";
import { vgSamples } from "./vg";
import { bmSamples } from "./bm";
import { giSamples } from "./gi";
import { auSamples } from "./au";
import { nzSamples } from "./nz";
import { sgSamples } from "./sg";
import { ilSamples } from "./il";
import { zaSamples } from "./za";
import { trSamples } from "./tr";
import { brSamples } from "./br";
import { mxSamples } from "./mx";
import { arSamples } from "./ar";
import { clSamples } from "./cl";
import { coSamples } from "./co";
import { peSamples } from "./pe";
import { inSamples } from "./in";
import { mySamples } from "./my";
import { aeSamples } from "./ae";
import { luSamples } from "./lu";
import { isSamples } from "./is";
import { mtSamples } from "./mt";
import { cySamples } from "./cy";
import { uySamples } from "./uy";
import { ecSamples } from "./ec";
import { veSamples } from "./ve";
import { boSamples } from "./bo";
import { roSamples } from "./ro";
import { hrSamples } from "./hr";
import { skSamples } from "./sk";
import { siSamples } from "./si";
import { crSamples } from "./cr";
import { saSamples } from "./sa";
import { qaSamples } from "./qa";
import { kwSamples } from "./kw";
import { bhSamples } from "./bh";
import { paSamples } from "./pa";
import { gtSamples } from "./gt";
import { doSamples } from "./do";
import { eeSamples } from "./ee";
import { lvSamples } from "./lv";
import { ltSamples } from "./lt";
import { huSamples } from "./hu";
import { thSamples } from "./th";
import { phSamples } from "./ph";
import { idSamples } from "./id";
import { pkSamples } from "./pk";
import { alSamples } from "./al";
import { rsSamples } from "./rs";
import { baSamples } from "./ba";
import { meSamples } from "./me";
import { mcSamples } from "./mc";
import { liSamples } from "./li";
import { adSamples } from "./ad";
import { smSamples } from "./sm";
import { ngSamples } from "./ng";
import { keSamples } from "./ke";
import { ghSamples } from "./gh";
import { muSamples } from "./mu";
import { jmSamples } from "./jm";
import { ttSamples } from "./tt";
import { bsSamples } from "./bs";
import { pySamples } from "./py";
import { maSamples } from "./ma";
import { tnSamples } from "./tn";
import { snSamples } from "./sn";
import { ciSamples } from "./ci";
import { lkSamples } from "./lk";
import { bdSamples } from "./bd";
import { npSamples } from "./np";
import { bnSamples } from "./bn";
import { tzSamples } from "./tz";
import { ugSamples } from "./ug";
import { zmSamples } from "./zm";
import { zwSamples } from "./zw";
import { bbSamples } from "./bb";
import { bzSamples } from "./bz";
import { gySamples } from "./gy";
import { srSamples } from "./sr";
import { mdSamples } from "./md";
import { foSamples } from "./fo";
import { glSamples } from "./gl";
import { imSamples } from "./im";
import { cmSamples } from "./cm";
import { dzSamples } from "./dz";
import { fjSamples } from "./fj";
import { pgSamples } from "./pg";
import { niSamples } from "./ni";
import { hnSamples } from "./hn";
import { svSamples } from "./sv";
import { cuSamples } from "./cu";
import { bwSamples } from "./bw";
import { naSamples } from "./na";
import { aoSamples } from "./ao";
import { mzSamples } from "./mz";
import { gfSamples } from "./gf";
import { gpSamples } from "./gp";
import { mqSamples } from "./mq";
import { reSamples } from "./re";
import { ytSamples } from "./yt";
import { ncSamples } from "./nc";
import { pfSamples } from "./pf";
import { wfSamples } from "./wf";
import { pmSamples } from "./pm";
import { blSamples } from "./bl";
import { mfSamples } from "./mf";
import { agSamples } from "./ag";
import { aiSamples } from "./ai";
import { dmSamples } from "./dm";
import { gdSamples } from "./gd";
import { knSamples } from "./kn";
import { lcSamples } from "./lc";
import { msSamples } from "./ms";
import { tcSamples } from "./tc";
import { vcSamples } from "./vc";
import { prSamples } from "./pr";
import { viSamples } from "./vi";
import { guSamples } from "./gu";
import { asSamples } from "./as";
import { mpSamples } from "./mp";
import { wsSamples } from "./ws";
import { toSamples } from "./to";
import { vuSamples } from "./vu";
import { sbSamples } from "./sb";
import { kiSamples } from "./ki";
import { fmSamples } from "./fm";
import { mhSamples } from "./mh";
import { pwSamples } from "./pw";
import { ckSamples } from "./ck";
import { nrSamples } from "./nr";
import { tvSamples } from "./tv";
import { nuSamples } from "./nu";
import { bfSamples } from "./bf";
import { bjSamples } from "./bj";
import { mlSamples } from "./ml";
import { neSamples } from "./ne";
import { tgSamples } from "./tg";
import { gaSamples } from "./ga";
import { cgSamples } from "./cg";
import { cdSamples } from "./cd";
import { mgSamples } from "./mg";
import { mrSamples } from "./mr";
import { gmSamples } from "./gm";
import { lsSamples } from "./ls";
import { lrSamples } from "./lr";
import { mwSamples } from "./mw";
import { rwSamples } from "./rw";
import { slSamples } from "./sl";
import { szSamples } from "./sz";
import { shSamples } from "./sh";
import { cvSamples } from "./cv";
import { gwSamples } from "./gw";
import { stSamples } from "./st";
import { awSamples } from "./aw";
import { axSamples } from "./ax";
import { sjSamples } from "./sj";
import { vaSamples } from "./va";
import { gqSamples } from "./gq";
import { scSamples } from "./sc";
import { fkSamples } from "./fk";
import { nfSamples } from "./nf";
import { tkSamples } from "./tk";
import { pnSamples } from "./pn";
import { htSamples } from "./ht";
import { biSamples } from "./bi";
import { cfSamples } from "./cf";
import { gnSamples } from "./gn";
import { tdSamples } from "./td";
import { djSamples } from "./dj";
import { kmSamples } from "./km";
import { tlSamples } from "./tl";
import { vnSamples } from "./vn";
import { azSamples } from "./az";
import { irSamples } from "./ir";
import { afSamples } from "./af";
import { egSamples } from "./eg";
import { lySamples } from "./ly";
import { sdSamples } from "./sd";
import { ehSamples } from "./eh";
import { iqSamples } from "./iq";
import { omSamples } from "./om";
import { yeSamples } from "./ye";
import { joSamples } from "./jo";
import { lbSamples } from "./lb";
import { sySamples } from "./sy";
import { psSamples } from "./ps";
import { soSamples } from "./so";
import { etSamples } from "./et";
import { erSamples } from "./er";
import { bgSamples } from "./bg";
import { mkSamples } from "./mk";
import { geSamples } from "./ge";
import { amSamples } from "./am";
import { kzSamples } from "./kz";
import { kgSamples } from "./kg";
import { uzSamples } from "./uz";
import { tjSamples } from "./tj";
import { tmSamples } from "./tm";

export const CORPORA: Record<string, EuSample[]> = {
  de: deSamples,
  fr: frSamples,
  gb: gbSamples,
  it: itSamples,
  es: esSamples,
  nl: nlSamples,
  be: beSamples,
  at: atSamples,
  pl: plSamples,
  se: seSamples,
  ch: chSamples,
  pt: ptSamples,
  fi: fiSamples,
  dk: dkSamples,
  no: noSamples,
  cz: czSamples,
  gr: grSamples,
  ie: ieSamples,
  je: jeSamples,
  gg: ggSamples,
  ky: kySamples,
  vg: vgSamples,
  bm: bmSamples,
  gi: giSamples,
  au: auSamples,
  nz: nzSamples,
  sg: sgSamples,
  il: ilSamples,
  za: zaSamples,
  tr: trSamples,
  br: brSamples,
  mx: mxSamples,
  ar: arSamples,
  cl: clSamples,
  co: coSamples,
  pe: peSamples,
  in: inSamples,
  my: mySamples,
  ae: aeSamples,
  lu: luSamples,
  is: isSamples,
  mt: mtSamples,
  cy: cySamples,
  uy: uySamples,
  ec: ecSamples,
  ve: veSamples,
  bo: boSamples,
  ro: roSamples,
  hr: hrSamples,
  sk: skSamples,
  si: siSamples,
  cr: crSamples,
  sa: saSamples,
  qa: qaSamples,
  kw: kwSamples,
  bh: bhSamples,
  pa: paSamples,
  gt: gtSamples,
  do: doSamples,
  ee: eeSamples,
  lv: lvSamples,
  lt: ltSamples,
  hu: huSamples,
  th: thSamples,
  ph: phSamples,
  id: idSamples,
  pk: pkSamples,
  al: alSamples,
  rs: rsSamples,
  ba: baSamples,
  me: meSamples,
  mc: mcSamples,
  li: liSamples,
  ad: adSamples,
  sm: smSamples,
  ng: ngSamples,
  ke: keSamples,
  gh: ghSamples,
  mu: muSamples,
  jm: jmSamples,
  tt: ttSamples,
  bs: bsSamples,
  py: pySamples,
  ma: maSamples,
  tn: tnSamples,
  sn: snSamples,
  ci: ciSamples,
  lk: lkSamples,
  bd: bdSamples,
  np: npSamples,
  bn: bnSamples,
  tz: tzSamples,
  ug: ugSamples,
  zm: zmSamples,
  zw: zwSamples,
  bb: bbSamples,
  bz: bzSamples,
  gy: gySamples,
  sr: srSamples,
  md: mdSamples,
  fo: foSamples,
  gl: glSamples,
  im: imSamples,
  cm: cmSamples,
  dz: dzSamples,
  fj: fjSamples,
  pg: pgSamples,
  ni: niSamples,
  hn: hnSamples,
  sv: svSamples,
  cu: cuSamples,
  bw: bwSamples,
  na: naSamples,
  ao: aoSamples,
  mz: mzSamples,
  gf: gfSamples,
  gp: gpSamples,
  mq: mqSamples,
  re: reSamples,
  yt: ytSamples,
  nc: ncSamples,
  pf: pfSamples,
  wf: wfSamples,
  pm: pmSamples,
  bl: blSamples,
  mf: mfSamples,
  ag: agSamples,
  ai: aiSamples,
  dm: dmSamples,
  gd: gdSamples,
  kn: knSamples,
  lc: lcSamples,
  ms: msSamples,
  tc: tcSamples,
  vc: vcSamples,
  pr: prSamples,
  vi: viSamples,
  gu: guSamples,
  as: asSamples,
  mp: mpSamples,
  ws: wsSamples,
  to: toSamples,
  vu: vuSamples,
  sb: sbSamples,
  ki: kiSamples,
  fm: fmSamples,
  mh: mhSamples,
  pw: pwSamples,
  ck: ckSamples,
  nr: nrSamples,
  tv: tvSamples,
  nu: nuSamples,
  bf: bfSamples,
  bj: bjSamples,
  ml: mlSamples,
  ne: neSamples,
  tg: tgSamples,
  ga: gaSamples,
  cg: cgSamples,
  cd: cdSamples,
  mg: mgSamples,
  mr: mrSamples,
  gm: gmSamples,
  ls: lsSamples,
  lr: lrSamples,
  mw: mwSamples,
  rw: rwSamples,
  sl: slSamples,
  sz: szSamples,
  sh: shSamples,
  cv: cvSamples,
  gw: gwSamples,
  st: stSamples,
  aw: awSamples,
  ax: axSamples,
  sj: sjSamples,
  va: vaSamples,
  gq: gqSamples,
  sc: scSamples,
  fk: fkSamples,
  nf: nfSamples,
  tk: tkSamples,
  pn: pnSamples,
  ht: htSamples,
  bi: biSamples,
  cf: cfSamples,
  gn: gnSamples,
  td: tdSamples,
  dj: djSamples,
  km: kmSamples,
  tl: tlSamples,
  vn: vnSamples,
  az: azSamples,
  ir: irSamples,
  af: afSamples,
  eg: egSamples,
  ly: lySamples,
  sd: sdSamples,
  eh: ehSamples,
  iq: iqSamples,
  om: omSamples,
  ye: yeSamples,
  jo: joSamples,
  lb: lbSamples,
  sy: sySamples,
  ps: psSamples,
  so: soSamples,
  et: etSamples,
  er: erSamples,
  bg: bgSamples,
  mk: mkSamples,
  ge: geSamples,
  am: amSamples,
  kz: kzSamples,
  kg: kgSamples,
  uz: uzSamples,
  tj: tjSamples,
  tm: tmSamples,
};
