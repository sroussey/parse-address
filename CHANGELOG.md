# Change Log

## 3.3.0

### Features

- make IntlAddressParser a uniform auto-detecting superset
- enforce token-preservation invariant with lossless fallback
- add token-preservation detector calibrated against the corpus
- make version match
- add mirroring to github packages (#17)

#### ca

- recognize SEC EDGAR Canadian region codes (A0-B0, Z4)

### Bug Fixes

- preserve plus4 in lossless fallback; guard IntlAddressParser override
- remove masking city-abbrev and PO-box exemptions from token-drop detector
- stop country/PO-box exemptions from masking real token drops
- capture attached-letter civic number suffix (123A)
- capture full French compound street names (greedy street_5)
- throw on unsupported country in AddressParser constructor
- update away from shared workflow

#### ca

- don't use SEC region codes for country detection

#### esm

- make ESM output Node-loadable via tsc-alias (extensionless source)

#### build

- make the build and tests pass under TypeScript 6.x

### Refactors

- address parsing for European countries by consolidating postal code handling. Introduce field-time repair rules for Bermuda, Great Britain, Cayman Islands, and British Virgin Islands to enhance postal code normalization. Update parser to utilize new postal utilities and streamline country key resolution. This improves address accuracy and expands support for various postal formats.
- scope token-drop detector to the street segment

### Tests

- lock postal_code as the sole postal field (no zip)

### Documentation

- note streetSegment boundary-collision limit; clarify dist-tag steps
- add release runbook
- document Canadian usage, fields, detection, and the zip->postal_code migration
- pin country-detection precedence contract with tests

### Chores

- update package.json and version
- node version in tag pipeline
- gh pack test
- gh pack test

### Updated Dependencies

- `xregexp`: ^5.1.2
- `@types/jest`: ^30.0.0
- `@types/node`: ^24.13.4
- `browserify`: ^17.0.1
- `jest`: ^30.5.1
- `ts-jest`: ^29.4.12
- `ts-node`: ^10.9.2
- `typescript`: ^6.0.3

## 3.2.0

### New features
- Expanded coverage to **220 jurisdictions** (US, CA + 218 countries and
  territories), up from the original US/CA + Western-European set. Every country
  and territory mapped by a SEC EDGAR "State or Country" code is now supported —
  the Americas, Africa, the Middle East, South/Central/Southeast Asia, the
  Pacific, the Caribbean, the offshore financial centres, and the Crown
  Dependencies — each as a declarative config on the shared engine. Non-Latin
  scripts (CJK, Cyrillic, several South/Southeast-Asian scripts) are covered in
  Latin transliteration.
- Recognize SEC EDGAR European region codes (`A0`–`B0`, `Z4`) in the province
  slot. They normalize to the canonical province code (e.g. `A8` → `QC`), so an
  EDGAR-style address (`"…, Montreal, A8, H1A 1A1"`) parses cleanly instead of
  collapsing the tail into `street`. `IntlAddressParser` also treats them as a
  Canadian signal for auto-detection.

## 3.1.0

### New features
- Recognize SEC EDGAR Canadian region codes (`A0`–`B0`, `Z4`) in the province
  slot. They normalize to the canonical province code (e.g. `A8` → `QC`), so an
  EDGAR-style address (`"…, Montreal, A8, H1A 1A1"`) parses cleanly instead of
  collapsing the tail into `street`. `IntlAddressParser` also treats them as a
  Canadian signal for auto-detection.

## 3.0.0

### Breaking changes
- The postal field is now `postal_code` (was `zip`) across US and CA results.
  **Migration:** grep your code for `.zip` on parse results and rename to
  `.postal_code`. The `plus4` field is unchanged.

### New features
- Canadian address parsing (`new AddressParser('ca')`).
- `IntlAddressParser` auto-detects US vs CA and accepts an optional `country`
  override on every method; it is a uniform superset of `AddressParser`.
- New fields: `province`, `postal_code`, `fsa`, `ldu`, `civic_number_suffix`.

### Fixes
- French compound street names ("Avenue du Parc") no longer truncate.
- Attached-letter civic numbers ("123A") populate `civic_number_suffix`.
- Unsupported country in the `AddressParser` constructor now throws.
- Token-preservation guarantee: a parse never silently drops a street token.