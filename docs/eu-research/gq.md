# Equatorial Guinea (GQ) — address research

**Sibling clone:** `src/maps/es/config.ts` (Spanish). Spanish is the primary
official language and street addressing follows the Spanish pattern.

## Grammar
- **Order:** vía type + name FIRST, comma, then the house number
  ("Calle de Kenia, 42"). `order: "street-number"`, `typePlacement: "prefix"`.
- **Types:** copied verbatim from ES (Calle, Avenida, Paseo, Plaza, Carretera,
  … and abbreviations C/, Avda., …). `normalizeTypeCase: false`. Particles
  ("de", "de la", "del") stay with the name.
- **House number:** copied verbatim — optional nº/núm. marker, number or range,
  optional letter/bis suffix, or the no-number markers "s/n" / "km NN".
- **Secondary unit:** copied verbatim — "km NN" -> km; floor/floor+door
  ("3.º B", "2.º A", "Bajo") -> default type "Piso".

## Postcode
- **NONE.** Equatorial Guinea operates no postal-code system (Universal Postal
  Union lists no postcode). Modelled as the never-match sentinel
  `(?<postal_code>(?!x)x)`; the optional before-city postcode slot is skipped and
  the place tail is just the city.

## Known limitation (inherited from ES, kept for a faithful clone)
ES does not set `allowDigitsInName`, so date/number street names common in EG
("Avenida 3 de Agosto") are not modelled (the leading digit would be read as a
house number). Samples deliberately avoid digit-in-name streets; this is a
documented ES-family limitation, not GQ-specific.

## Place tail
- **City:** Malabo (capital), Bata, Ebebiyín, Mongomo, Luba, Evinayong,
  Aconibe.
- **Region / province:** ES's province-in-parentheses `regionPattern` was
  dropped (EG addresses do not use a routing province in this corpus) and
  `countyPattern` set to never-match `(?!x)x`.

## Country
`country: "GQ"`; `countryNames: ["Guinea Ecuatorial", "Equatorial Guinea",
"Guinée équatoriale", "Guiné Equatorial", "GNQ", "GQ"]`.

## Copied verbatim from ES
`houseNumberPattern`, `types` (TYPES), `secUnitPattern`/`secUnitDisplayMap`/
`defaultSecUnitType`. Changed: `code`, `country`, `countryNames`,
`postalPattern`; dropped `regionPattern` and added `countyPattern` never-match.

## Validation
`ISO2=gq` harness: **checked 37, failures 0, 0 skips.**
