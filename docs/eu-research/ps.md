# Palestine (PS) Street Address Research

Config-driven XRegExp address parser. Palestine is modelled in its **romanized /
Latin business form** (SEC / international filings); native Arabic (RTL) script is
out of scope and any Arabic-script sample is `__skip`. **There is no postcode in
general use**, so the postal pattern is a never-match sentinel and every address
parses through the postcode-absent place branch. Small-endian order.

---

## 1. Canonical address order

**(1) PO Box form:**
```
P.O. Box 4, Ramallah
PO Box 51, Nablus
P.O. Box 3005, Ramallah, Palestine
```

**(2) Physical form:**
```
[<Unit>,] <Street Name> <Type>, [<Quarter>,] <City>[, <Governorate|Territory>]
Rukab Street, Al-Masyoun, Ramallah
Omar Mukhtar Street, Gaza
Manger Street, Bethlehem, West Bank
```

Field mapping:
- **sec_unit** = a labelled leading Building / Floor / Apartment / Office.
- **street + type** = a named artery with a trailing English suffix
  (Street/Road/Avenue/Boulevard/Highway).
- **city** = the routing city (Ramallah, Nablus, Hebron, Bethlehem, Gaza, Jenin,
  Khan Yunis, Rafah, Tulkarm, Qalqilya, ...). A leading quarter (Al-Masyoun,
  Rafidia) is dropped.
- **state** = the governorate or territory (see 3).

## 2. The Arabic generic street word ("Shari")

Some arteries use the generic as a PREFIX — "Shari Al-Quds", "Sharia Jaffa",
"Share Al-Nasr". With a single type position and the English suffix primary,
these parse as whole **type-less** street names.

## 3. Governorates vs. routing cities (DISJOINT)

Palestine's 16 governorates each equal their principal city. The state pattern
therefore matches ONLY the explicit "... Governorate" spelling, plus the two
territory names **"West Bank" (-> WB)** and **"Gaza Strip" (-> GZ)**, which are
distinct from any routing city — keeping the state list DISJOINT. Governorate
codes follow ISO 3166-2:PS (Jenin -> JEN, Tubas -> TBS, Tulkarm -> TKM, Nablus ->
NBS, Qalqilya -> QQA, Salfit -> SLT, Ramallah [and al-Bireh] -> RBH, Jericho ->
JRH, Jerusalem -> JEM, Bethlehem -> BTH, Hebron -> HBN, North Gaza -> NGZ, Gaza ->
GZA, Deir al-Balah -> DEB, Khan Yunis -> KYS, Rafah -> RFH). The territory names
are kept OUT of `countryNames` so they resolve to `state`, not the country tail.

## 4. Postcode

None in general use — never-match sentinel; every address parses via the
postcode-absent branch.

## 5. Known gaps / failure modes (`__skip`)

- Arabic (RTL) script — Latin transliteration only.
- Big-endian / reversed written order.
- Stacked secondary units ("Building 3, Floor 2, ...").

## 6. Validation

`ISO2=ps npx jest --config .../jest.harness.config.cjs` -> checked=41, failures=0
(3 `__skip`).
