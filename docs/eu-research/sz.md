# Eswatini (SZ) Street Address Research

Config-driven Intl address parser. English/siSwati-speaking Southern Africa
(formerly Swaziland). Postal operator: **Eswatini Posts and Telecommunications
(EPTC)**. Number-first, trailing English street types, a **region-letter + 3
digit postcode**, four regions, and a dominant PO Box / Private Bag.

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 12 Gwamile Street
[Suburb]  (dropped)           <- Sidwashini
[Town] [Postcode]             <- Mbabane H100  (code often omitted)
[Region]                      <- Hhohho
[Country]
```

## 2. Postcodes

A **region letter + 3 digits**: H (Hhohho, e.g. Mbabane H100), M (Manzini,
M200), L (Lubombo, L300), S (Shiselweni, S400). Written after the town.
Adoption is patchy → `(?<postal_code>[HMLS]\d{3})`, optional; upper-cased and
space-stripped in `postalFormat`.

## 3. Region (-> state)

4 regions: Hhohho, Manzini, Lubombo, Shiselweni. "**Manzini**" duplicates a
major city, so only its explicit "Manzini Region" form is recognised; the other
three are recognised bare.

## 4. Localities

Suburbs: Sidwashini, Msunduza, Fonteyn (Mbabane); Ngwane Park, Fairview
(Manzini). Kept in the comma chain; leading area(s) dropped. A "Plot" lead-in is
consumed and exempted from the token-loss guard.

## 5. PO Box / Private Bag

Dominant. "P.O. Box 1234, Mbabane", "Private Bag" (may carry a letter prefix).

## 6. Street types

Street, Road, Avenue, Drive, Close, Crescent, Boulevard, Highway
(+ abbreviations). Type optional.

## 7. Known gaps (`__skip`)

- Bare suburb with no street; "Off <road>" descriptors.

## 8. Sources

EPTC; UPU S42 SZ template; Smarty / PostGrid SZ guides. 44 validated samples
(2 `__skip`).
