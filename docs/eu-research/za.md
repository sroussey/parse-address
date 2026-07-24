# South Africa (ZA) Street Address Research

Research for the config-driven EU/Intl address parser. SEC code T3.
Focus: South African Post Office (SAPO) addressing, the 4-digit postcode,
suburb + city/town locality chain, English and Afrikaans street types, and the
optional province.

---

## 1. Canonical address order

South Africa writes the **house/building NUMBER first, then the street name +
trailing type** (English suffix like GB), then a **suburb**, then the **city /
town**, then the **4-digit postcode LAST**:

```
[Addressee]
[Number] [Street] [Type]        <- 300 Kempston Road
[Suburb]                        <- Sydenham
[City / Town]                   <- Port Elizabeth
[Postcode]                      <- 6001
[Country]
```

Single-line / comma-joined form used by parsers:

```
300 Kempston Road, Sydenham, Port Elizabeth, 6001
43 Cavendish Road, Yeoville, Johannesburg, 2198
21 Loop Street, Cape Town City Centre, Cape Town, 8001
```

So: **number first, suffix type, postcode LAST (after-city)** — structurally the
same skeleton as GB but with a 4-digit numeric postcode instead of the alphameric
UK code, and with a suburb line between street and city.

**Province** (Gauteng, Western Cape, ...) is **usually omitted** on mail (the
postcode routes it) but is sometimes written before the postcode; when present it
maps to `state`. It is optional and never required.

---

## 2. Postcode

- **4 digits**, introduced 8 Oct 1973: `0001`, `2000`, `8001`, `4001`, `6001`,
  `9301`. Leading zeros are significant (`0001` Pretoria, `0083` Hatfield) —
  must keep them.
- Position: **last token**, after the suburb/city (after-city).
- In cities the **last two digits encode the delivery mode**: street-delivery
  vs PO Box / Private Bag differ (e.g. Pretoria street `0002` vs box `0001`;
  Port Elizabeth street `6001` vs box `6000`). Not needed for parsing, but it is
  why a suburb can have two very close codes.
- Capture as `(?<postal_code>\d{4})`. No letters, no separator.

---

## 3. Street types (suffix, English + Afrikaans)

The **type is a trailing SUFFIX** appended to the name (GB-style):
`Kempston Road`, `Cavendish Road`, `Long Street`, `Jan Smuts Avenue`,
`Rivonia Road`, `Oxford Road`, `Nelson Mandela Drive`.

English types: `Street, Road, Avenue, Drive, Lane, Close, Crescent, Boulevard,
Way, Place, Terrace, Court, Grove, Rise, View, Heights, Circle, Ring, Row,
Mews, Park, Gardens, Walk, Highway, Freeway, Loop, Link, Bend, Hill`.

Afrikaans types (very common, esp. Pretoria / Free State / North West):

| Afrikaans | English | Example |
|-----------|---------|---------|
| Straat    | Street  | Kerkstraat / Kerk Straat |
| Laan      | Avenue  | Schoemanlaan |
| Weg       | Road    | Vissershok Weg |
| Rylaan    | Drive/Ave | Louis Bothalaan/Rylaan |
| Singel    | Crescent/Close | Acaciasingel |
| Straße    | (n/a) — not ZA |

Afrikaans types frequently **fuse** onto the name ("Kerkstraat", "Schoemanlaan")
as well as appearing spaced ("Kerk Straat"). This parser models them as spelled-
out suffix words and, in ground truth, splits the spaced form; the fused form
("Kerkstraat") is documented as a failure mode for a pure suffix splitter (the
name and type are one token). Common abbreviations: `St`, `Rd`, `Ave`, `Dr`,
`Cres`, `Blvd`.

A minority of streets are **type-less** or named after a person only in older
townships (e.g. "Vilakazi Street" always has type; but some rural routes use
"Main Road", "High Street"). Type must be allowed to be null.

---

## 4. House / building number variants

- Plain integer, number FIRST: `300`, `43`, `21`, `1`.
- **Number + letter suffix**: `12A`, `7B` — `civic_number_suffix`.
- **Ranges**: `10-12`.
- **Unit / flat before or after**: "Unit 5, 12 Rivonia Road",
  "12 Rivonia Road, Flat 3B". Secondary units (§5).
- **Building name + number**: "Sandton City, 83 Rivonia Road",
  "Nedbank Building, 30 Hoofd Street". Building name leads.
- **PO Box / Private Bag**: "PO Box 1840", "Private Bag X9", "Postnet Suite 123".
  These replace the thoroughfare and are the dominant *postal* (non-physical)
  form in SA — hugely common. `Private Bag` numbers carry an `X` prefix
  (`Private Bag X20`).

---

## 5. Secondary (sub-building) units

Words (usually **before** the number, sometimes after), placed as a secondary
unit:
- `Unit`, `Flat`, `Apartment` / `Apt`, `Suite`, `Floor`, `Room`, `Block`,
  `Door`, `Shop`, `Cottage`.

Forms: `Unit 5, 12 Rivonia Road`, `Flat 3B, 45 Long Street`,
`Shop 12, 200 Church Street`, `Suite 4, 30 Baker Street`. `sec_unit_num` may
carry a letter (`3B`) or be a bare letter.

---

## 6. Suburb, city, province, country

- **Suburb** — the neighbourhood, written on its own line between street and
  city (`Sydenham`, `Yeoville`, `Rosebank`, `Sandton`, `Rondebosch`,
  `Sea Point`, `Claremont`, `Umhlanga`, `Hatfield`, `Morningside`, `Melville`).
  In big cities the suburb, not the city, is the routing locality. Because the
  engine has a single `city` slot, ground truth generally puts the **suburb** in
  `city` when both are present is *wrong for routing*; instead this corpus puts
  the **city/town** in `city` and notes the suburb — but for addresses where only
  a suburb is given (common in Cape Town / Joburg), the suburb IS the city value.
  The suburb-plus-city chain is a documented failure mode (two localities, one
  slot).
- **City / town** — `Johannesburg`, `Cape Town`, `Durban`, `Pretoria`
  (Tshwane), `Port Elizabeth` (Gqeberha), `Bloemfontein`, `East London`,
  `Pietermaritzburg`, `Kimberley`, `Nelspruit` (Mbombela), `Polokwane`.
  Multi-word: `Cape Town`, `East London`, `Port Elizabeth`.
- **Province** (optional -> `state`): `Gauteng` (GP), `Western Cape` (WC),
  `KwaZulu-Natal` (KZN), `Eastern Cape` (EC), `Free State` (FS), `Limpopo` (LP),
  `Mpumalanga` (MP), `North West` (NW), `Northern Cape` (NC). Written spelled
  out, occasionally abbreviated. Sits after the city, before or after the
  postcode. Optional; null when absent.
- Country: `South Africa`, `RSA`, `ZA`, `ZAF`, `Suid-Afrika`.

---

## 7. Prior work & known failure modes (>=8)

Prior art: SAPO addressing standards, UPU S42 ZA template, Smarty / PostGrid /
GeoPostcodes ZA guides, Google libaddressinput (`ZA`: `fmt`
`%N%n%O%n%A%n%D%n%C%n%Z`, i.e. street / dependent-locality(suburb) / city /
postcode — note SA has a dependent-locality slot and **no required state**),
Wikipedia "Postal codes in South Africa".

1. **Two localities, one slot (suburb + city).** `43 Cavendish Road, Yeoville,
   Johannesburg, 2198` — `Yeoville` (suburb) AND `Johannesburg` (city) both
   precede the postcode. A single-`city` grammar must pick one and drop/lose the
   other; picking the wrong one mis-routes. Primary SA failure mode.

2. **Type-less / "Main Road" ambiguity.** `Main Road`, `High Street` fine, but
   `12 Vilakazi Street` vs bare `5 Soweto` — type must be optional.

3. **Afrikaans fused type.** `10 Kerkstraat` / `25 Schoemanlaan` — the type is
   glued to the name (one token); a spaced-suffix splitter leaves the whole word
   as the street name with `type` null. Documented failure mode.

4. **4-digit code with significant leading zero.** `0001`, `0083` — an
   integer-cast or `[1-9]\d{3}` rule drops the leading zero. Must be `\d{4}`.

5. **PO Box / Private Bag dominance.** `Private Bag X9, Roggebaai, 8012`,
   `PO Box 1840, Port Elizabeth, 6000` — no thoroughfare; the `X`-prefixed
   Private Bag number and `Postnet Suite` forms break a digit-only box pattern.

6. **Province present but optional.** `... Sandton, Johannesburg, Gauteng, 2196`
   — `Gauteng` -> `state`; must not be read as a second city or as part of the
   postcode line. Two-word provinces (`Western Cape`, `North West`,
   `Northern Cape`, `KwaZulu-Natal`, `Free State`, `Eastern Cape`) tempt a
   one-token grab.

7. **Multi-word city.** `Cape Town`, `East London`, `Port Elizabeth` — one-token
   city capture truncates them.

8. **Building name before number.** `Sandton City, 83 Rivonia Road, Sandton,
   2196` — building leads; parser must not treat the building words as the
   number line.

9. **Number letter suffix / range.** `12A Long Street`, `10-12 Bree Street`.

10. **Unit / Shop prefix.** `Shop 12, 200 Church Street` and `Unit 5, 12 Rivonia
    Road` — the leading `Shop 12` / `Unit 5` is a secondary unit, not the house
    number; the real number follows the comma.

11. **City renames.** `Port Elizabeth`/`Gqeberha`, `Pretoria`/`Tshwane`,
    `Nelspruit`/`Mbombela`, `Durban`/`eThekwini` — both spellings occur.

12. **All-caps SAPO form.** SAPO recommends writing the whole address in CAPS;
    matching must be case-insensitive and not treat caps as an acronym.

---

## 8. Field-mapping decisions

- `number` — leading integer (or range), optional glued letter suffix.
- `civic_number_suffix` — trailing letter of the number.
- `street` — name without the trailing suffix type.
- `type` — trailing `Road`/`Street`/`Avenue`/`Drive`/... (or Afrikaans spaced
  form); null for type-less streets.
- `sec_unit_type` / `sec_unit_num` — `Unit`/`Flat`/`Shop`/`Suite` + value.
- `city` — the city/town before the postcode (multi-word allowed); where only a
  suburb is given, the suburb is the `city` value. Suburb+city chains noted.
- `state` — province, only if explicitly present, else null.
- `postal_code` — 4-digit, leading zeros kept; LAST.
- `country` — `ZA`.

---

## Sources

- South African Post Office (SAPO) — https://www.postoffice.co.za/
- UPU S42 ZA addressing template — https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/zafEn.pdf
- Smarty ZA format examples — https://www.smarty.com/global-address-formatting/south-africa-address-format-examples
- PostGrid ZA address format — https://www.postgrid.com/global-address-format/south-africa-address-format/
- GeoPostcodes ZA — https://www.geopostcodes.com/country/south-africa/address-format/
- Wikipedia: Postal codes in South Africa — https://en.wikipedia.org/wiki/Postal_codes_in_South_Africa
- Google libaddressinput (ZA metadata) — https://chromium-i18n.appspot.com/ssl-address/data/ZA
