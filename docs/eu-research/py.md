# Paraguay (PY) Street Address Research

Research notes for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.

## 1. Canonical order

Iberian / Latin-American **street-first** grammar: the street name comes FIRST
(with an optional leading vía **prefix** type), the house **NUMBER AFTER** it.
Sibling convention to Argentina/Uruguay.

```
[Type] [Street name] [number] [, Unit] [, Barrio] [, CP City] [, Departamento] [, country]
Avenida Mariscal López 1234, Asunción
Calle Palma 145, 1209 Asunción
Avenida España 1234, Barrio Las Mercedes, 1425 Asunción   (barrio dropped)
```

Config: `order: "street-number"`, `typePlacement: "prefix"`,
`postalPlacement: "before-city"`, `allowDigitsInName: true`.

## 2. Postcode: 4-digit, before city, rare

Correo Paraguayo / DINACOPA use a **4-digit** code ("1209" for parts of Asunción),
written BEFORE the locality in the UPU S42 order ("1209 Asunción"). It is
**optional and, in practice, rarely written**; most addresses omit it.
An optional "CP" lead-in is tolerated by the pattern.

## 3. Street types (prefix, verbatim)

Leading vía word, kept verbatim (`normalizeTypeCase: false`). MANY Asunción
streets are **bare names** (no type word): "Palma", "Estrella", "Chile",
"Estados Unidos", "Independencia Nacional", and date/number names ("25 de Mayo",
"14 de Mayo") — hence `allowDigitsInName: true` (the trailing number is still
found).
Full: Autopista, Costanera, Continuación, Avenida, Boulevard, Bulevar, Peatonal,
Diagonal, Callejón, Pasaje, Camino, Ruta, Calle.
Abbrev: Avda., Av., Bvar., Blvr., Cno., Pje., Diag., Cont.

## 4. House number

Optional "N°"/"Nro."/"No." marker, digits, optional letter suffix, OR "s/n" (sin
número). NOTE: only "No.", "Nº" (ordinal º) and "núm" are recognised as droppable
number-markers by the token-preservation guard; "N°" (degree sign) and "Nro."
are captured correctly but count as residual tokens, so samples prefer "No.".

## 5. Barrio (neighbourhood) — dropped

The barrio is written between the street and the CP/city line ("…, Barrio Las
Mercedes, 1425 Asunción"). It is a routing unit with **no output field**, so it is
CONSUMED and DROPPED via the optional `(?<drop>…),` prefix baked into
`postalPattern` — recorded in `droppableTokens()` so it is not scored as token
loss. Crucially this drop **only fires when a CP is present** (the postcode is
mandatory inside the drop-carrying group). A barrio with **no CP** ("…, Barrio San
Roque, Asunción") is a dependent locality the shared grammar cannot drop — those
forms are marked `__skip` (identical limitation to the AR/UY siblings).

## 6. Region: departamento -> state

The **17 departamentos** map to `state` (Central, Alto Paraná, Itapúa, Caaguazú,
Cordillera, Guairá, Ñeembucú, Paraguarí, Concepción, San Pedro, Misiones,
Caazapá, Amambay, Canindeyú, Presidente Hayes, Boquerón, Alto Paraguay), written
as the last comma segment. Accented and plain spellings both matched; `regionMap`
canonicalises ("Itapua" -> "Itapúa", "Alto Parana" -> "Alto Paraná"). **Asunción**
(the capital district) is written as the CITY and has no departamento — it is
deliberately NOT in the region list (otherwise it would be captured as `state`).

## 7. Secondary units (trailing)

`secUnitPlacement: "after"` (default) — Departamento/Depto/Dpto, Piso, Oficina/Of,
Local, Unidad, Bloque, Torre, Casa, Edificio/Edif, or a bare ordinal floor "3°"
(implied type Piso). ("Calle Palma 145, Piso 3, Asunción").

## 8. PO Box

`Casilla de Correo 1234`, `Casilla 567`, `C.C. 890` — all normalised to
"Casilla de Correo".

## 9. Failure modes (>= 8)

1. **Street-first order.** The number is the LAST token of the street block, not
   the first — a number-first regex mis-anchors.
2. **Bare-name streets.** "Palma 145" has no type word; the type must be optional
   without swallowing the number.
3. **Digits inside the name.** "25 de Mayo 890" — the name itself contains digits;
   `allowDigitsInName` keeps the name whole while still peeling the trailing 890.
4. **Barrio without CP.** "…, Barrio San Roque, Asunción" — the drop only fires
   with a CP, so a CP-less barrio is an unmodelled dependent locality — `__skip`.
5. **Barrio WITH CP.** "…, Barrio Las Mercedes, 1425 Asunción" — the barrio is
   dropped and exempted from token-loss scoring.
6. **Asunción as city not state.** The capital must land in `city`; including it
   in the departamento list would wrongly capture it as `state`.
7. **Departamento accents.** "Itapua"/"Itapúa", "Alto Parana"/"Alto Paraná" both
   accepted and normalised.
8. **"casi/esquina" (c/) intersection form.** "Avenida Mcal. López c/ Cruz del
   Chaco" (near cross-street) not modelled — `__skip`.
9. **"entre A y B" between-streets form** ("Estrella entre Chile y Alberdi") —
   `__skip`.
10. **Number markers.** "N°/Nro./No." and "s/n" must be consumed and not leak into
    the street or count as lost tokens.

## 10. Field mapping

number, civic_number_suffix (letter or "s/n"), street (no type), type (prefix,
verbatim), sec_unit_type/num (trailing), postal_code (4-digit, before city, rare),
city (ciudad; Asunción for the capital), state (departamento), country (PY);
barrio dropped.

## Sources

- UPU — Postal addressing systems, Paraguay country page (S42 template).
  https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Correo Paraguayo / DINACOPA (Dirección Nacional de Correos) — addressing and
  4-digit código postal. https://www.correoparaguayo.gov.py/
- Wikipedia: "Departments of Paraguay" (17 departamentos + Asunción capital
  district). https://en.wikipedia.org/wiki/Departments_of_Paraguay
- Wikipedia: "Postal codes in Paraguay".
- Google libaddressinput metadata (PY: `fmt %N%n%O%n%A%n%Z %C` — postcode before
  city).
- Sibling configs in this repo (ar/config.ts, uy/config.ts) — barrio-drop and
  s/n handling precedent.
- openvenues/libpostal — international address parsing corpus.
