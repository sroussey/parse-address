import assert from "assert";
import { AddressParser, IntlAddressParser } from "../src/parser";
import { secProvinceCodesMap } from "../src/maps/ca/sec-provinces";

const ca = new AddressParser("ca");

describe("SEC EDGAR Canadian province codes", () => {
  it("maps every SEC code to its canonical province in the province slot", () => {
    for (const [secCode, province] of Object.entries(secProvinceCodesMap)) {
      const upper = secCode.toUpperCase();
      const parsed = ca.parseLocation(`100 Main Street, Springfield, ${upper} A1A 1A1`);
      assert.equal(
        parsed!.province,
        province,
        `SEC code ${upper} should normalize to ${province}, got ${parsed!.province}`
      );
    }
  });

  it("keeps the street isolated (does not collapse the tail into street)", () => {
    const p = ca.parseLocation("123 Rue Principale, Montreal, A8, H1A 1A1");
    assert.equal(p!.number, "123");
    assert.equal(p!.street, "Principale");
    assert.equal(p!.type, "Rue");
    assert.equal(p!.city, "Montreal");
    assert.equal(p!.province, "QC");
    assert.equal(p!.postal_code, "H1A 1A1");
  });

  it("still recognizes the canonical two-letter province code", () => {
    const p = ca.parseLocation("123 Rue Principale, Montreal, QC, H1A 1A1");
    assert.equal(p!.province, "QC");
    assert.equal(p!.street, "Principale");
  });

  it("does not grab a SEC-code-like unit as the province", () => {
    // "A8" here is a unit number, not a region code; the real province (BC)
    // must win and "A8" must stay the secondary unit.
    const p = ca.parseLocation("999 Seymour Street, Unit A8, Vancouver, BC V6B 3K1");
    assert.equal(p!.sec_unit_type, "Unit");
    assert.equal(p!.sec_unit_num, "A8");
    assert.equal(p!.province, "BC");
  });

  it("auto-detects a SEC-coded Canadian address as CA via its postal code", () => {
    // SEC codes are not a detection signal (they collide with unit numbers);
    // a real EDGAR Canadian address carries a Canadian postal code, which
    // detection matches by shape.
    const intl = new IntlAddressParser();
    assert.equal(
      intl.parseLocation("100 King Street West, Toronto, A6, M5X 1A9")!.country,
      "CA"
    );
  });

  it("does not misroute a US unit resembling a SEC code (A8) to Canada", () => {
    // Regression guard for the detection collision: a US apartment "A8" with no
    // ZIP/state must not be routed to the Canadian parser.
    const intl = new IntlAddressParser();
    assert.equal(intl.parseLocation("123 Main Street Apt A8, Springfield")!.country, "US");
  });
});
