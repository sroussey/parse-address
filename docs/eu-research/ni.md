# Nicaragua (NI) Street-Address Format — Research Notes

Research for the config-driven (`EuCountryConfig` + `AddressParserEU`) parser.
Sibling of the Iberian / Latin-American street-first family (ES/AR/MX/GT/CR).

---

## 1. Two address systems

Nicaragua has TWO living systems:

1. **Descriptive / landmark form (DOMINANT).** The address is reckoned from a
   known reference point (church, roundabout, traffic lights, a former shop,
   "where the mango tree used to be") plus cardinal directions and block/vara
   counts: *"De la Rotonda Metrocentro, 2 cuadras al sur, 1 cuadra abajo"*,
   *"Del parque central, 1 cuadra al norte, casa color verde"*. Cardinal words are
   local: **al lago** (north, toward Lake Managua), **arriba** (east), **abajo**
   (west), **al sur** (south); distances in **cuadras** (blocks) or **varas**.
   This form is **NOT modellable** by a structured street grammar and is marked
   `__skip`.
2. **Structured minority form.** `[Tipo] <Calle> , [Barrio] , <Ciudad> ,
   [Departamento]` — modelled here.

---

## 2. Canonical order (structured form)

Street-first: an optional leading vía **TYPE** (prefix), then the name; a civic
number is essentially unused. Then an optional **barrio/reparto** (dropped), then
the **ciudad** (city), then the **departamento** (region). **No postcode.**

```
[Tipo] <Nombre>            Calle Central / Avenida Bolívar / Pista Juan Pablo II
[, Barrio/Reparto]         , Barrio San Sebastián            (DROPPED)
, <Ciudad>                 , Masaya
[, Departamento]           , Masaya
[, Nicaragua]
```

Config: `order:"street-number"`, `typePlacement:"prefix"`,
`postalPlacement:"after-city"`, `normalizeTypeCase:false`,
`allowDigitsInName:true`.

---

## 3. Postcode

Nicaragua HAS a 5-digit code system (Correos de Nicaragua) but it is **almost
never written**; real addresses carry NONE. Modelled `after-city`; when the
postcode is absent (the norm) the grammar's postcode-less place branch (city +
optional departamento) is used. `postalPattern` is defined only so the grammar
compiles.

---

## 4. Street types (prefix, verbatim)

Leading vía word, kept verbatim (`normalizeTypeCase:false`); most streets are
**bare names** (no type). Full: Calle, Avenida, Callejón, Carretera, Pista,
Rotonda, Paseo, Camino. Abbrev: Av., Cra., Ctra. Numbered/date names occur
("Calle 15 de Septiembre") → `allowDigitsInName:true`.

## 5. House number

Rare. Optional "No."/"Nº"/"#" marker + digits, or "s/n". Most structured
addresses omit it entirely.

## 6. Barrio / Reparto / Residencial — dropped

The neighbourhood is written between the street and the city. It has **no output
field**, so it is CONSUMED and DROPPED via a `(?<drop>...)` inside
`secUnitPattern` (markers: Barrio/Bo., Reparto/Repto., Residencial/Res.,
Colonia/Col., Anexo). The drop is **greedy to the comma** so a multi-word barrio
("Barrio San Sebastián") is dropped whole, and is recorded in `droppableTokens()`
so it is not scored as token loss. A barrio written with **no marker word** is
indistinguishable from a locality and is treated as the city (not dropped).

## 7. Region: departamento -> state

The **15 departamentos + 2 autonomous Caribbean regions** map to `state`, the
last comma segment. `countyPattern` is **restricted to the real region list** so
the trailing country name ("Nicaragua") is never captured as the region.
Autonomous regions: **Costa Caribe Norte (RACCN)**, **Costa Caribe Sur (RACCS)** —
`regionMap` maps the codes/long names to the canonical short form. Accents
normalised (Esteli→Estelí, Leon→León). **Managua** is BOTH a departamento and its
capital city — it legitimately appears in both `city` and `state`.

## 8. PO box (Apartado)

`Apartado Postal 2340`, `Apartado 145`, `Apdo. 145` → normalised to
"Apartado Postal".

---

## 9. Failure modes (>= 8)

1. **Landmark form** — "De la Rotonda Metrocentro, 2 cuadras al sur, 1 abajo" —
   no street; unmodellable → `__skip`.
2. **Cardinal directions (local sense)** — "al lago"=N, "arriba"=E, "abajo"=W —
   part of the descriptive form; `__skip`.
3. **Barrio dropped, multi-word** — "…, Barrio San Sebastián, Masaya, Masaya" —
   greedy drop to the comma keeps "San Sebastián" from leaking into the city.
4. **No postcode** — the after-city grammar must accept a bare "city, departamento"
   tail (no code); the postcode branch simply does not fire.
5. **Managua city vs departamento** — "…, Managua, Managua" — same word lands in
   both `city` and `state`.
6. **Autonomous regions** — "…, Bilwi, RACCN" / "Costa Caribe Norte" — code and
   long name both normalise to "Costa Caribe Norte".
7. **Country not captured as state** — "…, Managua, Managua, Nicaragua" — the
   restricted `countyPattern` refuses "Nicaragua", which is consumed as country.
8. **Bare-name street** — "Pista Juan Pablo II, Managua" — "Pista" is the type,
   the rest is the whole name; no number.
9. **Numbered street name** — "Calle 15 de Septiembre No. 20" — digits in the
   name, "No." marker consumed.
10. **Departamento accents** — "Esteli"/"Estelí", "Leon"/"León" normalised.
11. **Apartado (PO box)** — "Apartado Postal 2340, Managua, Managua".
12. **Two-word city** — "Ciudad Sandino, Managua" — multi-word city preserved.

---

## Sources

- Correos de Nicaragua — national operator; 5-digit código postal scheme (rarely
  used in practice). https://www.correos.gob.ni/
- UPU — Universal Postal Union, Postal addressing systems, Nicaragua country page
  (S42 template). https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing
- Wikipedia: "Departments of Nicaragua" (15 departamentos + RACCN/RACCS
  autonomous regions). https://en.wikipedia.org/wiki/Departments_of_Nicaragua
- Nicaraguan reference-point addressing convention (al lago/arriba/abajo, cuadras,
  varas) — widely documented in postal / logistics guides and academic notes on
  Managua's landmark-based addressing.
- Google libaddressinput metadata (NI: `fmt %N%n%O%n%A%n%C, %S` — no postcode
  field, region after city).
- Sibling configs in this repo (ar/config.ts, gt/config.ts, cr/config.ts) —
  street-first prefix grammar, barrio-drop and region→state precedent.
