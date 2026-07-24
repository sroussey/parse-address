# Zambia (ZM) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking Southern
Africa. Postal operator: **Zambia Postal Services Corporation (Zampost)**.
Number-first (with a cadastral **"Stand No." / "Plot"** lead-in), trailing
English street types, a 5-digit postcode that is frequently omitted, an optional
province, and a common PO Box form.

---

## 1. Canonical address order

Physical (street) form — **house/stand NUMBER first, then street + trailing
English type**, then an **area / township**, then the **city**, then an
(optional) 5-digit postcode:

```
[Number] [Street] [Type]        <- 10 Great East Road
[Area / township]               <- Rhodes Park
[City] [Postcode]  (code often omitted)   <- Lusaka 10101
[Country]
```

PO Box form (very common):

```
P.O. Box [Box], [City]          <- P.O. Box 30234, Lusaka
```

Single-line examples:

```
10 Cairo Road, Lusaka
50 Great East Road, Rhodes Park, Lusaka, 10101
P.O. Box 30234, Lusaka
```

So: **number first, suffix type, postcode after the city (after-city)** — the
GB/KE/ZA skeleton, with the postcode usually absent.

---

## 2. Postcode / its absence

- Zambia has a **5-digit numeric postcode** (e.g. Lusaka **10101**), but it is
  **frequently OMITTED** — routing is by post office / PO Box, and adoption is
  low.
- Position: **last token**, after the city (after-city). Capture as
  `(?<postal_code>\d{5})`; the grammar treats it as **optional**.

---

## 3. Street types (suffix, English)

Type is a trailing **suffix**: `Cairo Road`, `Great East Road`, `Independence
Avenue`, `Addis Ababa Drive`, `Freedom Way`.

Types: `Road, Street, Avenue, Close, Crescent, Boulevard, Drive, Lane, Way,
Court, Place, Terrace, Circle, Ring, Loop, Rise, Grove, Row, Park, Gardens,
Walk, Hill, Highway, Mews, Bypass`. Abbreviations `Rd, St, Ave, Av, Dr, Cl,
Cres, Blvd, Hwy`. Some roads are **type-less** (`Broadway`); the type must be
null-able. The greedy suffix keeps the **rightmost** type word (`Great East
Road` -> street "Great East", type "Road").

---

## 4. House / building number variants

- Plain integer, number FIRST: `10`, `22`, `50`.
- **"Stand No." / "Plot" lead-in** — the Zambian cadastral form: `Stand No. 2374
  Great East Road`, `Stand 1234 Cairo Road`, `Plot 45 Kabulonga Road`. The
  "Stand"/"Plot" word is consumed but not emitted (exempted from token
  preservation, as PK does).
- **Number + letter suffix**: `10A` -> `civic_number_suffix`.
- **Range / subdivision**: `10-12`.
- **Secondary unit leads**: `Flat 5, 22 Cairo Road`, `Apartment 3B, ...`,
  `Suite 4, ...`, `Shop 12, ...`.
- **Building name leads**: `Findeco House, Cairo Road`, `Mukuba Pension House,
  22 Dedan Kimathi Road`.
- **PO Box / Private Bag** (common): `P.O. Box 30234, Lusaka`; `Private Bag E123`
  (may carry a 1-2 letter exchange prefix).

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `House`, `Suite`, `Block`,
`Floor`, `Room`, `Shop`, `Unit`. `sec_unit_num` may carry a letter (`3B`).

---

## 6. Area, city, province, country

- **Area / township / suburb** — Lusaka: Rhodes Park, Kabulonga, Woodlands,
  Northmead, Roma, Olympia, Longacres, Chelston, Emmasdale, Kamwala. Written
  between the street and the city; kept in the comma chain and dropped in
  postNormalize (leading localities), keeping the last (the city).
- **City / town** — `Lusaka` (capital), `Ndola`, `Kitwe`, `Livingstone`,
  `Kabwe`, `Chingola`, `Mufulira`, `Chipata`.
- **Province (-> state)** — the 10 provinces (Lusaka, Copperbelt, Southern,
  Eastern, Northern, Western, Central, Luapula, Muchinga, North-Western). Written
  occasionally. Because several province names **duplicate a city** (Lusaka,
  Central), only the explicit **"<Name> Province"** form (plus the unambiguous
  single-word "Copperbelt" / "North-Western") is recognised in the county slot,
  so a bare "Area, City" pair is never mis-split with the city taken as the
  province. Output is the province name (`Southern`, `Copperbelt`, `Lusaka`).
- Country: `Zambia`, `Republic of Zambia`, `ZMB`, `ZM`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Zambia Postal Services Corporation (Zampost); UPU S42 ZM template;
Smarty / PostGrid / GeoPostcodes ZM address guides.

1. **Postcode often omitted.** `10 Cairo Road, Lusaka` — no code; the grammar
   must not require it.
2. **Province name == city name.** `Lusaka` (city) vs `Lusaka` (province),
   `Central` — a bare duplicate cannot be told apart; only the explicit
   "<Name> Province" (and "Copperbelt") form is captured as `state`.
3. **"Stand No." / "Plot" lead-in.** `Stand No. 2374 Great East Road` — the
   "Stand"/"Plot" word is a non-emitted number marker; exempted from token loss.
4. **PO Box / Private Bag.** `P.O. Box 30234` (all-digit) vs `Private Bag E123`
   (1-2 letter exchange prefix) — the box-number pattern allows an optional
   letter prefix.
5. **Area + city, one slot.** `Rhodes Park, Lusaka` — leading area dropped, city
   kept.
6. **Greedy rightmost type.** `Great East Road`, `United Nations Avenue` — the
   greedy name keeps the rightmost type word.
7. **Type-less streets.** `Broadway`, `Cha Cha Cha Road`(spaced) — the type must
   be null-able.
8. **Hyphenated street name.** `Mosi-oa-Tunya Road` — kept whole in `street`.
9. **Number letter suffix / range.** `10A`, `10-12`.
10. **Building name before number.** `Findeco House, Cairo Road` — the building
    leads; must not be read as the number line.
11. **Cadastral stand-only reference.** `House No. 5, Plot 2374, Kabulonga,
    Lusaka` — a land/stand number with no named street is not modelled.
12. **Relative descriptor.** `Off Great East Road, Chelston, Lusaka` — an "Off
    <road>" locator with no own number/street is not modelled.

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading number (+ range/letter);
  "Stand"/"Plot" lead-in consumed.
- `street` / `type` — name + trailing English suffix (type null if absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`Apartment`/... + value, or `PO Box`
  / `Private Bag` (+ optional letter prefix) + box number.
- `city` — the routing city (last locality); leading areas dropped.
- `state` — the province, only via the explicit "<Name> Province" / "Copperbelt"
  form.
- `postal_code` — 5-digit, after the city, when present.
- `country` — `ZM`.

---

## Sources

- Zambia Postal Services Corporation (Zampost) — https://www.zampost.com.zm/
- UPU S42 ZM addressing template — https://www.upu.int/en/Universal-Postal-Union/Activities/Addressing
- Smarty ZM address format examples — https://www.smarty.com/docs/cloud/international-street-api
- PostGrid ZM address format — https://www.postgrid.com/global-address-format/
- GeoPostcodes Zambia — https://www.geopostcodes.com/
- Wikipedia: Postal codes in Zambia — https://en.wikipedia.org/wiki/Postal_codes_in_Africa
