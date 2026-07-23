# Postal Address Formats: Cayman Islands (KY) & British Virgin Islands (VG)

Research for a street-address parser. Emphasis on **corporate / registered-agent
addresses**, which dominate real-world usage for these two offshore financial
centres (SEC filings, LEI records, company registries, prospectuses). Physical
residential street addressing is comparatively rare in machine-readable data;
what you will overwhelmingly see are **PO Box + named-building** addresses tied
to law firms and corporate-services providers.

Sources consulted: Cayman Islands Postal Service / UPU addressing guide, Wikipedia
"Postal codes in the Cayman Islands" and "...British Virgin Islands", BVI Post FAQ
(bvi.gov.vg), Ugland House explainer, Maples/Walkers/Conyers/Harneys legal-notice
pages, SEC EDGAR exhibits, opencorpdata / LEI records, PostGrid & Smarty global
address-format references, OpenStreetMap/mapcarta.

---

## 1. CAYMAN ISLANDS (ISO country: KY)

### Postcode format
- Pattern: **`KY` + island-digit + `-` + 4 digits**, e.g. `KY1-1104`, `KY1-1001`,
  `KY1-9008`. Two letters, a single island digit, a hyphen, then a 4-digit
  section code. Regex: `KY[1-3]-\d{4}`.
- Introduced **2006**. Widely used and usually present in corporate addresses.
- Island digit:
  - **KY1 = Grand Cayman** (the vast majority of addresses)
  - **KY2 = Cayman Brac**
  - **KY3 = Little Cayman**
- The 4-digit section code maps to the post office / PO-box range that serves the
  address (e.g. George Town section codes: `KY1-1001`, `KY1-1002`, `KY1-1102`,
  `KY1-1103`, `KY1-1104`, `KY1-1106`, `KY1-1107`, `KY1-1108`, `KY1-1111`; law-firm
  "vanity" ranges like `KY1-9008` for Walkers, `KY1-9005/9006/9009` for Camana Bay).
- **The island name functions as the post town**, not the settlement/district.
  So mail routing keys off "Grand Cayman" + postcode, and "George Town" is
  effectively a district/locality within Grand Cayman.

### Localities / geography
- **Post towns / islands:** George Town, Grand Cayman, Cayman Brac, Little Cayman.
  (In practice both "George Town, Grand Cayman" and just "Grand Cayman" appear.)
- **Districts of Grand Cayman** (west to east): West Bay, George Town (capital),
  Bodden Town, North Side, East End. Also common area names: Seven Mile Beach,
  Camana Bay, Cricket Square.
- **Cayman Brac** settlements: Stake Bay, West End, Creek, Spot Bay.
- **Little Cayman** settlement: Blossom Village.

### Address shape
Two dominant layouts:

1. **PO Box + building (corporate / registered agent) — DOMINANT.**
   `<Agent/Company Name>, PO Box <N>, <Building>, [<Street>,] <Locality>, <Postcode>`
   e.g. `Maples Corporate Services Limited, PO Box 309, Ugland House, Grand Cayman, KY1-1104`.
   The agent/company **name is not a postal address field** (drop it). The PO Box,
   the building name, the locality, the postcode, and country are the parseable parts.

2. **House-number-first street address (British convention).**
   `<number> <Street> <Type>, <District>, <Island>, <Postcode>`
   e.g. `121 South Church Street, George Town, Grand Cayman, KY1-1104`;
   `190 Elgin Avenue, George Town, Grand Cayman, KY1-9008`.
   House number precedes the street name; the street **type word trails** (Street,
   Road, Avenue, etc.).

### Named buildings you will actually see (parse as `building`)
Ugland House (121 South Church Street — registered office of ~40,000 entities);
Willow House / Boundary Hall / Century Yard / SIX — all at **Cricket Square**;
Genesis Building (Genesis Close); Ansbacher House (20 Genesis Close);
Clifton House (75 Fort Street); Zephyr House (122 Mary Street);
Harbour Place (103 South Church Street); Elizabethan Square (Shedden Road);
Landmark Square; Buckingham Square (West Bay Road); Grand Pavilion (West Bay Road);
Governor's Square; Regatta Office Park (West Bay Road); Gardenia Court (Camana Bay);
buildings at 89 Nexus Way / One Nexus Way / Camana Bay.

### Street names & trailing English street types
Church Street (North / South), West Bay Road, North Sound Road, Elgin Avenue,
Fort Street, Mary Street, Shedden Road, Edward Street, Cardinal Avenue,
Eastern Avenue, Genesis Close, Nexus Way, Market Street, Solaris Avenue,
Dr Roy's Drive, Hutchins Drive, Smith Road, Walkers Road, Crewe Road,
Lime Tree Bay Avenue, Earth Close, Hospital Road, Seven Mile Beach.
Trailing types observed: **Street, Road, Avenue, Drive, Way, Close, Bay, Lane,
Court, Square, Highway, Plaza**.

---

## 2. BRITISH VIRGIN ISLANDS (ISO country: VG)

### Postcode format
- Pattern: **`VG` + 4 digits** with **no space or hyphen**, e.g. `VG1110`.
  Regex: `VG\d{4}`.
- Introduced **2010** and **frequently omitted** — a great many BVI corporate
  addresses in filings pre-date the scheme or simply leave it off, ending at
  "Road Town, Tortola, British Virgin Islands". Parser must treat postcode as
  optional for VG.
- Six codes in the whole territory:
  - **VG1110 = Tortola Central** (Road Town — by far the most common)
  - **VG1120 = Tortola East**
  - **VG1130 = Tortola West**
  - **VG1140 = Anegada**
  - **VG1150 = Virgin Gorda** (Spanish Town / The Valley)
  - **VG1160 = Jost Van Dyke**
- Convention: postcode is written on the **same line as the locality**, uppercase,
  right after the island name: `Road Town, Tortola VG1110` (often no comma before
  the postcode).

### Localities / geography
- **Road Town** (capital, on **Tortola**) — dominant. Note the two-level
  "Road Town, Tortola" locality; the developments **Wickhams Cay I** and
  **Wickhams Cay II** (reclaimed land in Road Town) host most corporate buildings.
- Tortola other: East End / Fat Hogs Bay (VG1120), West End / Cane Garden Bay (VG1130),
  Pasea Estate, Road Reef.
- **Virgin Gorda:** Spanish Town (a.k.a. The Valley), Nail Bay (VG1150).
- **Anegada:** The Settlement (VG1140).
- **Jost Van Dyke:** Great Harbour, Little Harbour (VG1160).

### Address shape
Same two patterns as Cayman, **PO-Box-heavy**:

1. **Building + PO Box (corporate / registered agent) — DOMINANT.**
   `[<Agent Name>,] <Building>, [<Street / Wickhams Cay>,] PO Box <N>, Road Town, Tortola[, VG1110]`
   e.g. `Sea Meadow House, PO Box 116, Road Town, Tortola, VG1110`;
   `OMC Chambers, Wickhams Cay 1, Road Town, Tortola, VG1110`.
   Note order variance: building/PO Box order swaps freely across filings.

2. **House-number-first street address** (rarer):
   `171 Main Street, PO Box 92, Road Town, Tortola, VG1110`;
   `24 De Castro Street, Wickhams Cay 1, Road Town, Tortola`.

### Named buildings you will actually see (parse as `building`)
Sea Meadow House; Harbour House (Waterfront Drive); Craigmuir Chambers (Harneys);
Rodus Building (Road Reef); OMC Chambers (Wickhams Cay 1); Vistra Corporate
Services Centre (Wickhams Cay II); Palm Grove House (Wickhams Cay); Ritter House
(Wickhams Cay II); Geneva Place (Waterfront Drive); Commerce House (Wickhams Cay 1);
Kingston Chambers (Maples); Nemours Chambers; Coastal Building (Wickhams Cay II);
Trinity Chambers; Mill Mall; Romasco Place; Flemming House; Akara Building
(24 De Castro Street — famous shell-company address); Tropic Isle Building;
Abbott Building (Main Street); Geneva Place.

### Street names & trailing English street types
Main Street, Waterfront Drive, De Castro Street, Fleming Street, Russell Hill,
Sir Francis Drake Highway, Fish Bay, Blackburne Road. Note **Wickhams Cay (1/I/II)**
is a *development/area name*, not a street with a trailing type — do not try to
split a street "type" off it. Trailing types observed: **Street, Drive, Highway,
Road, Hill, Bay**.

---

## 3. FAILURE MODES (parser gotchas)

1. **Agent/company name absorbed as a street or building.** The leading legal
   entity ("Maples Corporate Services Limited", "Walkers Corporate (BVI) Limited",
   "Overseas Management Company Trust (BVI) Ltd") is NOT an address field and must
   be dropped — but its "Limited/Ltd/(BVI)" tokens and commas invite mis-parsing
   into building/street.

2. **PO Box vs building order swaps.** Both `PO Box 309, Ugland House, ...` and
   `Ugland House, ..., PO Box 309, ...` occur. A parser keyed to position will
   mis-assign one of them.

3. **Building name mistaken for a street (no number, trailing "House"/"Chambers"/
   "Square").** "Sea Meadow House", "Craigmuir Chambers", "Cricket Square",
   "Elizabethan Square" have street-like tokens ("House", "Chambers", "Square")
   but are buildings/developments, not thoroughfares.

4. **Postcode confusion KY vs VG and hyphen handling.** `KY1-1104` has a hyphen and
   an island digit; `VG1110` has neither. Stripping the hyphen or the island digit,
   or applying VG's no-separator rule to KY, corrupts both. Also `KY1` looks like it
   could be a locality token.

5. **BVI postcode simply absent.** Many valid BVI addresses end "Road Town, Tortola,
   British Virgin Islands" with no postcode (scheme is post-2010 and optional).
   Requiring a postcode will reject real addresses.

6. **Two-level locality "Road Town, Tortola" (and "Spanish Town, Virgin Gorda").**
   Is the city "Road Town" or "Tortola"? Both appear; the settlement is Road Town,
   the island/post-region is Tortola. A single `city` field forces a choice, and the
   trailing island can be misread as a second city or as a country.

7. **Island name as post town, district demoted.** In Cayman, "Grand Cayman" is the
   routing post town while "George Town" is a district — the reverse of the usual
   city/region hierarchy. "George Town, Grand Cayman, Cayman Islands" has three
   place tokens that are locality / post-town / country respectively.

8. **"Wickhams Cay 1 / II" parsed as a street with type "Cay" or as a unit number.**
   It is a reclaimed-land development area. The trailing "1", "I", or "II" looks like
   a civic/unit number; "Cay" looks like a street type. Both are wrong.

9. **Floor / Suite / "#" tokens.** "4th Floor", "2nd Floor", "Suite 769", "#10 Main
   Street" appear mid-string. The `#` is a house-number marker in BVI, but a floor
   is a secondary unit — easy to swap number vs unit, or to read "4th" as a house
   number.

10. **Country rendered many ways.** "Cayman Islands" / "KY" and "British Virgin
    Islands" / "BVI" / "B.V.I." / "VG" all denote the same countries; "BVI" and
    "VG" can also be confused with a postcode prefix or a US-state-like token.

11. **"Grand Cayman" split by tokenizer.** Two words, no type; a naive tokenizer may
    treat "Grand" as part of a preceding street/building ("Grand Pavilion") or drop
    "Cayman" into the country field.

12. **Vanity / non-geographic section codes (KY1-9008, KY1-9005).** These 9xxx codes
    are firm-specific and don't follow the George Town 1xxx numbering — validators
    keyed to a fixed list of "real" section codes may reject them.
