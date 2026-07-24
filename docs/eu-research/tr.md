# Turkey (TR) Street Address Research

Research for the config-driven EU/Intl address parser. SEC code W8.
Focus: PTT (Posta ve Telgraf Teşkilatı) addressing, the 5-digit posta kodu, the
mahalle / cadde-sokak-bulvar / bina No / Daire hierarchy, and the ilçe (district)
/ il (province) tail.

---

## 1. Canonical address order

A modern Turkish address has this hierarchy (PTT / NVI standard):

```
[Addressee]
[Mahalle] Mah.                          <- neighbourhood (Kızılay Mah.)
[Street] Cad./Sok./Bulv. No:[n] D:[d]   <- Atatürk Bulvarı No:191 D:5
[Posta kodu] [İlçe]/[İl]                <- 06420 Çankaya/Ankara
[Country]
```

In practice the two street-bearing lines are often written on **one line** and,
in romanized single-line form, the mahalle is written EITHER first or right after
the street. The convention this parser targets (matching the task brief and much
real business data) puts the **street + type + No + Daire first**, then the
mahalle, then **postcode before the district**, then the province:

```
Atatürk Bulvarı No:191 D:5, Kızılay Mah., 06420 Çankaya/Ankara
İstiklal Caddesi No:12, 34433 Beyoğlu/İstanbul
Bağdat Caddesi No:200 D:3, Caddebostan Mah., 34728 Kadıköy/İstanbul
```

Key structural facts:
- **Street name FIRST, then the type noun** (Caddesi/Sokak/Bulvarı) as a
  **trailing suffix**, then the number introduced by **`No:`** — so it is a
  *street-number* order where the number is explicitly labelled, not bare.
- **Postcode precedes the city(=district)** on the last line (`before-city`),
  like continental Europe: `06420 Çankaya`.
- The **province (il)** follows the district after a slash (`Çankaya/Ankara`);
  it maps to `state`. The **district (ilçe)** is the routing `city`.
- The **mahalle** has no dedicated field in the engine and is a documented gap.

---

## 2. Posta kodu (postcode)

- **5 digits**, e.g. `06420`, `34433`, `34728`, `35220`, `16110`, `07100`.
- **First two digits = the province plate code** (01–81): `06` = Ankara,
  `34` = İstanbul, `35` = İzmir, `16` = Bursa, `07` = Antalya, `01` = Adana,
  `42` = Konya. Leading zeros significant (`06420`, `07100`).
- Position: **immediately before the district** (before-city). `\d{5}`.

---

## 3. Street types (suffix nouns)

The street type is a **noun that TRAILS the name** (possessive/izafet form):

| Full (izafet) | Abbrev. | Meaning |
|---------------|---------|---------|
| Caddesi       | Cad. / Cd. | Avenue / main road |
| Sokak / Sokağı| Sok. / Sk. | Street / alley |
| Bulvarı       | Bulv. / Blv. / Bul. | Boulevard |
| Mahallesi     | Mah. / Mh. | Neighbourhood (not a street type; the locality) |
| Meydanı       | Meyd. | Square |
| Yolu          | — | Road / way |
| Çıkmazı       | Çkm. | Cul-de-sac |
| Geçidi        | — | Passage |

So `Atatürk Bulvarı`: name = `Atatürk`, type = `Bulvarı`. `İstiklal Caddesi`:
name = `İstiklal`, type = `Caddesi`. The abbreviated `Cad.`/`Sok.`/`Bulv.` (with
the trailing dot) is the common written form. **Turkish diacritics** (ç, ğ, ı, İ,
ö, ş, ü) must be preserved and matched.

Numbered streets are extremely common in newer districts: the "name" is itself a
number — `1234. Sokak`, `100. Yıl Bulvarı`, `8. Cadde`. So digits must be allowed
inside the name (`allowDigitsInName`).

---

## 4. Building number & Daire

- The **building number is introduced by `No:`** (also `No.`, `No :`, `Nu.`):
  `No:12`, `No: 191`, `No:34/A`. Capture the digits (and optional `/A` block
  suffix) as `(?<number>...)`.
- **`No:12/A`** — the `/A` is a `civic_number_suffix` (block/entrance letter).
- **Ranges**: `No:10-12`.
- **Daire (apartment) = `D:` / `Daire:` / `Da.`** — the flat number, a secondary
  unit: `D:3`, `Daire:7`, `D:12`.
- **Kat (floor) = `Kat:` / `K:`** — floor, another secondary unit: `Kat:3`,
  `K:2`.
- **Blok / Apartman**: `A Blok`, `Gül Apartmanı` — building name/block; leads or
  follows. `Apartmanı`/`Apt.`/`Sitesi` mark a named building or gated complex.

---

## 5. Secondary (sub-building) units

Words placed **after** the street/number:
- **Daire** (apartment): `Daire`, `D.`, `D:`, `Da.`
- **Kat** (floor): `Kat`, `K.`, `K:`
- **Blok** (block): `Blok`, `Blk.`
- **Numara** already consumed as the house number (`No:`).

Forms: `... No:191 D:5`, `... No:12 Kat:3 D:7`, `... No:8 A Blok D:2`.
`sec_unit_num` is typically numeric; `Blok` values are letters (`A Blok`).

---

## 6. Mahalle, ilçe, il, country

- **Mahalle** (`Mah.` / `Mahallesi`) — the neighbourhood, smallest admin unit;
  essential for routing but **has no engine field**. In this corpus it is either
  omitted, or written as a segment that ground truth records only in `notes`
  (documented gap). Examples: `Kızılay Mah.`, `Caddebostan Mah.`,
  `Alsancak Mah.`, `Cumhuriyet Mah.`.
- **İlçe** (district) — mapped to **`city`**: `Çankaya`, `Beyoğlu`, `Kadıköy`,
  `Şişli`, `Beşiktaş`, `Konak`, `Bornova`, `Muratpaşa`, `Nilüfer`, `Osmangazi`,
  `Seyhan`, `Selçuklu`.
- **İl** (province) — mapped to **`state`**: `Ankara`, `İstanbul`, `İzmir`,
  `Bursa`, `Antalya`, `Adana`, `Konya`. Written after the district, usually
  separated by a **slash** (`Çankaya/Ankara`) or a comma/space.
- For the 30 metropolitan provinces the district and province can share a name
  edge-case, and central districts are sometimes dropped (`34433 İstanbul`).
- Country: `Türkiye`, `Turkey`, `TR`, `TUR`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: PTT posta kodu directory, NVI (Adres Kayıt Sistemi / AKS) address
standard, UPU S42 TR template, Smarty / PostGrid / AddressGuard TR guides,
Google libaddressinput (`TR`: `fmt` `%N%n%O%n%A%n%Z %C/%S`, i.e.
street / postcode + district `%C` / province `%S` — confirms district=city,
province=state, postcode-before-district), Wikipedia "Addresses in Turkey".

1. **`No:` / `D:` labelled numbers.** `Atatürk Bulvarı No:191 D:5` — the house
   number is NOT bare; it follows `No:`, and `D:5` is a Daire (apartment), not a
   second house number. A bare-`\d+` grammar grabs `191` as street-internal or
   confuses `5` for the number. Must anchor on `No:` and treat `D:`/`Kat:` as
   secondary units.

2. **Mahalle has no field.** `..., Kızılay Mah., ...` — the neighbourhood is a
   real, routing-critical segment with nowhere to go in a street/city/state
   schema; it is dropped/noted. Primary TR gap.

3. **Type is a trailing izafet noun.** `Bulvarı`/`Caddesi`/`Sokağı` (possessive
   `-ı/-i/-ğı` endings) vs bare `Bulvar`/`Cadde`/`Sokak` — both spellings occur;
   the abbreviations `Cad.`/`Sok.`/`Bulv.` carry a trailing dot. The splitter
   must match all forms and not mistake `Cad.` for the start of a name.

4. **Numbered street names.** `1234. Sokak No:5`, `100. Yıl Bulvarı`, `8. Cadde`
   — the "name" is a number with an ordinal dot; digits must be allowed inside
   the name without being read as the house number.

5. **Postcode-before-district + slash province.** `06420 Çankaya/Ankara` — the
   postcode leads the last line and the province follows the district after a
   `/`. A parser expecting postcode-last (GB/ZA) or a comma between city and
   region mis-splits `Çankaya/Ankara`.

6. **Turkish diacritics & dotted/dotless I.** `İstiklal`, `Şişli`, `Çankaya`,
   `Bağdat`, `Nilüfer` — `İ/ı` vs `I/i` casefolding differs from ASCII; a
   naive `[A-Z]` class and ASCII lowercasing corrupt the tokens. Must use
   Unicode-aware classes.

7. **`No:12/A` block suffix.** The `/A` after the number is a block/entrance
   letter (`civic_number_suffix`), not a Daire and not part of the street.

8. **District dropped in metro provinces.** `... 34433 İstanbul` (no explicit
   district) vs `... 34433 Beyoğlu/İstanbul` — sometimes only the province is
   written, so `city` may be empty while `state` is set, or the single trailing
   token is actually the province, not the district.

9. **Mahalle-first vs street-first ordering.** Some addresses lead with the
   mahalle (`Kızılay Mah. Atatürk Bulvarı No:191 ...`) and others lead with the
   street; the grammar can only anchor one. Documented.

10. **Kat vs Daire confusion.** `Kat:3 D:7` — two secondary units (floor +
    apartment) in sequence; a single sec-unit slot keeps one and notes the other.

11. **Apartman / Site names.** `Gül Apartmanı`, `Yeşil Vadi Sitesi` — a named
    building/complex with no field; leads or trails, dropped/noted.

12. **Comma-free single line.** Real PTT lines often have NO commas
    (`Atatürk Bulvarı No 191 Kızılay 06420 Çankaya Ankara`); the parser cannot
    rely on comma delimiters to segment mahalle/district/province.

---

## 8. Field-mapping decisions

- `number` — the digits after `No:` (optional `/A` block suffix, optional range).
- `civic_number_suffix` — the `/A` block letter after the number.
- `street` — name before the type noun; digits allowed (numbered streets).
- `type` — trailing `Caddesi`/`Cad.`/`Sokak`/`Sok.`/`Bulvarı`/`Bulv.` etc.
- `sec_unit_type` / `sec_unit_num` — `Daire`(`D:`) / `Kat`(`K:`) / `Blok` + value
  (one slot; extra unit noted).
- `city` — the **district (ilçe)** after the postcode.
- `state` — the **province (il)** after the district (post-slash).
- `postal_code` — 5-digit, before the district.
- `country` — `TR`.
- Mahalle and Apartman/Site names have no field -> `notes`.

---

## Sources

- PTT posta kodu directory — https://postakodu.ptt.gov.tr/
- NVI Adres Kayıt Sistemi (AKS) — https://www.nvi.gov.tr/
- UPU S42 TR addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/turEn.pdf
- Wikipedia: Addresses in Turkey — https://en.wikipedia.org/wiki/Addresses_in_Turkey
- AddressGuard TR format — https://addressguard.io/address-format/turkey/
- Smarty TR format examples — https://www.smarty.com/global-address-formatting/turkey-address-format-examples
- PostGrid TR address format — https://www.postgrid.com/global-address-format/turkey-address-format/
- Google libaddressinput (TR metadata) — https://chromium-i18n.appspot.com/ssl-address/data/TR
