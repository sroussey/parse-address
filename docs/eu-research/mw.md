# Malawi (MW) Street Address Research

Config-driven Intl address parser. English/Chichewa-speaking Southern Africa.
Postal operator: **Malawi Posts Corporation (MPC)**. Number-first, trailing
English street types, **no postcode system**, a dominant PO Box / Private Bag.

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 10 Glyn Jones Road
[Township / area]  (dropped)  <- Namiwawa
[City]                        <- Blantyre
[Country]
```

Lilongwe and Blantyre are also laid out in numbered **"Areas"** ("Area 47",
"Area 3") which sit where a street would; with no street slot of their own they
land in `street` (untyped) — lossless.

## 2. Postcodes

**None.** Malawi has never operated a postal-code system. Never-match sentinel;
the after-city grammar supplies "..., City". A trailing post-office number
("Lilongwe 3") is *not* a postcode and is `__skip`.

## 3. Region / district

The 3 regions / 28 districts are essentially never written on mail. County slot
disabled `(?!x)x`; no `state` modelled.

## 4. Localities

Blantyre/Lilongwe suburbs: Namiwawa, Mandala, Sunnyside, Nyambadwe, and the
numbered "Area N" units. Kept in the comma chain; leading area(s) dropped. A
"Plot" lead-in is consumed and exempted from the token-loss guard.

## 5. PO Box / Private Bag

Dominant. "P.O. Box 30390, Lilongwe", "Private Bag 1, Zomba".

## 6. Street types

Road, Avenue, Street, Drive, Close, Crescent, Boulevard, Highway, Way
(+ abbreviations). Type optional.

## 7. Known gaps

- "Lilongwe 3" post-office number; "Off <road>" descriptors — `__skip`.

## 8. Sources

Malawi Posts Corporation (MPC); UPU S42 MW template (no postcode field);
Smarty / PostGrid MW guides. 44 validated samples (2 `__skip`).
