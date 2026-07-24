# Bahrain (BH) Street Address Research

Research for the config-driven XRegExp address parser. Bahrain uses a
**Building / Road / Block** numbering system instead of named streets and house
numbers. The **Block number (3–4 digits) is the routing code**: UPU and Bahrain
Post treat it as the postal code, written after the city ("Manama 319"); in the
street body it is written "Block 319". Arabic is the official language and
addresses are RTL; this parser models the **romanized/Latin business form** and
treats Arabic script as a failure mode.

---

## 1. Canonical address order

Two dominant forms:

**(1) PO Box form:**
```
P.O. Box 1234, Manama
P.O. Box 1729, Manama, Kingdom of Bahrain
```

**(2) Physical form** (Building-led):
```
Building <no>, Road <no>, Block <no>, <City/Area>[, <Governorate>]
Building 50, Road 1901, Block 319, Manama
Building 50, Road 1901, Manama 319          (postal form: block after city)
```

Field mapping:
- **sec_unit = the labelled Building** ("Building 50", "Bldg No. 50"):
  `sec_unit_type` "Building", `sec_unit_num` the number.
- **street = the numbered road** captured whole as a type-less name ("Road 1901");
  a few named roads carry a trailing type ("Government Avenue", "Exhibition Road",
  "King Faisal Highway").
- **postal_code = the BLOCK number** (3–4 digits). Written "Block 319" in the body
  (the word "Block" is dropped, the number lifted to `postal_code`) or as
  "<City> 319" in the postal form — both yield the same `postal_code`.
- **city = the area / town** (Manama, Muharraq, Riffa, Isa Town, Hamad Town,
  Budaiya, Juffair, Adliya, Al Seef, ...).
- **state = optional governorate** → Capital (CAP), Muharraq (MUH), Northern
  (NOR), Southern (SOU).

---

## 2. Postcode — the BLOCK number (3–4 digits)

- Bahrain has **no separate postcode**; the **Block number** is the routing code.
  libaddressinput `BH`: `fmt = %N%n%O%n%A%n%C %Z`, and the block/postcode is
  1–4 digits (`(?:1[0-2]|[1-9])\d{2}`-style; blocks run ~300–1200).
- The parser sets `postalPattern = \d{3,4}` (after-city) and, in postNormalize,
  lifts a body "Block NNN" into `postal_code` (dropping the "Block" word).

---

## 3. Street / building / block / type

- **Roads are numbered** ("Road 1901") and parse whole (type-less); a few named
  roads carry a trailing type: Avenue, Highway, Road, Street, Boulevard.
- **Block** ("Block 319") → `postal_code` (the routing unit).
- **Building** ("Building 50") → `sec_unit`.

---

## 4. Secondary (sub-building) units

Lead-in words (before the road): `Building`/`Bldg`, `Villa`, `Flat`,
`Apartment`/`Apt`, `Office`, `Floor`, `Unit`, `Shop`, optionally with a "No."
marker. The single unit slot normally holds `Building`; a stacked "Flat +
Building" line is a failure mode.

---

## 5. Region (state) and country

- **Four governorates** → `state`, using Bahrain Post abbreviations: Capital
  (CAP), Muharraq (MUH), Northern (NOR), Southern (SOU); a trailing "Governorate"
  word is accepted.
- **Country**: `Bahrain`, `Kingdom of Bahrain`, `BHR`, `BH`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Bahrain Post; UPU S42 (Bahrain postcode note PDF); Google
libaddressinput (`BH`); PostGrid / Smarty / GeoPostcodes BH guides.

1. **Block == postcode.** "Block 319" in the body and "Manama 319" in the postal
   form both map the block number to `postal_code`; the "Block" word is dropped.
2. **Area-first / building-last order.** "Manama, Road 1901, Block 319, Building
   50" is not modelled; the parser expects a Building-led line. (`__skip`)
3. **Arabic (RTL) script + Arabic-Indic digits** ("مبنى ٥٠، طريق ١٩٠١، ...") are
   not modelled. (`__skip`)
4. **Stacked units.** "Flat 21, Building 50, Road 1901, Block 319, Manama" — Flat
   + Building exceed the single secondary-unit slot. (`__skip`)
5. **Area name == governorate name.** "..., Muharraq, Muharraq" — the first is the
   AREA (city), the second the governorate; a governorate the grammar already
   captured is not re-folded from the city chain, so the area is preserved.
6. **Numbered roads are type-less.** "Road 1901" is kept whole rather than parsed
   as type "Road" + name "1901".
7. **Named roads split.** "Government Avenue" → "Government" + "Avenue";
   "Exhibition Road" → "Exhibition" + "Road".
8. **Block-only tail.** A line ending "..., Block 428" with no city yields
   `postal_code = 428` and no city (documented).
9. **"Building No." + "No" marker** folded via the number-marker exemption.
10. **PO Box is common.** "P.O. Box 1234, Manama" → box + city, no street, no
    block.

---

## 7. Field-mapping decisions

- `sec_unit_type`/`sec_unit_num` — Building (or Villa/Flat/Office/...) + value, OR
  `PO Box` + box number.
- `street` — numbered road ("Road 1901") whole, or a named road + `type`.
- `postal_code` — the Block number (3–4 digits), from "Block NNN" or "<City> NNN".
- `city` — the area/town; `state` — the governorate (CAP/MUH/NOR/SOU).
- `country` — `BH`.

---

## Sources

- Bahrain Post — https://www.bahrainpost.gov.bh/
- Universal Postal Union — Bahrain postcode (type & position) PDF — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/bhrEn.pdf
- Google libaddressinput (BH metadata) — https://chromium-i18n.appspot.com/ssl-address/data/BH
- PostGrid — Bahrain address format — https://www.postgrid.com/global-address-format/bahrain-address-format/
- Smarty — Bahrain address format examples — https://www.smarty.com/global-address-formatting/bahrain-format-examples
- GeoPostcodes — Bahrain address format guide — https://www.geopostcodes.com/country/bahrain/address-format/
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
