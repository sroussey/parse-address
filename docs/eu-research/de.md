# German Postal Address Research (for street-address parser/normalizer)

Target: a TypeScript, XRegExp-based parser/normalizer. This report captures the
canonical German (DE) addressing rules, how each field should be segmented, and
the known failure modes a parser must handle.

## 1. Canonical address line order

German addresses put the **street name first, then the house number**, then a new
line with **PLZ (postal code) then city**. This is the inverse of US ordering.

```
[Name / c/o line]        (optional)
Straßenname Hausnummer     e.g.  Bäckerstraße 12
PLZ Ort                    e.g.  10115 Berlin
[Land]                     e.g.  Deutschland   (only for international mail)
```

- House number comes **AFTER** the street name: `Hauptstraße 15`, never `15 Hauptstraße`.
- No comma between street and number on a letter; on one-line inputs a comma
  commonly separates the street-line from the PLZ/city-line:
  `Bäckerstraße 12, 10115 Berlin`.
- PLZ and Ort are **not** separated by a comma or any punctuation: `10115 Berlin`.
- Confirmed by Deutsche Post / UPU addressing specs and multiple format guides.

## 2. House number formats

The house number follows the street and can take several shapes:

| Form            | Example         | number | civic_number_suffix |
|-----------------|-----------------|--------|---------------------|
| plain           | `12`            | `12`   | null                |
| glued letter    | `12a`           | `12`   | `a`                 |
| spaced letter   | `12 a`          | `12`   | `a`                 |
| letter (cap)    | `70B`           | `70`   | `B` (normalize case as-is/lower) |
| range (hyphen)  | `12-14`         | `12`   | (range) — keep `-14` in suffix or as number range |
| range (spaced)  | `12 - 14`       | `12`   |                     |
| fraction/slash  | `12/1`          | `12`   | `/1` (Austria-style; rare in DE) |

Recommended split rule for the parser:
- **number** = the leading integer run.
- **civic_number_suffix** = a trailing letter (`a`, `b`, `B`, ...) OR a range tail
  (`-14`) OR a slash unit (`/1`). Normalize the spaced form `12 a` -> number `12`,
  suffix `a`. Keep letter case; do not uppercase automatically.
- Ranges `12-14`: put `12` in number and `-14` (or `14`) in the suffix; document
  the choice. Some datasets keep the whole `12-14` string as the number.

## 3. Street type conventions

German **fuses the street type into the name as a suffix** far more often than
English. `Bäckerstraße` = "Bäcker" + "Straße". The type is a bound morpheme glued
onto the base name (usually lowercase where it joins: `-straße`, `-weg`, `-platz`).

Common types and abbreviations (normalize the abbreviation to the full form):

| Type word  | Meaning            | Common abbrev / variants        |
|------------|--------------------|---------------------------------|
| Straße     | street             | `Str.`, `str.`, `Str`, `-str.`, `Strasse` (ß->ss) |
| Weg        | way / path         | (rarely abbreviated)            |
| Platz      | square             | `Pl.`                           |
| Allee      | avenue (tree-lined)| (rarely abbreviated)            |
| Gasse      | lane / alley       | `G.` (rare)                     |
| Ring       | ring road          | -                               |
| Damm       | causeway/embankment| -                               |
| Ufer       | riverbank quay     | -                               |
| Chaussee   | highway/avenue     | `Ch.` (rare)                    |
| Steig      | (steep) path       | -                               |
| Pfad       | path               | -                               |
| Markt      | market square      | -                               |
| Wall       | rampart            | -                               |
| Graben     | ditch/moat         | -                               |
| Berg       | hill               | -                               |
| Hof        | courtyard          | -                               |
| Zeile      | row                | -                               |
| Brücke     | bridge             | -                               |
| Tor        | gate               | -                               |

Two structural cases:

1. **Fused suffix (splittable):** `Bäckerstraße` -> street `Bäcker`, type `Straße`.
   `Hauptstraße` -> `Haupt` + `Straße`. `Lindenweg` -> `Linden` + `Weg`.
   `Alexanderplatz` -> `Alexander` + `Platz`. `Kurfürstendamm` -> `Kurfürsten` + `Damm`.
   Note the joining letter: often the base ends in the fusion boundary directly,
   sometimes an `-en`/`-er`/`-s` linking element belongs to the base name
   (`Kurfürsten-damm`, `Bismarck-straße`). Keep the linking element with the
   **street** part (`Kurfürsten`, not `Kurfürst`).

2. **Standalone / prepositional (NOT splittable):** many streets have no type
   word or an untouchable multiword name. Put the **entire** name in `street` and
   set `type = null`:
   - `Unter den Linden` (under the lindens)
   - `Am Markt`, `Am Sandtorkai`, `Am Kupfergraben`
   - `An der Alster`, `An der Urania`
   - `Auf dem Berg`, `Auf der Höhe`
   - `Zur Alten Post`, `Zum Dorfteich`
   - `In der Au`, `Im Grün`
   - Also hyphenated honorific names keep their type if present:
     `Karl-Liebknecht-Straße` -> street `Karl-Liebknecht`, type `Straße`;
     but `Kurt-Schumacher-Platz` -> street `Kurt-Schumacher`, type `Platz`.

Normalization notes:
- Expand `Str.`/`str.`/`Str` to `Straße` in the normalized output.
- `Strasse` (ss form) should be recognized as `Straße`.
- When the type is fused, the base name generally does **not** keep a trailing
  space; the split is morphological, not whitespace-based, so a suffix dictionary
  of type words (longest-match) is required.

## 4. Postal code (PLZ)

- **Exactly 5 digits.** Leading zeros are significant (`01067 Dresden`,
  `04109 Leipzig`). Never strip leading zeros.
- Precedes the city, space-separated, no punctuation: `10115 Berlin`.
- Regex: `\b\d{5}\b` (context: it directly precedes the Ort on the last line).
  Stricter DE range is `0[1-9]\d{3}|[1-9]\d{4}` but plain `\d{5}` is standard.
- Do NOT confuse with a 4-digit Austrian/Swiss PLZ; DE is always 5.

## 5. City (Ort) handling

- Follows the PLZ on the same line: `10115 Berlin`.
- May contain umlauts and ß: `München`, `Köln`, `Nürnberg`, `Düsseldorf`,
  `Groß-Gerau`, `Halle (Saale)`.
- **ß may be written `ss`** (`Gross-Gerau`); umlauts may be transliterated
  (`Muenchen`, `Koeln`, `Nuernberg`). The normalizer should treat `ä/ae`, `ö/oe`,
  `ü/ue`, `ß/ss` as equivalent for matching but preserve original for output.
- Multi-word cities exist: `Bad Homburg`, `Frankfurt am Main`,
  `Frankfurt (Oder)`, `Berlin`, `Freiburg im Breisgau`, `Halle (Saale)`.
- City may carry a parenthetical disambiguator: `Frankfurt (Oder)` vs
  `Frankfurt am Main`.

## 6. Secondary unit terms (German)

| English concept | German term(s)                    | Abbrev            |
|-----------------|-----------------------------------|-------------------|
| apartment/flat  | Wohnung                           | `Whg`, `Whg.`     |
| floor/storey    | Etage / Obergeschoss / Stock      | `Etg.`, `OG`, `UG`, `EG`, `Stk.` |
| ground floor    | Erdgeschoss                       | `EG`              |
| upper floor n   | n. Obergeschoss                   | `n. OG`, `1. OG`  |
| basement/lower  | Untergeschoss                     | `UG`              |
| room            | Zimmer                            | `Zi.`             |
| care of         | care of / bei                     | `c/o`, `bei`      |
| PO box          | Postfach                          | `Postfach`, `Pf.` |
| house/building  | Haus                              | `Hs.`             |
| rear building   | Hinterhaus / Gartenhaus           | `HH`, `GH`, `VH` (Vorderhaus) |
| staircase       | Aufgang / Eingang                 | `Aufg.`, `Eing.`  |

Notes:
- Floor markers `1. OG`, `2. OG`, `EG`, `UG` are extremely common in rental data.
- `c/o` (or the German `bei`) is a separate recipient line, not part of the street.
- `Postfach` addresses **replace** the street entirely; a Postfach frequently has
  its **own** PLZ that differs from the street PLZ. Example:
  `Postfach 34 41 41, 10724 Berlin`. Do not treat `Postfach 3441` as a house number.

## 7. Region / Bundesland

- The Bundesland (state) is **normally omitted** from the postal address line.
  PLZ+Ort is sufficient for routing. A parser should not expect a state token and
  should not synthesize one into the address line.

## 8. Country name variants

- `Deutschland` (native), `Germany` (English), `Allemagne` (fr), `DE` (ISO-3166
  alpha-2), `DEU` (alpha-3), `D` (old car-plate / postal prefix, e.g. `D-10115`).
- The old `D-` PLZ prefix (`D-10115 Berlin`) still appears; strip the `D-`.

## 9. Prior open-source work

- **libpostal** (openvenues): C library, statistical NLP trained on OSM +
  OpenAddresses. Per-language dictionaries map `str`/`str.` -> `strasse`. Handles
  DE inverse component order but is probabilistic (not rule-perfect). Known GitHub
  issue #264: "Inverse component order in German addresses."
- **Google libaddressinput**: format metadata; DE format string is
  `%O%n%N%n%A%n%Z %C` (Org, Name, Address lines, then `PLZ City`), confirming
  PLZ-before-city and street-line ordering. No region field required for DE.
- **OpenStreetMap** conventions: `addr:street`, `addr:housenumber` (which holds
  letters and ranges like `12a`, `12-14`), `addr:postcode`, `addr:city`. OSM keeps
  the full fused street name in `addr:street` (`Bäckerstraße`), i.e. it does NOT
  split the type — so splitting is a normalization step the parser adds.
- **Deutsche Post / DIN 5008 & UPU** addressing guidelines: street+number line,
  then PLZ+city line, no comma between PLZ and city.

## 10. Known failure modes / edge cases (parser pitfalls)

1. **`Str.` ambiguity** — `Str.` mid-name vs end; `Berliner Str. 5` must expand to
   `Berliner Straße`, house number `5`. Don't treat `Str` as the base name.
2. **Streets with NO type word** — `Unter den Linden 77`: the parser must NOT try
   to split a type; `street = "Unter den Linden"`, `type = null`, number `77`.
   The trailing number is the house number, not part of the name.
3. **Prepositional `Am/An der/Auf dem/Zur/Im`** — `Am Markt 1`, `An der Alster 3`.
   Same treatment: whole phrase is the street, type null. `Am` is not a house-side
   token.
4. **House-number ranges** — `Schönhauser Allee 12-14`. A naive `\d+` grabs `12`
   and drops `-14`; must capture the range into suffix/number-range.
5. **Letter suffix, glued vs spaced** — `Torstraße 70b` vs `Torstraße 70 b`.
   Both -> number `70`, suffix `b`. The space form can be misread as a secondary
   unit.
6. **Leading-zero PLZ** — `01067 Dresden`, `04109 Leipzig`, `06108 Halle`. Storing
   PLZ as an integer loses the zero; keep as string.
7. **Fusion linking element** — `Kurfürstendamm` (`Kurfürsten` + `Damm`, not
   `Kurfürst`), `Bismarckstraße` (`Bismarck` + `Straße`). The `-en`/`-s` belongs to
   the base name. Over-eager stemming corrupts the street name.
8. **Type word that is the WHOLE name** — `Markt 1` (Leipzig), `Graben 7` (a whole
   street literally named "Graben"). Here there is no base name; keep `street` =
   the word itself, `type = null` (do not leave an empty street).
9. **Hyphenated honorific names** — `Karl-Liebknecht-Straße 8`: split only the
   final `-Straße`; street `Karl-Liebknecht`, type `Straße`. Don't split on inner
   hyphens.
10. **Umlaut / ß transliteration** — `Muenchen` vs `München`, `Gross-Gerau` vs
    `Groß-Gerau`, `Strasse` vs `Straße`. Match-equivalence needed; preserve input
    for output.
11. **Multi-word / parenthetical city** — `Frankfurt am Main`, `Frankfurt (Oder)`,
    `Halle (Saale)`, `Bad Homburg`. A greedy single-token city grab fails.
12. **Postfach vs house number** — `Postfach 10 01 20, 20095 Hamburg`. The digits
    are a box number (often grouped), not a house number, and there is no street.
13. **`D-` PLZ prefix** — `D-80331 München`. Strip `D-` before reading the 5-digit
    PLZ.
14. **c/o recipient line** — `c/o Schmidt, Wielandstraße 5, 10629 Berlin`. The c/o
    part is recipient info, not street; must be peeled off before street parsing.
15. **Secondary unit collision with suffix** — `Hauptstraße 5, 2. OG` vs
    `Hauptstraße 5 b`: `2. OG` is a floor, `b` is a civic suffix. `OG/EG/UG` tokens
    disambiguate.
16. **Numbered districts / no confusion with number** — city names or districts
    with numbers are rare in DE, but `10117 Berlin-Mitte` (borough appended with a
    hyphen) should keep `Berlin-Mitte` (or `Berlin`) as city, not misread `Mitte`.
```
