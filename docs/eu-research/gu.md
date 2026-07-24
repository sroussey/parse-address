# Guam (GU) — address research

## Status
US territory. SEC-mapped as foreign; addressed in full US style. Modelled
`number-street` / `suffix` / `after-city`.

## Grammar
- **Order:** house NUMBER first, then street name + trailing type ("155 Ypao
  Road"). Ranges, glued letter suffix, leading "#" supported.
- **Street type:** trailing US suffix set (incl. Loop), echoed verbatim.
- **Chamorro "Chalan" prefix:** Guam names its streets "Chalan <X>" (Chalan =
  road): "Chalan Palasyo", "Chalan Santo Papa", "Chalan San Antonio". Like
  Puerto Rico's "Calle", "Chalan" is a PREFIX, so these parse as **bare,
  type-less streets** (street = "Chalan Palasyo") — lossless.
- **"Route N" roads:** "788 Route 4", "125 Route 8" — "Route" is not a type, so
  the whole "Route 4" is the (bare) street name; house number stays separate.
- **State:** territory code **GU** before the ZIP, like a US state ("Agana
  Heights, GU 96910"). `countyPattern = (?:GU|Guam)`, `regionMap → GU`.
- **Postal:** US ZIP / ZIP+4, LAST. Guam ZIPs are 969xx (Hagåtña 96910,
  Tamuning 96913, Dededo 96929, etc.).
- **Country tail:** optional "USA"/"United States"/"Guam" consumed; output "GU".

## Villages (routing "city")
Hagåtña (Hagatna), Agana Heights, Tamuning, Tumon, Dededo, Yigo, Mangilao,
Barrigada, Mongmong, Sinajana, Yona, Piti, Asan, Ordot.

## Secondary units
Trailing (`after`): Apt, Suite/Ste, Unit, Room/Rm, Floor/Fl, Building/Bldg, PMB.

## PO boxes
"PO Box", "P.O. Box", "PMB" → box result with village + GU + ZIP.

## Skipped forms (lossless, documented)
- Bare "Route N, Village, GU ZIP" with no house number — "Route N" is taken as
  the street, leaving no separable city.

## Corpus
`samples-gu.json`: 42 samples — 41 asserted PASS, 1 `__skip`.
Validated: `ISO2=gu` harness → failures=0.
