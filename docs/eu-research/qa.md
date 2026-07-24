# Qatar (QA) Street Address Research

Research for the config-driven XRegExp address parser. **Headline fact: Qatar has
NO postal-code system.** Qatar Post (Q-Post) delivers to **PO boxes**; physical
location uses the QNAS / **"Inwani"** triple — **Zone number, Street number,
Building number** — shown on a blue plate on each building. Arabic is the official
language and addresses are RTL; this parser models the **romanized/Latin business
form** and treats Arabic script as a failure mode.

---

## 1. Canonical address order

Two dominant forms, both **postcode-free**:

**(1) PO Box form** (the primary postal identifier):
```
P.O. Box 24449, Doha
P.O. Box 22040, Doha, Qatar
```

**(2) Physical / Inwani form** (Building-led, as written on labels):
```
Building <no>, Street <no>, Zone <no>, [District,] <City>
Building 7, Street 830, Zone 55, Doha
Building No. 25, Street 230, Zone 24, Al Sadd, Doha
```

Field mapping:
- **sec_unit = the labelled Building** ("Building 7", "Bldg No. 7"): `sec_unit_type`
  "Building", `sec_unit_num` the number. (Building is the primary number but is
  mapped to the secondary-unit slot so the "Building" label is preserved.)
- **street = the numbered street** captured whole as a type-less name
  ("Street 830"); a few named roads carry a trailing type ("Al Corniche Street").
- **Zone number** (and any intervening district) is captured with the city and
  then **dropped** — there is NO Zone field in the shared schema (recorded so the
  token guard does not score it as lost).
- **city = the routing city** (Doha, Al Rayyan, Al Wakrah, Al Khor, Lusail,
  Mesaieed, ...).

---

## 2. Postcode — ABSENT

- There is **no national postal code**. QNAS routes by Zone/Street/Building; the
  Zone number (1–99) is the nearest thing to a routing code but is not a postcode.
- `postalPattern` is a **never-match sentinel** (`(?!x)x`), so every address
  parses through the postcode-absent place branch. `postal_code` is always null.
- Web forms that demand a code are filled with "N/A" or "00000".

---

## 3. Street / building / zone / type

- **Streets are numbered** ("Street 830", "Street 230"); with no trailing type
  they parse as a whole type-less name. A few named arteries carry a trailing
  type: Road/Street/Avenue/Boulevard/Corniche.
- **Zone** ("Zone 55") is a numbered district; dropped (no schema field).
- **District/area** (e.g. "Al Sadd", "Al Nasr", "Bin Mahmoud") may sit between the
  Zone and the city; dropped in favour of the routing city.

---

## 4. Secondary (sub-building) units

Lead-in words (before the street): `Building`/`Bldg`, `Villa`, `Office`,
`Apartment`/`Apt`, `Flat`, `Floor`, `Unit`, `Shop`, `Tower`, optionally with a
"No." marker, then the number. Forms: "Villa 8, Street 902, Zone 91, Al Wakrah",
"Office 302, Street 230, Zone 24, Doha". Only ONE unit slot exists, so a stacked
"Office + Building" line is a failure mode.

---

## 5. Region (state) and country

- **No state field is modelled.** Qatar's eight municipalities (Al Rayyan, Al
  Wakrah, Al Khor, ...) double as the CITY on most labels, so a trailing
  municipality is kept as the routing `city`; `state` is null.
- **Country**: `Qatar`, `State of Qatar`, `QAT`, `QA`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Qatar Post (Q-Post); QNAS (qnas.qa); Google libaddressinput (`QA`, no
postcode field); PostGrid / Smarty QA guides; property/postal-code explainers.

1. **No postcode at all.** Any grammar that expects a postal code fails on every
   Qatari address. Handled by the never-match sentinel + postcode-absent branch.
2. **PO Box is the primary identifier.** "P.O. Box 24449, Doha" → box + city, no
   street, no postcode.
3. **Zone not represented.** "Building 7, Street 830, Zone 55, Doha" — the Zone is
   dropped (no schema field); Street and Building are kept.
4. **Zone/Street-first written order.** The Inwani plate reads Zone → Street →
   Building; a Zone-led written line ("Zone 55, Street 830, Building 7, Doha") is
   not modelled — the parser expects a Building-led line. (`__skip`)
5. **Arabic (RTL) script** ("شارع 830، منطقة 55، الدوحة") is not modelled. (`__skip`)
6. **Stacked units.** "Office 12, Building 55, Street 810, Zone 25, Doha" —
   Office + Building exceed the single secondary-unit slot. (`__skip`)
7. **Extra Inwani elements.** A "Saha" (roundabout/square) number
   ("..., Saha 107, Doha") has no schema field. (`__skip`)
8. **Municipality == city.** "Al Rayyan"/"Al Wakrah"/"Al Khor" are treated as the
   routing city, never split into a separate `state`.
9. **District dropped.** "..., Zone 24, Al Sadd, Doha" — the district "Al Sadd" is
   dropped in favour of "Doha" (one city slot).
10. **"Building No." + "No" marker** folded via the number-marker exemption.

---

## 7. Field-mapping decisions

- `sec_unit_type`/`sec_unit_num` — Building/Villa/Office/... + value, OR `PO Box`
  + box number.
- `street` — the numbered street ("Street 830") whole, or a named road + `type`.
- `city` — the routing city; Zone and district dropped.
- `state` — not modelled (null).
- `postal_code` — **always null** (no Qatari postcode).
- `country` — `QA`.

---

## Sources

- Qatar Post (Q-Post) — https://www.qatarpost.qa/
- Qatar National Address Service (QNAS) — https://qnas.qa/
- Google libaddressinput (QA metadata) — https://chromium-i18n.appspot.com/ssl-address/data/QA
- PostGrid — Qatar address format — https://www.postgrid.com/global-address-format/qatar-address-format/
- Smarty — Qatar address format examples — https://www.smarty.com/global-address-formatting/qatar-address-format-examples
- PropertyFinder Qatar — Guide to Qatar & Doha postal codes — https://www.propertyfinder.qa/blog/a-complete-guide-to-qatar-and-doha-postal-codes/
- Universal Postal Union (UPU) — Postal addressing systems.
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
