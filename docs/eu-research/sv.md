# El Salvador (SV) Street-Address Format — Research Notes

Research for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.
Iberian / Latin-American street-first family; modelled `after-city` (the 4-digit
código postal trails the city).

---

## 1. Canonical order

Street-first: an optional leading vía **TYPE** (prefix) + name, then the house
number (usually with a "#"/"No." marker), then an optional **colonia /
residencial / urbanización** (dropped), then the **city** and a trailing 4-digit
**código postal**; the **departamento** (when written) precedes the postcode.

```
[Tipo] <Nombre> #<N>       Calle Rubén Darío #123
[, Colonia/Residencial]    , Colonia Escalón          (DROPPED)
, <Ciudad> [Depto] <CP>    , San Salvador 1101   |   , San Miguel, San Miguel 3301
```

Config: `order:"street-number"`, `typePlacement:"prefix"`,
`postalPlacement:"after-city"`, `normalizeTypeCase:false`,
`allowDigitsInName:true`.

The San Salvador historic centre uses an oriented grid ("Calle Poniente",
"Avenida Norte", "25 Avenida Norte", "3a Calle Oriente"); pure grid-intersection
forms ("25 Avenida Norte y 3a Calle Poniente") are `__skip`.

---

## 2. Street types (prefix, verbatim)

Leading vía word, verbatim. Full: Calle, Avenida, Pasaje, Paseo, Alameda,
Boulevard / Bulevar, Diagonal, Autopista, Carretera, Prolongación, Final,
Callejón. Abbrev: C., Av., Pje., Blvd., Diag. Numbered pasajes/avenidas occur
("Pasaje 1", "25 Avenida Norte") → `allowDigitsInName:true`.

## 3. House number

"#N" or "No. N" / "Nº N" after the name, optional trailing letter; or **"S/N"**
(sin número). El Salvador streets are frequently identified by number + colonia.

## 4. Colonia / Residencial / Urbanización / Reparto / Barrio — dropped

The neighbourhood is written between the street and the city and has **no output
field**. It is CONSUMED and DROPPED via a `(?<drop>...)` inside `secUnitPattern`
(markers: Colonia/Col., Residencial/Res., Urbanización/Urb., Reparto/Repto.,
Lotificación/Lotif., Barrio/Bo.). The drop is **greedy to the comma** so a
multi-word colonia ("Colonia San Benito", "Colonia Flor Blanca") is dropped whole
even though "San Salvador" is also a valid departamento. The same single slot
alternatively captures a real Apartamento / Local / Nivel unit.

## 5. Postcode

**4 digits** (Correos de El Salvador — the modern 4-digit scheme, e.g. San
Salvador 1101, Santa Ana 2101, San Miguel 3301). Written LAST, after the city (no
comma: "San Salvador 1101"). Optional; usage is light.

## 6. Region: departamento -> state

The **14 departamentos** map to `state`; when written they precede the trailing
postcode after a comma ("San Miguel, San Miguel 3301"). `countyPattern` is
**restricted to the 14-name list** so the country name is never captured as the
region. Accents normalised (Ahuachapan→Ahuachapán, Cuscatlan→Cuscatlán,
Usulutan→Usulután, Morazan→Morazán, Cabanas→Cabañas, "La Union"→"La Unión").
**San Salvador**, **Santa Ana**, **San Miguel**, **La Paz**, **La Unión** name
both a departamento and its capital city — they legitimately appear in both slots.

## 7. PO box (Apartado)

`Apartado Postal 2670`, `Apartado 55`, `Apdo. 55` → "Apartado Postal".

---

## 8. Failure modes (>= 8)

1. **Colonia dropped, multi-word** — "…, Colonia San Benito, San Salvador 1101" —
   greedy comma-bounded drop; "San" does not leak into the city and "San Salvador"
   (a departamento) is not mistaken for the colonia tail.
2. **Colonia-leading order** — "Colonia Escalón, Calle Rubén Darío #123, …" — the
   neighbourhood is dropped only between street and city → `__skip`.
3. **4-digit trailing CP** — "…, San Salvador 1101" — postcode last, after the
   city, no comma.
4. **Departamento before trailing CP** — "…, San Miguel, San Miguel 3301" — city,
   departamento, then postcode.
5. **City == departamento** — "San Salvador"/"Santa Ana"/"San Miguel" appear in
   both `city` and `state`.
6. **No CP** — "…, Santa Tecla, La Libertad" — postcode-less place branch (city +
   departamento).
7. **Country not captured as state** — restricted `countyPattern` refuses "El
   Salvador".
8. **S/N (sin número)** — "Calle Rubén Darío S/N, San Salvador, San Salvador".
9. **Numbered pasaje/avenue name** — "Pasaje 1 #10", "25 Avenida Norte".
10. **Departamento accents** — "Ahuachapan"/"Ahuachapán", "Cabanas"/"Cabañas".
11. **Grid intersection form** — "25 Avenida Norte y 3a Calle Poniente" — avenue ×
    calle crossing not modelled → `__skip`.
12. **Apartado (PO box)** — "Apartado Postal 2670, San Salvador, San Salvador".

---

## Sources

- Correos de El Salvador — national operator; 4-digit código postal scheme.
  https://www.correos.gob.sv/
- UPU — Postal addressing systems, El Salvador country page (S42 template).
  https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Wikipedia: "Departments of El Salvador" (14 departamentos).
  https://en.wikipedia.org/wiki/Departments_of_El_Salvador
- Wikipedia: "Postal codes in El Salvador" (4-digit format).
- GeoPostcodes / logistics addressing guides for El Salvador (colonia +
  numbered-street convention; San Salvador oriented grid Norte/Sur/Oriente/Poniente).
- Google libaddressinput metadata (SV: region after city).
- Sibling configs in this repo (gt/config.ts, cr/config.ts, ar/config.ts) —
  street-first prefix grammar, neighbourhood-drop and region→state precedent.
