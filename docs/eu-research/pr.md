# Puerto Rico (PR) — address research

## Status
US territory. SEC EDGAR maps PR as a foreign "State or Country" code, but mail is
addressed in full US style. Modelled with the shared `EuCountryConfig` engine as
`number-street` / `suffix` / `after-city`.

## Grammar
- **Order:** house NUMBER first, then street name + trailing type
  ("1607 Ponce de Leon Ave"). Number supports ranges ("1607-1609"), a glued
  letter suffix ("10A"), and a leading "#".
- **Street type:** trailing US suffix, echoed verbatim (`normalizeTypeCase:false`).
  Full set: Street, Avenue, Boulevard, Road, Drive, Court, Place, Lane, Way,
  Terrace, Circle, Highway, Plaza, Parkway, Trail + Royal-Mail-style abbrevs
  (Ave, Blvd, Rd, Dr, St, Ct, Pl, Ln, Ter, Hwy, Cir, Pkwy).
- **State:** the territory code **PR** sits before the ZIP, acting like a US state
  ("San Juan, PR 00909"). Captured via `countyPattern = (?:PR|P\.R\.|Puerto\s+Rico)`
  and mapped to "PR" by `regionMap`. The list is restricted so the trailing
  country name never leaks into `state`.
- **Postal:** US 5-digit ZIP, optionally ZIP+4 — `(?<postal_code>\d{5}(?:-\d{4})?)`
  — written LAST. PR ZIPs are 006xx–009xx.
- **Country tail:** an optional trailing "USA" / "United States" / "Puerto Rico"
  is consumed; `country` output is always "PR".

## The Spanish-prefix question
PR routinely writes the generic street word as a **prefix**: "Calle Loíza",
"Ave Ponce de León", "Avenida Ashford", "Calle Marginal". Because the engine is
suffix-primary, these generics are deliberately **NOT** registered as trailing
types — doing so mis-split "Calle Marginal" into name "Calle" + type "Marginal".
Instead a prefixed name parses as a **bare, type-less street** (street = "Calle
Loíza", no `type`), which is fully lossless and asserts cleanly. Genuine trailing
US types ("Ponce de Leon **Ave**", "Chardon **Street**") still split normally.

## Secondary units
US-style TRAILING unit (`secUnitPlacement:"after"`): "150 Chardon Street, Suite
801, ...". Words: Apartment/Apt, Suite/Ste, Unit, Room/Rm, Floor/Fl,
Building/Bldg, Piso, Departamento/Depto, PMB.

## PO boxes
"PO Box", "P.O. Box", "Apartado" (Spanish), and "PMB" all parse to a box result
with city + PR + ZIP. `sec_unit_type` normalised to "PO Box" / "Apartado" / "PMB".

## Skipped forms (lossless, documented)
- Leading **urbanización** ("Urb. Santa María, Calle 5 F-10, ...") — the urb
  block has no field in the shared grammar.
- Leading **condominio** ("Cond. El Centro, ...").
- **Spanish number-after-street** order ("Calle McKinley 52") — the house number
  is not separable under a number-first grammar.

## Corpus
`samples-pr.json`: 49 samples — 46 asserted PASS, 3 `__skip`.
Validated: `ISO2=pr` harness → failures=0.
