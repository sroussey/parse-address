# Finnish (Suomi) Postal Address Research — for a street-address parser/normalizer

Finland is officially **bilingual (Finnish / Swedish)**. Both language forms of a
street name and city are valid on mail, so a parser must handle both. This document
summarizes real Finnish addressing conventions (Posti norms, Google
libaddressinput, libpostal / OpenStreetMap practice) and the decisions the parser
should make.

Sources consulted:
- Posti / UPU Finland addressing guidelines (upu.int Finland S42 profile)
- Google libaddressinput data for `FI` (`fmt`, `zip`, `require`)
- endereco.de "Addresses in Finland: What Online Retailers Need to Know"
- Kotus / Kielitoimisto (Institute for the Languages of Finland) street-name guidance
- Smarty / PostGrid / Informatica Finland address-format guides
- OpenStreetMap / libpostal (openvenues) international parsing model

---

## 1. Canonical order

Finnish addresses run **top-down** (recipient first) and, on the geographic line,
**street name FIRST, then house number**, then a separate postal line with the
**5-digit postal code BEFORE the city**:

```
[Recipient / Organisation]
Street-name HouseNumber [stairwell] [apartment]
FI-PPPPP CITY
[COUNTRY]
```

Google libaddressinput `FI` format string confirms this:

```
fmt      = "%O%n%N%n%A%nFI-%Z %C"
require  = "ACZ"              (street address, city, zip required)
zip      = "\d{5}"
postprefix = "FI-"
```

Meaning: Organisation, Name, **A**ddress line (street + number + unit), then
`FI-` + 5-digit **Z**ip + space + **C**ity. The number comes **AFTER** the street
name — the opposite of the fused suffix, which is glued to the *front* of the name.

Examples (all real street/postal/city combinations):
- `Mannerheimintie 12, 00100 Helsinki`
- `Aleksanterinkatu 52, 00100 Helsinki`   (Stockmann department store)
- `Hämeenkatu 14, 33100 Tampere`
- `Yliopistonkatu 29, 20100 Turku`
- `Kirkkokatu 3, 90100 Oulu`

On envelopes the city is usually UPPERCASE (`00100 HELSINKI`); the parser should
be case-insensitive and normalize/preserve as configured. The `FI-` prefix on the
postal code is optional domestically and typical on inbound international mail.

---

## 2. Street types are FUSED as a suffix (single token)

This is the single most important Finnish-specific rule. The generic street-type
word is **written as a suffix glued directly onto the specific name**, producing
ONE token (no space): `Mannerheimin` + `tie` → **`Mannerheimintie`**;
`Aleksanterin` + `katu` → **`Aleksanterinkatu`**. There is **no space** before the
type, unlike English "Main Street".

Because the specific part is usually in the **genitive case** (`-n` ending:
Mannerheimi**n**, Aleksanteri**n**, Yliopisto**n**), stripping the fused type
leaves a genitive stem. For parsing we keep the stem verbatim (name WITHOUT the
fused type) and record the type separately.

### Common FINNISH fused suffixes
| Suffix | Meaning | Example |
|--------|---------|---------|
| `-katu` | street (urban) | Aleksanterin**katu**, Hämeen**katu** |
| `-tie` | road | Mannerheimin**tie**, Kuusikko**tie** |
| `-kuja` | alley / lane | Piha**kuja**, Kalevan**kuja** |
| `-polku` | path | Metsä**polku**, Kaunis**polku** |
| `-kaari` | arc / crescent | Kaupin**kaari**, Meri**kaari** |
| `-tori` | square / market | Kauppa**tori**, Kolmen sepän… (see multiword) |
| `-aukio` | (open) square | Rautatientori / Narinkka**… -aukio** |
| `-ranta` | shore / bank | Etelä**ranta**, Hakaniemen**ranta** |
| `-väylä` | (main) route/channel | Itä**väylä**, Turun**väylä** |
| `-raitti` | lane / avenue (W. Finland) | Kirkko**raitti** |
| `-rinne` | slope | Untamon**rinne** |
| `-penger` | terrace / embankment | Siltasaaren**penger** |
| `-linja` | line (Kallio grid) | Toinen **linja**, Neljäs **linja** |
| `-kaarre` | bend | (rare) |
| `-piha` | courtyard | Ison**piha** |
| `-mäki` | hill | Käpylän**mäki**, Ruskea**suo**/… |
| `-laituri` | quay / platform | Makasiini**laituri** |
| `-portti` | gate | Espoon**portti** |
| `-kallio` | rock | (as name element) |
| `-puisto` | park (as street type) | Töölön**… puisto** |
| `-silta` | bridge | Pitkä**silta** |
| `-taival` | way / journey | Museo**taival**? |
| `-katu`/`-tie` dominate real data by a wide margin. |

### Common SWEDISH fused suffixes (bilingual equivalents)
| Suffix | Meaning | Finnish equivalent |
|--------|---------|--------------------|
| `-gatan` | street | -katu |
| `-vägen` | road | -tie |
| `-gränd` | alley | -kuja |
| `-stigen` | path | -polku |
| `-torget` | square | -tori |
| `-stranden` | shore | -ranta |
| `-leden` | route | -väylä |
| `-bågen` | arc | -kaari |
| `-planen` | plaza | -aukio |

The Swedish definite suffix (`-gatan`, `-vägen`) is likewise fused. Example
bilingual pair: `Mannerheimintie` (fi) = `Mannerheimvägen` (sv);
`Aleksanterinkatu` (fi) = `Alexandersgatan` (sv). City: `Helsinki` = `Helsingfors`.

### Splitting rule for the parser
- If the token ends in a known fused suffix, split into `street` (stem) + `type`
  (the lowercase glued suffix, e.g. `"tie"`, `"katu"`, `"gatan"`).
- If it does **not** end in a recognizable suffix, keep the whole token as
  `street` and set `type = null`. Never over-split (e.g. `Kaisaniemenranta` →
  `Kaisaniemen` + `ranta`, but a genuine name like `Aleksis Kiven katu` where the
  type is a *separate* word must be treated as a multiword name — see §7).

---

## 3. House number and civic-number suffix

The house number follows the street token (with a space):

- Plain integer: `12`, `1`, `160`.
- Number + lowercase letter (subdivided lot): `11a`, `6b`. The lowercase letter
  is a **civic-number suffix** glued or near-glued to the number
  (`Kalliotie 11a` → number `11`, civic suffix `a`). Sometimes written with a
  space (`11 a`) — ambiguous with a stairwell letter; lowercase → civic suffix,
  UPPERCASE → stairwell (see §4).
- Range: `12-14`, `6–8` (en dash also seen). Keep as `12-14` in `number`.
- Slash / block form: `160/10` (house 160, plot/entrance 10) — mostly rural.

---

## 4. Secondary units — stairwell + apartment

Finnish apartment buildings use **stairwell (rappu) + apartment** notation placed
AFTER the house number:

```
Street HouseNumber  [Stairwell letter]  [Apartment number]
Mannerheimintie 12    A                   5
```

Two dominant forms:

1. **Stairwell letter + apartment number**: `Mäkelänkatu 25 B 13`
   → house 25, stairwell **B**, apartment **13**. UPPERCASE letter + space +
   number. The pair `B 13` (or `A 5`) is the secondary unit.

2. **Apartment only, no stairwell** (`as.` = *asunto* = apartment): buildings
   with one entrance write `Koekatu 5 as. 4` or `... as 4` → house 5, apartment 4.

Terms / abbreviations:
- `as.` / `as` — **asunto** (apartment). The canonical apartment marker.
- Bare UPPERCASE letter (`A`, `B`, `C`…) — **rappu / porras** (stairwell/staircase).
- `rappu` / `rp.` — stairwell, occasionally spelled out.
- `bostad` / `bst` / `bst.` — Swedish "apartment/dwelling" (Swedish-language mail).
- `krs` — *kerros* (floor) — sometimes appended; not a unit id.

For this parser's schema we normalize the secondary-unit **type** to `"as."`
(apartment) whenever a unit is present, and put the raw identifier — including any
stairwell letter — in `sec_unit_num`:
- `Mannerheimintie 12 A 5` → number `12`, `sec_unit_type "as."`, `sec_unit_num "A 5"`.
- `Koekatu 5 as. 4`        → number `5`,  `sec_unit_type "as."`, `sec_unit_num "4"`.
- `Mäkelänkatu 25 B 13`    → number `25`, `sec_unit_type "as."`, `sec_unit_num "B 13"`.

(A stricter model could split stairwell vs. apartment into two fields; here we keep
them together in `sec_unit_num` per the task schema.)

---

## 5. Postal code

- **Exactly 5 digits**, regex `\d{5}` (libaddressinput `zip = "\d{5}"`).
- **Precedes the city**, separated by a space: `00100 Helsinki`.
- Optional international prefix `FI-` (or older `FIN-`): `FI-00100 HELSINKI`.
- First two digits = region, roughly increasing south→north:
  `00/01/02` Helsinki metro (Helsinki/Vantaa/Espoo), `20` Turku, `33` Tampere,
  `40` Jyväskylä, `70` Kuopio, `90` Oulu, `96` Rovaniemi, `99` far north.
  City centres typically end in `100` (`00100`, `33100`, `90100`).
- Parser: match `(FI-?|FIN-)?(\d{5})\s+(City)` on the last geographic line; strip
  the `FI-`/`FIN-` prefix and store the 5 digits.

Real code/city combos used in the samples: `00100 Helsinki`, `00170 Helsinki`,
`00120 Helsinki`, `00530 Helsinki`, `02100 Espoo`, `02150 Espoo`, `01300 Vantaa`,
`33100 Tampere`, `33200 Tampere`, `20100 Turku`, `20500 Turku`, `90100 Oulu`,
`40100 Jyväskylä`, `70100 Kuopio`, `15110 Lahti`, `53100 Lappeenranta`,
`65100 Vaasa`, `96200 Rovaniemi`, `48100 Kotka`, `28100 Pori`.

---

## 6. City, Finnish characters, bilingual names

- City names carry Finnish diacritics **ä, ö, å** (`Jyväskylä`, `Järvenpää`,
  `Mäntsälä`, `Ähtäri`, `Åland`/`Ahvenanmaa`). The parser MUST treat `ä`, `ö`, `å`
  as ordinary letters (UTF-8), never fold them to `a`/`o` for matching in a way
  that loses information, and must not choke on them in street names either
  (`Hämeenkatu`, `Töölönkatu`, `Yrjönkatu`, `Näkinkuja`).
- **Bilingual city pairs** (Finnish / Swedish), both valid:
  `Helsinki / Helsingfors`, `Turku / Åbo`, `Espoo / Esbo`, `Vaasa / Vasa`,
  `Porvoo / Borgå`, `Vantaa / Vanda`, `Kokkola / Karleby`. In bilingual
  municipalities the street name may appear in either language too.
- Åland Islands (`Maarianhamina / Mariehamn`, postal `22100`) are Swedish-speaking.

---

## 7. Multiword / unsplittable names

Some street names are **multi-word** and the generic word is a *separate* token,
not fused:
- `Aleksis Kiven katu` — named after author Aleksis Kivi; "katu" is separate.
- `Kolmen sepän aukio`, `Kaisaniemen puistotie`, `Iso Roobertinkatu`
  (here `-katu` *is* fused to `Roobertin`, but `Iso` is a leading adjective).
- Numbered Kallio grid: `Toinen linja`, `Neljäs linja` — ordinal word + `linja`.

Guidance: only split when the type is genuinely a fused suffix on the final token.
For `Aleksis Kiven katu` treat the whole `Aleksis Kiven katu` as the street name
with `type = null` (or `"katu"` with street `Aleksis Kiven` if a space-separated
type list is supported). When unsure, prefer keeping the whole name and
`type = null` — losing a split is safer than a wrong split.

---

## 8. Country variants

`Suomi` (fi), `Finland` (sv/en), `FI` (ISO-3166-1 alpha-2), `FIN` (alpha-3, legacy).
Normalize all to `FI`.

---

## 9. Prior work

- **Google libaddressinput (`FI`)**: `fmt "%O%n%N%n%A%nFI-%Z %C"`, `zip "\d{5}"`,
  `require "ACZ"`, `postprefix "FI-"`. Authoritative for field order + zip regex.
- **libpostal (openvenues)**: statistical parser trained on OSM; tags tokens as
  `road`, `house_number`, `unit`, `postcode`, `city`. Handles fused Finnish types
  reasonably but does NOT split the fused suffix from the stem (returns
  `Mannerheimintie` whole as `road`) — our normalizer adds the split.
- **OpenStreetMap**: `addr:street` holds the fused name (`Mannerheimintie`),
  `addr:housenumber` the number (may include letter `12a`), `addr:unit` the
  stairwell/apartment, `addr:postcode` 5 digits, `addr:city`. Bilingual data via
  `name:fi` / `name:sv`.
- **Posti / UPU S42**: recipient → street+number → `FI-`postcode + city → country.

---

## 10. Failure modes (things a naive parser gets wrong)

1. **Fused street type**: naive splitters expect "Name Type" with a space and
   fail to strip `-katu` / `-tie` from `Aleksanterinkatu`, `Mannerheimintie`.
   Must recognize the glued suffix set.
2. **5-digit postal code before city**: parsers tuned for US ZIP-after-city or
   4-digit European codes mis-handle `00100 Helsinki`. Need `\d{5}` *preceding*
   the city on the last line.
3. **`A 5` = stairwell + apartment**: the UPPERCASE letter is NOT part of the
   house number and NOT a state; `Mannerheimintie 12 A 5` must yield number `12`,
   unit `A 5`, not number `12A` or city "5".
4. **`as. 5` apartment marker**: `as.`/`as` (asunto) must be read as the apartment
   keyword, not as a street token or truncated word.
5. **`ä`, `ö`, `å` handling**: byte-level or ASCII-only parsers corrupt
   `Jyväskylä`, `Töölönkatu`, `Åbo`. Full UTF-8 required; naive lowercasing or
   accent-folding can merge distinct names.
6. **Number ranges & letter suffixes**: `12-14`, `6–8`, `11a` — must not be split
   at the dash into two addresses, and the trailing lowercase letter is a
   civic-number suffix, not a stairwell (contrast UPPERCASE `A`).
7. **Long single-token compound names**: `Vanhanlinnantie`,
   `Pohjoisesplanadi`, `Kolmirinteentie`, `Ratapihankatu` — one long token that
   still splits into stem + fused type; length/rarity must not defeat the split.
8. **Bilingual streets & cities**: `-gatan`/`-vägen` (Swedish fused types) and
   pairs like `Helsinki/Helsingfors`, `Turku/Åbo` — the parser must accept either
   language and not assume Finnish-only suffixes.
9. **Multiword name with separate type**: `Aleksis Kiven katu`, `Toinen linja` —
   the type word stands alone; over-eager suffix stripping produces nonsense
   (`Aleksis Kiven` + `katu` is acceptable; but stripping `linja` off `Toinen`
   leaves an ordinal, so treat whole as name / `type` optional).
10. **`FI-` / `FIN-` postal prefix**: must be stripped before storing the 5-digit
    code; leaving `FI-00100` breaks the `\d{5}` field.
11. **City in UPPERCASE on envelopes**: `00100 HELSINKI` — case-insensitive match
    required; don't treat all-caps as an acronym/organisation.
12. **`krs` (floor) noise**: a trailing `3 krs` is a floor, not an apartment id;
    should not be mistaken for `sec_unit_num`.
