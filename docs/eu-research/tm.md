# Turkmenistan (TM) — address research

## Scope
Romanized (Latin) form used in international / SEC filings. Turkmen officially
uses Latin script. Native Cyrillic, the Turkmen "köçesi" suffix, and Russian
prefix forms are out of scope.

## Grammar chosen
- **order:** `street-number`.
- **typePlacement:** `suffix` — English generic ("Magtymguly **Avenue** 74").
- **postalPlacement:** `after-city` — 6-digit index after the city
  ("Ashgabat **744000**").
- Country code output: `TM`.

## Thoroughfare types
English generics as a trailing suffix: Avenue, Street, Boulevard, Highway, Lane,
Square, Road, Passage (+ Ave/St/Blvd/Hwy). Echoed verbatim. (The Turkmen native
generic "köçesi" is the minority written form and is __skip'd.)

## Postcode
Six digits. Ashgabat 744xxx; Turkmenabat 746100; Mary 745400. Modeled `\d{6}`
after city.

## Regions (welayat / welayatlar)
Five regions: Ahal, Balkan, Dashoguz, Lebap, Mary, plus Ashgabat city. Region is
written between city and postcode with a "Region"/"welayaty" marker
("Turkmenabat, **Lebap Region** 746100"). `countyPattern` restricted to the five
real names with the marker required, so the city Mary is not confused with the
Mary region.

## Secondary units
Apartment `kv.`/`kvartira`/`apt`, office `office`/`ofis`.

## Dominant vs minority (what is __skip'd)
- Russian prefix "ulitsa Magtymguly 74" — skipped.
- Turkmen-suffix "Magtymguly köçesi 74" — minority; skipped.
- House/block (jaý/kod, "H/12, K/3") code form — skipped.
- Big-endian order — skipped.
- Native Cyrillic — out of scope, skipped.

## Sources
UPU addressing template; Google libaddressinput `tk`/`ru`; Wikipedia "Postal
codes in Turkmenistan" (6-digit); ISO 3166-2:TM region list. "Magtymguly Avenue"
(Magtymguly şaýoly), Ashgabat's main avenue, is the canonical romanized example.
