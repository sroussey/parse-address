# Cook Islands (CK) address research

ISO 3166-1 alpha-2: **ck** — SEC/EDGAR mapped country.

## Convention

- Language: **English**.
- Order: **house number first**, then street name + **trailing** English type suffix (e.g. `6 Ara Tapu Road`). Type echoed verbatim (Street, Rd, Ave, ...).
- Postcode: None. Cook Islands has no domestic postcode system.
- Region/state: Rarotonga, Aitutaki, Atiu, Mangaia, Mauke, Mitiaro, Manihiki, Penrhyn, Pukapuka, Rakahanga, Palmerston
- **PO Box is the dominant / often only address form** across the Pacific: `PO Box`, `P.O. Box`, `Post Office Box`, `Private Bag`, `Private Mail Bag` are all supported.
- A bare `village, island` line carries no street token; it is treated as a place (village -> city, island -> state) or skipped when it has no street.

## Structure mapped to fields

| field | source |
|---|---|
| number / civic_number_suffix | leading house number, optional glued letter (`14A`) |
| street / type | name + trailing English type suffix |
| sec_unit_type / sec_unit_num | leading Flat/Unit/Apt/Suite, or the PO box word + number |
| city | routing town/village (last locality of a suburb chain) |
| state | island/region (Rarotonga) |
| postal_code | n/a (no postcode) |
| country | CK |

## Cities / localities sampled

Avarua, Arorangi, Titikaveka, Matavera, Ngatangiia, Nikao, Tupapa, Muri, Amuri, Arutanga

## Islands / regions

Rarotonga, Aitutaki, Atiu, Mangaia, Mauke, Mitiaro, Manihiki, Penrhyn, Pukapuka, Rakahanga, Palmerston

## Sample count

45 samples, 4 marked `__skip` (landmark / recipient / bare-village lines that carry no street token), 41 asserted.

## Sources

- Universal Postal Union (UPU) addressing notes for the Pacific island states.
- National postal operators and Smarty / PostGrid international addressing guides.
- SEC EDGAR State/Country code table (country mapping).
