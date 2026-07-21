import assert from "assert";
import { AddressParser } from "../src/parser";

describe("AddressParser constructor", () => {
  it("constructs for supported countries", () => {
    assert.ok(new AddressParser("us"));
    assert.ok(new AddressParser("ca"));
  });

  it("throws for an unsupported country", () => {
    assert.throws(
      // @ts-expect-error intentionally passing an unsupported country at runtime
      () => new AddressParser("mx"),
      /Unsupported country "mx"; supported: us, ca/
    );
  });
});
