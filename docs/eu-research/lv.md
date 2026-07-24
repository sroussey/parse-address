# Latvian (Latvija) Postal Address Research — for a street-address parser

Latvian, Latin script with ā č ē ģ ī ķ ļ ņ š ū ž. Post handled by **Latvijas
Pasts**.

Sources consulted:
- Google libaddressinput `LV` (`fmt "%O%n%N%n%A%n%C, %Z"`, `zip "LV-\d{4}"`, `require "ACZ"`).
- UPU S42 Latvia profile (upu.int addressing unit, `lvaEn.pdf`).
- Smarty "Latvia address format & examples"; PostGrid / Umbrex / GeoPostcodes Latvia guides.
- en.wikipedia.org/wiki/Postal_codes_in_Latvia.

---

## 1. Canonical order — LITTLE-ENDIAN, postcode LAST

Street name FIRST, house number after; then the city; then the postcode **LAST,
AFTER the city**:

```
[Recipient]
Street Type HouseNumber[-Apartment]
City, LV-NNNN
[COUNTRY]
```

libaddressinput `fmt "%O%n%N%n%A%n%C, %Z"` → address line, then `%C, %Z` =
"City, LV-1010". Example (Smarty/Umbrex): `Brīvības iela 15, Rīga, LV-1010`.

Config: `order: "street-number"`, `postalPlacement: "after-city"`.

## 2. Street type is a SUFFIX noun; "iela" dominates

The generic word is a **separate trailing noun**: "Brīvības **iela**",
"Raiņa **bulvāris**", "Doma **laukums**". `iela` (street) is by far the most
common; nearly every street has a type word (bare names are rare). Multiword
given-name streets keep both words: "Krišjāņa Barona iela", "Aleksandra Čaka iela".

`typePlacement: "suffix"`, echoed verbatim (`normalizeTypeCase:false`).

### Type vocabulary
| Word | Meaning |
|------|---------|
| iela | street |
| bulvāris (bulv.) | boulevard |
| prospekts (prosp.) | avenue |
| gatve | thoroughfare |
| laukums (lauk.) | square |
| šoseja | highway |
| ceļš | road |
| aleja | alley |
| līnija | line |
| krastmala | embankment |
| dambis | dam/causeway |
| tilts | bridge |
| pārvads | overpass |

A single **fused** token like "Rātslaukums" (Town Hall Square) has no space, so
the suffix splitter leaves it whole with `type = null` — acceptable.

## 3. House number, civic suffix, apartment

- Integer, optional glued/spaced single letter (`5a`, `23A`).
- **Apartment (dzīvoklis)** written glued with a hyphen: `15-5` = house 15, apt 5.
  Modelled as `sec_unit_type "dz."`, `sec_unit_num` after the hyphen.
- Corner-lot dual numbers with a slash (`6/8`) and building/block designators
  (`k-2`, korpuss) occur but are not modelled (`__skip`).

## 4. Postcode

- **4 digits with a MANDATORY `LV-` prefix**: `LV-1010`. libaddressinput
  `zip "LV-\d{4}"` includes the prefix, so it is **kept in the stored value**
  (unlike DE "D-"/FI "FI-", which are stripped). Also seen written `LV 1010` /
  `LV1010`; normalised to canonical `LV-NNNN`.
- Sits **after the city**, comma-separated: `Rīga, LV-1010`.

## 5. Region

No province/region on the delivery line. Rural addresses add a **novads**
(municipality) tier after the settlement ("Ādaži, Ādažu novads, LV-2164"); not
captured (`__skip`).

## 6. PO box

`a/k` (abonenta kastīte); `p/k` / `a.k.` variants. Replaces the street:
"a/k 88, Rīga, LV-1010". Modelled via `poBoxNames`.

## 7. Diacritics

`ā č ē ģ ī ķ ļ ņ š ū ž` are ordinary letters (Lāčplēša, Ģertrūdes, Merķeļa,
Ķīpsalas). Full UTF-8, no folding.

## 8. Country variants

`Latvija`, `Latvia`, `LVA`, `LV` → `LV`.

---

## Failure modes

1. **Postcode LAST (after city)**: `Rīga, LV-1010`; a before-city parser
   mis-slots it. Order differs from EE/LT (both before-city) despite all three
   being Baltic — do not assume a shared placement.
2. **`LV-` prefix is part of the code**: dropping it (or failing to normalise
   `LV 1010`/`LV1010`) breaks the 4-digit field; keeping the code without a prefix
   loses the country marker that libaddressinput mandates.
3. **`iela` as a SUFFIX**, not a prefix or fused: "Brīvības iela" → name
   "Brīvības" + type "iela"; a prefix/fused model corrupts it.
4. **Multiword given-name streets**: "Krišjāņa Barona iela", "Aleksandra Čaka
   iela" — the name is two words before the type; a greedy one-word name splitter
   drops "Krišjāņa"/"Aleksandra".
5. **Hyphen apartment**: `15-5` = house+apartment, not a range.
6. **Slash dual number** `6/8` and **block `k-2`**: not the same as an apartment;
   left unmodelled rather than mis-parsed.
7. **Diacritics** `ā č ē ģ ī ķ ļ ņ š ū ž`: ASCII folding merges distinct streets.
8. **`novads`/`pagasts`** rural tiers after the settlement must not be read as the
   city or a state.
9. **Numeric-dated street names** ("11. novembra krastmala") begin with a digit;
   a street-first grammar that excludes digits from the name cannot capture them
   (`__skip`).
10. **Reversed/place-first order** ("LV-1010, Rīga, ...") is not the grammar's
    shape (`__skip`).
