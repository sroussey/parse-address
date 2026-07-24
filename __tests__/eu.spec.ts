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
