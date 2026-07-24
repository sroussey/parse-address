# Kenya (KE) Street Address Research

Research for the config-driven EU/Intl address parser. English-speaking East
Africa. Postal operator: Postal Corporation of Kenya (Posta). Number-first,
trailing English street types, 5-digit postcode (often omitted), and a dominant
PO Box form where the box number is joined to the delivery post office's postal
code by a hyphen ("30500-00100").

---

## 1. Canonical address order

Physical (street) form — **house NUMBER first, then street + trailing English
type**, then an **estate / area**, then the **city**, then the optional 5-digit
**postcode**:

```
[Number] [Street] [Type]        <- 20 Ngong Road
[Estate / area]                 <- Kilimani
[City] [Postcode]               <- Nairobi 00200
[Country]
```

PO Box form (the DOMINANT real-world form):

```
P.O. Box [Box] - [Postcode], [City]     <- P.O. Box 30500-00100, Nairobi
P.O. Box [Box], [City] [Postcode]       <- P.O. Box 42950, Mombasa 80100
```

Single-line examples:

```
8 Kenyatta Avenue, Nairobi 00100
20 Ngong Road, Kilimani, Nairobi 00200
P.O. Box 30500-00100, Nairobi
P.O. Box 42950, Mombasa 80100
```

So: **number first, suffix type, postcode after the city (after-city)**.

---

## 2. Postcode

- **5 digits**, `99999`, assigned to the delivery post office. Nairobi GPO
  `00100`; other Nairobi codes `00200`, `00600`, `00800` (Westlands); Mombasa
  `80100`; Kisumu `40100`; Nakuru `20100`; Eldoret `30100`; Thika `01000`.
  Leading zeros are significant (`00100`, `01000`) — must be `\d{5}`.
- Position: after the city, space-separated ("Nairobi 00100").
- **Often omitted** in street addresses (routing is by post office / PO box).
- In the PO Box form the postal code is the **delivery office** code and is
  written joined to the box number by a hyphen: `P.O. Box 30500-00100` = box
  30500 at GPO 00100.

---

## 3. Street types (suffix, English)

Type is a trailing **suffix**: `Kenyatta Avenue`, `Ngong Road`, `Kimathi Street`,
`Waiyaki Way`, `Chiromo Lane`, `Riverside Drive`.

Types: `Avenue, Road, Street, Lane, Close, Drive, Crescent, Boulevard, Way,
Court, Place, Terrace, Highway, Ring, Loop, Rise, Grove, Row, Park, Gardens,
Walk, Hill`. Abbreviations `Ave, Rd, St, Dr, Cl, Cres, Blvd, Hwy`. Type must be
allowed null.

---

## 4. House / building number variants

- Plain integer, number FIRST: `8`, `20`, `44`.
- **Number + letter suffix**: `8A`, `12B` -> `civic_number_suffix`.
- **Range**: `10-12`.
- **Secondary unit leads**: `Flat 4, 20 Ngong Road`, `Apartment 3B, ...`,
  `House 12, ...`, `Suite 5, ...`.
- **Building name leads**: `Bishop Magua Centre, 20 Ngong Road`,
  `Rahimtulla Tower, 4 Upper Hill Road`.
- **PO Box** (dominant): `P.O. Box 30500-00100, Nairobi`,
  `P.O. Box 42950, Mombasa 80100`.

---

## 5. Secondary (sub-building) units

Words leading the address: `Flat`, `Apartment`/`Apt`, `House`, `Suite`, `Block`,
`Floor`, `Room`, `Shop`, `Unit`.

---

## 6. Estate, city, region, country

- **Estate / area** — Nairobi: Westlands, Kilimani, Kileleshwa, Lavington,
  Upper Hill, Hurlingham, Parklands, Karen, Runda, Gigiri, Langata; Mombasa:
  Nyali. Written between the street and the city. Kept in the comma chain and
  dropped in postNormalize (leading localities), keeping the last (the city).
- **City / town** — `Nairobi`, `Mombasa`, `Kisumu`, `Nakuru`, `Eldoret`,
  `Thika`, `Nyeri`, `Machakos`.
- **Region** — Kenya's 47 counties are almost never written in a postal address
  (routing is by postcode / PO box). No `state` is modelled. The county slot is
  disabled with a never-match sentinel so the default county pattern does not
  swallow the routing city.
- Country: `Kenya`, `Republic of Kenya`, `KEN`, `KE`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Postal Corporation of Kenya (Posta); UPU S42 KE template & postcode
note (kenEn.pdf, "5 digits below delivery post office"); Smarty / PostGrid KE
guides. Note Smarty's normalized examples ("Kenyatta Dr 8 Nairobi 00100") place
the number AFTER the street — a database artefact; real Kenyan usage is
number-FIRST ("8 Kenyatta Avenue").

1. **PO Box box-postal join.** `P.O. Box 30500-00100` — the delivery-office
   postal code is hyphen-joined to the box number. A naive box pattern captures
   the whole "30500-00100" as the box; it is split into box (30500) + postal
   (00100). Also written with spaces around the hyphen ("30500 - 00100").

2. **No region -> default county eats the city.** With no state list, the
   generic `city, county` slot would take `Kilimani, Nairobi` as
   city="Kilimani", county="Nairobi". Disabled via a never-match county so the
   whole chain stays in `city` for the drop step.

3. **Estate + city, one slot.** `Kilimani, Nairobi` — leading estate dropped,
   city kept.

4. **Postcode often omitted.** `8 Kenyatta Avenue, Nairobi` — no code; grammar
   must not require it.

5. **Leading-zero postcode.** `00100`, `01000` — must be `\d{5}`, never cast to
   an integer.

6. **PO Box without postal, or with postal after the city.** `PO Box 40100,
   Kisumu` (bare box) vs `P.O. Box 42950, Mombasa 80100` (postal after the
   city). Both are supported; a bare number that happens to look like a postcode
   ("Box 40100") is kept as the box number, not a postcode.

7. **Multi-word street name.** `Argwings Kodhek Road`, `Ralph Bunche Road`,
   `Oginga Odinga Street`, `Haile Selassie Avenue`, `Mama Ngina Street` — the
   greedy name keeps the rightmost type word as the type.

8. **Building name before number.** `Bishop Magua Centre, 20 Ngong Road` —
   building leads; must not be read as the number line.

9. **Number letter suffix / range.** `8A`, `12B`, `10-12`.

10. **Private Bag with no number.** `Private Bag, Nairobi 00100` — a box word
    with no number; sec_unit_num is left empty.

11. **All-caps international form.** `NAIROBI ... KENYA` — matching is
    case-insensitive.

12. **County confusion.** A modern address occasionally appends the county
    ("... Nairobi, Nairobi County") — a trailing "X County" is not modelled and
    would be treated as part of the city chain (documented gap).

---

## 8. Field-mapping decisions

- `number` / `civic_number_suffix` — leading number (+ range/letter).
- `street` / `type` — name + trailing suffix (type null if absent).
- `sec_unit_type` / `sec_unit_num` — `Flat`/`Apartment`/... + value, or
  `PO Box` + box number (postal split out).
- `city` — the routing city (last locality); leading estates dropped.
- `postal_code` — 5-digit, after the city, or split from the box-postal join.
- `country` — `KE`.

---

## Sources

- Postal Corporation of Kenya (Posta) — https://www.posta.co.ke/
- UPU S42 KE addressing / postcode note — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/kenEn.pdf
- Smarty KE address format examples — https://www.smarty.com/global-address-formatting/kenya-format-examples
- PostGrid KE address format — https://www.postgrid.com/global-address-format/kenya-address-format/
- Umbrex "How to address a letter to Kenya" — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-kenya/
