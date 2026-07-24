# Portuguese (Portugal) Address Format — Research for a Street-Address Parser/Normalizer

Scope: real-world Portuguese addressing as delivered by **CTT – Correios de Portugal**
(the national postal operator). Cross-checked against libpostal's `pt` street-type
dictionary, Google libaddressinput ordering, OpenStreetMap tagging, and multiple
address-format references. Country codes: **Portugal**, **PT**, **PRT** (ISO alpha-3).

---

## 1. Canonical order (the single most important fact)

Portuguese addresses put the **thoroughfare TYPE FIRST, then the NAME, then the house
number** (the door number / *número de porta*). This is the opposite of the
English/US "100 Main St" order.

```
<TYPE> <NAME> <NUMBER>[ <FLOOR/SIDE>], <PPPP-PPP> <LOCALIDADE>
```

Canonical example:

```
Rua Augusta 100, 1100-053 Lisboa
└TYPE┘ └NAME┘ └NUM┘  └postal┘ └city┘
```

Full multi-line CTT-style block:

```
António Silva                (recipient)
Rua Augusta 100, 3º Dto       (thoroughfare + number + floor/side)
1100-053 Lisboa               (postal code + locality)
PORTUGAL                      (country, for international mail)
```

Key ordering facts:
- **Type leads the name.** "Rua Augusta", "Avenida da Liberdade", "Praça do Comércio".
- **Number comes AFTER the name**, sometimes separated by a comma, sometimes just a
  space: "Rua Augusta 100" or "Rua Augusta, 100". A "nº"/"n.º" marker may precede it:
  "Rua Augusta nº 100".
- **Floor/side is a secondary unit** that follows the number, often after a comma or
  dash: "Rua Garrett 50, 3º Esq" or "... 50 - 3º Esq".
- **Postal code precedes the locality** on the same line: "1100-053 Lisboa".
- There is generally **no comma between the postal code and the city** in official CTT
  formatting (though it appears in practice).
- **No state/province** is used in the mailing address. Portugal has *distritos*
  (districts) and *concelhos* (municipalities), but these are NOT part of the postal
  address line — the postal code fully resolves the locality. Keep `state = null`.

---

## 2. Street types (designação de via / tipo de arruamento) — TYPE LEADS

The type is written first. Abbreviations below are drawn from CTT usage and the
libpostal `pt/street_types.txt` dictionary (authoritative variant lists).

| Type (full)   | Meaning                    | Common abbreviations            |
|---------------|----------------------------|---------------------------------|
| **Rua**       | street (by far the most common) | **R.**                     |
| **Avenida**   | avenue                     | **Av.**, Ave, Ava               |
| **Praça**     | square / plaza             | **Pç.**, Pça, Pr., Pc., Praca   |
| **Largo**     | small square               | **Lg.**, L., Lgo.               |
| **Travessa**  | cross-street / lane        | **Tv.**, Trav., Trv.            |
| **Estrada**   | road / highway             | **Estr.**, Est.                 |
| **Alameda**   | boulevard / tree-lined ave | **Al.**                         |
| **Calçada**   | paved (often steep) street | **Cç.**, Cc., Calcada           |
| **Beco**      | alley / cul-de-sac         | **Bc.**, Bco                    |
| **Praceta**   | small square / close       | **Pct.**, Pcta, Pctª            |
| **Rotunda**   | roundabout                 | Rot.                            |
| **Azinhaga**  | narrow country lane        | Az.                             |
| **Caminho**   | path / way                 | Cam., Camno                     |
| **Ladeira**   | slope                      | Lad.                            |
| **Escadas / Escadinhas** | stepped street  | Esc.                            |
| **Jardim**    | garden                     | Jrd.                            |
| **Parque**    | park                       | Pq.                             |
| **Quinta**    | estate / farm              | Qta., Qu.                       |
| **Bairro**    | neighbourhood              | Bº, Br.                         |
| **Lugar**     | hamlet / place             | Lg., Lug.                       |
| **Urbanização** | housing development      | Urb.                            |
| **Zona**      | zone                       | Zn.                             |
| **Via**       | way                        | V.                              |
| **Viaduto**   | viaduct                    | Vd., Vdto                       |
| **Vila**      | villa / small town         | Vl.                             |
| Estrada Nacional | national road (N-roads) | **EN**, E.N.                    |
| Estrada Municipal | municipal road          | EM                              |

### Particles ("de", "da", "do", "dos", "das")
Many names include a genitive particle that is part of the NAME, not the type:
- **Avenida da Liberdade** → type "Avenida", name "da Liberdade"
- **Praça do Comércio** → type "Praça", name "do Comércio"
- **Rua de Santa Catarina** → type "Rua", name "de Santa Catarina"
- **Rua dos Clérigos** → type "Rua", name "dos Clérigos"

**Rule for the parser:** after stripping the leading type token(s), the remaining
tokens — INCLUDING a leading "de/da/do/dos/das" — are the street name. Do NOT drop the
particle. This is a common failure mode.

Note: some types are themselves two words — "Rua Particular", "Estrada Nacional",
"Estrada Municipal", "Avenida Marginal". Treat the multi-word type greedily.

---

## 3. House number + floor/side (the secondary unit)

After the door number, an optional floor and door-side identifier locates the specific
apartment. These are **secondary units** for parsing purposes.

### Door / civic number (número de porta / número de polícia)
- Plain integer: `100`, `245`, `53`.
- May carry an **alpha suffix**: `24B`, `4C`, `10A` (letter glued to the number, no
  space) — a distinct entrance in the same building. Capture as `civic_number_suffix`.
- May be a range: `12-14`.
- Often preceded by a number marker: **nº**, **n.º**, **Nº**, **N.º**, **no.**
  ("Rua Augusta nº 100"). The marker is noise; strip it, keep the digits.

### Floor (andar / piso)
- Ordinals with the masculine ordinal indicator: **1º, 2º, 3º, 4º ...**
  (sometimes feminine **1ª** or with a dot **1.º**, or long form "1.º andar").
- **R/C** = *rés-do-chão* = **ground floor** (also written "Rés-do-chão", "RC", "R/Ch").
- **Cave** / **Cv.** = basement.
- The word **Andar** ("floor") or **Piso** may appear: "3º Andar".
- **Fração / Fracção** (unit/fraction) + a letter is used in condominiums: "Fração B".

### Side / door position (relative to the staircase landing)
- **Dto** / **Dtº** / **Drt.** / **D** = *direito* = **RIGHT**
- **Esq** / **Esqº** / **E** = *esquerdo* = **LEFT**
- **Frt.** / **Ft** / **F** = *frente* = **FRONT / straight ahead**
- For >3 doors per floor, doors are identified by **letters (A, B, C ...)** or numbers
  instead of Esq/Dto: "3º B", "2º A".

### Combined examples (floor + side together)
```
100 1º            → floor 1
100 R/C           → ground floor
100 3º Esq        → 3rd floor, left
100 3º Dto        → 3rd floor, right
245 1A            → number 245, floor 1, door A   (or civic suffix — see note)
53, 2º            → number 53, floor 2
```
For a parser, model floor+side as one secondary-unit value, e.g.
`sec_unit_type = "Andar"`, `sec_unit_num = "3º Esq"`. When only a floor marker like
"R/C" is present, `sec_unit_num = "R/C"`.

Ambiguity note: `1A` immediately after the number can be either a **civic-number
suffix** (entrance A of building 1) OR **floor 1, door A**. Context decides; when glued
directly to the door number treat as civic suffix, when separated by space/comma and
preceded by a floor ordinal treat as floor+door.

---

## 4. Postal code (código postal)

- Format: **PPPP-PPP** — 4 digits, a hyphen, then 3 digits. Total 7 digits.
- Regex: `\d{4}-\d{3}` (anchored: `\b\d{4}-\d{3}\b`).
- Examples: `1100-053`, `1250-096`, `4000-322`, `3000-370`, `9000-039`.
- The **hyphen is mandatory** in canonical form. Some raw inputs omit it ("1100053")
  or space it ("1100 053") — normalize to the hyphenated form.
- Structure: 1st digit = one of 9 postal regions (1 = Greater Lisbon, 2 = Setúbal/Centre-
  South, 3 = Centre/Coimbra, 4 = Porto/North, 5 = Vila Real/Bragança, 6 = interior
  Centre, 7 = Évora/Beja, 8 = Algarve/Faro, 9 = Azores & Madeira). Digits 2-3 =
  distribution centre; digit 4 = 0 for municipal capital; last 3 digits ("CP4-CP3")
  identify a street segment / building / large recipient.
- The postal code is followed by a **designation** locality ("Lisboa", "PORTO",
  "Vila Nova de Gaia") on the same line.

---

## 5. City / locality (localidade) and diacritics

- The locality follows the postal code: "1100-053 Lisboa".
- Localities are frequently **multi-word**: "Vila Nova de Gaia", "Ponte de Lima",
  "Figueira da Foz", "Póvoa de Varzim", "Câmara de Lobos", "Marinha Grande",
  "Vila Real de Santo António", "Oliveira de Azeméis". A parser must NOT assume the
  locality is a single token — everything after the postal code up to the country is
  the locality.
- Portuguese **diacritics** appear throughout street names and localities and MUST be
  preserved (and matched case/diacritic-insensitively when normalizing):
  `ã á à â ç é ê í ó ô õ ú` (e.g. Praça, Estação, São, Conceição, Óbidos, Évora,
  Setúbal, Póvoa, Guimarães, Santo André, Belém, Coração).
- Localities are sometimes written in ALL CAPS on official mail ("LISBOA", "PORTO").

---

## 6. Secondary-unit vocabulary summary

| Token(s)              | Meaning                          | Parse as              |
|-----------------------|----------------------------------|-----------------------|
| nº, n.º, Nº, N.º, no. | number marker (precedes door #)  | strip, keep digits    |
| 1º, 2º, 3º, 1ª, 1.º   | floor ordinal (andar)            | floor                 |
| R/C, RC, Rés-do-chão  | ground floor                     | floor                 |
| Cave, Cv.             | basement                         | floor                 |
| Andar, Piso           | "floor" keyword                  | floor keyword         |
| Esq, Esqº, E          | esquerdo = left                  | side                  |
| Dto, Dtº, Drt., D     | direito = right                  | side                  |
| Frt., Ft, F           | frente = front                   | side                  |
| A, B, C … (after fl.) | door letter                      | door id               |
| Fração, Fracção + ltr | unit / fraction                  | unit                  |
| Lote, Lt.             | plot / lot number                | plot                  |
| Bloco, Bl.            | building block                   | block                 |
| C.P. / Apartado       | post-office box                  | PO box                |

---

## 7. Prior work / reference implementations

- **CTT norms** (`Guia de Normas de Endereçamento`): type-first, number after name,
  PPPP-PPP + localidade, no state line.
- **libpostal** (`openvenues/libpostal`, `resources/dictionaries/pt/street_types.txt`):
  authoritative variant/abbreviation lists used above; parser trained on OSM. Output
  labels: `road`, `house_number`, `unit`, `level`, `postcode`, `city`, `country`.
- **Google libaddressinput** (`data/PT`): format string roughly
  `%O%n%N%n%A%n%Z %C` — organization, name, address (street+number+floor),
  postal `%Z` then city `%C`; no administrative area required. Confirms
  postal-precedes-city and no state.
- **OpenStreetMap**: `addr:street` includes the type ("Rua Augusta"),
  `addr:housenumber`, `addr:floor`, `addr:postcode` (PPPP-PPP), `addr:city`,
  `addr:country=PT`.

---

## 8. Failure modes for a naive parser (8+ concrete traps)

1. **Postal-code dash (PPPP-PPP).** A parser tuned for 5-digit or space-separated
   codes will mis-split "1100-053" on the hyphen or fail to recognize it. Must match
   `\d{4}-\d{3}` as one token and normalize "1100053"/"1100 053" → "1100-053".

2. **Number AFTER the name.** Assuming leading digits (US "100 Main St") breaks on
   "Rua Augusta 100" — the number is at the END of the street part, not the start.

3. **Type leads, so the first token is NOT the name.** "Rua Augusta" → name is
   "Augusta", not "Rua". A parser that treats token 1 as the street name is wrong.

4. **Floor + side "3º Esq".** The ordinal-indicator "º", accented/abbreviated
   "Esq"/"Dto", and the space make this look like extra street tokens or a second
   number. Must be captured as a secondary unit, not folded into street or number.

5. **"R/C" (rés-do-chão).** The slash and the non-numeric floor confuse tokenizers
   that expect a digit for the floor; may be split on "/". Recognize "R/C", "RC",
   "Rés-do-chão" as ground floor.

6. **Abbreviated types with a period: "Av.", "R.", "Pç.", "Tv.".** The trailing dot
   can be eaten by sentence tokenizers or fail an exact "Avenida" match. Normalize
   "Av." → "Avenida", "R." → "Rua", etc. before/after extracting the type.

7. **Accented type "Praça" / "Calçada".** Diacritics in the TYPE itself ("Praça do
   Comércio", "Calçada da Glória") break ASCII-only type dictionaries. Must match
   diacritic-insensitively ("Praca" == "Praça") while preserving the original.

8. **"Rua de …" particle dropping.** Stripping the type AND the following
   "de/da/do/dos/das" loses part of the name: "Avenida da Liberdade" must keep "da
   Liberdade"; "Rua de Santa Catarina" must keep "de Santa Catarina".

9. **"nº" / "n.º" number marker.** "Rua Augusta nº 100" — the marker is not a street
   token and not a digit; strip it but keep 100. Variants: Nº, N.º, no.

10. **Multi-word localities.** "Vila Nova de Gaia", "Ponte de Lima", "Figueira da Foz"
    — a parser that takes only the token after the postal code as the city drops the
    rest. Everything after PPPP-PPP (up to country) is the locality.

11. **Multi-word / two-token types.** "Estrada Nacional 125", "Rua Particular",
    "Avenida Marginal" — the type spans two words; a one-token type match mislabels
    "Nacional"/"Marginal"/"Particular" as the name.

12. **Civic-number alpha suffix "24B", "4C".** Letter glued to the door number is an
    entrance identifier, not a floor/side. Don't split it into a separate unit and
    don't confuse it with "3º B" door letters.

13. **No state / province.** Portuguese mailing addresses have no state line; a schema
    that requires state should leave it null (districts/concelhos are not postal
    components).
