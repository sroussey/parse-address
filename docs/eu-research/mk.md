# North Macedonia (MK) — address research (romanized / SEC model)

## SEC / scope
- SEC-mapped country. Model the **romanized (Latin)** form. Native Cyrillic
  ("ул. Македонија 15, Скопје 1000") is OUT OF SCOPE and marked `__skip`.

## Written order
- Same idiom as Bulgaria: **street-first with a leading generic**, house number
  **after**: `ul. Makedonija 15`, `bul. Ilinden 2`, `pl. Makedonija 1`.
- Generic types (romanized):
  - `ulica` / `ul.`  (street)
  - `bulevar` / `bul.`  (boulevard)
  - `plostad` / `pl.`  (square)

## Postcode
- **4 digits**. In the international/SEC-facing form the postcode is written
  **after** the city — the exact form in the brief's example
  `ul. Makedonija 15, Skopje 1000`. Modelled as `postalPlacement: after-city`.
  (Domestic UPU also uses the postcode-first form; the postcode-first
  "1000 Skopje" is `__skip` under this grammar.)

## Region
- Eight statistical regions (Skopje, Pelagonia, Vardar, ...) are
  **administrative/statistical only** and not part of a postal address. The
  `state` (county) slot is a never-match sentinel `(?!x)x`, disjoint from cities.

## Config decisions
- `order: street-number`, `typePlacement: prefix`, `postalPlacement: after-city`.
- `normalizeTypeCase: false` — generic echoed verbatim ("ul.", "bulevar").
- Abbreviations listed WITH the dot; full words `ulica`/`bulevar`/`plostad` also
  accepted (longest-first in the builder).
- House number `\d+` + optional single letter ("15a").
- Prefix + after-city is fully supported by the shared engine (city then CAP).

## Known gaps (all `__skip`)
- Native Cyrillic script.
- Digit-led street names ("11 Oktomvri", "1 Maj") — a street-first order without
  `allowDigitsInName` takes the leading digit as the house number.
- `bb` (bez broj / no-number) marker.
- Postcode-first ordering.
