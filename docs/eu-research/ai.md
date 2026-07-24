# Anguilla (AI) — address research

## Sources / basis
- Universal Postal Union (UPU) addressing guidelines and S42 country pages.
- ISO 3166-2:AI administrative subdivisions (parishes / dependencies / islands).
- Royal Mail / Caribbean Postal Union conventions for the former British West Indies.
- Government / business directory listings and common postal practice.

## Grammar summary
- **Order:** house NUMBER first, then street name, then a **TRAILING type** (suffix), UK-derived: e.g. `12 Market Street`.
- **Type vocabulary:** Street, Road, Avenue, Lane, Drive, Crescent, Highway, Boulevard, etc., plus Royal-Mail abbreviations (Rd, Ave, Dr, Cres, St, Blvd). Echoed verbatim.
- **House number:** optional (many rural/village addresses are street- or landmark-named). Supports ranges (`10-12`), glued letter suffix (`12A`) and a leading `#`.
- **Secondary unit:** leading, comma-separated — `Apt 2, 12 Market Street, ...` (Apartment/Apt/Flat/Unit/Suite/Shop/Lot/Room/Floor/Block).
- **PO Box:** very common — `P.O. Box 123, The Valley, ...`. Plain numeric.
- **Postcode:** Single national postcode **AI-2640** (Royal Mail-style single-code territory). Optional in the grammar; frequently omitted.
- **State (region):** the parish / island written as the last comma segment maps to `state`: (none in daily addressing; district doubles as the settlement/city). The county pattern is restricted to this list so a trailing country name (`Anguilla`) is never captured as a region.
- **Capital / principal settlement:** The Valley.

## Country name spellings accepted
Anguilla, AIA, AI
