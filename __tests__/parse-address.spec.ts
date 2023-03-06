import assert from "assert";
import { AddressParser } from "../src/parser";
import { namedfloorTests, existingTests } from "./test-cases";

import { AddressTestCase, AddressTestCaseMap } from "../src/types/address";

const addressParser = new AddressParser();

describe("Floor test cases", () => {
  runTests(existingTests);
});

describe("Edgar tests", () => {
  runTests(namedfloorTests);
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
