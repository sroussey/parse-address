# Change Log

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