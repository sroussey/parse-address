# Hungarian (Magyarország) Postal Address Research — for a street-address parser

Hungarian, Latin script with á é í ó ö ő ú ü ű. Post handled by **Magyar Posta**.

Sources consulted:
- Google libaddressinput `HU` (`fmt "%N%n%O%n%Z %C%n%A"`, `zip "\d{4}"`, `require "ACZ"`).
- UPU S42 Hungary profile (upu.int addressing unit, `hunEn.pdf`).
- PostGrid / Smarty / GeoPostcodes Hungary format guides.
- inyourpocket.com Budapest "Addresses" (district / floor / door conventions).

---

## 1. Canonical order is PLACE-FIRST and BIG-ENDIAN

Hungarian is the outlier of this batch: the **postcode + city LEAD**, then the
street:

```
[Recipient]
NNNN City
Street Type HouseNumber[.] [Floor] [Door]
[COUNTRY]
```

libaddressinput `fmt "%N%n%O%n%Z %C%n%A"` → Name, Org, `%Z %C` (postcode+city),
THEN `%A` (address line). Native example: `1051 Budapest, Váci utca 1.`

### DECISION on modelling
The shared EU ruleset expresses **street-core-then-place only** (the trailing
"place" fragment always follows the street). It therefore **cannot express the
native place-first order**, which is marked `__skip` in the corpus (with full
ground-truth fields for documentation).

What IS modelled is the **street-first rendering** that international carriers and
databases use when normalising Hungarian addresses to the common Western order:
`Váci utca 1, 1051 Budapest`. Within that rendering the config uses
`order: "street-number"`, `postalPlacement: "before-city"` (postcode before city
on the trailing place line), `typePlacement: "suffix"`.

## 2. Street type is a SUFFIX noun

The generic word trails the name as its own word: "Váci **utca**", "Andrássy
**út**", "Erzsébet **körút**", "Deák Ferenc **tér**". Note **`út` (road) vs `utca`
(street)** are different types and distinguish different streets ("Váci út" ≠
"Váci utca"); matching is longest-first so `utca` is preferred over `út`.
Squares appear as `tér` or the possessive `tere` ("Ferenciek tere", "Hősök
tere"). Verbatim (`normalizeTypeCase:false`).

### Type vocabulary
| Word | Abbrev | Meaning |
|------|--------|---------|
| utca | u. | street |
| út | — | road/avenue |
| körút | krt. | boulevard (ring road) |
| tér / tere | — | square |
| köz | — | lane/alley |
| sétány | — | promenade |
| rakpart | — | quay |
| fasor | — | tree-lined avenue |
| sor | — | row |
| liget | — | grove |
| sugárút | — | avenue |
| körtér | — | circus |
| park / dűlő | — | park / field-way |

## 3. House number, floor, door

- Integer; may carry a `/A` sub-designator ("Váci utca 1/A", "Dob utca 15/B") or a
  building-number range ("Kossuth Lajos tér 1-3"), both kept in `number`.
- A **trailing dot** is idiomatic ("Váci utca 1.") and is consumed.
- **Floor (emelet) + door (ajtó)** follow: modelled subset is a floor marker with
  its number — `em.` (emelet) / `emelet` / `fszt.` (földszint, ground floor) +
  number → `sec_unit_type "em."`/`"fszt."`. NOT modelled (`__skip`):
  floor-FIRST forms where the number precedes the marker ("2. em. 3"),
  roman-numeral floors ("II. em. 5."), and slash floor/door ("III/21").

## 4. Postcode

- **4 digits** (`\d{4}`), before the city. Budapest codes are `1XYZ` where `XY`
  is the district (kerület) number 01–23 and `Z` the post office; other towns use
  their own 4-digit codes (Debrecen 40xx, Szeged 67xx, Pécs 76xx, Győr 90xx,
  Miskolc 35xx).

## 5. Region / district

No county on the delivery line. Budapest's **district** is normally encoded in the
postcode; when written explicitly as a roman-numeral "kerület" ("Budapest, V.
kerület, …") it is not modelled (`__skip`).

## 6. PO box

`Postafiók` / **`Pf.`** + number, replacing the street: "Pf. 100, 1245 Budapest".
Modelled via `poBoxNames`. (Native place-first PO forms are `__skip`.)

## 7. Diacritics

`á é í ó ö ő ú ü ű` are ordinary letters; the long-vowel pairs `ö/ő` and `ü/ű` are
DISTINCT letters (Petőfi, Hősök, Üllői, Győr). Full UTF-8, no folding.

## 8. Country variants

`Magyarország`, `Hungary`, `HUN`, `HU` → `HU`.

---

## Failure modes

1. **Native PLACE-FIRST order** ("1051 Budapest, Váci utca 1.") is the DOMINANT
   real form and is not expressible in a street-then-place grammar — the single
   biggest limitation; such inputs are `__skip`. Only the street-first
   normalisation is parsed.
2. **`út` vs `utca`**: distinct types naming distinct streets; longest-first
   matching is required so "Váci utca" is not read as name "Váci utc" + "a"/"út".
3. **Possessive `tere`** vs `tér`: "Ferenciek tere" needs the 4-char `tere`
   matched before `tér` (else it splits as "Ferenciek ter" + "e").
4. **Trailing dot on the house number** ("1.") must be consumed, or the place tail
   is never reached.
5. **`/A` sub-designator and `1-3` range** belong to the house number, not a
   separate unit or a second address.
6. **Floor/door stacks**: `em.`/`fszt.` + number are modelled, but floor-first
   ("2. em. 3"), roman ("II. em. 5."), and slash ("III/21") forms are not
   (`__skip`) — a naive parser mis-slots the door digit as a house number or city.
7. **Roman-numeral district ("V. kerület")** written out is administrative, not a
   street type or state.
8. **Diacritics** `ö/ő`, `ü/ű` are different letters; folding them merges names.
9. **4-digit postcode before city** ("1051 Budapest"): parsers expecting 5-digit
   or after-city codes fail.
10. **Multiword given-name streets** ("Kossuth Lajos utca", "Bartók Béla út",
    "Bajcsy-Zsilinszky út") keep the whole name run before the type; a one-word
    name splitter drops the first name.
