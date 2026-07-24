# Nigeria (NG) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking West
Africa. Postal operator: Nigerian Postal Service (NIPOST). Number-first,
trailing English street types, 6-digit postcode (usually omitted), state often
written with a trailing "State" word, PO Box / PMB extremely common.

---

## 1. Canonical address order

Nigeria writes the **house NUMBER first, then the street name + trailing English
type**, then an **area / district**, then the **city / town**, then (optionally)
the **6-digit postcode** and the **state**:

```
[Addressee]
[Number] [Street] [Type]        <- 12 Adeola Odeku Street
[Area / district]               <- Victoria Island
[City] [Postcode]               <- Lagos 101241
[State]                         <- Lagos State
[Country]                       <- Nigeria / NGA
```

Single-line / comma-joined form used by parsers:

```
12 Adeola Odeku Street, Victoria Island, Lagos 101241, Lagos State
9 Aminu Kano Crescent, Wuse II, Abuja 900288, FCT
6 Aba Road, Port Harcourt 500272, Rivers State
```

So: **number first, suffix type, postcode after the city (after-city)**, then an
optional state. Structurally the same skeleton as GB/ZA, but with a 6-digit
postcode that is very frequently omitted and a state that is usually spelled with
the word "State".

Note: the postcode sits on the **same segment as the city** ("Lagos 101241"),
space-separated, and the state follows **after** the postcode
("101241, Lagos State"). This is the opposite order to the generic after-city
grammar (which expects `city, county, postcode`), so the trailing state is
modelled inside the postcode pattern (a helper `ng_state` group folded to
`state`), exactly like the India PIN-then-state form.

---

## 2. Postcode

- **6 digits**, NIPOST format `999999` = district (first 3) + delivery (last 3):
  Lagos VI `101241`, Ikeja `100271`, Abuja `900288`, Port Harcourt `500272`,
  Kano `700213`.
- Position: after the city, space-separated ("Lagos 101241"); then any state.
- **Very frequently omitted.** NIPOST introduced postcodes in the 2000s and
  real-world adoption is low; most addresses carry no code at all. The grammar
  must treat the postcode as optional (the after-city grammar's postcode-absent
  branch handles this).
- Capture as `(?<postal_code>\d{6})`. No letters, no separator.

---

## 3. Street types (suffix, English)

Type is a trailing **suffix** (GB-style): `Adeola Odeku Street`, `Bourdillon
Road`, `Allen Avenue`, `Aminu Kano Crescent`, `Freedom Way`, `Yudi Close`.

Types: `Street, Road, Avenue, Close, Crescent, Boulevard, Drive, Lane, Way,
Court, Place, Terrace, Walk, Gardens, Circle, Ring, Loop, Link, Rise, Grove,
Row, Park, Mews, Hill, Highway, Expressway`. Abbreviations `St, Rd, Ave, Dr, Cl,
Cres, Blvd, Hwy`. "Way", "Close", "Crescent" and "Avenue" are especially common
in Nigeria (Lagos/Abuja estates). Type must be allowed null (some roads are bare
or numbered, e.g. estate "1st Avenue").

---

## 4. House / building number variants

- Plain integer, number FIRST: `12`, `9`, `48`.
- **Number + letter suffix**: `12A`, `7B` -> `civic_number_suffix`.
- **Ranges**: `5-7`. Block/plot forms `1/3`, `A3/11` (block-plot) occur.
- Optional "No." / "#" lead-in.
- **Secondary unit leads**: `Flat 3, 15 Toyin Street`, `Suite 4, ...`,
  `Block 5, ...`, `Shop 12, ...`.
- **Building name leads**: `Churchgate Tower, 30 Afribank Street, ...`,
  `Nicon Plaza, 2 Ahmadu Bello Way, ...`.
- **PO Box / PMB**: `P.O. Box 1234, Marina, Lagos`, `PMB 12345, Garki, Abuja`.
  These replace the thoroughfare and are a dominant non-physical form.

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `Suite`, `Block`, `Floor`,
`Room`, `Shop`, `Unit`, `House`. Forms: `Flat 3, 15 Toyin Street`,
`Suite 4, 22 Awolowo Road`.

---

## 6. Area, city, state, country

- **Area / district** — Lagos: Victoria Island, Ikoyi, Lekki, Ikeja, Surulere,
  Yaba, Apapa, Marina, GRA; Abuja/FCT: Wuse, Wuse II, Maitama, Garki, Asokoro,
  Jabi; Port Harcourt: GRA, Trans Amadi. Written between the street and the city.
  Because the engine has a single `city` slot, the comma chain is kept together
  (cityAllowsCommas) and the leading area(s) are dropped in postNormalize,
  keeping the last locality (the city) — the same technique as ZA/IN.
- **City / town** — `Lagos`, `Abuja`, `Port Harcourt`, `Kano`, `Ibadan`,
  `Benin City`, `Enugu`, `Kaduna`, `Abeokuta`. Multi-word: `Port Harcourt`,
  `Benin City`.
- **State (-> state)** — the 36 states + FCT. Usually written **with the word
  "State"** (`Lagos State`, `Rivers State`) or as `FCT` / `Federal Capital
  Territory` for Abuja. Output is a 2-letter code (LA, RI, KN, ED, FC, ...).
- Country: `Nigeria`, `Federal Republic of Nigeria`, `NGA`, `NG`.

**Critical modelling note.** A bare state name (`Lagos`, `Kano`, `Rivers`,
`Kaduna`, `Enugu`) is IDENTICAL to a major city name. Matching a bare name as the
region would eat the routing city ("Victoria Island, **Lagos**" -> city="Victoria
Island", state="Lagos"). We therefore recognise only the EXPLICIT region forms —
`<Name> State`, `FCT`, `Federal Capital Territory` — as the state/county, leaving
a bare `Lagos` to be kept as the city. See failure mode 1.

---

## 7. Prior work & known failure modes (>=8)

Prior art: NIPOST postcode scheme; UPU S42 NG template; Smarty / PostGrid /
GeoPostcodes NG address guides; UPU postcode note (ngaEn.pdf). Note that Smarty's
own normalized examples ("Owu St 29 Port Harcourt 500001 Rivers") place the
number AFTER the street — a database artefact; real Nigerian usage is
number-FIRST ("29 Owu Street"), which this config models.

1. **Bare state name == city name.** `..., Lagos` (bare) is the city, not the
   state; `..., Lagos State` is the state. A region matcher that accepts bare
   names mis-splits the city. Modelled by requiring the explicit `<Name> State`
   / FCT forms. A region written as a bare name that duplicates the city (e.g.
   "Kaduna, Kaduna") is a documented limitation — the bare trailing token is
   treated as the city, not a second state.

2. **Postcode almost always omitted.** Low NIPOST adoption; the grammar must not
   require the 6-digit code. The after-city postcode-absent branch handles it.

3. **Postcode-then-state ordering.** `... Lagos 101241, Lagos State` — the state
   follows the postcode, the reverse of the generic `city, county, postcode`
   order. Handled by a helper state group inside the postcode pattern.

4. **Area + city, one slot.** `Victoria Island, Lagos` — two localities precede
   the state/postcode; the leading area is dropped, the city kept.

5. **PO Box / PMB dominance.** `P.O. Box 1234, Marina, Lagos`, `PMB 12345,
   Garki, Abuja` — no thoroughfare; the box/PMB number replaces the street.

6. **Multi-word city.** `Port Harcourt`, `Benin City` — a one-token city capture
   truncates them.

7. **Number letter suffix / range / block-plot.** `12A`, `5-7`, `A3/11`,
   `1/3` — block-plot forms with a leading letter ("A3/11") are only partially
   modelled (the leading letter block is a documented gap).

8. **Building name before number.** `Churchgate Tower, 30 Afribank Street` —
   building leads; must not be read as the number line. Building keywords are
   kept disjoint from street types.

9. **Type-less / numbered estate roads.** `1st Avenue`, bare `Allen` — type may
   be null; a compass/ordinal estate road is not split.

10. **State with vs without "State".** `Ogun State` vs bare `Ogun`; the config
    only auto-detects the "State"-suffixed / FCT forms (see #1).

11. **All-caps international form.** Mail to Nigeria often written in CAPS with
    `NIGERIA` last; matching is case-insensitive.

12. **GRA / Phase / estate qualifiers.** `Ikeja GRA`, `Lekki Phase 1` — an area
    with a trailing qualifier is dropped as part of the area chain.

---

## 8. Field-mapping decisions

- `number` — leading integer / range, optional glued letter suffix.
- `civic_number_suffix` — trailing letter of the number.
- `street` — name without the trailing suffix type; `type` — the suffix (null if
  absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`Suite`/`Block`/`Shop` + value, or a
  `PO Box`/`PMB` + number.
- `city` — the routing city/town (last locality before postcode/state); leading
  areas dropped.
- `state` — 2-letter code, only when an explicit `<Name> State` / FCT form is
  present.
- `postal_code` — 6-digit, after the city; usually absent.
- `country` — `NG`.

---

## Sources

- NIPOST (Nigerian Postal Service) — https://www.nipost.gov.ng/
- UPU S42 NG addressing / postcode note — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/ngaEn.pdf
- Smarty NG address format examples — https://www.smarty.com/global-address-formatting/nigeria-address-format-examples
- PostGrid NG address format — https://www.postgrid.com/global-address-format/nigeria-address-format/
- GeoPostcodes NG — https://www.geopostcodes.com/country/nigeria/address-validation/
- Umbrex "How to address a letter to Nigeria" — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-nigeria/
