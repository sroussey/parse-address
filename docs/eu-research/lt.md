# Lithuanian (Lietuva) Postal Address Research — for a street-address parser

Lithuanian, Latin script with ą č ę ė į š ų ū ž. Post handled by **Lietuvos
paštas**.

Sources consulted:
- Google libaddressinput `LT` (`fmt "%O%n%N%n%A%nLT-%Z %C"`, `zip "\d{5}"`,
  `postprefix "LT-"`, `require "ACZ"`).
- Smarty "Lithuania address format & examples" (verbatim samples below).
- Umbrex "How to address a letter to Lithuania".

---

## 1. Canonical order — postcode BEFORE the city

Street name FIRST, house number after; the geographic line puts the **5-digit
code (canonical `LT-` prefix) BEFORE the city**:

```
[Recipient]
Street Type HouseNumber[-Apartment]
LT-NNNNN City
[COUNTRY]
```

libaddressinput `fmt "%O%n%N%n%A%nLT-%Z %C"` → address line, then
`LT-%Z %C` = "LT-01103 Vilnius". Smarty verbatim: `... 08117 Vilnius`,
`... LT-87113 Telšiai` (prefix optional domestically; postcode still before city).

### DECISION on order
The task brief sketched LT as "City LT-NNNNN" (postcode after city). That does
not match the sources: libaddressinput and every Smarty/Umbrex example place the
**postcode before the city**. Following the sourced canonical order, this config
uses `postalPlacement: "before-city"` (same shape as EE). The reversed rendering
is included as a `__skip` sample. `order: "street-number"`.

## 2. Street type is a SUFFIX, almost always ABBREVIATED with a dot

The generic word is a **separate trailing noun**, in practice nearly always the
dotted abbreviation: `g.` (gatvė), `pr.` (prospektas), `al.` (alėja), `a.`
(aikštė). "Gedimino **pr.** 9", "Vilniaus **g.** 1", "Laisvės **al.** 60". Full
words ("gatvė", "prospektas", "alėja") also occur. `typePlacement: "suffix"`,
verbatim (`normalizeTypeCase:false`); the dotted forms are listed as literal type
spellings so the trailing dot is consumed.

### Type vocabulary (abbrev → full)
| Abbrev | Full | Meaning |
|--------|------|---------|
| g. | gatvė | street |
| pr. | prospektas | avenue |
| al. | alėja | alley/avenue |
| a. | aikštė | square |
| pl. | plentas | highway |
| — | kelias | road |
| — | skersgatvis | side-street |
| — | krantinė | quay |
| — | takas | path |

## 3. House number, civic suffix, apartment

- Integer, optional glued/spaced single letter (`18B`, `35A`).
- **Apartment (butas)** written glued with a hyphen: `20-5` = house 20, apt 5.
  Modelled as `sec_unit_type "bt."`, `sec_unit_num` after the hyphen.
- A **space-separated** apartment ("19 16", Smarty example) is ambiguous and not
  modelled (`__skip`).

## 4. Postcode

- **5 digits**, canonical `LT-` prefix. Because the street type is a separate
  word (unlike fused DE/FI streets that absorb a country prefix in their split), a
  prefix-less source would leave the bare digits in the street segment and be
  miscounted; the config normalises to `LT-NNNNN` and exempts the bare digits from
  the token-preservation guard (via `postNormalize` `__dropped`) so **both**
  `LT-08117 Vilnius` and `08117 Vilnius` parse cleanly.

## 5. Region

No region on the delivery line. Full postal renderings may add an **elderate**
(`Senamiestis`), a **`k.`** (kaimas/village), or a **`r. sav.`**
(rajono savivaldybė / district municipality) with an `apskritis` (county); none
are captured (`__skip`).

## 6. PO box

`a. d.` / `a.d.` (abonentinė dėžutė) + number, replacing the street:
"a. d. 12, LT-01103 Vilnius". Modelled via `poBoxNames`.

## 7. Diacritics

`ą č ę ė į š ų ū ž` are ordinary letters (Vokiečių, Žirmūnų, Kęstučio, Klaipėda,
Šiauliai, Panevėžys). Full UTF-8, no folding.

## 8. Country variants

`Lietuva`, `Lithuania`, `LTU`, `LT` → `LT`.

---

## Failure modes

1. **Postcode BEFORE the city** (`LT-01103 Vilnius`) — contrary to the neighbour
   LV (after-city); a shared-Baltic assumption misplaces it.
2. **Optional `LT-` prefix**: `08117 Vilnius` vs `LT-08117 Vilnius`. A parser must
   accept both and not count the bare digits (or the leftover "LT-") as a street
   token — the specific reason this config normalises + exempts the digits.
3. **Dotted abbreviation types** `g.` / `pr.` / `al.` / `a.`: the trailing dot is
   part of the type token; a suffix matcher that forbids a dot after the type
   fails to consume it and then can't reach the place tail.
4. **`a.` (aikštė) vs `al.` (alėja)**: 2-char types must be matched longest-first
   so `al.` is not truncated to `a.`.
5. **Hyphen apartment** `20-5` = house+apartment (butas), not a range; a
   **space-separated** apartment `19 16` is ambiguous (`__skip`).
6. **Multiword names** "Aušros Vartų g.", "Jono Basanavičiaus g.", and names with
   an internal abbreviation "Šv. Jono g." — the whole run before the type is the
   name.
7. **Diacritics** `ą č ę ė į š ų ū ž`: ASCII folding merges distinct streets/cities.
8. **Administrative tiers** (`Senamiestis`, `k.`, `r. sav.`, `apskritis`) between
   the street and the place must not be read as city/street.
9. **Reversed/place-first order** ("LT-01103 Vilnius, Gedimino pr. 9") is not the
   grammar's shape (`__skip`).
