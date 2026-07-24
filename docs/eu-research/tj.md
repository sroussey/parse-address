# Tajikistan (TJ) — address research

## Scope
Romanized (Latin) form used in international / SEC filings. Native Cyrillic
(Tajik) and Russian-style prefix forms are out of scope.

## Grammar chosen
- **order:** `street-number`.
- **typePlacement:** `suffix` — English generic ("Rudaki **Avenue** 25").
- **postalPlacement:** `after-city` — 6-digit index after the city
  ("Dushanbe **734000**").
- Country code output: `TJ`.

## Thoroughfare types
English generics as a trailing suffix: Avenue, Street, Boulevard, Highway, Lane,
Square, Road, Passage (+ Ave/St/Blvd/Hwy). Echoed verbatim.

## Postcode
Six digits. Dushanbe 734000-range; Khujand 735700; Bokhtar 735140. Modeled
`\d{6}` after city.

## Regions (viloyat)
Sughd, Khatlon, and the autonomous province Gorno-Badakhshan (GBAO); the capital
Dushanbe and the Districts of Republican Subordination have no region. Region is
written between city and postcode with a "Region"/"viloyati" marker ("Khujand,
**Sughd Region** 735700"). `countyPattern` restricted to the real region list
with the marker required.

## Secondary units
Apartment `kv.`/`kvartira`/`apt`, office `office`/`ofis`.

## Dominant vs minority (what is __skip'd)
- Russian prefix "ulitsa Rudaki 25" / "prospekt Somoni 47" — skipped.
- Microdistrict form — skipped.
- Big-endian order — skipped.
- Native Cyrillic — out of scope, skipped.

## Sources
UPU addressing template; Google libaddressinput `tg`/`ru`; Wikipedia "Postal
codes in Tajikistan" (6-digit); ISO 3166-2:TJ region list. "Rudaki Avenue"
(Prospekti Rudaki), Dushanbe's main artery, is the canonical romanized example.
