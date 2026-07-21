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
    const p = ca.parseLocation("123 Avenue du Parc, Montreal, A8, H2X 3P6");
    assert.equal(p!.street, "du Parc");
  });
});
