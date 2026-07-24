# Egypt (EG) — address research

## Language & script
Romanized Arabic is the working Latin form. Native Arabic RTL script is OUT OF
SCOPE (marked `__skip`). The dominant romanized street pattern is an **English
suffix** ("Talaat Harb Street", "26 July Street", "Abbas El Akkad Street"); the
Arabic generic **"Sharia"/"Shari"/"Share"/"El Sharia"** ("street") appears as a
**prefix** ("Sharia Qasr El Nil"); French-derived "Avenue"/"Corniche" survive
from the colonial layer.

## Structure (small-endian, number-first, number often absent)
`[unit,] [<building no>] <street (+suffix type | Sharia-prefix)>, <district/area>, <governorate>[ <postcode>]`

- **Order:** house number FIRST, frequently ABSENT. A leading "26" in "26 July
  Street" is grammar-read as a house number (the street is really *named* 26
  July) — a documented limitation.
- **Numbered streets/roads:** very common in the planned districts ("Road 9",
  "Street 100" in Maadi; "Road 231" in Degla). They carry the type word FIRST +
  a number, so the suffix grammar keeps the whole "Road 9" as a type-less name.
  Number-street order keeps digits legal inside the street slot; the city slot is
  kept digit-free so a numbered road cannot leak into the city.
- **Type placement:** English suffix (Street/Road/Avenue/Boulevard/Corniche/
  Square). A leading "Sharia X" is peeled to `type="Sharia"` in `postNormalize`
  when no English suffix was captured (the engine's single `typePlacement` is
  `suffix`; the prefix is handled declaratively via postNormalize).
- **Area/district = city** (Maadi, Zamalek, Nasr City, Heliopolis, Mohandessin,
  Downtown, Garden City, Mokattam). An earlier district in a district+area chain
  is dropped (`cityAllowsCommas` + postNormalize keeps the routing locality).
- **Governorate = state**, a restricted list DISJOINT from the districts (Cairo,
  Giza, Alexandria, Qalyubia, ... 27 total), kept spelled out. Only a real
  governorate may fall into the state slot (`countyPattern`).

## Postcode
5 numeric digits, a NEW system with low adoption — usually ABSENT. When present
it sits AFTER the city (after-city). Optional in the grammar.

## PO box
"PO Box" / "P.O. Box" (Egypt Post). Common for businesses.

## Known gaps / failure modes
- Native Arabic script (`__skip`).
- Nested new-city district chains ("Fifth Settlement, New Cairo, Cairo") beyond
  one district+area+governorate are not fully modelled.
- "26 July Street" splits the "26" as a house number (see above).

## Sources
Egypt Post (egyptpost.org) addressing guidance; UPU postal-addressing notes;
GeoPostcodes / Smarty Egypt guides; common romanized business-address corpora.
