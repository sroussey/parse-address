# Samoa (WS) address research

ISO 3166-1 alpha-2: **ws** — SEC/EDGAR mapped country.

## Convention

- Language: **English**.
- Order: **house number first**, then street name + **trailing** English type suffix (e.g. `14 Beach Road`). Type echoed verbatim (Street, Rd, Ave, ...).
- Postcode: None. Samoa has no domestic postcode system.
- Region/state: Upolu, Savai'i, Manono, Apolima
- **PO Box is the dominant / often only address form** across the Pacific: `PO Box`, `P.O. Box`, `Post Office Box`, `Private Bag`, `Private Mail Bag` are all supported.
- A bare `village, island` line carries no street token; it is treated as a place (village -> city, island -> state) or skipped when it has no street.

## Structure mapped to fields

| field | source |
|---|---|
| number / civic_number_suffix | leading house number, optional glued letter (`14A`) |
| street / type | name + trailing English type suffix |
| sec_unit_type / sec_unit_num | leading Flat/Unit/Apt/Suite, or the PO box word + number |
| city | routing town/village (last locality of a suburb chain) |
| state | island/region (Upolu) |
| postal_code | n/a (no postcode) |
| country | WS |

## Cities / localities sampled

Apia, Salelologa, Tuasivi, Faleolo, Nofoali'i

## Islands / regions

Upolu, Savai'i, Manono, Apolima

## Sample count

45 samples, 4 marked `__skip` (landmark / recipient / bare-village lines that carry no street token), 41 asserted.

## Sources

- Universal Postal Union (UPU) addressing notes for the Pacific island states.
- National postal operators and Smarty / PostGrid international addressing guides.
- SEC EDGAR State/Country code table (country mapping).
