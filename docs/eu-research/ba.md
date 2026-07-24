# Bosnia and Herzegovina (BA) Street-Address Research — LATIN script

Research for a config-driven address parser. Sources: Google libaddressinput
(`BA`, format `%N%n%O%n%A%n%Z %C`, postal regex `\d{5}`); Smarty global address
formatting — Bosnia and Herzegovina
(https://www.smarty.com/global-address-formatting/bosnia-and-herzegovina-format-examples);
PostGrid Bosnia and Herzegovina address format
(https://www.postgrid.com/global-address-format/bosnia-and-herzegovina-address-format/);
GeoPostcodes B&H address-validation guide; **UPU addressing PDF** for Bosnia and
Herzegovina (https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/bihEn.pdf);
Umbrex "How to address an international letter to Bosnia & Herzegovina";
Wikipedia (Strossmayer Street). Modelled against the repo's HR/CZ conventions.

---

## 1. Script note (a failure mode)

B&H uses **both Latin and Cyrillic** — Latin predominates in the Federation and
Cyrillic appears in Republika Srpska (`Улица Краља Петра`). This config models
**Latin** only; **Cyrillic input is a documented failure mode** (type not
extracted, name/city returned verbatim). See §7.

## 2. Canonical order

Street first, house number after; **5-digit postcode BEFORE the city**:

```
<[Type] Name> <No.>[letter]
[BA-]<PPPPP> <City>
[Bosna i Hercegovina]
```

Single-line: `Zmaja od Bosne 10, 71000 Sarajevo`,
`Ulica Ferhadija 15, 71000 Sarajevo`, `Kralja Petra I Karađorđevića 90, 78000
Banja Luka`.

- Number after the street; **5-digit postcode precedes the city**, no comma
  (libaddressinput `%Z %C`; PostGrid/Smarty — "postal code first, then city";
  UPU bihEn.pdf). "Do not add commas between the postal code and the city name."
- Optional international **`BA-`** prefix (dropped, see §4) — the task's named
  example of a prefix that would otherwise trip token-preservation.
- No entity/canton line (Federation / Republika Srpska / Brčko) → no `state`.

## 3. Street "types"

Generic can **lead** or **trail**; many names are type-less.

| Word | English | Position |
|------|---------|----------|
| Ulica (Ul.) | street | leading `Ulica Ferhadija`, trailing `Titova ulica` |
| Bulevar | boulevard | leading `Bulevar Meše Selimovića` |
| Trg | square | leading `Trg djece Sarajeva` |
| Obala | quay | leading `Obala Kulina bana` |
| Put | road | leading `Put Famosa` |
| Aleja | alley | leading `Aleja Alije Izetbegovića` |
| Šetalište | promenade | leading |

**Parser choice (HR/CZ convention):** only a **leading** generic → `type`. A
**trailing** `ulica` (`Titova ulica`, `Alipašina ulica`) stays whole with `type`
null. Type-less names are very common (`Ferhadija`, `Zmaja od Bosne`,
`Alipašina`).

## 4. House number & postcode

- Digits + optional **single letter** (`10a`, `90b`) → `civic_number_suffix`.
- Dual/entrance numbers occur (`6/6`) — not modelled → `__skip`.
- Postcode `\d{5}`. Optional **`BA-`** prefix captured into a `drop` group so a
  boundary trim never strands the `BA-` as a lost street token (HR `HR-`
  mechanism).

## 5. Diacritics

Bosnian-Latin letters: **č ć đ š ž** (and dž, lj, nj). Preserve: `Šehovića`,
`Bašeskije`, `Kreševljakovića`, `Bijedića`, `Meše`, `Bihać`.

## 6. Region / units / PO box

- **No entity/canton** in the routing address → no `state`. A trailing
  `Federacija BiH` is not a country name and is not modelled (§7).
- Secondary units rarely written; not modelled.
- PO box: **poštanski fah / p. fah / p.p.** — rare; not in `poBoxNames`.
- Country spellings → `BA`: **Bosna i Hercegovina**, **Bosnia and Herzegovina**,
  **Bosnia**, **BIH**, **BA**.

## 7. Failure modes to test (>=8)

1. **Cyrillic input** — `Улица Краља Петра 5, 78000 Бања Лука`: type not
   extracted, name/city verbatim → `__skip`.
2. **Leading Ulica/Bulevar/Trg/Obala/Put/Aleja** — extracted into `type`. (PASS)
3. **Trailing ulica** — `Titova ulica`, `Alipašina ulica`: kept whole. (PASS)
4. **Type-less name** — `Ferhadija`, `Zmaja od Bosne`. (PASS)
5. **Letter suffix** — `10a`, `90b`. (PASS)
6. **`BA-` prefix** — consumed via `drop`, no token loss. (PASS)
7. **Two-word city** — `78000 Banja Luka`. (PASS)
8. **Roman numeral in name** — `Kralja Petra I Karađorđevića`. (PASS)
9. **Diacritics** — `Envera Šehovića`, `Hamdije Kreševljakovića`. (PASS)
10. **Country variants** — Bosna i Hercegovina / BIH → `BA`. (PASS)
11. **Trailing entity line** — `..., Federacija BiH` (not a country) → `__skip`.
12. **Dual/entrance number** — `Semira Frašte 6/6` → `__skip`.
13. **`bb` (bez broja)** — `Ferhadija bb` — no house number → `__skip`.
