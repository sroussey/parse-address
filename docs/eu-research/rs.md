# Serbian (RS) Street-Address Research — LATIN script

Research for a config-driven address parser. Sources: Google libaddressinput
(`RS`, format `%N%n%O%n%A%n%Z %C`, postal regex `\d{5}`); Smarty global address
formatting — Serbia
(https://www.smarty.com/global-address-formatting/serbia-format-examples);
PostGrid Serbia address format
(https://www.postgrid.com/global-address-format/serbia-address-format/);
GeoPostcodes Serbia address-format guide
(https://www.geopostcodes.com/country/serbia/address-format/); Umbrex "How to
address an international letter to Serbia"; Pošta Srbije addressing practice;
Wikipedia (Knez Mihailova Street, Bulevar kralja Aleksandra). Modelled against
the repo's HR/CZ conventions.

---

## 1. Script note (primary failure mode)

Serbian is **digraphic** — written in both **Cyrillic** (`Улица Делиградска 2`)
and **Latin** (`Ulica Deligradska 2`). Both are official. This config models the
**Latin** form only (as instructed). **Cyrillic input is a documented failure
mode**: the type vocabulary and the `[^,\d]` name classes are Latin, so a
Cyrillic `улица` is never extracted into `type`, and the Cyrillic name/city are
returned verbatim (not matching Latin ground truth). See §7.

## 2. Canonical order

Street first, house number after; **5-digit postcode BEFORE the city**:

```
<[Type] Name> <No.>[letter]
[RS-]<PPPPP> <City>
[Srbija]
```

Single-line: `Ulica Deligradska 2, 11000 Beograd`,
`Bulevar kralja Aleksandra 73, 11000 Beograd`, `Njegoševa 5, 11000 Beograd`.

- Number after the street; **5-digit postcode precedes the city**, no comma
  (libaddressinput `%Z %C`; Smarty; PostGrid — "postal code goes first followed
  by the city").
- Optional international **`RS-`** prefix (dropped, see §4).
- No okrug (district) line in postal addresses → no `state`.

## 3. Street "types"

Generic word can **lead** or **trail**:

| Word | English | Position |
|------|---------|----------|
| Ulica (Ul.) | street | leading `Ulica Deligradska`, trailing `Njegoševa ulica` |
| Bulevar (Bul.) | boulevard | leading `Bulevar kralja Aleksandra` |
| Trg | square | leading `Trg republike`, trailing `Studentski trg` |
| Obala | quay | leading `Obala …` |
| Put | road | leading |
| Aleja | alley | leading |
| Šetalište | promenade | leading |
| Venac | crescent | **almost always trailing** (`Obilićev venac`) |

**Parser choice (HR/CZ convention):** only a **leading** generic is extracted
into `type`. A **trailing** generic (`Njegoševa ulica`, `Studentski trg`,
`Obilićev venac`) is not a leading word, so it stays inside the name with `type`
null. `Venac`/`Kej` are intentionally **excluded** from the `types` list because
they overwhelmingly trail — listing them would wrongly pull the house number into
the name. Many names are fully type-less (`Terazije`, `Nemanjina`, `Knez
Mihailova`).

## 4. House number & postcode

- Digits + optional **single letter** (`48C`, `1a`) → `civic_number_suffix`.
- Dual **building/apartment** numbers exist (`10/3`) — not modelled → `__skip`.
- Postcode `\d{5}` (Pošta Srbije). Optional **`RS-`** prefix sunk into a `drop`
  group so a boundary trim never scores the stranded `RS-` as a lost token
  (identical mechanism to HR's `HR-`).

## 5. Diacritics

Serbian-Latin letters: **č ć đ š ž** (and digraphs dž, lj, nj). Preserve:
`Đinđića`, `Šabac`, `Niš`, `Pašića`, `oslobođenja`, `Karađorđeva`.

## 6. Region / units / PO box

- **No okrug/opština** line in the routing address → no `state`. (The Belgrade
  municipality form `..., Savski Venac, Beograd 11000` puts the postcode after
  the city and is not modelled — §7.)
- Secondary units rarely written; not modelled.
- PO box: **poštanski fah / p. fah** — rare; not in `poBoxNames`.
- Country spellings → `RS`: **Srbija**, **Serbia**, **SRB**, **RS**.

## 7. Failure modes to test (>=8)

1. **Cyrillic input** — `Улица Делиградска 2, 11000 Београд`: type not extracted
   (Latin-only vocab), name/city returned in Cyrillic → `__skip` (primary mode).
2. **Leading Ulica/Bulevar/Trg** — extracted into `type`. (PASS)
3. **Trailing ulica/trg** — `Njegoševa ulica`, `Studentski trg`: kept whole,
   `type` null. (PASS)
4. **Trailing `venac`** — `Obilićev venac 18`: kept whole (not in `types`). (PASS)
5. **Type-less name** — `Terazije 3`, `Nemanjina 11`. (PASS)
6. **Uppercase letter suffix** — `Prote Smiljanića 48C`. (PASS)
7. **`RS-` prefix** — consumed, no token loss. (PASS)
8. **Two-word city** — `11070 Novi Beograd`, `21205 Sremski Karlovci`. (PASS)
9. **Roman numeral in name** — `Kralja Petra I 5`. (PASS)
10. **Country variants** — Srbija / Serbia / SRB → `RS`. (PASS)
11. **Belgrade municipality form** — `..., Savski Venac, Beograd 11000`
    (postcode after city) → `__skip`.
12. **Dual number** — `Njegoševa 10/3` (building/apartment) → `__skip`.
13. **`bb` (bez broja)** — `Bulevar oslobođenja bb` — no house number → `__skip`.
