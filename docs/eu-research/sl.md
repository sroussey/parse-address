# Sierra Leone (SL) Street Address Research

Config-driven Intl address parser. English-speaking West Africa. Postal
operator: **Sierra Leone Postal Services (SALPOST)**. Number-first, trailing
English street types, **no postcode system**, provinces/Western Area as region,
and a dominant PO Box / Private Mail Bag.

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 12 Siaka Stevens Street
[Neighbourhood]  (dropped)    <- Congo Cross
[City]                        <- Freetown
[Province / Western Area]     <- Western Area
[Country]
```

## 2. Postcodes

**None.** Sierra Leone has never operated a postal-code system. Never-match
sentinel; the after-city grammar supplies "..., City".

## 3. Region (-> state)

The 3 provinces (Northern, Southern, Eastern) + the **Western Area** (which
contains Freetown). Only the explicit province/area forms are recognised so a
bare city is never eaten. Bare Northern/Southern/Eastern are unambiguous.

## 4. Localities

Freetown neighbourhoods: Aberdeen, Lumley, Wilberforce, Congo Cross, Murray
Town, Brookfields, Hill Station. Kept in the comma chain; leading area(s)
dropped.

## 5. PO Box / Private Mail Bag

Dominant. "P.O. Box 1234, Freetown", "Private Mail Bag" / "PMB".

## 6. Street types

Street, Road, Avenue, Drive, Close, Crescent, Boulevard, Highway
(+ abbreviations). Type optional.

## 7. Known gaps (`__skip`)

- "Off <road>" descriptors; bare neighbourhood with no street.

## 8. Sources

SALPOST; UPU S42 SL template (no postcode field); Smarty / PostGrid SL guides.
45 validated samples (2 `__skip`).
