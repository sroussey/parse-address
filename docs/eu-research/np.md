# Nepal (NP) Street Address Research

Research for the config-driven XRegExp address parser. Focus: Nepal's
tole-and-ward addressing (streets are often bare neighbourhood names), the WARD
number modelled as a secondary unit, the 5-digit postcode that is **usually
omitted**, and the 7 provinces. Target: the common single-line romanised business
form; native Devanagari-script forms are out of scope.

---

## 1. Canonical address order

Nepali municipal addressing is neighbourhood- and ward-centric. The common
romanised form is:

```
[House No. N,] Tole/Street[ Type], Ward No. N, City [NNNNN][, Province]
```

Real examples the parser targets (Smarty / PostGrid / GeoPostcodes):

```
Thamel, Ward No. 26, Kathmandu 44600
House No. 41, Rohini Marg, Kathmandu 44600, Bagmati
Putali Sadak, Ward No. 31, Kathmandu
Jhamsikhel, Lalitpur 44700
```

So: **an optional number first, a SUFFIX-type tole/street, a WARD number, then the
city with an optional postcode AFTER it (after-city).** The number and the
postcode are both frequently absent.

---

## 2. Postcode — 5-digit, usually omitted

- **5 digits** (Nepal Post's district/municipality code; the first digit is the
  region, the next two the district, the last two the post office). Ward-level
  codes exist (municipal code + ward), but in practice the postcode is **very
  commonly left off** — Nepal's postal-code system is little used.
- **Placement: after the city** ("Kathmandu 44600"). The postcode is therefore
  OPTIONAL: number-less, postcode-less lines ("Naxal, Ward No. 1, Kathmandu")
  must parse.

---

## 3. Thoroughfare — SUFFIX type, mostly bare toles

- The dominant "street" is a bare **tole** (neighbourhood quarter): Thamel, Naxal,
  Baneshwor, Lazimpat, Baluwatar, Maharajgunj, Koteshwor, Kalimati, ... — no type
  word (type null).
- Named roads carry a trailing Nepali suffix: **Marg/Marga** (road/avenue —
  "Durbar Marg", "Tridevi Marg"), **Sadak/Sarak** (road — "Putali Sadak"),
  **Path** (road — "Kanti Path"), **Chowk** (square/crossroads — "Indra Chowk"),
  **Tole**, **Bato** (road), plus English **Road**/**Lane**.

---

## 4. Ward number — a trailing secondary unit

Nepali addresses carry the municipal **ward** ("Ward No. 26", "Ward No. 1"),
written after the tole and before the city. It is modelled as a **trailing
secondary unit** (`sec_unit_type` "Ward No", `sec_unit_num` N). A ward glued to
the locality with a dash ("Baneshwor-10") is a documented `__skip`.

House numbers, when present, lead ("House No. 41", "H. No. 8", "45"); the "House"
label carries no output field and is added to `__dropped`.

---

## 5. Locality chain & province

A suburb/locality can precede the city; the IN/ZA trick keeps the comma chain in
the city capture and drops the leading localities. The 7 provinces (Koshi P1,
Madhesh P2, Bagmati P3, Gandaki P4, Lumbini P5, Karnali P6, Sudurpashchim P7) ->
`state`, captured before the postcode via the county slot or after it via the
`np_state` helper; a trailing "Province"/"Pradesh" word is accepted and stripped.
District names (Kathmandu, Lalitpur, ...) double as cities and are NOT the province.

Secondary units: Ward No / Ward (trailing); Flat / Apartment / Floor also lead.
PO box: PO Box / P.O. Box / GPO Box / Post Box. Building keywords: Bhawan/Bhavan,
Tower(s), Complex, Plaza, Building, Centre/Center, Sadan, Niwas.

---

## 6. Prior work & known failure modes (>=8)

Prior art: Nepal Post (Postal Services Department); Smarty global address
formatting (NP); PostGrid / GeoPostcodes Nepal guides; wapnepal / merokalam /
nepalish postal-code directories.

1. **Postcode omitted.** The dominant real form has no code; the after-city
   grammar makes the postcode optional (branch B: city + optional province).
2. **Number omitted.** Most tole lines have no house number; the number is
   optional in the number-first street core.
3. **Bare toles (type-less).** Thamel, Naxal, Baneshwor, ... parse with a null
   type.
4. **Ward as a unit.** "Ward No. N" is a trailing secondary unit, not a street or
   a locality.
5. **Ward glued to the locality.** "Baneshwor-10" (municipal ward appended with a
   dash) is a documented `__skip`.
6. **Province either side of the (optional) postcode.** Folded via the county slot
   or the `np_state` helper; district names are never mapped to `state`.
7. **Label-only "House".** Exempted from the token guard via `__dropped`.
8. **Nepali road suffixes.** Marg/Marga, Sadak/Sarak, Path, Chowk, Bato must be in
   the type vocabulary or a named road is mislabelled.
9. **Bare tole line with no ward and no postcode.** "Thamel Marg, Kathmandu" is
   ambiguous with a city-only line; documented `__skip`.
10. **Market / bazaar names written like buildings.** "Bishal Bazaar, New Road" —
    a leading name with no building keyword; documented `__skip`.
11. **Native Devanagari script.** Out of scope; romanised forms only.
12. **Multi-word Kathmandu Valley cities.** Kathmandu / Lalitpur / Bhaktapur and
    their sub-metros parse; sub-metropolitan qualifiers are treated as localities.

---

## 7. Field-mapping decisions

- `number` — leading integer, optional `House No.`/`No.` lead-in (often absent).
- `civic_number_suffix` — trailing letter.
- `street` — tole/road name without the trailing type; `type` — Marg/Sadak/Path/
  Chowk/Road/...; null for a bare tole.
- `sec_unit_type`/`sec_unit_num` — "Ward No" + N (trailing); PO Box + value.
- `building` — a leading name ending in a building keyword.
- `city` — routing city (last of the chain); earlier localities dropped.
- `state` — province short code (P1–P7); usually absent.
- `postal_code` — 5-digit code; usually absent.
- `country` — `NP`.

---

## Sources

- Nepal Post (Postal Services Department) — https://gpo.gov.np/
- Smarty — Nepal address format & examples — https://www.smarty.com/global-address-formatting/nepal-address-format-examples
- PostGrid — Nepal Address Format With Examples — https://www.postgrid.com/global-address-format/nepal-address-format/
- GeoPostcodes — Nepal address format — https://www.geopostcodes.com/country/nepal/address-format/
- wapnepal — Postal Code of Nepal (all districts) — https://wapnepal.com.np/postal-code-nepal/
- Merokalam — Postal Codes of Nepal (77 districts) — https://merokalam.com/postal-codes-of-nepal/
- nepalish — Postal Code of Kathmandu Metropolitan City — https://nepalish.com/biz/postal-code-of-kathmandu-metropolitan-and-kathmandu-district/
- Wikipedia — Provinces of Nepal — https://en.wikipedia.org/wiki/Provinces_of_Nepal
