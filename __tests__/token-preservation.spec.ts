import assert from "assert";
import { IntlAddressParser } from "../src/parser";
import { losesTokens } from "../src/invariant";
import { canadianAddresses, canadianTestCases, existingTests, namedfloorTests } from "./test-cases";
import type { AddressTestCaseMap } from "../src/types/address";

const parser = new IntlAddressParser();
const corpus: AddressTestCaseMap = {
  ...existingTests,
  ...namedfloorTests,
  ...canadianTestCases,
  ...canadianAddresses,
};

describe("token-preservation detector does not false-trigger on the corpus", () => {
  Object.entries(corpus).forEach(([address, testCase]) => {
    // __skipTest entries are known-broken parses (excluded from the exact-match
    // suite in parse-address.spec.ts too) -- not "known-good", so they are not
    // part of this calibration's baseline.
    if (testCase.__skipTest) return;
    it(`preserves tokens for (${address})`, () => {
      const parsed = parser.parseLocation(address);
      assert.equal(
        losesTokens(address, parsed),
        false,
        `detector wrongly flagged a known-good parse: ${JSON.stringify(parsed)}`
      );
    });
  });
});
