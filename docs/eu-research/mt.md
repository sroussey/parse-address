# Malta (MT) Postal Address Research

Scope: parsing & normalising Maltese street addresses. Sources at the bottom.

---

## 1. Line order — NUMBER (or building name) FIRST, then Triq + name, town, postcode LAST

Malta writes the **door number first** (often with a comma), then the Maltese
thoroughfare type + name, then the town, and the **postcode LAST** (after the
town):

```
36, Triq San Pawl
Valletta
VLT 1210
MALTA
```

Single-string form: `36, Triq San Pawl, Valletta, VLT 1210`. Very many Maltese
addresses use a **building NAME instead of a number** (`Milano Court, Triq …`,
`St Rita Flats, Triq …`).

- `order: number-street`, `typePlacement: prefix`, `postalPlacement: after-city`.

## 2. Street type — Maltese, leading word (prefix)

| Maltese | Meaning        |
|---------|----------------|
| Triq    | street (default, by far the most common) |
| Trejqa  | small street/lane |
| Vjal    | avenue         |
| Misraħ  | square         |
| Pjazza  | plaza/square   |
| Sqaq    | alley          |
| Xatt    | wharf/seafront |
| Ġnien   | garden         |
| Wesgħa / Daħla | open space / inlet |

Type is echoed as written (`normalizeTypeCase: false`). **Crucially, only the
bare generic is the type**; the Maltese article that follows is part of the
NAME: `Triq il-Kbira` → type `Triq`, street `il-Kbira` (NOT `Triq il-`). Articles
seen in names: `il-`, `ir-`, `is-`, `id-`, `it-`, `tal-`, `tas-`, `ta'`, `San`,
`Sant'`, `Santa`.

English "… Street/Road/Avenue" forms occur but are **suffix-typed** and out of
scope for a prefix grammar; such a name parses **untyped** (whole name in
`street`). This is an accepted best-effort limitation.

## 3. Postcode — 3 letters + space + 4 digits, after the town

- Format since 2007: **AAA 9999** — 3 uppercase locality letters + space + 4
  digits (`VLT 1117` Valletta, `SLM 1050` Sliema, `MST 9032` Mosta). Regex
  `[A-Za-z]{3}\s?\d{4}`; normalised to upper-case with a single space.
- Position: **after** the town.
- Caveat: the 3-letter code is ASCII in the official scheme even for towns whose
  name has Maltese letters, so `[A-Za-z]{3}` is correct in practice.

## 4. Region / state

The only region qualifier that legitimately trails a town is the island **Gozo**
(Għawdex), e.g. `Rabat, Gozo, RBT 1010`. The config pins the county slot to Gozo
only — this is **load-bearing**: with the default permissive county pattern a
multi-word street name that abuts the town with no comma ("Triq San Pawl,
Valletta") is mis-split, the street truncating after "San" while "Pawl"→city and
"Valletta"→county. Restricting county to Gozo removes that escape route.

## 5. Secondary units — LEADING

Units precede the street: `Flat 5, 36, Triq …`, `Maisonette 2, Triq …`,
`Block C, …`, `Penthouse, …`. Words: Flat, Apartment/Apt, Maisonette, Penthouse,
Block, Unit, Shop, Level (`secUnitPlacement: before`). Only the FIRST leading
unit is captured; two stacked units ("Flat 6, Block 4, …") fold to the first.

## 6. Building names

Malta commonly leads with a named building instead of a number. Captured via
`buildingKeywords`: **Flats, Buildings, Court, House, Mansions**
(`Milano Court`, `St Rita Flats`, `Balluta Buildings`, `Regent House`).

## 7. PO boxes

`P.O. Box` / `PO Box` + number, displayed `PO Box`; replaces the street.

## 8. Orthography & towns

Maltese letters **ċ ġ ħ ż** (and `Ħ`, `Ż`, `Ġ`, `Ċ`) appear in names and towns
(`Ħamrun`, `Żejtun`, `Gżira`, `San Ġwann`, `Xagħra`). Towns are frequently
two-word (`San Ġiljan`, `Santa Venera`, `St Julian's`, `Ħal Kirkop`).

**Known invariant limitation:** the library's token-preservation guard locates
the city with an ASCII word-boundary (`\b`). In an *after-city* layout, a town
whose name **starts** with a non-ASCII letter (`Ħamrun`, `Żabbar`) cannot be
found by that guard, so the town is scored as a lost street token and the parse
is rejected. Real Maltese addresses routinely use the ASCII spelling
(`Hamrun`, `Zabbar`, `Zejtun`) — samples use those; one non-ASCII-leading case is
kept as `__skip` to document the boundary.

## 9. Country variants

`Malta`, `MLT`, `MT`. Normalised country = `MT`.

---

## Failure modes the parser MUST handle (concrete)

1. **Article stays with the name**: `Triq il-Kbira`, `Triq ir-Repubblika`,
   `Triq tal-Balal` — type is `Triq`, article (`il-`/`ir-`/`tal-`) is in the name.
2. **Multi-word name abutting the town** (root cause of many mis-parses):
   `Triq San Pawl, Valletta` — the name is `San Pawl`, not just `San`; requires
   the Gozo-restricted county slot so it doesn't leak into city/county.
3. **Building name instead of number**: `Milano Court, Triq …`,
   `St Rita Flats, Triq …`, `Balluta Buildings, Triq …`.
4. **Leading secondary unit**: `Flat 5, 36, Triq San Pawl, …`,
   `Maisonette 2, Triq …`, `Penthouse, 14, Triq …`.
5. **Two stacked leading units**: `Flat 6, Block 4, …` — only the first is
   captured (`__skip`).
6. **Postcode after the town, with or without a comma**:
   `Valletta, VLT 1210` and `Valletta VLT 1210`; also `VLT1210` (no space) and
   lowercase `vlt 1171` — all normalise to `VLT 1210` / `VLT 1171`.
7. **Apostrophe in name**: `Triq Sant'Antnin`, `Triq D'Argens`,
   `Triq il-Konvoy ta' Santa Marija` — don't split on `'`.
8. **Maltese letters in name/town**: `Vjal ir-Riħan`, `Misraħ San Ġorġ`,
   `Triq id-Difiża Ċivili` (ċ), `San Ġwann`.
9. **Non-Triq Maltese types**: `Vjal`, `Misraħ`, `Pjazza`, `Sqaq`, `Xatt`,
   `Trejqa` — all prefix types.
10. **Date/number inside the name**: `Triq id-9 ta' April 1942`,
    `Triq il-25 ta' Novembru` — embedded digits are part of the name; only the
    leading token is the house number.
11. **Gozo qualifier**: `19, Triq il-Kbira, Rabat, Gozo, RBT 1010` — `Gozo`
    captured as `state`.
12. **Non-ASCII-leading town** (`Ħamrun`, `Żabbar`) — trips the token guard in an
    after-city layout (`__skip`); use the ASCII spelling in practice.
13. **PO box**: `P.O. Box 25, Marsa, MRS 1000` — box, not a house number.
14. **Letter civic suffix / range**: `36A, Triq San Pawl`; `36-38, Triq San Pawl`.

---

## Sources

- MaltaPost (postal operator) postcode finder & addressing guidance:
  https://www.maltapost.com ; MaltaPost postcode finder overview:
  https://maltaposttracking.org/maltapost-postcode-finder/
- Wikipedia, "Postal codes in Malta" (3 letters + 4 digits since 2007):
  https://en.wikipedia.org/wiki/Postal_codes_in_Malta
- GeoPostcodes Malta address format (number before street, postcode after city,
  Triq/Pjazza examples): https://www.geopostcodes.com/country/malta/address-format/
- PostGrid / Smarty / Umbrex Malta format examples (Triq, Flat/Block units,
  building names).
