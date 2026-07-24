import assert from "assert";
import { AddressParser, IntlAddressParser } from "../src/parser";

describe("AddressParser constructor", () => {
  it("constructs for supported countries", () => {
    assert.ok(new AddressParser("us"));
    assert.ok(new AddressParser("ca"));
  });

  it("throws for an unsupported country", () => {
    assert.throws(
      () => new AddressParser("zz"),
      /Unsupported country "zz"; supported: us, ca/
    );
  });

  it("accepts a SEC EDGAR code that maps to a supported grammar", () => {
    // E9 = Cayman Islands -> ky
    assert.equal(new AddressParser("E9").parser.findStreetTypeShortCode("Street"), "ST");
  });

  it("throws a descriptive error for a SEC code without a grammar yet", () => {
    assert.throws(() => new AddressParser("K3"), /Hong Kong.*no address grammar yet/);
    assert.throws(() => new AddressParser("G5"), /obsolete jurisdiction/);
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

describe("EDGAR-style concatenated records (leading entity + country description)", () => {
  const intl = new IntlAddressParser();

  it("strips a leading legal entity and detects the country from its name", () => {
    // street1 (entity) + street2 + city+postcode + country DESCRIPTION, no code.
    const p = intl.parseLocation(
      "BANK OF BERMUDA (CAYMAN) LIMITED, 6 FRONT STREET, HAMILTON HM11, BERMUDA"
    )!;
    assert.equal(p.country, "BM");
    assert.equal(p.number, "6");
    assert.equal(p.street, "FRONT");
    assert.equal(p.city, "HAMILTON");
    assert.equal(p.postal_code, "HM 11");
  });

  it("handles a 'c/o' agent prefix", () => {
    const p = intl.parseLocation(
      "c/o Conyers Corporate Services (Bermuda) Limited, Clarendon House, 2 Church Street, Hamilton HM 11"
    )!;
    assert.equal(p.country, "BM");
    assert.equal(p.building, "Clarendon House");
    assert.equal(p.number, "2");
    assert.equal(p.street, "Church");
  });

  it("does not strip a real leading street (segment starting with a number)", () => {
    const p = new AddressParser("us").parseLocation("1005 Gravenstein Hwy, Sebastopol, CA 95472")!;
    assert.equal(p.number, "1005");
    assert.equal(p.street, "Gravenstein");
  });

  it("does not treat an ordinary word ending in 'co'/'sa' as an entity", () => {
    // "Calle San Francisco" must not be stripped on the "co" of Francisco.
    const p = new AddressParser("es").parseLocation("Calle San Francisco, 10, 04001 Almería")!;
    assert.equal(p.street, "San Francisco");
    assert.equal(p.number, "10");
  });
});

describe("IntlAddressParser unsupported-country override", () => {
  it("throws a clear error instead of an opaque TypeError", () => {
    const intl = new IntlAddressParser();
    assert.throws(
      () => intl.parseLocation("123 Main St", "zz"),
      /Unsupported country "zz"; supported: us, ca/
    );
  });
});
