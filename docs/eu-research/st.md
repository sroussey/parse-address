# São Tomé and Príncipe (ST) Street Address Research

Config-driven Intl address parser. Portuguese-speaking island nation. Postal
operator: **Correios de São Tomé e Príncipe (CST)**. Prefix thoroughfare type,
number after, **no postcode**, bairro drop, district as state, common Caixa
Postal.

## 1. Canonical address order

```
[Type] [Name] [Number]        <- Avenida da Independência 12
[Bairro / zona]  (dropped)    <- Riboque
[City]                        <- São Tomé
[Distrito]                    <- Água Grande
[Country]
```

Same grammar family as PT/AO (prefix type, number-after, before-city with the
postcode block absent).

## 2. Postcodes

**None.** São Tomé and Príncipe does not operate a postal-code system.
Never-match sentinel.

## 3. Distrito (-> state)

6 districts + the autonomous region of Príncipe: Água Grande (contains São Tomé
city), Mé-Zóchi (Trindade), Cantagalo, Caué, Lembá, Lobata, Príncipe. Two-word
and accented/hyphen forms are supported (spaces escaped to `\s+`; ASCII
fallbacks listed).

## 4. Bairros (dropped via `areaNames`)

São Tomé: Riboque, Boa Morte, Bairro do Hospital, Praia Cruz, Bela Vista, Madre
Deus, Quinta de Santo António, Pantufo, Chácara. Only names >= 5 chars not a
substring of a common street word are listed (the token-preservation stripper
matches without word boundaries — see research-gw.md).

## 5. Caixa Postal

Common. "Caixa Postal 123" / "C.P.".

## 6. Street types

Avenida, Rua, Praça, Largo, Travessa, Estrada, Beco, Rotunda, Via (+ verbatim
abbreviations). Particles stay with the name.

## 7. Known gaps (`__skip`)

- Bare bairro with no street; landmark descriptors ("Mercado Central").

## 8. Sources

Correios de São Tomé e Príncipe (CST); Smarty / GeoPostcodes ST guides (no
postcodes); Wikipedia "Districts of São Tomé and Príncipe". 42 validated
samples (2 `__skip`).
