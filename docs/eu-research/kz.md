# Kazakhstan (KZ) — address research

## Scope
Romanized (Latin) form used in international / SEC filings. Native Cyrillic and
Russian-style prefix forms are out of scope.

## Grammar chosen
- **order:** `street-number` — name leads, number trails the type.
- **typePlacement:** `suffix` — English generic ("Abay **Avenue** 10").
- **postalPlacement:** `after-city` — 6-digit index follows the city
  ("Almaty **050000**").
- Country code output: `KZ`.

## Thoroughfare types
Dominant romanized form uses English generics as a trailing suffix:
Avenue, Street, Boulevard, Highway, Lane, Square, Road, Passage (+ Ave/St/Blvd/Hwy).
Type is echoed verbatim (`normalizeTypeCase:false`); a short code is derived.

## Postcode
Six digits (index), written after the city. First examples: Almaty 050000,
Astana 010000, Shymkent 160000. Modeled `\d{6}`.

## Regions (oblys / oblystar)
17 regions, disjoint from cities of republican significance (Almaty, Astana,
Shymkent). Written between city and postcode with a "Region" (or "oblysy")
marker: "Kokshetau, **Akmola Region** 020000". `countyPattern` is restricted to
the real 17-name list AND requires the trailing marker, so the city Almaty is
never mistaken for the Almaty region.

## Secondary units
Apartment `kv.`/`kvartira`/`apt`, office `office`/`ofis`. Building house number
is the primary trailing number.

## Dominant vs minority (what is __skip'd)
- Russian prefix generic "ulitsa Abaya 10" / "prospekt Dostyk 12" — minority; skipped.
- Microdistrict (mikrorayon) form with no street type — skipped.
- Big-endian "050000, Almaty, ulitsa ..." — skipped.
- Native Cyrillic — out of scope, skipped.

## Sources
Universal Postal Union / Kazpost addressing guide; Google libaddressinput
`kk`/`ru` templates (%N %O / %A / %C %Z); Wikipedia "Postal codes in
Kazakhstan" (6-digit); ISO 3166-2:KZ region list. English-suffix romanization
reflects the transliteration used in EDGAR filings by KZ-domiciled issuers.
