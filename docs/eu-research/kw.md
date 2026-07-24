# Kuwait (KW) Street Address Research

Research for the config-driven XRegExp address parser. Kuwait routes physical mail
by an **Area + Block (Qita) + Street (Share) + Building/House** hierarchy plus a
**Governorate**. A 5-digit national "postal number" exists but is used almost
exclusively on **PO-box** lines; ordinary street lines carry **no postcode**.
Arabic is the official language and addresses are RTL; this parser models the
**romanized/Latin business form** and treats Arabic script as a failure mode.

---

## 1. Canonical address order

Two dominant forms:

**(1) PO Box form** (with the "postal number" on the box line):
```
P.O. Box 1234, Safat 13001
P.O. Box 12345, Salmiya 22003, Kuwait
```

**(2) Physical form** (Block-led):
```
Block <no>, Street <no>, Building <no>, <Area>, <Governorate>
Block 5, Street 8, Building 22, Salmiya, Hawally
Block 12, Salem Al Mubarak Street, Salmiya, Hawally   (named street)
```

Field mapping:
- **sec_unit = the labelled Block** ("Block 5"): `sec_unit_type` "Block",
  `sec_unit_num` the number. Block is the most Kuwait-specific routing element, so
  it takes the single secondary-unit slot.
- **street = the numbered street** captured whole as a type-less name
  ("Street 8"); a named street/expressway splits off its trailing type
  ("Salem Al Mubarak Street" → "Salem Al Mubarak" + "Street"; "Fahaheel
  Expressway").
- **Building/House number**: folded INTO the street when written comma-less
  ("Street 8 Building 22"), or **dropped** when it is its own comma segment
  (single unit slot already holds Block — documented).
- **city = the AREA** (Salmiya, Salwa, Jabriya, Mishref, Fahaheel, ...).
- **state = the GOVERNORATE** (Al Asimah/Capital, Hawalli, Al Farwaniyah, Al
  Ahmadi, Al Jahra, Mubarak Al-Kabeer) → ISO 3166-2 codes.

---

## 2. Postcode — OPTIONAL (5-digit "postal number", PO lines only)

- Kuwait's "postal number" is **5 digits**: the first two encode the governorate,
  the last three the area (by block or PO-box). libaddressinput `KW`:
  `zip = \d{5}`, `fmt = %N%n%O%n%A%n%Z %C`.
- In practice it appears only on PO-box lines ("Safat 13001", "Salmiya 22003");
  ordinary street lines omit it. The parser makes `postalPattern = \d{5}`
  **optional** in the place grammar, so both forms parse.

---

## 3. Street / block / building / type

- **Block (Qita)**: numbered subdivision, the primary routing unit → `sec_unit`.
- **Streets are numbered** ("Street 8") and parse whole (type-less); some named
  arteries carry a trailing type (Street, Avenue, Road, Expressway, Highway,
  Motorway) — "Salem Al Mubarak Street", "Arabian Gulf Street", "Fahaheel
  Expressway".
- **Building / House** number: folded into the street (comma-less) or dropped.

---

## 4. Secondary (sub-building) units

Lead-in words (before the street): `Block`, `Building`/`Bldg`, `House`, `Villa`,
`Floor`, `Apartment`/`Apt`, `Flat`, `Office`, `Unit`, `Shop`, `Jada` (avenue),
optionally with a "No." marker. The FIRST labelled item on the line (normally
`Block`) fills the single unit slot.

---

## 5. Region (state) and country

- **Six governorates** → `state`, mapped to ISO 3166-2 codes: Al Asimah/Capital
  (KU), Hawalli (HA), Al Farwaniyah (FA), Al Ahmadi (AH), Al Jahra (JA), Mubarak
  Al-Kabeer (MU). A trailing "Governorate" word is accepted. The bare short forms
  Farwaniya/Ahmadi/Jahra are NOT modelled as governorates (they double as area
  names and would steal the city slot).
- **Country**: `Kuwait`, `State of Kuwait`, `KWT`, `KW`.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Kuwait Post (Ministry of Communications); Google libaddressinput
(`KW`); PostGrid / Smarty / Umbrex KW guides; area/governorate postal-code lists.

1. **Building dropped.** "Block 5, Street 8, Building 22, Salmiya, Hawally" — the
   Building written as its own comma segment is dropped; the single unit slot
   holds Block. (Comma-less "Street 8 Building 22" keeps it in `street`.)
2. **Area-first written order** ("Salmiya, Block 5, Street 8, Kuwait") is not
   modelled; the parser expects a Block-led line. (`__skip`)
3. **Arabic (RTL) script + Arabic-Indic digits** ("قطعة ٥، شارع ٨، ...") are not
   modelled. (`__skip`)
4. **Stacked units.** "Block 5, Street 8, Building 22, Floor 3, Apt 6, Salmiya,
   Hawally" — Block + Building + Floor + Apartment exceed one unit slot. (`__skip`)
5. **Governorate == area names.** Short governorate spellings (Farwaniya, Ahmadi,
   Jahra) collide with areas and are excluded from the state vocabulary; a
   governorate the grammar already captured is not re-folded from the city chain.
6. **Postcode optional / PO-only.** A physical line has no postcode; a PO line
   carries "<Area> NNNNN" — both handled by the optional 5-digit pattern.
7. **PO Box is common.** "P.O. Box 1234, Safat 13001" → box + city + code, no
   street.
8. **Numbered streets are type-less.** "Street 8" is kept whole rather than parsed
   as type "Street" + name "8".
9. **Named streets split.** "Salem Al Mubarak Street" → "Salem Al Mubarak" +
   "Street"; "Fahaheel Expressway" → "Fahaheel" + "Expressway".
10. **Multi-locality drop.** Any locality between the street and the routing area
    is dropped (recorded, so it is not scored as a lost token).

---

## 7. Field-mapping decisions

- `sec_unit_type`/`sec_unit_num` — Block (or leading Building/House) + value, OR
  `PO Box` + box number.
- `street` — numbered street ("Street 8") whole (comma-less building folded in),
  or a named street + `type`.
- `city` — the area; `state` — the governorate (ISO 3166-2).
- `postal_code` — 5-digit postal number when present (chiefly PO lines).
- `country` — `KW`.

---

## Sources

- Kuwait Post — Ministry of Communications — https://www.moc.gov.kw/
- Google libaddressinput (KW metadata) — https://chromium-i18n.appspot.com/ssl-address/data/KW
- PostGrid — Kuwait address format — https://www.postgrid.com/global-address-format/kuwait-address-format/
- Smarty — Kuwait address format examples — https://www.smarty.com/global-address-formatting/kuwait-address-format-examples
- Umbrex — How to address a letter to Kuwait — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-kuwait/
- Kuwait Mart — Kuwait postal code guide by area & governorate — https://blog.kuwaitmart.com/comprehensive-kuwait-postal-code-guide-by-area-governorate-2026/
- Universal Postal Union (UPU) — Postal addressing systems.
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
