# Cape Verde (CV) Street Address Research

Config-driven Intl address parser. Portuguese-speaking island nation. Postal
operator: **Correios de Cabo Verde**. Prefix thoroughfare type, number after,
a **4-digit postcode** before the city, island as region, a common Caixa Postal.

## 1. Canonical address order

```
[Type] [Name] [Number]        <- Avenida Amílcar Cabral 12
[Bairro / zona]  (dropped)    <- Plateau
[Postcode] [City]             <- 7600 Praia   (code often omitted)
[Island]                      <- Santiago
[Country]
```

Same grammar family as PT/BR/MZ (prefix type, number-after, before-city
postcode).

## 2. Postcodes

**4 digits**, written **before the city** ("7600 Praia", "2110 Mindelo").
Adoption is patchy → optional. The bairro drop is anchored by the postcode:
`(?:(?<drop>[^,\n\d]*?[^\d\s,]),\s*)?(?<postal_code>\d{4})(?![\d-])` — the drop
segment carries no digits, so a numbered street ending in a letter is never
swallowed.

## 3. Ilha (-> state)

The island (Santiago, São Vicente, Sal, Boa Vista, Fogo, Santo Antão, São
Nicolau, Maio, Brava) may follow the city. Island names do not duplicate the
major city names (Praia is on Santiago, Mindelo on São Vicente), so a plain
island list is used (spaces escaped to `\s+`).

## 4. Bairros

Praia: Plateau/Platô, Achada Santo António, Palmarejo, Prainha, Fazenda, Terra
Branca. Mindelo: Ribeira Bote. Consumed and dropped via the postcode-anchored
`(?<drop>...)`.

## 5. Caixa Postal

Common. "Caixa Postal 123" / "C.P.".

## 6. Street types

Avenida, Rua, Praça, Largo, Travessa, Estrada, Beco, Alameda, Rotunda, Via
(+ verbatim abbreviations). Particles (de/da/do) stay with the name.

## 7. Known gaps (`__skip`)

- Bare bairro with no street and no postcode anchor; industrial-zone
  descriptors.

## 8. Sources

Correios de Cabo Verde; UPU S42 CV template; Smarty / GeoPostcodes CV guides;
Wikipedia "Islands of Cape Verde". 43 validated samples (2 `__skip`).
