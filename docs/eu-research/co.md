# Colombian (CO) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser. Sources: 4-72 / Servicios Postales Nacionales
(código postal), the DANE/IGAC "nomenclatura urbana" model, Wikipedia "Nomenclatura urbana",
Portafolio "Nomenclatura urbana: cómo leer las direcciones en Colombia", Archivo de Bogotá
"Nomenclatura de las calles", and native business-address usage. See Sources below.

---

## 1. Canonical order and the "#" block (the key feature)

Colombia uses a **Cartesian grid nomenclature**. An address names the **vía** the property
sits on, then — after a `#` (numeral) — the **cross-street** it is near and the **distance**
to the door:

```
[Tipo] [Vía] # [generatriz]-[placa][, sec-unit]     <- Calle 100 # 8-60, Oficina 201
[Barrio/Localidad]                                  <- Chapinero            (often omitted)
[Ciudad][, Departamento]                            <- Bogotá, Cundinamarca
[Código Postal]                                     <- 110221               (usually omitted)
COLOMBIA
```

Flattened: `Calle 100 # 8-60, Oficina 201, Medellín, Antioquia`.

**"Calle 100 # 8-60" decomposed:**
- `Calle 100` — the **vía**: its TYPE (Calle) + its **designator**, which is USUALLY A
  NUMBER (100 = the 100th calle) but can be a name ("Avenida El Dorado", "Avenida Caracas").
- `# 8-60` — after the numeral:
  - `8` = the **generatriz** — the cross-street (here Carrera 8) at which the block starts.
  - `60` = the **placa** — the distance in metres from that intersection to the door.

### Field-mapping decision for "# 8-60"
The generatriz and placa are read together as ONE spoken number ("ocho sesenta") and are the
building's actual address number. **This parser stores the whole `8-60` in `number`** (marker
`#`/`No.`/`N°` stripped, dash kept), NOT split into `number` + `civic_number_suffix`.
Rationale:
- It matches how the number is spoken/written and how libpostal / Google tag Colombian
  `house_number` (the composite string).
- Splitting "8" into `number` and "-60" into `civic_number_suffix` would falsely imply "8" is
  the civic number (it is the *cross-street*), losing the composite semantics.
- A trailing letter on either part is kept in place: `95A-55`, `16A-20`, `49A-30`.
- An optional cardinal binds to either part: `18 Sur-135`, `50-42` on `Calle 10 Sur`.

So: `Calle 100 # 8-60` → `type=Calle`, `street=100`, `number=8-60`.
(The mechanism: the vía designator is captured as the street name — digits allowed — and the
house-number pattern REQUIRES a `#`/`No.`/`N°` marker, so the composite is unambiguously the
`number` and never confused with the designator.)

---

## 2. Vía types and abbreviations

Type leads the line, verbatim. The five grid types plus avenues:

| Full type      | Abbrev.              | Axis / meaning                    |
|----------------|----------------------|-----------------------------------|
| Calle          | Cl / Cll / C.        | runs east–west                    |
| Carrera        | Cra / Cr / Kra / Kr / K | runs south–north               |
| Avenida        | Av / Av.            | major thoroughfare                |
| Avenida Calle  | Av. Cll / AC         | avenue along a calle axis         |
| Avenida Carrera| Av. Cra / AK         | avenue along a carrera axis       |
| Diagonal       | Dg / Diag.           | oblique to calles                 |
| Transversal    | Tv / Trans.          | oblique to carreras               |
| Circular       | —                    | ring road (Medellín)              |
| Autopista      | Autop.               | motorway (Autopista Norte/Sur)    |
| Vía            | —                    | way                               |

`Avenida Carrera` / `Avenida Calle` are multiword and are listed first so they beat the bare
`Avenida`. The designator can carry a letter: `Carrera 43A`, `Diagonal 25G`, `Calle 10 Sur`.

---

## 3. House number & secondary unit

- **Number** = the whole `# generatriz-placa` composite (see §1), e.g. `8-60`, `93-40`,
  `95A-55`, `18 Sur-135`. Marker `#`/`No.`/`Nro.`/`N°` is stripped.
- **Secondary unit** (after the number, comma-separated): Apartamento (Apto), Piso, Torre,
  Oficina (Of), Local, Interior (Int), Bloque (Bl), Casa. e.g. `..., Oficina 201`,
  `..., Apto 1201`, `..., Torre 2`, `..., Local 145`.
- **Interior / Bloque / Torre / Manzana** can also form part of a full internal chain in
  conjunto/urbanización addresses ("... Interior 5 Apartamento 302"); only the first unit is
  modelled (a documented limitation).

---

## 4. Código Postal

- **6 digits** (NNNNNN), introduced by 4-72 in **2011**: `110221` (Bogotá Chapinero),
  `050001` (Medellín). First 2 digits = departamento, next digits = municipio/zone.
- **Low adoption — usually OMITTED** in everyday and business addresses; the `#` nomenclature
  is self-locating, so the code is optional here.
- Placement: on the UPU S42 line the code is written on its own line; in this parser it is
  captured **BEFORE the city** (optional). When a code IS present, an optional drop-prefix
  consumes ONE preceding **barrio/localidad** segment (e.g. "..., Chapinero, 110221 Bogotá" →
  barrio Chapinero dropped, city Bogotá).
- Leading zeros are significant → keep as a string.

---

## 5. Departamento (state)

- **32 departamentos + Bogotá D.C.** (a Capital District that is not part of any
  departamento). Common: Cundinamarca, Antioquia, Valle del Cauca, Atlántico, Santander,
  Bolívar, Norte de Santander, Nariño, Boyacá, Caldas, Risaralda, Quindío, Magdalena,
  Córdoba, Cauca, Tolima, Huila, Cesar, Meta, Sucre, La Guajira, etc.
- Written after the city: `Medellín, Antioquia`. Mapped/normalised via `regionMap`
  (accents restored: `Bolivar`→`Bolívar`, `Narino`→`Nariño`). `D.C.` / `Bogotá D. C.` →
  `Bogotá D.C.`. Often OMITTED for well-known capitals ("..., Bogotá" alone).

---

## 6. Accents, ñ and barrio

- Names carry diacritics: `Medellín`, `Bogotá`, `Cúcuta`, `Ibagué`, `Montería`, `Nariño`,
  `Boyacá`, `Bolívar`. Unicode-aware.
- **Barrio / localidad** (Chapinero, La Candelaria, El Poblado, Chicó) is a real routing hint
  written between the vía and the city; this parser drops it (via the CP drop-prefix) only
  when a postcode follows — see failure mode 8.

---

## 7. Country variants & PO box

- Country: `Colombia`, `COL`, `CO`.
- **Apartado Aéreo** (historic air-mail PO box): `Apartado Aéreo 12345`. Also `A.A.`.

---

## 8. Failure modes to test

1. **The "#" block** — "Calle 100 # 8-60" — `street=100`, `number=8-60`; the `#`/`No.` marker
   is required and stripped, so the composite is the number, never the designator.
2. **No space around `#`** — "Carrera 13 #93-40" — the marker abuts the digits.
3. **Letter in generatriz/placa** — "Diagonal 25G # 95A-55", "Carrera 6 # 16A-20" — letters
   kept in both the designator and the number.
4. **`No.` / `Nro.` marker instead of `#`** — "Avenida El Dorado No. 68-61".
5. **Named vía** — "Avenida El Dorado ...", "Avenida Caracas # 53-30" — designator is a name,
   not a number; still splits at the marker.
6. **Multiword type "Avenida Carrera / Avenida Calle"** — "Avenida Carrera 30 # 45-03" —
   `type=Avenida Carrera`, `street=30`.
7. **Cardinal in the number** — "Carrera 43A # 18 Sur-135", "Calle 10 Sur # 50-42" — the
   `Sur`/`Este`/`Norte` binds to the correct part.
8. **Barrio drop (with CP) vs no-CP limitation** — "..., Chapinero, 110221 Bogotá" drops the
   barrio; but a barrio with NO following postcode ("..., La Candelaria, Bogotá") is NOT
   dropped (it would be taken as the city). Documented limitation — samples avoid it.
9. **Secondary unit** — "..., Oficina 201", "..., Apto 1201", "..., Torre 2", "..., Local 145".
10. **Abbreviated types** — "Cra.", "Cl.", "Kra", "Dg.", "Tv." — verbatim.
11. **Apartado Aéreo PO box** — "Apartado Aéreo 12345, Medellín, Antioquia".
12. **Country present** — "..., Medellín, Antioquia, Colombia".
13. **Accent-final city (DOCUMENTED LIMITATION)** — `Bogotá` ("á"), `Ibagué` ("é"),
    `Montería`/`Itagüí` parse correctly field-wise, but the library's token-preservation
    invariant locates boundaries with ASCII `\b`, which fails at a trailing non-ASCII vowel
    when no postcode cuts before the city. Such samples carry a 6-digit CP (which provides a
    clean boundary) or are marked `__skip`. Non-accent-final cities (Medellín, Cali,
    Barranquilla, Bucaramanga, …) are unaffected.
14. **`Bogotá D.C.`** — "..., 110221 Bogotá D.C." — `D.C.` is captured in the region slot and
    canonicalised to `Bogotá D.C.` (city `Bogotá`).

---

## Sources
- 4-72 / Servicios Postales Nacionales — Código Postal Nacional (6-digit, 2011);
  codigopostal.gov.co usage.
- Wikipedia — "Nomenclatura urbana" (grid model; Calle/Carrera/Avenida/Diagonal/Transversal,
  generatriz + placa; origin Bogotá 1886).
- Portafolio — "Nomenclatura urbana: cómo ubicarse y cómo leer las direcciones en Colombia".
- Archivo de Bogotá — "Nomenclatura de las calles"; Pulzo — meaning of the last number in a
  Bogotá address; Lupap — finding addresses in Colombia.
- DANE/IGAC nomenclatura standards; libpostal (OSM CO house_number tagging as the composite).
- Native business-address usage (Bogotá / Medellín / Cali corpora) for type abbreviations
  (Cra./Cl./Kra/Dg./Tv.) and Apartado Aéreo.
