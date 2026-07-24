# Dominica (DM) — address research

## Sources / basis
- Universal Postal Union (UPU) addressing guidelines and S42 country pages.
- ISO 3166-2:DM administrative subdivisions (parishes / dependencies / islands).
- Royal Mail / Caribbean Postal Union conventions for the former British West Indies.
- Government / business directory listings and common postal practice.

## Grammar summary
- **Order:** house NUMBER first, then street name, then a **TRAILING type** (suffix), UK-derived: e.g. `12 Market Street`.
- **Type vocabulary:** Street, Road, Avenue, Lane, Drive, Crescent, Highway, Boulevard, etc., plus Royal-Mail abbreviations (Rd, Ave, Dr, Cres, St, Blvd). Echoed verbatim.
- **House number:** optional (many rural/village addresses are street- or landmark-named). Supports ranges (`10-12`), glued letter suffix (`12A`) and a leading `#`.
- **Secondary unit:** leading, comma-separated — `Apt 2, 12 Market Street, ...` (Apartment/Apt/Flat/Unit/Suite/Shop/Lot/Room/Floor/Block).
- **PO Box:** very common — `P.O. Box 123, Roseau, ...`. Plain numeric.
- **Postcode:** No nationwide postcode in everyday use. A never-match sentinel is used; the place tail is city + parish/island.
- **State (region):** the parish / island written as the last comma segment maps to `state`: Saint Andrew, Saint David, Saint George, Saint John, Saint Joseph, Saint Luke, Saint Mark, Saint Patrick, Saint Paul, Saint Peter. The county pattern is restricted to this list so a trailing country name (`Dominica`) is never captured as a region.
- **Capital / principal settlement:** Roseau.

## Country name spellings accepted
Commonwealth of Dominica, Dominica, DMA, DM
