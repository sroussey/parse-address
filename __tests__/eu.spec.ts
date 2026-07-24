import assert from "assert";
import { AddressParser } from "../src/parser";
import { losesTokens } from "../src/invariant";
import type { CountryMappings } from "../src/types/ruleset";
import type { EuSample } from "./eu-fixtures/types";
import { deSamples } from "./eu-fixtures/de";
import { frSamples } from "./eu-fixtures/fr";
import { gbSamples } from "./eu-fixtures/gb";
import { itSamples } from "./eu-fixtures/it";
import { esSamples } from "./eu-fixtures/es";
import { nlSamples } from "./eu-fixtures/nl";
import { beSamples } from "./eu-fixtures/be";
import { atSamples } from "./eu-fixtures/at";
import { plSamples } from "./eu-fixtures/pl";
import { seSamples } from "./eu-fixtures/se";
import { chSamples } from "./eu-fixtures/ch";
import { ptSamples } from "./eu-fixtures/pt";
import { fiSamples } from "./eu-fixtures/fi";
import { dkSamples } from "./eu-fixtures/dk";
import { noSamples } from "./eu-fixtures/no";
import { czSamples } from "./eu-fixtures/cz";
import { grSamples } from "./eu-fixtures/gr";
import { ieSamples } from "./eu-fixtures/ie";
import { jeSamples } from "./eu-fixtures/je";
import { ggSamples } from "./eu-fixtures/gg";
import { kySamples } from "./eu-fixtures/ky";
import { vgSamples } from "./eu-fixtures/vg";
import { bmSamples } from "./eu-fixtures/bm";
import { giSamples } from "./eu-fixtures/gi";
import { auSamples } from "./eu-fixtures/au";
import { nzSamples } from "./eu-fixtures/nz";
import { sgSamples } from "./eu-fixtures/sg";
import { ilSamples } from "./eu-fixtures/il";
import { zaSamples } from "./eu-fixtures/za";
import { trSamples } from "./eu-fixtures/tr";
import { brSamples } from "./eu-fixtures/br";
import { mxSamples } from "./eu-fixtures/mx";
import { arSamples } from "./eu-fixtures/ar";
import { clSamples } from "./eu-fixtures/cl";
import { coSamples } from "./eu-fixtures/co";
import { peSamples } from "./eu-fixtures/pe";
import { inSamples } from "./eu-fixtures/in";
import { mySamples } from "./eu-fixtures/my";
import { aeSamples } from "./eu-fixtures/ae";
import { luSamples } from "./eu-fixtures/lu";
import { isSamples } from "./eu-fixtures/is";
import { mtSamples } from "./eu-fixtures/mt";
import { cySamples } from "./eu-fixtures/cy";
import { uySamples } from "./eu-fixtures/uy";
import { ecSamples } from "./eu-fixtures/ec";
import { veSamples } from "./eu-fixtures/ve";
import { boSamples } from "./eu-fixtures/bo";
import { roSamples } from "./eu-fixtures/ro";
import { hrSamples } from "./eu-fixtures/hr";
import { skSamples } from "./eu-fixtures/sk";
import { siSamples } from "./eu-fixtures/si";
import { crSamples } from "./eu-fixtures/cr";
import { saSamples } from "./eu-fixtures/sa";
import { qaSamples } from "./eu-fixtures/qa";
import { kwSamples } from "./eu-fixtures/kw";
import { bhSamples } from "./eu-fixtures/bh";
import { paSamples } from "./eu-fixtures/pa";
import { gtSamples } from "./eu-fixtures/gt";
import { doSamples } from "./eu-fixtures/do";
import { eeSamples } from "./eu-fixtures/ee";
import { lvSamples } from "./eu-fixtures/lv";
import { ltSamples } from "./eu-fixtures/lt";
import { huSamples } from "./eu-fixtures/hu";
import { thSamples } from "./eu-fixtures/th";
import { phSamples } from "./eu-fixtures/ph";
import { idSamples } from "./eu-fixtures/id";
import { pkSamples } from "./eu-fixtures/pk";
import { alSamples } from "./eu-fixtures/al";
import { rsSamples } from "./eu-fixtures/rs";
import { baSamples } from "./eu-fixtures/ba";
import { meSamples } from "./eu-fixtures/me";
import { mcSamples } from "./eu-fixtures/mc";
import { liSamples } from "./eu-fixtures/li";
import { adSamples } from "./eu-fixtures/ad";
import { smSamples } from "./eu-fixtures/sm";
import { ngSamples } from "./eu-fixtures/ng";
import { keSamples } from "./eu-fixtures/ke";
import { ghSamples } from "./eu-fixtures/gh";
import { muSamples } from "./eu-fixtures/mu";
import { jmSamples } from "./eu-fixtures/jm";
import { ttSamples } from "./eu-fixtures/tt";
import { bsSamples } from "./eu-fixtures/bs";
import { pySamples } from "./eu-fixtures/py";
import { maSamples } from "./eu-fixtures/ma";
import { tnSamples } from "./eu-fixtures/tn";
import { snSamples } from "./eu-fixtures/sn";
import { ciSamples } from "./eu-fixtures/ci";
import { lkSamples } from "./eu-fixtures/lk";
import { bdSamples } from "./eu-fixtures/bd";
import { npSamples } from "./eu-fixtures/np";
import { bnSamples } from "./eu-fixtures/bn";
import { tzSamples } from "./eu-fixtures/tz";
import { ugSamples } from "./eu-fixtures/ug";
import { zmSamples } from "./eu-fixtures/zm";
import { zwSamples } from "./eu-fixtures/zw";
import { bbSamples } from "./eu-fixtures/bb";
import { bzSamples } from "./eu-fixtures/bz";
import { gySamples } from "./eu-fixtures/gy";
import { srSamples } from "./eu-fixtures/sr";
import { mdSamples } from "./eu-fixtures/md";
import { foSamples } from "./eu-fixtures/fo";
import { glSamples } from "./eu-fixtures/gl";
import { imSamples } from "./eu-fixtures/im";
import { cmSamples } from "./eu-fixtures/cm";
import { dzSamples } from "./eu-fixtures/dz";
import { fjSamples } from "./eu-fixtures/fj";
import { pgSamples } from "./eu-fixtures/pg";
import { niSamples } from "./eu-fixtures/ni";
import { hnSamples } from "./eu-fixtures/hn";
import { svSamples } from "./eu-fixtures/sv";
import { cuSamples } from "./eu-fixtures/cu";
import { bwSamples } from "./eu-fixtures/bw";
import { naSamples } from "./eu-fixtures/na";
import { aoSamples } from "./eu-fixtures/ao";
import { mzSamples } from "./eu-fixtures/mz";
import { gfSamples } from "./eu-fixtures/gf";
import { gpSamples } from "./eu-fixtures/gp";
import { mqSamples } from "./eu-fixtures/mq";
import { reSamples } from "./eu-fixtures/re";
import { ytSamples } from "./eu-fixtures/yt";
import { ncSamples } from "./eu-fixtures/nc";
import { pfSamples } from "./eu-fixtures/pf";
import { wfSamples } from "./eu-fixtures/wf";
import { pmSamples } from "./eu-fixtures/pm";
import { blSamples } from "./eu-fixtures/bl";
import { mfSamples } from "./eu-fixtures/mf";
import { agSamples } from "./eu-fixtures/ag";
import { aiSamples } from "./eu-fixtures/ai";
import { dmSamples } from "./eu-fixtures/dm";
import { gdSamples } from "./eu-fixtures/gd";
import { knSamples } from "./eu-fixtures/kn";
import { lcSamples } from "./eu-fixtures/lc";
import { msSamples } from "./eu-fixtures/ms";
import { tcSamples } from "./eu-fixtures/tc";
import { vcSamples } from "./eu-fixtures/vc";
import { prSamples } from "./eu-fixtures/pr";
import { viSamples } from "./eu-fixtures/vi";
import { guSamples } from "./eu-fixtures/gu";
import { asSamples } from "./eu-fixtures/as";
import { mpSamples } from "./eu-fixtures/mp";
import { wsSamples } from "./eu-fixtures/ws";
import { toSamples } from "./eu-fixtures/to";
import { vuSamples } from "./eu-fixtures/vu";
import { sbSamples } from "./eu-fixtures/sb";
import { kiSamples } from "./eu-fixtures/ki";
import { fmSamples } from "./eu-fixtures/fm";
import { mhSamples } from "./eu-fixtures/mh";
import { pwSamples } from "./eu-fixtures/pw";
import { ckSamples } from "./eu-fixtures/ck";
import { nrSamples } from "./eu-fixtures/nr";
import { tvSamples } from "./eu-fixtures/tv";
import { nuSamples } from "./eu-fixtures/nu";
import { bfSamples } from "./eu-fixtures/bf";
import { bjSamples } from "./eu-fixtures/bj";
import { mlSamples } from "./eu-fixtures/ml";
import { neSamples } from "./eu-fixtures/ne";
import { tgSamples } from "./eu-fixtures/tg";
import { gaSamples } from "./eu-fixtures/ga";
import { cgSamples } from "./eu-fixtures/cg";
import { cdSamples } from "./eu-fixtures/cd";
import { mgSamples } from "./eu-fixtures/mg";
import { mrSamples } from "./eu-fixtures/mr";
import { gmSamples } from "./eu-fixtures/gm";
import { lsSamples } from "./eu-fixtures/ls";
import { lrSamples } from "./eu-fixtures/lr";
import { mwSamples } from "./eu-fixtures/mw";
import { rwSamples } from "./eu-fixtures/rw";
import { slSamples } from "./eu-fixtures/sl";
import { szSamples } from "./eu-fixtures/sz";
import { shSamples } from "./eu-fixtures/sh";
import { cvSamples } from "./eu-fixtures/cv";
import { gwSamples } from "./eu-fixtures/gw";
import { stSamples } from "./eu-fixtures/st";
import { awSamples } from "./eu-fixtures/aw";
import { axSamples } from "./eu-fixtures/ax";
import { sjSamples } from "./eu-fixtures/sj";
import { vaSamples } from "./eu-fixtures/va";
import { gqSamples } from "./eu-fixtures/gq";
import { scSamples } from "./eu-fixtures/sc";
import { fkSamples } from "./eu-fixtures/fk";
import { nfSamples } from "./eu-fixtures/nf";
import { tkSamples } from "./eu-fixtures/tk";
import { pnSamples } from "./eu-fixtures/pn";
import { htSamples } from "./eu-fixtures/ht";
import { biSamples } from "./eu-fixtures/bi";
import { cfSamples } from "./eu-fixtures/cf";
import { gnSamples } from "./eu-fixtures/gn";
import { tdSamples } from "./eu-fixtures/td";
import { djSamples } from "./eu-fixtures/dj";
import { kmSamples } from "./eu-fixtures/km";
import { tlSamples } from "./eu-fixtures/tl";
import { vnSamples } from "./eu-fixtures/vn";
import { azSamples } from "./eu-fixtures/az";
import { irSamples } from "./eu-fixtures/ir";
import { afSamples } from "./eu-fixtures/af";
import { egSamples } from "./eu-fixtures/eg";
import { lySamples } from "./eu-fixtures/ly";
import { sdSamples } from "./eu-fixtures/sd";
import { ehSamples } from "./eu-fixtures/eh";
import { iqSamples } from "./eu-fixtures/iq";
import { omSamples } from "./eu-fixtures/om";
import { yeSamples } from "./eu-fixtures/ye";
import { joSamples } from "./eu-fixtures/jo";
import { lbSamples } from "./eu-fixtures/lb";
import { sySamples } from "./eu-fixtures/sy";
import { psSamples } from "./eu-fixtures/ps";
import { soSamples } from "./eu-fixtures/so";
import { etSamples } from "./eu-fixtures/et";
import { erSamples } from "./eu-fixtures/er";

// The address fields we assert against the ground truth (locational + street).
const ASSERTED_FIELDS: (keyof EuSample)[] = [
  "number",
  "civic_number_suffix",
  "street",
  "type",
  "sec_unit_type",
  "sec_unit_num",
  "building",
  "postal_code",
  "city",
  "state",
];

const CORPORA: Record<string, EuSample[]> = {
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
};

function runCountry(code: CountryMappings, samples: EuSample[]) {
  const parser = new AddressParser(code);

  describe(`${code.toUpperCase()} address corpus (${samples.length} samples)`, () => {
    for (const sample of samples) {
      const title = sample.input;
      if (sample.__skip) {
        it.skip(`${title} [skip: ${sample.__skip}]`, () => {});
        continue;
      }

      it(`parses: ${title}`, () => {
        const parsed = parser.parseLocation(sample.input) as
          | Record<string, string>
          | null;
        assert.ok(parsed, `expected a parse result for "${title}"`);

        // Every ground-truth field must match exactly.
        for (const field of ASSERTED_FIELDS) {
          const expected = sample[field];
          if (expected === undefined) continue;
          assert.strictEqual(
            parsed![field],
            expected,
            `${field}: got ${JSON.stringify(parsed![field])}, expected ${JSON.stringify(expected)} for "${title}"`
          );
        }

        assert.strictEqual(parsed!.country, sample.country ?? code.toUpperCase());

        // The library's core guarantee: no street token is silently dropped.
        // (Development/area names the config intentionally drops are exempt.)
        assert.strictEqual(
          losesTokens(sample.input, parsed as any, parser.droppableTokens()),
          false,
          `token loss detected for "${title}"`
        );
      });
    }
  });
}

for (const [code, samples] of Object.entries(CORPORA)) {
  runCountry(code as CountryMappings, samples);
}
