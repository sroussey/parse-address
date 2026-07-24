# Ghana (GH) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking West
Africa. Postal operator: Ghana Post. Ghana runs TWO addressing systems in
parallel — the GhanaPostGPS national digital address and the older descriptive /
PO-box form — and both are modelled.

---

## 1. Two addressing systems

### (1) GhanaPostGPS digital address

A national digital address assigned to every ~5 m x 5 m location, of the shape:

```
AA-NNN-NNNN          e.g. GA-183-8164, AK-039-5028, GL-152-3333
```

- **First character** = region (G = Greater Accra, A = Ashanti, W = Western,
  C = Central, N = Northern, V = Volta, B = Bono, E = Eastern, U = Upper, ...).
- **Second character** = district within the region (Accra district = A -> "GA",
  Kumasi district = K -> "AK").
- **3-digit number** = area / postcode locality.
- **4-digit number** = unique address within the postcode.
- **"AA-NNN"** (the first two parts) is the **postcode**; the trailing 4 digits
  are the unique address. Example: the Accra Mall is GL-152-3333 with postcode
  GL 152.

We capture the whole code (or the "AA-NNN" postcode alone) as `postal_code`.
Ghana writes the code BEFORE the town ("GA-183-8164, Accra"), so the country is
configured **postcode-first (before-city)**; the code is also recognised when it
trails a street ("Kingsway Road, GA-183-8164, Accra").

### (2) Descriptive / physical address

```
[Sec-unit / House No.] [Number] [Street] [Type]   <- House No. 5, Kingsway Road
[Area]                                             <- Adabraka
[Town]                                             <- Accra
[Region]                                           <- Greater Accra
[Country]
```

Number-first, trailing English type, an area that is dropped, the town, and the
region -> state. Traditional Ghana had NO numeric postal codes and relied on PO
boxes, so a physical address frequently has no postcode at all.

---

## 2. Postcode

- The GhanaPostGPS code: `[A-Za-z]{2}-\d{3}(?:-\d{4})?` — two letters, a 3-digit
  area, optionally a hyphen and the 4-digit unique. Upper-cased on output.
- Position: BEFORE the town (before-city), or trailing a street segment.
- Frequently ABSENT in the descriptive form. Optional.

---

## 3. Street types (suffix, English)

Type is a trailing **suffix**: `Kingsway Road`, `Independence Avenue`,
`Oxford Street`, `Kanda Highway`, `Labone Crescent`, `Ring Road`.

Types: `Street, Road, Avenue, Close, Crescent, Boulevard, Drive, Lane, Way,
Circle, Highway, Court, Place, Walk, Link, Loop, Ring, Row, Park`. Abbreviations
`St, Rd, Ave, Dr, Cres, Blvd, Hwy`. Type must be allowed null (many Ghanaian
places are described by neighbourhood only).

---

## 4. House / building number variants

- Optional lead-in `House No.` / `Plot` / `No.` / `#`, then the number.
- Plot / house numbers may carry slashes ("F123/4" keeps "123/4").
- **Number + letter suffix**: `12A`.
- **Digit-led street name** after the number: `1 28th February Road`.
- **Secondary unit leads**: `Flat 3, 15 Liberation Road`, `House 4, ...`,
  `Apartment 2B, ...`.
- **Building name leads**: `Ridge Towers, 12 Independence Avenue`.
- **PO Box**: box numbers often carry a 1-3 letter exchange prefix —
  `P.O. Box CT 1234` (Cantonments), `P. O. Box M 38` (Ministries),
  `P.O. Box KA 9430` (Airport), plus plain `P.O. Box 12345`.

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `House`, `Suite`, `Block`,
`Floor`, `Room`, `Shop`, `Unit`.

---

## 6. Area, town, region, country

- **Area / neighbourhood** — Accra: Adabraka, Osu, Cantonments, Labone,
  East Legon, Airport Residential, Ridge, North Ridge, Kokomlemle, Kanda;
  Kumasi: Adum. Dropped from the comma chain, keeping the town.
- **Town** — `Accra`, `Kumasi`, `Tamale`, `Takoradi`, `Cape Coast`, `Tema`,
  `Ho`, `Sunyani`, `Koforidua`. Multi-word: `Cape Coast`.
- **Region (-> state)** — the 16 regions (Greater Accra, Ashanti, Western,
  Central, Eastern, Northern, Volta, Bono, Bono East, Ahafo, Oti, Savannah,
  North East, Upper East, Upper West, Western North), optionally suffixed
  "Region". Output is a 2-letter code (AA, AH, WP, CP, EP, NP, TV, ...).
- Country: `Ghana`, `Republic of Ghana`, `GHA`, `GH`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: GhanaPostGPS (Ghana Post) — digital address & postcode scheme;
Ghana Post GPS (Wikipedia); "Regions and District Codes" (ghanapostgps.com);
Smarty / PostGrid GH guides; Ghana Digital Addressing System commentary.

1. **Bare digital code, no town.** `GA-183-8164` alone has no locality for the
   place/street grammar and parses as a street rather than a postcode.
   Marked __skip; delivered forms carry a town ("GA-183-8164, Accra"), which
   parses correctly (via the postcode-first place-only line).

2. **Digital code + area + town.** `GA-183-8164, Osu, Accra` — an area between
   the code and the town breaks the place-only line, and the address grammar
   then takes the code as a street. Documented gap; the common delivered form is
   code + town (no intervening area).

3. **Postcode-only vs full code.** `GA-183` (postcode = region+district+area)
   vs `GA-183-8164` (full). Both accepted; the trailing 4 digits are optional.

4. **Two systems in one corpus.** The same parser must accept both the digital
   code (postcode-first) and the descriptive form (no postcode); the code
   trailing a street ("Kingsway Road, GA-183-8164, Accra") is also handled.

5. **No traditional postcode.** Descriptive addresses often have no code at all;
   the postcode must be optional.

6. **PO Box exchange-letter prefix.** `P.O. Box CT 1234`, `P. O. Box M 38` — the
   1-3 letter prefix is part of the box identifier, not a separate token.

7. **Area + town, one slot.** `Adabraka, Accra` — the leading area is dropped,
   the town kept.

8. **Region multi-word / "Region" suffix.** `Greater Accra`, `Western North`,
   `Bono East`, `Upper East` and their "... Region" spellings must all map to a
   code without a one-token grab truncating them.

9. **Digit-led street name.** `28th February Road` — a name beginning with a
   number after the house number (number-first order allows digits in the name).

10. **Building name before number.** `Ridge Towers, 12 Independence Avenue` —
    building leads.

11. **4-digit area code.** The GhanaPostGPS area is 3 digits; a 4-digit area
    ("BS-0022-1100") is non-standard and not modelled (__skip).

12. **All-caps international form.** `... ACCRA ... GHANA` — case-insensitive.

---

## 8. Field-mapping decisions

- `postal_code` — the GhanaPostGPS code (upper-cased), or absent.
- `number` / `civic_number_suffix` — leading number (+ slash/letter).
- `street` / `type` — name + trailing suffix (type null if absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`House`/... + value, or `PO Box` +
  (prefixed) box number.
- `city` — the routing town (last locality); leading areas dropped.
- `state` — 2-letter region code, when a region is present.
- `country` — `GH`.

---

## Sources

- GhanaPostGPS (Ghana Post) — https://www.ghanapostgps.com/
- GhanaPostGPS Regions and District Codes — https://www.ghanapostgps.com/regions-and-district-codes/
- Ghana Post GPS (Wikipedia) — https://en.wikipedia.org/wiki/Ghana_Post_GPS
- Ghana Digital Addressing System commentary (Medium) — https://medium.com/@deladiamah/ghana-digital-addressing-system-revolutionary-or-ill-considered-acdd3360ff72
- Smarty / PostGrid Ghana address format guides — https://www.postgrid.com/global-address-format/ghana-address-format/
- Regions of Ghana (Wikipedia) — https://en.wikipedia.org/wiki/Regions_of_Ghana
