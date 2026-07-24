# Kyrgyzstan (KG) — address research

## Scope
Romanized (Latin) form used in international / SEC filings. Native Cyrillic and
Russian-style prefix forms are out of scope.

## Grammar chosen
- **order:** `street-number`.
- **typePlacement:** `suffix` — English generic ("Chuy **Avenue** 120").
- **postalPlacement:** `after-city` — 6-digit index after the city
  ("Bishkek **720000**").
- Country code output: `KG`.

## Thoroughfare types
English generics as a trailing suffix: Avenue, Street, Boulevard, Highway, Lane,
Square, Road, Passage (+ Ave/St/Blvd/Hwy). Echoed verbatim.

## Postcode
Six digits. Bishkek 720000/720001/...; Osh 723500. Modeled `\d{6}` after city.

## Regions (oblast / oblasttar)
Seven regions: Batken, Chuy, Jalal-Abad, Naryn, Osh, Talas, Issyk-Kul, plus the
two republican cities Bishkek and Osh. Region is written between city and
postcode with a "Region"/"oblasty" marker ("Karakol, **Issyk-Kul Region**
722200"). `countyPattern` restricted to the real seven-name list with the
marker required, so the city Osh is not confused with the Osh region.

## Secondary units
Apartment `kv.`/`kvartira`/`apt`, office `office`/`ofis`.

## Dominant vs minority (what is __skip'd)
- Russian prefix "ulitsa Kievskaya 96" / "prospekt Chuy 120" — skipped.
- Microdistrict (mkr) form — skipped.
- Big-endian order — skipped.
- Native Cyrillic — out of scope, skipped.

## Sources
UPU addressing template; Google libaddressinput `ky`/`ru`; Wikipedia "Postal
codes in Kyrgyzstan" (6-digit); ISO 3166-2:KG region list. Bishkek's landmark
"Chuy Avenue" (Chuy prospekti) is the canonical romanized example.
