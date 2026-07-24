# Syria (SY) Street Address Research

Config-driven XRegExp address parser. Syria is modelled in its **romanized /
Latin business form** (SEC / international filings); native Arabic (RTL) script is
out of scope and any Arabic-script sample is `__skip`. **There is no postcode in
practice** — a national code system exists on paper but is unused — so the postal
pattern is a never-match sentinel and every address parses through the
postcode-absent place branch. Small-endian order.

---

## 1. Canonical address order

**(1) PO Box form:**
```
P.O. Box 3320, Damascus
PO Box 2260, Damascus
P.O. Box 421, Damascus, Syria
```

**(2) Physical form:**
```
[<Unit>,] <Street Name> <Type>, [<Quarter>,] <City>[, <Governorate>]
Baghdad Street, Al-Malki, Damascus
Al-Thawra Street, Damascus
Al-Mahatta Street, Latakia, Latakia Governorate
```

Field mapping:
- **sec_unit** = a labelled leading Building / Floor / Apartment / Office.
- **street + type** = a named artery with a trailing English suffix
  (Street/Road/Avenue/Boulevard/Highway). Numbered date-names work in the
  number-first order ("March 8 Street").
- **city** = the routing city (Damascus, Aleppo, Homs, Hama, Latakia, Tartus, ...).
  A leading quarter (Al-Malki, Abu Rummaneh, Al-Aziziyah) is dropped.
- **state** = the governorate (see 3).

## 2. The Arabic generic street word ("Shari")

Some arteries are written with the generic as a PREFIX — "Shari Al-Thawra",
"Sharia Baghdad", "Share Bab Touma". With a single type position and the English
suffix primary, these parse as whole **type-less** street names.

## 3. Governorates vs. routing cities (DISJOINT)

Syria's 14 governorates mostly share a name with their capital city. The state
pattern therefore matches ONLY the explicit "... Governorate" spelling, plus the
distinct **"Rif Dimashq"** (Damascus countryside, matched bare) — keeping the
state list DISJOINT from the routing cities. `regionMap` uses ISO 3166-2:SY
codes (Damascus -> DI, Rif Dimashq -> RD, Aleppo -> HL, Homs -> HI, Hama -> HM,
Latakia -> LA, Tartus -> TA, Idlib -> ID, Deir ez-Zor -> DY, Raqqa -> RA,
Al-Hasakah -> HA, Daraa -> DR, As-Suwayda -> SU, Quneitra -> QU).

## 4. Postcode

None in general use — never-match sentinel; every address parses via the
postcode-absent branch.

## 5. Known gaps / failure modes (`__skip`)

- Arabic (RTL) script — Latin transliteration only.
- Big-endian / reversed written order.
- Stacked secondary units ("Building 12, Floor 3, ...").

## 6. Validation

`ISO2=sy npx jest --config .../jest.harness.config.cjs` -> checked=40, failures=0
(3 `__skip`).
