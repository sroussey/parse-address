# Postal Address Research: Bermuda (BM) & Gibraltar (GI)

Research for a street-address parser, focused on corporate / registered-agent usage in
these two offshore financial centres. Sources: Bermuda Post Office (bermudapost.bm),
Royal Gibraltar Post Office / Wikipedia (Postal codes in Bermuda; Postal addresses in
Gibraltar), Smarty global address formats, corporate registry / LEI filings (opencorpdata,
Companies House, SEC EDGAR), and building-name evidence from law-firm / registered-agent
office listings. libpostal treats both as GB-style (house-number-first, English street
types) with country-specific postcode regexes.

---

## 1. BERMUDA (country: "Bermuda", ISO "BM")

### 1.1 Line order
House **number first, then street** (British/US convention):

```
[Company Name]                     <- dropped by parser (not part of address)
[c/o Registered Agent Ltd]         <- dropped
[Building Name]                    <- e.g. Clarendon House
[Suite / Floor / PO Box]
<number> <Street> <Type>           <- e.g. 2 Church Street
<City / Parish> <POSTCODE>         <- e.g. Hamilton HM 11
BERMUDA
```

Canonical corporate example:
`Clarendon House, 2 Church Street, Hamilton HM 11` (Conyers' registered office; also used
by dozens of companies as a registered-agent address).

### 1.2 Postcode format
Two forms, both **2 letters + space + 2 characters**:

- **Street / physical postcode:** 2 letters + space + **2 digits**, e.g. `HM 11`, `HM 08`,
  `FL 07`, `DV 06`, `PG 01`, `WK 08`, `SN 01`. The first two letters identify the sub-post-
  office / parish; the two digits are the postman's delivery route. Frequently written
  **without the space**: `HM11`, `HM12`. A parser should normalise to `HM 11`.
- **PO Box postcode:** 2 letters + space + **2 letters**, e.g. `HM FX`, `HM GX`, `HM HX`,
  `HM CX`, `HM DX`, `HM EX`. First pair = post office location; second pair = box section.
  **Outside Hamilton, PO-Box postcodes always end in `BX`**, e.g. `DV BX`, `WK BX`,
  `PG BX`, `SN BX`.

So `HM 11` (street) and `HM FX` (PO box) are *both* valid postcodes — the trailing pair
is digits for street delivery, letters for boxes. This dual pattern is a common parser trap.

### 1.3 Parish / locality two-letter codes
The "city" line is usually the **parish** (or "Hamilton" for the City of Hamilton).
Observed prefix -> parish/locality mapping:

| Code | Parish / locality                                   |
|------|------------------------------------------------------|
| HM   | City of Hamilton **and** Pembroke parish (e.g. Pitts Bay / Bermudiana area = HM 08) |
| CR   | Hamilton Parish (Crawl / Bailey's Bay / Flatts area) |
| FL   | Flatts Village (Smith's Parish)                      |
| HS   | Harrington Sound (Smith's Parish)                    |
| DV   | Devonshire Parish                                    |
| PG   | Paget Parish                                         |
| WK   | Warwick Parish                                       |
| SN   | Southampton Parish                                   |
| MA   | Sandys Parish (Mangrove Bay / Somerset)             |
| SB   | Sandys Parish (Somerset Bridge)                     |
| GE   | Town of St. George / St. George's Parish            |
| DD   | St. David's / St. George's Parish                   |
| PB   | Pembroke (rare; Pembroke normally shares HM)         |

Important: the **City of Hamilton** (in Pembroke parish, corporate district) and
**Hamilton Parish** (a separate rural parish, code CR) are different places — "Hamilton"
alone in a corporate address means the City. `CR nn` is Hamilton *Parish*.

### 1.4 PO Box conventions
Written `PO Box HM 1561` or `P.O. Box HM 2069` — the box number carries the **parish
letters** (`HM 1561`, `DV 555`, `WK 118`). Full box line then repeats the parish + box-
section postcode: `PO Box HM 1561, Hamilton HM FX`. A registered office may combine
building + box: `Clarendon House, PO Box HM 1022, Hamilton HM DX`.

### 1.5 Building names (very common in corporate addresses)
Named office buildings are the norm for registered agents; the building is a real,
parseable token that should be captured as `building`. Real examples:

- **Clarendon House**, 2 Church Street, Hamilton HM 11 (Conyers)
- **Canon's Court**, 22 Victoria Street, Hamilton HM 12 (Appleby)
- **Crawford House**, 50 Cedar Avenue, Hamilton HM 11
- **Milner House**, 36 Victoria Street, Hamilton HM 15
- **Victoria Place**, 31 Victoria Street, Hamilton HM 10
- **Cumberland House**, 1 Victoria Street, Hamilton HM 11 (Cox Hallett Wilkinson)
- **Thistle House**, 4 Burnaby Street, Hamilton HM 11 (MJM)
- **Chancery Hall**, 52 Reid Street, Hamilton HM 12
- **Wessex House**, 45 Reid Street, Hamilton HM 12
- **Cedar House**, 41 Cedar Avenue, Hamilton HM 12
- **Mintflower Place**, 8 Par-la-Ville Road, Hamilton HM 08
- **Craig Appin House**, 8 Wesley Street, Hamilton HM 11
- **Waterloo House**, 100 Pitts Bay Road, Pembroke HM 08
- **Belvedere Building**, 69 Pitts Bay Road, Pembroke HM 08
- **Continental Building**, 25 Church Street, Hamilton HM 12
- **Victoria Hall**, 11 Victoria Street, Hamilton HM 11
- **Park Place**, 55 Par-la-Ville Road, Hamilton HM 11 (Walkers)

Note building names ending in "House", "Court", "Hall", "Place", "Building" — the
"Place"/"Hall" tail collides with street-type tokens (see failure modes).

### 1.6 Street types (trailing, English)
Street, Road, Avenue, Lane, Drive, Hill, Way, Close, Crescent — plus untyped named roads.
Common corporate streets: Church Street, Victoria Street, Reid Street, Front Street,
Par-la-Ville Road (hyphenated), Pitts Bay Road, Bermudiana Road, Cedar Avenue, Queen
Street, Burnaby Street, Wesley Street.

---

## 2. GIBRALTAR (country: "Gibraltar", ISO "GI"; also seen "GIB")

### 2.1 Line order (UK-style, number first)
```
[Company Name]                     <- dropped
[Suite / Unit / Floor / Block]
[Building Name]                    <- e.g. Burns House
<number> <Street> [<Type>]         <- e.g. 19 Town Range  (Range has no type)
Gibraltar  [GX11 1AA]
[GI / GIB]
```
Canonical: `Suite 1, Burns House, 19 Town Range, Gibraltar, GX11 1AA`.

### 2.2 Postcode
Gibraltar has effectively **one single postcode: `GX11 1AA`** (UK outward+inward format:
2 letters + 2 digits, space, 1 digit + 2 letters). It applies to *every* address in the
territory. **The postcode is optional for local mail**, so many valid addresses have **no
postcode at all**. A parser should accept both `... Gibraltar GX11 1AA` and `... Gibraltar`
(no code). Internal RGPO "walks"/districts (1-13, G) are *not* used in addresses.

### 2.3 City == Country
The locality is "Gibraltar" and the country is also "Gibraltar" — the same token appears
as both city and country (`Gibraltar, GX11 1AA` or `Gibraltar, Gibraltar`). Parsers that
assume distinct city/country tokens mis-handle this.

### 2.4 Corporate / registered-agent pattern (building + suite)
Multi-tenant office buildings dominate; addresses usually carry a Suite/Unit/Floor/Block
plus a building name. Real examples:

- **Suite 23, Portland House, Glacis Road, Gibraltar, GX11 1AA** (ISOLAS LLP)
- **Madison Building, Midtown, Queensway, Gibraltar, GX11 1AA** (Hassans; often
  `PO Box 199, Madison Building, ...`)
- **Burns House, 19 Town Range, Gibraltar, GX11 1AA**
- **World Trade Center, 6 Bayside Road, Gibraltar, GX11 1AA** (units like `Unit 1.02,
  1st Floor` or `Suite 5.28`)
- **Block 4, Eurotowers, Gibraltar, GX11 1AA** (suites like `Suite 4.3.02`)
- **Watergardens, Block 2 / Block 6, Gibraltar, GX11 1AA** (e.g. `Suite 9`, `Suite 24`)
- **Grand Ocean Plaza, Ocean Village, Gibraltar, GX11 1AA**
- **Neptune House, Marina Bay, Gibraltar, GX11 1AA**
- **International Commercial Centre (ICC), Casemates Square, Gibraltar, GX11 1AA**
- **Europort, Gibraltar, GX11 1AA** (e.g. `Suite 785`)

Suite numbers are frequently **dotted / compound**: `Suite 4.3.02`, `Unit 1.02`, `5.20`,
`Unit F7`.

### 2.5 PO Box
Gibraltar PO boxes are plain digits: `PO Box 199`, `PO Box 555`, `PO Box 1338` — often
prepended to a building line: `PO Box 199, Madison Building, Midtown, Queensway, Gibraltar`.

### 2.6 Street types — many streets have NO type token
UK-style types appear (Road, Street, Lane, Place) but a large share of Gibraltar's
historic streets have **no trailing type**:
- No type: **Town Range**, **Irish Town**, **Queensway**, **Europort**, **Ocean Village**,
  **Watergardens**, **Eurotowers**, **Waterport**, **Midtown**.
- With type: **Main Street**, **Library Street**, **Line Wall Road**, **Glacis Road**,
  **Bayside Road**, **Devil's Tower Road**, **Convent Place**, **Cooperage Lane**,
  **Cannon Lane**, **Secretary's Lane**, **Governor's Parade**, **Casemates Square**,
  **John Mackintosh Square**.

Apostrophes are common (Devil's Tower Road, Secretary's Lane, Governor's Parade).

---

## 3. FAILURE MODES (parser risks)

1. **Bermuda dual postcode pattern.** `HM 11` (street, 2 letters + 2 **digits**) vs
   `HM FX` (PO box, 2 letters + 2 **letters**). A regex for one form misses the other, or
   mis-reads `HM FX` as "HM" city + "FX" state.

2. **Missing space in Bermuda postcode.** `Hamilton HM11` (no space) vs `Hamilton HM 11`.
   Tokenizer may glue `HM11` or split it wrong; needs normalisation to `HM 11`.

3. **"Hamilton" is both city line and postcode prefix.** `Hamilton HM 11` — the word
   Hamilton and the letters HM both mean Hamilton; parser may double-count or drop the city.

4. **City of Hamilton vs Hamilton Parish.** "Hamilton" (City, corporate) uses HM; "Hamilton
   Parish" (rural) uses **CR**. Treating them as one locality is wrong.

5. **Company name vs building name.** `c/o Conyers Corporate Services (Bermuda) Limited,
   Clarendon House, 2 Church Street ...` — the company / registered-agent name must be
   **dropped**, but the building (`Clarendon House`) kept. Both look like proper-noun
   phrases; distinguishing them is hard.

6. **Building name whose tail is a street-type token.** `Victoria Place`, `Chancery Hall`,
   `Grand Ocean Plaza`, `Convent Place` — "Place"/"Hall"/"Plaza" resemble street types, so
   a building can be misparsed as a street (and a real `Convent Place` street misparsed as
   a building).

7. **Gibraltar single postcode / optional postcode.** Every address is `GX11 1AA` or has
   no code at all. Parsers expecting a varied or mandatory postcode fail; local-mail
   addresses (`5 Main Street, Gibraltar`) have none.

8. **Gibraltar city == country.** `Gibraltar, Gibraltar` or `Gibraltar GX11 1AA` — the same
   token is locality and country; naive splitting loses one or mislabels country.

9. **Untyped streets.** `19 Town Range`, `28 Irish Town`, `Suite 785 Europort` — no street
   type, so `type` must be null and the multi-word name (`Town Range`, `Irish Town`) kept
   whole. Greedy type-matching may wrongly strip "Town".

10. **Compound / dotted unit numbers.** `Suite 4.3.02`, `Unit 1.02`, `5.20`, `Unit F7`,
    `Suite 5.28` — dotted or alphanumeric sec-unit numbers break simple integer capture.

11. **Two PO-Box dialects.** Bermuda `PO Box HM 1561` (parish letters + digits) vs Gibraltar
    `PO Box 199` (digits only). One box regex won't cover both.

12. **Country abbreviation variance.** Bermuda: "Bermuda" / "BM". Gibraltar: "Gibraltar" /
    "GI" / "GIB". `GIB` is not the ISO code (GI) and may be misread.

13. **Hyphenated / apostrophe street names.** `Par-la-Ville Road`, `Devil's Tower Road`,
    `Governor's Parade`, `Canon's Court` — punctuation inside the name breaks whitespace
    tokenizers.

14. **Building + PO Box + street all present.** `Clarendon House, PO Box HM 1022, Hamilton
    HM DX` mixes building, box, and postcode with no street number; number/street must be
    null while building and sec_unit are populated.

15. **Parish used as the "city".** `9 Leafy Lane, Smith's FL 07`, `Waterloo House, 100 Pitts
    Bay Road, Pembroke HM 08` — the locality is a parish name (Smith's, Pembroke,
    Devonshire), not "Hamilton"; parsers keyed to a city gazetteer miss it.

16. **Civic-number suffixes / ranges.** `47a Irish Town`, `41-43 Front Street` — alphabetic
    suffix or hyphen range on the house number.
