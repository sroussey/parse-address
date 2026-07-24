# Bulgaria (BG) — address research (romanized / SEC model)

## SEC / scope
- SEC-mapped country. Model the **romanized (Latin)** form used in international
  filings. Native Cyrillic ("ул. Витоша 15, 1000 София") is OUT OF SCOPE and
  marked `__skip` in the sample set.

## Written order
- **Street-first with a leading generic type word**, house number **after**:
  `ul. Vitosha 15`, `bul. Vasil Levski 82`, `pl. Slaveykov 4`.
- Generic types (romanized):
  - `ulitsa` / `ul.`  (street)
  - `bulevard` / `bul.`  (boulevard)
  - `ploshtad` / `pl.`  (square)
- The generic **leads**; the proper name follows; the number is last. Two-word
  and Roman-numeral names occur ("Graf Ignatiev", "Knyaz Boris I").

## Postcode
- **4 digits**, no space, written **before** the city: `1000 Sofia`,
  `4000 Plovdiv`. This is the Bulgarian Posts / UPU / Google libaddressinput
  order (`%Z %C`). Postcode is frequently omitted in practice, so the shared
  before-city grammar (optional CAP) is a good fit.
- City-then-postcode ("Sofia 1000") is not the postal norm and is `__skip`.

## Region (oblast)
- 28 oblasti, but they are **administrative only** and essentially never written
  in a delivery address. Worse, nearly every oblast **shares its name with a
  city** (Plovdiv, Varna, Burgas, Ruse ...), so a region list cannot be made
  disjoint from cities. Region is therefore left **unmodelled**: the `state`
  group is a never-match sentinel `(?<state>(?!x)x)`.

## Config decisions
- `order: street-number`, `typePlacement: prefix`, `postalPlacement: before-city`.
- `normalizeTypeCase: false` — the generic is echoed verbatim ("ul.", "bulevard").
- Abbreviations listed WITH the dot (`ul.`, `bul.`, `pl.`) so they cannot eat the
  first letter of a name; the builder appends an optional `\.?`.
- House number `\d+` + optional single-letter suffix ("15A").
- Mirrors the Albania (AL) sibling almost exactly (leading generic, before-city).

## Known gaps (all `__skip`)
- Native Cyrillic script.
- Stacked entrance/floor/apartment units (`vh.` / `et.` / `ap.`) — no secUnit slot.
- City-then-postcode ordering.
- Oblast line.
