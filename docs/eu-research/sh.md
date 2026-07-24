# Saint Helena (SH) Street Address Research

Config-driven Intl address parser. British Overseas Territory (Saint Helena,
Ascension and Tristan da Cunha). Uses the **UK addressing model**: number-first,
English street type, a single UK-format postcode written last.

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 3 Main Street
[District]                    <- Jamestown
[Postcode]                    <- STHL 1ZZ
[Country]
```

Many island addresses carry no house number (a named house or a bare street on
a district).

## 2. Postcodes

A single territory-wide code per island:

- **STHL 1ZZ** — Saint Helena
- **ASCN 1ZZ** — Ascension
- **TDCU 1ZZ** — Tristan da Cunha

Written last (after-city). `(?<postal_code>(?:STHL|ASCN|TDCU)\s*1ZZ)`, optional;
normalised to a single internal space in `postalFormat`.

## 3. Locality

The **district IS the routing city** (Jamestown, Half Tree Hollow, Longwood,
Alarm Forest, Saint Paul's, Sandy Bay, Blue Hill, Levelwood). No sub-region is
modelled (county slot disabled).

## 4. Buildings

Named houses lead a company/residential address ("The Castle", "Essex House",
"Rose Cottage"). `buildingKeywords` include House, Cottage, Lodge, Villa,
Castle, Place (the last two are not street types here, so they are safe).

## 5. PO Box

Used. "Post Office Box 42, Jamestown".

## 6. Street types

Street, Road, Lane, Avenue, Drive, Hill, Parade, Steps (+ abbreviations). Type
optional; small-island streets are often bare names.

## 7. Known gaps (`__skip`)

- A bare "district + postcode" line with no street parses as a street rather
  than as a city, so it is not asserted.

## 8. Sources

Saint Helena Government; Royal Mail postcode data (STHL/ASCN/TDCU 1ZZ); UPU
note. 40 validated samples (2 `__skip`).
