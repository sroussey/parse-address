# Vatican City (VA) — address research

**Sibling clone:** `src/maps/it/config.ts` (Italian). The Vatican uses
Italian-style addressing and the Italian (Poste Vaticane / Poste Italiane)
delivery conventions.

## Grammar
- **Order:** toponimo (type) + name FIRST, house number AFTER
  ("Via del Pellegrino 1"). `order: "street-number"`, `typePlacement: "prefix"`.
- **Types:** copied verbatim from IT (Via, Viale, Piazza, Largo, … and the
  verbatim abbreviations V.le, P.za, C.so, …). `normalizeTypeCase: false`.
  Particles (del/della/di) stay with the name.
- **Civico:** copied verbatim — glued letter "12A", "/A", " bis"/" ter", or the
  bare `snc` (senza numero civico).
- **Secondary unit:** Interno/Int., Scala/Sc., Piano, Palazzo/Pal.,
  Appartamento/App. — copied verbatim.

## Postcode
- **FIXED "00120"** — the single CAP for the whole Vatican City State, written
  before the city. `postalPattern: "(?<postal_code>00120)"` (the only change of
  substance from IT, whose pattern is `\d{5}`).

## Known limitation (inherited from the shared IT grammar)
A numberless typed street immediately followed by the postcode
("Piazza San Pietro, 00120 …") makes the grammar read the postcode as the house
number. The Italian convention for a numberless address is `snc`, which the
grammar handles correctly ("Piazza San Pietro snc, 00120 …"). Samples use `snc`
for the square; this mirrors real Poste Vaticane usage and is not a regression
introduced by VA.

## Place tail
- **City:** "Città del Vaticano". Note this string is ALSO a `countryNames`
  entry; the non-greedy city plus the required `[\s,]+` before the optional
  country group resolves it to the city (verified green).
- **Region / province:** none (single city-state). IT's province `regionPattern`
  was dropped and `countyPattern` set to never-match `(?!x)x`.

## Country
`country: "VA"`; `countryNames` include "Città del Vaticano", "Vatican City",
"Vatican City State", "Vatican", "VAT", "VA".

## Copied verbatim from IT
`houseNumberPattern`, `types` (TYPES), `typeShortCodeMap`,
`secUnitPattern`/`secUnitDisplayMap`, `poBoxNames`/`poBoxDisplayMap`. Changed:
`code`, `country`, `countryNames`, `postalPattern`; dropped `regionPattern`
(PROVINCES) and added `countyPattern` never-match.

## Validation
`ISO2=va` harness: **checked 37, failures 0, 0 skips.**
