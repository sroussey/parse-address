# Italian Postal Address Research (for parse-address / XRegExp TS parser)

Sources consulted: Poste Italiane "Standard di composizione indirizzi" (Ed. Ago 2023),
Poste Italiane CAP FAQ, Wikipedia (Indirizzo, CAP, Località, sigle province),
Google libaddressinput (chromium-i18n `IT` data), OpenStreetMap IT tagging,
libpostal (openvenues/libpostal, incl. issue #58 on `snc`), ISTAT comune/provincia
lists, PagoPA SEND "Composizione degli indirizzi", comuni-italiani.it province table.

---

## 1. Canonical order (CRITICAL: number comes AFTER the street name)

Poste Italiane recommends this multi-line layout:

```
[Nome Cognome / Ragione sociale]         <- recipient (not our concern)
[c/o / presso / interno / piano]         <- optional secondary line
Via Roma 15                              <- TOPONIMO + street NAME + house NUMBER
00184 Roma RM                            <- CAP + comune + provincia (sigla)
[Italia]                                 <- country (optional / for intl mail)
```

Key rule that differs from US/UK: **the toponimo (street type) is at the START,
the house number (numero civico) is at the END.**

- `Via Roma 15` -> type=`Via`, street=`Roma`, number=`15`
- `Piazza San Marco 1` -> type=`Piazza`, street=`San Marco`, number=`1`
- `Corso Vittorio Emanuele II 12` -> type=`Corso`, street=`Vittorio Emanuele II`, number=`12`

Punctuation is optional; a comma often separates the street line from the CAP line
when the whole address is written on one line:
`Via Roma 15, 00184 Roma RM`.

Google libaddressinput `IT`:
- `fmt`  = `%N%n%O%n%A%n%Z %C %S`  (Name / Org / Address lines / CAP City Province)
- `require` = `ACSZ` (address, city, province/state, zip all mandatory)
- `upper` = `CS` (city and province rendered uppercase)

So the last line is unambiguously: `CAP` `Comune` `SIGLA-PROVINCIA`.

---

## 2. Street types (toponimo) — appear FIRST, before the name

Common toponimi and their standard abbreviations. Match case-insensitively; the
trailing `.` in abbreviations is optional and dotted/undotted both occur.

| Full form        | Common abbreviations            | Notes |
|------------------|----------------------------------|-------|
| Via              | V., V, Vía                       | by far the most common |
| Viale            | V.le, Vle, V.le                  | boulevard |
| Piazza           | P.za, P.zza, Pza, Pzza, P.        | square |
| Piazzale         | P.le, Ple, P.zle                 | large square |
| Corso            | C.so, Cso                        | avenue |
| Largo            | L.go, Lgo                        | widening/small square |
| Vicolo           | V.lo, Vic., Vlo                  | alley |
| Strada           | Str., Str, S.da                  | road; also "Strada Statale/Provinciale/Comunale" |
| Strada Statale   | SS, S.S.                         | + number, e.g. "SS 16" |
| Strada Provinciale | SP, S.P.                       | + number |
| Salita           | Sal.                             | uphill road (Genova etc.) |
| Calle            | —                                | Venice street |
| Fondamenta       | Fond.                            | Venice canal-side |
| Campo / Campiello | —                               | Venice square |
| Ramo / Rio Terà / Sotoportego | —                   | Venice |
| Lungomare        | L.mare, Lgm.                     | seafront |
| Lungarno / Lungadige / Lungotevere | —              | riverside (Firenze/Verona/Roma) |
| Contrada         | C.da, Ctr.                       | rural, esp. South |
| Borgo            | B.go, Bgo                        | |
| Località         | Loc.                             | hamlet/locality (see §7) |
| Frazione         | Fraz.                            | administrative sub-locality |
| Piazza d'Armi / Rotonda / Traversa | —               | |
| Galleria         | Gall.                            | e.g. Galleria Vittorio Emanuele II |
| Passeggiata / Passaggio | Pass.                     | |
| Stradone / Stradella | —                            | |
| Circonvallazione | Circ.ne                          | ring road |
| Via Nazionale/Provinciale/Comunale/Vicinale | —      | |

The parser should treat the toponimo as a leading token and capture the remainder
(up to the trailing civic number) as the street name.

---

## 3. The numero civico (house number)

- Usually a bare integer at the END of the street line: `Via Roma 15`.
- May carry a **letter/annex** (esponente): `15/A`, `15A`, `15 bis`, `15/b`,
  `12 rosso` (Firenze red/black numbering), `27/int.2`.
- Split rule: `15/A` -> number=`15`, civic_number_suffix=`/A` (or normalized `A`).
  Keep the separator or strip it — recommended: capture the raw suffix (`/A`, `A`,
  `bis`, `ter`, `rosso`) and expose a normalized letter separately if desired.
- Latin ordinals used as annexes: `bis` (2nd), `ter` (3rd), `quater` (4th).
  These follow the number with a space: `15 bis`.
- Firenze/Genova dual numbering: civic numbers can be `rosso` (commercial) or
  `nero` (residential): `Via de' Tornabuoni 1 rosso` / `... 1r`.
- **`snc`** = *senza numero civico* ("no house number"). Appears where a bare
  number would go: `Via dei Mille snc`. Pitfall: libpostal historically expanded
  `snc` to *società in nome collettivo* (a company type) — see libpostal issue #58.
  Treat `snc` as "no civic number": number=null, civic_number_suffix=`snc`.
- `s.n.` / `s.n.c.` are dotted variants of the same.
- `km` markers on extra-urban roads: `SS 16 km 3,200` — the number is a kilometer
  point, not a civic; rare but worth not mis-parsing.

Regex sketch for the civic tail (after the street name):
`(\d+)\s*(?:[/\-]?\s*([A-Za-z]|bis|ter|quater|rosso|nero|r))?` plus a separate
alternative for `s\.?n\.?c\.?`.

---

## 4. CAP (Codice di Avviamento Postale) — postal code

- **Exactly 5 digits.** `^\d{5}$`.
- **Leading zeros are significant and common** in the North-West (00xxx Roma/Lazio),
  Sardinia (07xxx/08xxx/09xxx), Umbria (05xxx/06xxx), and central Lazio
  (01xxx–04xxx). NEVER strip/trim leading zeros or store CAP as an integer.
  Examples: `00184 Roma`, `09124 Cagliari`, `07100 Sassari`, `05100 Terni`,
  `01100 Viterbo`.
- Position: the CAP **precedes** the comune on the final line: `00184 Roma RM`.
- Some large cities have per-zone CAPs (Roma 00118–00199, Milano 20121–20162,
  Napoli 80121–80147); smaller comuni use a single `xxxx0`/`xxx00` code.
- Big companies/PO users may have a dedicated CAP; not our concern for parsing.

---

## 5. Province (sigla) — 2-letter uppercase code -> `state` field

Written EITHER in parentheses after the comune, OR bare after the comune:
- `20121 Milano MI`  (bare, Poste-preferred on the CAP line)
- `Milano (MI)`       (parenthesized, common in prose/forms)
- `Roma (RM)`

Two uppercase letters. Store in the parser's `state` field. Note: for the
metropolitan cities the historic sigla is still used for addressing (RM, MI, TO,
NA, ...). Sardinian reforms abolished CI/OT/VS/OG and created SU (Sud Sardegna),
but the old sigle still appear on legacy mail — a lenient parser should accept
all of them.

### Full list of province sigle (accept all, case-insensitive -> upper):

```
AG Agrigento        AL Alessandria      AN Ancona           AO Aosta
AR Arezzo           AP Ascoli Piceno    AT Asti             AV Avellino
BA Bari             BT Barletta-Andria-Trani   BL Belluno    BN Benevento
BG Bergamo          BI Biella           BO Bologna          BZ Bolzano
BS Brescia          BR Brindisi         CA Cagliari         CL Caltanissetta
CB Campobasso       CI Carbonia-Iglesias(*)   CE Caserta     CT Catania
CZ Catanzaro        CH Chieti           CO Como             CS Cosenza
CR Cremona          KR Crotone          CN Cuneo            EN Enna
FM Fermo            FE Ferrara          FI Firenze          FG Foggia
FC Forlì-Cesena     FR Frosinone        GE Genova           GO Gorizia
GR Grosseto         IM Imperia          IS Isernia          SP La Spezia
AQ L'Aquila         LT Latina           LE Lecce            LC Lecco
LI Livorno          LO Lodi             LU Lucca            MC Macerata
MN Mantova          MS Massa-Carrara    MT Matera           VS Medio Campidano(*)
ME Messina          MI Milano           MO Modena           MB Monza e della Brianza
NA Napoli           NO Novara           NU Nuoro            OG Ogliastra(*)
OT Olbia-Tempio(*)  OR Oristano         PD Padova           PA Palermo
PR Parma            PV Pavia            PG Perugia          PU Pesaro e Urbino
PE Pescara          PC Piacenza         PI Pisa             PT Pistoia
PN Pordenone        PZ Potenza          PO Prato            RG Ragusa
RA Ravenna          RC Reggio Calabria  RE Reggio Emilia    RI Rieti
RN Rimini           RM Roma             RO Rovigo           SA Salerno
SS Sassari          SV Savona           SI Siena            SR Siracusa
SO Sondrio          SU Sud Sardegna     TA Taranto          TE Teramo
TR Terni            TO Torino           TP Trapani          TN Trento
TV Treviso          TS Trieste          UD Udine            VA Varese
VE Venezia          VB Verbano-Cusio-Ossola   VC Vercelli   VR Verona
VV Vibo Valentia    VI Vicenza          VT Viterbo
```

(*) CI, VS, OG, OT abolished 2016 (Sardinia) — accept as legacy; SU replaces them.
This yields ~107 current + a handful of legacy = ~110–111 codes total.

---

## 6. Accents, apostrophes, casing

- Street names carry accented vowels: à è é ì í ò ó ù ú (and rarely ä ö ü in
  South Tyrol / bilingual BZ). The XRegExp patterns must be Unicode-aware
  (`\p{L}`) rather than `[A-Za-z]`. Examples: `Località San Cesàreo`,
  `Via Niccolò Tommaseo`, `Corso Perù`.
- Apostrophes are frequent and meaningful, especially in saint names elided
  before a vowel: `Sant'Ambrogio`, `Sant'Anna`, `Sant'Elia`, `Ca' Foscari`
  (Venice `Ca'` = casa), `de' Medici`, `dell'Orso`, `d'Azeglio`.
  Both the ASCII apostrophe `'` and the typographic `’` (U+2019) appear — normalize.
  Do NOT split the street name on the apostrophe.
- Elisions before consonants use `San`/`Santo`/`Santa` unelided:
  `Piazza San Marco`, `Via Santa Chiara`, `Via Santo Stefano`.
- South Tyrol (BZ) addresses are bilingual IT/DE and may use German toponimi
  (`Straße`, `Platz`, `Weg`) or slashed bilingual names.

---

## 7. Secondary units (unità secondaria)

Placed on their own line or appended after the civic number:

| Type            | Abbrev(s)          | Meaning |
|-----------------|--------------------|---------|
| Interno         | Int., int, Interno | apartment/unit number ("Int. 5") |
| Piano           | P., Piano          | floor ("Piano 3", "3° piano") |
| Scala           | Sc., Scala         | staircase ("Scala B") |
| Palazzo/Palazzina | Pal., Palazzo    | building |
| Edificio/Stabile/Isolato | Ed.        | building/block |
| Appartamento    | App., Appto, Alloggio | apartment |
| Lotto           | —                  | lot |
| Torre           | —                  | tower |
| Corte / Cortile | —                  | courtyard |
| c/o  or  presso | c/o, presso        | "care of" |
| Casella Postale | C.P., CP           | PO box ("Casella Postale 132") |

Typical combined tail: `Via Verdi 10, Scala B, Interno 4` or
`Via Verdi 10 int. 4` or `Via Verdi 10/B piano 2 int. 5`.

Parser: after the civic number, optionally consume one or more
`(sec_unit_type sec_unit_num)` pairs. `Interno`/`Int` -> apartment; `Scala`/`Sc`
-> staircase (value may be a letter); `Piano`/`P` -> floor.

---

## 8. Country variants

`Italia` (native), `Italy` (English), `IT` (ISO-3166-1 alpha-2), `ITA` (alpha-3).
Usually absent on domestic mail; present only for international. Normalize to `IT`.

---

## 9. Prior work notes & failure modes (≥8 concrete)

The upstream `parse-address` grammar is US-centric (number FIRST, then street,
`prefix/street/type/suffix`, ZIP `\d{5}`, 2-letter `state`). For Italian we must:
number LAST, toponimo FIRST, `state` = province sigla, `zip`-equivalent = CAP.

Concrete failure modes to test against:

1. **Civic with `/A`** — `Via Roma 15/A`: naive `\d+$` grabs nothing or grabs `15`
   and drops `/A`. Must capture number=`15`, suffix=`/A`.
2. **`bis`/`ter`** — `Via Milano 4 bis`: the word `bis` looks like part of the
   street name; must attach it to the civic as a suffix, not the name.
3. **`snc`** — `Via dei Mille snc`: no number at all; must not treat `snc` as a
   street-name token nor (per libpostal #58) as a company type. number=null.
4. **Province in parens vs bare** — `Milano (MI)` vs `20121 Milano MI`: two
   different shapes both mapping to state=`MI`; parser must handle both.
5. **Apostrophe saint** — `Via Sant'Ambrogio 3`: must NOT split on `'`;
   street=`Sant'Ambrogio`. Also `’` typographic variant.
6. **Saint multi-word name** — `Piazza San Marco 1`: `San Marco` is the street
   name (2 tokens); the toponimo is only `Piazza`. Don't stop the name at `San`.
7. **Roman numerals** — `Corso Vittorio Emanuele II 12`: `II` is part of the name,
   `12` is the civic; a greedy number matcher could confuse `II`/`12` boundaries,
   and a Roman-numeral pass could eat `II` wrongly. street=`Vittorio Emanuele II`.
8. **Frazione / località** — `Località Ponte a Poppi 4, 52014 Ponte a Poppi AR`
   or `Fraz. San Martino, Via Roma 2`: the locality is neither comune nor street;
   don't fold it into the street name or the city.
9. **Leading-zero CAP** — `00184 Roma`, `09124 Cagliari`, `07100 Sassari`:
   must be kept as a 5-char string; integer parsing corrupts it.
10. **Abbreviated toponimo** — `V. Roma 15`, `P.za Duomo 1`, `C.so Italia 3`,
    `V.le Europa 22`: dotted/undotted abbreviations must map to the full type.
11. **Comma-vs-newline separation** — one-line `Via Roma 15, 00184 Roma RM` vs
    multi-line; the CAP/city/province block may or may not be comma-delimited.
12. **Multi-word comune** — `Reggio Calabria`, `San Giovanni Rotondo`,
    `Cava de' Tirreni`, `Figline e Incisa Valdarno`: city name has spaces/apostrophe
    and can be confused with the province sigla or with the street.
13. **Dual red/black numbering (Firenze/Genova)** — `Via de' Tornabuoni 1r` /
    `1 rosso`: the `r`/`rosso` is a suffix, not a unit.
14. **Interno appended inline** — `Via Verdi 10 int. 4`: `int. 4` must become
    sec_unit_type=`Interno`, sec_unit_num=`4`, not part of the civic.
15. **`Via`-as-substring** — comune or street names containing "via"
    (`Viadana`, `Via Roma` in a town literally named on the line) shouldn't
    trigger a false toponimo match mid-string.
16. **Bilingual BZ** — `Via Portici / Laubengasse 9, 39100 Bolzano BZ`: slash
    separates IT/DE names; keep as one street or the IT side.
