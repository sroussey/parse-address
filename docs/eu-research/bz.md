# Belize (BZ) Street Address Research

Research for the config-driven EU/Intl address parser. Belize is the only
officially English-speaking country in Central America and uses a British-
derived, number-first, trailing-type grammar (GB / JM / BS skeleton). Focus: the
**absence of any postcode**, the 6-district `state` model, and the
"District"-suffix spelling.

---

## 1. Canonical address order

Number FIRST, street name + trailing TYPE, then the city/town, then the DISTRICT
(no numeric code):

```
[Number] [Street] [Type]      <- 35 Albert Street
[City / Town]                 <- Belize City
[District]                    <- Belize District   (or bare "Belize")
BELIZE
```

Single-line form:

```
35 Albert Street, Belize City, Belize District
10 Constitution Drive, Belmopan, Cayo
6 Main Street, Punta Gorda, Toledo District
```

So: **number first, suffix type, NO postcode (after-city)**, with the town in the
`city` slot and the **district as `state`**. Number is optional (rural/village
and PO-box mail).

---

## 2. Postcode

- **Belize has NO postcode system.** Nothing numeric follows the district.
- Modelled as a never-match sentinel `(?<postal_code>(?!x)x)` so the place tail
  is exactly "city (, district)".

---

## 3. Street types (trailing suffix)

Trailing SUFFIX, verbatim: `Street, Road, Avenue, Lane, Drive, Close, Court,
Place, Crescent, Terrace, Boulevard, Way, Gardens, Grove, Walk, Heights, Park,
Circle, Row, Hill, Highway, Extension` + abbreviations `Rd, Ave, Dr, Cres, Blvd,
Hwy, Pl, Cl, Ln, Ext`. Belize City has the historic grid (Albert, Regent, Queen,
King, Orange Streets); San Pedro uses `... Drive` (Barrier Reef Drive, Coconut
Drive, Pescador Drive). Type is optional. Rightmost type wins ("North Front
Street" -> "North Front" + "Street"). Numbered avenues in Corozal ("4th Avenue",
"1st Street") put the digit safely inside the name after the house number.

---

## 4. House / building number variants

- Plain integer, number FIRST: `35`, `1`, `10`.
- **Glued letter suffix**: `35A`.
- **Range**: `35-37`.
- **`#` prefix**: `#9 Queen Street`.
- **No number**: village/landmark addresses ("Placencia Village, Stann Creek").
- **Rural "Mile N" markers** ("Mile 8 Western Highway") — not a house number;
  documented `__skip`.

---

## 5. Secondary (sub-building) units

Lead the address (before the number): `Apt`/`Apartment`, `Flat`, `Unit`,
`Suite`, `Shop`, `Lot`, `Room`, `Floor`, `Block`.
Form: `Apt 3, 35 Albert Street, Belize City, Belize District`.

---

## 6. City, district, country

- **City / town** (`city`): `Belize City`, `Belmopan` (capital), `San Ignacio`,
  `Santa Elena`, `Orange Walk Town`, `Corozal Town`, `Dangriga`, `Punta Gorda`,
  `San Pedro`, `Benque Viejo del Carmen`, `Ladyville`, `Placencia`.
- **District** (6) -> `state`, last comma segment. Written **bare** or with a
  trailing **"District"**: `Belize` / `Belize District`, `Cayo`, `Corozal`,
  `Orange Walk`, `Stann Creek`, `Toledo`. Both spellings normalize to the bare
  district name; the trailing "District" word is folded away. County is
  restricted to the district list.
- Country: `Belize`, `BLZ`, `BZ`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: UPU S42 (BZ has no postcode), Smarty / PostGrid BZ guides, Google
libaddressinput (`BZ`: no postal field), Belize Postal Service, Wikipedia
"Districts of Belize".

1. **No postcode at all.** A grammar expecting a trailing numeric code never
   matches; the never-match sentinel keeps the tail as city + district.
2. **District = state.** `..., Belize City, Belize District` — the district is
   the region, not a second city.
3. **"District" suffix optional.** `Cayo` vs `Cayo District`, `Belize` vs
   `Belize District` — both must map to the same normalized district.
4. **`Belize` collides three ways.** The country name, the district name, and the
   city "Belize City" all share the token "Belize". City stops at a comma so
   "Belize City" stays whole; the district list matches the trailing "Belize".
5. **Two-word districts.** `Orange Walk`, `Stann Creek` — one-token grabs
   truncate them; and "Orange Walk **Town**" (city) must not be confused with
   "Orange Walk" (district).
6. **Multi-word city.** `Belize City`, `Orange Walk Town`, `Corozal Town`,
   `San Ignacio`, `Punta Gorda`, `San Pedro`, `Benque Viejo del Carmen`.
7. **No house number.** Village and landmark addresses omit it; number optional.
8. **"Mile N Highway" rural markers.** `Mile 8 Western Highway` — "Mile" is not a
   civic number and "Highway" leads the segment; documented `__skip`.
9. **PO Box dominance.** Most Belize mail is delivered to boxes:
   `P.O. Box 145, Belize City, Belize District` — box replaces the street.
10. **Rightmost-type / multi-word streets.** `Princess Margaret Drive`,
    `Central American Boulevard`, `North Front Street`, `Queen Victoria Avenue`.
11. **Hyphenated street names.** `Belize-Corozal Road`.
12. **Numbered Corozal grid.** `9 4th Avenue`, `3 1st Street` — digit inside the
    name, safe only because the house number is consumed first.

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading integer (or range) + glued letter.
- `street` / `type` — name without the trailing suffix; type null when absent.
- `sec_unit_type` / `sec_unit_num` — leading `Apt`/`Suite`/`Shop`/... + value.
- `city` — the town/city (multi-word allowed).
- `state` — district, normalized to the bare district name (drops "District").
- `postal_code` — never set (no BZ postcode).
- `country` — `BZ`.

---

## Sources

- UPU S42 Belize page (no postcode) — https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Smarty — Belize address format examples — https://www.smarty.com/global-address-formatting/belize-address-format-examples
- PostGrid — Belize address format — https://www.postgrid.com/global-address-format/belize-address-format/
- Umbrex — How to address a letter to Belize — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-belize/
- Belize Postal Service — https://www.belizepostalservice.gov.bz/
- Wikipedia: Districts of Belize — https://en.wikipedia.org/wiki/Districts_of_Belize
- Google libaddressinput (BZ metadata) — https://chromium-i18n.appspot.com/ssl-address/data/BZ
