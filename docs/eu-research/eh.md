# Western Sahara (EH) — address research

## Status
DISPUTED TERRITORY. The areas under Moroccan administration — El Aaiún /
Laayoune, Dakhla, Smara, Boujdour — are addressed in the **Moroccan format**
(Barid Al-Maghrib / La Poste). This config is a clone of the Morocco (MA) idiom.

## Language & script
French/Latin romanized form. Native Arabic RTL script is OUT OF SCOPE (`__skip`).

## Structure (small-endian, number-first)
`<building no>[, ] <voie-type> <street name>, [<quartier>,] <city>[ <postcode>]`

- **Order:** house number FIRST, then the voie type + name ("12 Rue de Smara").
  A comma after the number is common ("12, Rue ...").
- **Type placement:** PREFIX, kept verbatim — Rue, Avenue/Av., Bd/Boulevard,
  Impasse/Imp, Place, Résidence, Lotissement, and the romanized Arabic
  "Zankat"/"Derb" for a medina street/alley. Particles (de / du / de la / des /
  d') stay with the name.
- **Quartier:** a neighbourhood ("Colomina", "Hay Essalam", "Hay Al Wahda",
  "Maatalla", "Hay Al Amal", "Hay Al Aouda") sits between street and city and
  carries no output field, so a recognised quartier is CONSUMED and DROPPED
  (`areaNames`). Unknown quartiers are a documented failure mode.
- **City:** El Aaiún / Laayoune (both spellings), Dakhla, Smara, Boujdour.
- **No administrative region** is written, so nothing lands in the state slot
  (`countyPattern` is a never-match sentinel).

## Postcode
Exactly 5 numeric digits, OPTIONAL, written AFTER the city. City routing:
70000 Laayoune, 71000 Boujdour, 72000 Smara, 73000 Dakhla. The Barid
postcode-FIRST variant ("70000 Laayoune") is a documented failure mode
(`__skip`).

## PO box
"BP" / "Boîte Postale" (Barid Al-Maghrib), e.g. "BP 1234, Laayoune".

## Country names
Written as "Western Sahara", "Sahara Occidental", or (given the administration)
"Maroc"/"Morocco"; all are consumed and the output `country` is `EH`.

## Known gaps / failure modes
- Native Arabic script (`__skip`).
- Postcode-before-city order (`__skip`).
- Unenumerated quartiers are not dropped.

## Sources
Barid Al-Maghrib addressing conventions (shared with Morocco); UPU Morocco
postal-addressing system; GeoPostcodes Western Sahara postcode ranges
(70000–73000).
