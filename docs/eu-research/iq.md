# Iraq (IQ) Street Address Research

Research for the config-driven XRegExp address parser. This models the **Latin
transliteration** business form used in international / SEC filings. Native
Arabic RTL script is **out of scope** (marked `__skip`). Iraq routes mail by
**street / district (mahalla) / city / governorate**, with a partially-adopted
5-digit national **postcode** that is frequently omitted.

---

## 1. Canonical address order

Number-first (small-endian), often introduced by "No." or absent:
```
[No. <n>,] <Street name> <Type>, <District>, <Governorate> [<NNNNN>]
No. 25, Haifa Street, Al-Karrada, Baghdad 10001
Al-Sadoun Street, Al-Rusafa, Baghdad
Street 52, Al-Mansour, Baghdad            (numbered, type-less street)
PO Box 3007, Al-Karrada, Baghdad          (PO box form)
```

Field mapping:
- **number** — bare or "No. <n>" leading civic number; usually absent.
- **street (+type)** — trailing English suffix (Street/Road/Avenue/...). Numbered
  streets ("Street 52") and type-less names are kept whole.
- **city = the DISTRICT / area** (Al-Karrada, Al-Mansour, Al-Rusafa, Zayouna,
  Al-Jadriya, ...).
- **state = the GOVERNORATE** (Baghdad, Basra, Najaf, Erbil, Nineveh, ...), kept
  spelled out and restricted to a real governorate list.
- **postal_code** — 5 digits, last, after the governorate; usually absent.

---

## 2. Postcode — 5-digit, OPTIONAL

Iraq Post rolled out a **5-digit** postcode ("Baghdad 10001", "Basra 61001").
Adoption is patchy, so `postalPattern = \d{5}` is kept **optional** in the place
grammar: both the postcode-present ("..., Baghdad 10001") and postcode-absent
("..., Al-Karrada, Baghdad") forms parse.

---

## 3. District vs governorate (city vs state)

The after-city place grammar captures **district, governorate** as
`city`, `state`. The `countyPattern` is restricted to the 18 governorates (with
common romanized variants and an optional trailing "Governorate"), so an ordinary
district is never mis-split into `state`. Where a governorate name doubles as a
city (Baghdad, Basra, Kirkuk, Erbil) and appears as the sole locality, it falls
into `city` — a documented single-locality limitation.

---

## 4. Secondary (sub-building) units

Leading lead-in words (before the street): `Building`/`Bldg`, `House`, `Villa`,
`Apartment`/`Apt`, `Flat`, `Suite`, `Floor`, `Office`, `Unit`, `Shop`, optionally
with a "No." marker. The single unit slot holds the first labelled item.

---

## 5. Region (state) and country

- **18 governorates** → `state`, kept spelled out (Baghdad, Basra, Nineveh,
  Erbil, Kirkuk, Najaf, Karbala, Wasit, Maysan, Al Qadisiyyah, Babil, Diyala,
  Dhi Qar, Al Muthanna, Al Anbar, Salah al-Din, Dohuk, Sulaymaniyah; + Halabja).
- **Country**: `Iraq`, `Republic of Iraq`, `IRQ`, `IQ`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Iraq Post; Google libaddressinput (`IQ`); UPU postal addressing;
PostGrid / Smarty IQ format guides; ISO 3166-2:IQ governorate list.

1. **Arabic RTL script** ("شارع حيفا، الكرادة، بغداد") is not modelled. (`__skip`)
2. **Bare governorate + postcode** ("Baghdad 10001", no street) cannot be told
   apart from a numberless street line under the after-city layout, so the
   governorate is taken as the street. (`__skip`)
3. **Baghdad Mahalla/Zuqaq/Dar triple** ("Mahalla 929, Zuqaq 15, Dar 22, ...")
   stacks three numbered locators beyond the single unit/street slots. (`__skip`)
4. **Stacked units** (Building + Floor + Apartment) exceed one unit slot.
   (`__skip`)
5. **Governorate == city.** A sole governorate-named locality lands in `city`
   (Baghdad, Basra, Kirkuk, Erbil).
6. **Postcode optional.** A physical line usually has no code; both forms parse.
7. **PO Box common.** "PO Box 3007, Al-Karrada, Baghdad" → box + district + gov.
8. **Numbered streets are type-less.** "Street 52" kept whole, not type "Street".
9. **Named streets split.** "Haifa Street" → "Haifa" + "Street".
10. **"No." marker** on a leading civic number is consumed, not emitted.

---

## 7. Field-mapping decisions

- `sec_unit_type`/`sec_unit_num` — leading Building/House/etc., OR `PO Box` + no.
- `street` (+`type`) — named street + suffix, or a numbered/type-less name whole.
- `city` — the district; `state` — the governorate (spelled out).
- `postal_code` — 5-digit code when present.
- `country` — `IQ`.

---

## Sources

- Iraq Post (Iraqi Ministry of Communications).
- Google libaddressinput (IQ metadata) — https://chromium-i18n.appspot.com/ssl-address/data/IQ
- Universal Postal Union (UPU) — Postal addressing systems.
- ISO 3166-2:IQ — governorates of Iraq — https://en.wikipedia.org/wiki/ISO_3166-2:IQ
- Wikipedia — Address format / Governorates of Iraq — https://en.wikipedia.org/wiki/Governorates_of_Iraq
- PostGrid / Smarty — Iraq address format guides.
