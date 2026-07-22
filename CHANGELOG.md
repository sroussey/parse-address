# Change Log

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