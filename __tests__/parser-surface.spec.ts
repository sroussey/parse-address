import assert from "assert";
import { AddressParser, IntlAddressParser } from "../src/parser";

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

describe("IntlAddressParser uniform surface", () => {
  const intl = new IntlAddressParser();

  it("auto-detects US and CA on parseLocation", () => {
    assert.equal(intl.parseLocation("123 Main St, Springfield, IL 62704")!.country, "US");
    assert.equal(intl.parseLocation("123 Main St, Toronto, ON M5V 3A8")!.country, "CA");
  });

  it("parseStreet auto-detects (no country arg required)", () => {
    const p = intl.parseStreet("999 Rue Sherbrooke");
    assert.equal(p!.country, "CA");
  });

  it("honors an explicit country override", () => {
    // A bare US-style street forced to CA.
    const p = intl.parseStreet("123 Main St", "ca");
    assert.equal(p!.country, "CA");
  });

  it("exposes parsePoAddress and parseIntersection", () => {
    assert.equal(typeof intl.parsePoAddress, "function");
    assert.equal(typeof intl.parseIntersection, "function");
  });
});

describe("country detection contract", () => {
  const intl = new IntlAddressParser();
  it("treats a US ZIP as US even when a city name looks Canadian-ish", () => {
    assert.equal(intl.parseLocation("1 Main St, Ontario, CA 91761")!.country, "US");
  });
  it("detects CA from a bare province code with no postal", () => {
    assert.equal(intl.parseLocation("123 Main St, Calgary AB")!.country, "CA");
  });
  it("detects CA from a Canadian postal code", () => {
    assert.equal(intl.parseLocation("123 Main St, Toronto ON M5V 3A8")!.country, "CA");
  });
});

describe("postal_code is the sole postal field", () => {
  it("US exposes postal_code, not zip", () => {
    const p = new AddressParser("us").parseLocation("1005 Gravenstein Hwy, Sebastopol, CA 95472");
    assert.equal(p!.postal_code, "95472");
    assert.equal((p as unknown as Record<string, unknown>).zip, undefined);
  });
  it("CA exposes postal_code, not zip", () => {
    const p = new AddressParser("ca").parseLocation("123 Main St, Toronto, ON M5V 3A8");
    assert.equal(p!.postal_code, "M5V 3A8");
    assert.equal((p as unknown as Record<string, unknown>).zip, undefined);
  });
});
