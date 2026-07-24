# Suriname (SR) Street Address Research

Research for the config-driven EU/Intl address parser. Suriname is a former Dutch
colony; **Dutch is the official language** and the street grammar follows the
Dutch (NL) model, NOT the English Caribbean one. Focus: street-first order with a
fused lowercase type suffix, the **absence of a postcode**, and the 10-district
`state`.

---

## 1. Canonical address order

Street name FIRST (with a glued lowercase type suffix), house number AFTER, then
the city and optionally the district:

```
[Street(+fused type)] [Number]   <- Domineestraat 26
[City]                           <- Paramaribo
[District]                       <- Paramaribo   (optional)
SURINAME
```

Single-line form:

```
Domineestraat 26, Paramaribo
Kwattaweg 123, Paramaribo, Paramaribo
Indira Gandhiweg 50, Lelydorp, Wanica
```

So: **street first, number after, fused type, NO postcode.** Structurally the
Dutch skeleton (`street-number`, `fused`, `before-city`), but with the postcode
slot empty; the place tail is just city (, district).

---

## 2. Postcode

- **Suriname has NO postcode system** in daily use. Nothing numeric precedes the
  city.
- Modelled as a never-match sentinel `(?<postal_code>(?!x)x)`. The Dutch
  "before-city" place fragment already makes the postcode optional, so the tail
  parses as city (, district) with no code.

---

## 3. Street types (fused suffix)

The type is a **glued lowercase suffix** on the name (Dutch style), kept
verbatim and split off in normalization:

| Suffix   | Example           | street + type         |
|----------|-------------------|-----------------------|
| straat   | Domineestraat     | Dominee + straat      |
| weg      | Kwattaweg         | Kwatta + weg          |
| laan     | Mahonylaan        | Mahony + laan         |
| dreef    | (Mangodreef)      | Mango + dreef         |
| kade     | (Waterkade)       | Water + kade          |
| plein / singel / gracht / steeg / hof / pad | ...  | ...     |

Spaced compounds are NOT split at the space (Dutch `splitSpacedType: false`):
"Henck Arronstraat" -> "Henck Arron" + "straat", "Indira Gandhiweg" ->
"Indira Gandhi" + "weg". Many names have **no separable type** ("Waterkant",
"Strand", "Oost-Westverbinding") and keep `type` null. Minimum fused stem length
3 guards against cutting a bare type word.

Note "Wagenwegstraat": the *name* stem contains "-weg" but the fused type is the
final "-straat" (longest-suffix-first matching handles it).

---

## 4. House / number variants (toevoeging)

- number AFTER the street: `26`, `123`, `5`.
- **Glued letter toevoeging**: `26a` -> `civic_number_suffix`.
- **Dash toevoeging / range**: `123-125` — captured as `civic_number_suffix`
  ("125"), following the Dutch model.

---

## 5. Secondary units

Suriname (like NL) does not use English-style Apartment/Flat unit words; sub-
building detail rides in the toevoeging (§4). No secondary-unit pattern is
configured. PO boxes are the one "unit-like" form (§6).

---

## 6. City, district, country

- **City** (`city`): `Paramaribo` (capital), `Lelydorp`, `Nieuw Nickerie`,
  `Nieuw Amsterdam`, `Moengo`, `Albina`, `Groningen`, `Totness`, `Onverwacht`,
  `Brownsweg`, `Marienburg`.
- **District** (10) -> `state`, optional, after the city: `Paramaribo`, `Wanica`,
  `Nickerie`, `Commewijne`, `Marowijne`, `Para`, `Saramacca`, `Coronie`,
  `Brokopondo`, `Sipaliwini`. Note the capital city and its district are both
  named "Paramaribo".
- Country: `Suriname`, `Surinam`, `SUR`, `SR`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: UPU S42 (SR has no postcode), Smarty SR guide, Google
libaddressinput (`SR`), Wikipedia "Paramaribo" / "Districts of Suriname",
GeoPostcodes SR administrative divisions.

1. **Dutch, not English, grammar.** Treating SR like its English Caribbean
   neighbours (number-first, spaced type) mis-parses every fused street; it must
   use the NL model (street-first, glued suffix).
2. **No postcode.** A postcode-before-city expectation must stay optional /
   never-match; the tail is city (, district).
3. **Fused type split.** `Domineestraat` -> `Dominee` + `straat`. A parser that
   leaves the whole word as the name yields `type` null and a wrong street.
4. **Spaced compounds not split at the space.** `Henck Arronstraat`,
   `Indira Gandhiweg`, `Verlengde Gemenelandsweg` — the glued final suffix is
   peeled, but the leading words stay in the name.
5. **Type-less names.** `Waterkant`, `Strand`, `Oost-Westverbinding` — no suffix;
   `type` must be allowed null.
6. **Stem contains a decoy suffix.** `Wagenwegstraat` — "-weg" inside the stem
   must not win over the final "-straat"; longest-suffix-first fixes it.
7. **City == district name.** `Paramaribo, Paramaribo` — the same token is both
   the city and its district; the district list must still map the second to
   `state`.
8. **Toevoeging forms.** `26a` (glued letter) and `123-125` (dash) attach to the
   number, not the street.
9. **Person/title-name streets.** `Dr. Sophie Redmondstraat`,
   `Anton Dragtenweg`, `Cornelis Jongbawstraat` — multi-word names with a fused
   suffix.
10. **PO box word is Dutch.** `Postbus 1234` (not "PO Box"); both are accepted.
11. **Neighbourhood-only lines.** `Blauwgrond, Paramaribo`, `Latour, Wanica` —
    no street/number; documented `__skip`.
12. **Accents / hyphens.** `Grote Combeweg`, `Oost-Westverbinding`,
    `Marienburg` — accented and hyphenated tokens must survive intact.

---

## 8. Field-mapping decisions

- `street` / `type` — name with the fused suffix peeled off; type null when none.
- `number` / `civic_number_suffix` — trailing number + toevoeging.
- `sec_unit_type` / `sec_unit_num` — only PO box (`Postbus` / `PO Box`) + number.
- `city` — the settlement (multi-word allowed, e.g. `Nieuw Nickerie`).
- `state` — district, only when explicitly present; else null.
- `postal_code` — never set (no SR postcode).
- `country` — `SR`.

---

## Sources

- UPU S42 / addressing (SR has no postcode) — https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Smarty — Suriname address format examples — https://www.smarty.com/global-address-formatting/suriname-address-format-examples
- Umbrex — How to address a letter to Suriname — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-suriname/
- GeoPostcodes — Suriname administrative divisions — https://www.geopostcodes.com/country/suriname/administrative-divisions/
- Wikipedia: Districts of Suriname — https://en.wikipedia.org/wiki/Districts_of_Suriname
- Wikipedia: Paramaribo — https://en.wikipedia.org/wiki/Paramaribo
- Google libaddressinput (SR metadata) — https://chromium-i18n.appspot.com/ssl-address/data/SR
