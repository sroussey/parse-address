# Romanian (RO) Street-Address Research

Research for a config-driven address parser. Sources: Poșta Română addressing
guidance; UPU S42 "Romania" postal addressing template
(https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/rouEn.pdf);
Google libaddressinput (RegionDataConstants, `RO`); PostGrid
(https://www.postgrid.com/global-address-format/romania-address-format/); Smarty
(https://www.smarty.com/global-address-formatting/romania-address-format-examples);
exampleaddress.com/countries/romania; Wikipedia ("Calea Moșilor", "Bulevardul
Lascăr Catargiu"); libpostal / OpenStreetMap `talk-ro`.

---

## 1. Canonical order

Romanian writes the **street TYPE first, then the name, then the house number**,
and puts the **postal code BEFORE the city** on the locality line:

```
<Type> <Name> [nr.] <No.>[, bl./sc./et./ap. ...]
<PSC 6 digits> <Localitate>[, judeţ]
[România]
```

Single-line: `Strada Popa Nan nr. 5, 010101 București` or
`Calea Victoriei 49-53, 415101 București`.

Key facts:
- **Number comes AFTER the street** (type Strada/Calea/Bulevardul leads).
- The **6-digit postal code precedes the locality**. PostGrid, Smarty,
  exampleaddress.com and Google libaddressinput (`%Z %C`, postal regex `\d{6}`)
  all put the code before the city. The parser models **postcode-before-city**.
  (A courier/ERP variant writes the code last — `..., City, jud., NNNNNN`; that
  ordering is marked `__skip` in the samples, see §8.)
- **județ (county)** is optional and, when present, follows the city, usually
  with a `jud.` / `județul` / `județ` marker. Major municipalities (București,
  and often Cluj-Napoca etc.) are written with no județ.

## 2. Street types (prefix)

| Full | Abbrev | English |
|------|--------|---------|
| Strada | Str. | street |
| Bulevardul | Bd. / B-dul / Blvd. | boulevard |
| Calea | — | avenue/way (historical radial) |
| Șoseaua | Șos. / Sos. | highway / chaussée |
| Aleea | Al. | alley / lane |
| Splaiul | Splai | embankment / quay |
| Intrarea | Intr. | access lane / close |
| Piața | Pța. | square |
| Drumul | Dr. | road |
| Fundătura | Fnd. | cul-de-sac |

The type is a **leading** word; the config keeps the spelling exactly as written
(`normalizeTypeCase:false`) so `Str.` stays `Str.` and `Strada` stays `Strada`.

## 3. House number

- Introduced optionally by the marker **`nr.`** (număr). The marker is not part
  of the number; the parser consumes it into a `drop` group (so it neither
  appears in output nor is scored as a lost token — `nr.` is not in the shared
  `NUMBER_MARKERS` list, so this is done per-config).
- May be a **range** (`49-53`, `28-30`) — kept whole in `number`.
- May carry a **single-letter suffix** (`5A`, `14B`) → `civic_number_suffix`.
- Bare numbers with no marker also occur (`Calea Victoriei 49-53`).

## 4. Secondary units

Apartment-block addresses stack markers: **bl.** (bloc), **sc.** (scara),
**et.** (etaj), **ap.** (apartament). The shared grammar has a single secondary
-unit slot, so:
- a **single** trailing unit (`ap. 25`, `bl. OD5`, `apartament 5`) is captured
  into `sec_unit_type` / `sec_unit_num` (display normalised to `ap./bl./sc./et.`);
- a **stacked chain** (`bl. 3, sc. A, et. 2, ap. 4`) exceeds one slot and is
  marked `__skip`.

## 5. Region field

`județ` → `state`. The `jud.`/`județul`/`județ` marker is consumed; the county
name is kept as written, diacritics preserved (`Cluj`, `Brașov`, `Timiș`,
`Iași`, `Satu Mare`). Modelled only when the județ follows the city (the
authoritative order); a județ written before the postcode line is `__skip`.

## 6. Postal code & diacritics

- **Six digits, no space, no hyphen** (`010101`, `415101`, `400114`). Regex
  `\d{6}`. First digit = county/region.
- Romanian diacritics in names/cities: **ă â î ș ț** (and `Ș Ț` — comma-below,
  not cedilla) — must be preserved: `București`, `Timișoara`, `Iași`, `Brașov`,
  `Piața`, `Șoseaua`, `Bârlad`, `Neamț`.

## 7. PO box & country

- PO box: **CP** / **OP** (Căsuța Poștală / Oficiul Poștal) — rare in street
  data; not modelled here (no `poBoxNames`).
- Country spellings normalising to `RO`: **România**, **Romania**, **ROU**,
  **RO**.

## 8. Failure modes to test (>=8)

1. **`nr.` marker** — `Strada Popa Nan nr. 5`: marker dropped, `number=5`, and
   not counted as a lost token.
2. **Bare number, no marker** — `Calea Victoriei 49-53`.
3. **Number range** — `49-53`, `17-19` kept whole in `number`.
4. **Letter suffix** — `1A`, `14B` → `civic_number_suffix`.
5. **Prefix type vocabulary** — Strada/Str./Bulevardul/Bd./B-dul/Calea/Șoseaua/
   Aleea/Splaiul/Piața/Intrarea/Drumul, kept verbatim.
6. **Date/number street names** — `Bulevardul 1 Decembrie 1918 nr. 45`,
   `Strada 13 Septembrie`: leading number is part of the name, house number
   trails (after `nr.`).
7. **județ → state** — `..., 400114 Cluj-Napoca, jud. Cluj`; marker forms
   `jud.` / `județul` / `județ`; two-word counties (`Satu Mare`).
8. **Diacritics** — `București`, `Timiș`, `Iași`, `Brașov` survive round-trip.
9. **Single secondary unit** — `ap. 25`, `bl. OD5`, full word `apartament`.
10. **Stacked units** (`bl./sc./et./ap.`) — `__skip` (one slot only).
11. **Postcode-last courier variant** — `..., City, jud., NNNNNN` — `__skip`.
12. **Bucharest sector line** between street and postcode — `__skip`.
13. **Country variants** — România / Romania / RO all → `RO`.
14. **Postcode-before-city** — `415101 București` parsed as `postal_code`
    then `city`, not as a house number.
