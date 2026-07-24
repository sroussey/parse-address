# Libya (LY) — address research

## Language & script
Romanized Arabic with a French/Italian colonial layer. Native Arabic RTL script
is OUT OF SCOPE (`__skip`). Dominant romanized form is an **English suffix**
("Omar Al-Mukhtar Street, Tripoli"); the Arabic generic **"Sharia"/"Shari"/
"Share"** and French **"Rue"/"Avenue"** appear as a **prefix** ("Sharia
Al-Jumhuria", "Rue de la Republique").

## Structure (small-endian, number-first, number often absent)
`[unit,] [<building no>] <street (+suffix type | Sharia/Rue-prefix)>, [<district>,] <city>`

- **Order:** house number FIRST, usually ABSENT.
- **Type placement:** English suffix (Street/Road/Avenue/Boulevard/...). A
  leading "Sharia X" / "Rue X" / "Avenue X" is peeled to `type` in
  `postNormalize` when no English suffix type was captured.
- **Area/district = city:** a district ("Al-Andalus", "Ben Ashour", "Gargaresh",
  "Souq Al-Juma", "Hay Al-Andalus") may precede the routing city (Tripoli,
  Benghazi, Misrata, Zawiya, Sabha, Sirte, Tobruk, Khoms, Zliten, Ajdabiya,
  Al-Bayda, Derna). The LAST locality is kept as the city and any earlier
  district is dropped (`cityAllowsCommas` + postNormalize, QA-style).
- **No governorate/state field** in a romanized Libyan address — the historical
  districts (sha'biyat/baladiyat) have been repeatedly reorganised and are not
  reliably written, so the state slot is a never-match sentinel.

## Postcode
NONE. Libya operates no functioning national postal-code system; mail is routed
by street/area + city + PO box. Postal pattern is a never-match sentinel, so
every address parses through the postcode-absent branch.

## PO box
"PO Box" / "P.O. Box" (Libya Post). Widely used.

## Known gaps / failure modes
- Native Arabic script (`__skip`).
- Multiple stacked districts before the city keep only the last as the routing
  city; intermediate districts are dropped (recorded, not lost tokens).

## Sources
Libya Post (libyapost.ly) notes; UPU postal-addressing status (no postcode);
GeoPostcodes / Smarty Libya guides; romanized street-name corpora (Omar
Al-Mukhtar Street exists in most Libyan cities).
