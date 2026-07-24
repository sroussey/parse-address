# Mexican (MX) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser. Sources: Correos de México / SEPOMEX,
UPU S42 Mexico (mexEn.pdf), libpostal (OSM-trained), Google libaddressinput, Precisely
MEX geocoding guide, GeoPostcodes / Brainbound Mexico address guides.

---

## 1. Canonical order

Mexico writes the **street TYPE + name FIRST**, then the **exterior number AFTER the name**
(`Avenida Insurgentes Sur 1602`, usually no comma), then optionally an interior number, then
the **colonia** on its own line, then the **C.P. + city, state** line.

```
[Nombre]
[Tipo] [Nombre de la calle] [No. ext] [No. int]   <- Av. Insurgentes Sur 1602 Int. 5
[Colonia]                                          <- Colonia Crédito Constructor
[C.P.] [Municipio/Ciudad], [Estado]                <- 03940 Benito Juárez, CDMX
MÉXICO
```

Flattened: `Av. Insurgentes Sur 1602, Crédito Constructor, 03940 Benito Juárez, CDMX`.

Key facts:
- **Street name precedes the number**; type frequently OMITTED ("Durango 264"). A
  `No.`/`Núm.`/`#` marker may precede the exterior number.
- **Interior number** (`Int. 5`, `Depto 3`, `Piso 2`, `Local 4`) trails the exterior number
  as a secondary unit.
- **Colonia** (asentamiento) is a **key routing unit** on its own line, **between the street
  and the C.P. line**, often prefixed "Col.". This parser has no colonia output field, so it
  is **consumed and dropped** (drop-prefix in `postalPattern`).
- **C.P. precedes the city**; the **estado** follows the city after a comma
  (`06600 Cuauhtémoc, CDMX`, `44360 Guadalajara, Jalisco`). C.P. may carry a "C.P."/"CP"
  lead-in.
- Country line: `México` / `Mexico` / `MEX` / `MX`.

Note the "city" slot is really the **municipio / delegación / alcaldía** (Benito Juárez,
Cuauhtémoc, Guadalajara, Zapopan); the estado is the federal entity.

---

## 2. Street types (vialidad) and abbreviations

Type leads the name, kept verbatim; commonly dropped entirely.

| Full type      | Abbrev.       | Meaning                    |
|----------------|---------------|----------------------------|
| Calle          | C.            | street (often omitted)     |
| Avenida        | Av.           | avenue                     |
| Boulevard      | Blvd. / Bulevar | boulevard                |
| Calzada        | Calz.         | causeway/avenue            |
| Privada        | Priv.         | private (cul-de-sac)       |
| Prolongación   | Prol.         | extension of a street      |
| Cerrada        | Cda.          | closed street              |
| Circuito       | Cto.          | loop road                  |
| Retorno        | Ret.          | return/cul-de-sac          |
| Diagonal       | Diag.         | diagonal                   |
| Andador        | And.          | pedestrian walk            |
| Calzada        | Calz.         | causeway                   |
| Carretera      | Carr.         | highway                    |
| Callejón       | Cjón.         | alley                      |
| Eje (Central…) | —             | axis road (often numbered) |
| Paseo          | —             | promenade                  |
| Camino         | —             | road/path                  |
| Ampliación     | Ampl.         | (colonia) extension        |

`Eje` roads are numbered ("Eje 1 Norte"); "16 de Septiembre", "5 de Mayo" are numbered
street NAMES — digits are allowed inside the name.

---

## 3. Number, interior unit

- **Número exterior**: digits after the name, sometimes with `No.`/`Núm.`/`#`, sometimes a
  letter or `-N` suffix (`264-A`, `264-5`). **`S/N`** = "sin número".
- **Número interior / unit** words: Interior (Int.), Departamento (Depto/Dpto), Piso, Local
  (Loc.), Nivel, Edificio (Edif.), Manzana (Mz), Lote (Lt). Appears as `... 1602 Int. 5` or
  `..., Depto 3`.
- Field mapping: `number` = exterior number; `sec_unit_type`/`sec_unit_num` = interior/unit.

---

## 4. Código Postal (C.P.)

- **Exactly 5 digits**, numeric, no letters/separators: `06700`, `44160`, `64000`.
- **First 2 digits = state/zone** (01–99): 00–16 = CDMX, 44/45 = Jalisco (Guadalajara),
  64–67 = Nuevo León (Monterrey), 68 = Oaxaca, 20 = Aguascalientes, 97 = Yucatán, etc.
- Leading zeros significant → keep as string ("06700", "01900").
- Written **before** the city, optionally with a "C.P." lead-in.

---

## 5. Estado (32 federal entities)

- 31 states + **Ciudad de México (CDMX)** (formerly Distrito Federal / D.F.).
- Written as a **name after the city** (comma-separated): "Jalisco", "Nuevo León",
  "Oaxaca", "Estado de México" (a.k.a. Edomex / México, capital Toluca — distinct from CDMX),
  "CDMX". Abbreviations: CDMX, D.F., Edo. Méx./Edomex, N.L., Q. Roo, B.C., B.C.S.
- Emitted in `state`; a `regionMap` canonicalises CDMX/D.F.→"CDMX", Edomex→"México", and
  fixes missing accents (Nuevo Leon→"Nuevo León").

---

## 6. Accents & the México ambiguity

- Names carry `á é í ó ú ñ ü`: "Álvaro Obregón", "Cuauhtémoc", "Michoacán", "Querétaro".
- **"México" is overloaded**: the country, the state (Estado de México), AND part of the
  city "Ciudad de México". The grammar tries the state (region) before the country, and the
  city "Ciudad de México" is comma-bounded, so each resolves in its own slot.

---

## 7. Country variants & PO box

- Country: `México`, `Mexico`, `Estados Unidos Mexicanos`, `MEX`, `MX`.
- **Apartado Postal** (Apdo. Postal) = PO box: `Apartado Postal 145` replaces the street.

---

## 8. Failure modes to test

1. **Type omitted** — "Durango 264, Roma Norte, 06700 Cuauhtémoc, CDMX" — bare street name,
   no type; number still binds.
2. **No comma before number** — "Av. Insurgentes Sur 1602, ..." — number binds to street;
   the anchored place-only rule must not eat "... Sur 1602," (guarded: non-digit before comma).
3. **Colonia drop** — "..., Crédito Constructor, 03940 Benito Juárez, CDMX" — colonia consumed,
   city = "Benito Juárez".
4. **Interior number** — "Calle Durango 264 Int. 5" — split exterior 264 vs interior unit 5.
5. **`S/N`** — "Calle Morelos S/N, Centro, 68000 Oaxaca de Juárez, Oaxaca" — number null.
6. **Numbered street name** — "Calle 16 de Septiembre 123", "Eje 1 Norte 200" — digits in name.
7. **Multi-word state** — "44360 Guadalajara, Jalisco"; "Nuevo León"; "Baja California Sur" —
   the state alternation must prefer the longest name.
8. **CDMX city vs state** — "06600 Ciudad de México, CDMX" — city "Ciudad de México",
   state "CDMX"; do not confuse with the country "México".
9. **C.P. lead-in** — "C.P. 03100 ..." — strip the marker, keep 5 digits; leading zeros kept.
10. **Abbreviated type** — "Blvd. Adolfo López Mateos", "Calz. de Tlalpan", "Priv. …".
11. **Apartado Postal** — "Apartado Postal 145, 64000 Monterrey, Nuevo León" — PO box path.
12. **Municipio ≠ estado capital** — "Zapopan, Jalisco", "Benito Juárez, CDMX" — city is the
    municipio/alcaldía, not the state capital.

---

## Sources
- Correos de México / SEPOMEX addressing guidance; UPU S42 Mexico (upu.int … mexEn.pdf —
  "Postcode 5 digits to left of locality name").
- GeoPostcodes "Mexico Address Format"; Brainbound "Mexico Address Format Guide";
  Precisely MEX geocoding input recommendations.
- Postal codes in Mexico — Wikipedia (5-digit, first-two-digits = zone/state).
- libpostal (OSM MX tagging: house_number after road, unit, suburb=colonia, postcode, state);
  Google libaddressinput (MX format %N%n%O%n%A%n%D%n%Z %C, %S).
