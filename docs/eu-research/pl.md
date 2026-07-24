# Polish (PL) Postal Address Research — for a street-address parser/normalizer

Sources consulted: Poczta Polska (BIP — System PNA; sklep.poczta-polska.pl envelope guide),
GeoPostcodes Poland address format, PostGrid Poland format, PWN/DobrzePisac orthography of
street-type abbreviations, libpostal / Google libaddressinput conventions, OpenStreetMap
`addr:*` tagging for Poland.

---

## 1. Canonical order (this is the key difference from English)

Polish addresses put the **street TYPE + NAME first, and the house number AFTER the name**:

```
Jan Kowalski                 <- recipient (not part of the address line we parse)
ul. Marszałkowska 1          <- [type] [street name] [building number][/apartment]
00-950 Warszawa              <- [postal code] [city]   (same line, code first)
POLSKA                       <- country (optional, only for international mail)
```

- Line 1 (street line): `type name number` — e.g. `ul. Marszałkowska 1`.
- Line 2 (locality line): `NN-NNN City` — **postal code precedes the city**, on one line.
- Voivodeship (województwo / region) is **NOT written** on a normal postal address line.
- The number ALWAYS trails the name. This is the opposite of US "1 Main St".

Official Poczta Polska example: `Jan Kowalski, ul. Kwiatowa 10/2, 00-001 Warszawa`.

---

## 2. Street types (they LEAD the name, usually abbreviated, lowercase, with a dot)

The generic type word comes **before** the proper name and, per PWN orthography, is written
**lowercase** when abbreviated, with a trailing period. The name that follows is capitalized.

| Full word   | Abbrev.  | English            | Example (as written)          |
|-------------|----------|--------------------|-------------------------------|
| ulica       | `ul.`    | street             | `ul. Piękna 5`                |
| aleja       | `al.`    | avenue             | `al. Jana Pawła II 12`        |
| aleje (pl.) | `al.`    | avenues            | `al. Jerozolimskie 54`        |
| plac        | `pl.`    | square             | `pl. Konstytucji 1`           |
| osiedle     | `os.`    | housing estate     | `os. Tysiąclecia 20`          |
| rondo       | `rondo`  | roundabout         | `rondo Daszyńskiego 1`        |
| skwer       | `skwer`  | small square       | `skwer Kahla 3`               |
| bulwar      | `bulw.`  | boulevard          | `bulw. Nadmorski 2`           |
| park        | `park`   | park               | (rarely an address line)      |
| droga       | `dr.`    | road               | `dr. Męczenników Majdanka 8`  |

Notes / pitfalls:
- `ul.` is by far the most common and is very frequently **omitted** in casual writing:
  `Marszałkowska 1, 00-950 Warszawa` is the same address. A parser must accept a missing type.
- `al.` / `Al.` and `ul.` / `Ul.` appear in both cases; the dot is standard but sometimes dropped
  (`ul`, `al`). Treat case-insensitively and dot-optionally.
- `rondo`, `skwer`, `park` are usually written **in full** (no standard one/two-letter abbrev).
- `os.` (osiedle) addresses often have **no street name at all** — the estate name plus a block
  number: `os. Tysiąclecia 20/34` (block 20, flat 34). Some estates use bare block numbers.

---

## 3. House / building number and apartment (the split that trips parsers)

The building number can carry a **letter suffix** and/or an **apartment (lokal/mieszkanie)** part.

Forms seen:

| Written form   | Building # | Suffix | Apartment # | Meaning                                   |
|----------------|-----------|--------|-------------|-------------------------------------------|
| `1`            | `1`       | —      | —           | building 1                                |
| `12A`          | `12`      | `A`    | —           | building 12A (letter is part of civic no.)|
| `12/5`         | `12`      | —      | `5`         | building 12, **apartment 5** (slash form) |
| `12 m. 5`      | `12`      | —      | `5`         | building 12, apartment 5 (`m.`=mieszkanie)|
| `12 m 5`       | `12`      | —      | `5`         | same, dot dropped                         |
| `12 lok. 5`    | `12`      | —      | `5`         | building 12, apartment 5 (`lok.`=lokal)   |
| `12A/5`        | `12`      | `A`    | `5`         | building 12A, apartment 5                 |
| `12A m. 5`     | `12`      | `A`    | `5`         | building 12A, apartment 5                 |
| `12/14/5`      | `12/14`   | —      | `5`         | dual building number 12/14, apartment 5 (ambiguous!) |

Key rules for the parser:
- **The slash `/` separates building from apartment**: in `12/5` the `12` is the building
  (`numer domu`) and `5` is the apartment (`numer lokalu` = secondary unit). This is the single
  most important Polish-specific split. The slash form is the most universal (Poczta Polska).
- `m.` (mieszkanie) and `lok.` (lokal) both introduce an apartment number and map to the same
  secondary-unit concept. `m.` is the most common longhand.
- A **trailing letter with no separator** (`12A`) is a civic-number **suffix**, NOT an apartment.
  Distinguish `12A` (suffix A) from `12/5` (apartment 5) from `12A/5` (suffix A + apartment 5).
- Ambiguity: a bare `12/14` can be a **corner/dual building number** (two adjacent buildings)
  rather than building-12-apartment-14. Heuristic: two "large-ish" numbers on a main street may be
  a dual civic number; a small second number is usually an apartment. There is no perfectly safe
  rule — default to building/apartment (`12` / `14`) unless context says otherwise, and flag it.

---

## 4. Postal code (kod pocztowy) — PNA

- Format: **`NN-NNN`** — two digits, a hyphen, three digits. Regex: `\d{2}-\d{3}`.
- The hyphen is mandatory and there are **no spaces** inside the code (`00-950`, not `00 950`).
- It **precedes the city** on the same line: `00-950 Warszawa`.
- The first digit roughly encodes the region (0 = Warszawa/Mazovia, 1 = NE, 2 = E/Lublin,
  3 = Kraków/S, 4 = Silesia, 5 = Wrocław/SW, 6 = Poznań/W, 7 = Szczecin/NW, 8 = Gdańsk/N,
  9 = Łódź). Useful as a sanity check against the city.
- Normalization: if a parser sees 5 bare digits `00950`, reformat to `00-950`.

---

## 5. City (miejscowość)

- Written after the postal code. On formal/international envelopes the city is often UPPERCASE
  (`00-950 WARSZAWA`) but mixed case is fine for parsing.
- City names carry diacritics and can be multi-word/hyphenated:
  `Bielsko-Biała`, `Gorzów Wielkopolski`, `Ostrów Wielkopolski`, `Nowy Sącz`, `Jastrzębie-Zdrój`,
  `Zielona Góra`, `Ruda Śląska`, `Dąbrowa Górnicza`, `Stalowa Wola`.
- The "poczta" (post office town) on some forms can differ from the residence town for small
  villages; for a parser treat the token after the postal code as the city.

---

## 6. Polish diacritics

Full set that appears in street/city names: **ą ć ę ł ń ó ś ź ż** (and uppercase
Ą Ć Ę Ł Ń Ó Ś Ź Ż). A parser must:
- Preserve them in output (don't strip to ASCII in the canonical form).
- Match case-insensitively AND diacritic-insensitively for lookups (`Łódź` ≈ `Lodz`), because
  users routinely type ASCII fallbacks (`ul. Zolkiewskiego` for `Żółkiewskiego`).
- Beware `ł` (Latin small letter l with stroke) vs `l`, and `ó` vs `o` — common ASCII substitutions.

---

## 7. Secondary units (apartment) summary

- Introducers: `/` (slash), `m.` / `m` (mieszkanie), `lok.` / `lok` (lokal). Rare: `nr` in some
  contexts but `nr` usually just labels the building number.
- All map to a single `sec_unit` (apartment) field. Normalize `m.` and `lok.` to a canonical
  apartment marker; the slash form is the most common and the recommended canonical output.

---

## 8. Region / country

- **Województwo (region) is normally omitted** from the address line. Don't require it; if present
  (e.g. on official records) it's a separate field, never on the street or locality line.
- Country variants to accept and normalize to ISO `PL`: `Polska` (native), `Poland` (English),
  `PL`, occasionally `POLSKA` / `POLAND` uppercase. Country appears only on international mail.

---

## 9. Prior work / references

- **libpostal**: statistical parser; labels Polish `ul./al./pl.` as part of `road`, splits
  `house_number`, and treats `m.`/slashed apartment as `unit`. Good at abbreviations, weaker on
  the dual-civic-number `12/14` ambiguity.
- **Google libaddressinput**: Poland format string is roughly
  `%O%n%N%n%A%n%Z %C` (Organization, Name, Address lines, `Zip City`) — confirms **zip precedes
  city** and no region field. Required fields: address, zip, city.
- **OpenStreetMap**: uses `addr:street` (full name incl. type sometimes, sometimes just the name),
  `addr:housenumber` (often stores the whole `12/5`!), `addr:postcode` (`NN-NNN`), `addr:city`.
  Note OSM frequently packs building AND apartment into `addr:housenumber` — a source of dirty data.
- **Poczta Polska PNA**: authority on the `NN-NNN` code and the recipient/street/zip-city ordering.

---

## 10. Concrete failure modes (test these)

1. **`ul.` abbreviation / prefix handling** — `ul.`, `Ul.`, `ul` (no dot), and fully spelled
   `ulica` must all be recognized as the street type and stripped from the name.
2. **`12/5` building-vs-apartment split** — must yield building `12`, apartment `5`, NOT a street
   named "12/5" or a house number "12/5". The slash is a unit separator.
3. **`m. 5` / `lok. 5` apartment** — `ul. Nowy Świat 12 m. 5` → building `12`, apartment `5`.
   Also `m` and `lok` without dots.
4. **Letter suffix `12A` vs apartment** — `12A` is a civic suffix (building `12`, suffix `A`),
   distinct from `12/5`. And `12A/5` combines both.
5. **Diacritics** — `Żółkiewskiego`, `Świętokrzyska`, `Łąkowa`, `Kraków`, `Łódź`, `Gdańsk`;
   plus ASCII fallbacks users type (`Swietokrzyska`, `Lodz`).
6. **Multi-word names** — `aleja Jana Pawła II` (name = `Jana Pawła II`, incl. Roman numeral `II`),
   `Marii Skłodowskiej-Curie`, `Bohaterów Getta`. The Roman numeral is part of the name, not a
   house number.
7. **Numbered street names** — `3 Maja`, `1 Maja`, `11 Listopada`, `29 Listopada`. The leading
   number is part of the NAME; the house number is the trailing number:
   `ul. 3 Maja 5` → street `3 Maja`, number `5`. Don't mistake `3` for the house number.
8. **`plac Konstytucji 3 Maja` type of trap** — street name itself ends in a number-word:
   `pl. Konstytucji 3 Maja 1` → street `Konstytucji 3 Maja`, number `1` (the final `1`).
9. **Missing `ul.` prefix** — `Marszałkowska 1, 00-950 Warszawa` with no type word at all.
10. **Postal `NN-NNN` format** — accept `00-950`; reformat bare `00950`; reject/repair `00 950`.
    Don't confuse the zip's digits with a house number.
11. **Postal code precedes city** — must not read `00-950` as a house number nor `Warszawa` as
    part of the street; the `NN-NNN City` block is the locality line.
12. **`os.` estate with no street name** — `os. Tysiąclecia 20/34`: type `os.`, "name"
    `Tysiąclecia`, building `20`, apartment `34`. Sometimes bare block numbers.
13. **Dual civic number `12/14`** — ambiguous between building-12-apt-14 and a corner dual number;
    flag rather than silently mis-split.
14. **Comma-joined single line** — `ul. Piękna 5/10, 00-001 Warszawa` all on one line; split on the
    comma into street line vs locality line.
15. **Country variants** — trailing `Polska` / `Poland` / `PL` must be stripped to country `PL`.
