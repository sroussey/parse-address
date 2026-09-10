import assert from "assert";
import {
  AddressParser,
  hasPostalGrammar,
  inspectPostalCode,
  normalizePostalCode,
} from "../src/parser";
import { SUPPORTED_COUNTRIES } from "../src/country";
import { CORPORA } from "./eu-fixtures/corpora";

const zip = (value: string, country: string) => normalizePostalCode(value, country);

describe("US ZIP codes", () => {
  const cases: Array<[string, string, string]> = [
    ["plain five digits", "10001", "10001"],
    ["ZIP+4 with a dash", "10001-1234", "10001"],
    ["ZIP+4 with no dash", "100011234", "10001"],
    ["ZIP+4 truncated after the dash", "77002-2", "77002"],
    ["ZIP+4 separated by a space", "10467 2490", "10467"],
    ["a trailing dash and nothing else", "10022-", "10022"],
  ];
  it.each(cases)("recovers the ZIP from %s", (_label, input, expected) => {
    assert.equal(zip(input, "us"), expected);
  });

  const rejected: Array<[string, string]> = [
    ["a placeholder", "N/A"],
    ["a refusal", "NOT APPLIC"],
    ["a masked value", "XXXXX"],
    ["a city name", "NEW YORK"],
    ["a state code", "TX"],
    ["a phone number", "9178433621"],
    ["an ambiguous four digits", "1022"],
    // "12572" plus a stray digit, or "75011" plus one -- nothing in the value
    // says which, so neither is guessed at.
    ["an ambiguous six digits", "125721"],
  ];
  it.each(rejected)("rejects %s", (_label, input) => {
    assert.equal(zip(input, "us"), null);
  });

  it("will not accept a ZIP with junk trailing it", () => {
    assert.equal(zip("10001 NEW YORK NY", "us"), null);
  });
});

describe("Canadian postal codes", () => {
  it("folds the letters Canada Post never uses back to digits", () => {
    // O and I are excluded from every position, so they are always a mistyped
    // zero or one.
    assert.equal(zip("T2G OP8", "ca"), "T2G 0P8");
    assert.equal(zip("M5VI A8", "ca"), null); // still has to be the right shape
    assert.equal(zip("V6C-2W2", "ca"), "V6C 2W2");
    assert.equal(zip("M5V3A8", "ca"), "M5V 3A8");
  });

  it("does not guess at confusables the alphabet leaves ambiguous", () => {
    // S and Z are both real letters in a Canadian code, so "MSJ 2T3" is left
    // as written rather than repaired to "M5J 2T3".
    assert.equal(zip("MSJ 2T3", "ca"), null);
  });
});

describe("UK postcodes", () => {
  it.each([
    ["already canonical", "SW1A 1AA", "SW1A 1AA"],
    ["missing the space", "M11AA", "M1 1AA"],
    ["lower case", "ec1a 1bb", "EC1A 1BB"],
    ["the Girobank special case", "GIR0AA", "GIR 0AA"],
  ])("normalizes %s", (_label, input, expected) => {
    assert.equal(zip(input, "gb"), expected);
  });

  it("rejects a value that is not a postcode", () => {
    assert.equal(zip("LONDON", "gb"), null);
  });
});

describe("Cayman Islands", () => {
  it.each([
    ["canonical", "KY1-1104", "KY1-1104"],
    ["space separator", "KY1 1104", "KY1-1104"],
    ["no separator", "KY11104", "KY1-1104"],
    ["I typed for 1", "KYI-1104", "KY1-1104"],
  ])("normalizes %s", (_label, input, expected) => {
    assert.equal(zip(input, "ky"), expected);
  });

  it.each([
    // The district digit is real information (KY1 Grand Cayman, KY2 Cayman
    // Brac, KY3 Little Cayman), so a missing one is refused, not invented.
    ["a missing district digit", "KY-1104"],
    ["a district that is not issued", "KY9-1104"],
    ["a country name", "CAYMAN"],
    ["BWI", "BWI"],
  ])("rejects %s", (_label, input) => {
    assert.equal(zip(input, "ky"), null);
  });

  it("resolves the SEC code for the Cayman Islands", () => {
    assert.equal(zip("KY1 1104", "E9"), "KY1-1104");
  });
});

describe("Bermuda", () => {
  it.each([
    ["spaced", "HM 11", "HM 11"],
    ["unspaced", "HM11", "HM 11"],
    ["letter suffix", "HMCX", "HM CX"],
  ])("normalizes %s", (_label, input, expected) => {
    assert.equal(zip(input, "bm"), expected);
  });
});

describe("British Virgin Islands", () => {
  it.each([
    ["canonical", "VG1110", "VG1110"],
    ["spaced", "VG 1110", "VG1110"],
    // The "VG" prefix is constant across the territory, so it carries no
    // information and a bare code is not a guess.
    ["bare, prefix implied", "1110", "VG1110"],
  ])("normalizes %s", (_label, input, expected) => {
    assert.equal(zip(input, "vg"), expected);
  });

  it.each([
    ["out of the issued range", "9999"],
    ["a country name", "BVI"],
  ])("rejects %s", (_label, input) => {
    assert.equal(zip(input, "vg"), null);
  });
});

describe("countries with no hand-written repair rule", () => {
  it("falls back to the parse-time pattern, anchored", () => {
    assert.equal(zip("10115", "de"), "10115");
    assert.equal(zip("75008", "fr"), "75008");
    assert.equal(zip("018989", "sg"), "018989");
  });

  it("still rejects a value of the wrong shape", () => {
    assert.equal(zip("BERLIN", "de"), null);
    assert.equal(zip("N/A", "fr"), null);
  });

  it("will not accept a code with the city trailing it", () => {
    assert.equal(zip("10115 BERLIN", "de"), null);
  });

  it("has a working rule for every supported country", () => {
    const missing = SUPPORTED_COUNTRIES.filter((c) => !hasPostalGrammar(c));
    assert.deepEqual(missing, []);
  });
});

describe("an all-zero postal code is a placeholder, never a code", () => {
  it.each([
    ["US", "us", "00000"],
    ["Cayman", "E9", "00000"],
    ["Bermuda", "bm", "0000"],
    ["BVI", "vg", "0000"],
    ["a country with no grammar at all", "K3", "000000"],
  ])("rejects it for %s", (_label, country, value) => {
    assert.equal(zip(value, country), null);
  });
});

describe("inspectPostalCode reports why a value was refused", () => {
  it.each([
    ["empty", "   ", "us"],
    ["placeholder", "00000", "us"],
    ["malformed", "N/A", "us"],
    // Hong Kong is a real SEC code with no address grammar yet; an obsolete
    // code has no modern country at all. Neither throws here -- a caller
    // sweeping a corpus decides for itself whether to keep the raw value.
    ["no-grammar", "999077", "K3"],
    ["no-grammar", "12345", "G5"],
    ["no-grammar", "12345", "not-a-country"],
  ])("reports %s", (reason, value, country) => {
    const result = inspectPostalCode(value, country);
    assert.equal(result.ok, false);
    assert.equal(!result.ok && result.reason, reason);
  });

  it("flags whether the canonical form differs from the input", () => {
    const untouched = inspectPostalCode("10001", "us");
    assert.equal(untouched.ok && untouched.repaired, false);

    const repaired = inspectPostalCode("m5v3a8", "ca");
    assert.equal(repaired.ok && repaired.postalCode, "M5V 3A8");
    assert.equal(repaired.ok && repaired.repaired, true);
  });

  it("echoes the trimmed input back on a rejection", () => {
    const result = inspectPostalCode("  N/A  ", "us");
    assert.equal(!result.ok && result.input, "N/A");
  });
});

describe("AddressParser postal methods", () => {
  it("uses the parser's own country without re-resolving it", () => {
    const ky = new AddressParser("E9");
    assert.equal(ky.country, "ky");
    assert.equal(ky.normalizePostalCode("KY11104"), "KY1-1104");
    assert.equal(ky.normalizePostalCode("N/A"), null);
    assert.equal(ky.inspectPostalCode("N/A").ok, false);
  });

  it("handles a null or undefined value", () => {
    const us = new AddressParser("us");
    assert.equal(us.normalizePostalCode(null), null);
    assert.equal(us.normalizePostalCode(undefined), null);
  });
});

describe("every ground-truth postal code survives field-time normalization", () => {
  // The strongest available check on the derived fallback: a code the parser
  // pulled out of a real address for a country MUST be accepted when the same
  // code arrives on its own as a field. A derived rule that silently rejects
  // everything -- an unanchored pattern, a bad free-spacing translation --
  // cannot pass this.
  const cases: Array<[string, string, string]> = [];
  for (const [country, samples] of Object.entries(CORPORA)) {
    for (const sample of samples) {
      if (sample.__skip || !sample.postal_code) continue;
      cases.push([country, sample.postal_code, sample.input]);
    }
  }

  it("covers a broad set of countries", () => {
    const covered = new Set(cases.map(([country]) => country));
    assert.ok(
      covered.size > 150,
      `expected postal fixtures for most countries, got ${covered.size}`
    );
  });

  it.each(cases)("%s accepts %s", (country, postalCode) => {
    const result = inspectPostalCode(postalCode, country);
    assert.ok(result.ok, `rejected as ${!result.ok && result.reason}`);
  });

  it.each(cases)("%s is idempotent for %s", (country, postalCode) => {
    const once = normalizePostalCode(postalCode, country);
    assert.equal(normalizePostalCode(once, country), once);
  });
});
