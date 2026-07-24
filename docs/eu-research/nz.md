# New Zealand (NZ) Street Address Research

Research notes for a config-driven XRegExp address parser. Focus: NZ Post
addressing standards (ADV356 Address & Layout Guide), the LINZ / data.govt.nz
street-address data standard, the UPU S42 template, and real addresses.

---

## 1. Canonical address order

New Zealand writes the **number FIRST, then street name + type** (number-first,
like AU/UK). The place block is **SUBURB (line), then TOWN/CITY + POSTCODE** on
the last line:

```
[Recipient]
[Unit/floor]                 <- e.g. "Flat 2" or the "2/" of "2/43"
[Number  Street  Type]       <- e.g. "43 Vogel Street"
[Suburb or RD number]        <- e.g. "Roslyn"  (optional; urban delivery)
TOWN / CITY  POSTCODE        <- e.g. "Palmerston North 4414"
[NEW ZEALAND]
```

Single-line / comma-joined forms:

```
43 Vogel Street, Palmerston North 4414
12 Queen Street, Auckland Central, Auckland 1010
2/43 Vogel Street, Roslyn, Dunedin 9010
```

Key rules:
- **Postcode is LAST**, after the town/city, separated by a **single space** (no
  comma between city and postcode: "Palmerston North 4414").
- NZ normally has **NO state/region token** in the postal address — the town/city
  + 4-digit postcode is sufficient. (Regions like Auckland, Wellington,
  Canterbury, Otago exist administratively and are sometimes written, but are not
  a required postal element.)
- When both a **suburb** and a **town/city** are written, the suburb comes FIRST
  (on its own line / comma segment) and the town/city LAST, before the postcode:
  "Epsom, Auckland 1023" — Epsom = suburb, Auckland = city.

---

## 2. Postcode shape

- **Exactly 4 digits**, no letters, no space: `1010`, `6011`, `8011`, `9016`,
  `0110`, `4414`.
- Structure: first 2 digits = area, 3rd = delivery type (street / PO Box /
  Private Bag / Rural Delivery), 4th = specific lobby / RD number / suburb.
- Regex: `\d{4}`.
- NB: a NZ 4-digit postcode looks identical to an AU one — country context
  disambiguates.

---

## 3. Region (optional, usually omitted)

Not a required postal element. When present it is the town/city's administrative
region and would occupy the `state` field: `Auckland`, `Wellington`, `Canterbury`,
`Otago`, `Waikato`, `Bay of Plenty`, `Manawatū-Whanganui`, `Northland`, `Tasman`,
`Southland`, `Hawke's Bay`, `Taranaki`, `Gisborne`, `Marlborough`, `Nelson`,
`West Coast`. Most everyday NZ addresses omit it. This parser leaves `state`
null unless a recognised region is explicitly present.

---

## 4. Street (thoroughfare) types — SUFFIX, usually spelled in full

Type is a **trailing suffix** ("Vogel Street" -> name "Vogel", type "Street").
NZ Post and the LINZ data standard both prefer the **full, unabbreviated** type
("road", "street", "avenue"), but abbreviations occur.

| Full type | Abbrev | Full type | Abbrev |
|-----------|--------|-----------|--------|
| Street    | St     | Terrace   | Tce    |
| Road      | Rd     | Parade    | Pde    |
| Avenue    | Ave    | Place     | Pl     |
| Drive     | Dr     | Crescent  | Cres   |
| Lane      | Ln     | Quay      | Quay   |
| Highway   | Hwy    | Grove     | Gr     |
| Close     | Cl     | Square    | Sq     |
| Court     | Ct     | Rise      | Rise   |
| Way       | Way    | Mall      | Mall   |
| Walk      | Wk     | Esplanade | Esp    |
| Heights   | Hts    | Promenade | Prom   |

Other common types: Boulevard, Bay, Bend, Circle, Cove, Glade, Glen, Green,
Grange, Heights, Hill, Line (rural — "No 1 Line"), Loop, Mews, Nook, Outlook,
Pass, Pathway, Ridge, Row, Straight, Strand, Track, Vale, View, Views, Vista.

Type-less streets exist (e.g. "The Terrace" in Wellington, "Broadway" in
Newmarket, "Lambton Quay" where Quay is the type). Parser must tolerate type-null.

Māori-language street names are common and may place a descriptor differently
(e.g. "Ara ..."), but the vast majority still use an English suffix type.

---

## 5. House / building number variants

- Plain: `43`, `100`, `1`.
- **Range**: `12-14`, `2-8`.
- **Letter suffix**: `43A`, `2B` -> number 43 + suffix A.
- **Unit-slash-street `2/43`** (used in NZ as in AU): `2/43 Vogel Street` = flat 2
  at number 43. The number before the slash is the flat/unit; after the slash is
  the street number.
- **RD (Rural Delivery)**: rural addresses use "RD 2" etc. after the town.
- **PO Box / Private Bag**: replaces the street entirely
  ("PO Box 30-123", "Private Bag 4741").

---

## 6. Secondary (sub-dwelling) units

Keywords: `Flat`, `Unit`, `Apartment` (Apt), `Suite`, `Level`, `Room`, `Villa`,
`Shop`, `Office`. Forms:

- `Flat 2, 43 Vogel Street` -> Flat 2.
- `2/43 Vogel Street` -> the `2/` is the flat (implied Flat/Unit).
- `Unit 5, 12 Queen Street` -> Unit 5.
- `Level 3, 48 Willis Street` -> Level 3.
- `Apartment 3B, ...` -> Apartment 3B.

Leading-unit order (unit before the street number, comma-joined) mirrors AU/UK.

---

## 7. Suburb, town/city, country

- **Suburb**: optional locality within a town/city (e.g. `Roslyn`, `Epsom`,
  `Mount Maunganui`, `Te Aro`, `Newmarket`). Written before the town/city.
- **Town / city**: the routing locality immediately before the postcode
  (`Auckland`, `Wellington`, `Christchurch`, `Palmerston North`, `Lower Hutt`,
  `New Plymouth`, `Tauranga`, `Dunedin`, `Whangārei`). Multi-word cities common.
  Maps to `city`.
- **Country**: `New Zealand`, `NZ`, `NZL`, `Aotearoa`. Optional -> `country=NZ`.

Field mapping: town/city -> `city`; suburb -> (no dedicated field; when a suburb
AND a city are both present the city is the token before the postcode). Region
(rare) -> `state`.

---

## 8. Failure modes a parser must handle (>=8)

1. **Postcode last, single space, no comma to city.** "Palmerston North 4414" —
   the 4-digit code is glued to the city by a space, not a comma. Must peel the
   trailing 4 digits and keep the multi-word city intact.
2. **Suburb-before-city, both present.** "12 Queen Street, Auckland Central,
   Auckland 1010" — Auckland Central is the suburb, Auckland is the routing city.
   A parser that takes the FIRST locality as the city picks the suburb by
   mistake; the city is the LAST locality before the postcode.
3. **Multi-word city.** `Palmerston North`, `Lower Hutt`, `New Plymouth`,
   `North Shore`, `Mount Maunganui` — grabbing one token truncates the city.
4. **Unit-slash-street `2/43`.** Must become flat 2 + street number 43, not
   number 2 or "2/43".
5. **No state/region field.** Unlike AU, NZ has no mandatory state token. A
   grammar that requires a state between city and postcode fails on every normal
   NZ address; the region must be optional.
6. **4-digit postcode ambiguous with AU.** Same shape as Australia; only country
   context distinguishes. Don't assume a leading digit maps to a state.
7. **Type-less streets.** `The Terrace`, `Broadway`, `Lambton Quay` — must allow
   `type` null without the name being swallowed by the suburb/city.
8. **Full vs abbreviated type.** Both `Street` and `St`, `Road`/`Rd`,
   `Avenue`/`Ave` appear; NZ Post prefers full but abbreviations occur — cover
   both and canonicalise.
9. **Rural Delivery ("RD 2") and PO Box / Private Bag.** These replace or augment
   the street; `number`/`street` may be null.
10. **Leading zero postcodes.** `0110`, `0600`, `0800` (Northland) — must not be
    trimmed to 3 digits.
11. **Macrons in names.** `Whangārei`, `Ōtāhuhu`, `Manawatū` — the city/suburb
    capture must be Unicode-safe and not break on the macron vowel.
12. **Leading `Flat`/`Unit`/`Level` vs street number.** "Flat 2, 43 Vogel Street"
    — the `2` is the flat, `43` is the real street number.

---

## Sources

- NZ Post — Addressing standards — https://www.nzpost.co.nz/business/shipping-in-nz/addressing-standards
- NZ Post — How to address mail — https://www.nzpost.co.nz/personal/sending-in-nz/how-to-address-mail
- NZ Post — Address & Layout Guide (ADV356) — https://www.nzpost.co.nz/sites/default/files/uploads/shared/standards-guides/adv356-address-and-layout-guide.pdf
- data.govt.nz — Street address mandated data standard — https://data.govt.nz/toolkit/data-standards/mandated-standards-register/street-address-standard
- LINZ — Useful information for people working with addresses — https://www.linz.govt.nz/sites/default/files/useful_info_for_working_with_addresses.pdf
- UPU S42 — New Zealand postal addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/nzlEn.pdf
- Wikipedia — Postcodes in New Zealand — https://en.wikipedia.org/wiki/Postcodes_in_New_Zealand
- Addressfinder NZ — street types — https://addressfinder.nz/faq/can-you-provide-a-list-of-street-types-nz/
