# Jordan (JO) Street Address Research

Config-driven XRegExp address parser. Jordan is modelled in its **romanized /
Latin business form** as used in SEC and international filings; the native Arabic
(RTL) script is out of scope and any Arabic-script sample is marked `__skip`.
Small-endian order: an optional house number leads, then the street, then the
locality chain, then (optionally) a 5-digit postcode.

---

## 1. Canonical address order

**(1) PO Box form** (very common for corporate filings):
```
P.O. Box 940631, Amman 11194
PO Box 212, Irbid 21110
P.O. Box 5040, Amman, Jordan
```

**(2) Physical form:**
```
[No. <n>,] <Street Name> <Type>, [<District>,] <City> [<NNNNN>][, <Governorate>]
No. 12, Zahran Street, Abdoun, Amman 11118
Wasfi Al-Tal Street, Amman 11953
No. 15, King Abdullah Street, Irbid, Irbid Governorate
```

Field mapping:
- **number** = optional civic/house number, bare or marked `No.` ("No. 12"). It is
  frequently ABSENT — most named-street lines start with the street.
- **sec_unit** = a labelled leading unit/building ("Building 5", "Flat 3",
  "Office 402", "Building No. 15") mapped to `sec_unit_type` + `sec_unit_num`.
- **street + type** = a named artery with a trailing English suffix
  (Street/Road/Avenue/Boulevard/Highway/Circle). Many names are multi-word
  ("Wasfi Al-Tal", "King Abdullah", "Al-Madina Al-Munawwara").
- **city** = the routing / postcode-bearing locality (Amman, Irbid, Zarqa, Aqaba,
  Madaba, Karak, ...). A leading sub-district (Abdoun, Shmeisani, Al-Sweifieh,
  Al-Weibdeh, Khalda) is captured with the city and then dropped.
- **state** = the GOVERNORATE, but only in its explicit "... Governorate" spelling.
- **postal_code** = 5 digits, written after the city ("Amman 11118"); optional.

## 2. The Arabic generic street word ("Shari")

Some arteries are written with the Arabic generic **as a prefix** — "Shari
Al-Quds", "Sharia Al-Madina", "Share Al-Jamiaa". The engine takes a single type
position and the English suffix is primary, so a Shari-prefixed name parses as a
whole **type-less** street name (`street` = "Shari Al-Quds", no `type`). This is
the documented, intentional handling.

## 3. Governorates vs. routing cities (DISJOINT)

Jordan's 12 governorates (Amman, Irbid, Zarqa, Balqa, Madaba, Mafraq, Jerash,
Ajloun, Karak, Tafilah, Ma'an, Aqaba) each share a name with their capital city,
which is also a routing city. To keep the state list DISJOINT from the routing
cities (a bare governorate name would otherwise steal the city slot and truncate
the street), the state pattern matches ONLY the explicit "**... Governorate**"
spelling. `regionMap` maps each to its ISO 3166-2:JO letter code (Amman -> AM,
Irbid -> IR, Zarqa -> AZ, Balqa -> BA, Madaba -> MD, Mafraq -> MA, Jerash -> JA,
Ajloun -> AJ, Karak -> KA, Tafilah -> AT, Ma'an -> MN, Aqaba -> AQ).

## 4. Postcode

Jordan Post uses 5-digit postal codes written AFTER the city ("Amman 11118").
They are OPTIONAL in practice, so the postcode-absent place branch also parses
("Rainbow Street, Amman").

## 5. Known gaps / failure modes (all `__skip` in samples)

- Arabic (RTL) script — Latin transliteration only.
- Big-endian / reversed written order (city first) is not modelled.
- Stacked secondary units ("Building 5, Flat 3, ...") exceed the single
  secondary-unit slot.
- A dropped sub-district that itself contains the routing-city name
  ("Jabal Amman" inside "Amman") confuses the token-boundary finder; such
  districts are avoided (Al-Weibdeh, Khalda, Abdoun, Shmeisani used instead).

## 6. Validation

`ISO2=jo npx jest --config .../jest.harness.config.cjs` -> checked=44, failures=0
(3 `__skip`).
