# Malaysia (MY) Street Address Research

Research for the config-driven XRegExp address parser. Focus: Pos Malaysia
addressing, the 5-digit postcode, the prefix-type Malay road grammar (Jalan /
Lorong / Persiaran ...), the state / federal-territory tail, and real addresses.

---

## 1. Canonical address order

Malaysia writes the **house/lot NUMBER first** (frequently introduced by
"No"/"No."/"Lot"), then a **PREFIX-type road name**, then (on a separate line) a
neighbourhood/township, then the **5-digit postcode BEFORE the city**, then the
**state**:

```
[Recipient]
[No] Number  Type Name         <- No 66  Jalan Kenari
[Taman / Kampung / Seksyen]    <- Taman Kenari        (optional, see failure #1)
Postcode  CITY                 <- 43000 KAJANG
STATE                          <- SELANGOR
[Country]
```

Single-line / comma-joined form the parser targets:

```
No 66, Jalan Kenari, 43000 Kajang, Selangor
12, Jalan Ampang, 50450 Kuala Lumpur
No 5, Persiaran Perdana, 62000 Putrajaya, Wilayah Persekutuan Putrajaya
```

So: **number first, PREFIX type, postcode BEFORE city (before-city), state last.**
Pos Malaysia's own guidance (and UPU S42) is: final line = 5-digit postcode +
locality in caps, then the state on its own line for international mail.

---

## 2. Postcode

- **Exactly 5 digits**, no letters, no separator: `43000`, `50450`, `62000`,
  `10200`, `01000`, `88000`. Leading zeros are significant (`01000` Kangar,
  `05000` Alor Setar) — capture as `\d{5}`, never integer-cast.
- Position: **immediately before the city** ("43000 Kajang"). This is the single
  biggest structural difference from GB/ZA (which put the code last).
- The first two digits encode the state/region routing zone.

---

## 3. Street types — a leading PREFIX (Malay)

The type word **leads** the name (unlike the GB/ZA trailing suffix):

| Malay      | Meaning              | Example              |
|------------|----------------------|----------------------|
| Jalan (Jln)| road / street        | Jalan Ampang         |
| Lorong (Lrg)| lane / alley        | Lorong Maarof        |
| Persiaran  | avenue / boulevard   | Persiaran Gurney     |
| Lebuh      | (urban) main road    | Lebuh Chulia         |
| Lebuhraya  | highway / expressway | Lebuhraya Sultan Iskandar |
| Lingkaran  | ring road            | Lingkaran Syed Putra |
| Lengkok    | crescent             | Lengkok Kelicap      |
| Susur      | slip road            | Susur Tanjung        |

Malay road names routinely carry **alphanumeric tags** that must survive inside
the name: `Jalan SS2/24`, `Jalan PJU 5/1`, `Jalan USJ 10/1`, `Jalan Ampang 3`,
`Jalan PJS 11/28`. Because the number is captured first (number-first order), the
name is allowed to contain digits and slashes.

---

## 4. House / lot number variants

- Plain integer, number FIRST: `66`, `12`, `1`.
- Optional lead-in word: `No`, `No.`, `Lot`, `PT` (plot). ("No" is stripped by
  the shared token counter; "Lot"/"PT" are consumed but not counted — a known
  interaction, see failure #7.)
- **Number + letter suffix**: `10A`, `7B` -> `civic_number_suffix`.
- **Block/unit dash**: `3-2` (unit 2, block 3) kept in `number`.

---

## 5. Secondary (sub-building) units

Lead-in words (usually **before** the number): `Unit`, `Apartment`/`Apt`,
`Suite`, and the Malay floor words `Tingkat` and `Aras` (both = floor), `Floor`.
Forms: `Unit 5, No 12, Jalan Ampang`, `Tingkat 3, No 8, ...`, `Aras 10, ...`.

---

## 6. City, state / federal territory, country

- **City / locality** — the town after the postcode: `Kuala Lumpur`,
  `Petaling Jaya`, `Shah Alam`, `Kajang`, `Subang Jaya`, `Klang`, `George Town`,
  `Johor Bahru`, `Ipoh`, `Kota Kinabalu`, `Kuching`, `Melaka`, `Seremban`. Often
  multi-word.
- **State (13) + Federal Territory (3)** -> `state`, output as an abbreviation:
  Johor JHR, Kedah KDH, Kelantan KTN, Melaka/Malacca MLK, Negeri Sembilan NSN,
  Pahang PHG, Perak PRK, Perlis PLS, Pulau Pinang/Penang PNG, Sabah SBH, Sarawak
  SWK, Selangor SGR, Terengganu TRG; W.P. Kuala Lumpur KUL, W.P. Putrajaya PJY,
  W.P. Labuan LBN. The state is **frequently omitted** (the postcode routes it)
  and is therefore optional. "Wilayah Persekutuan ..." multi-word territory names
  must be matched longest-first.
- **Country**: `Malaysia`, `MYS`, `MY`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Pos Malaysia guidelines; UPU S42 MY template (mysEn.pdf); Google
libaddressinput (`MY`: `fmt %N%n%O%n%A%n%D%n%Z%n%C%n%S`, i.e. street /
dependent-locality / postcode+city / state); Smarty, PostGrid, GeoPostcodes MY
guides; Wikipedia "Postal codes in Malaysia".

1. **Neighbourhood (Taman/Kampung/Bandar/Seksyen) before the postcode.**
   `No 66, Jalan Kenari, Taman Kenari, 43000 Kajang, Selangor` — the township
   line sits BETWEEN the street and the postcode. Because Malaysia writes the
   postcode **before** the city, the shared place grammar has no slot for a
   locality that *precedes* the postcode (the ZA suburb-drop trick only works
   when the code is last). **Primary MY failure mode** — such lines are marked
   `__skip`; single-locality lines parse fully.
2. **Prefix type vs suffix type.** The type LEADS ("Jalan Kenari"); a suffix
   parser mislabels it. Handled by `typePlacement: "prefix"`.
3. **Alphanumeric road tags.** `Jalan SS2/24`, `Jalan PJU 5/1` — the name carries
   digits and slashes; a digit-terminated name class truncates them.
4. **5-digit code with leading zero.** `01000`, `05000` — must be `\d{5}`.
5. **Postcode BEFORE city.** `43000 Kajang` — a grammar that expects the code
   last (GB/ZA) fails on every MY address.
6. **Multi-word state / federal territory.** `Wilayah Persekutuan Kuala Lumpur`,
   `Negeri Sembilan`, `Pulau Pinang` — spaces must be escaped to `\s+` (free-
   spacing mode ignores literal spaces) and the alternation ordered longest-first.
7. **"Lot"/"PT" number lead-in not token-accounted.** The shared token-
   preservation counter strips only `No`/`Nu`; a `Lot 5` lead-in is consumed by
   the grammar but still counted as a lost token, so the facade degrades it to a
   minimal parse. Documented (`__skip`).
8. **Malay building names put the type FIRST** (`Menara Maybank`, `Wisma ...`,
   `Bangunan ...`, `Kompleks ...`). The suffix-based building capture only detects
   a building whose *last* word is a keyword, so leading-type building names are
   not captured. Documented.
9. **Pos Malaysia box forms.** `Peti Surat 12` (PO Box), `Beg Berkunci 2000`
   (Locked Bag) — Malay box words must be recognised alongside English `PO Box`.
10. **Malay floor words.** `Tingkat`/`Aras` = floor; must be treated as secondary
    units, not street tokens.
11. **All-caps Pos Malaysia form.** Pos Malaysia recommends caps for the postcode/
    city/state lines; matching must be case-insensitive.
12. **Multi-word city.** `Kuala Lumpur`, `Petaling Jaya`, `Johor Bahru`,
    `Kota Kinabalu` — a one-token city capture truncates them.

---

## 8. Field-mapping decisions

- `number` — leading integer (or `n-n`), optional `No`/`Lot` lead-in, optional
  glued letter suffix.
- `civic_number_suffix` — trailing letter of the number.
- `street` — road name without the leading type word.
- `type` — leading `Jalan`/`Lorong`/`Persiaran`/... (echoed as written); null for
  type-less names.
- `sec_unit_type` / `sec_unit_num` — `Unit`/`Tingkat`/`Aras` + value.
- `postal_code` — 5-digit, before the city.
- `city` — locality after the postcode (multi-word allowed).
- `state` — 13 states / 3 federal territories, abbreviated; optional.
- `country` — `MY`.

---

## Sources

- Pos Malaysia (national post) — https://www.pos.com.my/
- UPU S42 Malaysia addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/mysEn.pdf
- UPU S42 SAFD Malaysia metadata (v8) — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/s42/mysEn.pdf
- Smarty — Malaysia address format examples — https://www.smarty.com/global-address-formatting/malaysia-address-format-examples
- PostGrid — Malaysia address format — https://www.postgrid.com/global-address-format/malaysia-address-format/
- GeoPostcodes — Malaysia address format — https://www.geopostcodes.com/country/malaysia/address-format/
- Talkpal — Street and road terms in Malay — https://talkpal.ai/vocabulary/street-and-road-terms-in-malay/
- SAYS — "Lorong, Persiaran, Lebuh & Lebuhraya: what each road type means" — https://says.com/my/lifestyle/what-malaysian-road-names-really-mean
- Wikipedia — Postal codes in Malaysia — https://en.wikipedia.org/wiki/Postal_codes_in_Malaysia
