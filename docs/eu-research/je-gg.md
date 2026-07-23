# Postal address formats: JERSEY (JE) and GUERNSEY (GG/GY)

Channel Islands / Crown Dependencies. Both are British Crown Dependencies (not part of
the UK, not the EU) with large offshore-finance sectors, so a very high proportion of the
addresses a parser sees are **corporate registered-office / registered-agent** addresses:
named office buildings, floors/suites, and PO boxes belonging to law firms, fund
administrators and trust/fiduciary companies (Ogier, Mourant, Carey Olsen, Aztec,
Ocorian, Northern Trust, CSC, etc.).

## Key point for the parser: they are UK-STYLE addresses

Order (little-endian, same as GB):

```
[building name]         (optional)
[house number] [street name + trailing type]
[town / parish]
[JERSEY | GUERNSEY]     (country line)
[UK-format postcode]    (LAST)
```

- **House/civic number comes FIRST**, before the street ("12 Hill Street", "44 Esplanade").
- **Postcode comes LAST** and is a **UK-format postcode**, so the existing UK postcode
  regex mostly already matches. Format is `AA9 9AA` style but with fixed area letters:
  - **Jersey**: `JE` + one digit + space + one digit + two letters -> `JE1 1AA` .. `JE4 9WG`.
    Districts: **JE1** large business users (St Helier commercial, incl. many finance
    firms), **JE2** central & eastern parishes, **JE3** western & northern parishes,
    **JE4** non-geographic / PO boxes, **JE5** bespoke. (No `JE0`.)
  - **Guernsey**: `GY` + digit(s) + space + digit + two letters -> `GY1 1AA` .. `GY10 1xx`.
    Districts: **GY1** St Peter Port (+ Herm/Jethou), **GY2** St Sampson, **GY3** Vale,
    **GY4** St Martin, **GY5** Castel, **GY6** Vale/St Andrew, **GY7** St Pierre du
    Bois/St Saviour, **GY8** Forest/Torteval, **GY9** **Alderney** (St Anne),
    **GY10** **Sark**. Note GY10 is **two digits before the space** — a UK postcode
    regex that assumes one or two outward-code chars must allow `GY10 1AA`.
- Post town (UPU) is literally **JERSEY** or **GUERNSEY**, but the meaningful locality is
  the **parish** (Jersey) or **parish / island** (Guernsey), which is what should populate
  `city`.

## Localities (what goes in `city`)

- **Jersey parishes**: St Helier, St Saviour, St Clement, Grouville, St Martin, Trinity,
  St John, St Mary, St Ouen, St Peter, St Lawrence, St Brelade. Written "St" or "Saint".
- **Guernsey parishes / islands**: St Peter Port, St Sampson, Vale, Castel, St Saviour,
  St Pierre du Bois, Torteval, Forest, St Martin, St Andrew; plus **St Anne** (the town of
  Alderney) and **Sark** (island). Herm and Jethou fall under GY1 / St Peter Port.

## Corporate / registered-agent pattern (very common offshore)

A large fraction of parseable addresses are finance-industry registered offices. Shapes:

- **Named building, no house number**: `Ogier House, The Esplanade, St Helier, Jersey,
  JE4 9WG`; `Trafalgar Court, Les Banques, St Peter Port, Guernsey, GY1 3DA`.
- **Building that is itself "<number> <street>"**: `44 Esplanade, St Helier, Jersey,
  JE4 9WG` (the building is branded "44 Esplanade" but parses as number 44 + street
  Esplanade); `1 IFC, St Helier, JE2 3BX`.
- **Floor / suite prefix**: `Floor 2, Trafalgar Court, Les Banques, ...`; `3rd Floor,
  IFC 5, Castle Street, St Helier, JE2 3BY`; `Suite 5, Regency Court, Glategny
  Esplanade, ...`.
- **PO Box** (often JE4 or a GY box): `PO Box 656, East Wing, Trafalgar Court, Les
  Banques, St Peter Port, Guernsey, GY1 3PP`.
- Real building names seen: **Ogier House, 44 Esplanade, 22 Grenville Street, IFC 1 / IFC
  5** (Jersey); **Trafalgar Court, Regency Court, Royal Bank Place, Plaza House, Frances
  House, Albert House** (Guernsey).

## Street types (English trailing type -> `type`)

Standard English trailing types appear and should be split off as `type`, leaving the
proper name in `street`:
Street, Road, Lane, Avenue, Terrace, Place, Row, Court, Crescent, Gardens, Close, Way,
Drive, Hill.
Examples: "Hill **Street**" -> street "Hill" / type "Street"; "Elizabeth **Avenue**" ->
street "Elizabeth" / type "Avenue"; "Mount **Row**" -> street "Mount" / type "Row".

### Special cases — type is NULL, whole thing is the street

- **"Esplanade"** — treated as part of the street name, NOT a separated type (matches the
  parser's convention here). So `44 Esplanade` -> street "Esplanade", type null;
  `The Esplanade` -> street "The Esplanade", type null; `Glategny Esplanade` /
  `South Esplanade` -> street kept whole, type null.
- **Article "The"** — many roads carry a leading definite article: **The Esplanade, The
  Parade, The Grange, The Bridge, The Avenue, The Pollet**. Keep "The …" in `street`,
  type null. The article must not be mistaken for a unit word or dropped.
- **French / Norman road names** (no English type word) — very common in both islands,
  especially outside the town centres: **Le Truchot, Le Pollet, Les Banques, Le
  Bordage / Bordage, Colomberie, Rouge Bouillon, Val Plaisant, La Route des Camps,
  Route Militaire, Les Gravées, Contrée Mansell, Rue à Don, Mont Crevelt**. These have
  **no trailing type** — the entire token string is the street, type null. A parser that
  requires a recognisable trailing type will fail these.

## Country

- Jersey -> `country` = **JE** (ISO 3166-1 alpha-2). Country line text "Jersey".
- Guernsey -> `country` = **GG** (ISO alpha-2). Country line text "Guernsey". (Postcode
  prefix is `GY`; the sample set uses **GG** for the country code.) Alderney and Sark are
  administratively within the Bailiwick of Guernsey, so they are `GG` too.

## Failure modes (≥ 8) — what breaks naive parsers

1. **Named-building addresses with no house number** ("Ogier House, The Esplanade, …"):
   parser expecting a leading number finds none; the building name must go to `building`,
   not `street`, and the first real token ("The Esplanade") is the street.
2. **Building that looks like number+street** ("44 Esplanade"): must still parse as
   number 44 + street "Esplanade" (building null), not dumped into `building`.
3. **"The Esplanade" / "The Parade" / "The Grange"** — leading article "The" mishandled
   (dropped, or "The" taken as a unit/number); type must be null, article retained.
4. **"Esplanade" as a standalone street with no type word** — a type-required parser
   leaves `street` empty or forces a bogus type.
5. **UK-format postcode with fixed islands prefix** — `JE`/`GY` area letters plus the
   **two-digit outward code `GY10`** (Sark) must be accepted; a regex hardcoded to
   English areas or to a single outward digit misroutes them.
6. **Parish as locality** ("St Helier", "St Peter Port", "St Sampson", "St Anne", "Sark")
   — "St"/"Saint" abbreviation, and multi-word parishes ("St Peter Port", "St Pierre du
   Bois") mis-split, or the parish swallowed into the street.
7. **PO Box lines** ("PO Box 656, East Wing, Trafalgar Court, …") — "PO Box 656" is not a
   street; the number 656 must not become the civic number, and the box needs its own
   unit fields.
8. **Floor / suite / wing prefixes** ("3rd Floor, IFC 5, …", "Suite 5, Regency Court, …",
   "East Wing, …") — the leading secondary-unit phrase must be split from the building /
   street, and its number ("3rd", "5") must not be taken as the civic number.
9. **French/Norman road names with no English trailing type** ("Les Banques", "Le
   Truchot", "Colomberie", "La Route des Camps") — no type token; whole string is street.
10. **Country line "Jersey"/"Guernsey"** sitting between the parish and the postcode —
    must be recognised as country, not as a second locality or part of the postcode.
11. **Alderney / Sark**: locality is the island town ("St Anne") or bare island name
    ("Sark", "Herm"), Bailiwick-of-Guernsey country code `GG`, GY9/GY10 postcodes; the
    parish/parseable town may be absent entirely (e.g. "Sark, GY10 1SD").
12. **Hyphenated / range civic numbers** ("19-21 Broad Street") and alpha suffixes
    ("40A Bath Street") on the house number.

## Sources

- JE postcode area, districts and parishes — https://en.wikipedia.org/wiki/JE_postcode_area ,
  https://worldpostalcode.com/jersey/jersey-channel-islands
- GY postcode area, GY1–GY10 incl. Alderney (GY9) / Sark (GY10) —
  https://en.wikipedia.org/wiki/GY_postcode_area
- Guernsey UPU addressing (post town GUERNSEY) —
  https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/ggyEn.pdf
- Guernsey Post address & postcode finder —
  https://www.guernseypost.com/address-and-postcode-finder
- Jersey finance registered offices — Ogier "44 Esplanade / Ogier House, The Esplanade,
  St Helier, JE4 9WG" https://www.ogier.com/locations/jersey/ ,
  https://www.jerseyfunds.org/jfa-members/ogier-3
- Guernsey finance registered offices — Northern Trust "Trafalgar Court, Les Banques,
  St Peter Port, GY1 3DA" https://www.northerntrust.com/ ; CSC "Plaza House, Elizabeth
  Avenue, St Peter Port, GY1 2HU" https://www.cscglobal.com/service/about/csc-office-locations/guernsey/ ;
  Ocorian "Floor 2, Trafalgar Court, Les Banques, GY1 4LY" https://www.ocorian.com/location/guernsey ;
  Aztec "PO Box 656, East Wing, Trafalgar Court, Les Banques, GY1 3PP" https://aztec.group/us/locations/guernsey/
- St Peter Port streets — https://geographic.org/streetview/guernsey/st_peter_port/st_peter_port.html
- St Helier streets — https://geographic.org/streetview/jersey/st_helier.html
