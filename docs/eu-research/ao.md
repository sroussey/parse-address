# Angola (AO) Street Address Research — Portuguese

Research for the config-driven EU/Intl address parser. Focus: Portuguese
type-first addressing, the ABSENCE of postcodes, the bairro/município line, the
province (-> state), and the Caixa Postal box.

---

## 1. Canonical order

Portuguese grammar family (as PT/BR): **thoroughfare TYPE + NAME first, then the
house number after the name**, often with a "nº" marker. There is **no
postcode**.

```
[Addressee]
<TYPE> <NAME>, nº <NUMBER>[, <FLOOR>]   <- Rua Amílcar Cabral, nº 45
<BAIRRO / MUNICÍPIO>                     <- Ingombota
<CITY>[, <PROVÍNCIA>]                    <- Luanda, Luanda
ANGOLA
```

Single-line forms:

```
Rua Amílcar Cabral, nº 45, Ingombota, Luanda
Avenida 4 de Fevereiro, Ingombota, Luanda
Avenida da Independência, nº 150, Lubango, Huíla
Caixa Postal 1234, Luanda
```

- **Type leads the name** ("Rua Rainha Ginga" -> name "Rainha Ginga").
- **Number after the name**, after a comma and often "nº"/"n.º".
- Particles **de/da/do/dos/das** are part of the NAME ("Largo do Kinaxixi" ->
  name "do Kinaxixi").

---

## 2. Postcode

- **NONE.** Angola does not operate a postal-code system; mail is descriptive
  (street/box, bairro, city, province). Smarty and Umbrex both state Angola has
  no postcodes.
- Some **geodata sets** (GeoNames, exampleaddress.com) attach a 4-digit "1000",
  "2200", "2300" pseudo-code to Angolan localities. This is a geocoding
  convenience, **not a real postal code**, and official mail omits it — it is
  treated as a documented failure mode and NOT modelled (postcode slot is a
  never-match sentinel).

---

## 3. Street types (prefix, Portuguese)

Type leads the name, kept verbatim incl. abbreviations:
`Rua` (R.), `Avenida` (Av.), `Travessa` (Tv./Trav.), `Alameda` (Al.),
`Estrada` (Estr.), `Largo` (Lgo.), `Praça` (Pç.), `Beco`, `Rotunda`, `Via`.
Date/number street names are common ("4 de Fevereiro", "1º de Maio",
"Revolução de Outubro").

---

## 4. House number + floor unit

- Door number after the name: `nº 45`, `45`, `12A` (glued letter ->
  `civic_number_suffix`), range `12-14`.
- **Floor unit** (secondary): `2º andar`, `3º Esq`, `R/C` (rés-do-chão),
  `Apartamento 4`, `Bloco B`. Modelled as one sec-unit value; a bare floor
  ordinal defaults to `sec_unit_type = "Andar"`.

---

## 5. Bairro / município (dropped) and province (-> state)

- **Bairro / município** — a neighbourhood or urban municipality between the
  street and the city (Luanda: Ingombota, Maianga, Maculusso, Alvalade,
  Sambizanga, Rangel, Cazenga, Viana, Kilamba, Talatona, Miramar, Prenda,
  Samba). It is a routing unit but has NO output field, so a RECOGNISED bairro is
  CONSUMED and DROPPED (a curated `areaNames` list). Unknown bairros are a
  documented failure mode.
- **City** — usually the provincial capital: Luanda, Lubango, Benguela, Lobito,
  Huambo, Cabinda, Namibe, Malanje, Soyo, Sumbe, Menongue.
- **Província -> `state`** — the provinces (Luanda, Benguela, Huíla, Huambo,
  Cabinda, Namibe, Malanje, Zaire, Cuanza Sul/Norte, Cuando Cubango, ...). 18
  classic provinces, expanded to 21 in 2024 (Icolo e Bengo, Cuando, Moxico
  Leste); alt K-spellings (Kwanza/Kuando) occur. Captured to `state` when
  written after the city.
- Country: `Angola`, `AGO`, `AO`.

---

## 6. PO box

`Caixa Postal 1234` (abbr. `C.P.` / `CP`). Common where street delivery is
unreliable.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Correios de Angola (ENCTA); Smarty / GeoPostcodes AO guides; Umbrex
"How to address a letter to Angola"; Wikipedia "Provinces of Angola".

1. **No postcode.** Nothing to capture; a required-postcode schema leaves it
   null. Do not read the province or a house number as a code.
2. **Geodata pseudo-codes.** `1000, Luanda` (GeoNames-style) is not a postal
   code; a parser that trusts it invents a non-existent field. Documented
   `__skip`.
3. **City/province name collision.** Luanda, Benguela, Huambo, Namibe, Cabinda,
   Malanje are BOTH a capital city AND a province; "..., Luanda, Luanda" is
   city+province, "..., Luanda" is just the city. Ambiguous without more tokens.
4. **Number AFTER the name.** "Rua Amílcar Cabral 45" — leading-digit assumptions
   (US "45 Main St") break.
5. **Type leads.** "Rua Rainha Ginga" — token 1 is the type, not the name.
6. **Particle dropping.** "Largo do Kinaxixi" / "Avenida da Independência" must
   keep the "do"/"da" in the name.
7. **Two-word province + free-spacing.** "Cuando Cubango", "Cuanza Sul" — literal
   spaces are ignored in free-spacing regex, so province spaces MUST be escaped
   to `\s+` or the whole line fails to parse (real bug found and fixed).
8. **Date-named avenue with no number.** "Avenida 4 de Fevereiro, Luanda" — the
   number-after grammar collapses the digit-containing name unless a recognised
   bairro or a real number follows. Documented `__skip` for the bare form;
   parses when a bairro or number is present.
9. **Unknown bairro.** Only curated bairros are dropped; an unlisted
   neighbourhood is not consumed and would land in `street`/`city`.
10. **Floor unit "3º Esq" / "R/C".** The ordinal indicator "º", the slash in
    "R/C", and the "andar" word must be captured as one sec-unit, not folded into
    street or number.
11. **Leading "Bairro ..." before the street.** Only a trailing bairro is
    dropped; a bairro written FIRST is not modelled. Documented `__skip`.

---

## 8. Field-mapping decisions

- `number` — door number (marker "nº" stripped); glued letter ->
  `civic_number_suffix`.
- `street` — name after the type, particles kept.
- `type` — leading Rua/Avenida/... (verbatim).
- `sec_unit_type`/`sec_unit_num` — Andar/Apartamento/Bloco + value ("2º",
  "3º Esq", "R/C").
- `city` — the routing city (bairro dropped via `areaNames`).
- `state` — província when written, else null.
- `postal_code` — always null (no Angolan postcodes).
- `country` — `AO`.

---

## Sources

- Correios de Angola (ENCTA) — https://www.correiosdeangola.ao/
- Smarty AO format examples — https://www.smarty.com/global-address-formatting/angola-address-format-examples
- GeoPostcodes AO — https://www.geopostcodes.com/country/angola/zip-code/
- Umbrex "How to address a letter to Angola" — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-angola/
- Wikipedia: Provinces of Angola — https://en.wikipedia.org/wiki/Provinces_of_Angola
