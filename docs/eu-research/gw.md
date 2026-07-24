# Guinea-Bissau (GW) Street Address Research

Config-driven Intl address parser. Portuguese-speaking West Africa. Postal
operator: **Correios da Guiné-Bissau**. Prefix thoroughfare type, number after,
**no postcode**, bairro drop, region as state, a common Caixa Postal.

## 1. Canonical address order

```
[Type] [Name] [Number]        <- Avenida Amílcar Cabral 12
[Bairro]  (dropped)           <- Bandim
[City]                        <- Bissau
[Região]                      <- Bafatá
[Country]
```

Same grammar family as PT/AO (prefix type, number-after, before-city with the
postcode block absent).

## 2. Postcodes

**None.** Guinea-Bissau does not operate a postal-code system. Never-match
sentinel.

## 3. Região (-> state)

8 regions + the Bissau autonomous sector (SAB): Bafatá, Biombo, Bolama-Bijagós,
Cacheu, Gabú, Oio, Quinara, Tombali, Bissau. Several region names also name a
city (Bafatá, Gabú, Cacheu, Bolama) — a documented collision, as in AO/MZ.

## 4. Bairros (dropped via `areaNames`)

Bissau: Bandim, Chão de Papel, Bairro Militar, Cuntum, Antula, Missirá, Quelele,
Cupelão, Ajuda, Belém, Penha, Pluba, Bissau Velho, Santa Luzia.

**Engine note:** the token-preservation stripper matches `areaNames` WITHOUT
word boundaries, so a short bairro name that is a substring of a street word
inflates the count. The short bairro "Bra" was dropped because it matches inside
"Ca**bra**l" (Amílcar Cabral) and tripped TOKEN LOSS; only names >= 4 chars that
are not such substrings are listed.

## 5. Caixa Postal

Common. "Caixa Postal 123" / "C.P.".

## 6. Street types

Avenida, Rua, Praça, Largo, Travessa, Estrada, Beco, Rotunda, Via (+ verbatim
abbreviations). Particles stay with the name.

## 7. Known gaps (`__skip`)

- Bare bairro with no street; landmark descriptors ("Mercado de Bandim").

## 8. Sources

Correios da Guiné-Bissau; Smarty / GeoPostcodes GW guides (no postcodes);
Wikipedia "Regions of Guinea-Bissau". 43 validated samples (2 `__skip`).
