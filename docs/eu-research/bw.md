# Botswana (BW) Street Address Research

Research for the config-driven EU/Intl address parser. Focus: BotswanaPost
addressing, the plot/stand number, the ABSENCE of postcodes, English street
types, and the dominant PO Box / Private Bag forms.

---

## 1. Canonical address order

English-speaking, GB-style **number first, then (optionally) street name +
trailing type**, then a suburb/ward, then the town. There is **no postcode**.

```
[Addressee]
[Plot/Number] [Street] [Type]      <- Plot 50371, Nelson Mandela Drive
[Suburb / Ward]                    <- Fairgrounds
[City / Town]                      <- Gaborone
BOTSWANA
```

Single-line / comma-joined forms used by parsers:

```
Plot 50371, Fairgrounds, Gaborone
Plot 774, Nelson Mandela Drive, Gaborone
5 Queens Road, Gaborone
P O Box 1234, Gaborone
```

The **plot (stand) number** — "Plot NNNNN" — is the primary physical identifier;
many properties have only a plot number and a ward/suburb, with no named street.
"Stand NNNN" is a less common synonym.

---

## 2. Postcode

- **NONE.** Botswana has never operated a postal-code system. BotswanaPost routes
  on town + PO Box; UPU S42 BW template and Google libaddressinput have no
  postcode field; multiple address-format guides confirm "postcodes are not used
  in Botswana".
- Consequence for parsing: the postcode slot is a never-match sentinel; the
  after-city grammar falls through to its postcode-absent branch ("..., Town").

---

## 3. Street types (suffix, English)

Trailing English suffix, GB-style: `Road, Street, Avenue, Drive, Lane, Close,
Crescent, Boulevard, Way, Terrace, Mall, Circle, Rise, Walk, Row, Highway`.
Abbreviations: `Rd, St, Ave, Dr, Cres, Blvd, Hwy`. "The Mall" is Gaborone's
central pedestrian mall (type "Mall"). A large share of plots are **type-less**
(the ward/suburb sits where a street would), so type must be nullable.

---

## 4. House / plot number variants

- **Plot / Stand**: `Plot 50371`, `Stand 4521`. The "Plot"/"Stand" marker is
  retained inside the `number` field so no source token is lost.
- Plain integer, number-first: `5 Queens Road` -> number `5`.
- **Number + letter**: `1A`, `23B` -> `civic_number_suffix`.
- **Range**: `10-12`.
- **PO Box / Private Bag** (dominant): `P O Box 1234`, `P.O. Box 405`,
  `Private Bag 0057`, `Private Bag BR 129`, `Private Bag F317`. These replace the
  thoroughfare and are the majority of Botswana mailing addresses.

---

## 5. Secondary (sub-building) units

`Unit`, `Flat`, `Apartment`/`Apt`, `Suite`, `Office`, `Floor`, `Room`, `Block`,
`Shop`. They lead the address ("Unit 5, Plot 128, ...", "Shop 12, Plot 8890,
...").

---

## 6. Suburb / ward, town, region, country

- **Suburb / ward** — Fairgrounds, Broadhurst, Gaborone West, Phakalane, The
  Village, Extension 9/12, Block 6/8/10, Mogoditshane, Tlokweng. Written between
  the plot and the town. With a single `city` slot, a bare "Plot, Ward, Town"
  chain keeps the LAST locality (town) and drops the leading ward(s).
- **Town / city** — Gaborone, Francistown, Maun, Lobatse, Serowe, Kanye,
  Molepolole, Mahalapye, Palapye, Jwaneng, Ghanzi, Kasane, Selebi-Phikwe.
- **District** (South-East, Kgatleng, Central, ...): essentially never written on
  mail; `state` is not modelled (county slot disabled).
- Country: `Botswana`, `BWA`, `BW`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: BotswanaPost; UPU S42 BW template (bwaEn.pdf); Smarty / PostGrid /
GeoPostcodes BW guides; Umbrex "How to address a letter to Botswana"; Google
libaddressinput (`BW`: no postcode).

1. **No postcode.** A schema that requires a postcode leaves it null; a grammar
   that expects a trailing numeric code must not invent one or mis-read a plot
   number as a code.
2. **Plot-only, no thoroughfare.** `Plot 50664, Gaborone` / `Stand 4521,
   Francistown` — with no street or ward between the plot and the town, the town
   would be taken as the street name. Documented `__skip`.
3. **"Plot" marker.** `Plot 50371` — the "Plot"/"Stand" word is not a street
   token; kept in `number` to stay lossless (dropping it would trip the
   token-preservation guard).
4. **Ward written where a street sits.** `Plot 50371, Fairgrounds, Gaborone` —
   "Fairgrounds" is a ward, not a street, but has no slot of its own; it lands in
   `street` (untyped).
5. **Multi-locality chain.** `Plot 22045, Phase 2, Gaborone West, Gaborone` —
   three localities, one slot: first -> street, middle dropped, last -> town.
6. **Type-less plots.** Many addresses have no street type; type must be
   nullable.
7. **PO Box / Private Bag dominance.** `Private Bag BR 129` / `Private Bag F317`
   — the letter-prefixed bag number breaks a digits-only box pattern.
8. **Multi-word town.** `Selebi-Phikwe` (hyphen), `Maun`, `Francistown` — a
   one-token town capture can truncate a hyphenated/spaced name.
9. **"Mall" collision.** "The Mall" is a street type, but "Riverwalk Mall" is a
   building; "Mall" is kept a street type (not a building keyword) so "10 The
   Mall" parses as number + street "The" + type "Mall".
10. **Building name lead.** `Tshomarelo House, Plot 774, Khama Crescent,
    Gaborone` — the building leads; it must not be read as the plot line.
11. **District looks like a second locality.** "South-East" (district) after the
    town would tempt a county grab; the county slot is disabled.

---

## 8. Field-mapping decisions

- `number` — plot/stand ("Plot 50371") or leading integer; range kept; glued
  letter -> `civic_number_suffix`.
- `street` — name without the trailing type (or a ward when no street exists).
- `type` — trailing English suffix; null for type-less plots.
- `sec_unit_type`/`sec_unit_num` — Unit/Flat/Shop/Office + value.
- `city` — the routing town (last locality before the country); leading ward(s)
  dropped.
- `state` — null (districts not modelled).
- `postal_code` — always null (Botswana has no postcodes).
- `country` — `BW`.

---

## Sources

- BotswanaPost — https://www.botspost.co.bw/
- UPU S42 BW addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/bwaEn.pdf
- Smarty BW format examples — https://www.smarty.com/global-address-formatting/botswana-address-format-examples
- PostGrid BW address format — https://www.postgrid.com/global-address-format/botswana-address-format/
- GeoPostcodes BW — https://www.geopostcodes.com/country/botswana/address-format/
- Umbrex "How to address a letter to Botswana" — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-botswana/
