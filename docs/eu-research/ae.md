# United Arab Emirates (AE) Street Address Research

Research for the config-driven XRegExp address parser. **Headline fact: the UAE
has NO postal-code system.** Emirates Post routes mail by **PO Box + emirate**;
physical dispatch uses **building / area / emirate** (and increasingly the
10-digit **Makani** geocode, which is not an administrative field). This is the
central design constraint for the parser.

---

## 1. Canonical address order

Two dominant forms, both **postcode-free**:

**(1) PO Box form** (the primary postal identifier):
```
PO Box 9222, Dubai
P.O. Box 12345, Dubai, United Arab Emirates
```

**(2) Physical / last-mile form**:
```
[Unit,] [Building,] Street [Type], Area/Community, Emirate
Villa 12, Al Wasl Road, Jumeirah, Dubai
Office 1102, Sheikh Zayed Road, Trade Centre, Dubai
Apartment 804, Al Marsa Street, Dubai Marina, Dubai
```

A unit / villa / office typically **leads**; a bare building number is rare. The
mapping the parser uses:
- **city = the AREA / community** (Jumeirah, Deira, Al Barsha, Business Bay).
- **state = the EMIRATE** (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah,
  Fujairah, Umm Al Quwain; plus Al Ain, an emirate-level city).

Because there is no postcode, the shared place grammar runs entirely through its
**postcode-absent branch**: the emirate is captured as the trailing "county" and
folded to `state`; the preceding locality becomes `city`.

---

## 2. Postcode — ABSENT

- There is **no national postal code**. No 5/6-digit routing number narrows a UAE
  destination. Web forms that demand one are typically filled with `00000` or left
  blank.
- The config sets `postalPattern` to a **never-match sentinel** (`(?!x)x`) so
  every address parses through the postcode-absent branch. `postal_code` is always
  null.
- The **PO Box number** is the closest thing to a routing code, and is modelled as
  a secondary unit (`sec_unit_type` "PO Box", `sec_unit_num` the box number), not
  as a postcode.

---

## 3. Street / building / area

- **Streets** carry a trailing English type where they have one: Road, Street,
  Boulevard, Avenue ("Al Wasl Road", "Sheikh Zayed Road", "Al Marsa Street",
  "Khalifa Street"). Many arteries are named, not typed, and many "communities"
  ("Business Bay", "Dubai Marina", "Al Barsha 2") carry no type at all.
- **Numbered communities**: Dubai communities are numbered ("Jumeirah 3",
  "Al Barsha 2", "Al Safa 1"), so the city slot must admit digits
  (`cityAllowsDigits`).
- **Building names** frequently lead ("Burjuman Business Tower, ...",
  "Al Owais Building, ..."). A leading name whose LAST word is a building keyword
  (Tower/Building/Plaza/Centre/Mall/Residence) is captured as `building`.
  **Numbered building names** ("Marina Gate Tower 1") end in a digit and defeat
  the suffix keyword capture — a documented gap.

---

## 4. Secondary (sub-building) units

Lead-in words (before the street): `Office`, `Apartment`/`Apt`, `Flat`, `Villa`,
`Suite`, `Floor`, `Shop`, `Unit`, `Room`, `Warehouse`, `Mezzanine`, then the
number (which may be alphanumeric: `1102`, `804`, `B-12`). Forms: `Villa 12, ...`,
`Office 1102, ...`, `Apartment 804, ...`, `Warehouse 18, ...`.

---

## 5. Emirate (state) and country

- **Seven emirates** -> `state`, kept **spelled out** (no admin code is used in
  practice): `Abu Dhabi`, `Dubai`, `Sharjah`, `Ajman`, `Ras Al Khaimah`,
  `Fujairah`, `Umm Al Quwain`. `Al Ain` (a major city in Abu Dhabi emirate,
  written like an emirate on labels) is also accepted. Multi-word names have their
  spaces escaped to `\s+` and are ordered longest-first.
- When only ONE locality precedes the emirate ("Sheikh Zayed Road, Dubai",
  "PO Box 3000, Abu Dhabi"), there is no area to promote, so the **emirate falls
  into `city`** and `state` is null — an accepted, documented behaviour.
- **Country**: `United Arab Emirates`, `UAE`, `U.A.E.`, `Emirates`, `ARE`, `AE`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Emirates Post; Jeebly / edarabia / dubaifaqs Dubai address guides;
Google libaddressinput (`AE`: `fmt %N%n%O%n%A%n%S`, i.e. street / (no locality) /
**no postcode field** — state = emirate); Smarty / PostGrid UAE guides.

1. **No postcode at all.** Any grammar that requires or expects a postal code
   fails on every UAE address. Handled by the never-match sentinel + postcode-
   absent branch.
2. **PO Box is the primary identifier.** `PO Box 9222, Dubai` must parse as a box
   (secondary unit) + emirate, with no street and no postcode.
3. **Emirate = state, area = city.** `Villa 12, Al Wasl Road, Jumeirah, Dubai` ->
   area "Jumeirah" as city, emirate "Dubai" as state. Requires a REAL street so
   the area is not consumed as the street name.
4. **Single locality collapses the emirate into `city`.** `Sheikh Zayed Road,
   Dubai` — with only one locality, the emirate lands in `city` (no area to
   promote), `state` null. Documented.
5. **Type-less communities captured as the street.** `Villa 18, Al Barsha 2,
   Dubai` — with no thoroughfare type, the community "Al Barsha 2" is captured as
   the street and the emirate as the city. Documented.
6. **Numbered communities.** `Jumeirah 3`, `Al Barsha 2`, `Al Safa 1` — the city/
   name classes must admit digits (`cityAllowsDigits`).
7. **Numbered building names.** `Marina Gate Tower 1` ends in a digit, so the
   suffix building-keyword capture cannot detect it — documented `__skip`.
8. **Fully-loaded lines overflow the slots.** `Office 1102, One Business Bay,
   Business Bay, PO Box 55678, Dubai` — unit + building + community + mid-line PO
   Box + emirate exceeds the single street/city/state slots, and there is no
   postcode delimiter to anchor on. Documented `__skip`.
9. **Gated-community stacks.** `Villa 27, Springs 3, Al Thanyah, Dubai` —
   community + district + emirate (three localities) with no street type; only two
   place slots after the unit. Documented `__skip`.
10. **Multi-word emirate.** `Abu Dhabi`, `Ras Al Khaimah`, `Umm Al Quwain` — spaces
    escaped to `\s+`, alternation longest-first, so "Ras Al Khaimah" is not cut to
    "Ras".
11. **`Al`-prefixed everything.** Streets, areas, and buildings almost all start
    with the Arabic article "Al" ("Al Wasl", "Al Rigga", "Al Barsha"); the name
    classes must be permissive and not treat "Al" as a token to strip.
12. **Free-zone / Makani addresses.** JAFZA "Warehouse 18, Block A, ..." and
    Makani 10-digit geocodes have no admin fields; only the emirate + PO Box are
    reliably captured.

---

## 7. Field-mapping decisions

- `number` — rare bare building number; usually absent (the unit leads).
- `sec_unit_type` / `sec_unit_num` — Villa/Office/Apartment/Shop/Warehouse +
  value, OR `PO Box` + box number.
- `building` — leading name ending in a building keyword.
- `street` / `type` — named artery + trailing Road/Street/Boulevard/Avenue; type
  null for named/community "streets".
- `city` — the area/community (or the emirate when it is the only locality).
- `state` — the emirate, spelled out; null when it collapsed into `city`.
- `postal_code` — **always null** (no UAE postcode).
- `country` — `AE`.

---

## Sources

- Emirates Post — https://www.emiratespost.ae/
- Jeebly — How to write a Dubai address: format, PO Box & examples — https://jeebly.com/blogs/dubai-address-format/
- edarabia — Dubai postal codes / ZIP codes: what to enter + PO Box guide — https://www.edarabia.com/postal-codes-zip-codes-dubai/
- dubaifaqs — Zip codes, postcodes, mailing addresses Dubai UAE — http://www.dubaifaqs.com/zip-code-addresses-dubai-uae.php
- PostGrid — United Arab Emirates address format — https://www.postgrid.com/global-address-format/united-arab-emirates-address-format/
- Smarty — UAE address format examples — https://www.smarty.com/global-address-formatting/united-arab-emirates-format-examples
- Google libaddressinput (AE metadata) — https://chromium-i18n.appspot.com/ssl-address/data/AE
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
