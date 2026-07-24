# Chilean (CL) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser. Sources: Correos de Chile / ChileAtiende
(código postal), CorreosChile "Encuentra tu código postal", Wikipedia "Postal codes in
Chile" / "Anexo:Códigos postales de Chile", the 16-región administrative list, and native
business-address usage (Providencia / Las Condes / Santiago corpora). See Sources below.

---

## 1. Canonical order

Chile writes the **street TYPE + name FIRST**, then the **house number AFTER the name**,
usually with **NO comma** between name and number:

```
[Tipo] [Nombre] [Número][, [Piso/Depto/Oficina]]     <- Avenida Providencia 1234, Oficina 502
[Código Postal] [Comuna]                             <- 7500000 Providencia   (CP usually omitted)
[Región]                                             <- Región Metropolitana
CHILE
```

Flattened, comma-joined: `Avenida Providencia 1234, Oficina 502, Providencia, Región Metropolitana`.

Key facts:
- **Number follows the name**, normally with no marker and no comma: `Av. Apoquindo 4501`.
  A `N°`/`Nro.`/`No.` marker may precede it but is uncommon. `s/n` = sin número.
- The **street TYPE is frequently OMITTED** — Chile writes many downtown streets as a bare
  name: `Agustinas 1022`, `Moneda 921`, `Bandera 84`, `Huérfanos 1160`. The grammar's
  bare-name alternative handles this.
- **Piso / Departamento / Oficina / Local** trail the number as a secondary unit:
  `..., Oficina 502`, `..., Depto 1201`.
- **Comuna → `city`**; **región → `state`**. The comuna (municipality) is the real routing
  unit; the región is the top administrative division.
- The **big-city name "Santiago"** is accepted in the región slot and mapped to
  `Región Metropolitana`, so the extremely common `..., Las Condes, Santiago` parses
  (comuna Las Condes, región RM). The abbreviation `RM`/`R.M.` is mapped the same way.
- Country line: `Chile` / `CHL` / `CL`.

---

## 2. Street types (tipos de vía) and abbreviations

Type leads the line, kept verbatim. Most common:

| Full type   | Abbrev.        | Meaning                    |
|-------------|----------------|----------------------------|
| Avenida     | Av. / Avda.    | avenue                     |
| Calle       | —              | street (often omitted)     |
| Pasaje      | Pje. / Psje.   | passage / cul-de-sac       |
| Camino      | Cno.           | road                       |
| Callejón    | Cjon.          | alley                      |
| Costanera   | —              | riverside/coast road       |
| Diagonal    | Diag.          | diagonal                   |
| Autopista   | —              | motorway                   |
| Rotonda     | —              | roundabout                 |
| Subida / Bajada | —          | up-/down-slope (Valparaíso)|
| Gran Avenida| —              | grand avenue (multiword)   |

Notes: `Gran Avenida` (multiword, e.g. "Gran Avenida José Miguel Carrera") is listed first
so it wins over `Avenida`. Particles ("de", "del", "de la") stay with the NAME.

---

## 3. House number & secondary unit

- **Número**: digits after the name (`4501`, `1234`, `0177` — leading zeros occur and are
  kept as a string). Optional letter suffix (`123 A`). `s/n` = sin número.
- **Secondary unit** (after the number): Departamento (Depto/Dpto/Dto), Oficina (Ofic/Of),
  Piso, Local (Loc), Casa, Torre, Block/Bloque. `number-first` floors are uncommon in CL.
- Field mapping: `number` = civic number; `civic_number_suffix` = letter/`s/n`;
  `sec_unit_type`/`sec_unit_num` = one unit.

---

## 4. Código Postal

- **7 digits**, no separator: `7500000`, `8340518`. First 3 digits ≈ comuna, last 4 ≈
  block-face (manzana / frente de manzana), so every side of a block has its own code.
- **VERY OFTEN OMITTED.** Chilean everyday and business mail routes on **comuna + región**
  alone; Correos introduced the 7-digit code but adoption in written addresses is low.
- Written **BEFORE** the comuna on the CP line (`7500000 Providencia`). Modelled as
  OPTIONAL. Leading zeros are significant → keep as a string.

---

## 5. Región (state)

- **16 regions** (2018-present, after Ñuble was split off): Arica y Parinacota, Tarapacá,
  Antofagasta, Atacama, Coquimbo, Valparaíso, Metropolitana de Santiago (RM), O'Higgins,
  Maule, Ñuble, Biobío, La Araucanía, Los Ríos, Los Lagos, Aysén, Magallanes.
- Written many ways: `Región Metropolitana`, `Región de Valparaíso`, `Región del Biobío`,
  `RM`, or the bare name. The parser strips a leading `Región de / del / de la` and captures
  the bare name, then canonicalises via `regionMap` (e.g. `Santiago`→`Región Metropolitana`,
  `Bío-Bío`→`Biobío`, `Araucanía`→`La Araucanía`).

---

## 6. Accents, ñ and particles

- Names carry diacritics: `á é í ó ú ñ`: "Huérfanos", "Vicuña Mackenna", "Errázuriz",
  "Cristóbal Colón", "Peñalolén". The grammar is Unicode-aware.
- Apostrophe in "O'Higgins" (both a street and a región) is preserved.
- Lowercase particles ("de", "del", "de la") stay in the NAME.

---

## 7. Country variants & PO box

- Country: `Chile`, `CHL`, `CL`.
- **Casilla / Casilla de Correo** = PO box: `Casilla 123` replaces the street line.

---

## 8. Failure modes to test

1. **No comma before number** — "Av. Apoquindo 4501, Las Condes, Santiago" — the number
   binds to the street with no separator; not read as a locality.
2. **Type omitted (bare name)** — "Agustinas 1022", "Moneda 921" — a downtown street with
   no vía word; the bare-name alternative captures it.
3. **"Santiago" as región proxy** — "..., Las Condes, Santiago" — Santiago is the city, but
   here it stands in for the Región Metropolitana; mapped to `Región Metropolitana`.
4. **`Región de / del` prefix** — "..., Concepción, Región del Biobío" — the prefix is
   consumed, `state` = "Biobío".
5. **Leading-zero number** — "Av. El Bosque Norte 0177", "Avenida Bulnes 01890" — kept as a
   string.
6. **Multiword type "Gran Avenida"** — "Gran Avenida José Miguel Carrera 5250" — the
   two-word type wins over "Avenida".
7. **Secondary unit** — "..., Oficina 502", "..., Depto 1201", "..., Piso 8" — split from
   the number; canonicalised (Oficina→Of, Departamento→Depto).
8. **7-digit CP present / absent** — "7510115 Providencia, RM" vs "Providencia, RM" — the CP
   is optional and, when present, precedes the comuna.
9. **Casilla PO box** — "Casilla 123, 8320000 Santiago, RM" — box path, no street.
10. **Country present** — "..., Providencia, Santiago, Chile".
11. **Accent-final / leading-Ñ comuna** (DOCUMENTED LIMITATION) — comunas like `Copiapó`
    (ends in "ó"), `Maipú` (ends in "ú"), `Ñuñoa` (starts "Ñ") parse correctly field-wise,
    but the library's token-preservation invariant (`src/invariant.ts`) locates boundaries
    with ASCII `\b`, which fails at a non-ASCII word char at the very start/end of the city
    when no postcode follows. Such samples are marked `__skip`. (Add a CP, or a comuna that
    starts/ends in an ASCII letter, to avoid it.)
12. **Multiword comuna** — "Viña del Mar", "Puerto Montt", "La Serena", "Las Condes" — the
    multi-word comuna survives as the city.

---

## Sources
- Correos de Chile — código postal help; ChileAtiende ficha 892 "Código postal"
  (chileatiende.gob.cl/fichas/892-codigo-postal).
- Wikipedia — "Postal codes in Chile"; "Anexo:Códigos postales de Chile" (7-digit
  structure: región/comuna + manzana/frente de manzana).
- CorreosChile / 24horas "Guía para conocer tu código postal".
- "Lista de las 16 regiones de Chile" (24horas); Región de Valparaíso / del Biobío (Wikipedia)
  for the administrative region list and spellings.
- pepeschile.com "Proper mailing address format in Chile" (order type+name+number, comuna,
  región; CP often omitted); native Providencia/Las Condes business-address usage.
