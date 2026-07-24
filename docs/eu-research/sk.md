# Slovak (SK) Street-Address Research

Research for a config-driven address parser. Sources: Slovenská pošta addressing
practice; UPU S42 "Slovakia" (https://youbianku.com/files/upu/SVK.pdf); Google
libaddressinput (`SK`, `%A%n%Z %C`, postal regex `\d{3} ?\d{2}`); PostGrid
(https://www.postgrid.com/global-address-format/slovakia-address-format/); Smarty
(https://www.smarty.com/global-address-formatting/slovakia-address-format-examples);
Informatica address-verification best-practices for Slovakia; register
"Register adries" (súpisné/orientačné číslo); OpenStreetMap `talk-sk`.

---

## 1. Canonical order

Slovak mirrors Czech: **street name first, house number after**, **postcode
`NNN NN` before the city**:

```
<Street> <No.>            e.g.  Obchodná 12   /   Hlavná 1200/25
<PSC NNN NN> <Mesto>      e.g.  811 06 Bratislava
[Slovensko]
```

Single-line: `Obchodná 12, 811 06 Bratislava`.

Key facts:
- **Number after the street.**
- **Postcode (PSČ) precedes the city**, written `NNN NN` (3 + space + 2);
  frequently typed unspaced (`81106`) — the parser accepts both and normalises
  to the spaced form.
- Most street names carry **no type word** (`Obchodná`, `Hlavná`, `Michalská`).

## 2. House numbers — súpisné / orientačné

Like Czech, a building can carry **two** numbers written `súpisné/orientačné`
(registration number `/` orientation number), e.g. `Obchodná 4015/12`:
- `4015` = **súpisné** (permanent registration number) → `civic_number_suffix`;
- `12` = **orientačné** (sequential street-navigation number) → `number`.

The orientation part may carry a letter (`2340/8a` → `number=8a`). A **single**
number goes to `number` with no suffix. (Rationale matches the CZ config:
`number` is the navigation number; the súpisné is retained in the suffix so
nothing is lost and `{suffix}/{number}` reconstructs the original.)

## 3. Street "types" (when present)

| Full | Abbrev | English | Position |
|------|--------|---------|----------|
| Námestie | nám. | square | leading `Námestie SNP`; trailing `Hlavné námestie` |
| trieda | tr. | avenue | leading `trieda SNP` |
| Nábrežie | nábr. | embankment | leading `Nábrežie … Svobodu` |

Only a **leading** `Námestie`/`nám.`/`trieda`/`tr.`/`Nábrežie` is extracted into
`type`. A **trailing** one (`Hlavné námestie`, `Mariánske námestie`) stays in the
name with `type` null — same as CZ. Spelling kept verbatim
(`normalizeTypeCase:false`).

## 4. Postcode & city

- **`NNN NN`**, 3 digits + space + 2 (`811 06`, `040 01`). Accepts unspaced
  `81106`; normalised to spaced. Regex `\d{3}\s?\d{2}`.
- Bratislava and Košice postal boroughs append a **number to the city**
  (`Bratislava 1`, `Košice 1`) — kept with the city (`cityAllowsDigits:true`).

## 5. Diacritics

Slovak letters: **á ä č ď é í ĺ ľ ň ó ô ŕ š ť ú ý ž** and `Ô`. Preserve:
`Štúrova`, `Grösslingová`, `Ľudovíta Štúra`, `Žilina`, `Košice`, `Prešov`,
`Račianska`.

## 6. Region / units / PO box

- **No kraj (region)** in the address line → no `state`.
- Secondary units rarely written; not modelled.
- PO box: **P. O. Box** / **priečinok** — rare; not modelled.
- Country spellings → `SK`: **Slovensko**, **Slovenská republika**, **Slovakia**,
  **SVK**, **SK**.

## 7. Failure modes to test (>=8)

1. **Type-less name** — `Obchodná 12`: whole thing is street, `type` null.
2. **Dual súpisné/orientačné** — `Obchodná 4015/12`: `4015`→suffix, `12`→number.
3. **Orientation letter** — `2340/8a` → `number=8a`.
4. **Leading `Námestie`/`nám.`** — `Námestie SNP 25` / `Nám. SNP 15` → type
   `Námestie`/`Nám.`, street `SNP`.
5. **Trailing `námestie`** — `Hlavné námestie 5`: kept in name, `type` null.
6. **Leading `trieda`/`tr.`** — `trieda SNP 45`, `tr. Andreja Hlinku 30`.
7. **PSČ spaced vs unspaced** — `811 06` and `81106` both → `811 06`.
8. **Date/ordinal street names** — `29. augusta 15`, `1. mája 8`: leading token
   is part of the name, house number trails.
9. **Postal-borough city number** — `Košice 1`, `Bratislava 1` kept with city.
10. **Diacritics** — `Štúrova`, `Grösslingová`, `Ľudovíta Štúra` round-trip.
11. **Country variants** — Slovensko / Slovakia / SK → `SK`.
12. **Postcode-last / district-line variants** — `__skip` (config models
    postcode-before-city, no mestská-časť line between street and postcode).
