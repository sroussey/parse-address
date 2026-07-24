# Honduras (HN) Street-Address Format — Research Notes

Research for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.
Iberian / Latin-American street-first family; modelled `before-city` like its
Central-American siblings GT/CR/PA/DO.

---

## 1. Canonical order

Street-first: an optional leading vía **TYPE** (prefix) + name, then the point of
delivery — usually a **`Casa <N>`** (or Apartamento/Bloque) captured as a
SECONDARY UNIT rather than a bare civic number. The **colonia / barrio** is the
key routing unit; in writing it OFTEN LEADS ("Col. Palmira, Ave. República de
Chile, Casa 2015, Tegucigalpa"). The shared grammar drops the neighbourhood only
in the **pre-city position** (identical to GT/CR/PA/DO), so the modelled form
places it just before the city, and the **colonia-leading written order is a
documented `__skip` limitation**.

```
[Tipo] <Nombre> , Casa <N>          Avenida República de Chile, Casa 2015
[, Colonia/Barrio]                  , Colonia Palmira        (DROPPED, pre-city, CP only)
[, CP] <Ciudad>                     , 11101 Tegucigalpa
[, Departamento]                    , Francisco Morazán
```

Config: `order:"street-number"`, `typePlacement:"prefix"`,
`postalPlacement:"before-city"`, `normalizeTypeCase:false`,
`allowDigitsInName:true`.

---

## 2. Street types (prefix, verbatim)

Leading vía word, kept verbatim; many streets are bare names. Full: Calle,
Avenida, Bulevar / Boulevard, Calzada, Callejón, Carretera, Camino, Paseo,
Prolongación. Abbrev: Ave., Av., Blvd., Bulv., Calz. San Pedro Sula uses a
numbered grid ("Calle 1", "Avenida 5") → `allowDigitsInName:true`.

## 3. Identifier: Casa <N> (secondary unit)

The Honduran point of delivery is normally **"Casa <N>"** (house number as a
labelled unit), or **Bloque / Apartamento (Apto) / Local**. Captured as
`sec_unit_type` = "Casa" (verbatim) / `sec_unit_num` = N. A bare civic number
("No. 5", "#5", "s/n") is also accepted into `number`. NOTE: "Casa" is captured
and EMITTED (it is a real unit word), so it is not scored as token loss — unlike
treating it as a droppable number marker, which would be.

## 4. Colonia / Barrio / Residencial — dropped

The neighbourhood has no output field. It is CONSUMED and DROPPED via the
`(?<drop>...)` prefix baked into `postalPattern` (the GT/DO/CR/PA idiom), which
fires **only when the 5-digit código postal is present** and requires the dropped
segment to end in a non-digit (so a numbered street is never eaten). A
neighbourhood written with **no CP** stays as the city in a plain "…, Ciudad,
Departamento" tail; the strict **colonia-leading** order is `__skip`.

## 5. Postcode

**5 digits** (Honducor; first digit = departamento zone). Optional and lightly
used; written BEFORE the city in this model ("11101 Tegucigalpa"). Leading zeros
significant → kept as string.

## 6. Region: departamento -> state

The **18 departamentos** map to `state`, the last comma segment after the city
(`regionPattern`, restricted to the 18-name list). Accents normalised
(Cortes→Cortés, Copan→Copán, Atlantida→Atlántida, "Francisco Morazan"→"Francisco
Morazán", "Islas de la Bahia"→"Islas de la Bahía", "El Paraiso"→"El Paraíso").
Multi-word departamentos ("Francisco Morazán", "Gracias a Dios", "Islas de la
Bahía", "Santa Bárbara", "El Paraíso") are matched longest-first.

## 7. PO box (Apartado)

`Apartado Postal 3050`, `Apartado 720`, `Apdo. 720` → "Apartado Postal".

---

## 8. Failure modes (>= 8)

1. **Colonia-leading order** — "Col. Palmira, Ave. República de Chile, Casa 2015,
   Tegucigalpa" — the neighbourhood is dropped only PRE-CITY, so the leading form
   is not modelled → `__skip`.
2. **"Casa" as unit, not number** — "…, Casa 2015, …" — captured/emitted as
   sec_unit_type "Casa"; modelling it as a bare number marker would trip token
   loss (the word "Casa" would be uncounted).
3. **Colonia drop needs a CP** — "…, Colonia Palmira, 11101 Tegucigalpa, …" —
   colonia dropped only when the postcode follows; a CP-less line keeps the tail
   as city/departamento.
4. **No postcode** — "Bulevar Morazán, Casa 45, Tegucigalpa, Francisco Morazán" —
   optional CP absent; city + departamento still parse.
5. **Multi-word departamento** — "Francisco Morazán", "Islas de la Bahía",
   "Gracias a Dios" — longest-first region alternation.
6. **Departamento accents** — "Cortes"/"Cortés", "Copan"/"Copán" normalised.
7. **Numbered grid street** — "Calle 1, Casa 42, …, San Pedro Sula, Cortés" —
   digits in the name; the "Casa" unit still binds.
8. **Apartamento / Bloque unit** — "…, Apartamento 5B, …", "…, Bloque 4, …".
9. **Country not captured as state** — the restricted departamento list refuses
   "Honduras".
10. **Apartado (PO box)** — "Apartado Postal 3050, Tegucigalpa, Francisco Morazán".
11. **Stacked residential chains** — "Residencial …, Tercera Etapa, Bloque …,
    Casa …" — multi-level neighbourhood chains not modelled → `__skip`.
12. **Aldea / km-highway descriptive** — "Aldea El Zamorano, Km 30 Carretera a
    Danlí" — rural descriptive form → `__skip`.

---

## Sources

- Honducor (Empresa de Correos de Honduras) — national operator; 5-digit código
  postal (first digit = departamento). https://www.honducor.gob.hn/
- UPU — Postal addressing systems, Honduras country page (S42 template).
  https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Wikipedia: "Departments of Honduras" (18 departamentos).
  https://en.wikipedia.org/wiki/Departments_of_Honduras
- Wikipedia: "Postal codes in Honduras" (5-digit format).
- GeoPostcodes / logistics addressing guides for Honduras (colonia + Casa
  convention; Tegucigalpa/Comayagüela and San Pedro Sula usage).
- Google libaddressinput metadata (HN: `fmt %N%n%O%n%A%n%C, %S%n%Z` — region and
  postcode with city).
- Sibling configs in this repo (gt/config.ts, do/config.ts, cr/config.ts,
  pa/config.ts) — before-city neighbourhood-drop and region→state precedent.
