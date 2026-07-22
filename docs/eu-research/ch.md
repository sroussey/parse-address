# Swiss Postal Address Research (for a street-address parser/normalizer)

Sources consulted: Swiss Post (Die Post / La Poste / La Posta) addressing norms, Google
libaddressinput (`chromium-i18n` CH dataset), libpostal (openvenues), OpenStreetMap
tagging conventions, Smarty / PostGrid global address-format references, Wikipedia/Wikidata
(street examples), and Swiss-German orthography references (ß vs. ss).

---

## 1. Canonical order

Swiss addresses put the **street name first, then the house number**, then a line with the
**4-digit postal code before the city**. This order holds in **all three language regions**
(German, French, Italian) — unlike house-number-first countries, and unlike the US.

```
[Name / Organisation]
<Street> <HouseNumber>
<PLZ/NPA (4 digits)> <City>
[Country]
```

Google libaddressinput format string for CH:

```
fmt:  %O%n%N%n%A%nCH-%Z %C
zip:  \d{4}
require: A C Z   (street/Address, City, Zip all required)
```

Note the `CH-%Z %C` fragment: the postal code precedes the city, optionally with a `CH-`
country prefix (used for cross-border mail, e.g. `CH-8001 Zürich`). The parser should treat
a leading `CH-` on the postal line as an optional country marker, not part of the code.

Real examples (number ALWAYS after the street, in every region):

- German: `Bahnhofstrasse 1, 8001 Zürich`
- French: `Rue du Rhône 5, 1204 Genève`
- Italian: `Via Nassa 5, 6900 Lugano`

There is **no comma** between street and number in native Swiss usage (`Landstrasse 10B`),
though commas often appear when the address is flattened onto one line for data entry. The
parser must tolerate both `Bahnhofstrasse 1 8001 Zürich` and `Bahnhofstrasse 1, 8001 Zürich`.

---

## 2. Street-type handling by language region

The single most important structural fact: **German-Swiss street types are FUSED (glued) onto
the end of the name; French- and Italian-Swiss street types are SEPARATE words that LEAD the
name.** The parser needs two code paths.

### 2a. German-Swiss (majority — ~62% of population)

The type is a **suffix fused to the name** with no space, all lowercase inside the compound:

- `-strasse` (street) — **NEVER `-straße`** (see §5). e.g. `Bahnhofstrasse`, `Seefeldstrasse`
- `-weg` (way/path) — e.g. `Rebweg`, `Katzenweg`
- `-gasse` (lane/alley) — e.g. `Storchengasse`, `Kramgasse`, `Marktgasse`
- `-platz` (square) — e.g. `Paradeplatz`, `Bundesplatz`
- `-ring` (ring road) — e.g. `Zähringerring`, `Innerer Ring`
- other fused types seen in the wild: `-quai` (`Limmatquai`), `-steig`, `-halde`,
  `-rain`, `-matt(e)`, `-hof`, `-vorstadt` (`Aeschenvorstadt`, `Steinenvorstadt`), `-brücke`

Parser rule for German: strip the recognized fused suffix and split into
`street` (the leading stem) + `type` (the lowercase suffix). e.g.
`Bahnhofstrasse` -> street `Bahnhof`, type `strasse`.

Caveats / edge cases within German:
- Some names have a **space before Strasse** as a proper multi-word name, e.g. Basel's
  `Freie Strasse`. Here `Strasse` is capitalized and separate. Treat the whole thing as the
  name (`street` = `Freie`, `type` = `Strasse`) but do NOT force lowercase-fusion rules; be
  lenient. (Rare; most are fused.)
- Not every `-strasse`-looking word is decomposable into a meaningful stem, but mechanically
  stripping the suffix is still the right normalization for matching.
- Names ending in `-vorstadt`, `-graben`, `-quai`, `-markt` are types too but are frequently
  left un-decomposed by downstream systems; the parser should still recognize the common set.

### 2b. French-Swiss (~23% — Romandie: GE, VD, NE, JU, valais/Fribourg partly)

The type is a **separate leading word** (a prefix), followed by the name (often with
articles `du`, `de`, `de la`, `des`, `de l'`):

- `Rue` — `Rue du Rhône`, `Rue de Bourg`, `Rue du Mont-Blanc`
- `Avenue` — `Avenue de la Gare`, `Avenue du Théâtre`
- `Chemin` — `Chemin de Montolieu`, `Chemin des Palettes`
- `Route` — `Route de Berne`, `Route de Chêne`
- `Place` — `Place du Molard`, `Place de la Palud`, `Place Pury`
- `Quai` — `Quai du Mont-Blanc`, `Quai des Bergues`
- also: `Boulevard`, `Grand-Rue`, `Impasse`, `Sentier`, `Promenade`, `Passage`, `Ruelle`,
  `Esplanade`, `Cours`

Parser rule for French: if the token stream starts with a recognized French type word, take
it as `type` (preserve capitalization: `Rue`), and everything up to the house number is the
`street` (e.g. `du Rhône`). Number still comes after.

### 2c. Italian-Swiss (~8% — Ticino + southern Graubünden)

Same shape as French — **separate leading type word (prefix)** then name:

- `Via` — `Via Nassa`, `Via Pessina`, `Via Pretorio`, `Via San Gottardo`
- `Piazza` — `Piazza della Riforma`, `Piazza Grande`, `Piazza Governo`
- `Viale` — `Viale Stazione`, `Viale Officina`
- also: `Vicolo`, `Strada`, `Salita`, `Contrada`, `Corso`, `Largo`, `Sentiero`

Parser rule for Italian: identical to French — leading type token -> `type` (e.g. `Via`),
remainder -> `street` (e.g. `Nassa`), number after.

### 2d. Decision logic summary

```
if street-line starts with a French/Italian type word (Rue, Avenue, Chemin, Route,
        Place, Quai, Boulevard, Via, Piazza, Viale, Vicolo, Corso, ...):
    -> prefix mode: type = leading word, street = middle, number = trailing
else if a token ends in a fused German suffix (-strasse, -weg, -gasse, -platz, -ring, ...):
    -> fused mode: type = lowercased suffix, street = stripped stem, number = trailing
else:
    -> whole thing is the street name, type = null
```

Romansh (4th national language, <1%) largely mirrors German fused forms or Italian prefixes
regionally (e.g. `Via` / `Sot`); treat via the same two paths, defaulting to name-only.

---

## 3. House number

- Simple: `12`
- With alphabetic suffix (very common in CH): `12a`, `10B`, `41` — the letter is a
  **civic-number suffix**, usually glued to the digits with no space (`12a`) but sometimes
  spaced (`12 a`).
- Ranges: `12-14`, `3–5` (en-dash appears occasionally).
- The house number sits at the **end of the street line**, after the name, in all regions.
- **Apartment / floor is normally NOT on the street line.** Swiss residential mail relies on
  the name + street + PLZ/city; a `c/o`, `Postfach` (PO box), or occasionally a floor may
  appear on a separate supplementary line but is not part of the civic number. When present,
  `Postfach NN` (box) can follow the street on the same flattened line — treat as secondary.

Regex-ish: number = `\d+` optionally followed by a letter suffix `[a-zA-Z]` or a range
`-\d+[a-zA-Z]?`.

---

## 4. Postal code (PLZ / NPA / NAP) and city

- **Exactly 4 digits.** Regex `\d{4}` (libaddressinput CH `zip` = `\d{4}`). Range ~1000–9999.
- The code **precedes the city**: `8001 Zürich`, `1201 Genève`, `6900 Lugano`.
- Names for the code: **PLZ** (Postleitzahl, German), **NPA** (Numéro postal d'acheminement,
  French), **NAP** (Numero d'avviamento postale, Italian).
- Optional `CH-` prefix on the code for international mail: `CH-8001 Zürich`. Strip `CH-` to a
  country marker; the bare 4 digits are the code.
- Beware: a 4-digit house number could be confused with a postal code if parsing is purely
  positional. Disambiguate by position on the line (postal code leads the *city* line and is
  followed by an alphabetic city token) and by the fact the street line ends in a
  smaller/suffixed number.

### City handling

- Cities keep their **native-language, accented spelling**: `Zürich` (ü), `Genève` (è),
  `Neuchâtel` (â), `Bienne`/`Biel`, `Lugano`, `Basel`, `Bern`, `St. Gallen` (with the `St.`
  abbreviation and a space), `La Chaux-de-Fonds` (hyphenated), `Yverdon-les-Bains`.
- **Bilingual city names** exist: `Biel/Bienne` (2500/2501/2502), `Fribourg`/`Freiburg`,
  `Sion`/`Sitten`, `Neuchâtel`. The slash form or either half may appear; preserve as given.
- Some PLZ map to a district/quarter name rather than the big-city name (e.g. `8038`
  Zürich, `1009` Pully near Lausanne) — the token after the code is authoritative for `city`.
- No `state`/canton is written on the address line in normal Swiss mail; cantons exist
  (ZH, GE, TI, BE, VD, BS, …) but are **not** part of the standard postal address. Parser
  should set `state` = null for Swiss addresses.

---

## 5. The ß problem (critical normalization rule)

**Swiss Standard German abolished the Eszett (ß).** Switzerland (and Liechtenstein) always
write `ss` where Germany/Austria would use `ß`. So the street type is **`strasse`**, and the
famous Zürich street is officially **`Bahnhofstrasse`** — never `Bahnhofstraße`.

Consequences for the parser:
1. The canonical fused type is **`strasse`** (ss). Emit `strasse`, not `straße`.
2. Input may nonetheless contain `ß` (foreign data entry, German software). **Normalize
   `ß` -> `ss`** before matching (`Bahnhofstraße` -> `Bahnhofstrasse`).
3. `Str.` / `str.` abbreviations should expand/normalize to `strasse`.

---

## 6. Country variants

Accept and normalize all of these to ISO `CH`:

- German: `Schweiz`
- French: `Suisse`
- Italian: `Svizzera`
- Romansh: `Svizra`
- English: `Switzerland`
- Codes: `CH` (ISO-3166 alpha-2), `CHE` (alpha-3, used by Smarty/Swiss Post examples),
  `CH-` prefix on the postal code line.

---

## 7. Prior work

- **libpostal** (openvenues, CRF trained on OSM + OpenAddresses): explicitly models Germanic
  fused street suffixes — "Rosenstraße and Rosen Straße are equivalent" — so it can split or
  keep the fused `-strasse`. It is multilingual and handles the Fr/It prefix forms as `road`
  tokens. Good reference for the two-path behavior; it outputs a `road` component rather than
  separating stem+type the way this parser does.
- **Google libaddressinput** (`chromium-i18n` CH): gives the authoritative `fmt`
  (`%O%n%N%n%A%nCH-%Z %C`), `zip = \d{4}`, and required set `A C Z`. No sub-street parsing.
- **OpenStreetMap**: `addr:street` typically stores the fused German name whole
  (`Bahnhofstrasse`) or the full Fr/It name with type (`Rue du Rhône`, `Via Nassa`);
  `addr:housenumber` holds `12a`, `12-14`. Street-type abbreviations from the OSM Name Finder
  wiki are the basis for libpostal's dictionaries.
- **Swiss Post (Die Post)**: publishes the official domestic addressing guidelines — street +
  number line, then `PLZ Ort`, PO boxes as `Postfach`, and the four-language street lexicon.

---

## 8. Failure modes to guard against (8+)

1. **`strasse` written as `ß`** — input `Bahnhofstraße 1` must normalize the `ß` to `ss` and
   still decompose to street `Bahnhof` + type `strasse`. Emitting `straße` is wrong for CH.
2. **4-digit postal code mistaken for a house number** (or vice-versa). Positional parsers
   that expect a US 5-digit ZIP or that grab the first number will mis-slot `8001`. Enforce
   exactly `\d{4}` and require it to lead the city token.
3. **Mixed German / French / Italian in one dataset** — a single national parser must not
   assume German fusion everywhere; `Rue du Rhône 5` and `Via Nassa 5` are NOT fused and must
   not have a suffix stripped.
4. **Fused vs. prefix confusion** — treating `Via` or `Rue` as part of the street stem, or
   trying to strip a nonexistent suffix from `Piazza della Riforma`. And the reverse: adding a
   space into `Bahnhofstrasse` incorrectly.
5. **`Bahnhofstrasse`** specifically — extremely common street name in nearly every Swiss
   town; a naive dictionary keyed on unique names fails. Must be handled by the generic
   suffix-strip rule, and the same name resolves to many different PLZ/cities.
6. **French `Rue du Rhône`** — the article `du`/`de la`/`des` between type and core name must
   stay in `street` (`du Rhône`), not be dropped or treated as a separate token/type.
7. **Italian `Via Nassa`** — short single-word name after the type; parser must not require an
   article and must not fuse `Via` onto `Nassa`.
8. **House-number letter suffix** (`12a`, `10B`) — splitting the letter from the digits into
   `civic_number_suffix`, and handling both glued (`12a`) and spaced (`12 a`) forms; also
   ranges `12-14`.
9. **Accented / special city spellings** — `Zürich`, `Genève`, `Neuchâtel`, `St. Gallen`
   (dot + space), `La Chaux-de-Fonds` (hyphens); ASCII-folding or truncating breaks matching.
10. **Bilingual city names** — `Biel/Bienne`, `Fribourg/Freiburg`; the slash or either half
    may appear.
11. **`CH-` prefix on the postal code** (`CH-8001 Zürich`) — must be stripped to a country
    marker, not read as part of the code or city.
12. **`Str.` / `str.` abbreviation** and multi-word capitalized `Freie Strasse` (space before
    a capitalized `Strasse`) — both must normalize toward `strasse` without breaking.
13. **No comma between street and number** (native form `Landstrasse 10B`) vs. comma-flattened
    form — tokenizer must handle both.
14. **`Postfach` (PO box) on the street line** — must not be swallowed into the civic number.
