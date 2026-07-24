# Israel (IL) Street Address Research

Research for the config-driven EU/Intl address parser. SEC code L3.
Focus: Israel Post (Doar Israel) addressing, the 7-digit mic7 postcode, romanized
Latin filings (which is what this parser mostly ingests), and Hebrew-script forms.

---

## 1. Canonical address order

Israel writes the **house NUMBER first, then the street name** — the same
number-first order as GB/US and the opposite of continental Europe:

```
3 Ben Yehuda
49 Ibn Gabirol
132 Derech Menachem Begin
```

Israel Post's official *multi-line* template is:

```
[Addressee]
[House number] [Street]
[Postal code] [City]
[Country]
```

i.e. on the label the **postcode precedes the city** on its own line
("6100000 Tel Aviv-Yafo"). BUT the overwhelmingly common **single-line /
comma-joined romanized business form** — which is what filings, invoices and
company registries actually contain — writes the **city first, then the
postcode last**:

```
28 HaArba'a Street, Tel Aviv-Yafo, 6473925
132 Derech Menachem Begin, Tel Aviv, 6701101
9 Weizmann Street, Jerusalem, 9195008
```

This parser therefore treats the layout as **after-city** (number-street,
no type, postcode LAST after the city). The postcode-before-city label form is
documented as a failure mode (see §7).

There is **no state / region / district** field in an Israeli address. The
country's administrative districts (mehozot) are never written on mail.

---

## 2. Postcode (mikud / mic7)

- **Modern format: 7 digits** (introduced 2013, "mic7"), e.g. `6100000`,
  `6473925`, `9195008`, `7763224`, `5290002`. No letters, no separator in
  practice, though Israel Post's own spec shows an optional space after the 5th
  digit (`99999 99`). The parser should accept an optional internal space and
  normalise it out.
- **Legacy format: 5 digits** (pre-2013), still seen in older data:
  `63471`, `64361`, `91000`. Both must parse.
- The postcode has **no fixed relationship to a leading zero city prefix** like
  ZA; it is a routing code. Jerusalem codes start `9`, Tel Aviv `6`, Haifa `3`,
  Beersheba `84xxxxx`, etc.
- Position: **last token** in the romanized comma form; on official labels it
  leads the city line. Capture as `(?<postal_code>\d{5}(?:\s?\d{2})?)` — a
  5-digit code or a 7-digit code (5 + optional space + 2).

---

## 3. Street "types"

Israeli streets **usually have NO type word** in romanized form — the street is
just a name + number: `49 Ibn Gabirol`, `3 Ben Yehuda`, `24 Bialik`,
`35 Rothschild`. So `typePlacement` is **`none`**; `type` is normally null.

When a descriptor IS written it is a **Hebrew leading noun that is part of the
name**, romanized variously, and should be kept as part of `street`, not split
off as a type:

| Hebrew | Translit. | Meaning | Example |
|--------|-----------|---------|---------|
| רחוב   | Rehov / Rechov / Rh. | Street | "Rehov Herzl" (usually dropped) |
| שדרות  | Sderot / Sderat / Sd. | Boulevard | "Sderot Rothschild", "Sderot Ben Gurion" |
| דרך    | Derech / Derekh | Road / Way | "Derech Menachem Begin", "Derech Hebron" |
| סמטת   | Simtat | Alley | "Simtat Beit HaSho'eva" |
| כיכר   | Kikar | Square | "Kikar Rabin" |
| מעלה   | Ma'ale | Ascent | "Ma'ale HaShichrur" |

These lead the name (e.g. "Sderot Rothschild 10" in Hebrew order, "10 Sderot
Rothschild" in romanized number-first). Because they are *part of the name and
inconsistently present*, this parser does **not** model them as a separate type
field — the whole "Sderot Rothschild" / "Derech Menachem Begin" stays in
`street`. English "Street"/"Road"/"Boulevard" appended in tourist/business
transliterations ("HaArba'a Street", "Jaffa Road") is likewise folded into the
name in ground truth, though a few samples treat a trailing "Street" as an
optional suffix type to exercise that path.

---

## 4. House-number variants

- Plain integer, number FIRST: `3`, `49`, `132`.
- **Number + letter suffix**: `12A`, `7B` — the letter is a
  `civic_number_suffix` (`12A` -> number `12`, suffix `A`).
- **Ranges**: `24-26`, `1-3` — one number token.
- **Number after the street** in Hebrew-order romanization: "Ibn Gabirol 49" —
  a failure mode for a strict number-first grammar (see §7).
- **Apartment / entrance** after the street: "Dizengoff 50, Apt 4",
  "12 Herzl, Entrance B, Apt 7". These are secondary units (§5).
- **PO Box**: "PO Box 12" / "T.D. 1234" (ת.ד. = tevat doar). No thoroughfare.

---

## 5. Secondary (sub-building) units

Common secondary-unit words (romanized), placed **after** the street/number:
- **Apartment**: `Apartment`, `Apt`, `Apt.`, `Dira` (דירה), `Fl` (flat).
- **Entrance**: `Entrance`, `Entr.`, `Knisa` (כניסה) — often a bare letter
  ("Entrance B").
- **Floor**: `Floor`, `Koma` (קומה).

Forms: `50 Dizengoff, Apt 4`, `12 Herzl, Entrance B, Apt 7`,
`8 Ben Gurion, Floor 3`. `sec_unit_num` may be a bare letter (`Entrance B`).

---

## 6. City / locality

- The token(s) immediately before (romanized) / after (label) the postcode is
  the **city**. Many are multi-word or hyphenated: `Tel Aviv-Yafo`
  (a.k.a. `Tel Aviv-Jaffa`), `Rishon LeZion`, `Petah Tikva`, `Bnei Brak`,
  `Ramat Gan`, `Kiryat Ono`, `Be'er Sheva` (Beersheba), `Kfar Saba`,
  `Ramat HaSharon`, `Or Yehuda`, `Nof HaGalil`.
- Apostrophes/diacritic hints appear: `Be'er Sheva`, `Ra'anana`, `Mod'iin`.
- **No state** — leave `state` null always.
- Country spellings: `Israel`, `ISR`, `IL`, `ישראל`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Israel Post addressing guidelines, UPU S42 IL template
(isrEn.pdf), Smarty / PostGrid / GeoPostcodes IL format guides, Google
libaddressinput (`IL`: `fmt` = `%N%n%O%n%A%n%Z %C`, i.e. street / postcode+city;
**no state**), Wikipedia "Postal codes in Israel".

1. **Postcode-before-city vs after-city.** Official labels write
   `6100000 Tel Aviv-Yafo` (postcode first); romanized business form writes
   `..., Tel Aviv-Yafo, 6100000` (postcode last). A single grammar cannot anchor
   both; this parser targets the after-city romanized form and mis-parses the
   label form (postcode would be read as a house-number-like token before the
   city). Documented, not solved.

2. **7-digit vs 5-digit code.** `6473925` (new) and `64361` (old) both occur;
   a `\d{5}` rule truncates the 7-digit code. Must accept `\d{5}(\s?\d{2})?`.

3. **Optional internal space in the code.** `61000 00` / `6100000` — Israel
   Post's spec allows a space after the 5th digit; normalise it out.

4. **No type word.** `49 Ibn Gabirol` has no Street/Road token; a parser that
   requires a trailing type swallows the city or fails. `type` must be optional.

5. **Descriptor is part of the name.** `10 Sderot Rothschild`,
   `132 Derech Menachem Begin`, `5 Kikar Rabin` — `Sderot`/`Derech`/`Kikar`
   must stay inside `street`, not be split as a type nor mistaken for a unit.

6. **Hebrew-order number-after-street.** Romanizations that keep Hebrew order
   ("Ibn Gabirol 49", "Rothschild 35") put the number LAST, breaking a strict
   number-first anchor. Failure mode.

7. **Multi-word / hyphenated cities.** `Tel Aviv-Yafo`, `Rishon LeZion`,
   `Petah Tikva`, `Bnei Brak` — grabbing one token before the postcode truncates
   the city.

8. **Apostrophes and camel-cased particles.** `Be'er Sheva`, `Ra'anana`,
   `HaArba'a`, `LeZion`, `HaShalom` — the apostrophe and internal capitals must
   not terminate the street/city token.

9. **RTL Hebrew script.** `דיזנגוף 50, תל אביב` — Hebrew reads right-to-left and
   the number sits after the street; the Latin grammar does not handle Hebrew
   script. Failure mode (romanized input assumed).

10. **PO Box / T.D.** `PO Box 12` and `ת.ד. 1234` replace the thoroughfare;
    number-first anchor fails unless a PO-box branch is tried first.

11. **Entrance as a bare letter.** `Entrance B` — `sec_unit_num` is a letter,
    not a digit.

12. **"Street" appended in English.** `28 HaArba'a Street` — the trailing
    "Street" is a transliteration nicety; ground truth folds it into the name in
    most samples (a few treat it as a suffix type to exercise both).

---

## 8. Field-mapping decisions

- `number` — leading integer (or range), optional glued letter suffix. Null for
  PO box / named-only.
- `civic_number_suffix` — trailing letter of the number (`12A` -> `A`).
- `street` — the full street name including any `Sderot`/`Derech`/`Rehov`/
  `Kikar` descriptor. No `type` in the normal case.
- `type` — normally null (typePlacement `none`).
- `sec_unit_type` / `sec_unit_num` — `Apt`/`Entrance`/`Floor` + value.
- `city` — locality before the postcode (multi-word / hyphenated allowed).
- `state` — always null (Israel has no address-level region).
- `postal_code` — 5- or 7-digit, internal space normalised out; LAST.
- `country` — `IL`.

---

## Sources

- Israel Post (Doar Israel) — https://www.israelpost.co.il/
- UPU S42 IL addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/isrEn.pdf
- Smarty IL format examples — https://www.smarty.com/global-address-formatting/israel-format-examples
- PostGrid IL address format — https://www.postgrid.com/global-address-format/israel-address-format/
- GeoPostcodes IL — https://www.geopostcodes.com/country/israel/address-format/
- Informatica AV best practices IL — https://docs.informatica.com/data-as-a-service/address-verification-(cloud)/h2l/1250-address-verification-best-practices-for-israel/
- Wikipedia: Postal codes in Israel — https://en.wikipedia.org/wiki/Postal_codes_in_Israel
- Google libaddressinput (IL metadata) — https://chromium-i18n.appspot.com/ssl-address/data/IL
