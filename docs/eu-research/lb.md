# Lebanon (LB) Street Address Research

Config-driven XRegExp address parser. Lebanon is modelled in its **romanized /
Latin business form** (SEC / international filings); native Arabic (RTL) script is
out of scope and any Arabic-script sample is `__skip`. Lebanese addressing is
largely **area-based**: a national postal code (4-digit + optional 4-digit
extension) exists but is rarely written, so the postcode is **OPTIONAL and usually
absent**. Small-endian order.

---

## 1. Canonical address order

**(1) PO Box form** (dominant for corporate mail; the box carries a zone-hyphen
number):
```
P.O. Box 11-3644, Beirut
PO Box 70, Jounieh
Post Box 175220, Beirut, Lebanon
```

**(2) Physical form:**
```
[<Named Building>,] <Street Name> <Type>, [<Quarter>,] <City>[, <Governorate>]
Hamra Street, Achrafieh, Beirut
Sofil Center, Charles Malek Avenue, Achrafieh, Beirut
Main Road, Jounieh, Mount Lebanon
```

Field mapping:
- **sec_unit_num** for a PO box keeps the Lebanese **zone-hyphen** form intact
  ("11-3644"); the default box-number pattern already admits the hyphen.
- **building** = an optional leading named building ("Azarieh Building", "Starco
  Center", "Gefinor Center", "Sofil Center"), captured via `buildingKeywords`
  (Building, Tower, Center/Centre, Plaza, Residence, Complex).
- **sec_unit** = a labelled leading Floor / Apartment / Office / (numbered)
  Building.
- **street + type** = a named artery with a trailing English suffix
  (Street/Road/Avenue/Boulevard/Highway).
- **city** = the routing city (Beirut, Tripoli, Sidon, Jounieh, Byblos, Zahle,
  Tyre, ...). A leading quarter (Achrafieh, Gemmayzeh, Verdun, Manara) is dropped.
- **state** = the governorate (see 3).
- **postal_code** = optional 4-digit (+ optional 4-digit) after the city.

## 2. The French / Arabic generic street word

Some arteries use the generic as a PREFIX — "Rue Gouraud", "Rue Hamra", "Corniche
El Nahr". With a single type position and the English suffix primary, these parse
as whole **type-less** street names.

## 3. Governorates vs. routing cities (DISJOINT)

Lebanon's 8+ muhafazat. The distinct compound names are matched bare (Mount
Lebanon -> JL, Beqaa/Bekaa -> BI, Baalbek-Hermel -> BH, plus "North Lebanon" -> AS
and "South Lebanon" -> JA). The names that equal a city (Beirut, Nabatieh, Akkar)
or are bare compass words (North, South) require the explicit "... Governorate"
spelling so they stay DISJOINT from the routing cities they'd otherwise truncate
(Beirut Governorate -> BA, Nabatieh Governorate -> NA, Akkar Governorate -> AK).

## 4. Postcode

Optional 4-digit code with an optional 4-digit sector extension ("Beirut 2038
3054"). Most lines carry no postcode and parse through the postcode-absent branch.

## 5. Known gaps / failure modes (`__skip`)

- Arabic (RTL) script — Latin transliteration only.
- A dropped quarter that contains the routing-city name ("Beirut Central
  District" / "Ras Beirut" inside "Beirut") defeats the token-boundary finder;
  such quarters are avoided in samples (Achrafieh, Gemmayzeh, Verdun, Manara).
- Big-endian / reversed written order.
- Stacked secondary units ("Floor 3, Apartment 5, ...").

## 6. Validation

`ISO2=lb npx jest --config .../jest.harness.config.cjs` -> checked=41, failures=0
(4 `__skip`).
