# Isle of Man (IM) Street-Address Research

Config-driven address parser research. The Isle of Man is a British Crown
Dependency using the **UK addressing grammar** and Royal Mail postcode system,
so the parser mirrors the GB config with the postcode restricted to the **IM
postcode area**.

Sources: UPU S42 "Isle of Man (United Kingdom)" template
(https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/imnEn.pdf);
Wikipedia "IM postcode area" (IM1–IM9 districts; IM86/IM87/IM99 large-user);
Isle of Man Post Office; PostGrid
(https://www.postgrid.com/global-address-format/isle-of-man-address-format/);
Smarty (https://www.smarty.com/global-address-formatting/isle-of-man-address-format-examples);
Royal Mail PAF; OpenStreetMap Douglas/Ramsey data.

---

## 1. Canonical order

**House number FIRST, then street name + trailing type; postcode LAST:**

```
[Flat/Apartment/Suite N,] <No.> <Street> <Type>
<Post town>
IM<n> <n><AA>
[Isle of Man]
```

Single-line: `1 Bucks Road, Douglas, IM1 3AE`.

- **Number first** (`number-street`), letter suffixes glue on (`2A`), ranges
  stay whole (`10-12`).
- **Type is a trailing suffix** (Road, Street, ...), kept verbatim.
- The **postcode comes last**, after the post town.
- **No region/state** (the island has no counties; parishes are not written in
  the address line).

## 2. Street types (suffix)

Standard English/Royal Mail vocabulary: **Street, Road, Avenue, Lane, Close,
Drive, Court, Place, Gardens, Grove, Crescent, Terrace, Row, Walk, Hill, Rise,
Mews, Green, Gate, Parade, Vale, Croft, Square, Way, Promenade, View, Meadow,
Park** plus abbreviations **St, Rd, Ave, Ln, Cl, Dr, Cres, Gdns, Sq, Pl, Gr**.
`Promenade` is prominent (Douglas seafront). Types echoed verbatim
(`normalizeTypeCase:false`); short codes still derived. `The` + type
(`The Promenade`) folds into a whole name via `articleNames`.

## 3. House number & secondary unit

- `number` = integer or range (`10-12`); optional glued **letter suffix** (`2A`).
- **Secondary unit LEADS** the address (UK style): `Flat 2`, `Apartment 4`,
  `Suite 3`, `Unit 5` (+ `Studio/Maisonette/Penthouse/Room/Floor/Block`),
  captured before the house number.

## 4. Postal code (IM area, LAST)

- UK format restricted to the **IM** area: outward `IM` + 1–2 digits, inward
  digit + 2 letters — `IM1 3AE`, `IM2 5PP`, `IM9 6AH`, and large-user `IM86`,
  `IM87`, `IM99` (`IM99 1XY`).
- `postalPattern` = `IM\d[0-9A-Za-z]?\s*\d[A-Za-z]{2}`; `postalFormat`
  upper-cases and inserts a single space before the 3-char inward code.
- Districts (illustrative): IM1/IM2 Douglas, IM3 Onchan, IM4 Laxey/Crosby/St
  John's, IM5 Peel, IM6 Kirk Michael, IM7/IM8 Ramsey & north, IM9 south
  (Castletown/Port Erin/Port St Mary/Ballasalla).

## 5. PO box / country

- **PO box**: `PO Box` / `P.O. Box` + number (`PO Box 25, Douglas, IM99 1XY`).
- Country spellings → `IM`: **Isle of Man**, **Ellan Vannin**, **IMN**, **IM**.
  Written **after the postcode** (`..., IM1 3AE, Isle of Man`) it is consumed
  cleanly; written **between the town and postcode** the after-city grammar
  captures it as a county/state → that form is `__skip`.

## 6. Failure modes to test (>=8)

1. **Number-first + trailing type** — `1 Bucks Road` → number 1, `Bucks`, Road.
2. **Range** — `10-12 Duke Street` kept whole.
3. **Letter suffix** — `2A Strand Street` → number 2 + suffix A.
4. **Type vocabulary** — Road/Street/Avenue/Hill/Promenade/Way/Terrace/Court/
   Drive, echoed verbatim; short code derived.
5. **Multiword street name** — `King Edward Road`, `Loch Promenade`.
6. **Post town variety** — Douglas/Onchan/Peel/Ramsey/Castletown, two/three-word
   towns `Port Erin`, `Port St Mary`, apostrophe `St John's`.
7. **UK-format postcode LAST** — `IM1 3AE`; normalised spacing/upper-case.
8. **Large-user postcode** — `IM99 1XY`, `IM86 1AB`.
9. **Leading secondary unit** — `Flat 2, 5 Finch Road`, `Apartment 4, ...`,
   `Suite 3`, `Unit 5`.
10. **PO box** — `PO Box 25, Douglas, IM99 1XY`.
11. **Country after postcode** — `..., IM1 3AE, Isle of Man` → no state.
12. **Country variant** — `IMN` → `IM`.
13. **No post town** — `27 Athol Street, IM1 1LB` (street + postcode only).
14. **Country between town and postcode** — misparsed as state — `__skip`.
15. **Bare postcode** — `IM1 3AE` alone — `__skip` (no place-only entry point).
16. **House name (no number) before street** — `Thie Rosien, Main Road, ...` —
    `__skip` (leading unnumbered building name not modelled).
