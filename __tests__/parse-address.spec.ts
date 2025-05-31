import assert from "assert";
import { IntlAddressParser } from "../src/parser";
import { canadianAddresses, canadianTestCases, existingTests, namedfloorTests } from "./test-cases";

import { AddressTestCase, AddressTestCaseMap } from "../src/types/address";

const addressParser = new IntlAddressParser();

describe("Floor test cases", () => {
  runTests(existingTests);
});

describe("Edgar tests", () => {
  runTests(namedfloorTests);
});

describe("Canadian tests", () => {
  runTests(canadianTestCases);
});

describe("Canadian addresses", () => {
  runTests(canadianAddresses);
});

function runTest(addressString: string, testCase: AddressTestCase) {
  if (testCase.__skipTest) {
    return;
  }

  const parsed = addressParser.parseLocation(addressString);
  assert.deepEqual(parsed, testCase);
}

function runTests(tests: AddressTestCaseMap) {
  Object.entries(tests).forEach(([addressString, testCase]) => {
    it(`Properly parses addresses (${addressString})`, () => {
      runTest(addressString, testCase);
    });
  });
}
