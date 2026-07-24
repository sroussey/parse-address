# Zimbabwe (ZW) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking Southern
Africa. Postal operator: **Zimbabwe Posts (Zimpost)**. Number-first (with a
cadastral **"Stand No." / "Number"** lead-in common in the townships), trailing
English street types, **NO postal code**, and a **dominant PO Box form** (often
with an exchange-letter prefix).

---

## 1. Canonical address order

Physical (street) form — **house/stand NUMBER first, then street + trailing
English type**, then a **suburb / township**, then the **city**:

```
[Number] [Street] [Type]        <- 7 Fife Avenue
[Suburb / township]             <- Avondale
[City]                          <- Harare
[Country]
```

PO Box form (the DOMINANT real-world form):

```
P.O. Box [Box], [City]          <- P.O. Box 1234, Harare
P.O. Box [Prefix][Box], [Suburb], [City]   <- P.O. Box BE705, Belvedere, Harare
```

Single-line examples:

```
7 Fife Avenue, Harare
11 Borrowdale Road, Borrowdale, Harare
P.O. Box 1234, Harare
```

So: **number first, suffix type, no postcode, place ends at the city**
(after-city layout with the postcode disabled).

---

## 2. Postcode / its absence

- **Zimbabwe has NO operational postal-code system.** Nothing is written; the UPU
  country note lists Zimbabwe as having no postcode. Routing is by post office /
  PO Box.
- The config sets the postcode capture to a **never-match sentinel**
  `(?<postal_code>(?!x)x)` so a stray number can never be misread as a code, and
  the place tail simply ends at the city.

---

## 3. Street types (suffix, English)

Type is a trailing **suffix**: `Fife Avenue`, `Samora Machel Avenue`, `Julius
Nyerere Way`, `Borrowdale Road`, `First Street`.

Types: `Street, Road, Avenue, Close, Crescent, Boulevard, Drive, Lane, Way,
Court, Place, Terrace, Circle, Ring, Loop, Rise, Grove, Row, Park, Gardens,
Walk, Hill, Highway, Mews, Bypass`. Abbreviations `St, Rd, Ave, Av, Dr, Cl,
Cres, Blvd, Hwy`. Numbered streets are common (`First Street`, `Second Street`);
"First"/"Second" are the name, not the type. Some named ways are **type-less**
(`The Chase`); the type must be null-able.

---

## 4. House / building number variants

- Plain integer, number FIRST: `7`, `12`, `45`.
- **"Stand No." / "Number" / "Plot" lead-in** — common in the townships:
  `Stand No. 1234 Borrowdale Road`, `Number 12 Fife Avenue`. The lead-in word is
  consumed but not emitted (exempted from token preservation, as PK does).
- **Number + letter suffix**: `7A` -> `civic_number_suffix`.
- **Range / subdivision**: `10-12`.
- **Secondary unit leads**: `Flat 5, 7 Fife Avenue`, `Apartment 3B, ...`,
  `Suite 4, ...`, `Shop 12, ...`.
- **Building name leads**: `Karigamombe Centre, Julius Nyerere Way`, `Eastgate
  Centre, Robert Mugabe Road`.
- **PO Box / Private Bag** (dominant): `P.O. Box 1234, Harare`; Zimbabwean boxes
  frequently carry a 1-2 letter **exchange prefix** tying the box to a suburb
  post office (`P.O. Box BE705` = Belvedere, `A123` = Avondale).

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `House`, `Suite`, `Block`,
`Floor`, `Room`, `Shop`, `Unit`. `sec_unit_num` may carry a letter (`3B`).

---

## 6. Suburb, city, province, country

- **Suburb / township** — Harare: Avondale, Borrowdale, Mount Pleasant,
  Highlands, Belgravia, Msasa, Belvedere, Hillside, Milton Park, Marlborough,
  Greendale, Eastlea, Mbare. Written between the street and the city; kept in the
  comma chain and dropped in postNormalize (leading localities), keeping the last
  (the city).
- **City / town** — `Harare` (capital), `Bulawayo`, `Mutare`, `Gweru`,
  `Kwekwe`, `Masvingo`, `Chitungwiza`, `Victoria Falls` (multi-word), `Kadoma`,
  `Marondera`.
- **Province** — the 10 provinces (Harare, Bulawayo, Manicaland, Mashonaland
  Central/East/West, Masvingo, Matabeleland North/South, Midlands). **Essentially
  never written**; the two metropolitan provinces (Harare, Bulawayo) duplicate
  the city. The county slot is disabled with a **never-match sentinel** so the
  generic county pattern does not swallow the routing city. No `state` is
  modelled.
- Country: `Zimbabwe`, `Republic of Zimbabwe`, `ZWE`, `ZW`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Zimbabwe Posts (Zimpost); UPU S42 ZW template & postcode note ("no
postal code"); Smarty / PostGrid ZW address guides.

1. **No postcode at all.** `7 Fife Avenue, Harare` — the grammar must never
   require or hallucinate a code; the postcode capture is a sentinel.
2. **PO Box dominance + exchange-letter prefix.** `P.O. Box BE705, Belvedere,
   Harare` — the box number carries a 1-2 letter suburb-exchange prefix; an
   all-digit box pattern would miss it.
3. **"Stand No." / "Number" / "Plot" lead-in.** `Number 12 Fife Avenue` — a
   non-emitted number marker; exempted from token loss.
4. **No region -> default county eats the city.** With no state list, a generic
   `city, county` slot would take `Avondale, Harare` as city="Avondale",
   county="Harare"; disabled via the never-match county so the whole chain stays
   in `city` for the drop step.
5. **Suburb + city, one slot.** `Borrowdale, Harare` — leading suburb dropped,
   city kept.
6. **Numbered streets.** `First Street`, `Second Street` — the ordinal is the
   name, not the type.
7. **Type-less street.** `The Chase` — the type must be null-able.
8. **Multi-word city.** `Victoria Falls` — a one-token capture truncates it.
9. **Street name == city name.** `16 Harare Street, Harare` — a street named
   after the city; the boundary/parse still resolve street="Harare" + city.
10. **Building name before number.** `Karigamombe Centre, Julius Nyerere Way` —
    the building leads; must not be read as the number line. A building whose
    last word is "City" (`Joina City`) is NOT a building keyword here (would
    collide with real city tails) — documented gap.
11. **Number letter suffix / range.** `7A`, `10-12`.
12. **Cadastral stand-only / township house reference.** `Stand 1234,
    Highfield, Harare`, `House 5, Msasa Park, Harare` — a stand/house number with
    no named street is not modelled.

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading number (+ range/letter);
  "Stand"/"Number"/"Plot" lead-in consumed.
- `street` / `type` — name + trailing English suffix (type null if absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`Apartment`/... + value, or `PO Box`
  (+ optional exchange-letter prefix) / `Private Bag` + box number.
- `city` — the routing city (last locality); leading suburbs dropped.
- `state` — none modelled (no address-level region).
- `postal_code` — none (never present).
- `country` — `ZW`.

---

## Sources

- Zimbabwe Posts (Zimpost) — https://www.zimpost.co.zw/
- UPU S42 ZW addressing / postcode note — https://www.upu.int/en/Universal-Postal-Union/Activities/Addressing
- Smarty ZW address format examples — https://www.smarty.com/docs/cloud/international-street-api
- PostGrid ZW address format — https://www.postgrid.com/global-address-format/
- Wikipedia: Postal codes in Zimbabwe (no postal code system) — https://en.wikipedia.org/wiki/Postal_codes_in_Africa
