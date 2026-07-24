# Argentine (AR) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser. Sources: Correo Argentino (CPA page, Web
Service de Normalización), UPU S42 Argentina, libpostal (OSM-trained), Google
libaddressinput, Wikipedia "Postal codes in Argentina", BitBoost international-address
Argentina reference.

---

## 1. Canonical order

Argentina writes the **street name FIRST**, then the **house number ("altura") AFTER it**
(`Av. Corrientes 1234`, `Florida 234`). A `N°`/`Nro.` marker may precede the number
(`Calle 70 N° 43`). Then piso + departamento, then the **CPA + locality** line, then the
**provincia**.

```
[Nombre]
[Tipo?] [Calle] [altura]         <- Av. Corrientes 1234
[Piso] [Depto]                   <- Piso 3, Dto. B
[CPA] [Localidad]                <- C1043AAZ Buenos Aires
[Provincia]                      <- (comma or next line)  Santa Fe
ARGENTINA
```

Flattened: `Av. Corrientes 1234, Piso 3 Dto B, C1043AAZ Buenos Aires` (CABA, province
implied) or `Bv. Oroño 1234, S2000EKF Rosario, Santa Fe` (province explicit).

Key facts:
- **Number follows the name**; type is **often absent** (most streets are bare names:
  "Florida", "Sarmiento", "Piedras"). Some streets ARE numbers ("Calle 39", "Calle 70") →
  digits allowed in the name.
- **Piso + Departamento** follow the number: "Piso 3, Dto. B", or the compact ordinal form
  "3° B" (3rd floor, unit B), or "PB" (planta baja). Only the first unit is captured
  structurally (stacked piso+depto is not modelled).
- **CPA precedes the locality**; the **provincia** follows after a comma, or is omitted for
  CABA (the CPA's first letter already encodes the province).
- Country line: `Argentina` / `República Argentina` / `AR`.

---

## 2. Street types (mostly optional)

| Type       | Abbrev.        | Meaning              |
|------------|----------------|----------------------|
| Avenida    | Av. / Avda.    | avenue               |
| (Calle)    | —              | street (usually bare)|
| Pasaje     | Pje.           | passage              |
| Diagonal   | Diag.          | diagonal             |
| Bulevar    | Blvd. / Blv. / Bv. / Blvr. | boulevard |
| Boulevard  | —              | boulevard            |
| Camino     | Cno.           | road                 |
| Ruta (Nac./Prov.) | Rta. / RN / RP | highway         |
| Autopista  | Autop.         | motorway             |
| Colectora  | —              | frontage road        |
| Costanera  | —              | riverside avenue     |
| Peatonal   | —              | pedestrian street    |

Particles (`de`, `del`, `de la`) stay with the name ("Av. **de** Mayo", "Diagonal Norte").

---

## 3. Number, piso & departamento

- **Altura** (house number): digits after the name; may have a `N°`/`Nº`/`Nro.`/`No.`
  marker, a `bis` or letter suffix; **`s/n`** for numberless (rural / plazas).
- **Piso** (floor) + **Departamento** (Depto/Dpto/Dto): "Piso 3", "Dto. B", combined
  "3° B", "PB". Also Local, Oficina (Of.), Unidad, Torre.
- Field mapping: `number` = altura; `sec_unit_type`/`sec_unit_num` = piso/depto; the compact
  "3° B" gets the default type "Piso".

---

## 4. CPA (Código Postal Argentino)

- Current form is **8 characters: 1 letter + 4 digits + 3 letters** — `C1043AAZ`,
  `S2000EKF`, `X5000JHQ`. The **first letter encodes the province** (A Salta, B Buenos Aires
  prov., C CABA, S Santa Fe, X Córdoba, M Mendoza, T Tucumán, …). The 4 digits are the legacy
  code; the last 3 letters narrow to the block/side of street.
- A **short "letter + 4 digits"** form ("B1900", "S2000") is common where the 3-letter
  suffix is dropped.
- The **legacy 4-digit CP** ("1425") predates the CPA (introduced 1998) and still appears,
  sometimes in parentheses "(1425)".
- Written **before** the locality. Keep as a string (letters + leading zeros matter).

---

## 5. Provincia (23 provinces + CABA)

- Buenos Aires, Catamarca, Chaco, Chubut, Córdoba, Corrientes, Entre Ríos, Formosa, Jujuy,
  La Pampa, La Rioja, Mendoza, Misiones, Neuquén, Río Negro, Salta, San Juan, San Luis,
  Santa Cruz, Santa Fe, Santiago del Estero, Tierra del Fuego, Tucumán; plus the autonomous
  **Ciudad Autónoma de Buenos Aires (CABA)** — also written "Capital Federal".
- Written as a **name after the locality** (comma-separated), or omitted for CABA. The
  `regionMap` folds "Capital Federal" / "Ciudad Autónoma de Buenos Aires" → "CABA" and
  "Provincia de Buenos Aires" → "Buenos Aires".
- Note the **Buenos Aires** overload: the CITY of Buenos Aires (CABA) vs the PROVINCE of
  Buenos Aires (capital La Plata, Gran Buenos Aires suburbs).

---

## 6. Accents & country

- Names carry `á é í ó ú ñ ü`: "Ñuñorco", "Güemes", "Perón", "Sáenz Peña".
- Country: `Argentina`, `República Argentina`, `ARG`, `AR`.
- **Casilla de Correo** (C.C.) = PO box: "Casilla de Correo 432".

---

## 7. Failure modes to test

1. **Bare name (no type)** — "Florida 234, C1005AAF Buenos Aires" — no type word; number binds.
2. **Numbered street** — "Calle 39 N° 1540, B1900 La Plata, Buenos Aires" — the name is a
   number ("39"); the `N°` marker introduces the real altura (1540).
3. **CPA vs short form vs legacy** — "C1043AAZ" (8-char), "B1900" (letter+4), "(5000)"
   (legacy 4-digit in parens) all parse as `postal_code`.
4. **Anchored place-only cannibalisation** — "Av. Corrientes 1234, C1043AAZ Buenos Aires":
   the drop-prefix must NOT let the place-only rule eat "Av. Corrientes 1234," (guarded: the
   dropped neighbourhood segment must end in a non-digit, but a street ends in the altura).
5. **Compact floor "3° B"** — "Av. Corrientes 1234, 3° B, C1043AAZ Buenos Aires" — one unit,
   default type "Piso".
6. **Explicit Piso/Depto** — "Av. 9 de Julio 1925, Piso 3, C1073ABA Buenos Aires".
7. **CABA province omitted** — "..., C1043AAZ Buenos Aires" — city "Buenos Aires", no state
   (the CPA "C…" implies CABA); do not hallucinate a province.
8. **Province explicit** — "S2000EKF Rosario, Santa Fe"; "X5000 Córdoba, Córdoba" — city vs
   province may share a name (Córdoba city in Córdoba province).
9. **`s/n`** — rural / plaza addresses with no altura.
10. **`N°` / `Nro.` marker** — "Calle 70 N° 43" — strip the marker, keep the digits.
11. **Casilla de Correo** — "Casilla de Correo 432, C1000 Buenos Aires" — PO box path.
12. **Bv./Bulevar abbreviations** — "Bv. Oroño 1234, S2000 Rosario, Santa Fe" (Rosario/Córdoba).

---

## Sources
- Correo Argentino — CPA page and Web Service de Normalización de Base de Datos
  (correoargentino.com.ar/encabezado/cpa, …/servicios/postales/web-service-…).
- Postal codes in Argentina — Wikipedia (CPA = letter + 4 digits + 3 letters; province
  letter map; legacy 4-digit CP history).
- BitBoost international-address-formats/argentina (street-before-number, piso/depto, CPA
  before city, Casilla de Correo).
- libpostal (OSM AR tagging); Google libaddressinput (AR format %N%n%O%n%A%n%Z %C%n%S).
- UPU S42 Argentina postal addressing template.
