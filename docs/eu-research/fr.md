# French Postal Address Research (for a TS / XRegExp parser-normalizer)

Scope: everything needed to parse and normalize FRENCH street addresses. Sources:
La Poste NF Z10-011 (AFNOR), La Poste published abbreviations, libpostal, Google
libaddressinput, Base Adresse Nationale (BAN) / BAL format, IGN BD TOPO, FANTOIR,
OpenStreetMap FR, UPU addressing guide.

---

## 1. Canonical line order — NUMBER FIRST (confirmed)

France writes the **house number BEFORE the street type + name**. This is the
opposite of, e.g., German/Dutch ("Rivoli-straat 10"). Confirmed by La Poste
NF Z10-011, BAN, UPU.

The NF Z10-011 norm defines up to **6 lines**, max **38 characters per line**:

```
Line 1  Identity / recipient        Monsieur Jean DUPONT
Line 2  Delivery-point detail       Appartement 12, Escalier B
Line 3  Building / entrance detail   Résidence Les Tilleuls, Bâtiment C
Line 4  Number + street             10 RUE DE RIVOLI
Line 5  (BP / lieu-dit)             BP 40123
Line 6  Postal code + commune       75001 PARIS
Line 7  Country (intl only)         FRANCE
```

The address element we parse is essentially lines 4 + 6:

```
10 Rue de Rivoli
75001 Paris
```

Single-string forms usually join with a comma: `10 Rue de Rivoli, 75001 Paris`.

Rules from NF Z10-011 worth knowing:
- No punctuation in the number+street line (norm strips commas/periods); the last
  3 lines are recommended UPPERCASE with **no accents** for OCR (LA POSTE reading
  machines). So real-world data comes in BOTH accented mixed-case ("Rue de l'Église")
  and unaccented uppercase ("RUE DE L EGLISE"). A normalizer must tolerate both.
- Abbreviation of the street type is only "official" when the line exceeds 38 chars,
  but abbreviations (BD, AV, RTE...) appear everywhere in practice.

**Order to parse:** `[number] [rep-index bis/ter] [voie-type] [street-name]` then
`[postal_code(5)] [commune] [CEDEX]`.

---

## 2. Repetition index (indice de répétition): bis / ter / quater

A suffix on the house number distinguishing addresses that share a number, inserted
without renumbering the street. Latin multiplicative adverbs:

| Written | Rank | FANTOIR/admin code |
|---------|------|--------------------|
| (none)  | 1    | (blank)            |
| bis     | 2    | B                  |
| ter     | 3    | T                  |
| quater  | 4    | Q                  |
| quinquies | 5  | C                  |
| sexies  | 6    | (rare)             |

Also seen: a **letter** repetition (`10 A`, `10 B`) — common in the South and in
rural/lotissement addressing. Treat single trailing letters A–D as an equivalent
civic-number suffix.

**Representation:** `number = "10"`, `civic_number_suffix = "bis"` (or `"ter"`,
`"quater"`, or a letter). Example `10 bis Rue de la Paix` →
`number:"10", civic_number_suffix:"bis", type:"Rue", street:"de la Paix"`.

Parsing note: `bis/ter/quater` sit **between the number and the voie type**:
`\d+\s*(bis|ter|quater|quinquies)\b`. Case-insensitive. They are NOT part of the
street name and must not be swallowed into it.

---

## 3. Street types (types de voie) — leading word, after the number

The generic type word comes at the **START of the street name** (after the number),
unlike English where "Street/Ave" trails. Below: the common set with the official
La Poste / FANTOIR abbreviation plus everyday-written variants.

| Type (full)   | Official abbr (La Poste/FANTOIR) | Also seen        |
|---------------|----------------------------------|------------------|
| Rue           | RUE                              | r.               |
| Avenue        | AV                               | Av., Ave         |
| Boulevard     | BD                               | Bd, Boul., boulv.|
| Impasse       | IMP                              | Imp.             |
| Allée / Allées| ALL                              | All.             |
| Chemin        | CHEM (also CHE)                  | Ch., Chem.       |
| Place         | PL                               | Pl.              |
| Quai          | QUAI                             | —                |
| Cours         | CRS                              | Crs              |
| Passage       | PASS                             | Pass., Pge       |
| Route         | RTE                              | Rte              |
| Square        | SQ                               | Sq.              |
| Villa         | VLA                              | —                |
| Cité          | CITE                             | —                |
| Sentier       | SENT                             | Sen., Sent.      |
| Voie          | VOIE                             | —                |
| Faubourg      | FBG                              | Fbg, Fg          |
| Rond-point    | RDPT                             | Rd-pt, RPT       |
| Chaussée      | CHAU                             | Chée             |
| Cour          | CR                               | —                |
| Esplanade     | ESP                              | Espl.            |
| Promenade     | PROM                             | Prom.            |
| Ruelle        | RLE                              | —                |
| Venelle       | VEN                              | —                |
| Hameau        | HAM                              | Hme              |
| Lieu-dit      | LDT                              | Ld, L-D          |
| Lotissement   | LOT                              | Lot.             |
| Résidence     | RES                              | Rés.             |
| Domaine       | DOM                              | —                |
| Clos          | CLOS                             | —                |
| Mail          | MAIL                             | —                |
| Montée        | MNT (also MTE)                   | Mtée             |
| Grande Rue    | GDR                              | Gde Rue          |
| Autoroute     | A                                | —                |
| Parvis        | PARV                             | —                |
| Traverse      | TRAV                             | Trav.            |
| Côte          | COTE                             | —                |

The full official La Poste abbreviation table (source:
ecologie.gouv.fr "Abréviations des noms de voie", identical to FANTOIR) contains
~110 entries; the above is the parser-relevant subset. Multi-word types exist
("Rond-point", "Grande Rue", "Chemin départemental" CD, "Route départementale" RD,
"Route nationale" RN) — match longest-first.

**Regex for the voie type** (anchor at start of the post-number remainder,
case-insensitive, accent-optional): e.g.
`^(rue|avenue|av|boulevard|bd|impasse|imp|all[ée]e?s?|all|chemin|chem|che|place|pl|quai|cours|crs|passage|pass|route|rte|square|sq|villa|cit[ée]|sentier|sent|voie|faubourg|f?bg|rond[- ]?point|rd-?pt|rdpt|chauss[ée]e|cours?|esplanade|promenade|hameau|lieu-?dit)\b`

A trailing `.` on the abbreviation must be tolerated and stripped.

---

## 4. Postal code (code postal) — exactly 5 digits, precedes the commune

- Format: **exactly 5 digits**, no space. Regex: `\b\d{5}\b` (or strict
  `\b(?:0[1-9]|[1-8]\d|9[0-8]|97[1-8]|98[46-9])\d{3}\b` if you want to validate the
  département prefix).
- **First 2 digits = département** (01–95 metropolitan, 2A/2B Corsica are written
  20xxx in postal codes, 97x / 98x overseas).
- It PRECEDES the commune on the last line: `75001 Paris`.
- The postal code is NOT the same as the INSEE commune code, and one code can cover
  several communes (rural CEDEX / grouped).

**Paris / Lyon / Marseille arrondissements** — the last 2 digits encode the
arrondissement:
- Paris (75): `75001`–`75020` = 1er…20e arrondissement. (`75116` also exists for
  the 16th's west half — a real exception.) City stays "Paris".
- Lyon (69): `69001`–`69009` = 1er…9e. City "Lyon".
- Marseille (13): `13001`–`13016` = 1er…16e. City "Marseille".
The commune name stays the plain city ("Paris", not "Paris 1er") in normalized form,
though `Paris 15` / `PARIS 15` variants appear in raw data.

**DOM-TOM / overseas** (5 digits starting 97/98):
- 971xx Guadeloupe · 972xx Martinique · 973xx Guyane · 974xx La Réunion ·
  976xx Mayotte · 975xx Saint-Pierre-et-Miquelon · 977xx Saint-Barthélemy ·
  978xx Saint-Martin · 984xx TAAF · 986xx Wallis-et-Futuna · 987xx Polynésie ·
  988xx Nouvelle-Calédonie.
- e.g. `97400 Saint-Denis` (Réunion), `97200 Fort-de-France` (Martinique).

**Corsica:** départements 2A / 2B, but postal codes are `20000 Ajaccio`,
`20200 Bastia` (numeric 20xxx).

---

## 5. Accents & lowercase particles

- French street names carry accents: **é è ê ë à â ä ç ô ö û ù ï î œ**. A parser must
  match `[\p{L}]` / XRegExp `\p{L}` unicode, not `[a-z]`. Data arrives both accented
  ("Rue de l'Évêché") and stripped-uppercase ("RUE DE L EVECHE"). Normalization
  should be accent-insensitive for matching but preserve the original for output.
- **Lowercase particles / articles** stay lowercase inside the name and are part of
  the street, NOT the type: `de`, `du`, `de la`, `de l'`, `des`, `le`, `la`, `les`,
  `d'`, `à`, `au`, `aux`, `sous`, `sur`, `en`, `et`.
  - `10 Rue de Rivoli` → street = `de Rivoli`
  - `Place de la République` → type `Place`, street `de la République`
  - `Rue du Faubourg Saint-Antoine` → type `Rue`, street `du Faubourg Saint-Antoine`
    (here "Faubourg" is part of the NAME, not the leading type — only the FIRST word
    is the type).
- **Apostrophe elision** `d'`, `l'` attaches with no space: `Rue d'Alésia`,
  `Impasse de l'Église`. Accept both `'` (U+0027) and `’` (U+2019).

---

## 6. Secondary units (points de remise / complément)

Appear on lines 2–3, before OR after the street line in single-string input.

| Concept        | Full            | Abbrev            | Notes |
|----------------|-----------------|-------------------|-------|
| Apartment      | Appartement     | Appt, Apt, App    | + number |
| Floor          | Étage           | Ét., Etg          | e.g. "3e étage" |
| Building       | Bâtiment        | Bât, Bat, Bât.    | + letter/number, e.g. "Bât C" |
| Staircase      | Escalier        | Esc, Esc.         | + letter/number |
| Door / box     | Porte           | Pte               | interior door no. |
| Residence      | Résidence       | Rés               | named block |
| PO box         | Boîte postale   | BP                | e.g. "BP 40123" |
| PO box (cedex) | Case postale    | CP / CS           | "CS 12345" (courrier suivi) |
| Delivery zone  | CEDEX           | CEDEX             | see below |

**BP / CS / CP** = PO box; the number is the box, NOT a house number — a classic
libpostal misparse (BP 12 read as house_number 12). Keep `sec_unit_type:"BP"`.

**CEDEX** ("Courrier d'Entreprise à Distribution EXceptionnelle") — a bulk-mail
delivery marker placed **after the commune on the last line**, optionally with a
number: `75008 PARIS CEDEX 08`, `31300 TOULOUSE CEDEX`. It is NOT part of the city
name and NOT a secondary unit at the street; parse it off the commune line. City =
"Paris", cedex = "08".

---

## 7. Country variants

`France`, `FRANCE`, `FR` (ISO-3166 alpha-2), `FRA` (alpha-3). Overseas may also be
written with the territory name. For this parser the country field normalizes to
`FR`.

---

## 8. Prior-work notes

- **libpostal**: statistical; strong on FR but known issues — BP/PO boxes parsed as
  road+house_number (openvenues/libpostal#172); some street names with embedded type
  words ("Rue du Chemin Vert") mis-split (#357). Lesson: only the FIRST token after
  the number is the type; interior "Chemin/Faubourg/Pont" words belong to the name.
- **Google libaddressinput** FR format string: `%O%n%N%n%A%n%Z %C` — i.e.
  Organisation / Name / Address-lines / `POSTALCODE CITY`. Confirms postcode-before-
  city, and that street lines are free-form (number-first by local convention).
- **BAN / BAL format** fields: `numero`, `rep` (répétition = bis/ter/letter),
  `nom_voie`, `code_postal`, `nom_commune`, `lieu_dit_ancienne_commune`, plus
  geo. `rep` is exactly our `civic_number_suffix`. `nom_voie` is TYPE + NAME combined
  (e.g. "Rue de Rivoli"), so BAN does NOT pre-split type from name — the parser must.
- **IGN BD TOPO / FANTOIR**: authoritative type-de-voie abbreviation list (used in §3).
- **OSM FR**: `addr:housenumber` may contain the rep ("10 bis"); `addr:street`
  contains type+name.

---

## 9. Failure modes (concrete — parser MUST handle)

1. **bis/ter/quater** between number and type: `10 bis Rue de la Paix`,
   `2 ter Avenue du Général Leclerc`, `5 quater Chemin des Vignes`. Do not eat into
   street; do not treat "bis" as the street.
2. **Letter repetition**: `12 B Rue Nationale`, `4 A Allée des Roses` — trailing
   single letter is a civic suffix, not a building.
3. **Apostrophe / elision**: `Rue d'Alésia`, `Impasse de l'Église`,
   `Rue de l'Abbé Grégoire` — `d'`/`l'` no space; must not split on the apostrophe.
   Accept curly `’` too.
4. **Hyphenated personal names**: `Rue Jean-Jacques Rousseau`,
   `Avenue du Maréchal de-Lattre-de-Tassigny`, `Rue Jean-Baptiste Clément` — hyphens
   are part of the name; don't treat as separator or range.
5. **CEDEX on the commune line**: `75008 Paris Cedex 08`, `69002 LYON CEDEX 02` —
   strip CEDEX(+num) from the city; city = "Lyon".
6. **Saint / Sainte names**: `Boulevard Saint-Germain`, `Rue Saint-Honoré`,
   `Place Sainte-Catherine`, `Rue Saint-Jean-Baptiste-de-la-Salle` — "Saint" is part
   of the name, hyphen-linked; never a type or unit.
7. **Lieu-dit rural, NO number**: `Le Grand Chêne, 24290 Montignac`,
   `Lieu-dit La Borie, 46200 Souillac` — number null, often type null; whole thing is
   the street/locality. Also `Le Bourg`, `Les Quatre Chemins`.
8. **Place / article-heavy names**: `Place de la République`,
   `Place de la Comédie`, `Cours de l'Intendance` — type + long particle chain kept
   in street.
9. **Type word embedded in the NAME**: `Rue du Faubourg Saint-Antoine`,
   `Rue du Chemin Vert`, `Rue du Pont Neuf`, `Rue des Petits Champs` — only the first
   word (Rue) is the type; "Faubourg/Chemin/Pont" stay in the name.
10. **Arrondissement postal codes / repeated city**: `75116 Paris`, `13008
    Marseille`, `69003 Lyon`, and raw `Paris 15` / `Lyon 07` variants — city stays
    the base commune.
11. **Abbreviated type with period**: `10 Av. des Champs-Élysées`, `3 Bd Voltaire`,
    `1 Pl. Bellecour`, `8 Rte de Lyon` — expand/normalize BD→Boulevard etc.
12. **Uppercase, accent-stripped OCR form**: `10 RUE DE L EGLISE 75011 PARIS` — no
    accents, no apostrophe; must still parse.
13. **BP / CS PO boxes**: `BP 40123, 75362 Paris Cedex 08`, `CS 70001 35172 Bruz
    Cedex` — box number is not a house number.
14. **No comma / run-together**: `10 rue de rivoli 75001 paris` — must split on the
    5-digit postcode boundary.
15. **Ordinal / numbered names**: `Rue du 8 Mai 1945`, `Avenue du 11 Novembre`,
    `Place du 14 Juillet` — the embedded digits are part of the name, NOT a house
    number; the leading token before the type is the number, so
    `Rue du 8 Mai 1945` alone (no leading number) has number=null.
16. **Corsica / DOM postcodes**: `20000 Ajaccio`, `97400 Saint-Denis`,
    `97200 Fort-de-France`.
