# Northern Mariana Islands (MP / CNMI) — address research

## Status
US commonwealth (Saipan, Rota, Tinian). SEC-mapped as foreign; addressed in US
style. Modelled `number-street` / `suffix` / `after-city`.

## Grammar
- **Order:** house NUMBER first, street name + trailing type ("355 As Lito
  Road"). Ranges, glued letter suffix, leading "#" supported.
- **Street type:** trailing US suffix set (incl. Loop), echoed verbatim. Named
  roads are common: Beach Road, Middle Road, As Lito Road, Airport Road.
- **Chamorro "Chalan" prefix:** as on Guam, streets are named "Chalan <X>"
  ("Chalan Monsignor Guerrero", "Chalan Kiya", "Chalan Kanoa") — a PREFIX, so
  these parse as **bare, type-less streets** (lossless).
- **State:** territory code **MP** (or "CNMI") before the ZIP ("Saipan, MP
  96950"). `countyPattern = (?:MP|Northern\s+Mariana\s+Islands|CNMI)`,
  `regionMap → MP`.
- **Postal:** US ZIP / ZIP+4, LAST. CNMI ZIPs: Saipan 96950, Rota 96951,
  Tinian 96952.
- **Country tail:** optional "USA"/"United States"/"Northern Mariana Islands"/
  "CNMI" consumed; output "MP".

## Routing "city"
Primarily the island (Saipan / Rota / Tinian) or a Saipan village used directly
as the city (Garapan, Chalan Kanoa, Susupe, San Antonio, Kagman, Dandan, Gualo
Rai, Capitol Hill, San Jose).

## Secondary units
Trailing (`after`): Apt, Suite/Ste, Unit, Room/Rm, Floor/Fl, Building/Bldg, PMB.
PMB (private mail box) and PO boxes are heavily used.

## PO boxes
"PO Box", "P.O. Box", "PMB" → box result with island/village + MP + ZIP.

## Skipped forms (lossless, documented)
- Bare "Saipan, MP 96950" (no street/box) — no-street line, city collapses.
- Village + island double locality with no house number ("Chalan Kanoa, Saipan,
  MP 96950") — the shared grammar carries a single locality level.

## Corpus
`samples-mp.json`: 42 samples — 40 asserted PASS, 2 `__skip`.
Validated: `ISO2=mp` harness → failures=0.
