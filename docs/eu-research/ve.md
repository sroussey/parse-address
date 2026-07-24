# Venezuelan (VE) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser (before-city Iberian/LatAm template,
sibling of AR/CL). Sources: IPOSTEL (Instituto Postal Telegráfico), PostGrid /
Smarty Venezuela address-format guides, Wikipedia "IPOSTEL" and "Postal codes in
Venezuela", Google libaddressinput (VE), libpostal. See Sources.

---

## 1. Canonical order (and the modelling caveat)

Street **TYPE + name FIRST** ("Avenida Urdaneta 45"), then the house number
**AFTER** the name. Real Venezuelan mail then writes the routing line as
**city → CP → estado** ("Caracas 1010, Miranda"; IPOSTEL example "MERIDA 1023
D.F."). The engine's before-city grammar cannot place the estado AFTER the CP, so
this config models the **LatAm sibling before-city order** ("1010 Caracas,
Miranda") and treats the canonical trailing-CP-with-estado form as a documented
limitation (§7). Postal-code adoption is low, so the dominant real tail is simply
**"Ciudad, Estado"** (no CP), which parses fully.

```
[Tipo] [Calle] [número]           <- Avenida Urdaneta 45
[Edificio/Quinta?] [Piso] [Apto]  <- Edificio X, Piso 3, Apto 5   (stacked → skip)
[Urbanización?]                   <- Los Palos Grandes   (dropped)
[CP] [Ciudad]                     <- 1010 Caracas   (this config; real: "Caracas 1010")
[Estado]                          <- Miranda / Distrito Capital
VENEZUELA
```

- Urban VE addresses are **building-centric** (Edificio / Quinta / Torre + Piso +
  Oficina + Urbanización), typically WITHOUT a street house number. The
  single-street grammar captures at most ONE unit, so the stacked forms are
  out-of-scope (§7). A **single** Edificio / Quinta / Casa is captured as the
  secondary unit.
- Numbered streets are the norm in Maracaibo/Zulia ("Calle 72", "Avenida 4") →
  digits allowed in the name.

---

## 2. Street types

| Type       | Abbrev.   | Meaning        |
|------------|-----------|----------------|
| Avenida    | Av.       | avenue         |
| Calle      | Cl.       | street         |
| Carrera    | Cra.      | road/carriageway |
| Vía        | —         | route          |
| Transversal| Tvsal.    | cross street   |
| Callejón / Bulevar / Vereda / Redoma / Autopista / Prolongación (Prol.) | | |

---

## 3. Number & secondary unit

- **Número**: digits after the name; optional `N°`/`Nro.`/`No.` marker; `s/n`
  for numberless (parses only when the CP is omitted — see §7 note 9).
- **Piso / Apartamento (Apto) / Oficina (Of.) / Local / Nivel**, or a single
  named **Edificio (Edif) / Quinta (Qta) / Casa / Torre** captured as the unit.
- Field mapping: `number` = número; `sec_unit_*` = the single captured unit.

---

## 4. Código Postal (4 digits + optional letter)

- **4 numeric digits** ("1010" central Caracas); first two = region, last two =
  delivery office. An **optional hyphen + letter** variant exists ("1010-A"),
  captured whole. Issued by IPOSTEL; adoption is low, so the CP is frequently
  omitted. Written **before** the city in this config. Kept as a string.

---

## 5. Estado (23 + Distrito Capital + Dependencias Federales)

Amazonas, Anzoátegui, Apure, Aragua, Barinas, Bolívar, Carabobo, Cojedes, Delta
Amacuro, Falcón, Guárico, La Guaira (formerly **Vargas**), Lara, Mérida, Miranda,
Monagas, Nueva Esparta, Portuguesa, Sucre, Táchira, Trujillo, Yaracuy, Zulia; plus
**Distrito Capital** (older **Distrito Federal**) and Dependencias Federales.
`regionMap` folds accent-free spellings ("Anzoategui"→"Anzoátegui",
"Falcon"→"Falcón", "Tachira"→"Táchira", …), "Distrito Federal"→"Distrito Capital",
and "Vargas"→"La Guaira".

---

## 6. Accents, PO box, country

- Names carry `á é í ó ú ñ`: "Bolívar", "Táchira", "Mérida", "Andrés Bello".
- **Apartado / Apartado Postal** = PO box, normalised to "Apartado".
- Country: `Venezuela`, `República Bolivariana de Venezuela`, `VEN`, `VE`.

---

## 7. Failure modes to test

1. **CP + letter suffix** — "Avenida Urdaneta 45, 1010-A Caracas, Distrito
   Capital" — postal_code "1010-A".
2. **No CP (dominant real form)** — "Avenida Bolívar 120, Caracas, Distrito
   Capital" — city + estado, postal_code unset.
3. **Numbered street** — "Calle 72 45, 4001 Maracaibo, Zulia" — name "72",
   house number 45.
4. **Urbanización drop** — "Avenida Francisco de Miranda 200, Los Palos Grandes,
   1060 Caracas, Miranda" — the urbanización is consumed by the CP drop-prefix
   (fires only when a CP follows) and not emitted.
5. **Single named building as unit** — "…, Quinta Marisol, …" → sec_unit_type
   "Qta"; "…, Edificio Sorocaima, …" → "Edif".
6. **Accent-normalised estado** — "…, Tachira" → "Táchira"; "Vargas" → "La
   Guaira"; "Distrito Federal" → "Distrito Capital".
7. **Canonical City-CP-Estado order** — "Avenida Urdaneta 45, Caracas 1010,
   Miranda" — CP after the city with a trailing estado (the real IPOSTEL order);
   the before-city grammar cannot put the estado after the CP → `__skip`.
8. **Stacked building form** — "Avenida Francisco de Miranda, Torre Delta, Piso 5,
   Oficina 5-A, Los Palos Grandes, Caracas 1060, Miranda" — building + multiple
   units + trailing CP → `__skip`.
9. **s/n + place-only drop** — "Avenida Urdaneta s/n, 1010 Caracas" is eaten by
   the place-only drop-prefix; s/n parses only when the CP is omitted
   ("Avenida Urdaneta s/n, Caracas, Distrito Capital").
10. **"Entre avenidas" cross-street** — "Calle 72 entre Avenida 3 y Avenida 4,
    4001 Maracaibo, Zulia" — a between-streets form, not a single-street address
    → `__skip`.
11. **Municipio as city (no CP)** — "Calle Real 25, Chacao, Miranda" — the
    municipio Chacao is read as the city, estado Miranda.
12. **Apartado PO box** — "Apartado Postal 1234, 1010 Caracas, Distrito Capital".

---

## Sources
- IPOSTEL (Instituto Postal Telegráfico de Venezuela) — national postal
  addressing; Wikipedia "IPOSTEL".
- PostGrid / Smarty — Venezuela address-format guides (city + CP + abbreviated
  estado on one line; IPOSTEL example "MERIDA 1023 D.F.").
- Wikipedia "Postal codes in Venezuela" — 4-digit code, region + delivery office.
- Google libaddressinput (VE) — city-then-code, estado last; libpostal (OSM VE).
