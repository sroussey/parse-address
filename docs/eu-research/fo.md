# Faroe Islands (FO) Street-Address Research

Config-driven address parser research. The Faroes are a self-governing Danish
territory and use the **Danish postal grammar** with Faroese street generics, so
the parser mirrors the DK config (street-first, fused type) with a 3-digit
FO postcode.

Sources: UPU S42 "Faroe Islands (Denmark)" template
(https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/froEn.pdf
 → `Óðinshædd 2` / `FO-100 Tórshavn`); Posta / www.post.fo; Wikipedia "Postal
codes in the Faroe Islands" (FO + 3 digits); Smarty
(https://www.smarty.com/global-address-formatting/faroe-islands-address-format-examples);
geohints street-suffix reference (gøta, vegur, brekka); OpenStreetMap Tórshavn/
Klaksvík street data.

---

## 1. Canonical order

**Street name FIRST, house number AFTER; postcode BEFORE the city:**

```
<Street> <No.>[, floor/side]
FO-<3 digits> <Locality>
[Føroyar]
```

Single-line: `Niels Finsens gøta 17, FO-100 Tórshavn` or (UPU) `Óðinshædd 2,
FO-100 Tórshavn`.

- **Number after the street.** No leading house number.
- The **postcode precedes the locality** (Danish convention). No postcode-last
  form; a city-first line is `__skip`.
- **No region/state.**

## 2. Street types (fused generic)

Faroese generics are either **glued** into one word (`Reynagøta` → `Reyna` +
`gøta`) or written as a **separate lowercase word** (`Niels Finsens gøta`). The
config peels the generic like DK (`typePlacement:"fused"`, `splitSpacedType`,
`spacedTypeExact`, `minFusedStem:2`).

| Generic | English | Notes |
|---------|---------|-------|
| gøta | street | most common; fused or spaced |
| vegur | road | fused (`Hoyvíksvegur` → `Hoyvíks` + `vegur`) |
| brekka | slope | appears only in preposition/definite/plural forms in real streets (`Millum Brekkur`), so it is in the vocabulary but is not peeled off those; kept whole |

Many Faroese "streets" are **preposition/description names with no generic**
(`Yviri við Strond`, `Undir Bryggjubakka`, `Gongin`, `Vaglið`, `Óðinshædd`) —
these stay whole (no `type`). Preposition-led names are safe because the fused
splitter only matches the productive suffixes above.

## 3. House number

- `number` = a plain integer; optional glued **letter suffix** (`14A`) →
  `civic_number_suffix`; a **range tail** (`10-12`) → `civic_number_suffix`
  (`-12`), mirroring DK.

## 4. Postal code

- **"FO-" + three digits** (`FO-100`, `FO-700`, `FO-800`). Domestic mail often
  drops the prefix (`100 Tórshavn`); both parse.
- The **"FO-" prefix** is captured into a `(?<drop>...)` group — consumed, not
  emitted, and exempt from token preservation (the shared `NUMBER_MARKERS`
  `[a-z]{1,2}-` rule only covers 4-digit codes, so the drop group is required
  here for the 3-digit FO code).
- `postal_code` is emitted as the **3 digits** (`100`).
- Ranges (illustrative): 100/110 Tórshavn, 160 Argir, 188 Hoyvík, 210 Sandur,
  350 Vestmanna, 380 Sørvágur, 700/710 Klaksvík, 800 Tvøroyri, 900 Vágur.

## 5. Secondary unit / PO box

- A Danish-style **floor + side** unit (`3. tv`, `st. th`, `1. sal`) can appear
  but is rare in Faroese practice; modelled via the DK `secUnitPattern`
  (`defaultSecUnitType:"sal"`) but left `__skip` in the samples (not asserted).
- **PO box**: `Postboks` (also `Postrúm`) + number, replacing the street
  (`Postboks 88, FO-110 Tórshavn`). Emitted as `sec_unit_type:"Postboks"`.

## 6. Diacritics & country

- Faroese letters **á í ó ú ý æ ø ð** must survive: `Tórshavn`, `Sørvágur`,
  `Miðvágur`, `Fuglafjørður`, `Klaksvík`, `Óðinshædd`, `Bøgøta`.
- Country spellings → `FO`: **Føroyar**, **Faroe Islands**, **FRO**, **FO**.

## 7. Failure modes to test (>=8)

1. **Fused `-gøta`** — `Tórsgøta 5` → `Tórs` + `gøta`; `Bøgøta` (2-char stem).
2. **Spaced generic** — `Niels Finsens gøta 17` → `Niels Finsens` + `gøta`
   (last word must equal a generic).
3. **Fused `-vegur`** — `Hoyvíksvegur 51` → `Hoyvíks` + `vegur`.
4. **Name with initials/dots** — `R.C. Effersøes gøta`, `Dr. Jakobsens gøta`.
5. **Preposition/description name, no generic** — `Yviri við Strond`,
   `Undir Bryggjubakka`, `Gongin`, `Óðinshædd` stay whole.
6. **"FO-" postcode prefix** — dropped, `postal_code=100`, not a lost token.
7. **Bare 3-digit postcode** — `100 Tórshavn` (domestic, no prefix).
8. **Letter suffix / range** — `14A`; `10-12` → `civic_number_suffix`.
9. **Postcode-before-city** — `FO-100 Tórshavn` parsed as postcode then city.
10. **PO box** — `Postboks 88` → `sec_unit_type` Postboks.
11. **Country variants** — Føroyar / Faroe Islands / FRO all → `FO`.
12. **Diacritics** round-trip — `Sørvágur`, `Miðvágur`, `Fuglafjørður`.
13. **Floor+side unit** — `3. tv` — `__skip` (rare, not asserted).
14. **Village name == generic** — `Gøta` (city) vs `gøta` (generic) — `__skip`
    (city boundary is ambiguous).
15. **City-first ordering** — `Tórshavn, FO-100` — `__skip`.
16. **`brekka` only in bound forms** — `Millum Brekkur` stays whole.
