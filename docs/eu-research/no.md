# Norwegian Postal Address Research (for a street-address parser/normalizer)

Sources consulted: Posten Norge (posten.no/en/sending/domestic/addressing), Bring
(bring.no), Kartverket / Matrikkelen (kartverket.no property + adresse-API,
"Adresseveileder"), Nordic Address Forum "Country Report Norway 2021", Smarty,
PostGrid, endereco.de, Wikipedia (Postal codes in Norway, Karl Johans gate,
Bogstadveien, Pilestredet, Akersgata), OpenStreetMap Norge community
(veien/vegen), libpostal, Google libaddressinput.

--------------------------------------------------------------------------------
## 1. Canonical order

Norwegian addresses run **top-to-bottom / left-to-right** as:

```
<Recipient>
[Bolignummer H0203]            (optional dwelling/apartment line, rarely used)
<Street name> <house number>[letter]
<PPPP> <City>                  (4-digit postal code BEFORE city, same line)
[NORWAY/NORGE]                 (only on international mail)
```

Key rules:
- **House number comes AFTER the street name**: `Storgata 1`, `Karl Johans gate 1`.
- **Postal code precedes the city** and is **exactly 4 digits** (leading zeros
  are significant: Oslo is `0xxx`). `0154 Oslo`, `5003 Bergen`, `7013 Trondheim`.
- **No comma** between postal code and city in official Posten formatting
  (`0154 Oslo`, not `0154, Oslo`). Free-text / CRM data frequently DOES put a
  comma between the street line and the postal line: `Storgata 1, 0155 Oslo`.
  A parser must tolerate both.
- House-number letter may be fused (`15A`) or spaced (`15 A`) — Posten shows
  `Storgata 15 A`. Both are valid; normalize to a single representation.

### The fused-vs-spaced street-type problem (central to this locale)
Norwegian street "type" is a generic word (gate/vei/plass/...). It appears two ways:

1. **Fused** into one token, almost always in the **definite** grammatical form:
   `Storgata` (= stor + gata), `Kirkeveien` (= kirke + veien), `Torggata`,
   `Bogstadveien`, `Munkegata`, `Strandgaten`, `Nygårdsgaten`.
2. **Spaced** as a separate trailing lowercase word, usually the **indefinite**
   form: `Karl Johans gate`, `Kong Oscars gate`, `Bygdøy allé`, `Sofies gate`.

So `Storgata 1` and `Karl Johans gate 1` are the SAME structural pattern; the
type is fused in the first and a standalone final word in the second. The
parser must, for a **fused** token, strip a known type suffix off the end
(`Storgata` -> name `Stor`, type `gata`); and for a **spaced** name, peel the
**last space-delimited word before the number** as the type (`Karl Johans gate`
-> name `Karl Johans`, type `gate`). When the trailing word is NOT a known type
(e.g. `Grensen`, `Bryggen`, `Marken`, `Bakklandet`), leave the whole thing as
the name and set type = null.

--------------------------------------------------------------------------------
## 2. Street types (both fused/definite and spaced/indefinite forms)

| Meaning            | Spaced / indefinite | Fused / definite endings                |
|--------------------|---------------------|-----------------------------------------|
| street             | gate, gata          | -gata, -gaten (e.g. Storgata, Strandgaten) |
| road               | vei, veg            | -veien, -vegen (Kirkeveien, Storvegen)  |
| square / plaza     | plass               | -plassen (Youngstorget uses -torget)    |
| square / market    | torg                | -torget                                 |
| path / trail       | sti                 | -stien                                  |
| bend / curve       | (sving)             | -svingen                                |
| hill / slope       | (bakke)             | -bakken                                 |
| track / lane       | (far)               | -faret                                  |
| yard / courtyard   | (tun)               | -tunet                                  |
| avenue             | allé, allee         | -alléen                                 |
| lane / narrow st.  | (stred)             | -stredet (Pilestredet)                  |
| terrace            | terrasse            | -terrassen                              |
| quay / wharf       | brygge, kai         | -brygga, -kaia                          |
| ring / gate-court  | (grend, tun, ring)  | -grenda, -ringen                        |
| common (Bergen)    | almenning           | -almenningen (Torgallmenningen)         |
| meadow / field     | eng                 | -enga, -engen                           |

Notes:
- **veien vs vegen**: bokmål uses `veien`, nynorsk uses `vegen`; both are live
  and appear on real signs. Treat as equivalent types.
- **gata vs gaten**: both are definite forms of "gate"; regional/orthographic
  variants. `-gaten` is common in older Bergen/Oslo names (Strandgaten,
  Nygårdsgaten), `-gata` in newer/eastern usage (Storgata, Torggata).
- The definite fused form is grammatical: the type suffix carries the definite
  article, so it does not appear as a separate word.

--------------------------------------------------------------------------------
## 3. House (civic) number

- Plain integer: `1`, `27`, `147`.
- Letter suffix (very common): `12B`, `15 A` (Posten prints a space; data often
  fuses). Suffix is a single uppercase letter A–Z.
- Range: `12-14` (two civic numbers joined by a hyphen; covers a building
  spanning both). Also `12–14` with en-dash in typeset text.
- The letter is a distinct field from the apartment code; do not confuse `15A`
  (building letter) with `H0203` (dwelling number).

--------------------------------------------------------------------------------
## 4. Postal code

- **Exactly 4 digits**, regex `\b\d{4}\b`. Leading zero significant.
- Range 0001–9999; roughly increases with distance from Oslo. Oslo `0001`–`12xx`,
  Bergen `50xx`, Trondheim `70xx`, Stavanger `40xx`, Tromsø `90xx`, Bodø `80xx`.
- Always immediately precedes the city name on the same line: `0154 Oslo`.
- Do not treat a 4-digit token as a house number; position (before city, or
  after a comma following the street line) disambiguates.

--------------------------------------------------------------------------------
## 5. City handling & Norwegian characters

- Cities: Oslo, Bergen, Trondheim, Stavanger, Drammen, Tromsø, Bodø, Ålesund,
  Kristiansand, Tønsberg, Fredrikstad, Sandnes, Sarpsborg, Skien, Moss, Hamar,
  Lillehammer, Gjøvik, Molde, Førde, Haugesund, Sandefjord, Larvik, Halden.
- Letters **æ ø å** (upper: Æ Ø Å) occur in both street and city names
  (Ålesund, Tromsø, Bodø, Tønsberg, Nærøy, Bygdøy, Sørkedalsveien, Grønland).
  Parser/regex must be Unicode-aware; `[A-Za-z]` alone will drop these.
- City is a single line token after the postal code; it may be multi-word
  (e.g. `Sandvika`, `Ski`, `Kolbotn`, `Nesbru`). Do not split on internal
  spaces of the city.

--------------------------------------------------------------------------------
## 6. Secondary units (dwelling / apartment)

- **Bolignummer / bruksenhetsnummer / leilighetsnummer**: format is one letter
  + four digits, e.g. `H0203`.
  - Letter: `H` = main floor (hovedetasje/above ground), `U` = basement
    (underetasje), `K` = cellar (kjeller), `L` = loft/top floor.
  - First two digits = floor of the unit entrance; last two = unit number on
    that floor counted left→right from the stairs. `H0203` = 2nd floor, unit 03.
- Placed on its **own line** after keyword `Bolignummer` in official Posten
  usage (`Bolignummer H0203`), but in free text it may trail the street line
  or lead it (`H0203 Storgata 1`, `Storgata 1 H0203`).
- Informal apartment markers also appear: `leil.` / `leilighet` (apartment),
  `oppgang` (staircase/entrance), `etg.` (floor), `postboks` (PO box).
- Only used when multiple dwellings share one street address.

--------------------------------------------------------------------------------
## 7. Country variants

- Norwegian: `Norge`. English: `Norway`. ISO alpha-2: `NO`; alpha-3 / UPU: `NOR`.
- Omitted on domestic mail; present only on international. Normalize all to `NO`.

--------------------------------------------------------------------------------
## 8. Prior work

- **libpostal** (openvenues): statistical parser trained on OSM + open data;
  handles NO but tags the whole `Karl Johans gate` as road name — good baseline,
  but does not split name vs generic type, and mis-handles rare fused types.
- **Google libaddressinput**: NO format string `%O%n%N%n%A%n%Z %C` — confirms
  postal (`%Z`) precedes city (`%C`), street block (`%A`) above. No sub-building.
- **Kartverket / Matrikkelen "adresse"** (adresse-API, Adresseveileder): the
  authoritative dataset. Distinguishes *vegadresse* (street address, `Storgata
  10`) from *matrikkeladresse* (cadastral, `33/2-2`). Fields: adressenavn,
  nummer, bokstav, bruksenhetsnummer, postnummer, poststed.
- **OpenStreetMap Norge**: `addr:street` holds the full name incl. type word;
  community debates veien/vegen normalization (keep as officially registered).
- **Nordic Address Forum Country Report Norway 2021**: municipalities are the
  address authority; addresses enter the cadastre on assignment.

--------------------------------------------------------------------------------
## 9. Failure modes (things a naive parser gets wrong) — 12

1. **Fused vs spaced type**: treating `Storgata` (fused) and `Karl Johans gate`
   (spaced) as different patterns; failing to peel the trailing `gate` word.
2. **Definite fused forms**: not recognizing `-gata`/`-gaten`/`-veien`/`-vegen`
   as type suffixes, so `Kirkeveien` is left unsplit or split wrongly.
3. **4-digit postal vs house number**: a `\d{4}` like `0154` grabbed as a civic
   number, or a leading zero stripped (`0154` -> `154`), breaking the code.
4. **æ/ø/å**: ASCII-only regex/tokenizer drops or mangles `Tromsø`, `Ålesund`,
   `Bygdøy`, `Sørkedalsveien`, `Grønland`.
5. **`12B` letter suffix**: splitting `12B` into `12` + stray `B`, or losing the
   letter; confusing `15 A` (spaced) with a separate token.
6. **Ranges `12-14`**: parsing only the first number, or treating the hyphen as
   a matrikkel `gnr/bnr` separator.
7. **Multi-word street names**: `Waldemar Thranes gate`, `Olav Tryggvasons gate`,
   `Kong Oscars gate` — greedy "first word = name" or "last word = city" errors.
8. **Lowercase standalone type word**: `gate`, `vei`, `allé`, `plass` after the
   name look like ordinary words and get merged into the name or dropped.
9. **Genitive-`s` name endings**: `Johans`, `Oscars`, `Tryggvasons`, `Meyers`
   look like they carry a type/plural; the genitive `-s` belongs to the NAME.
10. **Unsplittable names**: `Grensen`, `Bryggen`, `Marken`, `Bakklandet`,
    `Pilestredet` — forcing a type split produces garbage; type must be null (or
    handled as a rare type like `-stredet`).
11. **Apartment `H0203`**: mistaking the dwelling code for a house number,
    postal code (it has a letter), or building letter; or dropping the `leil.`
    marker entirely.
12. **Comma / country noise**: comma between street and postal line, or trailing
    `Norge`/`Norway`/`NO`/`NOR`, throwing off field boundary detection.
