# Belgian Postal Address Research (for a street-address parser/normalizer)

Belgium is trilingual for addressing: **Dutch (Flanders + officially bilingual
Brussels), French (Wallonia + Brussels), German (9 municipalities in the East
Cantons)**. The single most important structural fact for a parser is that the
**house number always follows the street name in BOTH languages** — this is the
opposite of France, where the number precedes the street.

Sources consulted: bpost addressing norms (via smarty.com, postgrid.com,
pingen.com, geopostcodes.com), Wikipedia (Postal codes in Belgium, Rue de la
Loi, Chaussée de Wavre, Avenue Louise), OpenStreetMap Wiki (Brussels-Capital
Region street types), Focus on Belgium (translating Brussels street names),
libpostal/Google libaddressinput conventions.

---

## 1. Canonical order

bpost prescribes 3 address lines (recipient omitted here):

```
<street> <house-number> [bus/bte <unit>]
<PPPP> <City>
[BELGIQUE / BELGIË / BELGIUM]      # country only for international mail
```

- **Street name first, then the house number.** No comma between them:
  "Rue de la Loi 16", "Grote Markt 1", "Avenue Louise 143".
- **Postal code precedes the city**, four digits, then a space, then the
  locality: "1000 Bruxelles", "2000 Antwerpen". No comma between postcode and
  city.
- Country name (when present) in UPPERCASE on its own line for international mail.

Real bpost examples: `Rijvisschepark 110, 9052 Gent`, `Lansstraat 3, 2000
Antwerpen`, `Rue de Laeken 1, 1000 Bruxelles`.

**Number-after applies to French streets too.** This is the key divergence from
France. "Rue de la Loi 16" — NOT "16 Rue de la Loi". A parser tuned on French
addresses will mis-handle this.

---

## 2. Street typology — fused (Dutch) vs. prefix (French)

Belgium **mixes two morphologies**. Parser rule of thumb:

> **If the token string begins with a known French thoroughfare type word, it is
> a PREFIX street (type + name). Otherwise treat the last word as a fused Dutch
> type glued onto the name (or an untyped square/named place).**

### 2a. French-style: leading TYPE word, then name, number last

Leading type words (case-insensitive; some abbreviate):

| Type       | Abbrev | Meaning              |
|------------|--------|----------------------|
| Rue        | R.     | street               |
| Avenue     | Av.    | avenue               |
| Boulevard  | Bd     | boulevard            |
| Chaussée   | Ch.    | causeway / highway   |
| Place      | Pl.    | square               |
| Quai       |        | quay                 |
| Chemin     |        | lane / path          |
| Impasse    |        | dead-end / cul-de-sac|
| Allée      |        | alley / lane         |
| Clos       |        | close                |
| Square     |        | square               |
| Rond-Point |        | roundabout           |
| Drève      |        | tree-lined avenue    |
| Venelle    |        | alley                |
| Galerie    |        | arcade               |
| Sentier    |        | footpath             |

"Chaussée de ..." is very common (Chaussée de Wavre, Chaussée de Louvain) and
tends to be long/multi-word — the type is TWO+ tokens away from the number.

### 2b. Dutch-style: FUSED type as a suffix glued onto the name

Common Dutch fused suffixes (top-frequency first): **-straat, -laan, -weg,
-steenweg, -plein, -dreef, -kaai, -baan, -lei, -markt, -hof, -veld, -berg,
-dijk, -dam, -vest, -singel, -kade, -pad, -wijk, -gang**.

Examples: `Meirstraat` (Meir + straat), `Louizalaan` (Louiza + laan),
`Antwerpsesteenweg`, `Koningsplein`, `Grasdreef`, `Graankaai`.

**Corpus/normalization convention for this parser:**
- For a clearly glued single-word street, split the fused type off:
  `Meirstraat` -> street "Meir", type "straat".
- For famous multi-word squares / named places, keep them WHOLE with type=null:
  `Grote Markt` -> street "Grote Markt", type null. `Groenplaats`,
  `Vrijdagmarkt`, `Korenmarkt` likewise kept whole (Markt/plaats/plein are
  culturally part of the square's proper name).
- German-region streets behave like Dutch fused (`-straße`/`-strasse`, e.g.
  Eupen, but most modern signage uses the Dutch-like glued form).

The `type` field in the sample corpus is therefore **the leading French type as
written, or null** (Dutch fused streets and untyped squares). When a Dutch
street is genuinely glued, `street` is the fused-stripped stem and `type` holds
the Dutch suffix ("straat", "laan", etc.).

---

## 3. House number and secondary unit

- House number: bare integer `16`, or integer + letter suffix `16A`, `143B`.
  The letter is the **civic_number_suffix**.
- Ranges exist ("16-18") but are rare; treat as a single number token.
- **Secondary unit (box / apartment):**
  - Dutch: **`bus`** — "Grote Markt 1 bus 3" (bus = letter/mail box, i.e. unit).
  - French: **`bte`** (abbrev. of *boîte*) — "Rue de la Loi 16 bte 3". Full form
    "boîte" also appears.
  - Also seen: `box`, `App`/`Appartement`, `Postbus`/`BP` (post-office box, a
    different concept). For this parser, `bus`/`bte` map to
    sec_unit_type + sec_unit_num.
- The unit follows the house number: `16 bus 3`, `16 bte 3`, `16A bus 12`.

---

## 4. Postal code

- **Exactly 4 digits**, regex `\b\d{4}\b`, no letters, no space inside.
- Precedes the city: `1000 Bruxelles`.
- Ranges roughly geographic: 1xxx Brussels/Walloon Brabant, 2xxx Antwerp
  province, 3xxx Flemish Brabant/Limburg, 4xxx Liège, 5xxx Namur, 6xxx
  Hainaut-east/Luxembourg, 7xxx Hainaut-west, 8xxx West Flanders, 9xxx East
  Flanders. `1000` = central Brussels.

---

## 5. Bilingual / trilingual city names

The same city has different names per language; a normalizer should keep the
name **as written** but be aware of equivalence classes:

| Dutch        | French        | (English)   | Postal (core) |
|--------------|---------------|-------------|---------------|
| Brussel      | Bruxelles     | Brussels    | 1000          |
| Antwerpen    | Anvers        | Antwerp     | 2000          |
| Gent         | Gand          | Ghent       | 9000          |
| Brugge       | Bruges        | Bruges      | 8000          |
| Leuven       | Louvain       | Louvain     | 3000          |
| Luik         | Liège         | Liège       | 4000          |
| Namen        | Namur         | Namur       | 5000          |
| Bergen       | Mons          | Mons        | 7000          |
| Mechelen     | Malines       | Mechelen    | 2800          |
| Kortrijk     | Courtrai      | Kortrijk    | 8500          |
| Doornik      | Tournai       | Tournai     | 7500          |
| Moeskroen    | Mouscron      | Mouscron    | 7700          |
| Aat          | Ath           | Ath         | 7800          |
| Nijvel       | Nivelles      | Nivelles    | 1400          |
| Waver        | Wavre         | Wavre       | 1300          |
| Aarlen       | Arlon         | Arlon       | 6700          |

Street names are likewise translated (Rue de la Loi = Wetstraat; Avenue Louise =
Louizalaan; Chaussée de Wavre = Waversesteenweg). A parser should NOT try to
translate; it parses whichever language form appears.

---

## 6. Country variants

`België` (nl), `Belgique` (fr), `Belgien` (de), `Belgium` (en), ISO `BE` / `BEL`.
Normalize all to `BE`.

---

## 7. Prior work

- **libpostal**: statistical international parser; handles number-after-street
  and `bus`/`bte` as unit tokens, but can mis-split fused Dutch types and
  sometimes tags the leading French `Rue`/`Avenue` as part of the name.
- **Google libaddressinput**: format string for BE is
  `%O%n%N%n%A%n%Z %C` — address line(s), then `postcode city`. Confirms
  4-digit postcode BEFORE city and street-line free-form (number after street).
- **OpenStreetMap**: `addr:street` holds the full street incl. type (fused or
  prefixed), `addr:housenumber` the number (may embed the box in some imports),
  `addr:postcode` 4 digits, `addr:city` locality.
- **bpost / CRAB / BeSt Address**: the official authoritative address register
  (Flanders CRAB, Brussels UrbIS, Wallonia ICAR, merged as BeST Address) stores
  street + number + box + postcode + municipality as separate fields.

---

## 8. Failure modes (parser must handle) — 8+

1. **Number-after in FRENCH streets.** "Rue de la Loi 16" — a France-trained
   parser expects "16 Rue de la Loi" and will either drop the number or treat
   "16" as part of the city line. Belgian French puts the number LAST.
2. **`bus 3` / `bte 3` secondary unit.** "16 bus 3" must yield number=16,
   sec_unit_type=bus, sec_unit_num=3 — not number "3" or a mangled "16 bus 3".
3. **Fused vs. prefix ambiguity.** "Meirstraat 5" (fused, type=straat glued) vs.
   "Rue Neuve 5" (prefix, type=Rue leading). One string starts with the type,
   the other ends with it glued to the name.
4. **4-digit postal code confusion.** A bare `\d{4}` can be mistaken for a house
   number or a year; must be recognized specifically as the token immediately
   BEFORE the city and after any street line.
5. **Bilingual city names.** "Bruxelles" vs "Brussel", "Anvers" vs "Antwerpen" —
   the same postcode maps to two spellings; a city gazetteer keyed on one
   language will miss the other.
6. **"Chaussée de ..." long multi-word French streets.** The type is far from the
   number ("Chaussée de Wavre 1620") and contains lowercase particles (de, du,
   aux) that a naive tokenizer may treat as street-type boundaries.
7. **Civic number letter suffix.** "16A", "143B" — the letter belongs to the
   house number (civic_number_suffix), not a separate unit and not a city
   initial.
8. **No comma between number and street, and none between postcode and city.**
   bpost style omits commas ("Grote Markt 1 2000 Antwerpen"); a comma-delimited
   splitter fails. The parser must segment on the 4-digit postcode, not commas.
9. **Multi-word Dutch squares kept whole.** "Grote Markt", "Groenplaats",
   "Vrijdagmarkt" should not be split as name+type; the Markt/plaats is part of
   the proper square name (type=null).
10. **`bte`/`boîte` vs `Postbus`/`BP`.** A P.O. box (Postbus/BP) is NOT a
    dwelling unit; only `bus`/`bte` are the residential secondary unit.
11. **German-region streets.** East-Cantons streets (`-straße`) parse like Dutch
    fused; must not be mistaken for a different country.
12. **Country token variants.** België/Belgique/Belgien/Belgium/BE/BEL must all
    normalize to BE and be stripped before the postcode/city segmentation.
