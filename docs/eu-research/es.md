# Spanish (ES) Street-Address Format — Research Notes

Research for a TypeScript / XRegExp street-address parser/normalizer. Sources: Correos
(Spanish post) norms, UPU S42 Spain, libpostal (OpenStreetMap-trained), Google
libaddressinput, INE (Instituto Nacional de Estadística), Experian/Precisely data guides,
USPS Pub 28 App H, and native-usage forums (WordReference, Barcelona Metropolitan).

---

## 1. Canonical order

Spain writes the **street type + name FIRST**, then the **house number AFTER the name**,
usually separated by a **comma**. This is the opposite of US/UK order.

```
Calle de Alcalá, 42          <- vía (type + name), comma, NUMBER
28014 Madrid                 <- CP (5 digits) + municipio, on the next line
España
```

General template (Correos / UPU):

```
[Título/Empresa]
[Tipo de vía] [Nombre de la vía], [Número][, escalera][, piso][, puerta]
[Código Postal] [Localidad] [(Provincia)]
[País]
```

Key facts:
- **Number follows the name** and is normally preceded by a comma: `Calle Mayor, 10`.
- A **"número" marker** may appear before the digits: `nº`, `n.º`, `núm.`, `num.`, `Nº`.
  e.g. `Calle Mayor, nº 10` or `Calle Mayor núm. 10`.
- Secondary units (escalera / piso / puerta) come **after the number**, comma-separated:
  `Calle Mayor, 10, 3.º B`.
- The **postal code precedes the municipio** on the last address line: `28014 Madrid`
  (never a comma between CP and city; CP is always to the LEFT of the city).
- For small towns the **province** is appended in parentheses after the city:
  `Alcalá de Henares (Madrid)`.
- Country line: `España` / `Spain` / `ES`.

---

## 2. Street types (tipos de vía) and abbreviations

Type is at the **START** of the line. Castilian (Spanish) forms + the most common
official abbreviations (Correos / INE callejero):

| Full type       | Common abbrev.              | Meaning                    |
|-----------------|-----------------------------|----------------------------|
| Calle           | C/, C., Cl, Cle, Call.      | street (most common)       |
| Avenida         | Avda., Avda, Av., Avd.      | avenue                     |
| Plaza           | Pza., Pl., Plza., Pza       | square                     |
| Paseo           | Po, P.º, Pº, Ps., Pso.      | promenade/boulevard walk   |
| Ronda           | Rda., Rda                   | ring road                  |
| Camino          | Cno., Cmno., Cª             | path/lane                  |
| Carretera       | Ctra., Crta., Ctra          | highway/road               |
| Travesía        | Trav., Trva., Tvs.          | cross-street               |
| Vía             | (Vía)                       | way                        |
| Gran Vía        | G.V., Gran Vía              | grand avenue (multiword!)  |
| Rambla          | Rbla., Rambla               | boulevard (esp. Catalonia) |
| Glorieta        | Gta., Glta.                 | roundabout/circus          |
| Cuesta          | Cta., Cuesta                | slope                      |
| Bulevar         | Blvr., Bulev.               | boulevard                  |
| Callejón        | Cjón., Callej.              | alley                      |
| Pasaje          | Psje., Pje., Pasaje         | passage                    |
| Costanilla      | Cta./Costan.                | small slope                |
| Vereda          | Vda./Ver.                   | small path                 |
| Sector / Urb.   | Urb. (urbanización)         | housing estate             |
| Polígono        | Pol. Ind. (poligono ind.)   | industrial estate          |
| Barrio          | Bº, Bo.                     | neighborhood               |
| Partida / Pda.  | Pda.                        | rural land parcel (Levante)|
| Lugar           | Lg., Lugar                  | hamlet/place               |
| Autovía         | A-, Autov.                  | motorway                   |

**Regional / co-official language variants** (these appear verbatim in the region and
libpostal/OSM treat the regional form as default there):

| Castilian | Catalan/Valencian | Galician | Basque (euskera)     |
|-----------|-------------------|----------|----------------------|
| Calle     | Carrer (C/)       | Rúa (R/) | Kalea / Kale         |
| Avenida   | Avinguda (Avda.)  | Avenida  | Etorbidea (Etorb.)   |
| Plaza     | Plaça (Pl.)       | Praza    | Plaza / Enparantza   |
| Paseo     | Passeig (Pg.)     | Paseo    | Ibilbidea            |
| Ronda     | Ronda             | Ronda    | Ingurabidea          |
| Camino    | Camí              | Camiño   | Bidea                |
| Carretera | Carretera         | Estrada  | Errepidea            |
| Travesía  | Travessera/Travessia| Travesía| —                   |
| Rambla    | Rambla            | —        | —                    |

Notes:
- Catalan names very often keep the article: **"Carrer de la Marina"**, **"Passeig de
  Gràcia"**, **"Avinguda Diagonal"** (Diagonal has no particle). In Basque the type is a
  **suffix**: `Gran Via Kalea`, `Ledesma Kalea` — the type word comes AFTER the name.
- The particle between type and name (`de`, `de la`, `del`, `de los`, `de las`, Catalan
  `de`, `de la`, `dels`) is lowercase and belongs to the NAME, not the type.

---

## 3. House number, floor & door (the tricky part)

`Calle Mayor, 10, 3.º B` = **número 10**, **piso (floor) 3.º**, **puerta (door) B**.

### Number
- Digits after the name/comma: `42`, `401`, `10`.
- May carry a **letter suffix (bis/duplicado)**: `12 bis`, `5 dup.`, `27 A`.
- Ranges: `12-14`, `12-16`.
- **`s/n` = "sin número"** (no number). Also written `S/N`, `s.n.`. Parser should map
  number → null and keep an `s/n` flag/note.
- **`km`** markers on carreteras: `Ctra. de Burgos, km 12` — number is a kilometer point.

### Floor (piso / planta)
Ordinal, usually with masculine ordinal indicator `º` (or `.º`), sometimes feminine `ª`:
- `1.º`, `2.º`, `3º`, `4.ª`, `1ª` — the floor number.
- Word floors: **`Bajo` (Bjo., Bj)** = ground floor; **`Entresuelo` (Entlo., Ent.)** =
  mezzanine; **`Principal` (Pral.)** = principal floor (often above entresuelo);
  **`Sótano` (Sót.)** = basement; **`Ático` (Át.)** = top/attic floor;
  **`Sobreático`** = above the ático.
- May be prefixed by `Piso` or `Pl.`/`Planta`: `Piso 3`, `Pl. 3`.

### Door (puerta)
Comes after the floor:
- A **letter**: `A`, `B`, `C`, `D`.
- A **number**: `1`, `2`, `3`.
- **`Izquierda` (Izda., Izq., Iz.)** = left; **`Derecha` (Dcha., Dch., Der.)** = right;
  **`Centro` (Ctro.)** = center. e.g. `4.º Izda.`, `2.º Dcha.`.
- May be prefixed `Pta.`/`Puerta`: `Pta. B`.

### Combined floor+door notations (very common, many spellings)
- `3.º B`, `3º B`, `3 B`  (floor 3, door B)
- `3.º 2.ª`, `3º 2ª`      (floor 3, door 2)
- `3-2`, `3º-2ª`, `3r-2a` (Catalan `3r` = tercer, `2a` = segona) — floor 3, door 2
- `Bajo A`, `Bajo Dcha.`, `Ático 1`, `Entresuelo 2ª`
- Catalan ordinals: `1r` (primer), `2n` (segon), `3r` (tercer), `4t` (quart), `5è`.

### Escalera (staircase) & portal & bloque
Multi-building complexes add these BEFORE the floor:
- **`Escalera` (Esc.)**: `Esc. 2`, `Esc. Izda.`.
- **`Portal` (Prt.)**: `Portal 3`.
- **`Bloque` (Blq.)**: `Bloque 4`.
- Full chain: `Calle X, 10, Esc. 2, 3.º B` = number 10, escalera 2, floor 3, door B.

### Suggested field mapping for this parser
- `number` = civic house number (null for s/n).
- `civic_number_suffix` = bis/dup/letter tied to the number (`bis`, `A`).
- `sec_unit_type` / `sec_unit_num`: fold floor+door into one secondary unit. Practical
  rule: `sec_unit_type = "Piso"` and `sec_unit_num = "3.º B"` (keep floor+door together),
  or use `"Puerta"` when only a door is present, `"Escalera"` for standalone Esc.
  This keeps the tricky ordinal+letter string intact rather than losing information.

---

## 4. Código Postal (CP)

- **Exactly 5 digits**, always. Regex: `\b\d{5}\b` (fielded); with anchor for a line:
  `^(0[1-9]|[1-4]\d|5[0-2])\d{3}$` to constrain the province prefix to 01–52.
- **First 2 digits = province** (01–52). 01=Álava/Araba, 08=Barcelona, 28=Madrid,
  46=Valencia, 41=Sevilla, 15=A Coruña, 07=Illes Balears, 48=Bizkaia, 50=Zaragoza,
  51=Ceuta, 52=Melilla.
- **Leading zeros are significant** and must be preserved: `08001 Barcelona`,
  `01001 Vitoria-Gasteiz`, `07001 Palma`. Parsing as an integer would corrupt them.
- Last 3 digits = distribution/route within the province.
- CP is written **before** the city, no comma: `28014 Madrid`.
- Pitfall: a `\d{5}` can collide with a 5-digit house number (rare) — anchor CP to the
  city line / require it to be followed by a locality token.

---

## 5. Provinces (50) + 2 autonomous cities

- 50 provincias, numbered 01–50 **alphabetically as of implementation** (with later
  exceptions where names changed to the co-official language or to the autonomous-community
  name, e.g. Guipúzcoa→Gipuzkoa (20), Santander→Cantabria (39), Logroño→La Rioja (26),
  Oviedo→Asturias (33), Orense→Ourense (32), Gerona→Girona (17), Lérida→Lleida (25)).
- **Ceuta (51)** and **Melilla (52)** are autonomous cities, added later (were in Cádiz/
  Málaga areas until 1995).
- In addresses the province is often appended in **parentheses after the town**, for towns
  that are not the well-known capital: `Alcalá de Henares (Madrid)`, `Getxo (Bizkaia)`,
  `Sitges (Barcelona)`, `Torrejón de Ardoz (Madrid)`. Put this in `state`.
- Some provinces share their name with the capital (Madrid, Barcelona, Sevilla, Valencia,
  Murcia, Zaragoza, ...). When city == province the parenthetical is usually omitted.
- Bilingual province names: A Coruña/La Coruña, Illes Balears/Islas Baleares, Araba/Álava,
  Bizkaia/Vizcaya, Gipuzkoa/Guipúzcoa, Girona/Gerona, Lleida/Lérida, Ourense/Orense.

---

## 6. Accents, ñ, and lowercase particles

- Spanish/Catalan/Galician/Basque street names carry diacritics: `á é í ó ú ñ ü ï à è ò ç`.
  e.g. `Alcalá`, `Bailén`, `Gràcia`, `Muntaner`, `Cardenal Cisneros`, `Nuñez`, `A Coruña`,
  `Vitoria-Gasteiz`. The parser must be Unicode-aware (XRegExp `\p{L}`, NOT `[A-Za-z]`).
- **Lowercase connective particles** in names must be preserved as part of the name:
  `de`, `de la`, `del`, `de los`, `de las`, `y`, `e`; Catalan `de`, `de la`, `dels`, `i`.
  e.g. street name in "Calle de Alcalá" is `de Alcalá`; in "Avenida de la Constitución"
  it's `de la Constitución`.
- Case: types and names are typically title-cased except the particles. Normalizer should
  not upcase particles.
- `º`/`ª` (ordinal indicators U+00BA / U+00AA) vs the degree sign `°` (U+00B0) and
  superscript `o`/`a` — real data mixes all of these; normalize them.

---

## 7. Country variants

`España`, `Spain`, `ESPAÑA`, `ES`, `ESP`. All map to country `ES`.

---

## 8. Prior-work notes & concrete failure modes

Prior art: **libpostal** trains on OSM and handles ES + regional languages via
dictionary disambiguation (expands `C/`→`Calle`, `Avda`→`Avenida`); it is
order-agnostic and tags tokens (house_number, road, unit, postcode, city, state).
**Google libaddressinput** uses format string `%O%n%N%n%A%n%Z %C%n%D` for ES — note `%Z`
(zip) precedes `%C` (city), and `%D` (dependent locality / province) — required fields
are A (street), Z (zip), C (city). **INE callejero** enumerates official tipos de vía.
A regex parser must therefore: read type-first, find the number after the name/comma,
detect the CP+city line, and pull an optional parenthetical province.

### Failure modes to test
1. **`s/n`** — "Calle del Prado, s/n" — number must be null, not "s".
2. **`C/` and other abbreviations** — "C/ Mayor, 10", "Avda. de América, 5", "Pza. España, 1"
   — must recognize abbreviated types, incl. `C.` with a period and `Po`/`P.º`.
3. **Floor + door "3.º B"** — "Calle Mayor, 10, 3.º B" — must split number 10 vs unit 3.º B,
   not treat "10, 3" as a number range.
4. **Comma before number** — "Calle de Alcalá, 42" — the comma separates name from number;
   must not treat "42" as a separate city/locality token.
5. **Catalan "Carrer de …"** — "Carrer de Mallorca, 401" — type=Carrer, name keeps "de";
   plus `Passeig de Gràcia`, `Avinguda Diagonal`, `Plaça de Catalunya`, `Rambla`.
6. **`nº` / `núm.` marker** — "Calle Mayor, nº 10" / "Calle Mayor núm. 10" — strip the
   marker, keep the digits.
7. **Province in parentheses** — "…, 28806 Alcalá de Henares (Madrid)" — province → state,
   city → "Alcalá de Henares", not "Alcalá de Henares (Madrid)".
8. **"Gran Vía" multiword type** — "Gran Vía, 28" — the type is two words; "Vía" alone is
   also a type; don't parse "Gran" as the name.
9. **Ordinal floors "1ª/2º/3r/2a"** — masculine/feminine and Catalan ordinals; `3r-2a`,
   `3º 2ª` mean floor+door, `Bajo`, `Ático`, `Entresuelo`, `Principal` are word-floors.
10. **Accents & ñ** — "Calle de Bailén", "Carrer de Muntaner", "A Coruña", "Vitoria-Gasteiz"
    — Unicode letters and hyphens in city/street; don't strip or mis-split on them.
11. **Leading-zero CP** — "08001 Barcelona", "01001 Vitoria-Gasteiz" — keep as string.
12. **CP-before-city (no comma)** — "28014 Madrid" — 5 digits then city; don't attach the
    CP to the number or read the city as part of the street.
13. **Basque suffix type** — "Ledesma Kalea, 10, Bilbao" — the type word ("Kalea") is a
    SUFFIX after the name, opposite of Castilian order.
14. **`km` on carretera** — "Ctra. de Burgos, km 12" — number is a km point, not a civic no.
15. **Escalera/portal chain** — "Calle X, 10, Esc. 2, 3.º B" — multiple comma segments
    before the CP line; only the first numeric is the civic number.
16. **`bis`/`duplicado` suffix** — "Calle Ferraz, 12 bis" — suffix belongs to the number.
17. **City == province** (Madrid, Barcelona) — no parenthetical; don't hallucinate a state.
18. **Multiword city names & hyphens** — "San Sebastián de los Reyes", "Vitoria-Gasteiz",
    "Palma de Mallorca", "L'Hospitalet de Llobregat" (apostrophe!).

---

## Sources
- Correos / Spain postal addressing overviews: housinganywhere.com, eurosender.com,
  postgrid.com, geopostcodes.com, smarty.com global address formatting (Spain).
- UPU S42 Spain postal addressing PDF (upu.int).
- libpostal (openvenues/libpostal, Mapzen "Inside Libpostal"); OpenStreetMap ES tagging.
- Google libaddressinput (chromium address metadata, ES format `%Z %C`).
- INE callejero tipos de vía.
- USPS Publication 28, Appendix H (Spanish street prefixes).
- Postal codes in Spain (Wikipedia); INE province codes 01–52.
- Native usage: WordReference forums (piso/puerta/escalera), Barcelona Metropolitan
  "Q&A: Addresses", Rick Steves forum (3r-2a notation), Experian/Precisely ESP data guides.
