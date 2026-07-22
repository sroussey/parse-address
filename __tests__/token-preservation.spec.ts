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

// Corpus keys excluded from this calibration's never-lose-data baseline: each
// entry's EXPECTED parse itself drops locational (or otherwise non-street)
// content, so it is not a valid input for asserting `losesTokens === false`.
const CALIBRATION_EXCLUDED_KEYS = new Set<string>([
  // "RR 1, Box 123, Smiths Falls, ON K7A 4S4" expects
  // {sec_unit_type:"RR", sec_unit_num:"1", street:"Box", country:"CA"} --
  // the city/province/postal_code tail is expected to be dropped by this
  // parse, not preserved, so it is not a lossless baseline. (In production
  // this correctly triggers the Tier-2 lossless fallback.)
  "RR 1, Box 123, Smiths Falls, ON K7A 4S4",
]);

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

  it("Fix A repro: abbreviated compass-direction city boundary cuts the segment too early", () => {
    assert.equal(
      losesTokens("100 N Bay Extra Ave, North Bay, ON P1B 8G5", {
        number: "100",
        prefix: "N",
        street: "Bay",
        type: "Ave",
        province: "ON",
        city: "North Bay",
        postal_code: "P1B 8G5",
        country: "CA",
      }),
      true,
      "detector must catch the dropped 'Extra' token despite the 'n bay' compass-abbrev collision inside the street"
    );
  });

  it("Fix B repro: PO-box/rural-route exemption masked a real drop after the box", () => {
    assert.equal(
      losesTokens("RR 1, Box 123, Old Mill Road, Smiths Falls, ON K7A 4S4", {
        sec_unit_type: "RR",
        sec_unit_num: "1",
        street: "Box",
        country: "CA",
      }),
      true,
      "detector must catch the dropped 'Old Mill Road' tokens"
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
    // See CALIBRATION_EXCLUDED_KEYS above: this entry's expected parse itself
    // drops locational content, so it is not a valid never-lose-data baseline.
    if (CALIBRATION_EXCLUDED_KEYS.has(address)) return;
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
