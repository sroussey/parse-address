import assert from "assert";
import { AddressParser, IntlAddressParser } from "../src/parser";
import { losesTokens } from "../src/invariant";

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

  it("rejects inherited Object.prototype keys instead of failing opaquely", () => {
    // `euConfigs["constructor"]` / `["__proto__"]` are truthy via the prototype
    // chain, so a plain truthiness check would hand a non-config to the EU
    // parser and throw an unrelated TypeError.
    for (const key of ["constructor", "__proto__", "toString", "valueOf"]) {
      assert.throws(() => new AddressParser(key), /Unsupported country/);
    }
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

  it("keeps the removed entity on the result instead of discarding it", () => {
    const p = new AddressParser("bm").parseLocation(
      "BANK OF BERMUDA (CAYMAN) LIMITED, 6 FRONT STREET, HAMILTON HM11"
    )!;
    assert.equal(p.organization, "BANK OF BERMUDA (CAYMAN) LIMITED");
    assert.equal(p.number, "6");
  });

  it("strips stacked leading entity segments, not just the first", () => {
    const p = new AddressParser("ky").parseLocation(
      "ABC HOLDINGS LTD, c/o Maples Corporate Services Limited, PO Box 309, Ugland House, Grand Cayman, KY1-1104"
    )!;
    assert.equal(p.sec_unit_type, "PO Box");
    assert.equal(p.sec_unit_num, "309");
    assert.equal(p.building, "Ugland House");
    assert.equal(
      p.organization,
      "ABC HOLDINGS LTD, c/o Maples Corporate Services Limited"
    );
  });

  it("strips an all-caps / dotted legal-form abbreviation (EDGAR records are all-caps)", () => {
    for (const input of [
      "ACME HOLDINGS S.A., 6 FRONT STREET, HAMILTON HM 11",
      "ACME HOLDINGS SA, 6 FRONT STREET, HAMILTON HM 11",
      "ACME HOLDINGS N.V., 6 FRONT STREET, HAMILTON HM 11",
      "ACME HOLDINGS BV, 6 FRONT STREET, HAMILTON HM 11",
      "ACME CO, 6 FRONT STREET, HAMILTON HM 11",
    ]) {
      const p = new AddressParser("bm").parseLocation(input)!;
      assert.ok(p.organization, `did not strip the entity in "${input}"`);
      assert.equal(p.number, "6", `for "${input}"`);
      assert.equal(p.city, "HAMILTON", `for "${input}"`);
    }
  });

  it("keeps a title-cased 'Co'/'Sa' inside a street name", () => {
    // Only the dotted or all-caps spellings mark a legal form.
    const p = new AddressParser("pt").parseLocation("Rua da Sa, 12, 1100-053 Lisboa")!;
    assert.equal(p.organization, undefined);
  });

  it("does not strip a multi-word street followed by a bare house number", () => {
    // Street-first layouts write the number alone in the next segment, so a
    // segment followed by a bare number is a STREET, never an organization --
    // even when its last word is an org-ish noun ("Capital", "Group").
    for (const [cc, input] of [
      ["br", "Rua Cidade Capital, 100, 01304-001 Sao Paulo"],
      ["co", "Avenida Simon Bolivar Capital, 12, Bogota"],
      ["es", "Calle Gran Via Group, 10, 28013 Madrid"],
    ] as const) {
      const p = new AddressParser(cc).parseLocation(input)!;
      assert.equal(p.organization, undefined, `stripped the street of "${input}"`);
    }
  });

  it("does not strip a street whose last word is an org-ish noun", () => {
    // Number-after-street layouts get no protection from the "starts with a
    // digit" guard, so "Avenida Capital" / "Rua da Sa" must survive on the
    // strength of the suffix rules alone.
    for (const [cc, input] of [
      ["co", "Avenida Capital, 12, Bogota"],
      ["pt", "Rua da Sa, 12, 1100-053 Lisboa"],
      ["bm", "Harbour Trust, 5 Front Street, Hamilton HM 11"],
    ] as const) {
      const parser = new AddressParser(cc);
      const p = parser.parseLocation(input)!;
      assert.equal(p.organization, undefined, `stripped an address segment in ${input}`);
      // The leading segment must still be accounted for by the parse (either
      // structured or in the lossless fallback), not silently deleted.
      assert.strictEqual(
        losesTokens(input, p, parser.droppableTokens()),
        false,
        `lost the leading segment of ${input}: ${JSON.stringify(p)}`
      );
    }
  });

  it("detects the country from the address, not from a leading entity name", () => {
    const p = intl.parseLocation(
      "CAYMAN ISLANDS HOLDINGS LTD, 10 Downing Street, London SW1A 2AA"
    )!;
    assert.equal(p.country, "GB");
    assert.equal(p.postal_code, "SW1A 2AA");
  });
});

describe("auto-detection covers every configured country name", () => {
  const intl = new IntlAddressParser();

  it("detects a country spelled out in the trailing segment", () => {
    const cases: [string, string][] = [
      ["AU", "10 Collins Street, Melbourne VIC 3000, Australia"],
      ["IN", "12 MG Road, Bengaluru 560001, India"],
      ["ZA", "300 Kempston Road, Port Elizabeth, 6001, South Africa"],
      ["AE", "PO Box 9222, Dubai, United Arab Emirates"],
      ["BR", "Rua Augusta, 900, 01304-001 Sao Paulo - SP, Brasil"],
    ];
    for (const [want, input] of cases) {
      assert.equal(intl.parseLocation(input)!.country, want, `for "${input}"`);
    }
  });

  it("does not mistake a US place name for a country", () => {
    // "New Mexico" / "Lebanon" / "Peru" are US localities; a country name only
    // counts when it is the whole trailing comma segment.
    assert.equal(
      intl.parseLocation("22 Cumbres Pass, Santa Fe, New Mexico 87508")!.country,
      "US"
    );
    assert.equal(intl.parseLocation("123 Main St, Lebanon, OH 45036")!.country, "US");
    assert.equal(intl.parseLocation("123 Main St, Peru, IL 61607")!.country, "US");
  });

  it("does not mistake the US state Georgia for the country GE", () => {
    // "Georgia" names both a US state (GA) and a country (GE); the state is the
    // overwhelmingly likelier reading of a trailing segment on a US line.
    assert.equal(intl.parseLocation("1 Peachtree Rd, Atlanta, Georgia")!.country, "US");
    assert.equal(
      intl.parseLocation("1 Peachtree Rd, Atlanta, Georgia 30301")!.country,
      "US"
    );
  });

  it("still detects a US territory that is also an EDGAR region", () => {
    // Unlike Georgia, these name the SAME jurisdiction as our grammar, so the
    // configured-name detection must keep them.
    assert.equal(intl.parseLocation("1 Calle Luna, San Juan, Puerto Rico")!.country, "PR");
    assert.equal(intl.parseLocation("100 Marine Corps Dr, Tamuning, Guam")!.country, "GU");
  });

  it("does not read a Crown-Dependency name out of an ordinary US place name", () => {
    // "Jersey"/"Sark" only signal JE/GG when they are a whole comma segment.
    assert.equal(
      intl.parseLocation("100 Washington St, Jersey City, NJ 07302")!.country,
      "US"
    );
    assert.equal(intl.parseLocation("220 Sark Ln, Springfield, MO 65807")!.country, "US");
    // ...and the real thing still resolves.
    assert.equal(intl.parseLocation("44 Esplanade, St Helier, Jersey")!.country, "JE");
    assert.equal(
      intl.parseLocation("Trafalgar Court, Les Banques, St Peter Port, Guernsey")!.country,
      "GG"
    );
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
