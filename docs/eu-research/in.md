# India (IN) Street Address Research

Research for the config-driven XRegExp address parser. Focus: India Post's
6-digit PIN system, the very messy multi-part locality chain, the trailing-suffix
thoroughfare grammar (Road / Marg / Salai / Sarani / Cross / Main), and the state
written either side of the PIN. Indian street addressing is among the least
standardised in the world; this config targets the common single-line business
form and documents the rest as failure modes.

---

## 1. Canonical address order

India Post's recommended order (top to bottom): recipient; house/flat + building;
street/road; **area/locality**; **city/town + 6-digit PIN**; state. Collapsed to a
single comma-joined line, the common business form is:

```
[No] Number, [Building,] Street Type, [Locality,] City <PIN>, State
```

Real examples the parser targets:

```
24, MG Road, Bengaluru 560001, Karnataka
221, MG Road, Bengaluru - 560001, Karnataka
12, Linking Road, Bandra West, Mumbai, Maharashtra 400050
24, 2nd Main, Indiranagar, Bengaluru — 560038, Karnataka
Sunrise Apartments, MG Road, Koramangala, Bengaluru 560034, Karnataka
```

So: **number first, trailing-SUFFIX type, PIN AFTER the city (after-city).** The
state may appear **before** the PIN ("Mumbai, Maharashtra 400050") or **after** it
("Bengaluru - 560001, Karnataka"); both occur constantly.

---

## 2. Postcode — the 6-digit PIN

- **Exactly 6 digits** (PIN = Postal Index Number, introduced 1972). First digit
  = zone, first 3 = sorting district, last 3 = post office. Leading zeros do not
  occur (first digit is 1–9), but the field is still captured as `\d{6}`.
- **Written many ways**: bare after the city (`Bengaluru 560001`), dash-separated
  (`Bengaluru - 560001`), em-dash (`Bengaluru — 560034`, India Post's own house
  style), label form (`PIN 560001`, `PIN Code: 560001`), and occasionally
  **grouped** (`560 001`). The postal pattern eats an optional `[-–—]` / `PIN
  [Code]` prefix and an optional internal space, normalising to 6 digits.
- Position: **after the city** (after-city), unlike continental Europe.

---

## 3. Thoroughfare types — trailing SUFFIX (English + Indic)

The type is a trailing suffix appended to the name: `MG Road`, `Linking Road`,
`Marine Drive`, `Park Street`, `Connaught Place`.

- English: Road/Rd, Street/St, Drive, Avenue, Place, Lane, Highway, Circle.
- **Indic road words** (regional, must be recognised as types): **Marg** (Hindi
  road, N/W India — "Nehru Marg", "Tolstoy Marg"), **Salai** (Tamil road,
  Chennai — "Anna Salai"), **Sarani** (Bengali road, Kolkata — "Shakespeare
  Sarani", "Rabindra Sarani"), **Chowk** (square/crossroads — "Chandni Chowk"),
  **Bazaar/Gali** (market/alley).
- **Bangalore grid words**: **Cross** and **Main** ("2nd Main", "5th Cross") are
  the type, with the ordinal as the name.
- Many roads are **type-less** ("Hazratganj", "Rajpath", "Colaba Causeway",
  "Ashok Rajpath") — type must be allowed null.

---

## 4. House / flat / plot number variants

- Plain integer, number FIRST: `24`, `221`, `12`.
- Lead-in `No.` / `#`: `No. 24`, `#24`.
- **Compound plot/door numbers**: `12/3`, `26/27`, `1-2-3` (Hyderabad door
  numbers), kept in `number`.
- **Number + letter suffix**: `12A`, `221B`, `7B` -> `civic_number_suffix`.
- **Secondary unit leads**: `Flat 4B, 12 MG Road`, `Shop 12, ...`, `Plot 5, ...`.
- **Alphanumeric flat ids** that start with a letter (`C-204, Tower 3`) are NOT
  modelled (the number must start with a digit) — documented failure #7.

---

## 5. Locality chain — multiple localities, one city slot

An **area/locality** (Indiranagar, Koramangala, Bandra West, Malleshwaram, ...)
sits between the street and the city. Because the PIN is **after** the city, the
ZA-style trick applies: the comma-separated locality chain is kept together in the
city capture (`cityAllowsCommas`), then `postNormalize` keeps the **last** as the
routing city and records the earlier localities as `__dropped` (so they are not
scored as lost tokens). A real state before the PIN is protected by a state-only
`countyPattern`, so an ordinary "locality, City" pair is never mis-split.

---

## 6. State — either side of the PIN, output as a code

29 states + 8 union territories -> `state`, output as the 2-letter ISO 3166-2 /
vehicle-registration code (Karnataka KA, Maharashtra MH, Tamil Nadu TN, Delhi DL,
West Bengal WB, Uttar Pradesh UP, Telangana TS, Gujarat GJ, Rajasthan RJ, Kerala
KL, Bihar BR, Goa GA, Sikkim SK, Jammu and Kashmir JK, ...). It is captured
**before** the PIN via the county slot ("Mumbai, Maharashtra 400050") OR **after**
the PIN via a helper `in_state` group inside the postal pattern ("Bengaluru -
560001, Karnataka"), which `postNormalize` folds into `state`.

Secondary units: `Flat`/`Apartment`/`Apt`, `Floor`, `Door No`, `Room`, `Shop`,
`Unit`, `Plot`. PO box: `PO Box`, `Post Box`, `GPO Box`, `Post Bag`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: India Post; Wikipedia "Postal Index Number"; pincodesinfo "How to write
a postal address in India"; Google libaddressinput (`IN`: `fmt
%N%n%O%n%A%n%D%n%C %Z%n%S`, i.e. street / dependent-locality / city + postcode /
state — note the PIN sits on the city line and the state is a separate required
field); Smarty / PostGrid India guides.

1. **State on EITHER side of the PIN.** `Mumbai, Maharashtra 400050` (before) vs
   `Bengaluru - 560001, Karnataka` (after). Handled by a county slot AND a
   trailing `in_state` helper group; both fold to `state`.
2. **Locality chain (two+ localities, one city slot).** `..., Bandra West,
   Mumbai, ...` — the area precedes the city. Kept together then the earlier
   localities are dropped (recorded in `__dropped`).
3. **Many PIN spellings.** `Bengaluru 560001`, `- 560001`, em-dash `— 560038`,
   `PIN 560001`, grouped `560 001`. A bare `\d{6}` after a comma misses the dash/
   label/space variants.
4. **Indic + grid types.** `Marg`, `Salai`, `Sarani`, `Chowk`, `Cross`, `Main`
   must be in the type vocabulary or they are mislabelled / left in the name.
5. **Type-less roads.** `Hazratganj`, `Rajpath`, `Colaba Causeway` — type must be
   optional/null.
6. **Compound door numbers.** `12/3`, `1-2-3`, `26/27` — a `\d+`-only number
   pattern truncates them; kept via `\d+(?:[-/]\d+)*`.
7. **Leading alphanumeric flat id.** `C-204, Tower 3, ...` (letter-first) is not a
   numeric house number — documented `__skip`.
8. **District written AFTER the PIN.** `Bengaluru - 560034, Bengaluru Urban,
   Karnataka` — a revenue district between the PIN and the state has no field and
   breaks the tail; documented `__skip`.
9. **Sector / SCO grid addressing.** Chandigarh `SCO 45, Sector 17`, Noida
   `Sector 62` — the sector-grid and Shop-Cum-Office prefixes are not modelled.
10. **Hyderabad `H.No` door prefix + locality-only line.** `H No 5-6-123,
    Nampally, ...` — not modelled.
11. **PIN written BEFORE the city** (rare inverted order) — the after-city grammar
    cannot place it; documented `__skip`.
12. **All-caps state / mixed transliteration.** `KARNATAKA`, city renames
    (Bengaluru/Bangalore, Mumbai/Bombay, Chennai/Madras, Kolkata/Calcutta) — match
    case-insensitively; both spellings occur.

---

## 8. Field-mapping decisions

- `number` — leading integer (or `n/n`, `n-n-n`), optional `No.`/`#` lead-in.
- `civic_number_suffix` — trailing letter.
- `street` — name without the trailing type; may retain internal digits
  ("80 Feet", "100 Feet").
- `type` — trailing Road/Marg/Salai/Sarani/Cross/Main/...; null when absent.
- `sec_unit_type`/`sec_unit_num` — Flat/Shop/Plot + value.
- `building` — a leading name ending in a building keyword ("Sunrise Apartments").
- `city` — routing city (last of the locality chain); earlier localities dropped.
- `state` — 2-letter code, from either side of the PIN.
- `postal_code` — 6-digit PIN, normalised (space stripped).
- `country` — `IN`.

---

## Sources

- India Post — https://www.indiapost.gov.in/
- Wikipedia — Postal Index Number — https://en.wikipedia.org/wiki/Postal_Index_Number
- pincodesinfo — How to write a postal address in India (format & examples) — https://www.pincodesinfo.in/blog/how-to-write-postal-address-india-correct-format
- pincodesinfo — PIN code structure explained — https://www.pincodesinfo.in/blog/pin-code-structure-explained-india
- Maps of India — PIN code directory — https://www.mapsofindia.com/pincode/
- Google libaddressinput (IN metadata) — https://chromium-i18n.appspot.com/ssl-address/data/IN
- Wikipedia — Address format by country and area — https://en.wikipedia.org/wiki/Address_format_by_country_and_area
