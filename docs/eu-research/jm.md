# Jamaica (JM) Street Address Research

Research notes for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.

## 1. Canonical order

Jamaica follows the British/US **number-first** grammar: house **NUMBER first**,
then the street name with a **TRAILING type** ("12 Hope Road"). This is the same
order as GB/BM/IE and the opposite of continental Europe.

```
[unit,] [number] [Street name] [Type], [Town][ zone] , [Parish] [, Jamaica]
12 Hope Road, Kingston 10
5 Main Street, Ocho Rios, St. Ann
```

Config: `order: "number-street"`, `typePlacement: "suffix"`,
`postalPlacement: "after-city"`.

## 2. Postcode / postal zone (the JM-specific quirk)

Jamaica has **no nationwide postcode in daily use**. Two things appear:

- **Kingston / Corporate Area postal ZONE** — a legacy one/two-digit number
  written AFTER the town with no comma: "Kingston 10", "Kingston 5",
  "Kingston 20". Zones run roughly 1–20. This is the dominant "postcode" and is
  captured as `postal_code` ("10").
- **5-digit code** — Jamaica Post launched a national postal-code project in 2007
  (assigning 5-digit codes) but it was effectively abandoned and is only rarely
  written. Accepted (`\d{5}`) but seldom seen.

`postalPattern: (?<postal_code>\d{5}|\d{1,2})`, placed LAST (after the city).
Absence is the norm outside Kingston — the grammar leaves `postal_code` unset.

## 3. Street types (suffix, verbatim)

Type is the trailing word. Kept verbatim (`normalizeTypeCase: false`), short code
derived. Type-less streets exist (named areas like "Barbican").

Full: Street, Road, Avenue, Lane, Drive, Close, Court, Place, Crescent, Terrace,
Boulevard, Way, Gardens, Grove, Walk, Heights, Park, Circle, Mews, Rise, Row,
Hill, Gate, Plaza, Mall, Path, Pen, Run, Acres, Manor, Meadows, Gap, Highway.
Abbrev: Rd, Ave, Av, Dr, St, Cres, Blvd, Hwy, Pl, Cl, Ln, Gdns.

## 4. House number

Plain, range ("10-12"), optional glued letter ("12A"), optional leading "#".
`\#?\s*(?<number>\d+(?:-\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?`

## 5. Region: parish -> state

The **14 parishes** (+ Kingston) are the sub-national unit and map to `state`.
`countyPattern` is restricted to the parish list (with "St."/"St"/"Saint"
spelling variants) so a trailing country ("Jamaica") is never captured as a
parish, and `regionMap` canonicalises each variant to the "St. Ann" form.
Parishes: Kingston, St. Andrew, St. Catherine, Clarendon, Manchester,
St. Elizabeth, Westmoreland, Hanover, St. James, Trelawny, St. Ann, St. Mary,
Portland, St. Thomas.

## 6. Secondary units (leading)

`secUnitPlacement: "before"` — Apartment/Apt, Flat, Unit, Suite, **Shop**, Lot,
Room, Floor, Block ("Shop 5, 12 Constant Spring Road, Kingston 10").

## 7. PO Box

`P.O. Box 123` / `PO Box` — **plain numeric** (no letter prefix, unlike Bermuda/
Bahamas). Replaces the street entirely.

## 8. Failure modes (>= 8)

1. **Postal zone vs house number.** "12 Hope Road, Kingston 10" — "12" is the
   house number, "10" is the trailing postal zone; the zone must be peeled from
   the tail, not confused with the leading number.
2. **1-2 digit postcode.** Most parsers assume >= 4 digits; the Kingston zone is
   1–2 digits ("Kingston 5").
3. **Country stolen as parish.** With a permissive county pattern, "…, Jamaica"
   is grabbed as the parish/state. Fixed by restricting county to the parish set.
4. **"St." = Saint (parish) vs Street (type).** "5 High St, Port Maria, St. Mary"
   — the first `St` is the Street type, "St. Mary" is a parish. Position-based.
5. **Multi-word towns.** "Spanish Town", "Montego Bay", "May Pen", "Port Antonio",
   "Savanna-la-Mar" (hyphenated) must survive as one city token.
6. **Parish spelling variants.** "St. Ann" / "St Ann" / "Saint Ann" normalise to
   one canonical form.
7. **Rural district-only lines.** "Sligoville District, St. Catherine" has no
   street type; the district collapses into the city slot — marked `__skip`.
8. **Dependent locality (community before town).** "Flankers, Montego Bay,
   St. James" — three place segments; the community has nowhere to go — `__skip`.
9. **Housing-scheme "Lot N Scheme" form** ("Lot 25 Greater Portmore") — Lot is
   the number and the scheme is a type-less locality — `__skip`.
10. **Number range / letter suffix / "#"** ("10-12 Orange Street", "10A", "#7").
11. **Type-less streets** ("9 Barbican, Kingston 6") — `type` null without the
    name being swallowed.

## 9. Field mapping

number, civic_number_suffix, street (no type), type (verbatim), sec_unit_type/num
(leading), city (town), state (parish), postal_code (Kingston zone or 5-digit),
country (JM).

## Sources

- Universal Postal Union (UPU) — Postal addressing systems, Jamaica country page
  (S42 addressing templates). https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Wikipedia: "Postal codes in Jamaica" (Kingston postal zones; 2007 abandoned
  national scheme). https://en.wikipedia.org/wiki/Postal_codes_in_Jamaica
- Jamaica Post (Postal Corporation of Jamaica) — addressing guidance.
  https://www.jamaicapost.gov.jm/
- Wikipedia: "Parishes of Jamaica" (14 parishes + Kingston).
  https://en.wikipedia.org/wiki/Parishes_of_Jamaica
- Google libaddressinput metadata (JM: `fmt %N%n%O%n%A%n%C` — no postcode field).
- openvenues/libpostal — international address parsing corpus.
