# Oman (OM) Street Address Research

Research for the config-driven XRegExp address parser. This models the **Latin
transliteration** business form used in international / SEC filings. Native
Arabic RTL script is **out of scope** (marked `__skip`). Oman is **distinctive**:
physical streets are numbered **"Way NNNN"**, and the postal code is a **3-digit**
code introduced by the marker **"PC"** (Postal Code), written **before** the
locality alongside the PO box.

---

## 1. Canonical address order

Number-first, with the code preceding the locality:
```
[Building <n>,] Way <NNNN>, PC <NNN>, <District/Wilayat> [, <Governorate>]
Way 3042, PC 133, Al Khuwair, Muscat
Building 145, Way 2957, PC 112, Ruwi, Muscat
PO Box 123, PC 133, Al Khuwair            (PO box form)
```

Field mapping:
- **sec_unit** — leading labelled Building/Villa/Office ("Building 145"), OR
  `PO Box` + box number.
- **street = "Way NNNN"** captured whole (bare, **type-less**); a named road
  ("Sultan Qaboos Street") splits its trailing English type.
- **postal_code = the 3 digits after "PC"/"P.C."** (marker consumed, not emitted).
- **city = the DISTRICT / wilayat area** (Al Khuwair, Ruwi, Al Qurum, Al Ghubra,
  Muttrah, Seeb, ...).
- **state = the GOVERNORATE** (Muscat, Dhofar, Musandam, Al Batinah North, ...),
  spelled out, optional.

---

## 2. Postcode — 3-digit "PC NNN", BEFORE the city

Oman Post uses a **3-digit** code (the first digit encodes the region), written
with the marker **"PC"**: "P.O. Box 123, PC 133, Al Khuwair". Because the code
**precedes** the locality, the parser uses a **before-city** place layout
(postcode → city → optional governorate). The "PC" marker is captured as a
**drop group** — consumed and recorded as dropped (so the token-preservation
guard does not score it as lost) — and only the 3 digits become `postal_code`.

---

## 3. Street / "Way" / type

- **Streets are numbered "Way NNNN"** (the Omani "Sikka"/"Way" system) and parse
  as a **whole type-less name** ("Way 3042"). "Way No. 2957" also parses whole
  (the "No." folds into the name at token-count time).
- **Named arteries** carry a trailing English type — "Sultan Qaboos Street",
  "Al Wadi Al Kabir Road", "Sultan Qaboos Highway" — split into name + type.

---

## 4. Secondary (sub-building) units

Leading lead-in words (before the street): `Building`/`Bldg`, `Villa`, `House`,
`Apartment`/`Apt`, `Flat`, `Suite`, `Floor`, `Office`, `Unit`, `Shop`, optionally
with a "No." marker. The first labelled item fills the single unit slot.

---

## 5. Region (state) and country

- **11 governorates** → `state`, spelled out: Muscat, Dhofar, Musandam,
  Al Buraimi, Al Dakhiliyah, Al Batinah North/South, Al Sharqiyah North/South,
  Al Dhahirah, Al Wusta (with Ad Dakhiliyah / Ash Sharqiyah / Az Zahirah
  variants). Optional; often omitted (the city + PC already route).
- **Country**: `Oman`, `Sultanate of Oman`, `OMN`, `OM`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Oman Post; Google libaddressinput (`OM`); UPU postal addressing;
PostGrid / Smarty OM guides; ISO 3166-2:OM governorate list.

1. **Arabic RTL script** ("طريق ٣٠٤٢، الخوير، مسقط") is not modelled. (`__skip`)
2. **City-then-PC order** ("Way 3042, Al Khuwair, PC 133, Muscat") — the
   before-city grammar requires "PC NNN" to precede the locality. (`__skip`)
3. **Stacked units** (Building + Floor + Flat) exceed one unit slot. (`__skip`)
4. **"Way NNNN" is type-less.** Kept whole, not parsed as type "Way" + number.
5. **"PC" marker** is dropped; only the 3 digits are the postal code.
6. **Governorate optional.** A district + PC line parses with no `state`.
7. **PO Box common.** "PO Box 123, PC 133, Al Khuwair" → box + code + district.
8. **Governorate == city.** A sole governorate-named locality ("PC 111, Muscat")
   lands in `city`.
9. **Named roads split** ("Sultan Qaboos Street" → "Sultan Qaboos" + "Street").
10. **PC-only place line** ("P.C. 133, Al Khuwair, Muscat") parses via the
    standalone place grammar (no street).

---

## 7. Field-mapping decisions

- `sec_unit_type`/`sec_unit_num` — leading Building/Villa/etc., OR `PO Box` + no.
- `street` — "Way NNNN" whole, or a named road + `type`.
- `postal_code` — the 3 digits after the "PC" marker.
- `city` — the district/wilayat; `state` — the governorate (spelled out).
- `country` — `OM`.

---

## Sources

- Oman Post — https://www.omanpost.om/
- Google libaddressinput (OM metadata) — https://chromium-i18n.appspot.com/ssl-address/data/OM
- Universal Postal Union (UPU) — Postal addressing systems.
- ISO 3166-2:OM — governorates of Oman — https://en.wikipedia.org/wiki/ISO_3166-2:OM
- PostGrid / Smarty — Oman address format guides.
- Wikipedia — Postal codes / Governorates of Oman.
