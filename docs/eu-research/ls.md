# Lesotho (LS) Street Address Research

Config-driven Intl address parser. English/Sesotho-speaking Southern Africa.
Postal operator: **Lesotho Postal Services**. Number-first, trailing English
street types, a **3-digit numeric postcode** (often omitted), a dominant
PO Box / Private Bag form.

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 12 Kingsway Road
[Suburb / area]  (dropped)    <- Maseru West
[Town] [Postcode]             <- Maseru 100   (code often omitted)
[Country]
```

PO Box (dominant): `P.O. Box 524, Maseru 100`.

So: **number first, suffix type, postcode after the town (after-city)** — the
GB/KE skeleton with a 3-digit code.

## 2. Postcodes

3-digit numeric, written **after the town** ("Maseru 100"). Adoption is low, so
the code is frequently omitted → modelled `(?<postal_code>\d{3})`, optional.

## 3. Region / district

The 10 districts (Maseru, Berea, Leribe, Mafeteng, Mohale's Hoek, Quthing,
Qacha's Nek, Mokhotlong, Thaba-Tseka, Botha-Bothe) **duplicate their capital
town names** and are essentially never written on mail. To avoid the county
slot eating the routing town, it is disabled `(?!x)x`; no `state` is modelled.

## 4. Localities

Maseru areas: Maseru West, Old Europa, Ha Thetsane, Sea Point, Lithabaneng,
Khubetsoana. Kept in the comma chain; leading area(s) dropped in `postNormalize`.

## 5. PO Box / Private Bag

Dominant. "P.O. Box", "PO Box", "Private Bag" (bag numbers may carry a letter
prefix, "Private Bag A1"). A "Plot" lead-in is retained as the house number and
exempted from the token-loss guard.

## 6. Street types

Road, Street, Avenue, Drive, Close, Crescent, Boulevard, Highway, Circle, Way
(+ abbreviations). Type optional. "Kingsway" is often written bare.

## 7. Known gaps

- Bare "Ha <name>" settlements with no street and "Off <road>" descriptors —
  `__skip`.

## 8. Sources

Lesotho Postal Services; UPU S42 LS template; Smarty / PostGrid LS guides.
44 validated samples (2 `__skip`).
