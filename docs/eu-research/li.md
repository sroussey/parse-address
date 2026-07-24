# Liechtenstein (LI) Postal Address Research

Scope: parsing/normalizing Liechtenstein street addresses. Liechtenstein is
inside the SWISS postal area — Swiss Post (Die Post) delivers, and codes are
part of the Swiss 4-digit plan. Addressing is German, in the Swiss orthography
(never "ß"; always "ss").

Sources: UPU Postal Addressing S42 (Liechtenstein/Switzerland), Swiss Post PLZ
directory, Google libaddressinput (`LI` format `%O%n%N%n%A%nFL-%Z %C`, street
first, postcode before city), libpostal, Wikipedia "Postal codes in
Liechtenstein", Landesverwaltung FL, OpenStreetMap Liechtenstein.

## 1. Line order — STREET FIRST, number after (as German/Swiss)
`[street-name(+fused type)] [house-number]` then `[postal_code(4)] [city]`, e.g.
`Äulestrasse 56, 9490 Vaduz`. libaddressinput uses `FL-%Z %C` (optional `FL-`
prefix, postcode before city). No canton/state line.

## 2. Street type — FUSED suffix (Swiss "ss")
The generic type is usually glued to the end of the name as a bound suffix and
must be peeled off:
`-strasse`, `-weg`, `-gasse`, `-platz`, `-halde`, `-ring`, `-rank`, `-hof`,
`-promenade` (+ the `Str.` abbreviation). Swiss spelling is `strasse`, and the
canonical isolated type word is `Strasse` (never `Straße`). Examples:
Äulestrasse → Äule + Strasse; Herrengasse → Herren + Gasse; Duxweg → Dux + Weg.
- A **spaced** type also splits: `Feldkircher Strasse` → Feldkircher + Strasse.
- A hyphen-glued last word splits WITHIN the word: `St. Luzi-Strasse` →
  `St. Luzi` + `Strasse`; `Fürst-Franz-Josef-Strasse` → `Fürst-Franz-Josef` +
  `Strasse` (config uses `spacedTypeExact: true`).
- **Bare names with no type** are common: `Städtle` (Vaduz's main street),
  `Oberdorf`, `Heiligkreuz`, `Hinterschellenberg` — left with type unset.
- **Prepositional names** stay whole (`unsplittablePrefixes`): `Im Rösle`,
  `Im Wingert`, `Beim ...`, `Auf ...`.
- **Short-stem guard**: a 2-char remnant is not split, so `Austrasse` (Au +
  strasse) is kept whole — a documented modeling limit.

## 3. House number
Digits, optional glued letter (`10a` → 10 + a) or a range kept whole
(`11-13`). Pattern: `(?<number>\d+(?:\s?[-–]\s?\d+)?)(?<civic_number_suffix>\s?
[A-Za-z](?![A-Za-z]))?` (Swiss style, matching CH).

## 4. Postal code — 4 digits, 9485–9498 only, before the city
Liechtenstein's assigned Swiss codes: 9485 Nendeln, 9486 Schaanwald, 9487
Gamprin-Bendern, 9488 Schellenberg, 9489/9490 Vaduz, 9491 Ruggell, 9492 Eschen,
9493 Mauren, 9494 Schaan, 9495 Triesen, 9496 Balzers, 9497 Triesenberg, 9498
Planken. Optional legacy `FL-` prefix (`FL-9490 Vaduz`). Regex:
`(?:FL[-\s]?)?(?<postal_code>9[45]\d\d)`.

## 5. City — the 11 Gemeinden (or a village), no state
Vaduz (capital), Schaan, Triesen, Balzers, Eschen, Mauren, Triesenberg,
Ruggell, Gamprin, Schellenberg, Planken; villages Nendeln, Schaanwald, Bendern.
NO canton/region field. Country variants: `Liechtenstein`, `FL`, `LI`, `LIE`,
`Fürstentum Liechtenstein`; normalized `country = LI`.

## 6. Secondary units & PO boxes
Units (German/Swiss): `2. OG` (ordinal-first: floor 2, Obergeschoss), `Whg 4`
(Wohnung), `Top 2`, `Stock`, `UG`, `EG`, `Zimmer`. PO box: **Postfach**
(`Postfach 684` → sec_unit_type "Postfach", num "684"); box number is not a
house number.

## 7. Failure modes (parser MUST handle)
1. Fused `-strasse` peeled before an inner `-hof` (`Meierhofstrasse` → Meierhof +
   Strasse), thanks to longest-suffix-first ordering.
2. Spaced `Strasse` split (`Feldkircher Strasse`) vs glued (`Landstrasse`).
3. Hyphen-glued last word split within the word (`St. Luzi-Strasse`,
   `Fürst-Franz-Josef-Strasse`, `Peter-und-Paul-Strasse`).
4. Bare names with no type (`Städtle 37`, `Oberdorf 15`, `Heiligkreuz 6`).
5. Prepositional names kept whole (`Im Rösle 8`).
6. Short-stem guard leaves `Austrasse` unsplit (documented limit).
7. Glued letter civic (`10a`) and range (`11-13`).
8. `FL-` prefix stripped from the postcode (with a street present).
9. Ordinal-first floor units (`2. OG`) vs word-first (`Whg 4`, `Top 2`).
10. Postfach box lines; locality-only lines (`9490 Vaduz`, `9485 Nendeln`).
11. Swiss `ss` orthography — never emit `ß`.

## 8. Known modeling limits (marked __skip in samples)
- Street + trailing `Postfach` on the same line (`Städtle 2, Postfach 1, ...`).
- A `FL-` prefix on a street-LESS locality line (`FL-9490 Vaduz`): the shared
  token-preservation invariant scores the orphaned `FL` fragment as a lost
  token (the digits it keys off are past the postcode boundary). Works fine when
  a street is present (`Äulestrasse 56, FL-9490 Vaduz`).
- Lowercase square/landmark-only references (`beim Postplatz, 9490 Vaduz`).
