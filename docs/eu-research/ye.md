# Yemen (YE) Street Address Research

Research for the config-driven XRegExp address parser. This models the **Latin
transliteration** business form used in international / SEC filings. Native
Arabic RTL script is **out of scope** (marked `__skip`). Yemen operates **no
functioning national postcode**; mail routes by **PO Box + city**, and physical
location by **street / area / governorate**.

---

## 1. Canonical address order

Number-first (usually number-absent), small-endian:
```
[No. <n>,] <Street name> <Type>, <Area>, <Governorate>
Hadda Street, Hadda, Sana'a
Airport Road, Khormaksar, Aden
PO Box 1234, Sana'a                        (PO box form)
```

Field mapping:
- **number** — leading "No. <n>"; usually absent.
- **street (+type)** — trailing English suffix (Street/Road/...); many roads are
  named type-less.
- **city = the AREA / district** (Hadda, Al-Tahrir, Al-Sabeen, Crater,
  Khormaksar, Al-Mualla, ...).
- **state = the GOVERNORATE** (Sana'a, Aden, Taiz, Al Hudaydah, Ibb, Hadhramaut,
  ...), spelled out and restricted to a real governorate list.

---

## 2. Postcode — NONE (sentinel)

Yemen has no functioning postal-code system. `postalPattern` is a **never-match
sentinel** (`(?!x)x`), so every address parses through the postcode-**absent**
branch of the place grammar. Routing is by PO Box + city.

---

## 3. Area vs governorate (city vs state)

The after-city place grammar captures **area, governorate** as `city`, `state`.
The `countyPattern` is restricted to the governorate list (with romanized
variants and an optional trailing "Governorate"), so an ordinary area is never
mis-split into `state`. Many governorate names double as cities (Aden, Taiz, Ibb,
Dhamar, Hajjah, Marib): a sole such locality falls into `city` — a documented
single-locality limitation.

---

## 4. Secondary (sub-building) units

Leading lead-in words (before the street): `Building`/`Bldg`, `House`, `Villa`,
`Apartment`/`Apt`, `Flat`, `Suite`, `Floor`, `Office`, `Unit`, `Shop`, optionally
with a "No." marker. The single unit slot holds the first labelled item.

---

## 5. Region (state) and country

- **Governorates** → `state`, spelled out: Amanat Al Asimah, Sana'a, Aden, Taiz,
  Al Hudaydah, Ibb, Dhamar, Hadhramaut, Hajjah, Al Bayda, Lahij, Abyan, Sa'dah,
  Shabwah, Al Mahwit, Marib, Al Jawf, Amran, Al Dhale'e, Raymah, Al Mahrah,
  Socotra (with Sanaa / Hodeidah / Ta'izz / Hadramawt variants).
- **Country**: `Yemen`, `Republic of Yemen`, `YEM`, `YE`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Yemen Post; Google libaddressinput (`YE`); UPU postal addressing;
PostGrid / Smarty YE guides; ISO 3166-2:YE governorate list.

1. **Arabic RTL script** ("شارع حدة، حدة، صنعاء") is not modelled. (`__skip`)
2. **Three localities** (district + area + governorate) exceed the single
   city + state slots. (`__skip`)
3. **Stacked units** (Building + Floor + Flat) exceed one unit slot. (`__skip`)
4. **No postcode.** The sentinel forces the postcode-absent place branch.
5. **Governorate == city.** A sole governorate-named locality lands in `city`
   (Aden, Taiz, Ibb, Dhamar, Hajjah, Marib).
6. **PO Box common.** "PO Box 1234, Al-Tahrir, Sana'a" → box + area + governorate.
7. **Named streets split** ("Hadda Street" → "Hadda" + "Street").
8. **Type-less named roads** kept whole where no English suffix is present.
9. **"No." marker** on a leading civic number is consumed, not emitted.
10. **Area == street name** ("Hadda Street, Hadda, Sana'a"): the repeated token is
    tolerated by the token-preservation guard.

---

## 7. Field-mapping decisions

- `sec_unit_type`/`sec_unit_num` — leading Building/House/etc., OR `PO Box` + no.
- `street` (+`type`) — named street + suffix, or a type-less name whole.
- `city` — the area; `state` — the governorate (spelled out).
- `postal_code` — none (sentinel).
- `country` — `YE`.

---

## Sources

- Yemen Post (General Corporation for Posts and Postal Savings).
- Google libaddressinput (YE metadata) — https://chromium-i18n.appspot.com/ssl-address/data/YE
- Universal Postal Union (UPU) — Postal addressing systems.
- ISO 3166-2:YE — governorates of Yemen — https://en.wikipedia.org/wiki/ISO_3166-2:YE
- PostGrid / Smarty — Yemen address format guides.
- Wikipedia — Governorates of Yemen.
