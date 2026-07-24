# Ecuadorian (EC) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser (before-city Iberian/LatAm template,
sibling of PE/CL). Sources: Correos del Ecuador / MINTEL "Código Postal Ecuador"
(codigopostal.gob.ec), Ministerio de Educación "El Ecuador ya cuenta con Sistema
de Código Postal", codigopostal.ec, Ubica Ecuador, libpostal (OSM EC). See Sources.

---

## 1. Canonical order

Street **TYPE + name FIRST** ("Avenida Amazonas 2345", "Calle Rocafuerte 812"),
then the house number **AFTER** the name, then the CP + city, then the provincia.

```
[Tipo] [Calle] [número]           <- Avenida Amazonas 2345
[Piso] [Depto/Oficina]            <- Piso 4, Oficina 302
[Ciudadela/Urbanización?]         <- La Mariscal   (dropped)
[CP] [Ciudad/Cantón]              <- 170515 Quito
[Provincia]                       <- Pichincha
ECUADOR
```

Flattened: `Avenida Amazonas 2345, 170515 Quito, Pichincha`.

- Coastal cities (Guayaquil, Machala) use plain house numbers. **Quito's odonym
  numbering** ("Av. Amazonas N23-45 y Veintimilla", where `N23-45` is the metric
  *placa* and `y Veintimilla` names the CROSS street) is a two-street form the
  single-street grammar cannot express → out-of-scope (§7).
- The type is nearly always present; particles ("de", "de las", "del") stay with
  the name ("Av. **de las** Américas", "Av. Francisco **de** Orellana").

---

## 2. Street types

| Type       | Abbrev.       | Meaning        |
|------------|---------------|----------------|
| Avenida    | Av.           | avenue         |
| Calle      | —             | street         |
| Pasaje     | Pje.          | passage        |
| Vía        | —             | route/road     |
| Callejón   | Cjon.         | alley          |
| Malecón    | Malec.        | waterfront     |
| Autopista / Camino / Redondel / Peatonal / Prolongación (Prol.) | | |

---

## 3. Number & secondary unit

- **Número**: digits after the name; optional `N°`/`Nro.`/`No.` marker; `s/n`
  for numberless (parses only when the CP is omitted — see §7 note 9).
- **Piso / Departamento (Depto) / Oficina (Of.) / Local / Bloque / Suite** trail
  as one secondary unit.
- Field mapping: `number` = número; `sec_unit_*` = piso/depto/oficina/…

---

## 4. Código Postal (6 digits)

- **6 numeric digits**, format **PPCCDD**: PP = provincia, CC = cantón, DD = zona
  (e.g. `170150` = Pichincha 17 / Quito 01 / centro histórico 50; `010150` =
  Azuay 01 / Cuenca 01). Introduced 2007 by Correos del Ecuador. Written
  **before** the city. Kept as a string (leading zeros matter — "090313",
  "010150"). Sample codes illustrate the PPCCDD shape, not an exhaustive map.

---

## 5. Provincia (24)

Azuay, Bolívar, Cañar, Carchi, Chimborazo, Cotopaxi, El Oro, Esmeraldas,
Galápagos, Guayas, Imbabura, Loja, Los Ríos, Manabí, Morona Santiago, Napo,
Orellana, Pastaza, Pichincha, Santa Elena, Santo Domingo de los Tsáchilas,
Sucumbíos, Tungurahua, Zamora Chinchipe. Written after the city; `regionMap`
folds accent-free spellings ("Manabi"→"Manabí", "Los Rios"→"Los Ríos",
"Canar"→"Cañar", "santo domingo de los tsachilas"→"Santo Domingo de los
Tsáchilas", …).

---

## 6. Accents, PO box, country

- Names carry `á é í ó ú ñ`: "República", "Colón", "García Moreno", "Cañar".
- **Casilla / Casilla Postal / Apartado / Apartado Postal** = PO box, normalised
  to "Casilla".
- Country: `Ecuador`, `República del Ecuador`, `ECU`, `EC`.

---

## 7. Failure modes to test

1. **Typed street + 6-digit CP** — "Avenida Amazonas 2345, 170515 Quito,
   Pichincha".
2. **Date/number street name** — "Av. 9 de Octubre 1234" / "Av. 10 de Agosto" —
   digits in the name; the trailing number binds.
3. **Bare name (no type)** — "Juan León Mera 741, 170150 Quito, Pichincha".
4. **Ciudadela/Urbanización drop** — "Av. Amazonas 2345, La Mariscal, 170515
   Quito, Pichincha" — the barrio "La Mariscal" is consumed by the CP
   drop-prefix (fires only when a CP follows) and not emitted.
5. **Leading zeros in CP** — "…, 090313 Guayaquil, Guayas" — keep as a string.
6. **Accent-normalised province** — "…, Manabi" → "Manabí"; longest name
   "Santo Domingo de los Tsáchilas".
7. **Quito N-numbering + cross street** — "Av. Amazonas N23-45 y Veintimilla,
   170143 Quito, Pichincha" — `N23-45` placa + `y <cross street>` is not a
   single-street form → `__skip`.
8. **Numberless street + plain CP ambiguity** — "Calle 10, 170150 Quito,
   Pichincha": a bare numbered street with no house number collides with the
   plain 6-digit CP → `__skip`. (Named/numbered streets WITH a house number parse
   fine, e.g. "Vía a la Costa 12000".)
9. **s/n + place-only drop** — "Av. Amazonas s/n, 170515 Quito" would be eaten by
   the place-only drop-prefix; s/n parses only when the CP is omitted
   ("Av. Amazonas s/n, Quito, Pichincha").
10. **Hyphenated Apartado box** — "Apartado Postal 17-12-159" (3-part box) — only
    the leading segment is captured → `__skip`.
11. **Province omitted / country present** — "…, 170515 Quito" and
    "…, 170515 Quito, Ecuador".
12. **Malecón / Vía types** — "Malecón Simón Bolívar 100", "Vía a la Costa 12000".

---

## Sources
- Correos del Ecuador / MINTEL — "Código Postal Ecuador" (codigopostal.gob.ec):
  6-digit PPCCDD structure.
- Ministerio de Educación — "El Ecuador ya cuenta con Sistema de Código Postal"
  (2007 introduction).
- codigopostal.ec and Ubica Ecuador — CP directory and examples ("170150" Quito
  centro histórico, "010150" Cuenca).
- libpostal (OSM EC tagging); the N-numbering / "y <cross street>" Quito nomenclature.
