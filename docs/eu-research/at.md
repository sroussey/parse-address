# Austrian (AT) Postal Address Formats — Research for a Street-Address Parser/Normalizer

Sources consulted: Österreichische Post beschriftung guidance (ots.at, protagon.de),
Pingen / Smarty / PostGrid / GeoPostcodes global address-format guides, endereco
"Stiege, Top and Co." deep-dive, IETF draft-wolf-civicaddresses-austria, Wikipedia
"Postal codes in Austria" / "Austrian Post", libpostal (openvenues/libpostal),
Google libaddressinput, OpenStreetMap AT tagging conventions.

Austria's addressing is essentially the **German model** (street name first, house number
after, `PLZ Ort` on the next line) with a handful of Austria-specific twists that break a
naive German parser: the **postal code is 4 digits, not 5**, and Austria has its own
sub-building vocabulary — **Top**, **Stiege**, **Tür** — plus very heavy use of **-gasse**.

---

## 1. Canonical order

```
[Recipient name]
<Street name> <House number>[/sub-units]
<PLZ> <Ort>
[Österreich]         <- country only for international mail
```

- **Street name FIRST, house number AFTER** — exactly like Germany:
  `Kärntner Straße 12`, `Getreidegasse 9`, `Mariahilfer Straße 103`.
- Next line is **`PLZ Ort`** — 4-digit postal code, a space, then the city/town:
  `1010 Wien`, `5020 Salzburg`, `8010 Graz`.
- On a single input line these are usually comma-joined:
  `Kärntner Straße 12, 1010 Wien`.
- **Bundesland (federal state) is omitted** from the address line for domestic mail;
  `PLZ + Ort` are sufficient. The state is derivable from the first PLZ digit (see §4)
  but is not written.
- For international mail the country line is added: `Österreich` / `Austria` / `AT`.

This is the opposite of the Anglo/US "12 Main St" order, so any shared parser must branch
on locale: **number is a trailing token, not a leading token.**

---

## 2. Street types (German, mostly FUSED into the name)

German street generics are usually written **fused** as a suffix on the proper name, but
some are **spaced** (typically when the name part is an adjective/derived word ending in
`-er`, or a person/place name). Both forms occur constantly.

Common Austrian street-type generics:

| Type            | Fused example        | Spaced example          | Notes |
|-----------------|----------------------|-------------------------|-------|
| **Straße / Strasse** | `Favoritenstraße`   | `Kärntner Straße`       | ß is standard in AT (unlike CH which uses ss). Both `-straße` and `-strasse` appear. |
| **Gasse**       | `Operngasse`         | `Anton-Jahn-Gasse`      | **Very common in Austria** (alley/lane); much more frequent than in northern Germany. |
| **Weg**         | `Grabenweg`          | `Am hohen Weg`          | path/way |
| **Platz**       | `Stephansplatz`      | `Alter Platz`           | square |
| **Ring**        | `Opernring`, `Schottenring` | —                | ring road (Vienna Ringstraße segments) |
| **Allee**       | `Prinz-Eugen-Allee`  | `Rennweg`(no)           | avenue |
| **Zeile**       | `Wollzeile`          | —                       | row |
| **Kai**         | `Handelskai`         | `Franz-Josefs-Kai`      | quay |
| **Lände**       | `Roßauer Lände`      | —                       | riverbank road |
| **Gürtel**      | `Neubaugürtel`       | `Währinger Gürtel`      | belt/ring road (Vienna) |
| **Markt**       | `Naschmarkt`         | `Alter Markt`           | market square |
| **Steig**       | `Bäckensteig`        | —                       | (steep) footpath |
| **Promenade**   | —                    | `Promenade` (Linz)      | standalone name |
| **Hauptstraße** | `Landstraßer Hauptstraße` | `Wiedner Hauptstraße` | "main street" — compound suffix |

Also note **-gasse** and **-straße** in Austrian names is frequently attached to a person's
full hyphenated name: `Maria-Theresien-Straße`, `Anton-Baumgartner-Straße`,
`Herzog-Friedrich-Straße`.

### Splitting rule (for the parser)
- **Fused**: strip the trailing generic, e.g. `Operngasse` → name `Opern` + type `Gasse`;
  `Favoritenstraße` → `Favoriten` + `Straße`; `Mariahilfer Straße` → `Mariahilfer` + `Straße`.
- **Unsplittable / prepositional** names keep the whole string and type = null
  (see §7): `Am Graben`, `Am Hof`, `Rennweg`(arguably `Renn`+`weg`), `Naschmarkt`.
- Keep hyphenated person names intact as the name part: `Maria-Theresien` + `Straße`.

---

## 3. House number

House number **follows** the street name. Forms:

- Plain: `12`
- **Alpha suffix**: `12a`, `2b`, `7A` (letter appended, no space)
- **Range**: `12-14`, `1-3` (spans multiple entrances of one building)
- **Slash sub-units** (Austria-specific, no spaces):
  `Operngasse 4/3` → house 4, door(Tür) 3.
  The general short form is `Haus/Stiege/Top/Tür`, e.g. `Kaiserstraße 53/2/19`
  (= house 53, Stiege 2, Tür 19) or `Maria-Theresien-Straße 45/2/3/8`
  (= house 45, Stiege 2, Top 3, Tür 8).
- **Long-form sub-units** with spaces and keywords:
  `Getreidegasse 9 Top 5`, `... Stiege 2 Tür 19`, `... 12/Stiege 3/Top 7`.

**Splitting rule:** the leading integer (with optional alpha suffix or `-range`) is the
**building/civic number**. Everything after the first `/` or the first `Top`/`Stiege`/`Tür`
keyword is a **secondary unit**, not part of the house number.

- `12a` → number `12`, civic_number_suffix `a`
- `12-14` → number `12`, civic_number_suffix `-14`
- `4/3` → number `4`, sec_unit Tür `3`
- `9 Top 5` → number `9`, sec_unit Top `5`

---

## 4. Postal code (PLZ) — 4 DIGITS

- **Austria uses exactly 4 digits: `\d{4}`** (introduced 1966). This is the single biggest
  divergence from Germany, which uses 5 digits. A parser tuned for German `\d{5}` will
  **fail on every Austrian address**, and a loose `\d{4,5}` risks eating a house number or
  mis-classifying.
- The PLZ **precedes** the city on the `PLZ Ort` line: `1010 Wien`.
- **First digit = federal state routing region:**
  - 1xxx Wien · 2xxx Lower Austria (E) · 3xxx Lower Austria (W) · 4xxx Upper Austria ·
    5xxx Salzburg · 6xxx Tyrol & Vorarlberg · 7xxx Burgenland · 8xxx Styria ·
    9xxx Carinthia & East Tyrol.
- Vienna districts encode into the PLZ: `1XX0` where the middle two digits are the district
  number, e.g. `1010` = 1st district (Innere Stadt), `1070` = 7th (Neubau),
  `1230` = 23rd (Liesing).
- Real city PLZs used in samples: Wien 1010–1230, Graz 8010–8055, Linz 4020–4040,
  Salzburg 5020, Innsbruck 6020, Klagenfurt 9020, Villach 9500, Wels 4600,
  St. Pölten 3100, Dornbirn 6850, Bregenz 6900, Wiener Neustadt 2700, Steyr 4400,
  Feldkirch 6800, Leoben 8700, Krems 3500, Baden 2500, Mödling 2340, Kufstein 6330,
  Hallein 5400, Klosterneuburg 3400, Tulln 3430, Bludenz 6700, Wörgl 6300,
  Saalfelden 5760, Zwettl 3910, Eisenstadt 7000, Amstetten 3300.

---

## 5. City handling & umlauts

- City names carry umlauts and ß: `Wien`, `Sankt Pölten` / `St. Pölten`, `Klagenfurt am
  Wörthersee`, `Villach`, `Wörgl`, `Krems an der Donau`, `Bad Ischl`.
- Some official city names include a suffix (`... am Wörthersee`, `... an der Donau`,
  `... im Innkreis`, `Bad ...`). Parser must treat the whole trailing string after the PLZ
  (up to the country) as the city, not split on the first token.
- `Sankt` abbreviates to `St.`; `Sankt Pölten` == `St. Pölten`.
- Umlaut normalization: `ä→ae`, `ö→oe`, `ü→ue`, `ß→ss` for fuzzy matching, but preserve the
  original for output. Street names likewise (`Kärntner`, `Grünangergasse`, `Währinger`).

---

## 6. Secondary units (sub-building) — Austria-specific vocabulary

| Keyword | Meaning | English | Abbrev | Typical notation |
|---------|---------|---------|--------|------------------|
| **Top** | apartment / unit number | apartment | — | `Top 5`, `.../5` (3rd slash slot) |
| **Stiege** | staircase / entrance | staircase | **Stg.** | `Stiege 2`, `.../2` (1st slash slot) |
| **Tür** | door / apartment door | door | — | `Tür 19`, `/3` (final slash slot) |
| Stock / OG | floor | floor | `OG`, `2. Stock` | floor level, less common in postal addr |

- **`Top` is THE apartment-unit marker in Austria** — the equivalent of "Apt." / "Unit".
  Widespread since the 1990s. A parser must recognize `Top` as a secondary-unit type, not
  as part of the street or a stray word.
- **Slash short form** collapses these: `Straße 45/2/3/8` = house 45 / Stiege 2 / Top 3 /
  Tür 8. In practice many addresses have only `house/Tür` (`4/3`) or `house/Top`
  (`12/5`). Order and count of slash slots vary, which is a genuine ambiguity.
- **`Stiege`** abbreviates `Stg.`; **`Tür`** is sometimes just the bare trailing `/N`.
- Because the schema here allows one sec_unit slot, multi-part addresses capture the most
  specific present unit and note the rest.

---

## 7. Prepositional / non-suffix street names

Austria (especially Vienna's old town) has many street names that are **prepositional
phrases or bare nouns** with no fusible generic suffix. These must be kept **whole** with
type = null:

- `Am Graben` (usually just "Graben"), `Am Hof`, `Am Heumarkt`, `Am Modenapark`
- `Auf der Schmelz`, `In der Krim`, `Zur Spinnerin`
- Bare nouns: `Graben`, `Kohlmarkt`, `Tuchlauben`, `Naschmarkt`, `Freyung`, `Bognergasse`
  (this one IS `-gasse`), `Stubenring`(→ Ring).
- `Alter Markt`, `Neuer Markt`, `Hoher Markt` → adjective + `Markt`; can be split
  (`Alter` + `Markt`) or kept whole; recommend keeping the generic as type where a clear
  generic exists.

Heuristic: only split when the string **ends** in a known generic (`-straße/-strasse/-gasse/
-weg/-platz/-ring/-allee/-zeile/-gürtel/-kai/-lände/-markt/-gang/-steig`). If it **starts**
with `Am/Im/In/Auf/Zur/Zum/An/Bei der` → treat as prepositional, whole name, type null.

---

## 8. Country variants

`Österreich` (German, official) · `Austria` (English) · `AT` (ISO 3166-1 alpha-2) ·
`A` (old vehicle/postal code, still seen: `A-1010 Wien`). Normalize all to `AT`.
Note the legacy `A-1010 Wien` form prefixes the country letter to the PLZ with a hyphen.

---

## 9. Prior work / references

- **libpostal** (openvenues/libpostal): statistical parser trained on OpenStreetMap +
  OpenAddresses; labels tokens as `road`, `house_number`, `unit`, `postcode`, `city`,
  `country`. Handles AT but `unit` extraction for `Top`/`Stiege`/`Tür` and slash forms is
  imperfect; 4-digit postcode handled via country context.
- **Google libaddressinput** (address metadata): AT format string
  `%O%n%N%n%A%n%Z %C` — Organisation, Name, Address lines, then `Zip City`; required fields
  A (street), Z (zip), C (city); zip regex `\d{4}`; no state field required.
- **OpenStreetMap** AT tagging: `addr:street`, `addr:housenumber` (may contain `/` and
  ranges like `12-14`), `addr:unit` (Top), `addr:door`, `addr:postcode` (4 digits),
  `addr:city`. Sub-building info is inconsistently tagged.
- **Österreichische Post** beschriftung guidance: name / street+number(+/Stiege/Top/Tür) /
  PLZ+Ort / country; 4-digit PLZ without special chars; no Bundesland domestically.
- **IETF draft-wolf-civicaddresses-austria**: defines Austrian civic address fields
  including Stiege and Türnummer for emergency-services (PIDF-LO) use.

---

## 10. Failure modes (8+) a naive/German-tuned parser hits

1. **4-digit PLZ vs German 5-digit.** `\d{5}` matches nothing in AT; a greedy numeric
   grab can swallow the house number. Must use `\b\d{4}\b` anchored before the city, and
   branch parser on AT locale. (e.g. `1010 Wien`, not `01010`.)
2. **`Top 5` = apartment.** `Getreidegasse 9 Top 5` — a German parser may treat `Top` as
   part of the street or drop it; it is a secondary unit (apartment). Must map Top→unit.
3. **`/3` = Tür (door).** `Operngasse 4/3` — the `/3` is a door/apartment, NOT part of the
   house number and NOT a range. `4/3` ≠ house "4/3".
4. **`-gasse` names.** Heavy Austrian use of `Gasse`; parsers that only know `Straße`/`Weg`
   mis-type or fail to split `Operngasse`, `Neubaugasse`, `Herrengasse`.
5. **Spaced `Kärntner Straße`.** The generic is a separate token; naive suffix-strip that
   only handles fused `-straße` misses spaced forms (and vice-versa), and the umlaut in
   `Kärntner` trips ASCII-only tokenizers.
6. **Ranges `12-14`.** `Kärntner Ring 12-14` — the `-14` is a civic-number range, not a
   secondary unit and not two separate addresses; must attach as civic_number_suffix.
7. **Prepositional `Am Graben` / `Am Hof`.** No suffix generic; splitting on the last word
   or treating `Am` as noise corrupts the name. Keep whole, type null.
8. **`Stiege` / `Stg.` staircase.** `... 53 Stiege 2 Tür 19` or `.../2/19` — multiple
   slash slots; slot order (Stiege/Top/Tür) is positional and ambiguous, and `Stg.` abbrev
   must be recognized.
9. **Multi-slash `45/2/3/8`.** Three sub-units chained after the house number; a single
   `unit` field can't hold all three, and the slots aren't self-labeling.
10. **City with suffix** `Klagenfurt am Wörthersee`, `Krems an der Donau`, `St. Pölten` —
    tokenizing the city as one word after the PLZ truncates it.
11. **Legacy `A-1010 Wien`** country-prefixed PLZ — the `A-` must be stripped and mapped to
    country AT, not read as part of the postcode/street.
12. **`ß`/umlaut & `strasse`↔`straße` variants** — normalization must fold `Straße`/`Strasse`
    and `ä/ö/ü/ß` without losing the canonical spelling for output.
