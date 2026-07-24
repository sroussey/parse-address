# Croatian (HR) Street-Address Research

Research for a config-driven address parser. Sources: Hrvatska pošta addressing
practice; UPU S42 "Croatia"; Google libaddressinput (`HR`, `%A%n%Z %C`, postal
regex `\d{5}`); PostGrid
(https://www.postgrid.com/global-address-format/croatia-address-format/); Smarty
(https://www.smarty.com/global-address-formatting/croatia-address-format-examples);
GeoPostcodes Croatia address-format guide; Wikipedia street articles (Šubićeva
Street, Tkalčićeva Street, European Avenue / Europska avenija, Marin Držić
Avenue); OpenStreetMap `talk-hr`.

---

## 1. Canonical order

Croatian writes the **street first, then the house number**, and the **postcode
BEFORE the city**:

```
<Street> <No.>[letter]
[HR-]<PPPPP> <City>
[Hrvatska]
```

Single-line: `Ilica 5, 10000 Zagreb`, `Ulica kralja Tomislava 12, 10000 Zagreb`,
`Ksaverska cesta 2f, 10000 Zagreb`.

Key facts:
- **Number after the street.**
- **5-digit postcode precedes the city**, no separator between code and city
  (PostGrid, Smarty, GeoPostcodes; Google libaddressinput `%Z %C`).
- An international **`HR-` prefix** may lead the postcode (`HR-21000 Split`).
- No county (**županija**) line in postal addresses.

## 2. Street "types"

The generic word can **lead** or **trail** the name, or be absent:

| Word | English | Position seen |
|------|---------|---------------|
| Ulica (Ul.) | street | leading `Ulica kralja Tomislava`, trailing `Vukovarska ulica` |
| Trg | square | leading `Trg bana Jelačića` |
| Avenija | avenue | leading `Avenija Dubrovnik`, trailing `Slavonska avenija` |
| Cesta | road | trailing `Nova cesta`, `Ksaverska cesta` |
| Aleja | alley | leading `Aleja Bologne` |
| Put | road/way | leading `Put Firula` |
| Obala | quay | leading `Obala kneza Branimira` |
| Poljana | (small) square | leading `Poljana kraljice Jelene` |
| Prolaz | passage | leading `Prolaz sestara Baković` |
| Šetalište | promenade | leading `Šetalište Ivana Meštrovića` |

**Parser choice:** only a **leading** generic is extracted into `type`
(Ulica/Trg/Avenija/Aleja/Put/Obala/Poljana/Prolaz/Šetalište). A **trailing**
generic (`Vukovarska ulica`, `Nova cesta`, `Slavonska avenija`) is not a leading
word, so the whole label stays in `street` with `type` null — the same
convention the Czech config uses. Many names are fully type-less (`Ilica`,
`Korzo`, `Stradun`, `Zrinjevac`).

## 3. House number

- Digits plus an optional **single lowercase letter** suffix: `31a`, `2f`, `1a`.
  Letter → `civic_number_suffix`.
- **`bb`** = *bez broja* ("without number") for plots with no assigned number
  (`Nova cesta bb`). Not modelled (no numeric house number) → `__skip`.

## 4. Postcode & the HR- prefix

- Regex `\d{5}`; first digit(s) = region (Zagreb `10000`, Split `21000`, Rijeka
  `51000`, Osijek `31000`, Zadar `23000`, Dubrovnik `20000`).
- Optional **`HR-`** prefix. It is captured into a `drop` group rather than
  simply skipped: when the postcode-boundary trims off the digits, the stranded
  `HR-` would otherwise be scored as a lost street token (the shared
  `NUMBER_MARKERS` only strips a `XX-` prefix when 4 digits still follow it).

## 5. Diacritics

Croatian letters in names/cities: **č ć đ š ž** (and caps). Preserve:
`Šubićeva`, `Tkalčićeva`, `Draškovićeva`, `Meštrovića`, `Jelačića`, `Vukovara`.

## 6. Region / units / PO box

- **No županija** in the address line → no `state`.
- Secondary units (apartment `stan`) are rarely written in postal addresses;
  not modelled here.
- PO box: **p.p.** (poštanski pretinac) — rare; not modelled.
- Country spellings → `HR`: **Hrvatska**, **Croatia**, **HRV**, **HR**.

## 7. Failure modes to test (>=8)

1. **Type-less name** — `Ilica 5`: whole thing is the street, `type` null.
2. **Leading Ulica/Trg/Avenija** — `Ulica kralja Tomislava 12` → type `Ulica`,
   street `kralja Tomislava`.
3. **Trailing ulica/cesta/avenija** — `Vukovarska ulica 3`, `Nova cesta 145`:
   generic stays in the name, `type` null (not extracted).
4. **Letter suffix** — `31a`, `2f` → `civic_number_suffix`.
5. **`HR-` prefix** — `Marmontova 1, HR-21000 Split`: prefix consumed, postcode
   `21000`, no token loss.
6. **5-digit postcode before city** — `10000 Zagreb` parsed as code+city.
7. **Diacritics** — `Šubićeva ulica`, `Tkalčićeva ulica` round-trip.
8. **Roman numeral in name** — `Trg Petra Krešimira IV 5`.
9. **`bb` (bez broja)** — `Nova cesta bb` — `__skip` (no house number).
10. **Multi-word city** — Nova Gorica-style two-word localities (in SI); for HR,
    single-word routing cities dominate (`Zagreb`, `Split`, `Rijeka`).
11. **Place-first ordering** (`HR-21000 Split, Marmontova 1`) — `__skip`.
12. **Country variants** — Hrvatska / Croatia / HR → `HR`.
