# Netherlands (Dutch) Postal Address Research

Research to power a TypeScript / XRegExp street-address parser & normalizer.
Sources consulted: PostNL norms, Wikipedia (Postal codes in the Netherlands),
UPU addressing guide (nldEn.pdf), Bert Hubert's BAG writeup, libpostal / Google
libaddressinput conventions, OpenStreetMap NL tagging, smarty/geopostcodes/postgrid
address-format guides, and Dutch-language sources on huisnummer toevoegingen.

---

## 1. Canonical address order

A Dutch address is written street-then-number, with the postcode BEFORE the city:

```
<Recipient name>
<Street name> <House number><toevoeging>
<Postcode>  <CITY>
Nederland
```

Concrete example (PostNL):

```
Jansen
Kalverstraat 92
1012 PH  AMSTERDAM
Nederland
```

Key ordering facts:
- **House NUMBER comes AFTER the street name** (opposite of US/UK "92 Kalverstraat").
  This is the single most important structural fact for the parser.
- The **postcode PRECEDES the city** on the same line: `1012 PH AMSTERDAM`.
- PostNL norm: postcode and city on ONE line; a single space between the 4 digits
  and 2 letters; a DOUBLE space between the postcode and the city; city often in
  ALL CAPS on machine-printed mail (but mixed case is common and valid).
- **No province** appears in a normal address line.
- The pair **(postcode + house number)** uniquely identifies an address in NL.
  Because of this, the street name and even the city are technically redundant —
  a valid Dutch address can be delivered on just `1012 PH 92`. Parsers should not
  assume the street token is always present.

---

## 2. Street names and fused street types

Like German, Dutch very frequently FUSES the street type onto the end of the name
as one closed compound word (no space): `Kalverstraat`, `Overtoom`... `Herengracht`.

### Common fused street types (glued suffixes, lowercase as written)

| suffix   | meaning              | example              |
|----------|----------------------|----------------------|
| -straat  | street               | Kalverstraat         |
| -weg     | road                 | Amsterdamseweg       |
| -laan    | avenue / lane        | Churchilllaan        |
| -plein   | square               | Museumplein          |
| -gracht  | canal                | Herengracht          |
| -kade    | quay / embankment    | Prins Hendrikkade    |
| -dijk    | dike / levee         | Zeedijk              |
| -singel  | ring canal / moat    | Stadhouderssingel    |
| -hof     | court / yard         | Beginhof / Bloemhof  |
| -pad     | path                 | Jaagpad              |
| -markt   | market               | Nieuwmarkt           |
| -steeg   | alley / narrow lane  | Molsteeg             |
| -dreef   | drive / boulevard    | Meerkoetdreef        |
| -baan    | track / thoroughfare | Statenbaan           |
| -straatweg | (compound) highway | Rijksstraatweg       |

Other productive fused suffixes seen in the wild that a parser may also want to
recognize: `-wal`, `-gang`, `-hout`, `-veld`, `-berg`, `-brug`, `-tuin(en)`,
`-park`, `-plantsoen`, `-erf`, `-schans`, `-poort`, `-burgwal`, `-kerkhof`,
`-boulevard`, `-allee`.

### Standalone / prepositional / un-typed names (VERY common)

Many Dutch streets have NO separable type at all, or are named after people/things:
- Pure names with no type suffix: `Overtoom`, `Rokin`, `Spui`, `Damrak`, `Nes`,
  `Vijzelgracht`(has type) vs `Vijzel...` — but e.g. `Zeedijk` has one, `Rokin` none.
- Person / thing names as prefixes with a fused type: `Prins Hendrikkade`,
  `Van Baerlestraat`, `Ferdinand Bolstraat`, `Jan Pieter Heijestraat`.
- Prepositional / article names kept as a whole: `Nieuwezijds Voorburgwal`,
  `Oudezijds Achterburgwal`, `Achter de Kerk`, `Bij de Toren`.
- Numbered streets (see pitfalls): `2e Boerhaavestraat`, `1e Constantijn
  Huygensstraat`, `3e Oosterparkstraat`.

**Practical rule for the parser:** attempt to split a trailing known fused type
off the last token; if no known type suffix matches, keep the WHOLE name as the
street and set type = null. Never force a split. Multi-word names (with an initial
person name / ordinal / article) keep everything before the fused type as the
`street` value: `Prins Hendrikkade` -> street `Prins Hendrik`, type `kade`.

---

## 3. House number + toevoeging (addition)

The house number (`huisnummer`) is a plain integer. It is very frequently followed
by a **toevoeging** (addition) that distinguishes multiple dwellings sharing one
number. The parser should split into `number` + `civic_number_suffix`.

Forms of toevoeging (all extremely common):
- **Letter suffix**: `92A`, `92a`, `12b`, `114 C` — apartment/entrance letter. May
  be glued or space-separated. Often uppercased on normalization.
- **Numeric suffix (`-huisnummertoevoeging`)**: `92-3`, `18-2`, `250-1` — a second
  number, usually an apartment index. Written with a hyphen (or space).
- **`bis`**: `92 bis`, `27bis` — Latin "twice"; in Utrecht the first upper-floor
  dwelling. `bis A` = second such unit.
- **`hs` / `huis`**: `92hs`, `16 huis` — ground-floor dwelling (huis), an Amsterdam
  convention.
- **Roman-numeral floor**: `16-I`, `16-II`, `92-III` — Amsterdam floor indicator
  (I = first floor above ground, II = second, ...). Post-1995 replaced by `16-1`,
  `16-2`, `16-h`, but the Roman form is still widely used and printed.
- **`boven` / `beneden`**: upper / lower dwelling, occasionally written out.

Number RANGES also appear for buildings: `92-98` (a business occupying several
numbers). Distinguish a range (`92-98`, both large) from a numeric toevoeging
(`92-3`, second part small) heuristically — but for a per-address parser the second
part is normally the toevoeging.

Splitting rules used in the samples file:
- `92A`   -> number `92`, civic_number_suffix `A`
- `92-3`  -> number `92`, civic_number_suffix `3`
- `92hs`  -> number `92`, civic_number_suffix `hs`
- `92-II` -> number `92`, civic_number_suffix `II`
- `27bis` -> number `27`, civic_number_suffix `bis`

---

## 4. Postcode

Format: **4 digits + optional space + 2 UPPERCASE letters** — e.g. `1012 PH`.

- Regex core: `\d{4}\s?[A-Z]{2}` (allow optional space; normalize to one space).
- The first digit is never 0 (range 1000–9999).
- The two letters historically EXCLUDE the combinations **SS, SD, SA** (Nazi-era
  associations: Schutzstaffel, Sicherheitsdienst, Sturmabteilung).
- Letters F, I, O, Q, U, Y were originally disallowed for OCR/technical reasons;
  permitted for new codes since 2005, so a strict allow-list is now risky — better
  to accept any `[A-Z]{2}` and optionally warn on SS/SD/SA.
- The postcode PRECEDES the city and, with the house number, uniquely identifies an
  address (average ~8 addresses per postcode; PO-box ranges have their own codes).
- Real examples: `1012 PH Amsterdam`, `8011 PK Zwolle`, `2595 AK 's-Gravenhage`,
  `3512 JE Utrecht`, `3011 WN Rotterdam`, `5611 AZ Eindhoven`.

Normalization: uppercase the letters; ensure a single space between digits and
letters (input may be `1012PH` or `1012 ph`).

---

## 5. City (plaats)

- Dutch orthography in city names: the `ij` digraph (`Nijmegen`, `Wijchen`,
  `IJmuiden` — note capitalized `IJ` at word start counts as one letter), plus
  diacritics `ë é ï` are possible in street names (`Coëllostraat`) though rarer in
  city names.
- **Apostrophe-s prefix — the notorious edge case.** Several city names begin with
  an archaic genitive `'s` ("des" = "of the"), written with a leading apostrophe:
  - `'s-Gravenhage` = The Hague (also `Den Haag`, `'s-Gravenhage`, `Gravenhage`)
  - `'s-Hertogenbosch` = Den Bosch
  - `'s-Gravenzande`, `'s-Gravenpolder`, `'s Gravenmoer` (sometimes no hyphen)
  - `'t Harde`, `'t Zand` — the `'t` (= "het") article variant.
  The leading apostrophe (a real `'` U+0027, sometimes a typographic `’` U+2019)
  must NOT be stripped or treated as a quote; it is part of the city token. On some
  mail it is uppercased oddly as `'S-GRAVENHAGE`. Keep the whole token intact as the
  city value.
- City can be multi-word: `Bergen op Zoom`, `Berg en Dal`, `Alphen aan den Rijn`,
  `Nieuw-Vennep`, `Capelle aan den IJssel`, `Wolfheze`.

---

## 6. Secondary units / PO boxes

- Floor / dwelling indicators double as toevoeging (see §3): `hs`, `bis`, `-I/-II/
  -III`, `boven`, `beneden`.
- **`Postbus`** = PO box: `Postbus 626, 1000 AP Amsterdam`. Postbus ranges have
  dedicated postcodes. When present there is NO street/house number — parser should
  detect `Postbus <n>` as a PO-box sec-unit and not try to force a street split.
- **`Antwoordnummer`** = business-reply / freepost number: `Antwoordnummer 1234,
  1000 XX Amsterdam` — like Postbus, no street, postage-paid reply mail.

---

## 7. Country variants

`Nederland` (native), `Netherlands`, `The Netherlands`, `Holland` (informal),
`NL`, `NLD` (ISO), `Pays-Bas`, `Niederlande`. Normalize all to `NL`.

---

## 8. Prior-work notes & concrete failure modes

1. **`'s-Gravenhage` / `'s-Hertogenbosch` apostrophe-s prefix.** Leading `'s-`
   (or `'t `) must be preserved as part of the city; naive tokenizers split on the
   apostrophe or drop it, or a CSV import mangles `'s` into a stray quote. Also
   accept the typographic apostrophe `’` and the uppercased `'S-GRAVENHAGE`.
2. **Postcode 4+2 format vs house number.** `1012 PH` can be misread; and
   `1012PH` (no space) or `1012 ph` (lowercase) must still match `\d{4}\s?[A-Z]{2}`.
   Do not confuse the 4-digit postcode with a house number.
3. **Toevoeging `92A` / `92-3` / `92hs` / `92-II`.** Splitting number from addition
   is error-prone: a glued letter (`92A`), a hyphen-number (`92-3`), a hyphen-Roman
   (`92-II`), a glued word (`92hs`, `27bis`). Must not treat `92-3` as a range.
4. **Fused vs standalone street type.** `Kalverstraat` splits (`Kalver`+`straat`)
   but `Overtoom`, `Rokin`, `Spui`, `Damrak` have no separable type — forcing a
   split corrupts them. Also `-straat` inside `Rijksstraatweg` must resolve to the
   final `-weg`, not the internal `-straat`.
5. **`Postbus` / `Antwoordnummer` PO boxes.** No street present; `Postbus 626`
   must not be parsed as street `Postbus` + number, and its postcode is a box-range
   code.
6. **Numbered streets `2e Boerhaavestraat`.** A leading ordinal (`1e`, `2e`, `3e`,
   `1ste`, `2de`) is part of the street name, not a house number. Easy to grab the
   `2` as a number and mis-order the parse.
7. **Long compound / multi-word names.** `Nieuwezijds Voorburgwal`,
   `Prins Hendrikkade`, `Jan Pieter Heijestraat`, `Van Baerlestraat` — the street
   spans several tokens before the number; a "last word before number" heuristic
   fails. Also the internal capitalization (`Van`, `de`, `den`) must be kept.
8. **`ij` digraph & diacritics.** `Nijmegen`, `IJsselstein`, `Coëllostraat`,
   `Reërdijk` — ASCII-folding or splitting on non-letters breaks these. `IJ` at the
   start of a word is a single capital digraph (`IJmuiden`), not `I` + `j`.
9. **Postcode/city on one line, number/street on another (or comma-joined).**
   Input may be one line `Kalverstraat 92, 1012 PH Amsterdam` or two physical lines;
   the double-space PostNL convention between postcode and city may collapse to one.
10. **House-number-only / redundant street.** Because (postcode + number) is unique,
    some records omit or abbreviate the street; parser must tolerate a missing street
    token rather than fail.
11. **Space vs glued toevoeging & case.** `92 bis` vs `92bis`, `114 C` vs `114c` —
    normalization should be case/space-insensitive for the addition.
12. **City in ALL CAPS.** `AMSTERDAM`, `'S-GRAVENHAGE` on machine mail — don't treat
    caps as a signal of a different field.
