# Australia (AU) Street Address Research

Research notes for a TypeScript / XRegExp config-driven address parser. Focus:
Australia Post "Correct Addressing" standard, AS/NZS 4819 (rural & urban
addressing), UPU S42 template, and real business addresses.

---

## 1. Canonical address order

Australia writes the **house/building NUMBER first, then the street name + type**,
exactly like the US/UK (number-first). The place line puts **SUBURB, STATE and
POSTCODE together on the final line**, in that order, conventionally in capitals:

```
[Recipient]
[Sub-dwelling / Unit]        <- e.g. "Unit 3" or the "3/" of "3/17"
[Number  Street  Type]       <- e.g. "219-241 Cleveland Street"
SUBURB  STATE  POSTCODE      <- e.g. "STRAWBERRY HILLS NSW 1427"
[AUSTRALIA]
```

Single-line / comma-joined forms used by parsers:

```
219-241 Cleveland Street, Strawberry Hills NSW 1427
Unit 3, 17 Adam Street, Hornsby NSW 2077
3/17 Adam Street, Hornsby NSW 2077
```

Key rule: the **postcode is LAST** (after suburb + state). The **state
abbreviation sits between the suburb and the 4-digit postcode**. In the canonical
Australia Post layout there is NO comma between suburb, state and postcode
("STRAWBERRY HILLS NSW 1427") — they are space-separated on one line — though
data-entry forms often insert a comma ("Strawberry Hills, NSW 1427").

---

## 2. Postcode shape

- **Exactly 4 digits**, no letters, no space, e.g. `2000`, `3000`, `4000`, `6000`,
  `0800` (Darwin/NT can start with 0), `1427` (a large-volume-receiver code).
- First digit maps to state/territory: 2 = NSW/ACT, 3 = VIC, 4 = QLD, 5 = SA,
  6 = WA, 7 = TAS, 0 = NT (0800-0899) and ACT (0200-0299). So the postcode alone
  does not disambiguate NSW vs ACT (both start 2) — the **state token is still
  needed**, which is why AU always prints the state abbreviation.
- Regex: `\d{4}`.

## 3. State / territory (always present, abbreviated)

| Territory                     | Abbrev |
|-------------------------------|--------|
| New South Wales               | NSW    |
| Victoria                      | VIC    |
| Queensland                    | QLD    |
| South Australia               | SA     |
| Western Australia             | WA     |
| Tasmania                      | TAS    |
| Northern Territory            | NT     |
| Australian Capital Territory  | ACT    |

The state is a mandatory element of a correct Australian address and always
appears immediately before the postcode. Maps to the `state` field.

---

## 4. Street (thoroughfare) types — SUFFIX, with Australia Post abbreviations

The type is a **trailing suffix** ("Cleveland Street" -> name "Cleveland",
type "Street"). Australia Post publishes standard abbreviations; both the full
word and the abbreviation occur in real data.

| Full type | Abbrev | Full type | Abbrev |
|-----------|--------|-----------|--------|
| Street    | St     | Parade    | Pde    |
| Road      | Rd     | Place     | Pl     |
| Avenue    | Av / Ave | Terrace | Tce    |
| Drive     | Dr     | Court     | Ct     |
| Lane      | Ln     | Close     | Cl     |
| Crescent  | Cr / Cres | Circuit | Cct  |
| Grove     | Gr     | Boulevard | Bvd / Blvd |
| Highway   | Hwy    | Esplanade | Esp    |
| Way       | Way    | Square    | Sq     |
| Rise      | Rise   | Heights   | Hts    |
| Cove      | Cove   | Gardens   | Gdns   |
| Circle    | Cir    | Mews      | Mews   |
| Loop      | Loop   | Walk      | Wlk    |
| Row       | Row    | Quay      | Qy     |
| Vista     | Vsta   | Promenade | Prom   |

Other common types: Alley, Arcade, Bend, Brace, Break, Bypass, Chase, Circus,
Concourse, Corner, Crossing, Dale, Dell, Distributor, Elbow, End, Entrance,
Fairway, Flat, Freeway, Frontage, Gate, Glade, Glen, Green, Hill, Island,
Junction, Key, Landing, Link, Mall, Meander, Nook, Outlook, Parkway, Pass,
Pathway, Pocket, Pursuit, Reserve, Ridge, Ridgeway, Rest, Retreat, Ring, Round,
Route, Serviceway, Strand, Tarn, Terrace, Track, Trail, Turn, Vale, View,
Waters. (Australia has an unusually large official type vocabulary ~200 entries.)

A minority of thoroughfares are **type-less** (e.g. "Broadway" in Sydney, "The
Esplanade", "Eastern Valley Way" where Way is the type). The parser must tolerate
a type-less street.

---

## 5. House / building number variants

- Plain: `10`, `221`, `1`.
- **Range**: `219-241`, `2-8` (whole thing is one number token).
- **Letter suffix**: `17A`, `2B` -> number `17`, civic_number_suffix `A`.
- **Unit-slash-street notation (very Australian)**: `3/17 Adam Street` means
  **Unit 3 at street number 17**. The number BEFORE the slash is the
  sub-dwelling/unit; the number AFTER the slash is the street number. So
  `3/17` -> sec_unit_num `3` (implied type Unit), number `17`.
  Also `12A/34`, `5/45 Ocean Avenue`.
- **Leading unit word**: `Unit 3, 17 Adam Street`, `Flat 2, ...`, `Suite 5, ...`,
  `Level 12, ...`, `Shop 4, ...` — the unit precedes the street number (comma).
- **PO Box / no thoroughfare**: `PO Box 1234`, `GPO Box 9848`, `Locked Bag 20`,
  `Private Bag 4004`, `RMB 1234` / `RSD` (rural).

---

## 6. Secondary (sub-dwelling) units

Common unit keywords: `Unit` (U), `Flat`, `Apartment` (Apt), `Suite`, `Shop`,
`Level` (L), `Office`, `Villa`, `Townhouse`, `Factory`, `Penthouse`, `Kiosk`,
`Room`, `Site`, `Berth`. Forms:

- `Unit 3, 17 Adam Street` -> sec_unit_type Unit, sec_unit_num 3.
- `3/17 Adam Street` -> the `3/` is the unit (implied Unit).
- `Level 5, 60 Margaret Street` -> Level 5.
- `Shop 12, 500 Oxford Street` -> Shop 12.
- Unit number may carry a letter: `Unit 3B`.

The leading-unit order (unit before number, comma-joined) mirrors the UK.

---

## 7. Suburb / locality, state, country

- **Suburb / locality**: the town or suburb name immediately before the state
  token (e.g. `Strawberry Hills`, `Surry Hills`, `North Sydney`, `St Kilda`).
  Australia Post routes on suburb+state+postcode, NOT on a separate city — the
  suburb IS the locality line. Multi-word suburbs are common
  (`Kings Cross`, `Broken Hill`, `Coffs Harbour`, `Alice Springs`).
- **State**: one of the 8 abbreviations above (§3), before the postcode.
- **Country**: `Australia`, `AU`, `AUS`. Optional trailing token -> `country=AU`.

Field mapping: suburb -> `city`; state abbrev -> `state`; 4-digit -> `postal_code`.

---

## 8. Failure modes a parser must handle (>=8)

1. **State token between suburb and postcode with NO comma.** The canonical
   "Strawberry Hills NSW 1427" has suburb, state and postcode space-separated on
   one line. A grammar that only captures a comma-delimited state folds "NSW"
   into the suburb ("Strawberry Hills NSW"). Must peel the state abbreviation
   even when it is not comma-delimited.
2. **Unit-slash-street `3/17`.** `3/17 Adam Street` must become unit 3 + street
   number 17, NOT number 3 with "/17" bleeding into the street, and not number
   "3/17". The number after the slash is the street number.
3. **Number ranges `219-241`.** A naive `\d+` grabs only `219`. Treat the whole
   `219-241` as one number token.
4. **Letter suffix `17A`.** Split to number 17 + suffix A, not "17A" as one token
   and not "A Adam Street".
5. **Type-less streets.** `Broadway`, `The Esplanade`, and roads whose only word
   is the name must parse with `type` null without the name being eaten by the
   suburb.
6. **Large, exotic type vocabulary.** AU has ~200 official street types
   (Cct=Circuit, Esp=Esplanade, Bvd=Boulevard, Rise, Cove, Nook, Pursuit, ...).
   A short US/UK type list mis-classifies these as type-less or mis-splits them.
7. **State abbreviation collides with a suburb word.** `WA` (Western Australia)
   vs a suburb; `NT`; `SA`. Anchor the state as the token(s) directly before the
   4-digit postcode, constrained to the 8 valid codes, so a suburb word is not
   mistaken for a state.
8. **NSW/ACT and NT postcode overlap.** Postcode first digit 2 covers both NSW
   and ACT; NT uses 08xx (leading zero). The state cannot be derived from the
   postcode alone, so the printed state token must be preserved, not recomputed.
9. **Multi-word suburbs.** `North Sydney`, `Coffs Harbour`, `Alice Springs`,
   `Surfers Paradise` — grabbing only one token before the state truncates them.
10. **Leading `Unit`/`Level`/`Shop` vs street number.** `Unit 3, 17 Adam Street`
    — the `3` is the unit, the real street number is `17` after the comma. Naive
    parsers take `3` as the house number.
11. **PO Box / GPO Box / Locked Bag / Private Bag / RMB** replace the street
    entirely; `number`/`street` are null.
12. **Abbreviated vs full type in the same corpus.** `St` and `Street`,
    `Rd`/`Road`, `Cr`/`Cres`/`Crescent` all appear; the dictionary must cover
    both spellings and canonicalise.

---

## Sources

- Australia Post — Addressing guidelines — https://auspost.com.au/sending/guidelines/addressing-guidelines
- Australia Post — Correct Addressing Standards (Appendix 1) — https://auspost.com.au/content/dam/auspost_corp/media/documents/Appendix-01.pdf
- Australia Post — Address Presentation Standards (1999) — https://auspost.com.au/content/dam/auspost_corp/media/documents/australia-post-addressing-standards-1999.pdf
- Australia Post — Barcode hints & common abbreviations — https://auspost.com.au/content/dam/auspost_corp/media/documents/Barcode_hints_tips.pdf
- UPU S42 — Australia postal addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/ausEn.pdf
- Wikipedia — Postcodes in Australia — https://en.wikipedia.org/wiki/Postcodes_in_Australia
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
- Addressfinder AU — street types — https://addressfinder.com/au/blog/can-you-provide-a-list-of-street-types-au
- PostGrid — Australia address format — https://www.postgrid.com/global-address-format/australia-address-format/
