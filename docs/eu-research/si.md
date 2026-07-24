# Slovenian (SI) Street-Address Research

Research for a config-driven address parser. Sources: Pošta Slovenije addressing
practice; UPU S42 "Slovenia"; Google libaddressinput (`SI`, `%A%n%Z %C`, postal
regex `\d{4}`); PostGrid
(https://www.postgrid.com/global-address-format/solvenia-address-format/); Smarty
(https://www.smarty.com/global-address-formatting/slovenia-address-format-examples);
GeoPostcodes Slovenia address-format guide; Ling "Slovenian Addresses" vocabulary
(trg / ulica / cesta); OpenStreetMap `talk-si`.

---

## 1. Canonical order

Slovenian writes the **street first, then the house number**, with the
**4-digit postcode BEFORE the city**:

```
<Street> <No.>[letter]
[SI-]<PPPP> <City>
[Slovenija]
```

Single-line: `Slovenska cesta 58, 1000 Ljubljana`, `Čopova 12a, 1000 Ljubljana`.

Key facts:
- **Number after the street.**
- **4-digit postcode precedes the city** (`1000 Ljubljana`, `2000 Maribor`).
  Google libaddressinput `%Z %C`, postal regex `\d{4}`.
- Optional international **`SI-`** prefix (`SI-2000 Maribor`).
- No region/statistical-region line in postal addresses.

## 2. Street "types"

The generic is most often **trailing** and stays part of the name:

| Word | English | Position |
|------|---------|----------|
| cesta | road/drive | trailing `Slovenska cesta`, `Dunajska cesta` (dominant) |
| ulica (ul.) | street | trailing `Trubarjeva ulica`; leading `Ulica talcev` |
| trg | square | trailing `Mestni trg`, `Glavni trg`; leading `Trg republike` |
| pot | path | leading `Pot na Fužine` |
| nabrežje | embankment | often the whole name (`Nabrežje 10`) |

**Parser choice:** only a **leading** `Trg`/`Ulica`/`Cesta`/`Pot` is extracted
into `type` (`Trg republike` → type `Trg`, street `republike`; `Cesta na Brdo`
→ type `Cesta`). The very common **trailing** `cesta`/`ulica`/`trg`
(`Slovenska cesta`, `Trubarjeva ulica`, `Mestni trg`) stays whole in `street`
with `type` null — the CZ convention. `Nabrežje` is deliberately **not** a
prefix type because it usually stands alone as the entire name (`Nabrežje 10`),
where a prefix reading would wrongly swallow the house number.

## 3. House number

- Digits plus an optional **single lowercase letter** (`12a`, `22a`); letter →
  `civic_number_suffix`.
- **`bb`** (*brez številke* / *bez broja*) for un-numbered plots — `__skip`.
- Slovenian does not use the CZ/SK dual súpisné/orientačné pair — a single
  house number is the norm.

## 4. Postcode & the SI- prefix

- Regex `\d{4}`. First digit = delivery region (Ljubljana `1000`, Maribor
  `2000`, Celje `3000`, Kranj `4000`, Nova Gorica `5000`, Koper `6000`, Novo
  mesto `8000`).
- Optional **`SI-`** prefix, captured into a `drop` group (same reason as HR:
  when the postcode boundary trims the digits, a stranded `SI-` would otherwise
  be scored as a lost street token).

## 5. Diacritics

Slovenian letters: **č š ž** (and caps). Preserve: `Čopova`, `Tržaška`,
`Šmartinska`, `Miklošičeva`, `Gregorčičeva`, `Vošnjakova`.

## 6. Region / units / PO box

- **No region** in the address line → no `state`.
- Secondary units rarely written in postal addresses; not modelled.
- PO box: **p. p.** (poštni predal) — rare; not modelled.
- Country spellings → `SI`: **Slovenija**, **Slovenia**, **SVN**, **SI**.

## 7. Failure modes to test (>=8)

1. **Trailing cesta/ulica/trg** — `Slovenska cesta 58`, `Trubarjeva ulica 25`,
   `Mestni trg 1`: generic stays in the name, `type` null.
2. **Leading Trg/Ulica/Cesta/Pot** — `Trg republike 3`, `Ulica talcev 4`,
   `Cesta na Brdo 27`, `Pot na Fužine 2` → generic extracted to `type`.
3. **Prepositional leading-Cesta name** — `Cesta v Mestni log 55`.
4. **Type-less + letter suffix** — `Čopova 12a` → `number=12`, suffix `a`.
5. **`Nabrežje` as a whole name** — `Nabrežje 10` → street `Nabrežje`,
   `number=10` (not a prefix type).
6. **4-digit postcode before city** — `1000 Ljubljana` parsed as code+city.
7. **`SI-` prefix** — `Slovenska cesta 58, SI-1000 Ljubljana`: prefix consumed,
   postcode `1000`, no token loss.
8. **Multi-word cities** — `Novo mesto`, `Nova Gorica` kept whole.
9. **Diacritics** — `Čopova`, `Tržaška`, `Šmartinska` round-trip.
10. **Date/number street name** — `Cesta 24. junija 23` (leading type + numeric
    name, house number trails).
11. **`bb` (no number)** — `Slovenska cesta bb` — `__skip`.
12. **Postcode-last variant** — `__skip` (config models postcode-before-city).
13. **Country variants** — Slovenija / Slovenia / SI → `SI`.
