# Swedish (SE) Street-Address Format — Research Notes

Research for a street-address parser/normalizer. Sources at bottom: PostNord/UPU
norms, libpostal, Google libaddressinput, OpenStreetMap, Skatteverket, Wikipedia.

## 1. Canonical order

A Swedish delivery address is written, top to bottom:

```
Sven Nilsson            <- recipient (name)
Roslagsgatan 10         <- street name + house NUMBER (number AFTER street)
113 51 Stockholm        <- POSTAL CODE (before) + CITY (after), no comma
SVERIGE                 <- country (only for international mail)
```

Key ordering facts that a parser must encode:

- **Street name comes first, house number AFTER it**: `Drottninggatan 5`
  (never `5 Drottninggatan`). This is opposite to English/US order.
- The locality line is **`PPP PP City`** — the **postal code precedes the city**,
  separated by a space, with **no comma** and no state/region. E.g. `111 51 Stockholm`.
- On a single flattened line people commonly write:
  `Drottninggatan 5, 111 51 Stockholm` (comma between street and locality).
- There is **no state/province** component in Swedish addresses. (Counties /
  *län* exist administratively but are never part of a postal address.)

## 2. Fused street-type suffixes (the hard part)

Unlike English ("Main **Street**"), Swedish street types are **fused onto the name
as a single closed compound word**, almost always in the **definite form**
(the `-en`/`-et` ending = "the"). `Drottninggatan` = "the queen('s) street",
one token. There is normally **no space** before the type.

Common fused suffixes (definite form listed first, then base/indefinite form):

| Fused suffix | Base form | Meaning | Example | Split |
|---|---|---|---|---|
| `-gatan` | `-gata` | the street | Drottninggatan | Drottning + gatan |
| `-vägen` | `-väg` | the road / way | Sveavägen | Svea + vägen |
| `-torget` | `-torg` | the square / market | Stortorget | Stor + torget |
| `-gränd` | `-gränden` | the alley / lane | Skomakargränd | Skomakar + gränd |
| `-plan` | (invariant) | the (open) square / plan | Odenplan | Oden + plan |
| `-platsen` | `-plats` | the place | Medborgarplatsen | Medborgar + platsen |
| `-stigen` | `-stig` | the path | Björkstigen | Björk + stigen |
| `-backen` | `-backe` | the hill / slope | Observatoriebacken | Observatorie + backen |
| `-leden` | `-led` | the route / highway | Söderleden | Söder + leden |
| `-allén` | `-allé` | the avenue | Karlaplan-allén | ... + allén |
| `-gången` | `-gång` | the walk / passage | Kyrkogången | Kyrko + gången |
| `-brinken` | `-brink` | the (steep) slope | Kåkbrinken | Kåk + brinken |
| `-vägens` etc | | genitive variants | (rare) | |

Notes:
- **`-gatan` and `-vägen` dominate** by a wide margin. `-gatan` = urban street,
  `-vägen` = larger thoroughfare or suburban/rural road.
- The **definite ending is part of the written name** and must be preserved
  when normalizing — you do NOT strip it to `-gata`/`-väg`. For a parser that
  wants a `street` + `type` split, the fused type token is `gatan`/`vägen`/etc.
- A **genitive `-s-` linker** often sits between name and type: `Kungsgatan`
  (Kung**s**gatan), `Hornsgatan`, `Sysslomansgatan`. When splitting off the
  suffix, that `-s-` stays with the name stem (`Kungs` + `gatan`).
- **Some street names are NOT fused compounds** and use a separate word:
  `Sergels torg`, `Norra Bantorget` (fused) vs `Sankt Petri Kyrkogata`,
  and avenue names like `Kungsportsavenyen` / `Avenyn` don't end in a listed
  type — treat as **unsplittable** (whole name in `street`, `type = null`).

## 3. House number

- Digits after the street: `5`, `10`, `27`, `100`.
- **Letter suffix is very common** and is glued or space-separated:
  `5A`, `12 B`, `27C`. The letter denotes a separate entrance/portion of the
  same civic number. Parser should split `5A` -> number `5`, suffix `A`.
- **Ranges**: `5-7`, `10-12` (a building spanning several numbers). Split
  number `5`, civic suffix `-7` (keep the range tail as the suffix).
- libpostal historically mis-parsed `Storgatan 5A` (the `A` got dropped or
  attached to the wrong field) — see issue #556.

## 4. Postal code

- Format **`PPP PP`**: 3 digits, a space, 2 digits. E.g. `111 51`, `113 22`,
  `411 36`, `211 34`, `753 21`.
- Regex: `\d{3}\s?\d{2}` (accept optional/absent space; canonical form HAS the
  space). Always normalize to `PPP PP` with a single space.
- The postal code **precedes the city** on the locality line.
- First digit ~ region, roughly rising south→north: Stockholm 1xx xx,
  Malmö/Skåne 2xx xx, Göteborg 4xx xx, Linköping 5xx xx, Uppsala 7xx xx,
  far north 9xx xx.
- Postal codes are **not padded/hyphenated** any other way; no letters.

## 5. City / locality

- Single token or multi-word (`Stockholm`, `Göteborg`, `Malmö`, `Upplands Väsby`,
  `Västra Frölunda`, `Sundbyberg`).
- **Swedish characters å ä ö** appear in cities AND street names
  (`Göteborg`, `Malmö`, `Långgatan`, `Svartbäcksgatan`, `Åsögatan`). A parser
  must be UTF-8 clean and must NOT fold `å/ä/ö` to `a/o` (they are distinct
  letters, sorted after `z`). `é` also occurs (`Linnégatan`, `Allén`).

## 6. Secondary units (apartment / floor)

- **`lgh` = lägenhet (apartment)** followed by the apartment number, placed
  AFTER the house number: `Storgatan 5, lgh 1201`. The national apartment
  number is **4 digits** (Skatteverket standard): first 2 = floor (ground = 10,
  up = 11,12…, down = 09,08…), last 2 = position on floor. So `1201` = 12th
  code floor, unit 01. Values like `1001`, `1101`, `1201` are typical.
- **`tr` = trappa/trappor (stairs = floor)**: `3 tr`, `tr 3`, `4 tr`. Denotes
  which floor (staircase level), distinct from the `lgh` number.
- Other seen tokens: `vån` (våning = floor), `ub`/`bv` (basement/ground). Rare.
- Order on a flattened line varies: `Storgatan 5A, lgh 1201, 211 34 Malmö`.

## 7. Country variants

- Native: **`Sverige`** (often upper-cased `SVERIGE` on the last line).
- English: **`Sweden`**.
- ISO code: **`SE`** (alpha-2), `SWE` (alpha-3). Normalize all to `SE`.

## 8. Prior work

- **libpostal** (openvenues/libpostal): statistical parser trained on OSM;
  handles Swedish `-gatan`/`-vägen` as part of the `road` token (it does NOT
  split name vs type). Known Swedish weak spot: house-number letter suffix
  (`5A`) — issue #556.
- **Google libaddressinput** (i18n address data): SE format string is
  `%O%n%N%n%A%n%Z %C` — organization / name / address lines / `Zip City`.
  Confirms `Z` (postal) BEFORE `C` (city), no state field, `require: ACZ`.
- **OpenStreetMap**: `addr:street` holds the full fused name incl. type
  (`addr:street=Drottninggatan`), `addr:housenumber=5` (letters kept: `5A`),
  `addr:postcode=111 51`, `addr:city=Stockholm`.
- **PostNord / UPU S42**: locality line `postcode + space + town`, uppercase
  town for machine sorting; no comma.

## 9. Failure modes to test (8+)

1. **Fused `-gatan` / `-vägen`**: naive tokenizer treats `Drottninggatan`
   as a single opaque token and can't separate name from type
   (`Drottning` + `gatan`).
2. **Definite-form types**: type is `gatan` not `gata`, `vägen` not `väg` —
   a dictionary keyed on base forms misses them.
3. **Postal `111 51` internal space**: the space inside the postal code makes
   it look like two tokens; a whitespace tokenizer splits it and mis-assigns
   `51` to the city or the street number. Must match `\d{3}\s?\d{2}` as a unit.
4. **House-number letter suffix `5A` / `12 B`**: letter absorbed into street
   name, dropped, or mistaken for a secondary unit.
5. **Apartment `lgh 1201`**: 4-digit `lgh` value mistaken for a postal code or
   a house number; `lgh` token unrecognized.
6. **`å / ä / ö` (and `é`)**: encoding corruption or folding to `a/o/e` breaks
   dictionary lookups and changes the identity of the street (`Åsögatan`,
   `Malmö`, `Långgatan`, `Linnégatan`).
7. **Multi-word street names**: `Birger Jarlsgatan`, `Sankt Eriksgatan`,
   `Sankt Persgatan` — the name has internal spaces before the fused type.
8. **`Stora Nygatan` / `Stora Södergatan` / `Övre Husargatan`**: leading
   modifier words (`Stora`/`Lilla`/`Norra`/`Södra`/`Övre`/`Nedre` = big/little/
   north/south/upper/lower) plus a fused type; easy to over- or under-split.
9. **Genitive `-s-` linker**: `Kungsgatan`, `Hornsgatan` — deciding whether the
   `s` belongs to the stem or the type.
10. **Number-before-street mis-order**: applying US "number first" logic
    reverses the fields.
11. **Unsplittable / non-listed types**: `Kungsportsavenyen`, `Avenyn`,
    `Odenplan` (`plan` invariant), `Kåkbrinken` — must fall back to whole name.
12. **Country token variants** `Sverige` / `Sweden` / `SE` / `SWE` trailing
    the address.

## Sources
- https://www.smarty.com/global-address-formatting/sweden-format-examples
- https://www.postgrid.com/global-address-format/sweden-address-format/
- https://en.wikipedia.org/wiki/Postal_codes_in_Sweden
- https://github.com/openvenues/libpostal (issue #556, address_parser)
- https://www.skatteverket.se/servicelankar/otherlanguages/englishengelska/individualsandemployees/reportingachangeofaddress/apartmentnumbers.4.40cab8f8197edf03e641881.html
- https://en.wiktionary.org/wiki/Storgatan
- https://en.wikipedia.org/wiki/Birger_Jarlsgatan
- https://en.wikipedia.org/wiki/Kungsportsavenyen
- Google libaddressinput (chromium-i18n address metadata, region SE)
- OpenStreetMap addr:* tagging wiki
