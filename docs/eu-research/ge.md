# Georgia (GE) — address research (romanized / SEC model)

## SEC / scope
- SEC-mapped country. Model the **romanized (Latin)** form used in international
  filings. Native Georgian (Mkhedruli) script ("რუსთაველის გამზირი 12") is OUT
  OF SCOPE and marked `__skip`.

## Written order
- When transliterated for foreign use, Georgian addresses take the **English
  number-first + type-suffix** shape: `12 Rustaveli Avenue`, `8 Kostava Street`.
  (Native order is name-first with the Georgian noun `gamziri`/`kucha`; that is
  not the romanized filing form.)
- Type = trailing English suffix: **Avenue** (gamziri), **Street** (kucha), plus
  Square, Lane, Highway, Alley, Ascent, Turn.

## Postcode
- **4 digits**, written **after** the city: `Tbilisi 0108`, `Batumi 6000`. The
  first two digits encode the region/city (01xx = Tbilisi). `postalPlacement:
  after-city`; postcode optional in the shared grammar.

## Region (mkhare)
- 9 regions + the Adjara autonomous republic; rarely written, but when present
  they follow the city, comma-delimited: `Telavi, Kakheti 2200`. These names are
  **disjoint from city names**, so a curated `countyPattern` is safe:
  `Kakheti, Imereti, Adjara, Guria, Samtskhe-Javakheti, Mtskheta-Mtianeti,
  Racha-Lechkhumi, Samegrelo(-Zemo Svaneti), Kvemo Kartli, Shida Kartli`.
  Multi-word names escape their space as `\s+` in the free-spacing pattern.

## Config decisions
- `order: number-street`, `typePlacement: suffix`, `postalPlacement: after-city`.
- `normalizeTypeCase: false` — English type echoed verbatim.
- House number `\d+(-\d+)?` + optional glued letter ("12a"); ranges kept whole.
- Structurally mirrors the GB sibling (number-first, suffix, postcode-last) but
  with a numeric 4-digit CAP and a curated regional `state`.

## Known gaps (all `__skip`)
- Native Georgian script.
- Leading building / entrance / apartment stacks and trailing apartment units
  (no secondary-unit pattern configured for this romanized model).
