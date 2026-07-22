# Irish (Republic of Ireland) Address Format — Research for a Street-Address Parser

Scope: parsing/normalizing real-world Republic of Ireland (IE / Éire) postal
addresses. Sources: An Post addressing norms, Eircode.ie / Autoaddress, Google
libaddressinput (`data/IE`), libpostal, OpenStreetMap `addr:*`, UPU S42.

---

## 1. Canonical field order (like the UK: postcode LAST)

Irish addresses read **smallest unit → largest unit → postcode last**, closely
mirroring the UK layout. The Eircode always comes **last** (after the
town/county), unlike US ZIP which follows the state on the same line.

Canonical single-line order:

```
[sec-unit] [NUMBER] [STREET NAME + TYPE], [TOWN / POSTAL DISTRICT], [COUNTY], [EIRCODE]
```

Examples:

```
10 Grafton Street, Dublin 2, D02 VK65
Apt 5, 12 Pearse Street, Dublin 2, D02 X285
Rose Cottage, Blarney, Co. Cork, T23 YK44
14 Main Street, Midleton, Co. Cork          (no Eircode — very common historically)
```

Key structural facts:

- **House NUMBER comes first**, then street name, then trailing street type
  ("10 Grafton Street" = number `10`, street `Grafton`, type `Street`). This is
  the opposite of France/Germany-ordered but SAME as UK/US.
- **Town / locality** follows the street, usually on its own line.
- **County** (when present) follows the town: `Co. Cork`, `Co. Galway`.
- **Eircode is LAST**, after everything else. Treat it exactly like a UK
  postcode for ordering purposes.
- Multi-line real mail typically puts each of name / street / town / county /
  Eircode on its own line; when flattened to one line they are comma-separated.

Map county (or Dublin postal district when you want to keep it out of `city`)
into the parser's **`state`** slot, since IE has no US-style state. Recommended:
put the **town or Dublin postal district in `city`** ("Dublin 2"), and the
**`Co. X` county in `state`**. Eircode → `postal_code`.

---

## 2. Eircode — the postcode (often ABSENT)

Introduced in 2015. **7 characters, two parts separated by a space:**

- **Routing key** (3 chars): 1 letter + 2 chars. In practice `LETTER DIGIT DIGIT`
  (e.g. `A65`, `D02`, `T23`, `V94`), with ONE special exception **`D6W`**
  (Dublin 6W — letter, digit, then the literal letter `W`).
- **Unique identifier** (4 chars): 4 alphanumeric characters drawn from the
  Eircode alphabet.

**Alphabet:** letters `I` and `O` are **never used** (to avoid confusion with
1 / 0); the digit `0` and digit `1` ARE used. Allowed letters:
`A C D E F H K N P R T V W X Y`. Digits `0-9`.

Presentation: two upper-case groups separated by a single space — `A65 F4E2`,
`D02 VK65`, `T23 YK44`. Storage: often stored as 7 chars with no space
(`A65F4E2`), but the canonical display form has the space after the routing key.

### Authoritative regex

Loose / structural (recommended for a parser — accepts any well-formed code,
including the `D6W` shape, case-insensitive):

```
^[AC-FHKNPRTV-Y][0-9]{2}\s?[0-9AC-FHKNPRTV-Y]{4}$
```

To also admit the single `D6W` routing key (letter-digit-`W`):

```
^(?:[AC-FHKNPRTV-Y][0-9]{2}|D6W)\s?[0-9AC-FHKNPRTV-Y]{4}$
```

Strict (validates only the 139 real routing keys) — Autoaddress published
pattern, must be run case-insensitive:

```
\b(?:(a(4[125s]|6[37]|7[5s]|[8b][1-6s]|9[12468b])|c1[5s]|d([0o][1-9sb]|1[0-8osb]|2[024o]|6w)|e(2[15s]|3[24]|4[15s]|[5s]3|91)|f(12|2[368b]|3[15s]|4[25s]|[5s][26]|9[1-4])|h(1[2468b]|23|[5s][34]|6[25s]|[79]1)|k(3[246]|4[5s]|[5s]6|67|7[8b])|n(3[79]|[49]1)|p(1[247]|2[45s]|3[126]|4[37]|[5s][16]|6[17]|7[25s]|[8b][15s])|r(14|21|3[25s]|4[25s]|[5s][16]|9[35s])|t(12|23|34|4[5s]|[5s]6)|v(1[45s]|23|3[15s]|42|9[2-5s])|w(12|23|34|91)|x(3[5s]|42|91)|y(14|2[15s]|3[45s]))\s?[abcdefhknoprtsvwxy\d]{4})\b
```

### IMPORTANT: many Irish addresses have NO postcode

Eircode adoption is partial and it is **not mandatory** for domestic mail. A very
large fraction of real-world addresses (especially older records, rural
addresses identified by townland/landmark, and pre-2015 data) have **no
Eircode**. A parser MUST treat `postal_code` as optional/nullable.

### Dublin postal districts (pre-Eircode, still in heavy use)

Dublin uses old **postal district numbers**: "Dublin 1" … "Dublin 24", written
as `Dublin 2` or abbreviated `D2` / zero-padded `D02`. Each maps 1:1 to an
Eircode routing key of the same number: `Dublin 2 → D02`, `Dublin 22 → D22`,
and the odd one **`Dublin 6W → D6W`** (Terenure/Templeogue). Odd numbers are
generally north of the Liffey, even numbers south.

Districts: D01 D02 D03 D04 D05 D06 **D6W** D07 D08 D09 D10 D11 D12 D13 D14 D15
D16 D17 D18 D20 D22 D24 (note gaps: no D19/D21/D23).

A token like "Dublin 2" is a **postal district acting as the town/locality** —
keep it in `city` (`"Dublin 2"`), not `postal_code`. The Eircode (`D02 VK65`),
if present, is separate and goes in `postal_code`.

---

## 3. Street types (trailing suffix, English)

Irish streets carry a trailing type word (same position as UK). Common types:

| Type       | Common abbrev(s) |
|------------|------------------|
| Street     | St, St.          |
| Road       | Rd, Rd.          |
| Avenue     | Ave, Ave., Av    |
| Lane       | Ln               |
| Close      | Cl               |
| Drive      | Dr               |
| Court      | Ct               |
| Place      | Pl               |
| Terrace    | Ter, Terr        |
| Row        | —                |
| Park       | Pk               |
| Green      | —                |
| Grove      | Gr               |
| Crescent   | Cres             |
| Quay       | —                |
| Mall       | —                |
| Square     | Sq               |
| Walk       | —                |
| Hill       | —                |
| Rise       | —                |
| Way        | —                |
| Gardens    | Gdns             |
| Heights    | Hts              |
| Villas     | —                |
| Downs / Dale / Wood / View / Vale / Meadows / Manor / Lawn / Grange | — |

Notes:
- `Quay`, `Mall`, `Green`, `Row`, `Hill`, `Walk` frequently appear with NO
  number (e.g. "Eyre Square, Galway", "Custom House Quay, Dublin 1").
- **Irish-language (Gaeilge) types** appear, especially in Gaeltacht areas and
  some estate names: `Bóthar` (Road), `Sráid` (Street), `Ascaill` (Avenue),
  `Plás` (Place), `Cúirt` (Court), `Páirc` (Park), `Baile` (town/homestead).
  In Irish, the type may come FIRST ("Bóthar na Trá") — a parser tuned to
  trailing English types will misparse these; treat as edge cases.
- Some "types" are also whole street names with no generic suffix
  ("Coolock", "The Coombe", "Patrick Street" where Patrick is a saint name).
- Multi-word street names before the type: "Lower Baggot Street",
  "Upper O'Connell Street", "North Circular Road", "Saint Stephen's Green".

---

## 4. House number / building identifier

- Plain number: `10`, `147`.
- Number + alpha suffix: `10A`, `27B`, `1C` → split into `number` + a
  `civic_number_suffix` (`10A` → number `10`, suffix `A`).
- Number ranges: `10-12 Dame Street` (rare).
- **Named houses / buildings instead of a number** — very common, especially
  rural: `Rose Cottage`, `Lissadell House`, `Sea View`, `Ard na Gréine`,
  `The Bungalow`, `Riverside`. Here there is NO numeric `number`; the whole
  building name occupies the street/first line.
- `The` prefix names: `The Old Rectory`, `The Mill`.
- Sub-units (put in `sec_unit_type` / `sec_unit_num`):
  - `Apt` / `Apartment` → `Apt 5`, `Apartment 5`
  - `Flat` → `Flat 2`
  - `Unit` (commercial) → `Unit 4`
  - Sub-unit typically **precedes** the number/street: "Apt 5, 12 Pearse Street".

---

## 5. Town / locality / county / district

- **Town / locality** → `city`. Can be multi-word: `Dún Laoghaire`,
  `Dun Laoghaire`, `Ballsbridge`, `Carrick-on-Shannon`, `Newbridge`,
  `Portlaoise`, `Ballincollig`. May contain fadas (á é í ó ú) and hyphens.
- **Dublin postal district** ("Dublin 2") also lives in `city`.
- **County** → `state`. Written `Co. Cork`, `Co. Galway`, `County Kildare`,
  sometimes bare `Cork`. 26 counties in the Republic. Historically the town +
  county alone (no street number, no Eircode) fully identified a rural address:
  "Kilmurry, Co. Cork".
- Dublin addresses usually do NOT carry `Co. Dublin` when a postal district is
  present; rural Co. Dublin (e.g. Lusk, Rush) may.
- **Townland**: rural addresses may have a townland name as the locality line
  (no street at all): "Ballyvolane, Fermoy, Co. Cork".

---

## 6. Country variants

`Ireland`, `Éire` / `Eire`, `IE` (ISO-3166 alpha-2), `IRL` (alpha-3, used by
An Post / UPU on international mail), `Republic of Ireland`. Normalize all → `IE`.
Watch out: "Ireland" must NOT be confused with "Northern Ireland" (which is UK,
uses BT-prefixed UK postcodes) — a `BT` postcode signals the address is NOT ROI.

---

## 7. Prior work

- **Eircode / An Post**: authoritative postcode structure and display rules.
- **Google libaddressinput** `data/IE`: format string roughly
  `%N%n%O%n%A%n%D%n%C%n%E`, i.e. name / org / address lines / dependent locality
  / town(city) / Eircode. `E` = Eircode as the postcode field; no `state` region
  data — counties are free text, confirming county → `state` is a pragmatic map.
- **libpostal**: statistical parser; tags Irish house numbers, road, city,
  postcode. Struggles with Dublin postal districts (`Dublin 2` may tag as
  city_district vs city) and with named-house addresses lacking a number.
- **OpenStreetMap**: `addr:housenumber`, `addr:street`, `addr:city`,
  `addr:postcode` (Eircode), plus `addr:county`. Good source of real
  street/town/Eircode combos.

---

## 8. Failure modes (things a naive parser gets wrong)

1. **Eircode placed last, mistaken for part of the town** — parser expecting
   `city + postcode` on one line (UK-style) or `state + zip` (US-style) may
   attach `D02 VK65` to the wrong field. Eircode is a distinct trailing token.
2. **"Dublin 2" / "D02" postal district treated as a postcode** — it's a
   locality (`city`), not the Eircode. Conversely "D02 VK65" IS the Eircode.
   The number after "Dublin" is the district, not a house number.
3. **Missing postcode** — huge fraction of addresses have NO Eircode; parser
   must not force `postal_code` and must not grab the county or a house number
   to fill it.
4. **Named houses with no number** — "Rose Cottage, Blarney, Co. Cork":
   there is no numeric `number`; a parser that requires a leading integer fails
   or mis-slots the house name.
5. **`Apt 5` / `Flat 2` sub-unit PREFIX** — sub-unit comes before the street
   ("Apt 5, 12 Pearse Street"); parser must not read `5` as the house number or
   `5 12` as a range.
6. **County `Co. Cork` / `County Kildare`** — the `Co.` abbreviation and the
   bare county name must map to `state`, not be swallowed into `city` or read as
   a street ("Co." is not a street type).
7. **Trailing street type abbreviations** — `St`, `Rd`, `Ave` must be expanded /
   recognized as the type and split from the street name; "Main St" → street
   `Main`, type `St`. Beware `St` also meaning "Saint" in a name
   ("St Patrick's Street" → the leading `St`=Saint is part of the NAME, the
   trailing `Street` is the type).
8. **Multi-word town names** — `Dún Laoghaire`, `Carrick-on-Shannon`,
   `Newtownmountkennedy` — must be kept whole in `city`; hyphens and fadas must
   survive; not split into street + town.
9. **Multi-word / directional street names** — "Lower Baggot Street",
   "North Circular Road", "Saint Stephen's Green" (Green is the type here, but
   the whole thing is often referenced as one name).
10. **`D6W` routing key** — the one Eircode routing key with a trailing letter
    (`D6W XY00`); a `[A-Z][0-9]{2}` regex rejects it.
11. **Apostrophes in names** — "O'Connell Street", "O'Brien's Place" — tokenizers
    that split on apostrophes corrupt the street name.
12. **Number + suffix** — "10A O'Connell Street" → number `10`, suffix `A`,
    street `O'Connell`, type `Street`; must not read `10A` as street or drop `A`.
13. **Irish-language addresses** — "Bóthar na Trá, An Spidéal, Co. na Gaillimhe":
    type-first ordering and Irish county forms defeat trailing-type parsers.
14. **Streets/plazas with no house number** — "Eyre Square, Galway",
    "Custom House Quay, Dublin 1" — valid address, empty `number`.
