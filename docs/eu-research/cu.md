# Cuba (CU) Street-Address Format — Research Notes

Research for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.
Iberian street-first family with a distinctive **between-streets** locator;
modelled `after-city` (the 5-digit código postal trails the provincia).

---

## 1. Canonical order

Street-first: an optional leading vía **TYPE** (prefix) + name, where the name is
usually a grid **number or letter** ("Calle 23", "Calle L", "Avenida 5ta"), then
an optional house number ("#456"), then the characteristic **BETWEEN-STREETS**
reference **`e/ A y B`** (= *entre A y B*, "between A and B") captured as a
SECONDARY UNIT. Then an optional **reparto/barrio** (dropped), the **municipio**
(city), the **provincia** (region), and a trailing 5-digit **código postal**.

```
[Tipo] <Nombre> [#N] e/ A y B     Calle 23 #456 e/ L y M
[, Reparto]                       , Vedado                    (DROPPED)
, <Municipio>                     , Plaza de la Revolución
, <Provincia> [CP]                , La Habana 10400
```

Config: `order:"street-number"`, `typePlacement:"prefix"`,
`postalPlacement:"after-city"`, `normalizeTypeCase:false`,
`allowDigitsInName:true`.

---

## 2. Street types (prefix, verbatim)

Leading vía word, verbatim. Full: Calle, Avenida, Calzada, Carretera, Autopista,
Callejón, Rotonda. Abbrev/written forms: Ave., Av., Calz., C. The street NAME is
typically a grid number ("Calle 23", "Calle 100", "Avenida 26") or a letter
("Calle L", "Calle G") → `allowDigitsInName:true`.

## 3. House number & the cross-street unit

- **House number** (optional): "#456" or "No. 456"; or "s/n".
- **Cross-street unit**: **`e/ A y B`** — the single most characteristic Cuban
  locator — captured as `sec_unit_type` = "e/" and `sec_unit_num` = "A y B".
  Spellings **`entre A y B`** and **`esq. a X`** / **`esquina a X`** map to the
  same slot (`entre`→"e/", `esq`→"esq"). "A"/"B" are the neighbouring streets
  (numbers, letters, or names).

## 4. Reparto / barrio — dropped

An optional neighbourhood written after the cross-street and before the municipio;
it has **no output field** and is CONSUMED and DROPPED via a **lazy, optional**
`(?<drop>...)` nested in `secUnitPattern`. The drop only fires when leaving it in
would break the tail: because `countyPattern` is **restricted to the real
provincia list**, the parser backtracks and drops exactly one segment ("Vedado")
only when what remains still parses as *municipio + provincia(restricted) + CP*.
When no reparto is present the lazy drop stays empty and the municipio is the city.
A reparto written **without an `e/` cross-street anchor**, or with a reparto but
**no municipio** (only province), is ambiguous and marked `__skip`.

## 5. Postcode

**5 digits** (Correos de Cuba), written LAST after the provincia ("La Habana
10400"). Optional. Leading zeros significant → kept as string.

## 6. Region: provincia -> state

The **15 provincias + the Isla de la Juventud special municipality** map to
`state`, following the municipio after a comma. `countyPattern` is **restricted to
that list** so the country name is never captured as the region — and, crucially,
so the reparto-drop backtracking resolves correctly. Accents normalised
("Pinar del Rio"→"Pinar del Río", "Sancti Spiritus"→"Sancti Spíritus",
"Ciego de Avila"→"Ciego de Ávila", Camaguey→Camagüey, Holguin→Holguín,
Guantanamo→Guantánamo). **Santiago de Cuba** and **Camagüey** etc. name both a
municipio and a provincia — they legitimately appear in both slots.

## 7. PO box (Apartado)

`Apartado Postal 6055`, `Apartado 122`, `Apdo. 122` → "Apartado Postal".

---

## 8. Failure modes (>= 8)

1. **Cross-street unit `e/ A y B`** — "Calle 23 #456 e/ L y M, …" — captured as
   sec_unit_type "e/" / sec_unit_num "L y M"; its tokens are emitted, not lost.
2. **Reparto dropped via province-backtracking** — "… e/ L y M, Vedado, Plaza de
   la Revolución, La Habana 10400" — the lazy drop consumes exactly "Vedado" only
   because "La Habana" is a restricted provincia making the tail parse.
3. **No reparto** — "… e/ L y M, Plaza de la Revolución, La Habana 10400" — the
   lazy drop stays empty; municipio = city.
4. **Reparto without `e/`** — "Calle 10 #5, Reparto Sueño, Santiago de Cuba, …" —
   no cross-street anchor to attach the drop to → `__skip`.
5. **Reparto + province, no municipio** — "… e/ L y M, Vedado, La Habana" —
   ambiguous (province would be read as city) → `__skip`.
6. **`entre` / `esq.` spellings** — "… entre Céspedes y Maceo", "… esq. a Oficios"
   → normalised into the same cross-street slot.
7. **Grid number/letter street name** — "Calle 23", "Calle L", "Avenida 5ta" —
   digits/letters inside the name.
8. **Municipio == provincia** — "Santiago de Cuba, Santiago de Cuba 90100" — same
   word in `city` and `state`.
9. **Country not captured as state** — restricted `countyPattern` refuses "Cuba".
10. **5-digit trailing CP / no CP** — "…, La Habana 10400" vs "…, La Habana"
    (postcode-less place branch).
11. **Provincia accents** — "Pinar del Rio"/"Pinar del Río", Camaguey/Camagüey.
12. **Apartado (PO box)** — "Apartado Postal 6055, Plaza de la Revolución, La
    Habana".

---

## Sources

- Correos de Cuba — national operator; 5-digit código postal scheme.
  https://www.correos.cu/
- UPU — Postal addressing systems, Cuba country page (S42 template).
  https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Wikipedia: "Provinces of Cuba" (15 provincias + Isla de la Juventud special
  municipality, 2011 reorganisation: Artemisa & Mayabeque split from La Habana).
  https://en.wikipedia.org/wiki/Provinces_of_Cuba
- Wikipedia: "Postal codes in Cuba" (5-digit format).
- Cuban addressing convention "calle … e/ … y …" (entre) / "esq." — documented in
  postal and travel/logistics addressing guides for Havana and the provinces.
- Google libaddressinput metadata (CU: region after city, postcode with region).
- Sibling configs in this repo (ar/config.ts, gt/config.ts, cr/config.ts) —
  street-first prefix grammar, secondary-unit and region→state precedent.
