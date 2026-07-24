# Barbados (BB) Street Address Research

Research for the config-driven EU/Intl address parser. Barbados is an English-
speaking Caribbean country with a British-derived, number-first, trailing-type
grammar (same skeleton as GB / JM / BS). Focus: the parish-as-region model, the
2007 "BB#####" postcode that is usually omitted, and the very Barbadian "Gap"
street type.

---

## 1. Canonical address order

Number FIRST, then the street name + trailing TYPE, then a district/locality,
then the PARISH, then (optionally) the postcode:

```
[Number] [Street] [Type]      <- 12 Broad Street
[District / Locality]         <- Worthing
[Parish]                      <- Christ Church
[Postcode]                    <- BB15008   (often omitted)
BARBADOS
```

Single-line form used by parsers:

```
12 Broad Street, Bridgetown, St. Michael, BB11000
5 Worthing Main Road, Worthing, Christ Church, BB15008
Enterprise Gap, Oistins, Christ Church
```

So: **number first, suffix type, postcode LAST (after-city)** — the GB skeleton,
but the routing city is a locality/town and the **parish plays the role of
`state`**. The house number is frequently absent (rural houses are named or use
the district only).

---

## 2. Postcode

- Introduced 2007. Format: **`BB` + 5 digits** (`BB11000` Bridgetown Central,
  `BB15008`, `BB26025` Speightstown). Total 7 chars, no internal space.
- The first two digits after `BB` encode the parish/sorting district; the last
  three the delivery zone (UPU/BPS convention).
- Position: **LAST**, on the same line as the locality, after a space.
- **Usually omitted** in everyday and even official mail — routing is done by
  parish + locality. So the postcode must be OPTIONAL and the whole place tail
  must parse without it.
- Capture: `(?<postal_code>BB\d{5})`.

---

## 3. Street types (trailing suffix)

Type is a trailing SUFFIX (GB-style): `Broad Street`, `Whitepark Road`,
`Bolton Lane`, `Rendezvous Gap`. Common types: `Street, Road, Avenue, Lane,
Drive, Close, Court, Place, Crescent, Terrace, Boulevard, Way, Gardens, Grove,
Walk, Heights, Park, Circle, Row, Hill, Path, Highway, Rise` and, distinctively,
**`Gap`** — a short residential lane branching off a main road ("Rendezvous Gap",
"Enterprise Gap", "Worthing Gap"). Abbreviations echoed verbatim: `Rd, Ave, Dr,
Cres, Blvd, Hwy, Pl, Ln, Gdns, St`.

Type is OPTIONAL: some names are bare ("Brittons Cross Road" has a type, but a
locality like "Wildey" or an estate name has none). Rightmost type wins so
"Worthing Main Road" -> street "Worthing Main" + type "Road".

Belleville uses numbered avenues ("1st Avenue" .. "10th Avenue"); with a house
number in front ("3 3rd Avenue") the digit is safely inside the name.

---

## 4. House / building number variants

- Plain integer, number FIRST: `12`, `5`, `45`.
- **Glued letter suffix**: `12A` -> `civic_number_suffix`.
- **Range**: `10-12`.
- **`#` prefix**: `#7 High Street`.
- **No number** (common): `Bay Street, Bridgetown` / `Rendezvous Gap, Worthing`.

---

## 5. Secondary (sub-building) units

Lead the address (before the number), GB-style: `Apt`/`Apartment`, `Flat`,
`Unit`, `Suite`, `Shop`, `Lot`, `Room`, `Floor`, `Block`.
Form: `Apt 2, 5 Broad Street, Bridgetown, St. Michael`.

---

## 6. Locality, parish, country

- **District / locality** — the routing `city` slot: `Bridgetown`, `Speightstown`,
  `Holetown`, `Oistins`, `Worthing`, `Hastings`, `Rockley`, `Belleville`,
  `Bank Hall`, `Warrens`, `Fontabelle`, `Bagatelle`.
- **Parish** (11) -> `state`, the last comma-delimited segment before the
  postcode: `St. Michael`, `Christ Church` (NO "Saint"), `St. George`,
  `St. Philip`, `St. James`, `St. Thomas`, `St. Joseph`, `St. Andrew`,
  `St. John`, `St. Peter`, `St. Lucy`. Spelling variants `St.` / `St` / `Saint`
  are all normalized to the `St.` form. County is restricted to the parish list
  so the country name never lands in `state`.
- Country: `Barbados`, `BRB`, `BB`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: UPU S42 BB template, Barbados Postal Service, Smarty / PostGrid BB
guides, Google libaddressinput (`BB`), Wikipedia "Postal codes in Barbados",
Placevy Barbados address system write-up.

1. **Postcode almost always omitted.** A grammar that requires `BB#####` fails on
   the majority of real addresses; the whole place tail must be optional.
2. **Parish = state, not city.** `..., Worthing, Christ Church` — the parish is
   the region; a naive parser drops it into `city`. Restricting county to the
   parish list fixes it.
3. **`Christ Church` has no "Saint".** Parish alternations that assume every
   parish is `St. X` miss it, and its two words tempt a one-token grab.
4. **`St.` ambiguity.** The abbreviated street type `St` (Street) vs the parish
   prefix `St.` (Saint). The parish list is anchored to whole parish names, so
   "5 Bay St, ..., St. Michael" keeps type=`St`, state=`St. Michael`.
5. **"Gap" street type.** `Rendezvous Gap`, `Enterprise Gap` — non-GB type word
   that a generic suffix list omits.
6. **No house number.** `Bay Street, Bridgetown` and `Worthing Gap, Worthing` —
   number must be optional.
7. **Bare district/estate + parish (no thoroughfare).** `Hastings, Christ Church`,
   `Fairy Valley, Christ Church` — with a single `city` slot the parser takes the
   parish or the locality as street/city; modelled as `__skip`.
8. **Multi-word locality vs parish.** `Speightstown`, `Bank Hall`, `Six Roads`
   are localities; a comma before the parish keeps the two distinct.
9. **Rightmost-type streets.** `Worthing Main Road`, `Rockley New Road`,
   `Maxwell Main Road` — "Main"/"New" are also type-ish words; the rightmost
   type ("Road") must win.
10. **Numbered Belleville avenues.** `3 3rd Avenue` — a digit inside the name is
    only safe because the house number is consumed first.
11. **PO Box dominance in some parishes.** `P.O. Box 123, Bridgetown, St. Michael`
    — box replaces the thoroughfare.
12. **`BB` prefix collides with the country code.** The postcode literal `BB`
    equals the ISO-2 code; anchoring the postcode as `BB\d{5}` avoids treating a
    bare `BB` country token as a code.

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading integer (or range) + glued letter.
- `street` / `type` — name without the trailing suffix; type null when absent.
- `sec_unit_type` / `sec_unit_num` — leading `Apt`/`Flat`/`Shop`/... + value.
- `city` — district/town/locality before the parish (multi-word allowed).
- `state` — parish, normalized to the `St.`/`Christ Church` display form.
- `postal_code` — `BB#####`, kept verbatim; optional.
- `country` — `BB`.

---

## Sources

- UPU S42 Barbados addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/brbEn.pdf
- Barbados Postal Service (postcodes, 2007 scheme) — https://gisbarbados.gov.bb/
- NetSuite "Postal Code Barbados (BB11000) Guide" — https://netsuite.blog/postal-code-barbados-guide
- Placevy — Barbados Postal Address System (parishes, structure) — https://www.placevy.com/blog/barbados-postal-address-system-history-parish-structure-addressing-structure-and
- Umbrex — How to address a letter to Barbados — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-barbados/
- Wikipedia: Parishes of Barbados — https://en.wikipedia.org/wiki/Parishes_of_Barbados
- Google libaddressinput (BB metadata) — https://chromium-i18n.appspot.com/ssl-address/data/BB
