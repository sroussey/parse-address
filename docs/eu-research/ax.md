# Åland Islands (AX) — address research

**Sibling clone:** `src/maps/fi/config.ts` (Finnish/Swedish). Åland is an
autonomous, Swedish-speaking region of Finland and uses the Finnish postal
system.

## Grammar
- **Order:** street name FIRST, house number AFTER. `order: "street-number"`.
- **Type placement:** `fused`. Åland is Swedish-speaking, so streets end chiefly
  in the Swedish "-gatan" ("Torggatan" -> "Torg" + "gatan") and "-vägen"
  ("Skarpansvägen" -> "Skarpans" + "vägen"), both already present in FI's FUSED
  list, alongside the Finnish forms. `normalizeTypeCase: false`.
- **`spacedTypeExact: true`** (as FI).
- **minFusedStem** left at the FI default (3): a two-char stem such as
  "Nygatan" ("Ny") is below the threshold and is kept whole with no type — a
  sample documents this.
- **House number:** copied verbatim — range "6-8", dual "160/10", optional
  single-letter suffix that is NOT a stairwell ("4 A" -> civic "A", but "4 A 5"
  leaves "A 5" for the unit).
- **Secondary unit:** "as. 5" (apartment) or a bare stairwell+apartment "A 5"
  (`sec_unit_num_2`), default type "as." — copied verbatim.

## Postcode
- **5 digits, before the city** ("22100 Mariehamn"). Åland codes are the 22xxx
  range. Cloned FI's optional country prefix and widened it to accept the Åland
  form: `(?:(?:AX|FIN?)-)?(?<postal_code>\d{5})`.

## Place tail
- **City:** Mariehamn (the only town) plus municipality post-office localities
  (Jomala, Godby/Finström, Hammarland, Kastelholm/Sund, Storby/Eckerö, Ödkarby).
- **Region:** none; `countyPattern` never-match `(?!x)x`.

## Country
`country: "AX"`; `countryNames: ["Åland", "Aland", "Åland Islands", "Åländer",
"ALA", "AX"]`.

## Copied verbatim from FI
`houseNumberPattern`, `fusedTypeSuffixes`, `typeShortCodeMap`,
`spacedTypeExact`, `secUnitPattern`/`secUnitDisplayMap`/`defaultSecUnitType`.
Changed only `code`, `country`, `countryNames`, `postalPattern`, plus added
`countyPattern` never-match.

## Validation
`ISO2=ax` harness: **checked 37, failures 0, 0 skips.**
