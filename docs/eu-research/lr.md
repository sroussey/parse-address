# Liberia (LR) Street Address Research

Config-driven Intl address parser. English-speaking West Africa. Postal
operator: **Liberia Post Office**. Number-first, trailing English street types,
a rarely-used **4-digit postcode**, county-level regions, and a common PO Box.

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 20 Broad Street
[Community / district]        <- Sinkor   (dropped)
[City] [Postcode]             <- Monrovia 1000  (code usually omitted)
[County]                      <- Montserrado
[Country]
```

Monrovia also has numbered cross-streets written as the street NAME itself
("12th Street, Sinkor").

## 2. Postcodes

4-digit numeric, written **after the city**; adoption is very low, so the code
is usually omitted → `(?<postal_code>\d{4})`, optional. Traditional Monrovia
mail instead uses a **zone number** ("Monrovia 10") which is *not* a postcode
and is marked `__skip`.

## 3. County (-> state)

The 15 counties (Montserrado, Nimba, Bong, Grand Bassa, Margibi, Lofa, Grand
Gedeh, Sinoe, Maryland, Bomi, Grand Cape Mount, Grand Kru, River Cess, River
Gee, Gbarpolu) do **not** duplicate the major city names (Monrovia is in
Montserrado), so a restricted county list is recognised in the state slot;
two-word names escape spaces to `\s+`.

## 4. Localities

Monrovia communities: Sinkor, Congo Town, Paynesville, Mamba Point, Old Road,
Bushrod Island. Kept in the comma chain; leading area(s) dropped.

## 5. PO Box

Common. "P.O. Box 1234, Monrovia"; "Private Bag" also seen.

## 6. Street types

Street, Boulevard, Road, Avenue, Drive, Close, Crescent, Lane, Highway
(+ abbreviations). Type optional.

## 7. Known gaps

- Zone-number form "Monrovia 10" — `__skip` (not a 4-digit postcode).

## 8. Sources

Liberia Post Office; UPU S42 LR template; Smarty / PostGrid LR guides.
47 validated samples (1 `__skip`).
