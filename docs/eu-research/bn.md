# Brunei Darussalam (BN) Street Address Research

Research for the config-driven XRegExp address parser. Focus: Brunei's
**alphanumeric** postcode (two letters + four alphanumerics, "BS8811"), the Malay
prefix-type street grammar (Jalan / Simpang / Lorong), the Kampong/suburb area
dropped before the city, and the 4 districts. Target: the common single-line
romanised (Malay/English) business form; native Jawi-script forms are out of scope.

---

## 1. Canonical address order

Brunei uses Malay addressing, essentially identical to Malaysia's, but with the
postcode written LAST (after the city). The common business form is:

```
No N, [Simpang N,] Jalan Name, [Kampong/Area,] City <BXNNNN>[, District]
```

Real examples the parser targets (Umbrex / GeoPostcodes / UPU brnEn.pdf):

```
No 12, Jalan Sultan, Kampong Kianggeh, Bandar Seri Begawan BS8811
No 5, Jalan Gadong, Bandar Seri Begawan BE3919
Simpang 88, Jalan Muara, Gadong, Bandar Seri Begawan BE1718
No 23, Jalan Pretty, Kuala Belait KA1131
```

So: **house/lot number first (labelled "No"/"Lot"), a PREFIX-type road name, an
optional Kampong/suburb area, then the city with the postcode AFTER it
(after-city).**

---

## 2. Postcode — ALPHANUMERIC (2 letters + 4 alphanumerics)

- **Six characters: two uppercase letters then four alphanumerics** — "BS8811",
  "KA1131", "BE1718", "TA1341", "PA1151". Captured as `[A-Za-z]{2}[A-Za-z0-9]{4}`
  and upper-cased.
- The **first letter encodes the district**: B = Brunei-Muara, K = Belait,
  T = Tutong, P = Temburong. The two number-digits after the letters are the
  village code.
- **Placement: after the city.** The alphanumeric shape is what lets the parser
  tell the postcode from the (letter-only) city words: a city word cannot end the
  line as `LL####`, so backtracking settles the multi-word city + trailing code.

---

## 3. Thoroughfare — PREFIX Malay types

- **Jalan** (road) is dominant — "Jalan Sultan", "Jalan Gadong", "Jalan Muara".
  **Simpang** (junction/branch road, usually numbered — "Simpang 88") and
  **Lorong** (lane) also occur, plus the abbreviations Jln/Spg/Lrg.
- Malay names are multi-word ("Jalan Kumbang Pasang", "Jalan Batu Bersurat",
  "Jalan Sungai Kebun"); see the reconstruction note in section 5.

---

## 4. Number variants

- Lead-in `No`/`No.`/`Lot`/`Unit`, then the number, with an optional `-N`
  block/unit part ("No 3-1") and a glued letter suffix ("No 12A" -> 12 + A).
- Secondary unit leads: Unit / Tingkat (floor) / Aras (floor) / Apartment / Suite
  / Block / Floor.
- **Letter-led unit id** ("Unit A-5") with no house number is a documented `__skip`.
- The label words "No"/"Lot" carry no output field ("No" is stripped by the token
  guard; "Lot" is added to `__dropped`).

---

## 5. Kampong/area drop + multi-word-name reconstruction

A Kampong/Kampung/Mukim area, or a bare suburb (Gadong, Kiulap, Beribi, Berakas,
Menglait, ...), sits between the street and the city and is dropped. The IN/ZA
trick (comma-permissive city + `postNormalize`) supplies the drop.

**Key interaction:** a PREFIX-type name is captured NON-GREEDILY, so a
comma-permissive city also pulls the *tail words* of a multi-word Malay name into
the dropped chain ("Jalan Kumbang Pasang" -> name captured as "Kumbang", "Pasang"
leaks). `postNormalize` therefore RECLASSIFIES each dropped segment:

- an **area marker** (Kampong/Kampung/Kg/Mukim/Simpang, or a listed bare suburb) is
  dropped;
- a **second stacked street** led by a type word (Jalan/Lorong/Simpang) is dropped;
- any **other fragment** is a leaked street-name word and is **appended back to
  the street**.

This keeps multi-word names ("Kumbang Pasang", "Batu Bersurat", "Sungai Kebun")
AND the Kampong/suburb drop working together.

---

## 6. District — output as a short code

4 districts -> `state`: Brunei-Muara BM, Belait BL, Tutong TU, Temburong TE.
Captured after the postcode via the `bn_state` helper ("... KA1131, Belait"), or
as an explicit "X District" via the county slot. Usually omitted (the postcode's
first letter already encodes it).

**Ambiguity handled:** Tutong and Temburong (Bangar) are both districts AND town
names; the county slot therefore requires the literal word **"District"** so a
bare "Tutong" stays the routing town.

PO box: PO Box / P.O. Box / Peti Surat. Building keywords: Complex, Building,
Bangunan, Wisma, Tower(s), Plaza, Mall, Centre/Center.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Postal Services Department Brunei; Wikipedia "Postcodes in Brunei"; UPU
S42 addressing (brnEn.pdf); GeoPostcodes / Umbrex / youbianku Brunei guides. The
grammar is the Malaysia (MY) prefix model with an alphanumeric after-city postcode.

1. **Alphanumeric postcode.** `[A-Za-z]{2}[A-Za-z0-9]{4}` — a numeric-only
   postcode pattern never matches "BS8811".
2. **Multi-word Malay names truncated by the comma-permissive city.** Reconstructed
   in `postNormalize` (leaked fragments appended back to the street).
3. **UNLISTED bare-suburb area.** A suburb not in the area set is appended to the
   street instead of dropped (the reconstruction defaults to "keep the fragment");
   documented limitation.
4. **Kampong/area drop.** Kampong Kianggeh, Kampong Sungai Akar, ... dropped
   (recorded in `__dropped`).
5. **District == town name.** Tutong / Temburong are districts AND towns; the
   county slot requires the literal "District" word.
6. **Two stacked streets.** "Simpang N, Jalan X" — the second (type-led) street is
   dropped, keeping the first; when that second street's name also equals the
   routing town ("Jalan Tutong" + city "Tutong"), the token guard cannot separate
   the repeated token and the line is a documented `__skip`.
7. **Spg N-M hyphen-tagged simpang.** A sub-branch number ("Spg 45-11") is not
   modelled; documented `__skip`.
8. **Letter-led unit id.** "Unit A-5" with no house number; documented `__skip`.
9. **Label-only "No"/"Lot".** Exempted from the token guard.
10. **Native Jawi script.** Out of scope; romanised forms only.
11. **Numbered Simpang/Lorong as the street.** "Simpang 88", "Lorong 5" — the
    number is the street name, the type is Simpang/Lorong.

---

## 8. Field-mapping decisions

- `number` — leading integer (or `n-n`), `No`/`Lot`/`Unit` lead-in.
- `civic_number_suffix` — trailing letter.
- `street` — the road name after the prefix type (multi-word reconstructed);
  `type` — Jalan/Simpang/Lorong (echoed as written).
- `sec_unit_type`/`sec_unit_num` — Unit/Tingkat + value; PO Box/Peti Surat + value.
- `building` — a leading name ending in a building keyword.
- `city` — routing city; Kampong/suburb areas dropped.
- `state` — 2-letter district code; usually absent.
- `postal_code` — `LL####` alphanumeric, upper-cased.
- `country` — `BN`.

---

## Sources

- Postal Services Department, Brunei — https://www.jpm.gov.bn/
- Wikipedia — Postcodes in Brunei — https://en.wikipedia.org/wiki/Postcodes_in_Brunei
- UPU S42 addressing (Brunei) — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/brnEn.pdf
- Umbrex — How to Address an International Letter to Brunei — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-brunei/
- GeoPostcodes — Brunei zip code — https://www.geopostcodes.com/country/brunei/zip-code/
- Youbianku — Brunei postal code — https://en.youbianku.com/Brunei
