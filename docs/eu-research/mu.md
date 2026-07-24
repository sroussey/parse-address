# Mauritius (MU) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking Indian
Ocean island state. Postal operator: Mauritius Post. Number-first, trailing
English street types, a village/town, and a 5-character postcode that is recent
and very often omitted.

---

## 1. Canonical address order

Mauritius writes the **house NUMBER first (often omitted), then the street name +
trailing English type**, then the **village / town**, then the optional
5-character **postcode**:

```
[Addressee]
[Number] [Street] [Type]        <- 25 Royal Road
[Village / Town] [Postcode]     <- Port Louis 11328
[Country]                       <- MAURITIUS
```

Single-line examples:

```
25 Royal Road, Port Louis 11328
Royal Road, Grand Baie
2 Cybercity Avenue, Ebène 72201
```

So: **number first (or none), suffix type, postcode after the town (after-city)**.
"Royal Road" is the near-ubiquitous main road present in essentially every
village, so a road name with no house number is common and must parse.

---

## 2. Postcode

- **5 characters**, introduced 2014: **five digits** for the main island
  (`11328` Port Louis, `74213` Curepipe, `72201` Quatre Bornes / Ebène,
  `71501` Rose Hill), OR **a letter + four digits** for the outer islands —
  `A` = Agaléga, `R` = Rodrigues (`R0402` Port Mathurin).
- Within the code, digit 1 = district, digits 2-3 = Village Council Area,
  digits 4-5 = sub-locality.
- Position: after the village/town, space-separated ("Port Louis 11328").
- **Very often OMITTED** — adoption is low and most everyday addresses carry no
  code. Optional. (An earlier 2002 eight-digit alphanumeric experiment was never
  adopted.)
- Capture as `(?<postal_code>\d{5}|[AaRr]\d{4})`, upper-cased on output.

---

## 3. Street types (suffix, English)

Type is a trailing **suffix**: `Royal Road`, `Sir William Newton Street`,
`Cybercity Avenue`, `Sunset Boulevard`. English is the administrative language,
so types are English even where the name is French ("La Chaussée Street",
"Dr Eugène Laurent Street").

Types: `Road, Street, Avenue, Lane, Close, Crescent, Drive, Boulevard, Way,
Court, Place, Terrace, Highway, Motorway, Circle, Rise, Walk, Row, Square`.
Abbreviations `Rd, St, Ave, Dr, Cres, Blvd, Hwy`. Type may be null.

---

## 4. House / building number variants

- Plain integer, number FIRST: `25`, `12` — or **absent** ("Royal Road,
  Grand Baie").
- **Number + letter suffix**: `25A`.
- **Range**: `10-12`.
- **Secondary unit leads**: `Flat 3, 25 Royal Road`, `Apartment 2B, ...`,
  `House 5, ...`, `Suite 4, ...`.
- **Building name leads**: `Chancery House, 4 Lislet Geoffroy Street`,
  `Ebène Tower, 2 Cybercity Avenue`.
- **PO Box**: `P.O. Box 123, Port Louis`.

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `House`, `Suite`, `Block`,
`Floor`, `Room`, `Shop`, `Unit`.

---

## 6. Village / town, region, country

- **Village / town** — `Port Louis`, `Curepipe`, `Quatre Bornes`, `Vacoas`,
  `Phoenix`, `Rose Hill`, `Beau Bassin`, `Ebène`, `Grand Baie`, `Flic en Flac`,
  `Mahébourg`, `Goodlands`, `Triolet`, `Centre de Flacq`, `Souillac`, `Bambous`,
  `Tamarin`, `Forest Side`, `Floreal`, `Port Mathurin` (Rodrigues). Multi-word
  names (`Port Louis`, `Grand Baie`, `Flic en Flac`, `Centre de Flacq`) are
  common. Usually a SINGLE locality; occasionally an area + town chain
  (`Pereybere, Grand Baie`) where the leading area is dropped.
- **Region** — the 9 districts (Port Louis, Pamplemousses, Rivière du Rempart,
  Flacq, Grand Port, Savanne, Plaines Wilhems, Moka, Rivière Noire) are
  essentially never written in an address; no `state` is modelled. The county
  slot is disabled with a never-match sentinel so the default county pattern
  does not swallow the routing town.
- Country: `Mauritius`, `Republic of Mauritius`, `Maurice`, `MUS`, `MU`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Mauritius Post ("Find your Post Code"); Postal codes in Mauritius
(Wikipedia); UPU S42 MU template (MUS.pdf); Smarty / PostGrid MU guides.

1. **Postcode usually absent.** Low adoption; the grammar must not require the
   5-character code. The after-city postcode-absent branch handles it.

2. **No house number.** `Royal Road, Grand Baie` — a named road with no number
   is common; number must be optional.

3. **Island letter postcode.** `R0402` (Rodrigues), `A0001` (Agaléga) — a
   letter + 4 digits, distinct from the 5-digit mainland form. A digit-only
   postcode pattern would miss them.

4. **"Royal Road" everywhere.** Nearly every village has a Royal Road, so the
   town/village is the disambiguator, not the street; the town must always be
   captured.

5. **Multi-word village/town.** `Port Louis`, `Grand Baie`, `Flic en Flac`,
   `Centre de Flacq`, `Forest Side` — a one-token city capture truncates them.

6. **No region -> default county eats the town.** With no state list the generic
   `city, county` slot would take an "area, town" pair as city=area,
   county=town. Disabled via a never-match county so the whole chain stays in
   `city` for the drop step.

7. **French names, English types.** `La Chaussée Street`, `Dr Eugène Laurent
   Street`, `Celicourt Antelme Street` — accented French names with an English
   trailing type; accents must survive.

8. **Area + town chain.** `Pereybere, Grand Baie`, `Palma, Quatre Bornes` — the
   leading area is dropped, the town kept.

9. **Number letter suffix / range.** `25A`, `10-12`.

10. **Building name before number.** `Chancery House, 4 Lislet Geoffroy Street`
    — building leads.

11. **PO Box.** `P.O. Box 123, Port Louis` — box replaces the thoroughfare.

12. **All-caps international form.** `... PORT LOUIS ... MAURITIUS` — matching is
    case-insensitive.

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading number (+ range/letter), or absent.
- `street` / `type` — name + trailing suffix (type null if absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`Apartment`/... + value, or
  `PO Box` + number.
- `city` — the routing village/town (last locality); leading areas dropped.
- `postal_code` — 5-digit or letter+4-digit, after the town; usually absent.
- `country` — `MU`.

---

## Sources

- Mauritius Post — "Find your Post Code" — https://www.mauritiuspost.mu/find-your-post-code/
- Postal codes in Mauritius (Wikipedia) — https://en.wikipedia.org/wiki/Postal_codes_in_Mauritius
- UPU S42 MU addressing / postcode note (MUS.pdf) — https://youbianku.com/files/upu/MUS.pdf
- Smarty MU address format examples — https://www.smarty.com/global-address-formatting/mauritius-address-format-examples
- PostGrid MU address format — https://www.postgrid.com/global-address-format/mauritius-address-format/
- Umbrex "How to address a letter to Mauritius" — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-mauritius/
