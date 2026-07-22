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

  it("parses cleanly with a SEC EDGAR region code (A8 = Quebec) in the province slot", () => {
    // "A8" is EDGAR's code for Quebec; it is recognized as a province, so the
    // street stays isolated and the tail resolves to city/province/postal_code
    // (rather than the whole tail collapsing into `street`).
    const p = ca.parseLocation("123 Avenue du Parc, Montreal, A8, H2X 3P6");
    assert.equal(p!.number, "123");
    assert.equal(p!.street, "du Parc");
    assert.equal(p!.type, "Ave");
    assert.equal(p!.city, "Montreal");
    assert.equal(p!.province, "QC");
    assert.equal(p!.postal_code, "H2X 3P6");
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
