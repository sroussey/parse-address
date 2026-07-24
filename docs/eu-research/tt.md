# Trinidad and Tobago (TT) Street Address Research

Research notes for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.

## 1. Canonical order

British-derived **number-first** grammar: house **NUMBER first**, street name +
**TRAILING type** ("12 Frederick Street"). Same order as GB/JM/BM.

```
[unit,] [number] [Street name] [Type], [City][ 6-digit code] [, Tobago] [, country]
12 Frederick Street, Port of Spain
5 Main Street, Scarborough, Tobago
```

Config: `order: "number-street"`, `typePlacement: "suffix"`,
`postalPlacement: "after-city"`.

## 2. Postcode (usually ABSENT)

Trinidad & Tobago normally has **no postcode**. TTPost introduced a **six-digit**
code in 2012 (first digits = region/parish, e.g. "120110" for parts of Port of
Spain), but it was never widely adopted and is **rarely written**. Accepted
(`\d{6}`, LAST after the city) but the overwhelming default is no code at all.

## 3. Street types (suffix, verbatim)

Full: Street, Road, Avenue, Lane, Drive, Close, Court, Place, Crescent, Terrace,
Boulevard, Way, Gardens, Grove, Walk, Square, Heights, Park, Circular, Circle,
Trace, Branch, Junction, Highway, Extension, Hill, Gate, Mall, Village.
Abbrev: Rd, Ave, Av, Dr, St, Cres, Blvd, Hwy, Pl, Cl, Ln, Ext.
Type-less thoroughfares occur ("Broadway", "Harris Promenade"). Many rural roads
are "<Eastern/Southern/Western> Main Road" — parsed as name "Eastern Main" +
type "Road".

## 4. House number

Plain, range, optional glued letter, optional "#" ("#5", "10A", "10-12").

## 5. Region: island (Tobago) -> state

TT has 14 regional/municipal corporations, but these are seldom written and
mostly coincide with the city name. The one region **routinely written is the
island — Tobago** ("Scarborough, Tobago", "Roxborough, Tobago"). So
`countyPattern` is restricted to `Tobago`; Trinidad addresses simply omit any
region. Restricting county to "Tobago" also prevents the country name
("Trinidad and Tobago") — whose "Trinidad" prefix would otherwise be captured —
from bleeding into `state`.

## 6. Secondary units (leading)

`secUnitPlacement: "before"` — Apartment/Apt, Flat, Unit, Suite, Shop, Lot, Room,
Floor, Block, and **LP** (Light Pole, a rural locator). ("Apt 3, 12 Ariapita
Avenue, Port of Spain").

## 7. PO Box

`P.O. Box 1234` / `PO Box` — plain numeric.

## 8. Failure modes (>= 8)

1. **No postcode at all.** The parser must produce a full parse with
   `postal_code` unset — the common case.
2. **Rare 6-digit code.** When present ("Port of Spain 120110") it sits after the
   city with no comma; must be peeled from the tail.
3. **Country "Trinidad and Tobago" vs region.** A permissive county pattern grabs
   "Trinidad" as a region. Fixed by county = "Tobago" only, and by ordering the
   country alternation longest-first ("Trinidad and Tobago" before "Trinidad").
4. **Multi-word cities.** "Port of Spain", "San Fernando", "Crown Point",
   "Rio Claro" must survive as one city token.
5. **Dependent locality (district before city).** "18 Ariapita Avenue, Woodbrook,
   Port of Spain" — Woodbrook is a district that the single-city grammar cannot
   place — `__skip`.
6. **"…Main Road" names.** "Eastern Main Road" — greedy name captures "Eastern
   Main", type "Road" (rightmost type wins).
7. **Corner / intersection form.** "Cor. Frederick & Queen Streets" not modelled
   — `__skip`.
8. **St = Street vs St. James (place).** "11 Long Circular Rd, St. James" — St.
   James is the city; "Circular" is part of the name, "Rd" the type.
9. **Range / letter suffix / "#"** ("1-3 Independence Square", "10A", "#5").
10. **Type-less streets** ("6 Broadway", "27 Harris Promenade").

## 9. Field mapping

number, civic_number_suffix, street, type (verbatim), sec_unit_type/num (leading),
city, state (Tobago only), postal_code (rare 6-digit), country (TT).

## Sources

- UPU — Postal addressing systems, Trinidad and Tobago country page.
  https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- TTPost (Trinidad & Tobago Postal Corporation) — postcode initiative (2012,
  six-digit). https://www.ttpost.net/
- Wikipedia: "Postal codes in Trinidad and Tobago".
  https://en.wikipedia.org/wiki/Postal_codes_in_Trinidad_and_Tobago
- Wikipedia: "Regional corporations and municipalities of Trinidad and Tobago".
- Google libaddressinput metadata (TT: `fmt %N%n%O%n%A%n%C` — no postcode field).
- openvenues/libpostal — international address parsing corpus.
