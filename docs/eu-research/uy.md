# Uruguayan (UY) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser (before-city Iberian/LatAm template,
sibling of AR/CL). Sources: Correo Uruguayo (código-postal search + "Documento
postcode_uy" S42 note), Umbrex "How to address a letter to Uruguay", GeoPostcodes
Uruguay, Wikipedia "Correo Uruguayo". See Sources.

---

## 1. Canonical order

Street name **FIRST** (with an optional leading vía type), then the house number
**AFTER** it, then the CP + locality, then the departamento.

```
[Tipo?] [Calle] [número]          <- Av. 18 de Julio 1234
[Piso] [Apto]                     <- Piso 3, Apto 2
[Barrio?]                         <- Pocitos   (dropped)
[CP] [Localidad]                  <- 11100 Montevideo
[Departamento]                    <- Montevideo
URUGUAY
```

Flattened (this config): `Av. 18 de Julio 1234, 11100 Montevideo, Montevideo`.

Note on CP position: Correo Uruguayo's S42 template puts the **CP before the
locality**, but everyday/business mail very commonly writes it **after the city**
("Montevideo 11100", as in the Umbrex example). This config models the
before-city order (the LatAm sibling convention); the trailing-CP form is a
documented limitation (§7).

- **Number follows the name**; the type is often absent (many streets are bare
  names: "Sarandí", "Rincón", "Cerrito"). Several are date/number names
  ("18 de Julio", "8 de Octubre", "25 de Mayo") → digits allowed in the name.
- **Piso + Apartamento** follow ("Piso 3, Apto 2", or a compact ordinal "3°").
- In **Montevideo** the city and the departamento share the name "Montevideo".

---

## 2. Street types (frequently omitted)

| Type       | Abbrev.         | Meaning        |
|------------|-----------------|----------------|
| Avenida    | Av. / Avda.     | avenue         |
| (Calle)    | —               | street (bare)  |
| Bulevar / Boulevard | Bvar. / Blvr. / Bv. | boulevard |
| Rambla     | Rbla.           | waterfront ave |
| Camino     | Cno.            | road           |
| Pasaje     | Pje.            | passage        |
| Ruta       | Rta.            | highway        |
| Continuación | Cont.         | continuation   |
| Diagonal / Peatonal | —      | diagonal / pedestrian |

Particles ("de", "del", "de los") stay with the name ("Rambla República **de**
México", "Pje. **de los** Andes").

---

## 3. Number, piso & apartamento

- **Número** (house number): digits after the name; may carry a `N°`/`Nro.`/`No.`
  marker (use `N°`/`No.` in test corpora; a spelled-out "Nro" is not stripped by
  the token-preservation counter). `s/n` marks a numberless street.
- **Piso** (floor) + **Apartamento** (Apto/Ap): "Piso 3", "Apto 2", or a compact
  ordinal "3°" whose implied type is Piso. Also Oficina (Of.), Local, Unidad.
- Field mapping: `number` = número; `sec_unit_type`/`sec_unit_num` = piso/apto.

---

## 4. Código Postal (CP)

- **5 numeric digits** ("11000", "20100", "70000"). Introduced by Correo
  Uruguayo. The **first two digits encode the departamento**, except codes
  beginning with **1** = Montevideo; trailing zeros = the department capital /
  Montevideo as a whole (Montevideo 11000, Punta del Este 20100, Colonia del
  Sacramento 70000).
- Written **before** the locality in this config. Kept as a string (leading
  zeros matter). CP-to-city examples in the samples are illustrative of the
  documented 5-digit shape, not an exhaustive mapping.

---

## 5. Departamento (19)

Artigas, Canelones, Cerro Largo, Colonia, Durazno, Flores, Florida, Lavalleja,
Maldonado, Montevideo, Paysandú, Río Negro, Rivera, Rocha, Salto, San José,
Soriano, Tacuarembó, Treinta y Tres. Written as a **name after the locality**
(comma-separated), or omitted for Montevideo. `regionMap` folds the accent-free
spellings ("Paysandu"→"Paysandú", "Rio Negro"→"Río Negro", "San Jose"→"San José",
"Tacuarembo"→"Tacuarembó").

---

## 6. Accents, PO box, country

- Names carry `á é í ó ú ñ ü`: "Sarandí", "Yaguarón", "Ituzaingó", "España".
- **Casilla de Correo** (C.C.) = PO box: "Casilla de Correo 1234". Normalised to
  "Casilla de Correo".
- Country: `Uruguay`, `República Oriental del Uruguay`, `URY`, `UY`.

---

## 7. Failure modes to test

1. **Bare name (no type)** — "Sarandí 690, 11000 Montevideo, Montevideo" — no type
   word; the number binds.
2. **Date/number street name** — "Av. 18 de Julio 1234" / "8 de Octubre 2543" —
   digits in the name; the trailing number is still the house number.
3. **CP before city vs department repeat** — "…, 11100 Montevideo, Montevideo" —
   city and departamento both "Montevideo"; do not collapse them.
4. **Barrio drop** — "Rambla República de México 5535, Pocitos, 11400 Montevideo,
   Montevideo" — the barrio "Pocitos" is consumed by the CP drop-prefix (fires
   only when a CP follows) and not emitted.
5. **Compact ordinal floor** — "…, 3°, 11100 Montevideo" — one unit, default type
   "Piso".
6. **Explicit Piso/Apto/Of/Local** — "Bulevar Artigas 1560, Piso 3, …".
7. **Trailing-CP everyday form** — "Av. 18 de Julio 1234, Montevideo 11100" — CP
   written after the city; NOT captured by the before-city grammar → `__skip`.
8. **Numberless street + plain CP ambiguity** — "Calle 20, 20100 Punta del Este":
   a bare numbered street with no house number collides with the plain 5-digit CP
   (the CP would be read as the house number) → `__skip`. (Numbered streets WITH a
   house number, e.g. "Calle 25 850", parse fine.)
9. **s/n + place-only drop** — "Av. Italia s/n, 11600 Montevideo" is eaten by the
   place-only drop-prefix (a numberless street ending in a letter looks like a
   dropped barrio); s/n parses only when the CP is omitted ("Av. Italia s/n,
   Montevideo, Montevideo").
10. **Casilla de Correo** — PO-box path, no street.
11. **Department omitted** — "…, 11600 Montevideo" (CP "1…" already implies
    Montevideo); do not hallucinate a department.
12. **Accent-normalised department** — "…, Paysandu" → state "Paysandú".

---

## Sources
- Correo Uruguayo — código-postal search (correo.com.uy/codigospostales) and
  "Documento postcode_uy" (S42 method / address position).
- Umbrex — "How to Address an International Letter to Uruguay" (5-digit CP,
  "Avenida 18 de Julio 1234 Montevideo 11100 URUGUAY" example).
- GeoPostcodes — Uruguay ZIP code dataset (first two digits = department; 1x =
  Montevideo).
- Wikipedia — "Correo Uruguayo".
