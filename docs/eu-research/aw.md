# Aruba (AW) — address research

**Sibling clone:** `src/maps/nl/config.ts` (Dutch). Aruba is a constituent
country of the Kingdom of the Netherlands and inherits Dutch addressing.

## Grammar
- **Order:** street name FIRST, house number AFTER ("Wilhelminastraat 4").
  `order: "street-number"`.
- **Type placement:** `fused` — the type is a glued lowercase suffix
  ("-straat", "-weg", "-plein") peeled off the end of a single word. Many
  Aruban streets ("Caya Betico Croes", "Adriaan Lacle Boulevard", "Palm Beach",
  "Tanki Leendert") carry no separable fused type and are emitted whole.
  `normalizeTypeCase: false` (verbatim lowercase types, as NL).
- **`splitSpacedType: false`** (as NL): a fused word written separately is not
  split; only a glued suffix is peeled.
- **Toevoeging (addition):** copied verbatim from NL — "15A", "12-14" (dash
  dropped -> "14"), "130hs", "27bis", "82 C".

## Postcode
- **NONE.** Aruba has no postal-code system; mail is routed by town/district
  (Universal Postal Union lists no postcode for Aruba). Modelled as the
  never-match sentinel `(?<postal_code>(?!x)x)`, so the optional before-city
  postcode slot is simply skipped and the place tail is just the town.

## Place tail
- **City / town:** Oranjestad (capital), San Nicolas, Noord, Santa Cruz,
  Paradera, Savaneta. Districts/neighbourhoods (Malmok, Palm Beach, Tanki
  Leendert) can also stand as the place.
- **Region:** none. Aruba is a single unit; `countyPattern` set to never-match
  `(?!x)x` per the batch rule.

## Country
`country: "AW"`; `countryNames: ["Aruba", "ABW", "AW"]`.

## PO box
Dutch "Postbus" / "Antwoordnummer" (kept from NL).

## Copied verbatim from NL
`houseNumberPattern`, `fusedTypeSuffixes` (FUSED), `typeShortCodeMap`,
`splitSpacedType`, `poBoxNames`/`poBoxDisplayMap`. Changed only:
`code`, `country`, `countryNames`, `postalPattern`, plus `countyPattern`
never-match and dropped NL's `unsplittableExact: ["Vrijthof"]` (a Maastricht
square, irrelevant to Aruba).

## Validation
`ISO2=aw` harness: **checked 37, failures 0, 1 skip** (the skipped sample is
"…, Aruba" with the country name in the city slot — a documented ambiguity when
no real city precedes the country token).
