# Papua New Guinea (PG) postal-address research

Scope: parse and normalize PNG street addresses for a config-driven
`EuCountryConfig`. PNG uses the **English** convention: number-first with a
trailing street type, a 3-digit postcode after the city (very often omitted), and
a province that maps to `state`.

Sources
- Post PNG — national operator; PO-box and street delivery; 3-digit postcodes.
- UPU "Postal addressing systems — PNG" note.
- Smarty "Papua New Guinea address format examples": city, 3-digit postcode, then
  administrative area; "Peter Aisoli, 123 Independence Avenue, Port Moresby 121";
  "P.O. Box 123, Lae 411".
- PostGrid PNG guide (3-digit "999" postcode; province last).
- PNG National Gazette cadastral records (Section/Allotment): "Allotment 2, Section
  438, Town of Hohola"; "Section 225 Lot 03 Kunai Street Hohola"; "Section:19,
  Allotment:19, Wards Road, Hohola" — the numbered Section/Lot (Allotment) system
  used across Port Moresby suburbs.

## 1. Line order — NUMBER FIRST, trailing type
`[unit?] [number?] [street-name] [type]`, then `[suburb?] [city] [postcode(3)?]
[province?]`.
- English trailing suffix: "123 Independence Avenue", "34 Kennedy Road".
- Urban lots often use the **cadastral** form "Section N Lot N" (a numbered
  allotment with no street type), sometimes with a street: "Section 225 Lot 3,
  Kunai Street, Hohola". With a number-first grammar the bare "Section N Lot N" is
  captured whole as the street name (lossless), since it has no trailing type word.
- A suburb (Hohola, Boroko, Waigani, Gordons, Gerehu, ...) commonly sits between the
  street and the city.

## 2. Postcode — 3 digits, AFTER the city, often omitted
- Three digits (e.g. Port Moresby 121/111/125/131, Lae 411, Mount Hagen 281,
  Madang 511, Goroka 441). Written after the city.
- **Very frequently omitted** — "Port Moresby" alone is common. The grammar makes
  the postcode optional (postcode-present and postcode-absent place branches).
- When a province follows the postcode ("Port Moresby 121, National Capital
  District"), the 3-digit code can land inside the city slot; `postNormalize` peels
  a trailing 3-digit run off the final city back into `postal_code`.

## 3. Street types (trailing suffix)
Street (St), Avenue (Ave), Road (Rd), Drive (Dr), Highway (Hwy), Place, Crescent
(Cres), Parade (Pde), Close, Court, Lane, Terrace, Esplanade, Way, Loop, Circuit,
Boulevard. Kept verbatim; rightmost type word wins.

## 4. Suburb + city + province chain (single city slot)
Modelled exactly like South Africa: `cityAllowsCommas` keeps the "suburb, city"
(and optional trailing province) chain together; `countyPattern` is the province
alternation so only a real province lands in `state`; `postNormalize` folds a
trailing province to `state`, keeps the last non-province locality as the city, and
records earlier suburb(s) as dropped. English suffix-type streets are greedy up to
the first comma, so a suburb never steals street tokens.

## 5. Province — optional -> state
22 provinces + National Capital District + Autonomous Region of Bougainville.
Codes follow ISO 3166-2:PG: NCD, Morobe MPL, Western Highlands WHM, Eastern
Highlands EHG, Madang MPM, East New Britain EBR, West New Britain WBK, East Sepik
ESW, New Ireland NIK, Southern Highlands SHM, Chimbu/Simbu CPK, Central CPM, ...

## 6. Secondary units (leading)
Apartment (Apt), Unit, Flat, Suite, Floor, Room, Haus (Tok Pisin "house") —
leading units. Rare in practice; PO boxes dominate business mail.

## 7. PO box
"P.O. Box" / "PO Box" ("P.O. Box 123, Lae 411"); "Private Mail Bag" (PMB); "Box".
Box number is not a house number.

## 8. Cities / suburbs / postcodes (reference)
Port Moresby (111 Town, 121 Boroko/Korobosea, 125 Konedobu, 131 Waigani/Gordons/
Gerehu), Lae 411, Mount Hagen 281, Madang 511, Goroka 441, Wewak 531, Kokopo 613,
Rabaul 611, Kimbe 621, Mendi 371, Kundiawa 351, Kavieng 631. POM suburbs: Town,
Boroko, Hohola, Waigani, Gordons, Gerehu, Korobosea, Konedobu, Badili.

## 9. Failure modes (parser MUST handle, or intentionally skip)
1. Postcode omitted: "123 Independence Avenue, Port Moresby".
2. Postcode present after city: "123 Independence Avenue, Port Moresby 121".
3. Cadastral Section/Lot captured whole as street: "Section 34 Lot 12, Hohola,
   Port Moresby" (suburb Hohola dropped).
4. Section/Lot + postcode: "Section 51 Lot 1, Hohola, Port Moresby 121".
5. Suburb + city chain: "Waigani Drive, Waigani, Port Moresby 131" → city Port
   Moresby, suburb dropped.
6. Postcode + province: "12 Musgrave Street, Port Moresby 121, National Capital
   District" — postcode peeled from city, province → state NCD.
7. Province only (no postcode): "Section 225 Lot 3, Hohola, Port Moresby, National
   Capital District".
8. Multiword name: "1 Sir John Guise Drive"; "8 Hubert Murray Highway".
9. PO box + city + postcode: "P.O. Box 1713, Mount Hagen 281".
10. Number range / glued letter: "12-14 Cameron Road"; "8A Taurama Road".
11. Explicit country "Papua New Guinea" / "PNG".
12. **[SKIP]** comma-separated Allotment/Section ("Allotment 2, Section 438,
    Hohola, Port Moresby") — the comma splits them; only the first fragment stays
    in `street` (the Section fragment is dropped).
13. **[SKIP]** rural village + district + province chain ("Kwikila Village, Rigo,
    Central") — the division would be taken as the city.
14. **[SKIP]** care-of prefix ("c/- Post PNG, PO Box 1, Port Moresby").
15. **[SKIP]** leading building name with no keyword set ("Haus Win, Section 5 Lot
    5, Hohola, Port Moresby").
