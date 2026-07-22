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

describe("token-preservation detector catches genuine street-token drops", () => {
  it("canary: dropped street-name token ('Parc') with no locational fields at all", () => {
    assert.equal(
      losesTokens("123 Avenue du Parc", {
        number: "123",
        type: "Ave",
        street: "du",
        country: "CA",
      }),
      true,
      "detector must catch the dropped 'Parc' token"
    );
  });

  it("Finding 1: dropped 'Extra' token before the street type", () => {
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

  it("Finding 2 (PO-box shape): dropped 'Canyon'/'Road' tokens", () => {
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

  it("US Highway: dropped 'Old' token between the highway name and the road name", () => {
    assert.equal(
      losesTokens("123 US Hwy Old Farm Road, Springfield, IL 62701", {
        number: "123",
        street: "US Hwy Farm",
        type: "Rd",
        city: "Springfield",
        state: "IL",
        postal_code: "62701",
        country: "US",
      }),
      true,
      "detector must catch the dropped 'Old' token"
    );
  });

  it("New York collision: dropped 'Extra' token despite 'New York' city containing 'york'", () => {
    assert.equal(
      losesTokens("Nine Park Extra avenue 1st Floor, New York, NY 10022", {
        number: "9",
        street: "Park",
        type: "Ave",
        sec_unit_num: "1",
        sec_unit_type: "Floor",
        city: "New York",
        state: "NY",
        postal_code: "10022",
        country: "US",
      }),
      true,
      "detector must catch the dropped 'Extra' token"
    );
  });

  it("N.Main period: dropped 'Extra' token immediately after a period-abbreviated prefix", () => {
    assert.equal(
      losesTokens("123 N.Main Extra St, Springfield, IL 62701", {
        number: "123",
        prefix: "N",
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
});

describe("token-preservation detector does not false-trigger on a correct parse", () => {
  it("correct S.E. directional suffix is not a drop", () => {
    assert.equal(
      losesTokens("123 Main St S.E., Springfield, IL 62701", {
        number: "123",
        street: "Main",
        type: "St",
        suffix: "SE",
        city: "Springfield",
        state: "IL",
        postal_code: "62701",
        country: "US",
      }),
      false,
      "detector must not flag a correct parse with no dropped tokens"
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
