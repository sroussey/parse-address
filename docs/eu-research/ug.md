# Uganda (UG) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking East
Africa. Postal operator: **Posta Uganda**. Number-first with the characteristic
cadastral **"Plot <n>"** lead-in, trailing English street types, **NO postal
code**, and a **dominant PO Box form**.

---

## 1. Canonical address order

Physical (street) form — **"Plot" NUMBER first, then street + trailing English
type**, then an **area / division**, then the **city**:

```
Plot [Number] [Street] [Type]   <- Plot 29 Kampala Road
[Area / division]               <- Nakasero
[City]                          <- Kampala
[Country]
```

PO Box form (the DOMINANT real-world form):

```
P.O. Box [Box], [City]          <- P.O. Box 7062, Kampala
```

Single-line examples:

```
Plot 29 Kampala Road, Kampala
Plot 3 Kyadondo Road, Nakasero, Kampala
P.O. Box 7062, Kampala
```

So: **number first (usually "Plot n"), suffix type, no postcode, place ends at
the city** (after-city layout with the postcode disabled).

---

## 2. Postcode / its absence

- **Uganda has NO postal-code system.** Nothing is ever written; the UPU country
  note lists Uganda as having no postcode. Routing is by post office / PO Box.
- The config sets the postcode capture to a **never-match sentinel**
  `(?<postal_code>(?!x)x)` so a stray number can never be misread as a code, and
  the place tail simply ends at the city.

---

## 3. Street types (suffix, English)

Type is a trailing **suffix**: `Kampala Road`, `Acacia Avenue`, `Kyadondo Road`,
`Parliament Avenue`, `Colville Street`, `Windsor Crescent`.

Types: `Road, Street, Avenue, Close, Crescent, Boulevard, Drive, Lane, Way,
Court, Place, Terrace, Circle, Ring, Loop, Rise, Grove, Row, Park, Gardens,
Walk, Hill, Highway, Mews, Bypass`. Abbreviations `Rd, St, Ave, Av, Dr, Cl,
Cres, Blvd, Hwy`. Many roads are **type-less**; the type must be null-able. The
greedy suffix keeps the **rightmost** type word (`Clement Hill Road` -> street
"Clement Hill", type "Road", not type "Hill").

---

## 4. House / building number variants

- **"Plot" (or "Plot No.") lead-in** — the characteristic Ugandan form:
  `Plot 29 Kampala Road`, `Plot No. 12 Bombo Road`. The "Plot" word is consumed
  but not emitted (exempted from token preservation, as PK does for "House"/"Plot").
- Plain integer, number FIRST (also seen): `12 Kampala Road`.
- **Number + letter suffix**: `Plot 29A` -> `civic_number_suffix`.
- **Range / subdivision**: `Plot 10-12`, `Plot 15/3` (kept in `number`).
- **Secondary unit leads**: `Flat 5, Plot 29 Kampala Road`, `Apartment 3B, ...`,
  `Suite 4, ...`, `Shop 12, ...`.
- **Building name leads**: `Workers House, Plot 1 Pilkington Road`, `Crested
  Towers, Plot 17 Hannington Road`, `Amber House, Plot 29 Kampala Road`.
- **PO Box** (dominant): `P.O. Box 7062, Kampala`. Also `Private Bag`.

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `House`, `Suite`, `Block`,
`Floor`, `Room`, `Shop`, `Unit`. `sec_unit_num` may carry a letter (`3B`).

---

## 6. Area, city, region, country

- **Area / division / suburb** — Kampala: Nakasero, Kololo, Bugolobi, Ntinda,
  Bukoto, Naguru, Muyenga, Kamwokya, Kabalagala, Nsambya, Mengo, Wandegeya.
  Written between the street and the city; kept in the comma chain and dropped in
  postNormalize (leading localities), keeping the last (the city).
- **City / town** — `Kampala` (capital), `Entebbe`, `Jinja`, `Mbarara`, `Gulu`,
  `Mbale`, `Fort Portal` (multi-word), `Masaka`, `Wakiso`.
- **Region / district** — Uganda's 4 regions (Central/Eastern/Northern/Western)
  and 100+ districts are **essentially never written** in a mailing address, and
  **every district name duplicates a town** (Wakiso, Mukono, Jinja, ...). The
  county slot is disabled with a **never-match sentinel** so the generic county
  pattern does not swallow the routing city. No `state` is modelled.
- Country: `Uganda`, `Republic of Uganda`, `UGA`, `UG`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Posta Uganda; UPU S42 UG template & postcode note ("no postal code");
Smarty / PostGrid UG address guides.

1. **No postcode at all.** `Plot 29 Kampala Road, Kampala` — the grammar must
   never require or hallucinate a code; the postcode capture is a sentinel.
2. **"Plot" number lead-in.** `Plot 29 Kampala Road` — "Plot" is a non-emitted
   number marker; without exempting it the token-preservation guard flags loss.
3. **PO Box dominance.** `P.O. Box 7062, Kampala` — the box replaces the
   thoroughfare (unit-only result).
4. **No region -> default county eats the city.** With no state list, a generic
   `city, county` slot would take `Nakasero, Kampala` as city="Nakasero",
   county="Kampala"; disabled via the never-match county so the whole chain stays
   in `city` for the drop step.
5. **Area + city, one slot.** `Nakasero, Kampala` — leading area dropped, city
   kept.
6. **Multi-word city.** `Fort Portal` — a one-token capture truncates it.
7. **Greedy rightmost type.** `Clement Hill Road` — "Hill" is also a type; the
   greedy name keeps the rightmost type ("Road"), leaving street "Clement Hill".
8. **Plot subdivision / range.** `Plot 15/3`, `Plot 10-12` — kept whole in
   `number`.
9. **Building name before number.** `Workers House, Plot 1 Pilkington Road` —
   the building leads; must not be read as the number line.
10. **Dropped area shares a word with the city.** `Old Kampala, Kampala` — the
    dropped area contains the city word, so the token-preservation guard splits
    it; documented gap (the parse itself is still correct).
11. **Local Council (LCn) addressing.** `LC1 Kisenyi, Kampala` — informal
    village/LC references with no thoroughfare are not modelled.
12. **Cadastral Block+Plot land reference.** `Block 244 Plot 15, Kyadondo,
    Wakiso` — a land title with no named street is not modelled.

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading number (+ range/subdivision/letter);
  "Plot" lead-in consumed.
- `street` / `type` — name + trailing English suffix (type null if absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`Apartment`/... + value, or `PO Box`
  / `Private Bag` + box number.
- `city` — the routing city (last locality); leading areas dropped.
- `state` — none modelled (no address-level region).
- `postal_code` — none (never present).
- `country` — `UG`.

---

## Sources

- Posta Uganda — https://www.ugapost.co.ug/
- UPU S42 UG addressing / postcode note — https://www.upu.int/en/Universal-Postal-Union/Activities/Addressing
- Smarty UG address format examples — https://www.smarty.com/docs/cloud/international-street-api
- PostGrid UG address format — https://www.postgrid.com/global-address-format/
- Wikipedia: Postal codes in Uganda (no postal code system) — https://en.wikipedia.org/wiki/Postal_codes_in_Africa
