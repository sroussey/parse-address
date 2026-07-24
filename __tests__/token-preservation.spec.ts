import assert from "assert";
import { AddressParser, IntlAddressParser } from "../src/parser";
import { losesTokens, minimalLosslessParse } from "../src/invariant";
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

function tokens(text: string): string[] {
  return text.toLowerCase().replace(/[.,#/]/g, " ").split(/\s+/).filter(Boolean);
}

describe("lossless fallback never drops a street token", () => {
  const ca = new AddressParser("ca");

  // These two inputs are the brief's original repro cases. Both now parse
  // correctly via the Tier-1 fixes landed in Task 5 -- e.g. "Boulevard" and
  // "Chemin" are recognized street types abbreviated into `type` ("Blvd" /
  // "Ch"), and "Ouest" is normalized into `suffix` ("W"). That abbreviation
  // is intentional, pre-existing normalization (the same thing happens for
  // any plain-English "Street" -> "St"), not a token drop, so a literal
  // string-token reconstruction check is the wrong tool here: it would flag
  // "chemin"/"boulevard"/"ouest" as "missing" even though nothing was lost,
  // only normalized. The project's own ground truth for "was a token
  // dropped" is `losesTokens` (Task 5) -- assert directly against it, through
  // the now-wired facade, instead of re-deriving a (flawed) literal check.
  const noTailInputs = [
    "1 Chemin de la Rive Boucherville",
    "500 Boulevard de Maisonneuve Ouest",
  ];
  noTailInputs.forEach((address) => {
    it(`does not lose tokens for (${address})`, () => {
      const p = ca.parseLocation(address);
      assert.ok(p);
      assert.equal(
        losesTokens(address, p),
        false,
        `facade output flagged as lossy: ${JSON.stringify(p)}`
      );
    });
  });

  // A real, naturally-occurring truncation: the RR/Box (rural route) path
  // stops at the box number and drops the entire remaining street +
  // locational tail (also documented in
  // CALIBRATION_EXCLUDED_KEYS above as "In production this correctly
  // triggers the Tier-2 lossless fallback"). Unlike the two inputs above,
  // this one is not fixed by Tier-1 -- `AddressParserCA.parseLocation`
  // itself returns {sec_unit_type:"RR", sec_unit_num:"1", street:"Box",
  // country:"CA"} with no city/province/postal_code at all, so this is a
  // genuine end-to-end RED without the facade wiring below (verified: RED
  // before `AddressParser.parseLocation` wraps with
  // `enforceTokenPreservation`, GREEN after -- see task report).
  it("preserves every literal source token for the RR/Box rural-route truncation", () => {
    const address = "RR 1, Box 123, Old Mill Road, Smiths Falls, ON K7A 4S4";
    const p = ca.parseLocation(address);
    assert.ok(p);
    const rebuilt = [
      p!.number,
      p!.civic_number_suffix,
      p!.prefix,
      p!.street,
      p!.type,
      p!.suffix,
      p!.sec_unit_type,
      p!.sec_unit_num,
      p!.city,
      p!.province,
      p!.postal_code,
    ]
      .filter(Boolean)
      .join(" ");
    const outTokens = new Set(tokens(rebuilt));
    const missing = tokens(address).filter((t) => !outTokens.has(t));
    assert.deepEqual(missing, [], `dropped ${JSON.stringify(missing)} from ${JSON.stringify(p)}`);
    // The literal check above is necessary but not sufficient on its own --
    // pin it to the project's actual invariant too.
    assert.equal(losesTokens(address, p), false, "facade output must not be flagged lossy");
  });
});

describe("minimalLosslessParse carries over tail locational fields", () => {
  it("preserves plus4 (which lives in the excluded tail, not the street segment)", () => {
    const out = minimalLosslessParse("123 Main Extra St, City, ST 12345-6789", {
      number: "123",
      street: "Main",
      type: "St",
      city: "City",
      state: "ST",
      postal_code: "12345",
      plus4: "6789",
      country: "US",
    });
    assert.equal(out.postal_code, "12345");
    assert.equal(out.plus4, "6789");
    assert.equal(out.street, "Main Extra"); // the dropped "Extra" is recovered
  });
});

describe("ignored-token stripping is whole-word", () => {
  it("a short dropped token does not split unrelated words", () => {
    // BD reports "Ho" (the "Ho." house-number label) as dropped on every parse.
    // An unanchored replace turned "Chowdhury" into "C wdhury", inflating the
    // required token count and demoting a correct parse to the fallback.
    const parsed = {
      number: "12", street: "Chowdhury", type: "Road",
      city: "Dhaka", postal_code: "1212", country: "BD",
    };
    const src = "House 12, Chowdhury Road, Gulshan, Dhaka 1212";
    assert.strictEqual(losesTokens(src, parsed, ["House", "Ho", "Plot", "Gulshan"]), false);
  });

  it("still strips a genuine whole-word ignored phrase", () => {
    const parsed = { number: "1", street: "Elgin", type: "Ave", city: "George Town", country: "KY" };
    assert.strictEqual(
      losesTokens("1 Elgin Ave, Cricket Square, George Town", parsed, ["Cricket Square"]),
      false
    );
  });
});
