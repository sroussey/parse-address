# Tanzania (TZ) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking East
Africa (English + Swahili co-official). Postal operator: **Tanzania Posts
Corporation (TPC / Posta)**. Number-first, trailing English street types, a
5-digit postcode that is almost never used, an optional region, and a **dominant
PO Box form** (English "P.O. Box" and Swahili "S.L.P.").

---

## 1. Canonical address order

Physical (street) form — **house/plot NUMBER first, then street + trailing
English type**, then an **area / ward**, then the **city/town**, then an
(optional, rare) 5-digit postcode:

```
[Number] [Street] [Type]        <- 12 Samora Avenue
[Area / ward]                   <- Kisutu
[City]                          <- Dar es Salaam
[Postcode]  (rare)              <- 11101
[Country]
```

PO Box form (the DOMINANT real-world form):

```
P.O. Box [Box], [City]          <- P.O. Box 9084, Dar es Salaam
S.L.P. [Box], [City]            <- S.L.P. 9084, Dar es Salaam   (Swahili)
```

Single-line examples:

```
12 Samora Avenue, Dar es Salaam
6 Chole Road, Masaki, Dar es Salaam
P.O. Box 9084, Dar es Salaam
```

So: **number first, suffix type, postcode after the city (after-city)** — the
GB/KE/ZA skeleton. The routing city is frequently the ONLY place token; an area
(ward/neighbourhood) may precede it.

---

## 2. Postcode / its absence

- Tanzania introduced a **5-digit postcode** ("postcode" / "posta code") through
  TPC circa 2022 (e.g. Dar es Salaam CBD **11101**; the first two digits encode
  the region, the last three the delivery area). Adoption is **very low** — the
  overwhelming majority of addresses carry **NO postcode**, routing by post
  office / PO Box.
- Position: **last token**, after the city (after-city). Capture as
  `(?<postal_code>\d{5})`, but the grammar must treat it as **optional** (the
  place tail simply ends at the city).

---

## 3. Street types (suffix, English)

Type is a trailing **suffix**: `Samora Avenue`, `Ohio Street`, `Ali Hassan
Mwinyi Road`, `Sokoine Drive`.

Types: `Street, Road, Avenue, Close, Crescent, Boulevard, Drive, Lane, Way,
Court, Place, Terrace, Circle, Ring, Loop, Rise, Grove, Row, Park, Gardens,
Walk, Hill, Highway, Mews, Bypass`. Abbreviations `St, Rd, Ave, Av, Dr, Cl,
Cres, Blvd, Hwy`. Many roads are **type-less** (bare "Uhuru", "Bibi Titi
Mohamed"); the type must be allowed null.

Swahili **prefix** road forms exist ("Barabara ya Kilwa" = "Kilwa Road", lit.
"road of Kilwa"). The prefix placement is NOT modelled (this parser is
suffix-type); such forms are a documented failure mode.

---

## 4. House / building number variants

- Plain integer, number FIRST: `12`, `5`, `40`.
- **Number + letter suffix**: `12A` -> `civic_number_suffix`.
- **Range**: `10-12`.
- **"Plot No." / "Plot" lead-in**: `Plot No. 123 Ali Hassan Mwinyi Road`,
  `Plot 45 Nyerere Road`. The "Plot" word is consumed but not emitted (exempted
  from token preservation, as PK does).
- **Secondary unit leads**: `Flat 5, 12 Ali Hassan Mwinyi Road`, `Apartment 3B,
  ...`, `Suite 4, ...`, `Shop 12, ...`.
- **Building name leads**: `PPF Tower, Ohio Street`, `NSSF Mafao House, 3 Samora
  Avenue`.
- **PO Box / S.L.P.** (dominant): `P.O. Box 9084, Dar es Salaam`; the Swahili
  `S.L.P. 9084` (Sanduku la Posta). Also `Private Bag`.

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `House`, `Suite`, `Block`,
`Floor`, `Room`, `Shop`, `Unit`. `sec_unit_num` may carry a letter (`3B`).

---

## 6. Area, city, region, country

- **Area / ward** — Dar es Salaam: Kariakoo, Upanga, Kisutu, Masaki, Oysterbay,
  Mikocheni, Kijitonyama, Kinondoni, Ilala, Msasani, Sinza. Written between the
  street and the city. Kept in the comma chain and dropped in postNormalize
  (leading localities), keeping the last (the city).
- **City / town** — `Dar es Salaam` (multi-word), `Dodoma` (capital), `Arusha`,
  `Mwanza`, `Mbeya`, `Morogoro`, `Tanga`, `Moshi`, `Iringa`, `Zanzibar`,
  `Mtwara`, `Tabora`.
- **Region (-> state)** — Tanzania has 31 regions. They are **rarely** written on
  mail. Where a region IS present it maps to `state`. **Most region names are
  IDENTICAL to their capital city** (Arusha, Mwanza, Dodoma, Mbeya, Tanga,
  Morogoro, Dar es Salaam, Iringa, Mtwara, Lindi, Tabora, Kigoma), so only the
  region names that do NOT collide with a city (Kilimanjaro, Kagera, Pwani,
  Manyara, Ruvuma, Rukwa, Katavi, Geita, Simiyu, Njombe, Shinyanga, Singida,
  and the Zanzibar-archipelago regions) are recognised in the county slot; a bare
  city-name-duplicate region is a documented failure mode.
- Country: `Tanzania`, `United Republic of Tanzania`, `TZA`, `TZ`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Tanzania Posts Corporation (TPC / Posta); UPU S42 TZ template; Smarty
/ PostGrid / GeoPostcodes TZ address guides; Wikipedia "Postal codes in
Tanzania".

1. **Postcode almost always absent.** `12 Samora Avenue, Dar es Salaam` — no
   code; the grammar must not require one.
2. **PO Box / S.L.P. dominance.** `P.O. Box 9084` and the Swahili `S.L.P. 9084`
   (Sanduku la Posta) both mean "PO Box"; a purely English box pattern misses
   `S.L.P.`.
3. **Multi-word city.** `Dar es Salaam` — a one-token city capture truncates it
   ("Dar"); `cityAllowsCommas` + a permissive city inner keep it whole.
4. **Area + city, one slot.** `Masaki, Dar es Salaam` — the leading area is
   dropped, the city kept.
5. **Region name == city name.** `Arusha` (city) vs `Arusha` (region),
   `Mwanza`/`Mwanza`, etc. — a bare duplicate cannot be told apart; only
   non-colliding region names are recognised as `state`.
6. **Swahili prefix road type.** `Barabara ya Kilwa` (= "Kilwa Road") — prefix
   placement, not modelled (suffix-type parser). Documented gap.
7. **"Plot"/"Plot No." lead-in.** `Plot No. 123 Ali Hassan Mwinyi Road` — the
   "Plot" word is a non-emitted number marker; exempted from token loss.
8. **Type-less streets.** Bare `Uhuru`, `Bibi Titi Mohamed` — the type must be
   nullable.
9. **Number letter suffix / range.** `12A`, `10-12`.
10. **Building name before number.** `PPF Tower, Ohio Street` — the building
    leads; must not be read as the number line.
11. **Leading-zero-free 5-digit code.** TPC codes such as `11101` are `\d{5}`;
    no letters, no separator.
12. **Swahili descriptors.** `Nyumba Na. 5` (house no.), `Mtaa wa Uhuru` (street
    of Uhuru) — native descriptors are not modelled (documented gap).

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading number (+ range/letter); "Plot"
  lead-in consumed.
- `street` / `type` — name + trailing English suffix (type null if absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`Apartment`/... + value, or `PO Box`
  (incl. `S.L.P.`) / `Private Bag` + box number.
- `city` — the routing city (last locality); leading areas dropped.
- `state` — a non-colliding region name, only if explicitly present.
- `postal_code` — 5-digit, after the city, when present (rare).
- `country` — `TZ`.

---

## Sources

- Tanzania Posts Corporation (TPC / Posta) — https://www.posta.co.tz/
- UPU S42 TZ addressing template — https://www.upu.int/en/Universal-Postal-Union/Activities/Addressing
- Smarty TZ address format examples — https://www.smarty.com/docs/cloud/international-street-api
- PostGrid TZ address format — https://www.postgrid.com/global-address-format/
- GeoPostcodes Tanzania — https://www.geopostcodes.com/
- Wikipedia: Postal codes in Tanzania — https://en.wikipedia.org/wiki/Postal_codes_in_Tanzania
