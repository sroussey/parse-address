import assert from "assert";
import { AddressParser } from "../src/parser";

const ca = new AddressParser("ca");

describe("Canadian French compound street names", () => {
  it("keeps the full name when a province/postal tail is present", () => {
    const p = ca.parseLocation("123 Avenue du Parc, Montreal, QC H2X 3P6");
    assert.equal(p!.street, "du Parc");
    assert.equal(p!.type, "Ave");
  });

  it("keeps the full name street-only (no tail)", () => {
    const p = ca.parseLocation("123 Avenue du Parc");
    assert.equal(p!.street, "du Parc");
  });

  it("keeps the full name with an unrecognized trailing region code", () => {
    // "A8" is not a recognized province code, so the raw grammar fails to
    // find a city/province/postal_code boundary at all and would otherwise
    // silently drop "Montreal, A8, H2X 3P6" entirely (a genuine Tier-1 gap).
    // The Task 6 lossless-fallback wiring at the `AddressParser` facade
    // catches this and rebuilds a minimal-but-lossless result instead, so the
    // structured fields no longer isolate "du Parc" -- but nothing is lost.
    const p = ca.parseLocation("123 Avenue du Parc, Montreal, A8, H2X 3P6");
    assert.ok(p);
    assert.equal(p!.number, "123");
    assert.ok(p!.street && p!.street.includes("du Parc"));
    assert.ok(p!.street && p!.street.includes("Montreal"));
    assert.ok(p!.street && p!.street.includes("H2X 3P6"));
  });
});

describe("Canadian civic number suffix", () => {
  it("captures an attached letter suffix", () => {
    const p = ca.parseLocation("123A Main St, Toronto, ON M5V 3A8");
    assert.equal(p!.number, "123");
    assert.equal(p!.civic_number_suffix, "A");
    assert.equal(p!.street, "Main");
  });

  it("captures an attached letter suffix street-only", () => {
    const p = ca.parseLocation("123A Main St");
    assert.equal(p!.civic_number_suffix, "A");
    assert.equal(p!.street, "Main");
  });

  it("does NOT capture a spaced directional as a suffix", () => {
    const p = ca.parseLocation("123 N Main St, Toronto, ON M5V 3A8");
    assert.equal(p!.civic_number_suffix, undefined);
  });

  it("still captures a fractional suffix", () => {
    const p = ca.parseLocation("10 1/2 Main St, Toronto, ON M5V 3A8");
    assert.equal(p!.civic_number_suffix, "1/2");
  });
});
