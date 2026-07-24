# Peruvian (PE) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser. Sources: Serpost / codigopostal.gob.pe
(código postal), Wikipedia "Postal codes in Peru" and "Serpost", El Comercio / Gestión /
América TV guides to Lima & regional postal codes, PostGrid "Peru Address Format", GEODIR
Perú, and native business-address usage. See Sources below.

---

## 1. Canonical order

Peru writes the **street TYPE + name FIRST**, then the **house number AFTER the name**
(usually no comma), then the secondary unit, then the district, then the department:

```
[Tipo] [Nombre] [Número][, [Dpto/Int/Piso/Of]]     <- Av. Arequipa 2625, Dpto 501
[Urbanización]                                      <- Urb. Corpac          (when present)
[Distrito]                                           <- Lince
[Provincia/Departamento][, Perú]                     <- Lima
```

Flattened: `Av. Arequipa 2625, Dpto 501, Lince, Lima`.

Key facts:
- **The TYPE is nearly always present and usually abbreviated**: `Av.` (Avenida), `Jr.`
  (Jirón), `Ca.` (Calle), `Psje.`/`Pje.` (Pasaje). This is the opposite of Chile, where the
  type is often omitted.
- **Number follows the name**, normally no marker/comma: `Av. José Larco 345`. `s/n` = sin
  número.
- **Distrito → `city`**; **provincia/departamento → `state`**. The distrito (Miraflores, San
  Isidro, Lince, …) is the routing unit; the department (Lima, Arequipa, Cusco, …) is the
  top division. "Miraflores, Lima" → city=Miraflores, state=Lima.
- **Urbanización** (`Urb.`) — a named housing estate — often sits between the street and the
  district. It is a neighbourhood, dropped via the CP drop-prefix when a postcode follows.
- Country line: `Perú` / `Peru` / `PER` / `PE`.

---

## 2. Street types (tipos de vía) and abbreviations

Type leads the line, verbatim:

| Full type      | Abbrev.          | Meaning                             |
|----------------|------------------|-------------------------------------|
| Avenida        | Av.              | avenue (most common)                |
| Jirón          | Jr.              | a street made of several blocks     |
| Calle          | Ca. / Cl.        | street                              |
| Pasaje         | Psje. / Pje.     | passage / alley                     |
| Malecón        | Mlc. / Malec.    | seafront/riverside walk             |
| Prolongación   | Prol.            | continuation of an avenue           |
| Alameda        | Alam.            | tree-lined walk                     |
| Óvalo          | —                | roundabout                          |
| Carretera      | Carr.            | highway                             |
| Vía            | —                | way                                 |

Cardinal suffixes are common on avenues: `Av. Javier Prado Este`, `Av. Javier Prado Oeste`,
`Av. Angamos Este`. Particles ("de la", "de", "del") stay with the NAME
("Jirón de la Unión" → name "de la Unión").

---

## 3. House number & secondary unit; Urbanización / Mz-Lt

- **Número**: digits after the name (`345`, `2625`). Optional `N°`/`Nro.`/`No.` marker;
  optional letter suffix; `s/n` = sin número.
- **Secondary unit** (after the number): Departamento (Dpto/Depto), Interior (Int), Piso,
  Oficina (Ofic/Of). Also Manzana (Mz) + Lote (Lt) in urbanización / pueblo-joven addressing.
  One unit is captured (Dpto/Int/Piso/Of preferred).
- **Urbanización + Mz + Lt** ("Urb. Los Sauces Mz. R Lt. 34") is the pueblo-joven / estate
  form where there is no street number; the full Mz+Lt pair cannot be captured as a single
  secondary unit and is a documented limitation. The `Urb. <name>` neighbourhood is dropped
  when a postcode follows.
- Field mapping: `number` = civic number; `civic_number_suffix` = letter/`s/n`;
  `sec_unit_type`/`sec_unit_num` = one unit.

---

## 4. Código Postal

- **5 digits** (NNNNN): `15046` (San Isidro), `15074` (Miraflores), `15001` (Cercado de
  Lima). Digit 1 = región group, digit 2 = provincia, digits 3-4 = distrito, digit 5 = zone.
- Reintroduced by Serpost (codigopostal.gob.pe); Lima & Callao carry ~158 distinct codes.
  **Often omitted** in everyday addresses. Modelled as OPTIONAL, **before the district**.
- **Legacy "Lima 27" form**: before the 5-digit system, Lima used a district-zone number
  written AFTER the city ("Lima 27", "Lima 18", "Lima 14"). Because this parser captures the
  postcode BEFORE the city, the trailing legacy zone is **not captured** — city = "Lima" and
  the zone digit is dropped. Documented limitation (such samples are `__skip`).
- Leading zeros are significant → keep as a string.

---

## 5. Departamento / Provincia (state)

- **24 departamentos + the Constitutional Province of Callao + Lima Province.** Common:
  Lima, Callao, Arequipa, Cusco, La Libertad, Lambayeque, Piura, Junín, Loreto, Ica, Puno,
  Tacna, Cajamarca, Áncash, etc.
- Written after the district: `Miraflores, Lima`; `Yanahuara, Arequipa`; `Cusco, Cusco`.
  Canonicalised via `regionMap` (accents restored: `Ancash`→`Áncash`, `Junin`→`Junín`,
  `Cuzco`→`Cusco`). "Lima" appears as district, provincia AND departamento — when it is the
  only trailing locality it is the city; when it follows a district it is the state.

---

## 6. Accents, ñ and particles

- Names carry diacritics: `José`, `Nicolás de Piérola`, `Túpac Amaru`, `España`, `Áncash`,
  `Junín`, `Sáenz Peña`. Unicode-aware.
- Lowercase particles ("de", "de la", "del", "y") stay in the NAME.

---

## 7. Country variants & PO box

- Country: `Perú`, `Peru`, `PER`, `PE`.
- **Apartado Postal** / **Casilla** = PO box: `Apartado Postal 1234`.

---

## 8. Failure modes to test

1. **Number after name, no comma** — "Av. José Larco 345, Miraflores, Lima" — number binds
   to the street; not read as a locality.
2. **District vs department** — "Miraflores, Lima" — city=Miraflores (distrito),
   state=Lima (departamento), NOT the reverse.
3. **Particle name "Jirón de la Unión"** — "Jr. de la Unión 300, Lima" — the "de la" stays in
   the name; number 300 still found (a naive parse mis-reads "de" as the whole name — guarded).
4. **Cardinal in avenue name** — "Av. Javier Prado Este 4200" — "Este" is part of the name,
   not the number.
5. **Abbreviated types** — "Av.", "Jr.", "Ca.", "Psje." — verbatim.
6. **Secondary unit** — "..., Dpto 501", "..., Int 302", "..., Of 1502", "..., Piso 3" —
   split from the number; canonicalised (Departamento→Dpto, Oficina→Of).
7. **Urbanización drop (with CP)** — "..., Urb. Las Gardenias, 15038 San Isidro, Lima" — the
   `Urb.` neighbourhood is dropped when a postcode follows; WITHOUT a postcode it is taken as
   the city (documented limitation, `__skip`).
8. **Legacy "Lima 27" zone (DOCUMENTED LIMITATION)** — "..., Lince, Lima 14" — the trailing
   zone after the department is not captured by the before-city grammar; `__skip`.
9. **5-digit CP present** — "..., 15074 Miraflores, Lima" — code precedes the district.
10. **`s/n`** — "Antigua Panamericana Sur s/n, Lurín, Lima" — no number.
11. **Apartado Postal PO box** — "Apartado Postal 1234, Lima, Lima".
12. **Country present** — "..., Lince, Lima, Perú".
13. **Multiword district** — "Cercado de Lima", "Santiago de Surco", "San Juan de
    Lurigancho", "Magdalena del Mar", "José Luis Bustamante y Rivero" — survives as the city.
14. **Numbered street name** — "Calle 7 145, San Isidro, Lima" — digits are part of the NAME;
    the trailing number is still found.

---

## Sources
- Serpost — codigopostal.gob.pe (5-digit códigos postales; Lima/Callao ~158 codes).
- Wikipedia — "Postal codes in Peru" (5-digit structure); "Serpost".
- El Comercio / Gestión / América TV / El Peruano — guides to Lima, Callao & regional postal
  codes (e.g. Lima central = 15001; legacy "Lima 27" zone).
- PostGrid — "Peru Address Format" (Calle/Jirón/Avenida/Pasaje; Urb.; Dpto; district order).
- GEODIR Perú (urbanización / distrito); native Lima business-address usage for type
  abbreviations and Mz/Lt urbanización addressing.
