# Singapore (SG) Street Address Research

Research notes for a config-driven XRegExp address parser. Focus: SingPost
addressing, the 6-digit postal-code system (from 1995), IMDA/OneMap conventions,
the UPU S42 template, and real addresses.

---

## 1. Canonical address order

Singapore writes the **BLOCK number FIRST, then the street/road name + type, then
the #floor-unit, then "Singapore" + the 6-digit postal code**:

```
[Recipient]
[Blk] Number  Street  Type   <- e.g. "Blk 35 Mandalay Road"
#Floor-Unit                  <- e.g. "#13-37"   (optional)
SINGAPORE  Postcode          <- e.g. "SINGAPORE 308215"
```

Single-line / comma-joined forms:

```
Blk 35 Mandalay Road #13-37, Singapore 308215
1 Raffles Place #20-01, Singapore 048616
10 Bayfront Avenue, Singapore 018956
Blk 123 Ang Mo Kio Avenue 3 #12-34, Singapore 560123
```

Key rules:
- **No state / province / region.** Singapore is a city-state; the address has no
  state field at all.
- **The word "Singapore" precedes the postcode** ("Singapore 048616"). This is
  effectively the country/city marker; treat "Singapore" here as the country
  token, NOT as a city street token.
- **Postcode is LAST**, a **6-digit** number.
- The **`#floor-unit`** (e.g. `#12-34`) is the secondary unit and sits AFTER the
  street, before "Singapore". `#` = start-of-unit marker, `12` = floor, `34` =
  unit within the floor.

---

## 2. Postcode shape

- **Exactly 6 digits**, no space, no letters: `048616`, `018956`, `560123`,
  `308215`, `069045`, `018989`. Leading zeros are common and significant.
- First 2 digits = postal sector; last 4 = specific delivery point (a block or a
  standalone building). A large building has its own unique code.
- Regex: `\d{6}`.

---

## 3. Block number and street/road name

- **Block number**: written `Blk 123`, `Block 123`, or bare `123`. Public-housing
  (HDB) and many private developments are laid out in numbered blocks; the block
  number is modelled as the **house `number`**. May carry a letter: `Blk 123A`.
- **Standalone buildings** may use a plain street number instead of a block:
  `1 Raffles Place`, `10 Bayfront Avenue`, `2 Orchard Turn`.
- **Street/road type is a SUFFIX**: Road, Street, Avenue, Lane, Drive, Crescent,
  Close, Walk, Link, Rise, Terrace, Place, Way, Park, Green, View, Gardens, Grove,
  Loop, Boulevard, Quay, Circle, Central, Heights, Hill, Vale, Ring, Plaza,
  Promenade, Mall, Circus, Bank, Field.
- **Numbered roads**: `Ang Mo Kio Avenue 3`, `Bedok North Avenue 1`,
  `Tampines Street 81`, `Jurong West Street 42`. Here a **number follows the type
  word** — the road name is the whole "Ang Mo Kio Avenue 3". A plain suffix parser
  that expects the type at the very end mis-handles the trailing number (see
  failure modes). Ground truth treats the entire "Ang Mo Kio Avenue 3" as the road
  name for these (type left null, or Avenue + trailing number noted).
- **Malay/Tamil prefixed roads**: `Jalan Besar`, `Jalan Bukit Merah`,
  `Lorong 3 Geylang`, `Lengkok Bahru`, `Upper Cross Street`. `Jalan` (= road) and
  `Lorong` (= lane) are **prefixes**, so these have no trailing English type and
  parse as type-less whole names.

---

## 4. Secondary unit — the `#floor-unit`

- Canonical form: `#12-34` -> floor 12, unit 34. Modelled as
  **sec_unit_type = `#`, sec_unit_num = `12-34`**.
- Variants: `#01-01`, `#B1-23` (basement level B1), `#20-01/02` (unit range),
  `#12-3456` (4-digit unit in a large development).
- Sometimes written with the word `Unit`: `Unit 12-34`, or `Unit 05-123`.
- Sits after the street/block, before "Singapore".

---

## 5. There is no city or state line

- No `state`. No separate `city` — "Singapore" is the country marker. The routing
  address is: block/number + road + #unit + 6-digit postcode. The parser should
  leave `city` and `state` null and set `country=SG`.
- Country spellings: `Singapore`, `SG`, `SGP`, `S'pore`, `Republic of Singapore`.

---

## 6. Failure modes a parser must handle (>=8)

1. **"Singapore" before the postcode is the country, not a city.** "..., Singapore
   048616" — a parser that treats "Singapore" as the city mislabels it; here it is
   the country marker sitting directly before the 6-digit code.
2. **6-digit postcode with leading zeros.** `048616`, `018956` — must capture all
   6 digits and not trim the leading zero to 5.
3. **`#floor-unit` notation.** `#12-34` must parse as a secondary unit
   (type `#`, num `12-34`), not as a house-number range or a street token. The
   literal `#` must be escaped in the grammar.
4. **`Blk` / `Block` prefix on the number.** `Blk 35 Mandalay Road` — the block
   number 35 is the house number; the `Blk` word must be consumed and not left in
   the street name.
5. **Numbered roads `Ang Mo Kio Avenue 3`.** A number FOLLOWS the type word, so a
   suffix parser expecting the type at the very end leaves a dangling `3`. The
   whole "Ang Mo Kio Avenue 3" is the road name; the trailing number is part of it.
6. **Malay/Tamil prefixed roads.** `Jalan Besar`, `Lorong 3 Geylang`,
   `Lengkok Bahru`, `Upper Cross Street` have no trailing English type; must parse
   type-less without the name being swallowed.
7. **No state and no city.** A grammar that requires a city and/or state between
   the street and the postcode fails on every Singapore address; both must be
   optional/absent.
8. **Basement / ranged units.** `#B1-23`, `#20-01/02`, `#12-3456` — the unit part
   is not a plain two-number pair; allow a leading letter (basement) and a range.
9. **Block letter suffix.** `Blk 123A` — the block number can carry a trailing
   letter.
10. **"Singapore" also legitimately appears inside some building names**
    (e.g. "Singapore Land Tower") — but as a routing token it is the one directly
    before the 6-digit postcode; anchor on that.
11. **Standalone building vs HDB block.** `1 Raffles Place` (plain number) vs
    `Blk 123 ...` (block) — both map the leading number to `number`.
12. **Unit written as the word `Unit`.** `Unit 12-34` / `Unit 05-123` must be
    treated equivalently to `#12-34`.

---

## Sources

- SingPost — postal code / address finder — https://www.singpost.com/
- Wikipedia — Postal codes in Singapore — https://en.wikipedia.org/wiki/Postal_codes_in_Singapore
- PostGrid — Singapore address format — https://www.postgrid.com/global-address-format/singapore-address-format/
- 99.co — Singapore postal codes explained — https://www.99.co/singapore/insider/singapore-postal-codes/
- postal-codes.net — Singapore — https://postal-codes.net/singapore/
- bitboost — Singapore international address format — http://bitboost.com/ref/international-address-formats/singapore/
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
