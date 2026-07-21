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

describe("token-preservation detector catches reproduced false-negatives", () => {
  it("Finding 1: country-field phantom token no longer masks a single-word drop", () => {
    assert.equal(
      losesTokens("123 Main Extra Street, Springfield, IL 62701", {
        number: "123",
        street: "Main",
        type: "St",
        city: "Springfield",
        state: "IL",
        postal_code: "62701",
        country: "US",
      }),
      true,
      "detector must catch the dropped 'Extra' token"
    );
  });

  it("canary: country still uncounted (and drop still caught) when source has no country word", () => {
    assert.equal(
      losesTokens("123 Avenue du Parc", {
        number: "123",
        type: "Ave",
        street: "du",
        country: "CA",
      }),
      true,
      "detector must still catch the dropped 'Parc' token"
    );
  });

  it("Finding 2: PO-box exemption no longer bypasses drops when locational fields are present", () => {
    assert.equal(
      losesTokens("100 Box Canyon Road, Springfield, IL 62701", {
        number: "100",
        street: "Box",
        city: "Springfield",
        state: "IL",
        postal_code: "62701",
        country: "US",
      }),
      true,
      "detector must catch the dropped 'Canyon'/'Road' tokens"
    );
  });
});

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
