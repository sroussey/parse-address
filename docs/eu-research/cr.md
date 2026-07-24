# Costa Rican (CR) Street-Address Format — Research Notes

Config-driven XRegExp parser (EuCountryConfig, Iberian family). Spanish-language.

---

## 0. Two coexisting systems

Costa Rica is the textbook case of a country with NO working street-number
culture. Two systems coexist:

1. **Descriptive / landmark form** — still the dominant everyday form: a chain of
   distances and directions from a known landmark ("Del parque central, 200
   metros norte y 50 este, casa amarilla"). These are **not modellable** by a
   structured street grammar and are marked `__skip` (11 such samples).
2. **Structured grid form** — promoted by **Correos de Costa Rica**: `Avenida N,
   Calle N, distrito, cantón, provincia, código postal`. This config models (2).

---

## 1. Canonical order (structured form)

```
[Vía tipo] [nombre] , [Calle/Avenida cruce] , [distrito] , [CP] [cantón] , [provincia]
 Avenida Central       Calle 5              Carmen     10101 San José      San José
```

- The primary vía leads: TYPE + name ("Avenida Central", "Avenida 2", "Paseo
  Colón"). Grid names ARE numbers → digits allowed in the name.
- The **cross grid coordinate** ("Calle 5" after an avenida, or "Avenida 2" after
  a calle) is captured as a **secondary unit** (`sec_unit_type` Calle/Avenida,
  `sec_unit_num` the number). Order is interchangeable.
- **distrito** → neighbourhood-level; CONSUMED/DROPPED via the postalPattern
  drop-prefix, which fires only when the 5-digit CP is present.
- **cantón** → `city`; **provincia** (7) → `state`.

## 2. Street types (vía)

Prefix, verbatim: Avenida (Av.), Calle (C.), Paseo ("Paseo Colón"), Boulevard,
Autopista ("Autopista Próspero Fernández"), Carretera, Diagonal, Transversal, Vía.

## 3. Código postal

- **5 digits**: digit 1 = provincia (1 San José, 2 Alajuela, 3 Cartago,
  4 Heredia, 5 Guanacaste, 6 Puntarenas, 7 Limón), digits 2-3 = cantón, digits
  4-5 = distrito. Leading zeros significant → string.
- Officially written on the province line; this model writes it **before the
  cantón** (Iberian family) so the distrito drop can anchor to it. Frequently
  omitted; the descriptive form carries none.

## 4. Provincia (region / state)

7 provincias; the cantón and provincia frequently share a name (cantón San José
in provincia San José; likewise Cartago, Heredia, Alajuela, Limón, Puntarenas).

## 5. Civic number / secondary unit / PO box

- **Civic numbers are essentially unused**; a written one requires a "No."/"#"
  marker (so a bare 5-digit CP after the street is not mis-read as a number).
  "s/n" accepted.
- Interior words (Casa, Apto, Local, Oficina, Piso, Edificio) exist but usually
  ALONGSIDE the cross-calle → such stacked lines are `__skip`.
- **Apartado (Postal)** / **Apdo.** = PO box; the box number is often
  zone-coded ("Apartado 10-1000").

---

## 6. Failure / edge modes tested

1. **Landmark/descriptive form** — "Del parque central, 200 metros norte…",
   "Frente a la iglesia…", "Contiguo al…", "Costado norte del parque…", "…, X
   metros sur", "Del cruce…, 1 km este": all `__skip` (dominant real form).
2. **Cross grid coordinate as unit** — "Avenida Central, Calle 5" → the Calle 5
   is a secondary unit, not a second street; works in either order.
3. **Distrito drop needs a postcode** — with a CP the distrito is dropped and the
   cantón is the city; WITHOUT a CP a three-level (distrito+cantón+provincia)
   line cannot drop the distrito → `__skip`.
4. **Two-level no-postcode** — "…, cantón, provincia" parses (cantón→city); and
   "…, distrito, provincia" maps distrito→city (documented, lossless).
5. **Numbered vía names** — "Avenida 2", "Calle 20": digits inside the name.
6. **Named vías** — "Paseo Colón", "Autopista Próspero Fernández",
   "Boulevard de Rohrmoser".
7. **Cantón == provincia name** — "…, San José, San José", "…, Cartago, Cartago".
8. **Stacked units** — cross-calle + Casa/Oficina, or "s/n" + cross-calle: only
   one secondary token captured → `__skip`.
9. **Bare 5-digit CP after the street** — must be read as postal_code, not as a
   civic number (marker-required number pattern).
10. **Official postcode-LAST place line** — "Carmen, San José, 10101": this model
    writes the CP before the cantón → `__skip`.
11. **Apartado (Apdo.) PO box** — zone-coded box number "10-1000".

---

## Sources
- Correos de Costa Rica — Guía de códigos postales / structured-address campaign
  (provincia-cantón-distrito, 5-digit code = P-CC-DD).
- UPU S42 Costa Rica addressing notes.
- Wikipedia "Códigos postales de Costa Rica" (5 digits: 1 provincia + 2 cantón +
  2 distrito) and "Anexo: Cantones de Costa Rica".
- Numerous logistics/e-commerce guides documenting the persistence of the
  landmark/"200 metros norte" descriptive addressing culture.
- libpostal / OSM Costa Rica tagging; Google libaddressinput CR format.
