# Saudi Arabia (SA) Street Address Research

Research for the config-driven XRegExp address parser. Saudi Arabia is the only
Gulf country modelled here with a **full national postcode**: the SPL (Saudi
Post | Al-Barid) **National Address** ("Al-Aw'nan al-Watani" / *Wasel*) assigns
every building a machine-routable address. Arabic is the official language and
addresses are RTL; this parser models the **romanized/Latin business form** and
treats Arabic script as a failure mode.

---

## 1. Canonical address order

The SPL National Address has **six** parts:

```
Building Number (4 digits) · Street Name · Additional/Secondary Number (4 digits)
 · District (Hayy) · City · Postal Code (5 digits)
```

Romanized business form the parser targets (Additional Number usually omitted):

```
<building no> <Street Name> <Type>, <District>, <City> <NNNNN[-NNNN]>
8228 King Fahd Road, Al Olaya, Riyadh 12214
3050 Tahlia Street, Al Olaya, Riyadh 12611
2929 Raihana Bint Zaid Street, Al Arid, Riyadh 13337-8118   (with Additional No.)
```

Order: **BUILDING NUMBER first** (bare, or "Building No. 8228"), then the street
name + trailing English type. Field mapping:
- **number = building number** (4 digits; National-Address building numbers are
  4-digit, shorter civic numbers also occur → `\d{1,5}`).
- **street / type = named artery + trailing suffix** (Road/Street/Boulevard/...).
- **district (Hayy)** sits BEFORE the city; the engine has one city slot, so the
  "District, City" chain is captured together and the LAST locality (the routing
  city) is kept — the earlier district(s) are dropped (recorded, so the
  token-preservation guard does not score them as lost). This mirrors the ZA
  suburb+city handling.
- **postal_code = 5 digits LAST**, after the city, with an OPTIONAL 4-digit
  Additional-Number extension kept attached ("12214-2937").
- **PO Box** remains extremely common: "P.O. Box 2727, Riyadh 11461".

---

## 2. Postcode — PRESENT (5 digits + optional 4-digit extension)

- **5-digit** postal code; leading digit is significant; covers 100% of the
  country (libaddressinput `SA`: `zip = \d{5}`, `fmt = %N%n%O%n%A%n%C %Z`).
- The **Additional (Secondary) Number** is a 4-digit code that pinpoints the
  entrance; on labels it is frequently written glued to the postcode as
  "13313-2121". The parser captures `postal_code = "NNNNN"` or `"NNNNN-NNNN"`.
- `postalPattern = (?<postal_code>\d{5}(?:\s*-\s*\d{4})?)`, placed **after** the
  city (after-city layout, like GB/IE).

---

## 3. Street / building / district / type

- **Type vocabulary** (trailing, English): Road, Street, Avenue, Boulevard,
  Highway, Expressway (+ Rd/St/Ave/Blvd/Hwy). Many arteries are named
  ("King Fahd Road", "Prince Sultan Street", "Tahlia/Olaya Street") and some
  romanized names carry no type and parse type-less ("Al Ahsa Road" splits as
  "Al Ahsa" + "Road"; a truly type-less name stays whole).
- **Building number** may be bare or labelled "Building No. 8228" — the label is
  captured as a drop group (consumed, not emitted) and the "No" number-marker is
  skipped.
- **District (Hayy)**: "Al Olaya", "Al Malaz", "Al Nahdah", "Al Rawdah", "Al
  Aqiq", ... nearly all begin with the article "Al". Dropped in favour of the
  routing city (documented).

---

## 4. Secondary (sub-building) units

Lead-in words (before the building number): `Apartment`/`Apt`, `Flat`, `Unit`,
`Suite`, `Floor`, `Office`, `Villa`, `Shop`, optionally with a "No." marker, then
the number: "Apartment 12, 4023 Olaya Street, Al Olaya, Riyadh 12333",
"Floor 3, 2450 Al Takhassusi Street, ...".

---

## 5. Region (state) and country

- **13 administrative regions** → `state`. Only the EXPLICITLY region-marked
  spellings are modelled ("Riyadh Region", "Makkah Region", "Eastern Province",
  "Madinah Region", "Al Qassim Region", ...) and mapped to ISO 3166-2 numeric
  codes (01 Riyadh, 02 Makkah, 03 Madinah, 04 Eastern, 05 Qassim, 06 Hail,
  07 Tabuk, 08 Northern Borders, 09 Jazan, 10 Najran, 11 Al Bahah, 12 Al Jawf,
  14 Asir). Bare region names are NOT modelled because most equal their
  principal city (Makkah, Tabuk, Hail, Jazan, Najran, ...) and would steal the
  city slot. Region is usually omitted (the postcode already routes).
- **Country**: `Saudi Arabia`, `Kingdom of Saudi Arabia`, `KSA`, `SAU`, `SA`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Saudi Post / SPL National Address & Door-Step; Google libaddressinput
(`SA`); PostGrid / Smarty SA address guides; UPU S42.

1. **Arabic (RTL) script + Arabic-Indic digits** ("طريق الملك فهد، ... ١٢٢١٤") are
   not modelled; only the romanized/Latin form parses. (`__skip`)
2. **District dropped.** "8228 King Fahd Road, Al Olaya, Riyadh 12214" → the Hayy
   "Al Olaya" is dropped in favour of the routing city "Riyadh" (one city slot).
3. **Region names equal city names.** "..., Makkah 24243" — bare "Makkah" is the
   CITY, not the region; only "Makkah Region"/"Eastern Province"-style marked
   forms are taken as `state`.
4. **Additional Number.** Captured only when glued to the postcode
   ("13337-8118"); a **bare 4-digit Additional Number** with no street
   ("2929, 8118, Al Arid, Riyadh 13337") is ambiguous with the postcode and not
   modelled. (`__skip`)
5. **SPL short-address code.** The 8-char compact geocode (4 letters + 4 digits,
   e.g. "RQAA6994") is not a street line. (`__skip`)
6. **Region after the postcode.** "..., Riyadh 13515, Riyadh Region" — the shared
   after-city grammar cannot split the code from the city there, so the trailing
   5(+4)-digit postcode is lifted off the kept city in postNormalize.
7. **Labelled "Building No." + "No" marker.** Folded via a drop group + the
   number-marker exemption ("Building No. 3050, ..." → number 3050).
8. **Overloaded lines.** Unit + labelled building + TWO districts
   ("Apartment 12, Building No. 4023, King Fahd Road, Al Olaya, Al Murabba,
   Riyadh 12613") exceed the single street/unit/city slots. (`__skip`)
9. **Ring-road "Exit N" descriptor** has no schema field. (`__skip`)
10. **"Al"-prefixed everything.** Streets, districts and cities overwhelmingly
    start with the article "Al"; the name classes are permissive and never strip
    "Al".

---

## 7. Field-mapping decisions

- `number` — building number (4-digit), bare or "Building No." (label dropped).
- `sec_unit_type` / `sec_unit_num` — Apartment/Floor/Office/Villa/Shop + value,
  OR `PO Box` + box number.
- `street` / `type` — named artery + trailing Road/Street/...; type null for a
  type-less romanized name.
- `city` — the routing city (Riyadh, Jeddah, Dammam, Makkah, Medina, ...); the
  preceding district is dropped.
- `state` — administrative region (ISO 3166-2 numeric), only when explicitly
  region-marked; usually null.
- `postal_code` — 5 digits, optionally "-NNNN" Additional-Number extension.
- `country` — `SA`.

---

## Sources

- Saudi Post | SPL — National Address — https://splonline.com.sa/en/national-address-1/
- Saudi Post | SPL — Door Step — https://splonline.com.sa/en/door-step/
- Google libaddressinput (SA metadata) — https://chromium-i18n.appspot.com/ssl-address/data/SA
- PostGrid — Saudi Post address validation — https://www.postgrid.com/saudi-post-address-validation/
- Smarty — Saudi Arabia address format examples — https://www.smarty.com/global-address-formatting/saudi-arabia-address-format-examples
- Middle East Briefing — Understanding the KSA National Address System — https://www.middleeastbriefing.com/news/understanding-the-ksa-national-address-system/
- Universal Postal Union (UPU) — S42 addressing standard / Postal addressing systems.
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
