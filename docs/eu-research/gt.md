# Guatemalan (GT) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser (EuCountryConfig, Iberian/LatAm
family). Sources listed at the bottom. Spanish-language.

---

## 1. Canonical order — the numbered grid

Guatemala City (and every departmental cabecera) is laid out as a numbered grid
of **avenidas** (run N–S) and **calles** (run E–W), sliced into **zonas**. The
canonical address is:

```
[N] Avenida | [N] Calle   [C]-[NN]   Zona [Z] ,  [Ciudad]  [NNNNN]
   6 Avenida            13-72       Zona 10      Ciudad de Guatemala 01010
```

Key facts:
- The vía is written **NAME-then-TYPE**: the ordinal number comes FIRST and the
  vía word ("Avenida"/"Calle") follows — the reverse of Mexico/Peru. The parser
  therefore models the type as a **suffix** ("6 Avenida" → street "6", type
  "Avenida").
- The **house number is a hyphenated block number "C-NN"** ("13-72"): the first
  part is the nearest cross-street/avenue, the second the door number. Modelled
  whole as `number` = "13-72" (an inseparable pair, like a range).
- **Zona N** is the single most important routing token; it sits between the
  street and the city and is captured as a **secondary unit** (`sec_unit_type` =
  "Zona", `sec_unit_num` = the zona number).
- The **postcode (5 digits) is written AFTER the city**, usually with no comma
  ("Ciudad de Guatemala 01010"). Hence `postalPlacement: "after-city"`.
- The **departamento** (state), when present, is comma-delimited after the city
  ("Cobán, Alta Verapaz 16001"); Guatemala-City lines usually omit it.

Flattened example: `6 Avenida 13-72, Zona 10, Ciudad de Guatemala 01010`.

---

## 2. Street types (vía) and abbreviations

Suffix types (kept verbatim): **Avenida** (Av.), **Calle** (kept full), plus the
non-grid vías **Calzada** (Calz.), **Diagonal** (Diag.), **Boulevard**/**Bulevar**
(Blvd.), **Ruta**, **Vía**, **Callejón** (Cja.).

- Grid vías are numbered and written name-first ("6 Avenida", "13 Calle"), so
  the number + Avenida/Calle split cleanly.
- **Calzada / Diagonal / Ruta / Vía / Boulevard are written TYPE-first** in
  practice ("Calzada Roosevelt", "Diagonal 6", "Ruta 6", "Boulevard Los
  Próceres"). Because the grammar's type is a *suffix*, these carry no trailing
  type word, so the whole vía + block number stays intact in `street` (lossless,
  but `type`/`number` are not separated — documented limitation, not a drop).

## 3. Postcode (Código Postal)

- **Exactly 5 digits**. First 2 = departamento (01 = Guatemala, 09 =
  Quetzaltenango, 16 = Alta Verapaz, …); **the 5th digit = the zona** (01010 =
  Guatemala dept, zona 10). Leading zeros are significant → kept as a string.
- Written **after** the city, normally with no comma. Frequently omitted.

## 4. Zona and secondary units

- **Zona** (Zn) is the routing sub-division (Zona 1 … Zona 25 in the capital).
  Captured as the secondary unit.
- Other interior words exist — **Nivel, Local, Oficina (Of), Apartamento (Apto),
  Edificio (Edif), Casa, Bodega** — but they typically appear IN ADDITION to the
  zona ("Zona 10, Edificio X, Nivel 5"). The grammar captures a single secondary
  unit, so such **stacked-unit** lines are marked `__skip`.

## 5. Departamento (region / state)

22 departamentos; the cabecera often shares the departamento's name
(Quetzaltenango, Chiquimula, Jalapa, Escuintla…). Emitted in `state` via the
comma-delimited county slot of the after-city grammar. Guatemala City lines omit
it or write "Guatemala" (which is then both city and departamento).

## 6. PO box

**Apartado Postal** (Apdo.) replaces the street: "Apartado Postal 351, Guatemala
01901" → `sec_unit_type` "Apartado Postal", `sec_unit_num` 351.

---

## 7. Failure / edge modes tested

1. **City "Guatemala" vs country "Guatemala"** — the routing city IS "Guatemala"
   / "Ciudad de Guatemala"; listing "Guatemala" as a country name lets the
   trailing-country group steal it and truncate the city to "Ciudad de". Fixed by
   OMITTING "Guatemala" from `countryNames` (only GTM/GUA/GT kept).
2. **Name-then-type order** — "6 Avenida" must split to street "6" + type
   "Avenida" (suffix), not treat "Avenida" as a prefix.
3. **Block number "13-72"** — captured whole as `number`, not split into
   13 / suffix 72, and not confused with a range street name.
4. **Zona number vs postcode** — "Zona 10 … 01010": the 2-digit zona must not be
   read as the 5-digit postcode; the postcode is anchored to exactly 5 digits.
5. **Ordinal markers** — "6a.", "6a", "7a", "3a" inside the street name.
6. **Trailing letter on the block** — "5-45 A" → number "5-45", suffix "A".
7. **Type-first vías** (Calzada/Diagonal/Ruta/Vía/Boulevard) — fold intact into
   `street`; `type`/`number` not separated (lossless).
8. **Stacked units** — "Zona 10, Edificio X, Nivel 5 / Local 4 / Oficina 301":
   only one secondary unit is modelled → `__skip`.
9. **Departamento == cabecera name** — "Quetzaltenango, Quetzaltenango 09001":
   city and state both "Quetzaltenango".
10. **s/n** (sin número) — number null.
11. **Km highway / landmark forms** — "Km 15 Carretera a El Salvador, …",
    "frente al parque central": descriptive, non-grid → `__skip`.
12. **Colonia + manzana/lote lotification** — "Manzana C Lote 15, Colonia …":
    not the avenida/calle grid → `__skip`.

---

## Sources
- Correos de Guatemala / El Correo — addressing and 5-digit postal-code scheme
  (departamento + zona encoding).
- UPU Universal Postal Union — Guatemala addressing (S42) notes.
- Wikipedia "Postal codes in Guatemala" (NNNNN, first two digits = departamento,
  last digit = zona) and "Anexo: Zonas de la Ciudad de Guatemala".
- Municipalidad de Guatemala — nomenclatura de avenidas, calles y zonas (grid
  layout; house number = cross-street-block-door "C-NN").
- libpostal / OpenStreetMap Guatemala tagging (housenumber "NN-NN", addr:suburb =
  zona), Google libaddressinput GT format.
