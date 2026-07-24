# Guyana (GY) Street Address Research

Research for the config-driven EU/Intl address parser. Guyana is the only
English-speaking country in South America and uses a British-derived, number-
first, trailing-type grammar (GB / JM skeleton). Focus: the **ward + post-town
locality chain** (two localities, one slot), the **optional numbered/na med
region as `state`**, and the effective **absence of a postcode**.

---

## 1. Canonical address order

Number FIRST, street name + trailing TYPE, then a WARD / neighbourhood, then the
post town, then (optionally) the administrative region:

```
[Number] [Street] [Type]      <- 15 Church Street
[Ward / Area]                 <- Cummingsburg
[Town]                        <- Georgetown
[Region]                      <- Region 4 / Demerara-Mahaica   (optional)
GUYANA
```

Single-line form:

```
15 Church Street, Cummingsburg, Georgetown
20 Regent Street, Lacytown, Georgetown, Demerara-Mahaica
5 Main Street, New Amsterdam, Region 6
```

So: **number first, suffix type, NO everyday postcode (after-city)**. The
routing city is the LAST locality (the post town, e.g. Georgetown); an earlier
ward is a dependent locality dropped from the single `city` slot (ZA-style). The
**region is optional** and maps to `state`.

---

## 2. Postcode

- Guyana has **no postcode in everyday use.** A 7-digit UPU scheme exists on
  paper (e.g. GPO documentation) but is essentially never written on mail.
- Modelled as a never-match sentinel `(?<postal_code>(?!x)x)`; the tail is
  `(ward,) town (, region)`.

---

## 3. Street types (trailing suffix)

Trailing SUFFIX, verbatim: `Street, Road, Avenue, Lane, Drive, Close, Court,
Place, Crescent, Terrace, Boulevard, Way, Gardens, Grove, Walk, Heights, Park,
Circle, Row, Hill, Highway, Dam, Scheme` + abbreviations `Rd, Ave, Dr, Cres,
Blvd, Hwy, Pl, Cl, Ln, Gdns`. Georgetown's grid: Regent, Water, Camp, Church,
Robb, High, Lamaha, Waterloo Streets; Vlissengen, Sheriff, Public Roads; Mandela,
Homestretch, Carifesta, Barima Avenues. Some names are **type-less** ("Brickdam",
"Strand"). `Dam` and `Scheme` are Guyanese type words (drainage-dam access roads;
housing "schemes"). Type must be optional; rightmost type wins.

---

## 4. House / building number variants

- Plain integer, number FIRST: `15`, `115`, `1`.
- **Glued letter suffix**: `15A`.
- **Range**: `15-17`.
- **`#` prefix**: `#8 Camp Street`.
- **`Lot N` prefix** — very common as a secondary unit ("Lot 25, 10 Aubrey
  Barker Road"); a bare "Lot N Section X" scheme line has no street type and is
  a documented `__skip`.

---

## 5. Secondary (sub-building) units

Lead the address (before the number): `Apt`/`Apartment`, `Flat`, `Unit`,
`Suite`, `Shop`, `Lot`, `Room`, `Floor`, `Block`. `Lot` is the distinctively
Guyanese one.

---

## 6. Ward, town, region, country

- **Ward / area** — dependent locality before the town. Georgetown wards:
  `Kingston`, `Cummingsburg`, `Alberttown`, `Queenstown`, `Bourda`,
  `Werk-en-Rust`, `Lacytown`, `Robbstown`, `Newtown`, `Kitty`, `Campbellville`,
  `Bel Air Park`, `Stabroek`, `Sophia`. When a town follows, the ward is dropped
  from the `city` slot (recorded so it is not scored as a lost token). When NO
  town follows, the ward itself IS the `city` ("20 Barima Avenue, Bel Air Park").
- **Town** (`city`): `Georgetown` (capital), `New Amsterdam`, `Linden`,
  `Anna Regina`, `Bartica`, `Corriverton`, `Vreed-en-Hoop`.
- **Region** (optional -> `state`): the 10 administrative regions, written as a
  **number** (`Region 4`), an **official name** (`Demerara-Mahaica`,
  `East Berbice-Corentyne`), or a **colloquial coastal band**
  (`East Bank Demerara`, `East Coast Demerara`, `West Coast Demerara`,
  `West Bank Demerara`). County is restricted to that region list.
- Country: `Guyana`, `GUY`, `GY`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: UPU S42 GY template, Smarty / PostGrid GY guides, Google
libaddressinput (`GY`), Guyana Post Office Corporation, Wikipedia "Regions of
Guyana" and "Georgetown, Guyana".

1. **Two localities, one slot (ward + town).** `15 Church Street, Cummingsburg,
   Georgetown` — both precede the (absent) postcode; the parser keeps the LAST
   (Georgetown) as `city` and drops the ward. Primary GY failure mode.
2. **No everyday postcode.** A trailing-code expectation never matches.
3. **Region optional and multi-form.** `Region 4`, `Demerara-Mahaica`,
   `East Bank Demerara` all denote a region; must map to `state` and not be read
   as a second city. Numeric "Region N" and hyphenated official names both occur.
4. **Ward-as-city when no town.** `20 Barima Avenue, Bel Air Park` — the ward is
   the routing locality; no drop should happen.
5. **Type-less street names.** `Brickdam`, `Strand` — type must be optional.
6. **Coastal-band regions look like localities.** `East Bank Demerara` is a
   region, not a ward/town; restricting county to the region list keeps it in
   `state`.
7. **`Lot N` scheme forms.** `Lot 15 Section K, Campbellville, Georgetown` — Lot
   is the number and the section is a type-less locality; documented `__skip`.
8. **Ward-only / estate-only lines.** `Sophia, Georgetown`,
   `Plantation Versailles, West Bank Demerara` — no street/number; `__skip`.
9. **Hyphenated ward/town names.** `Werk-en-Rust`, `Vreed-en-Hoop` — hyphens are
   part of the name, not separators.
10. **`Public Road` repetition.** Many coastal addresses share the street name
    "Public Road"; the locality after it is what disambiguates.
11. **Multi-word / person-name streets.** `Aubrey Barker Road`,
    `New Market Street`, `Wismar Hill Road`.
12. **PO Box.** `P.O. Box 101, Georgetown` — plain numeric, box replaces street.

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading integer (or range) + glued letter.
- `street` / `type` — name without the trailing suffix; type null when absent.
- `sec_unit_type` / `sec_unit_num` — leading `Lot`/`Apt`/`Suite`/... + value.
- `city` — the routing town (last locality); an earlier ward is dropped and
  recorded (not scored as a lost token). A lone ward IS the city.
- `state` — region, only when explicitly present (`Region N`, official name, or
  coastal band); else null.
- `postal_code` — never set (no GY postcode in use).
- `country` — `GY`.

---

## Sources

- UPU S42 Guyana addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/guyEn.pdf
- Smarty — Guyana address format examples — https://www.smarty.com/global-address-formatting/guyana-address-format-examples
- PostGrid — Guyana address format — https://www.postgrid.com/global-address-format/guyana-address-format/
- Umbrex — How to address a letter to Guyana — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-guyana/
- Wikipedia: Regions of Guyana — https://en.wikipedia.org/wiki/Regions_of_Guyana
- Wikipedia: Georgetown, Guyana (wards) — https://en.wikipedia.org/wiki/Georgetown,_Guyana
- Google libaddressinput (GY metadata) — https://chromium-i18n.appspot.com/ssl-address/data/GY
