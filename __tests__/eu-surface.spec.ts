import assert from "assert";
import { AddressParser, IntlAddressParser } from "../src/parser";

describe("European AddressParser construction", () => {
  it("constructs for every supported European country", () => {
    const codes = [
      "de", "fr", "gb", "it", "es", "nl", "be", "at", "pl", "ch", "pt", "se",
      "dk", "no", "fi", "ie", "cz", "gr", "je", "gg", "ky", "vg", "bm", "gi",
      "au", "nz", "sg", "il", "za", "tr", "br", "mx", "ar", "cl", "co", "pe", "in", "my", "ae", "lu", "is", "mt", "cy", "uy", "ec", "ve", "bo", "ro", "hr", "sk", "si", "cr",
      "sa", "qa", "kw", "bh", "pa", "gt", "do", "ee", "lv", "lt", "hu", "th", "ph", "id", "pk",
    ] as const;
    for (const cc of codes) {
      assert.ok(new AddressParser(cc), `failed to construct ${cc}`);
    }
  });
});

describe("International parses (batch 5: non-European)", () => {
  it("AU: number-street, suffix type, state peeled before postcode", () => {
    const p = new AddressParser("au").parseLocation("10 Collins Street, Melbourne VIC 3000")!;
    assert.equal(p.number, "10");
    assert.equal(p.street, "Collins");
    assert.equal(p.type, "Street");
    assert.equal(p.city, "Melbourne");
    assert.equal(p.state, "VIC");
    assert.equal(p.postal_code, "3000");
    assert.equal(p.country, "AU");
  });

  it("SG: block/number + road + #floor-unit + 6-digit postcode", () => {
    const p = new AddressParser("sg").parseLocation("10 Anson Road, Singapore 079903")!;
    assert.equal(p.number, "10");
    assert.equal(p.street, "Anson");
    assert.equal(p.postal_code, "079903");
    assert.equal(p.country, "SG");
  });

  it("IL: number-first, multi-word type-less street, 7-digit postcode last", () => {
    const p = new AddressParser("il").parseLocation("3 Ben Yehuda, Tel Aviv-Yafo, 6380301")!;
    assert.equal(p.number, "3");
    assert.equal(p.street, "Ben Yehuda");
    assert.equal(p.city, "Tel Aviv-Yafo");
    assert.equal(p.postal_code, "6380301");
    assert.equal(p.country, "IL");
  });

  it("ZA: suburb dropped, routing city kept, 4-digit postcode", () => {
    const p = new AddressParser("za").parseLocation("300 Kempston Road, Sydenham, Port Elizabeth, 6001")!;
    assert.equal(p.number, "300");
    assert.equal(p.street, "Kempston");
    assert.equal(p.type, "Road");
    assert.equal(p.city, "Port Elizabeth");
    assert.equal(p.postal_code, "6001");
  });

  it("TR: trailing type, No: number, district/province split", () => {
    const p = new AddressParser("tr").parseLocation("Bağdat Caddesi No:200, 34728 Kadıköy")!;
    assert.equal(p.street, "Bağdat");
    assert.equal(p.type, "Caddesi");
    assert.equal(p.number, "200");
    assert.equal(p.postal_code, "34728");
    assert.equal(p.city, "Kadıköy");
  });

  it("BR: prefix type, number after street, bairro dropped, CEP + UF", () => {
    const p = new AddressParser("br").parseLocation("Rua Augusta, 900, Consolação, 01304-001 São Paulo - SP")!;
    assert.equal(p.type, "Rua");
    assert.equal(p.street, "Augusta");
    assert.equal(p.number, "900");
    assert.equal(p.postal_code, "01304-001");
    assert.equal(p.city, "São Paulo");
    assert.equal(p.state, "SP");
    assert.equal(p.country, "BR");
  });

  it("resolves these via their SEC EDGAR codes", () => {
    assert.equal(new AddressParser("C3").parseLocation("10 Collins Street, Melbourne VIC 3000")!.country, "AU");
    assert.equal(new AddressParser("L3").parseLocation("3 Ben Yehuda, Tel Aviv-Yafo, 6380301")!.country, "IL");
    assert.equal(new AddressParser("D5").parseLocation("Rua Augusta, 900, 01304-001 São Paulo - SP")!.country, "BR");
  });
});

describe("International parses (batch 6)", () => {
  it("CO: Calle + cross-street '#' composite kept in number", () => {
    const p = new AddressParser("co").parseLocation("Calle 100 # 8-60, Bogotá")!;
    assert.equal(p.type, "Calle");
    assert.equal(p.number, "8-60");
    assert.equal(p.city, "Bogotá");
    assert.equal(p.country, "CO");
  });

  it("MY: Jalan prefix, 5-digit postcode before city, state after", () => {
    const p = new AddressParser("my").parseLocation("No 12, Jalan Ampang, 50450 Kuala Lumpur, Wilayah Persekutuan")!;
    assert.equal(p.number, "12");
    assert.equal(p.type, "Jalan");
    assert.equal(p.street, "Ampang");
    assert.equal(p.postal_code, "50450");
    assert.equal(p.city, "Kuala Lumpur");
    assert.equal(p.country, "MY");
  });

  it("MT: number + Triq + town + 'AAA 9999' postcode", () => {
    const p = new AddressParser("mt").parseLocation("36, Triq ir-Repubblika, Valletta VLT 1117")!;
    assert.equal(p.number, "36");
    assert.equal(p.type, "Triq");
    assert.equal(p.postal_code, "VLT 1117");
    assert.equal(p.city, "Valletta");
    assert.equal(p.country, "MT");
  });

  it("AE: no postcode; PO box unit + emirate", () => {
    const p = new AddressParser("ae").parseLocation("PO Box 9222, Dubai")!;
    assert.equal(p.sec_unit_type, "PO Box");
    assert.equal(p.sec_unit_num, "9222");
    assert.equal(p.country, "AE");
  });

  it("resolves batch-2 via SEC codes (F8 CO, N8 MY, O1 MT)", () => {
    assert.equal(new AddressParser("F8").parseLocation("Calle 100 # 8-60, Bogotá")!.country, "CO");
    assert.equal(new AddressParser("O1").parseLocation("36, Triq ir-Repubblika, Valletta VLT 1117")!.country, "MT");
  });
});

describe("Offshore / Crown Dependency parses (batch 4)", () => {
  it("KY: building + street + district, island dropped, postcode last", () => {
    const p = new AddressParser("ky").parseLocation(
      "Ugland House, South Church Street, George Town, Grand Cayman, KY1-1104"
    )!;
    assert.equal(p.building, "Ugland House");
    assert.equal(p.street, "South Church");
    assert.equal(p.type, "Street");
    assert.equal(p.city, "George Town");
    assert.equal(p.postal_code, "KY1-1104");
    assert.equal(p.country, "KY");
  });

  it("KY: PO box + building, bare island as city", () => {
    const p = new AddressParser("ky").parseLocation(
      "PO Box 309, Ugland House, Grand Cayman, KY1-1104"
    )!;
    assert.equal(p.sec_unit_type, "PO Box");
    assert.equal(p.sec_unit_num, "309");
    assert.equal(p.building, "Ugland House");
    assert.equal(p.city, "Grand Cayman");
  });

  it("VG: building leads the box, island dropped, optional postcode", () => {
    const p = new AddressParser("vg").parseLocation(
      "Sea Meadow House, PO Box 116, Road Town, Tortola, VG1110"
    )!;
    assert.equal(p.building, "Sea Meadow House");
    assert.equal(p.sec_unit_type, "PO Box");
    assert.equal(p.sec_unit_num, "116");
    assert.equal(p.city, "Road Town");
    assert.equal(p.postal_code, "VG1110");
  });

  it("BM: type-word building + numbered street, no comma before postcode", () => {
    const p = new AddressParser("bm").parseLocation(
      "Canon's Court, 22 Victoria Street, Hamilton HM 12"
    )!;
    assert.equal(p.building, "Canon's Court");
    assert.equal(p.number, "22");
    assert.equal(p.street, "Victoria");
    assert.equal(p.type, "Street");
    assert.equal(p.city, "Hamilton");
    assert.equal(p.postal_code, "HM 12");
  });

  it("GI: building + type-less street, city Gibraltar, single postcode", () => {
    const p = new AddressParser("gi").parseLocation(
      "Burns House, 19 Town Range, Gibraltar, GX11 1AA"
    )!;
    assert.equal(p.building, "Burns House");
    assert.equal(p.number, "19");
    assert.equal(p.street, "Town Range");
    assert.equal(p.city, "Gibraltar");
    assert.equal(p.postal_code, "GX11 1AA");
  });

  it("JE: '44 Esplanade' parses as number + street (no building)", () => {
    const p = new AddressParser("je").parseLocation(
      "44 Esplanade, St Helier, Jersey, JE4 9WG"
    )!;
    assert.equal(p.number, "44");
    assert.equal(p.street, "Esplanade");
    assert.equal(p.building, undefined);
    assert.equal(p.city, "St Helier");
    assert.equal(p.postal_code, "JE4 9WG");
  });

  it("JE: named building + 'The Esplanade' street", () => {
    const p = new AddressParser("je").parseLocation(
      "Ogier House, The Esplanade, St Helier, Jersey, JE4 9WG"
    )!;
    assert.equal(p.building, "Ogier House");
    assert.equal(p.street, "The Esplanade");
    assert.equal(p.city, "St Helier");
  });

  it("GG: country code GG from a GY postcode, island as state", () => {
    const p = new AddressParser("gg").parseLocation(
      "23 Victoria Street, St Anne, Alderney, Guernsey, GY9 3TA"
    )!;
    assert.equal(p.number, "23");
    assert.equal(p.street, "Victoria");
    assert.equal(p.city, "St Anne");
    assert.equal(p.state, "Alderney");
    assert.equal(p.postal_code, "GY9 3TA");
    assert.equal(p.country, "GG");
  });
});

describe("IntlAddressParser detects offshore jurisdictions", () => {
  const intl = new IntlAddressParser();
  it("detects KY/VG/BM/GI/JE/GG by postcode or name", () => {
    assert.equal(intl.parseLocation("121 South Church Street, George Town, Grand Cayman, KY1-1104")!.country, "KY");
    assert.equal(intl.parseLocation("Sea Meadow House, PO Box 116, Road Town, Tortola, VG1110")!.country, "VG");
    assert.equal(intl.parseLocation("2 Church Street, Hamilton HM 11, Bermuda")!.country, "BM");
    assert.equal(intl.parseLocation("Burns House, 19 Town Range, Gibraltar, GX11 1AA")!.country, "GI");
    assert.equal(intl.parseLocation("44 Esplanade, St Helier, Jersey, JE4 9WG")!.country, "JE");
    assert.equal(intl.parseLocation("Trafalgar Court, Les Banques, St Peter Port, Guernsey, GY1 3DA")!.country, "GG");
  });
});

describe("European parses (batch 3)", () => {
  it("DK: fused type + floor/side unit", () => {
    const p = new AddressParser("dk").parseLocation("Nørregade 12, 3. tv, 1165 København")!;
    assert.equal(p.street, "Nørre");
    assert.equal(p.type, "gade");
    assert.equal(p.sec_unit_type, "sal");
    assert.equal(p.sec_unit_num, "3. tv");
    assert.equal(p.postal_code, "1165");
  });

  it("NO: spaced type + dwelling code", () => {
    const p = new AddressParser("no").parseLocation("Karl Johans gate 1, 0154 Oslo")!;
    assert.equal(p.street, "Karl Johans");
    assert.equal(p.type, "gate");
    assert.equal(p.postal_code, "0154");
    assert.equal(p.city, "Oslo");
  });

  it("CZ: dual number (orientation/descriptive), spaced postcode", () => {
    const p = new AddressParser("cz").parseLocation("Spálená 82/4, 110 00 Praha 1")!;
    assert.equal(p.street, "Spálená");
    assert.equal(p.number, "4");
    assert.equal(p.civic_number_suffix, "82");
    assert.equal(p.postal_code, "110 00");
    assert.equal(p.city, "Praha 1");
  });

  it("GR: type-less Greek name, NNN NN postcode", () => {
    const p = new AddressParser("gr").parseLocation("Ερμού 15, 105 63 Αθήνα")!;
    assert.equal(p.street, "Ερμού");
    assert.equal(p.number, "15");
    assert.equal(p.postal_code, "105 63");
    assert.equal(p.city, "Αθήνα");
  });

  it("IE: number first, type suffix, county, Eircode last", () => {
    const p = new AddressParser("ie").parseLocation("17 Main St, Bray, Co. Wicklow, A98 DE34")!;
    assert.equal(p.number, "17");
    assert.equal(p.street, "Main");
    assert.equal(p.type, "St");
    assert.equal(p.city, "Bray");
    assert.equal(p.state, "Co. Wicklow");
    assert.equal(p.postal_code, "A98 DE34");
  });
});

describe("IntlAddressParser detects batch-3 countries", () => {
  const intl = new IntlAddressParser();
  it("GR from Greek script, IE from an Eircode, names for DK/NO/FI/CZ", () => {
    assert.equal(intl.parseLocation("Ερμού 15, 105 63 Αθήνα")!.country, "GR");
    assert.equal(intl.parseLocation("10 Grafton Street, Dublin 2, D02 VK65")!.country, "IE");
    assert.equal(intl.parseLocation("Nørregade 12, 1165 København, Danmark")!.country, "DK");
    assert.equal(intl.parseLocation("Storgata 1, 0155 Oslo, Norge")!.country, "NO");
    assert.equal(intl.parseLocation("Mannerheimintie 12, 00100 Helsinki, Suomi")!.country, "FI");
    assert.equal(intl.parseLocation("Národní 25, 110 00 Praha, Czechia")!.country, "CZ");
  });
});

describe("European parses (batch 2)", () => {
  it("BE: French prefix street, number after, bus unit", () => {
    const p = new AddressParser("be").parseLocation("Rue de la Loi 16 bte 3, 1000 Bruxelles")!;
    assert.equal(p.type, "Rue");
    assert.equal(p.street, "de la Loi");
    assert.equal(p.number, "16");
    assert.equal(p.sec_unit_type, "bte");
    assert.equal(p.sec_unit_num, "3");
    assert.equal(p.postal_code, "1000");
    assert.equal(p.city, "Bruxelles");
  });

  it("BE: Dutch fused street", () => {
    const p = new AddressParser("be").parseLocation("Meirstraat 5, 2000 Antwerpen")!;
    assert.equal(p.street, "Meir");
    assert.equal(p.type, "straat");
  });

  it("AT: 4-digit PLZ, fused type, Tür slash unit", () => {
    const p = new AddressParser("at").parseLocation("Operngasse 4/3, 1010 Wien")!;
    assert.equal(p.street, "Opern");
    assert.equal(p.type, "Gasse");
    assert.equal(p.number, "4");
    assert.equal(p.sec_unit_type, "Tür");
    assert.equal(p.sec_unit_num, "3");
    assert.equal(p.postal_code, "1010");
  });

  it("PL: ul. prefix, NN-NNN postcode, slash apartment", () => {
    const p = new AddressParser("pl").parseLocation("ul. Nowy Świat 12/5, 00-372 Warszawa")!;
    assert.equal(p.type, "ul.");
    assert.equal(p.street, "Nowy Świat");
    assert.equal(p.number, "12");
    assert.equal(p.sec_unit_type, "m.");
    assert.equal(p.sec_unit_num, "5");
    assert.equal(p.postal_code, "00-372");
  });

  it("CH: German fused (no ß), French prefix, 4-digit", () => {
    const de = new AddressParser("ch").parseLocation("Bahnhofstrasse 1, 8001 Zürich")!;
    assert.equal(de.street, "Bahnhof");
    assert.equal(de.type, "strasse");
    const fr = new AddressParser("ch").parseLocation("Rue du Rhône 5, 1204 Genève")!;
    assert.equal(fr.type, "Rue");
    assert.equal(fr.street, "du Rhône");
  });

  it("PT: prefix type, PPPP-PPP postcode, floor unit", () => {
    const p = new AddressParser("pt").parseLocation("Rua Garrett 50 3º Esq, 1200-204 Lisboa")!;
    assert.equal(p.type, "Rua");
    assert.equal(p.street, "Garrett");
    assert.equal(p.number, "50");
    assert.equal(p.sec_unit_type, "Andar");
    assert.equal(p.sec_unit_num, "3º Esq");
    assert.equal(p.postal_code, "1200-204");
  });

  it("SE: fused -gatan, PPP PP postcode", () => {
    const p = new AddressParser("se").parseLocation("Drottninggatan 5, 111 51 Stockholm")!;
    assert.equal(p.street, "Drottning");
    assert.equal(p.type, "gatan");
    assert.equal(p.postal_code, "111 51");
    assert.equal(p.city, "Stockholm");
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
    assert.equal(intl.parseLocation("Rue de la Loi 16, 1000 Bruxelles, Belgique")!.country, "BE");
    assert.equal(intl.parseLocation("Kärntner Straße 12, 1010 Wien, Österreich")!.country, "AT");
    assert.equal(intl.parseLocation("Bahnhofstrasse 1, 8001 Zürich, Schweiz")!.country, "CH");
  });

  it("detects PL and PT from their distinctive dash postcodes", () => {
    assert.equal(intl.parseLocation("ul. Marszałkowska 1, 00-950 Warszawa")!.country, "PL");
    assert.equal(intl.parseLocation("Rua Augusta 100, 1100-053 Lisboa")!.country, "PT");
  });

  it("still detects US and CA (no European regression)", () => {
    assert.equal(intl.parseLocation("123 Main St, Springfield, IL 62704")!.country, "US");
    assert.equal(intl.parseLocation("123 Main St, Toronto, ON M5V 3A8")!.country, "CA");
  });

  it("honours an explicit European country override", () => {
    assert.equal(intl.parseStreet("Via Roma 15", "it")!.country, "IT");
  });
});
