# Svalbard and Jan Mayen (SJ) — address research

**Sibling clone:** `src/maps/no/config.ts` (Norwegian). Svalbard is a Norwegian
territory and uses the Norwegian postal system.

## Grammar
- **Order:** street name FIRST, house number AFTER. `order: "street-number"`.
- **Type placement:** `fused` — "Storgata" -> "Stor" + "gata", "Kirkeveien" ->
  "Kirke" + "veien". `normalizeTypeCase: false`. `splitSpacedType: true`,
  `spacedTypeExact: true` (as NO): a separate lowercase type word splits off
  ("Hilmar Rekstens vei" -> "Hilmar Rekstens" + "vei").
- Longyearbyen also uses bare numbered roads ("Vei 232"); "Vei" is too short a
  stem to fuse-split, so it is kept whole — a sample documents this.
- Non-fused settlement names (Skjæringa, Nybyen, Elvesletta, Bjørndalen) are
  emitted whole with no type.
- **House number:** copied verbatim — letter suffix not followed by digits ("5B"
  -> civic "B"; a dwelling code "H0203" is left for the unit), or range tail
  "-7".
- **Secondary unit:** "leil. 3" or a bare dwelling code "H0203"/"U0101"
  (`sec_unit_num_2`), default type "leil." — copied verbatim.

## Postcode
- **4 digits, before the city** ("9170 Longyearbyen"). Svalbard uses the 91xx
  range: 9170/9171 Longyearbyen, 9173 Ny-Ålesund, 9178 Barentsburg. Cloned NO's
  `(?<postal_code>\d{4})` unchanged.

## Place tail
- **City:** Longyearbyen, Ny-Ålesund, Barentsburg. Hyphenated names survive the
  permissive city pattern.
- **Region:** none; `countyPattern` never-match `(?!x)x`.

## Country
`country: "SJ"`; `countryNames: ["Svalbard", "Jan Mayen",
"Svalbard and Jan Mayen", "Svalbard og Jan Mayen", "SJM", "SJ"]` (NOT "Norway",
to avoid mis-consuming a Norwegian country token; not needed for these codes).

## Copied verbatim from NO
`houseNumberPattern`, `fusedTypeSuffixes`, `typeShortCodeMap`,
`splitSpacedType`, `spacedTypeExact`,
`secUnitPattern`/`secUnitDisplayMap`/`defaultSecUnitType`. Changed only `code`,
`country`, `countryNames`, `postalPattern` (kept identical shape), plus added
`countyPattern` never-match.

## Validation
`ISO2=sj` harness: **checked 37, failures 0, 0 skips.**
