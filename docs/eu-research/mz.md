# Mozambique (MZ) Street Address Research — Portuguese

Research for the config-driven EU/Intl address parser. Focus: Correios de
Moçambique addressing, Portuguese type-first order, the 4-digit postcode (often
omitted), the bairro line, the province (-> state), and the Caixa Postal box.

---

## 1. Canonical order

Portuguese grammar family (as PT/BR): **thoroughfare TYPE + NAME first, then the
house number after the name**. The **4-digit postcode precedes the city**, with
the province after the city.

```
[Addressee]
<TYPE> <NAME> <NUMBER>[, <FLOOR>]        <- Avenida Eduardo Mondlane 1234
<BAIRRO>                                  <- Bairro Central
<PPPP> <CITY>[, <PROVÍNCIA>]              <- 1100 Maputo, Maputo
MOZAMBIQUE
```

Single-line forms:

```
Avenida Eduardo Mondlane 1234, Maputo
Avenida Julius Nyerere 657, 1100 Maputo
Avenida 24 de Julho 380, Bairro Central, 1100 Maputo, Maputo
Caixa Postal 1234, Maputo
```

- **Type leads the name**; **number after the name** (usually just a space,
  sometimes a "nº" marker). Particles de/da/do/dos/das stay with the name.

---

## 2. Postcode

- **4 digits**, written BEFORE the city ("1100 Maputo"). Structure: first digit =
  region, last three = delivery area/office (Maputo 1100, Matola 1300, Beira
  2100, Nampula 3000; Gaza 12xx, Sofala 21xx, Nampula 31xx).
- **Adoption is patchy** and the code is OFTEN OMITTED, so it is OPTIONAL: the
  before-city grammar makes the postcode block optional and skips it when absent.
- Regex: `\d{4}` (with a `(?![\d-])` guard so it is not a prefix of a longer
  run).

---

## 3. Street types (prefix, Portuguese)

Type leads the name, kept verbatim incl. abbreviations:
`Rua` (R.), `Avenida` (Av.), `Travessa` (Tv./Trav.), `Alameda` (Al.),
`Estrada` (Estr.), `Largo` (Lgo.), `Praça` (Pç.), `Beco`, `Rotunda`, `Via`.
Date/number street names are common ("24 de Julho", "25 de Setembro",
"25 de Junho").

---

## 4. House number + complemento (floor)

- Door number after the name: `1234`, `1234A` (glued letter ->
  `civic_number_suffix`), `nº 1230`, range `12-14`.
- **Complemento** (secondary): floor-first `5º andar`, `R/C`, or explicit-type
  `Apartamento 12`, `Bloco B`, `Flat 3` (the English "flat" is common in MZ). A
  bare floor ordinal defaults to `sec_unit_type = "Andar"`.

---

## 5. Bairro (dropped), city, province (-> state)

- **Bairro** — a neighbourhood on its own segment just before the postcode line
  (Maputo: Polana, Sommerschield, Central, Alto Maé, Malhangalene, Maxaquene,
  Baixa). It is a routing unit but has NO output field, so it is CONSUMED and
  DROPPED via an optional `(?<drop>...)` baked into the postcode pattern (the BR
  bairro trick). The drop is ANCHORED by the postcode and carries no digits, so a
  numbered street segment is never mistaken for a neighbourhood.
- **City** — Maputo, Matola, Beira, Nampula, Nacala, Quelimane, Tete, Chimoio,
  Xai-Xai, Inhambane, Pemba, Lichinga.
- **Província -> `state`** — the 10 provinces plus Cidade de Maputo: Maputo,
  Gaza, Inhambane, Sofala, Manica, Tete, Zambézia, Nampula, Cabo Delgado,
  Niassa. "Maputo" is both a city and a province.
- Country: `Mozambique`, `Moçambique`, `MOZ`, `MZ`.

---

## 6. PO box

`Caixa Postal 1234` (abbr. `C.P.` / `CP`).

---

## 7. Prior work & known failure modes (>=8)

Prior art: Correios de Moçambique; UPU S42 MZ template (MOZ.pdf); Smarty /
GetPostalCodes MZ guides; Wikipedia "Provinces of Mozambique".

1. **Optional postcode.** `Maputo` vs `1100 Maputo` — the code must be optional;
   a required-postcode schema fails the common no-code form.
2. **Bairro line dropped, anchored by the postcode.** `..., Bairro Central, 1100
   Maputo` — the neighbourhood has no field; it is consumed via the drop group
   only when a postcode follows.
3. **Bare place-only line must not eat a street.** A drop group that allowed
   digits would let the place-only rule swallow a numbered street ending in a
   letter ("...1234A, 1100 Maputo"); the drop is restricted to digit-free
   segments (real bug found and fixed).
4. **Number AFTER the name.** "Avenida Eduardo Mondlane 1234" — leading-digit
   assumptions break.
5. **Type leads.** "Avenida Eduardo Mondlane" — token 1 is the type.
6. **Particle dropping.** "Rua da Resistência", "Avenida do Trabalho" must keep
   the "da"/"do".
7. **Two-word province + free-spacing.** "Cabo Delgado", "Cidade de Maputo" —
   literal spaces are ignored in free-spacing regex; province spaces MUST be
   escaped to `\s+` (real bug found and fixed).
8. **City/province collision.** "1100 Maputo, Maputo" — city and province share
   the name; the postcode disambiguates the city, province is the trailing token.
9. **Date-named avenue.** "Avenida 24 de Julho 380" parses (the trailing number
   anchors the name); "25 de Setembro" likewise.
10. **Stacked secondary units.** "252, 5º andar, flat 3, 1100 Maputo" — floor AND
    flat exceed the single sec-unit slot. Documented `__skip`.
11. **Informal peri-urban address.** "Bairro Polana Caniço, Quarteirão 5, Casa
    12" — a bairro+quarteirão+casa address with no thoroughfare is not modelled.
    Documented `__skip`.
12. **4-digit code vs house number.** A 4-digit postcode ("1100") must not be
    read as the house number; it is captured only in the place tail, after the
    street core has consumed the real number.

---

## 8. Field-mapping decisions

- `number` — door number (marker "nº" stripped); glued letter ->
  `civic_number_suffix`.
- `street` — name after the type, particles kept.
- `type` — leading Avenida/Rua/... (verbatim).
- `sec_unit_type`/`sec_unit_num` — Andar/Apartamento/Bloco/Flat + value.
- `city` — the routing city (bairro dropped via the postcode-anchored drop).
- `state` — província when written, else null.
- `postal_code` — 4-digit when written, else null.
- `country` — `MZ`.

---

## Sources

- Correios de Moçambique — https://www.correios.co.mz/
- UPU S42 MZ addressing template (MOZ.pdf) — https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing-Solutions
- Smarty MZ format examples — https://www.smarty.com/global-address-formatting/mozambique-format-examples
- GetPostalCodes MZ — https://www.getpostalcodes.com/mozambique/
- Wikipedia: Provinces of Mozambique — https://en.wikipedia.org/wiki/Provinces_of_Mozambique
