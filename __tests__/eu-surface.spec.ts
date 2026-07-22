import assert from "assert";
import { AddressParser, IntlAddressParser } from "../src/parser";

describe("European AddressParser construction", () => {
  it("constructs for every supported European country", () => {
    for (const cc of ["de", "fr", "gb", "it", "es", "nl"] as const) {
      assert.ok(new AddressParser(cc), `failed to construct ${cc}`);
    }
  });
});

describe("European parses (explicit country)", () => {
  it("DE: number after a fused-type street, PLZ before city", () => {
    const p = new AddressParser("de").parseLocation("Bäckerstraße 12, 10115 Berlin")!;
    assert.equal(p.street, "Bäcker");
    assert.equal(p.type, "Straße");
    assert.equal(p.number, "12");
    assert.equal(p.postal_code, "10115");
    assert.equal(p.city, "Berlin");
    assert.equal(p.country, "DE");
  });

  it("FR: number first, leading voie type", () => {
    const p = new AddressParser("fr").parseLocation("10 Rue de Rivoli, 75001 Paris")!;
    assert.equal(p.number, "10");
    assert.equal(p.type, "Rue");
    assert.equal(p.street, "de Rivoli");
    assert.equal(p.postal_code, "75001");
    assert.equal(p.city, "Paris");
    assert.equal(p.country, "FR");
  });

  it("GB: number first, suffix type, postcode last, optional county", () => {
    const p = new AddressParser("gb").parseLocation("14 Guildown Road, Guildford, Surrey, GU2 4EX")!;
    assert.equal(p.number, "14");
    assert.equal(p.street, "Guildown");
    assert.equal(p.type, "Road");
    assert.equal(p.city, "Guildford");
    assert.equal(p.state, "Surrey");
    assert.equal(p.postal_code, "GU2 4EX");
    assert.equal(p.country, "GB");
  });

  it("GB: normalises postcode spacing/case", () => {
    const p = new AddressParser("gb").parseLocation("10 Downing Street, London, SW1A2AA")!;
    assert.equal(p.postal_code, "SW1A 2AA");
  });

  it("IT: prefix type, trailing civico, province after city", () => {
    const p = new AddressParser("it").parseLocation("Via Roma 15, 00184 Roma RM")!;
    assert.equal(p.type, "Via");
    assert.equal(p.street, "Roma");
    assert.equal(p.number, "15");
    assert.equal(p.postal_code, "00184");
    assert.equal(p.city, "Roma");
    assert.equal(p.state, "RM");
  });

  it("ES: comma before number, province in parentheses", () => {
    const p = new AddressParser("es").parseLocation("Calle Uría, 30, 33003 Oviedo (Asturias)")!;
    assert.equal(p.type, "Calle");
    assert.equal(p.street, "Uría");
    assert.equal(p.number, "30");
    assert.equal(p.city, "Oviedo");
    assert.equal(p.state, "Asturias");
  });

  it("NL: fused type, 4+2 postcode, apostrophe city", () => {
    const p = new AddressParser("nl").parseLocation("Spuistraat 63, 2511 BD 's-Gravenhage")!;
    assert.equal(p.street, "Spui");
    assert.equal(p.type, "straat");
    assert.equal(p.number, "63");
    assert.equal(p.postal_code, "2511 BD");
    assert.equal(p.city, "'s-Gravenhage");
  });
});

describe("IntlAddressParser auto-detection of European countries", () => {
  const intl = new IntlAddressParser();

  it("detects GB from a UK postcode", () => {
    assert.equal(intl.parseLocation("10 Downing Street, London SW1A 2AA")!.country, "GB");
  });

  it("detects NL from a 4+2 postcode", () => {
    assert.equal(intl.parseLocation("Kalverstraat 92, 1012 PH Amsterdam")!.country, "NL");
  });

  it("detects continental countries from an explicit country name", () => {
    assert.equal(intl.parseLocation("Bäckerstraße 12, 10115 Berlin, Deutschland")!.country, "DE");
    assert.equal(intl.parseLocation("10 Rue de Rivoli, 75001 Paris, France")!.country, "FR");
    assert.equal(intl.parseLocation("Via Roma 15, 00184 Roma, Italia")!.country, "IT");
    assert.equal(intl.parseLocation("Calle de Alcalá 42, 28014 Madrid, España")!.country, "ES");
  });

  it("still detects US and CA (no European regression)", () => {
    assert.equal(intl.parseLocation("123 Main St, Springfield, IL 62704")!.country, "US");
    assert.equal(intl.parseLocation("123 Main St, Toronto, ON M5V 3A8")!.country, "CA");
  });

  it("honours an explicit European country override", () => {
    assert.equal(intl.parseStreet("Via Roma 15", "it")!.country, "IT");
  });
});
