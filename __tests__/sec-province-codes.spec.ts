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

  it("routes a SEC-code address to Canada via auto-detection", () => {
    const intl = new IntlAddressParser();
    assert.equal(
      intl.parseLocation("100 King Street West, Toronto, A6, M5X 1A9")!.country,
      "CA"
    );
  });
});
