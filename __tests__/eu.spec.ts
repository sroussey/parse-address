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
