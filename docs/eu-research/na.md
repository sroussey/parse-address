# Namibia (NA) Street Address Research

Research for the config-driven EU/Intl address parser. Focus: NamPost
addressing, the erf (plot) number, the 5-digit postcode introduced in 2018,
English street types, and the dominant PO Box / Private Bag forms.

---

## 1. Canonical address order

English-speaking, GB-style **number first, then street name + trailing type**,
then a suburb/area, then the town, then an OPTIONAL 5-digit postcode last.

```
[Addressee]
[Erf/Number] [Street] [Type]       <- 71 Robert Mugabe Avenue
[Suburb / Area]                    <- Windhoek West
[City / Town] [Postcode?]          <- Windhoek 10001
NAMIBIA
```

Single-line / comma-joined forms:

```
71 Robert Mugabe Avenue, Windhoek
197 Independence Avenue, Windhoek 10001
Erf 8225, Nguni Street, Northern Industrial, Windhoek
P.O. Box 24, Windhoek
```

The **erf** (cadastral plot) number — "Erf NNNN" — is a common physical
identifier, especially in industrial areas ("Erf 8225, Nguni Street").

---

## 2. Postcode

- A **5-digit** code EXISTS. NamPost introduced it in **December 2018**, after 28
  years with no postal-code system. Structure: first two digits = region, third
  digit = 0, last two = the post office (e.g. Windhoek 10005, Swakopmund 13001).
- Position: **last**, after the town ("Windhoek 10001") — after-city.
- **Adoption is still low**; the code is very frequently OMITTED, and older mail
  carries none. Therefore it is OPTIONAL: the after-city grammar uses its
  postcode-absent branch when no code is written.
- Note: some references (and older material) state Namibia "has no postcode" —
  that describes the pre-2018 situation; the 2018 system is real but sparsely
  used. Both forms (with and without code) occur.

---

## 3. Street types (suffix, English + some German)

Trailing English suffix: `Avenue, Street, Road, Drive, Lane, Close, Crescent,
Boulevard, Way, Terrace, Circle, Rise, Walk, Row, Highway`. Abbreviations:
`Ave, St, Rd, Dr, Cres, Blvd, Hwy`. A German colonial legacy leaves a few
`Weg`/`Strasse`/`Straat` names. Type is nullable (an erf may sit in a bare area
with no named street).

---

## 4. House / erf number variants

- **Erf**: `Erf 8225`, `Erf 1305`. The "Erf" marker is retained inside `number`
  so no token is lost.
- Plain integer, number-first: `71 Robert Mugabe Avenue` -> number `71`.
- **Number + letter**: `12A`, `7B` -> `civic_number_suffix`.
- **Range**: `10-14`.
- **PO Box / Private Bag** (dominant): `P.O. Box 24`, `P O Box 5608`,
  `Private Bag 13289`, `Private Bag X13`. Most Namibian mail is delivered to a
  box.

---

## 5. Secondary (sub-building) units

`Unit`, `Flat`, `Apartment`/`Apt`, `Suite`, `Office`, `Floor`, `Room`, `Block`,
`Shop`; they lead the address ("Unit 1, Erf 1305, Sesriem Street, ...",
"Shop 3, 197 Independence Avenue, ...").

---

## 6. Suburb / area, town, region, country

- **Suburb / industrial area** — Klein Windhoek, Windhoek West, Pioneerspark,
  Olympia, Eros, Ludwigsdorf, Kleine Kuppe, Auasblick, Khomasdal, Katutura,
  Northern Industrial, Southern Industrial. Between the street and the town; the
  chain keeps the LAST locality (town) and drops the leading area(s).
- **Town / city** — Windhoek, Swakopmund, Walvis Bay, Oshakati, Ongwediva,
  Rundu, Otjiwarongo, Gobabis, Keetmanshoop, Katima Mulilo, Grootfontein.
  Multi-word: Walvis Bay, Katima Mulilo.
- **Region** (14 regions, e.g. Khomas, Erongo, Oshana): not part of the mailing
  address; `state` not modelled (county slot disabled).
- Country: `Namibia`, `NAM`, `NA`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: NamPost; "Postal codes in Namibia" (Wikipedia — Dec-2018 rollout, per-
town codes); UPU S42 NA template; Smarty / PostGrid NA guides.

1. **Optional / sparsely-used postcode.** `Windhoek` vs `Windhoek 10001` — the
   code must be optional; a required-postcode schema fails the common no-code
   form.
2. **Postcode-absent vs present.** The after-city grammar must accept both "town"
   and "town + 5 digits"; a naive "everything after the last comma is the city"
   would fold "10001" into the city.
3. **"Erf" marker.** `Erf 8225` — the "Erf" word is not a street token; kept in
   `number` to stay lossless.
4. **Suburb contains the town token.** `Klein Windhoek, Windhoek` — the dropped
   suburb "Klein Windhoek" contains the city token "Windhoek", so the token-
   preservation boundary can land inside the dropped suburb. Documented `__skip`.
5. **Erf-only, no thoroughfare.** `Erf 99, Ongwediva` — with no street/area the
   town would be taken as the street name. Documented `__skip`.
6. **Area written where a street sits.** `Erf 456, Klein Windhoek, Windhoek` — an
   area with no street lands in `street` (untyped).
7. **Multi-word town.** `Walvis Bay`, `Katima Mulilo` — one-token city capture
   truncates them.
8. **PO Box / Private Bag dominance.** `Private Bag X13` — the X-prefixed bag
   number breaks a digits-only box pattern.
9. **Number letter suffix / range.** `12A Curt von Francois Street`,
   `10-14 Bahnhof Street`.
10. **German-legacy street words.** `Schanzen Road`, `Bahnhof Street`,
    `-strasse`/`-weg` names must still be recognised (English + German type set).
11. **Region never in address.** The 14 regions are administrative, not postal;
    the county slot is disabled so a stray region token is not mis-captured.

---

## 8. Field-mapping decisions

- `number` — erf ("Erf 8225") or leading integer; range kept; glued letter ->
  `civic_number_suffix`.
- `street` — name without the trailing type (or an area when no street exists).
- `type` — trailing English/German suffix; nullable.
- `sec_unit_type`/`sec_unit_num` — Unit/Flat/Shop/Office + value.
- `city` — routing town (last locality); leading area(s) dropped.
- `state` — null (regions not modelled).
- `postal_code` — 5-digit when written, else null.
- `country` — `NA`.

---

## Sources

- NamPost — https://www.nampost.com.na/
- Wikipedia: Postal codes in Namibia — https://en.wikipedia.org/wiki/Postal_codes_in_Namibia
- Smarty NA format examples — https://www.smarty.com/global-address-formatting/namibia-address-format-examples
- PostGrid NA address format — https://www.postgrid.com/global-address-format/namibia-address-format/
- Umbrex "How to address a letter to Namibia" — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-namibia/
