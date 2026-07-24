# Armenia (AM) — address research (romanized / SEC model)

## SEC / scope
- SEC-mapped country. Model the **romanized (Latin)** form used in international
  filings. Native Armenian script ("Աբովյան փողոց 12") is OUT OF SCOPE and
  marked `__skip`.

## Written order
- Romanized Armenian addresses take the **English number-first + type-suffix**
  shape: `12 Abovyan Street`, `5 Mashtots Avenue`. (Native order is name-first
  with `poghots` (street) / `poghota` (avenue); that is not the filing form.)
- Type = trailing English suffix: **Street**, **Avenue**, plus Square, Lane,
  Highway, Alley.

## Postcode
- **4 digits**, written **after** the city: `Yerevan 0010`, `Gyumri 3101`.
  (Armenia adopted the 4-digit index in 2006.) `postalPlacement: after-city`;
  postcode optional in the shared grammar.

## Region (marz)
- 10 marzer + the capital Yerevan (which is a city, NOT a marz). Regions are
  rarely written; when present they follow the city, comma-delimited:
  `Ijevan, Tavush 4001`. Curated `countyPattern`, disjoint from Yerevan:
  `Aragatsotn, Ararat, Armavir, Gegharkunik, Kotayk, Lori, Shirak, Syunik,
  Tavush, Vayots Dzor`. Vayots Dzor escapes its space as `\s+`.
  (Ararat/Armavir also name cities, but the pattern only fires in the
  post-city `, <region> <postcode>` slot, so there is no collision in practice.)

## Config decisions
- `order: number-street`, `typePlacement: suffix`, `postalPlacement: after-city`.
- `normalizeTypeCase: false` — English type echoed verbatim.
- House number `\d+(-\d+)?` + optional glued letter ("12a"); ranges kept whole.
- Structurally mirrors GB / the GE sibling (number-first, suffix, postcode-last)
  with a numeric 4-digit CAP and a curated regional `state`.

## Known gaps (all `__skip`)
- Native Armenian script.
- Building / apartment stacks and trailing apartment units (no secondary-unit
  pattern configured for this romanized model).
