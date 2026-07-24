# The Bahamas (BS) Street Address Research

Research notes for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.

## 1. Canonical order

British-derived **number-first** grammar: house **NUMBER first** (frequently
written "#12"), street name + **TRAILING type** ("West Bay Street"). House numbers
are often omitted on major thoroughfares.

```
[unit,] [#number] [Street name] [Type], [Settlement/City] [, Island] [, country]
#12 Rosetta Street, Nassau
Queen's Highway, Marsh Harbour, Abaco
```

Config: `order: "number-street"`, `typePlacement: "suffix"`,
`postalPlacement: "after-city"`.

## 2. Postcode: NONE

The Bahamas has **no postcode system whatsoever**. The place tail is the
settlement/city and then the ISLAND, never a numeric code. `postalPattern` is a
never-match sentinel `(?<postal_code>(?!x)x)` so the "after-city" grammar always
uses its postcode-absent branch (city + optional island).

## 3. Street types (suffix, verbatim)

Full: Street, Road, Avenue, Drive, Lane, Highway, Boulevard, Court, Close,
Terrace, Way, Circle, Crescent, Hill, Gardens, Row, Corner, Heights, Estates,
Park, Walk, Alley.
Abbrev: Rd, Ave, Av, Dr, St, Hwy, Blvd, Cres, Ln.
Compass-led names common ("West Bay Street", "East Bay Street"). "Queen's
Highway" / "Kings Highway" are the standard Out-Island through-roads.

## 4. House number

Plain, range, optional glued letter, **optional leading "#"** (very common):
`\#?\s*(?<number>\d+(?:-\d+)?)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?`.
Numberless streets are fully supported (number optional).

## 5. Region: island -> state

The **island** is the sub-national unit and maps to `state` ("New Providence",
"Grand Bahama", "Abaco", "Eleuthera", "Exuma", "Harbour Island", "San Salvador",
"Great Inagua", "Bimini", "Long Island", "Cat Island", "Andros", …). `countyPattern`
is restricted to the island list (multi-word islands handled) so the country name
("Bahamas"/"The Bahamas") and ordinary districts (Palmdale, Oakes Field) are never
captured as `state`.

## 6. PO Box: LETTER-PREFIXED (the BS-specific quirk)

Bahamian boxes carry a **one/two-letter routing prefix** then a hyphen and digits:
`P.O. Box N-4818`, `P.O. Box SS-6301`, `P.O. Box EE-15071`, `P.O. Box F-42546`,
`P.O. Box AB-20218`. The prefix is kept as part of the box number.
`poBoxNumberPattern: (?:[A-Za-z]{1,2}\s*-?\s*)?\d+` (the plain-numeric form is
tolerated too). Box words: "P.O. Box", "PO Box", "P. O. Box".

## 7. Secondary units (leading)

`secUnitPlacement: "before"` — Apartment/Apt, Flat, Unit, Suite, Shop, Lot, Room,
Floor, Block.

## 8. Failure modes (>= 8)

1. **No postcode.** A numeric-postcode assumption breaks; the place tail is
   city + island. Sentinel pattern forces the postcode-absent branch.
2. **Letter-prefixed PO box.** "P.O. Box N-4818" — a plain `\d+` box pattern drops
   the "N-" zone; the prefix must be retained.
3. **Country stolen as island.** "…, Nassau, Bahamas" — a permissive county grabs
   "Bahamas" as the island/state. Fixed by restricting county to the island list.
4. **"#"-prefixed numbers.** "#12 Rosetta Street" — the "#" must be consumed
   (and in free-spacing/`x` mode escaped as `\#`).
5. **Numberless major streets.** "West Bay Street, Nassau" — no house number;
   `number` stays null without the street being mis-split.
6. **Dependent locality (district before city).** "#12 Rosetta Street, Palmdale,
   Nassau" — Palmdale district has nowhere to go — `__skip`.
7. **Settlement-only Out-Island lines.** "Dundas Town, Abaco" — no street type;
   the island collapses into the city slot — `__skip`.
8. **"off <street>" relative locators.** "Balls Alley, off Bay Street, Nassau"
   not modelled — `__skip`.
9. **Multi-word islands.** "Grand Bahama", "Harbour Island", "San Salvador",
   "Great Inagua", "New Providence" must match as one region token.
10. **"The" article names.** "The Mall Drive" — name "The Mall", type "Drive"
    (the article guard keeps "The" attached to the name).

## 9. Field mapping

number, civic_number_suffix, street, type (verbatim), sec_unit_type/num (leading;
letter-prefixed box number for PO boxes), city (settlement), state (island),
postal_code (never set), country (BS).

## Sources

- UPU — Postal addressing systems, Bahamas country page.
  https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Bahamas Postal Service — PO box addressing (letter-prefixed boxes).
  https://www.bahamas.gov.bs/ (Ministry / Postal Service)
- Wikipedia: "Postal codes" (Bahamas listed as having no postal code system).
- Wikipedia: "Districts of the Bahamas" / "Islands of the Bahamas".
  https://en.wikipedia.org/wiki/Local_government_in_the_Bahamas
- Google libaddressinput metadata (BS: `fmt %N%n%O%n%A%n%C, %S` — city + island,
  no postcode field).
- openvenues/libpostal — international address parsing corpus.
