# Federated States of Micronesia (FM) address research

ISO 3166-1 alpha-2: **fm** — SEC/EDGAR mapped country.

## Convention

- Language: **English**.
- Order: **house number first**, then street name + **trailing** English type suffix (e.g. `12 Main Street`). Type echoed verbatim (Street, Rd, Ave, ...).
- Postcode: US-style 5-digit ZIP (e.g. 96941) routed through the US postal system; modelled as an optional after-city postal with a territory abbrev (FM).
- Region/state: Pohnpei, Chuuk, Yap, Kosrae
- **PO Box is the dominant / often only address form** across the Pacific: `PO Box`, `P.O. Box`, `Post Office Box`, `Private Bag`, `Private Mail Bag` are all supported.
- A bare `village, island` line carries no street token; it is treated as a place (village -> city, island -> state) or skipped when it has no street.

## Structure mapped to fields

| field | source |
|---|---|
| number / civic_number_suffix | leading house number, optional glued letter (`14A`) |
| street / type | name + trailing English type suffix |
| sec_unit_type / sec_unit_num | leading Flat/Unit/Apt/Suite, or the PO box word + number |
| city | routing town/village (last locality of a suburb chain) |
| state | island/region (Pohnpei) |
| postal_code | 5-digit US ZIP |
| country | FM |

## Cities / localities sampled

Kolonia, Palikir, Weno, Colonia, Tofol, Lelu

## Islands / regions

Pohnpei, Chuuk, Yap, Kosrae

## Sample count

47 samples, 4 marked `__skip` (landmark / recipient / bare-village lines that carry no street token), 43 asserted.

## Sources

- Universal Postal Union (UPU) addressing notes for the Pacific island states.
- National postal operators and Smarty / PostGrid international addressing guides.
- SEC EDGAR State/Country code table (country mapping).
