# Sri Lanka (LK) Street Address Research

Research for the config-driven XRegExp address parser. Focus: Sri Lanka Post's
5-digit postcode, the trailing-suffix thoroughfare grammar (Road / Mawatha /
Street / Lane / Place / Avenue), the suburb-before-city locality chain, and the 9
provinces written either side of the postcode. Target: the common single-line
romanised (English) business form; native Sinhala/Tamil forms are out of scope.

---

## 1. Canonical address order

Sri Lanka Post's order (top to bottom): recipient; house/assessment number +
street; town/city + postcode; (optional district/province); country. Collapsed to
one comma-joined line the common business form is:

```
[No] Number, Street Name Type, [Suburb,] City <NNNNN>[, Province]
```

Real examples the parser targets (Smarty / Umbrex / PostGrid):

```
478 Meekanuwa Road, Kandy 20000
123 Galle Road, Colombo 00300
No. 201, Silkhouse Street, Kandy 20000
56/2, Araliya Uyana 1st Lane, Maharagama 10230
88, R A De Mel Mawatha, Bambalapitiya, Colombo 00400
```

So: **number first, trailing-SUFFIX type, postcode AFTER the city (after-city).**
The province may follow the postcode ("Colombo 00900, Western Province") or, less
commonly, precede it (folded via the county slot).

---

## 2. Postcode — the 5-digit code

- **Exactly 5 digits**; the first two digits are the postal district/region
  (00xxx Colombo, 20xxx Kandy/Central, 80xxx Galle/Southern, 40xxx Jaffna, ...).
  Leading zeros are significant (Colombo codes are 001xx–008xx), so the field is
  captured verbatim as `\d{5}`.
- **Position: after the city** (after-city), typically space-separated
  ("Kandy 20000"); some corpora comma-separate it ("KANDY, 20000").
- Sri Lanka does not hyphen-glue the postcode to the city (unlike Bangladesh);
  the space form dominates.

---

## 3. Thoroughfare types — trailing SUFFIX

The type is a trailing suffix appended to the name: `Galle Road`, `Silkhouse
Street`, `1st Lane`, `Ward Place`, `Marine Drive`, `Bauddhaloka Mawatha`.

- English: Road/Rd, Street/St, Lane, Avenue/Ave, Place, Drive, Terrace, Crescent,
  Junction, Row, Path.
- **Mawatha** (Sinhala: avenue/road) is the key local type, romanised in most
  business addresses — "R A De Mel Mawatha", "Dharmapala Mawatha", "Bauddhaloka
  Mawatha", "Sir James Peiris Mawatha". **Vidiya** (Sinhala street) also occurs.
- Numbered/ordinal names occur ("1st Lane", "2nd Cross Street"); the ordinal is
  part of the name, the trailing word is the type.
- Many roads are **type-less** (a bare place name); type must be allowed null.

---

## 4. House / assessment number variants

- Plain integer, number FIRST: `123`, `478`, `201`.
- Lead-in `No.` / `#`: `No. 201`, `#24`.
- **Assessment numbers with a slash/hyphen**: `56/2`, `45/1`, `12-3` — kept in
  `number` via `\d+(?:[-/]\d+)*`.
- **Number + letter suffix**: `12A`, `7B` -> `civic_number_suffix`.
- **Secondary unit leads**: `Flat 3`, `Level 4`, `Unit 12`, `Apartment 5`.

---

## 5. Locality chain — suburb, then city

A **suburb/area** (Bambalapitiya, Wellawatte, Nugegoda, Pettah, ...) sits between
the street and the city. Because the postcode is after the city, the IN/ZA trick
applies: the comma-separated chain is kept together in the city capture
(`cityAllowsCommas`), then `postNormalize` keeps the **last** part as the routing
city and records the earlier suburbs as `__dropped` (exempt from the token guard).
A real province before the postcode is protected by a province-only `countyPattern`.

---

## 6. Province — output as a short code

9 provinces -> `state` as a 2-letter code: Western WP, Central CP, Southern SP,
Northern NP, Eastern EP, North Western NW, North Central NC, Uva UV, Sabaragamuwa
SG. Captured **before** the postcode via the county slot ("Colombo 00900, Western
Province" is actually written after; the true before-postcode case
"..., Western Province 00900" is rare) OR **after** the postcode via a helper
`lk_state` group, which `postNormalize` folds to `state`. A trailing "Province"
word is accepted and stripped. Districts (Colombo, Kandy, Galle, ...) are cities,
not provinces, and are never mapped to `state`.

Secondary units: Flat / Apartment / Apt, Floor / Level, Unit, Suite, Room.
PO box: PO Box / P.O. Box / Post Box. Building keywords: Tower(s), Building,
Centre/Center, Complex, Chambers, Plaza, Arcade, House.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Sri Lanka Post; Wikipedia "Postal codes in Sri Lanka"; UPU addressing
S42 (lkaEn.pdf); Smarty global address formatting (LK); PostGrid / Umbrex /
GeoPostcodes Sri Lanka guides; advice.lk Colombo postcode list.

1. **Colombo district number written INTO the city.** "Colombo 03" / "Colombo 3"
   (postal-district shorthand) with no 5-digit code — the digit ends the city
   capture; documented `__skip`.
2. **Hyphen-glued "City-NNNNN".** Sri Lanka normally spaces the postcode; a glued
   "Kandy-20000" is not separated by the shared `[\s,]+` place separator;
   documented `__skip`.
3. **Postcode comma-separated after an all-caps city.** "KANDY, 20000" — the
   comma+space before the code differs from the space form; documented `__skip`.
4. **Mawatha / Vidiya types.** Must be in the type vocabulary or a Mawatha road is
   mislabelled / left in the name.
5. **Type-less roads.** Bare place names (no Road/Street/...) must parse with a
   null type.
6. **Assessment numbers.** `56/2`, `45/1` — a `\d+`-only number truncates them;
   kept via `\d+(?:[-/]\d+)*`.
7. **Multi-suburb chain.** Two+ localities before the city; earlier suburbs are
   dropped (recorded in `__dropped`).
8. **Province either side of the postcode.** Folded via the county slot (before)
   or the `lk_state` helper (after); both map to a 2-letter code.
9. **Development / square names.** "Echelon Square", "World Trade Centre, Echelon
   Square" — a type-less development block is not modelled as a street;
   documented `__skip`.
10. **Native Sinhala/Tamil script.** Out of scope; romanised forms only.
11. **City renames / spellings.** Colombo suburbs numbered (Colombo 1–15); matched
    case-insensitively where a 5-digit code is present.

---

## 8. Field-mapping decisions

- `number` — leading integer (or `n/n`), optional `No.`/`#` lead-in.
- `civic_number_suffix` — trailing letter.
- `street` — name without the trailing type; may retain digits ("1st").
- `type` — trailing Road/Mawatha/Street/Lane/Place/...; null when absent.
- `sec_unit_type`/`sec_unit_num` — Flat/Level/Unit + value; PO Box + value.
- `building` — a leading name ending in a building keyword.
- `city` — routing city (last of the chain); earlier suburbs dropped.
- `state` — 2-letter province code, from either side of the postcode.
- `postal_code` — 5-digit code, verbatim.
- `country` — `LK`.

---

## Sources

- Sri Lanka Post — https://www.slpost.gov.lk/
- Wikipedia — Postal codes in Sri Lanka — https://en.wikipedia.org/wiki/Postal_codes_in_Sri_Lanka
- UPU S42 addressing (Sri Lanka) — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/lkaEn.pdf
- Smarty — Sri Lanka address format & examples — https://www.smarty.com/global-address-formatting/sri-lanka-format-examples
- PostGrid — Sri Lanka Address Format With Examples — https://www.postgrid.com/global-address-format/srilanka-address-format/
- Umbrex — How to Address an International Letter to Sri Lanka — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-sri-lanka/
- GeoPostcodes — Sri Lanka address format — https://www.geopostcodes.com/country/sri-lanka/address-format/
- Advice.lk — Colombo & suburb post codes — https://advice.lk/colombo-and-suburb-post-codes-list/
