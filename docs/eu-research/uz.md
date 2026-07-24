# Uzbekistan (UZ) — address research

## Scope
Romanized (Latin) form. Uzbek officially uses Latin script, and the native
generic street noun is used in the dominant written form. Native Cyrillic and
Russian prefix forms are out of scope.

## Grammar chosen
- **order:** `street-number`.
- **typePlacement:** `suffix` — Uzbek izafet noun ("Amir Temur **ko'chasi** 15").
- **postalPlacement:** `after-city` — 6-digit index after the city
  ("Tashkent **100000**").
- Country code output: `UZ`.

## Thoroughfare types (suffix nouns)
- `ko'chasi` / `ko'cha` (street) — most common
- `prospekti` (avenue)
- `maydoni` (square), `yo'li` (road)
- abbreviation `ko'ch.`

The ASCII-apostrophe spelling of the Uzbek okina (oʻ/gʻ -> o'/g') is handled:
inputs use `ko'chasi`, `yo'li`. Type echoed verbatim; short code derived.

## Postcode
Six digits. Tashkent 100xxx; Samarkand 140100; Bukhara 200100; Andijan 170100.
Modeled `\d{6}` after city.

## Regions (viloyat / viloyatlar)
12 regions + the Republic of Karakalpakstan + Tashkent city. Region is written
between city and postcode with a "Region"/"viloyati" marker ("Samarkand,
**Samarkand Region** 140100"). `countyPattern` restricted to the real viloyat
list with the marker required, so the city Tashkent/Samarkand is never mistaken
for the same-named region.

## Secondary units
Apartment `xonadon` (native) / `kv.` / `kvartira` / `apt`, office `ofis`.

## Dominant vs minority (what is __skip'd)
- Russian prefix "ulitsa Navoi 30" / "prospekt Amir Temur 107" — skipped.
- Mahalla / kvartal housing-block form ("12-kvartal, 5-uy") — skipped.
- Big-endian order — skipped.
- Native Cyrillic — out of scope, skipped.

## Sources
UPU addressing template; Google libaddressinput `uz`/`uz-Cyrl`/`ru`; Wikipedia
"Postal codes in Uzbekistan" (6-digit); ISO 3166-2:UZ region list. "Amir Temur
ko'chasi/prospekti", Tashkent's central axis, is the canonical example. Uzbek
Latin okina normalised to the ASCII apostrophe per SEC-filing transliteration.
