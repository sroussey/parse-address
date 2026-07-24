# Montenegrin (ME) Street-Address Research — LATIN script

Research for a config-driven address parser. Sources: Google libaddressinput
(`ME`, format `%N%n%O%n%A%n%Z %C`, postal regex `\d{5}`); Smarty global address
formatting — Montenegro
(https://www.smarty.com/global-address-formatting/montenegro-address-format-examples);
PostGrid Montenegro address format
(https://www.postgrid.com/global-address-format/montenegro/); **UPU addressing
PDF** for Montenegro
(https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/mneEn.pdf);
Umbrex "How to address an international letter to Montenegro"; Pošta Crne Gore
addressing practice. Modelled against the repo's HR/CZ conventions.

---

## 1. Canonical order

Street first, house number after; **5-digit postcode BEFORE the city**, and
**no state/region** in the address:

```
<[Type] Name> <No.>[letter]
[ME-]<PPPPP> <City>
[Crna Gora]
```

Single-line: `Njegoševa 25, 81000 Podgorica`,
`Bulevar Svetog Petra Cetinjskog 130, 81000 Podgorica`,
`Ulica Nedeljka Merdovića 42, 84000 Bijelo Polje`.

- Number after the street; **5-digit postcode precedes the city**, no comma
  (libaddressinput `%Z %C`; PostGrid/Smarty — "five-digit postal code followed
  by the city"; UPU mneEn.pdf).
- Optional international **`ME-`** prefix (dropped, see §4).
- **No region line and no `state`** (task-specified) — Montenegro is small and
  postal addresses carry no district/opština in the routing line.

## 2. Script note (a failure mode)

Montenegro officially uses **both Latin and Cyrillic**; Latin predominates in
practice. This config models **Latin** only; **Cyrillic input is a documented
failure mode** (`Његошева 25` — type not extracted, name/city verbatim). See §7.

## 3. Street "types"

Same BCMS vocabulary as RS/BA; generic can lead or trail.

| Word | English | Position |
|------|---------|----------|
| Ulica (Ul.) | street | leading `Ulica Slobode`, trailing `Njegoševa ulica` |
| Bulevar | boulevard | leading `Bulevar Svetog Petra Cetinjskog` |
| Trg | square | leading `Trg republike` |
| Obala | quay | leading; trailing `Slovenska obala` (kept whole) |
| Put | road | leading |
| Aleja | alley | leading |
| Šetalište | promenade | leading `Šetalište Pet Danica` (Herceg Novi) |

**Parser choice (HR/CZ convention):** only a **leading** generic → `type`.
Trailing generics (`Njegoševa ulica`, `Slovenska obala`) stay whole with `type`
null. Type-less names dominate (`Njegoševa`, `Slobode`, `Hercegovačka`).

## 4. House number & postcode

- Digits + optional **single letter** (`8a`) → `civic_number_suffix`.
- Postcode `\d{5}` (Podgorica `81000`, Nikšić `81400`, Cetinje `81250`, Bijelo
  Polje `84000`, Berane `84300`, Pljevlja `84210`, Bar `85000`, Budva `85310`,
  Tivat `85320`, Kotor `85330`, Herceg Novi `85340`). Optional **`ME-`** prefix
  captured into a `drop` group (HR `HR-` mechanism).
- Several two-word cities (`Bijelo Polje`, `Herceg Novi`) — the city class is
  permissive (`[^,\d]+`), so they survive.

## 5. Diacritics

Montenegrin-Latin letters: **č ć đ š ž** (plus **ś ź** in the extended
orthography, rare in street names). Preserve: `Đurovića`, `Nikšić`, `Raičkovića`,
`Njegoševa`, `Đorđa`.

## 6. Region / units / PO box

- **No `state`** at all (task-specified).
- Secondary units rarely written; not modelled.
- PO box: **poštanski fah / p. fah** — not in `poBoxNames`; `__skip`.
- Country spellings → `ME`: **Crna Gora**, **Montenegro**, **MNE**, **ME**.

## 7. Failure modes to test (>=8)

1. **Leading Ulica/Bulevar/Trg/Šetalište** — extracted into `type`. (PASS)
2. **Trailing ulica/obala** — `Njegoševa ulica`, `Slovenska obala`: kept whole,
   `type` null. (PASS)
3. **Type-less name** — `Njegoševa`, `Slobode`, `Hercegovačka`. (PASS)
4. **Letter suffix** — `8a`. (PASS)
5. **`ME-` prefix** — consumed via `drop`, no token loss. (PASS)
6. **Two-word city** — `84000 Bijelo Polje`, `85340 Herceg Novi`. (PASS)
7. **Diacritics** — `Vaka Đurovića`, `Nikšić`, `Vasa Raičkovića`. (PASS)
8. **No state** — nothing captured into `state` for any sample. (PASS)
9. **Country variants** — Crna Gora / Montenegro / MNE → `ME`. (PASS)
10. **Cyrillic input** — `Његошева 25, 81000 Подгорица` → `__skip`.
11. **Date/ordinal name after leading Trg** — `Trg 21. novembra 1`: the leading
    `21` is captured as the house number by the digit-excluding name class →
    `__skip`.
12. **`bb` (bez broja)** — `Bulevar revolucije bb` — no house number → `__skip`.
13. **PO box (Poštanski fah)** — not modelled → `__skip`.
