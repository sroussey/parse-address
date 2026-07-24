# Bolivian (BO) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser (before-city Iberian/LatAm template,
sibling of CL/PE — but with NO postal code). Sources: Empresa de Correos de Bolivia
(Wikipedia), GeoPostcodes / Smarty / PostGrid / Umbrex Bolivia address-format
guides, libpostal (OSM BO). See Sources.

---

## 1. Canonical order

Street **TYPE + name FIRST** ("Calle Comercio 1290", "Avenida 6 de Agosto 2170"),
then the house number **AFTER** the name (usually with no comma), then the city
and the departamento. **No postal code** (§4).

```
[Tipo] [Calle] [número]           <- Calle Comercio 1290
[Piso] [Depto/Oficina]            <- Piso 4, Oficina 12
[Zona?]                           <- Zona Sopocachi   (not modelled — §7)
[Ciudad]                          <- La Paz
[Departamento]                    <- La Paz
BOLIVIA
```

Flattened: `Calle Comercio 1290, La Paz, La Paz`.

- The type is usually present; particles ("de", "de la") stay with the name.
  Several central streets/avenues are date/number names ("6 de Agosto",
  "16 de Julio", "24 de Septiembre") → digits allowed in the name.
- **Piso + Departamento/Oficina** follow the number (here "Departamento" is a
  DWELLING unit, not the region — normalised to "Depto").

---

## 2. Street types

| Type       | Abbrev.   | Meaning        |
|------------|-----------|----------------|
| Calle      | C.        | street         |
| Avenida    | Av. / Avda. | avenue       |
| Pasaje     | Pje.      | passage        |
| Plaza / Plazuela | —   | square         |
| Camino / Callejón / Prolongación (Prol.) | | |

---

## 3. Number & secondary unit

- **Número**: digits after the name; optional `N°`/`Nro.`/`No.` marker (use
  `N°`/`No.` in corpora — a spelled-out "Nro" is not stripped by the
  token-preservation counter); `s/n` for numberless (works in BO because there is
  no CP for the place-only rule to latch onto).
- **Piso / Departamento (Depto) / Oficina (Of.) / Local / Casa** trail as one
  secondary unit.

---

## 4. Postal code — NONE

- Bolivia has **no operational postal-code system**. Empresa de Correos de
  Bolivia routes on **city + departamento**; PO boxes use **Casilla**. A few
  third-party tables show an aspirational 4-/5-digit code ("La Paz, LP 0001",
  and conflicting "12345" forms) but these are **not used on real mail**.
- The config therefore does NOT model a `postal_code` (a never-match sentinel).
  Consequently the place-only rule never fires, and a written 4-digit code is not
  parsed (§7 note 8).

---

## 5. Departamento (9)

Beni (a.k.a. El Beni), Chuquisaca, Cochabamba, La Paz, Oruro, Pando, Potosí,
Santa Cruz, Tarija. Written as a **name after the city** (comma-separated), or
omitted when the city implies it. `regionMap` folds "Potosi"→"Potosí" and
"El Beni"→"Beni". Note the **capital ≠ department name** cases: Sucre (Chuquisaca),
Trinidad (Beni), Cobija (Pando).

---

## 6. Accents, PO box, country

- Names carry `á é í ó ú ñ`: "Jaén", "Sagárnaga", "Potosí", "España", "Junín".
- **Casilla / Casilla de Correo / Casilla Postal** = PO box, normalised to
  "Casilla".
- Country: `Bolivia`, `Estado Plurinacional de Bolivia`, `BOL`, `BO`.

---

## 7. Failure modes to test

1. **No CP tail** — "Calle Comercio 1290, La Paz, La Paz" — city + departamento,
   no postal_code; the place-only rule must NOT fire.
2. **Date/number street name** — "Avenida 6 de Agosto 2170" / "16 de Julio 1490" —
   digits in the name; the trailing number binds.
3. **Bare name (no type)** — "Comercio 1290, La Paz, La Paz".
4. **Street named like a department** — "Avenida Mariscal Santa Cruz 1092" /
   "Calle Potosí 1285" — "Santa Cruz"/"Potosí" appear in the street name but the
   house number binds and the region is read from the tail.
5. **Dwelling "Departamento" vs region** — "…, Departamento 5, La Paz, La Paz" —
   the FIRST "Departamento" is a unit (→ "Depto"), the trailing token is the
   region.
6. **Capital ≠ department** — "Calle España 120, Sucre, Chuquisaca";
   "Calle Cochabamba 55, Trinidad, Beni".
7. **Zona barrio (not modelled)** — "Avenida 6 de Agosto 2170, Zona Sopocachi,
   La Paz, La Paz" (middle segment) and "Zona Sur, Calle 21 8232, La Paz" (leading
   segment): because the barrio-drop in this family is gated on a CP (which BO
   lacks), a separate "Zona …" segment cannot be dropped → `__skip`.
8. **Written 4-digit code not parsed** — "Calle Comercio 1290, 0001 La Paz,
   La Paz": the aspirational code is not operational and the sentinel does not
   match it → `__skip`.
9. **N°/No. marker** — "Calle 25 No. 100, Cochabamba, Cochabamba" — numbered
   street + marker + house number.
10. **s/n** — "Avenida Villazón s/n, La Paz, La Paz" — numberless; parses because
    BO has no CP for the place-only drop-prefix to grab.
11. **Casilla PO box** — "Casilla 1234, La Paz" / "Casilla de Correo 567,
    Cochabamba, Cochabamba".
12. **Department omitted / country present** — "…, La Paz" and "…, La Paz,
    Bolivia".

---

## Sources
- Empresa de Correos de Bolivia — national operator (Wikipedia); no postal-code
  system in operational use.
- GeoPostcodes / Smarty / PostGrid / Umbrex — Bolivia address-format guides
  (street + number, city, departamento, "BOLIVIA"; Casilla for PO boxes;
  conflicting/aspirational code tables noted).
- libpostal (OSM BO tagging) — street-before/after-number, zona, departamento.
