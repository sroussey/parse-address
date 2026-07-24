# U.S. Virgin Islands (VI) — address research

## Status
US territory (St. Thomas, St. Croix, St. John). SEC-mapped as foreign; addressed
in US style. Modelled `number-street` / `suffix` / `after-city`.

## Grammar
- **Order:** house NUMBER first, then street name + trailing type. Ranges,
  glued letter suffix and leading "#" supported.
- **Street type:** trailing US suffix set, echoed verbatim, PLUS the Danish-era
  **"Gade"** (= street) still used in Charlotte Amalie ("Norre Gade", "Kongens
  Gade", "Dronningens Gade") — registered as a type with short code GADE.
- **"Estate <Name>" localities:** USVI parcels are written "5000 Estate Enighed",
  "9901 Estate Thomas". "Estate" leads the name, so it parses as a **bare,
  type-less street** (street = "Estate Enighed") — lossless.
- **State:** territory code **VI** before the ZIP, like a US state ("Cruz Bay,
  VI 00830"). `countyPattern` also accepts "V.I." and the spelled-out "(U.S.)
  Virgin Islands"; `regionMap` normalises all to "VI".
- **Postal:** US ZIP / ZIP+4, LAST. USVI ZIPs are 008xx.
- **Country tail:** optional "USA"/"United States"/"U.S. Virgin Islands"
  consumed; `country` output always "VI".

## Cities / islands
Charlotte Amalie, Christiansted, Frederiksted, Cruz Bay, Kingshill, plus the
island names St. Thomas / St. Croix / St. John used as the routing "city".

## Secondary units
Trailing (`after`): Apt, Suite/Ste, Unit, Room/Rm, Floor/Fl, Building/Bldg, PMB.

## PO boxes
"PO Box", "P.O. Box", "PMB" → box result with city + VI + ZIP.

## Skipped forms (lossless, documented)
- "**Lot N Estate <Name>**" parcel form — "Lot" is not a house number here.
- Bare "Estate <Name>, Town, VI ZIP" with no house number — the estate would be
  taken as the street and town/territory become ambiguous.

## Corpus
`samples-vi.json`: 44 samples — 42 asserted PASS, 2 `__skip`.
Validated: `ISO2=vi` harness → failures=0.
