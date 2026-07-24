# Sudan (SD) — address research

## Language & script
Romanized Arabic. Native Arabic RTL script is OUT OF SCOPE (`__skip`). Dominant
romanized form is an **English suffix** ("Africa Street", "Airport Road", "Nile
Street") with numbered planned streets ("Street 15", "Street 41", "Street 60");
the Arabic generic **"Sharia"/"Shari"/"Share"** appears as a **prefix** ("Sharia
Al-Jamhouria").

## Structure (small-endian, number-first, number often absent)
`[unit,] [<building no>] <street (+suffix type | Sharia-prefix)>, [<district>,] <city>, <state>[ <postcode>]`

- **Order:** house number FIRST, usually ABSENT.
- **Numbered streets:** common in Khartoum's grid ("Street 15" in Al-Amarat).
  Type word first + number -> kept whole as a type-less name (suffix grammar).
- **Type placement:** English suffix (Street/Road/Avenue/...). A leading "Sharia
  X" is peeled to `type="Sharia"` in `postNormalize` when no English suffix was
  captured.
- **Area/district = city** (Al-Amarat, Al-Riyadh, Burri, Al-Sahafa, Arkaweet,
  Al-Taif; the tri-city Khartoum / Omdurman / Bahri as routing cities; Port
  Sudan, Wad Madani, Kosti, El Obeid, Nyala, El Fasher, Atbara). An earlier
  district in a chain is dropped.
- **Governorate (wilaya) = state**, a restricted list DISJOINT from the districts
  (Khartoum, Gezira/Al Jazirah, Kassala, Red Sea, River Nile, Northern, White
  Nile, Blue Nile, the three/five Kordofan & Darfur states, Gedaref/Al Qadarif,
  Sennar — 18 total), kept spelled out. Only a real state may fall into the state
  slot (`countyPattern`). Note "Khartoum" is both a state and a city; when it is
  the sole locality it is taken as the city, and as the second locality it is the
  state.

## Postcode
5 numeric digits, RARE and usually ABSENT. After the city when present. Optional.

## PO box
"PO Box" / "P.O. Box" (Sudan Post — SudaPost). Very common; historically the
primary delivery channel.

## Known gaps / failure modes
- Native Arabic script (`__skip`).
- Deep district chains keep only the last district as the city.

## Sources
Sudan Post / SudaPost notes; UPU postal-addressing status; GeoPostcodes / Smarty
Sudan guides; Khartoum numbered-street corpora.
