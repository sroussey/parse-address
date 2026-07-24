# Czech (CZ) Street-Address Research

Research for a street-address parser/normalizer. Sources: Česká pošta / cs.wikipedia
"Poštovní adresa", RÚIAN concepts, libpostal (openvenues), Google libaddressinput,
OpenStreetMap `talk-cz`, and address-format vendors (Smarty, PostGrid, Precisely).

---

## 1. Canonical order

Czech writes **street name first, then the house number(s)**, then a line with
**postal code BEFORE the city**:

```
<Recipient>
<Street> <descriptive>/<orientation>[letter]      e.g.  Studentská 1903/14a
[<district / městská část>]                        e.g.  Dejvice
<PSČ> <City>                                        e.g.  160 00 Praha 6
```

Single-line form: `Studentská 1903/14a, 160 00 Praha 6`.

Key facts for the parser:

- **Number comes AFTER the street name** (opposite of US "25 Main St").
- The **postal code precedes the city** on the last line (`110 00 Praha`), because
  automated sorting reads the PSČ at the start of that line.
- Google libaddressinput format string for CZ is `%N%n%O%n%A%n%Z %C`
  (name / org / address / **postal then city**). `%Z %C` confirms PSČ-before-city.
- Most Czech street names carry **NO leading type word** — the name IS the street
  (`Národní`, `Celetná`, `Pařížská`, `Na Příkopě`, `Vinohradská`). A generic word
  (`ulice`) is normally omitted. A minority of names lead with a real type token:
  `náměstí` (square), `třída` (avenue), `nábřeží` (embankment), `sady`.

## 2. House numbers — the dual-number system

Czech addresses can carry **two** numbers:

| Term | Abbrev | Meaning | Plaque colour |
|------|--------|---------|---------------|
| číslo popisné | čp. / č.p. | **descriptive** — unique building id within the cadastral area, permanent, used for registration | red |
| číslo orientační | č.o. / čo | **orientation** — sequential position along the *street*, what a visitor / navigation uses; can change | blue |

Written together as **`descriptive/orientation`** — descriptive FIRST, orientation
after the slash (Česká pošta: *"číslo orientační se uvede za číslo popisné a oddělí
se lomítkem"*). So in **`1903/14a`**: `1903` = descriptive (popisné),
`14a` = orientation (orientační). The orientation part may carry a letter suffix
(`14a`, `7b`).

> Caution: some tourist/blog sources state the order backwards. The Česká pošta
> regulation and RÚIAN are authoritative: **popisné / orientační**.

Variants seen in the wild:
- Both: `Spálená 82/4` (82 descriptive, 4 orientation).
- Descriptive only (common in villages / buildings with no orientation number):
  `čp. 12`, or bare `12`.
- Orientation only, sometimes prefixed `č.o. 14`.
- Letter on orientation: `2000/8a`.

### Parser choice for `number` / `civic_number_suffix` (DOCUMENTED)

For a **dual** number `123/45` this dataset uses:

```
number              = "45"    (the ORIENTATION number — the navigation/street number)
civic_number_suffix = "123"   (the DESCRIPTIVE / popisné number)
```

Rationale: the field spec calls `number` the house number used to find the address
on the street, which in CZ is the *orientation* number. The descriptive number is
retained (not discarded) in `civic_number_suffix` so nothing is lost and the
original `123/45` can be reconstructed as `{suffix}/{number}`.

For **single-number** addresses the lone number goes in `number` (suffix `null`),
with `notes` flagging whether it is descriptive-only or orientation-only when known.
An orientation letter (`14a`) stays attached to `number` (`"14a"`).

## 3. Postal code (PSČ)

- Five digits, formatted **`NNN NN`** — 3 digits, space, 2 digits: `110 00`.
- Frequently typed **without** the space: `11000`. Parser must accept both.
- Regex: `\d{3}\s?\d{2}`.
- Hierarchical: first 3 digits = delivery region, last 2 = office. For Prague
  districts the 2nd digit == the district number (Praha 3 → `13x xx`).
- Always sits **immediately before** the city on the last line.

## 4. City handling & diacritics

- City may be a bare name (`Brno`, `Plzeň`, `Olomouc`) or a **Prague district**
  written as `Praha 1` … `Praha 22` (multi-token — keep the number with `Praha`).
  Other cities can append a district too (`Ostrava 1`, `Brno 2`), and a městská
  část / cadastral line (`Dejvice`, `Žižkov`, `Vinohrady`, `Smíchov`) can appear
  *between* street and PSČ line.
- **Praha == Prague** (English exonym). Normalizer should map Prague→Praha.
- Czech diacritics that appear in streets/cities:
  **á č ď é ě í ň ó ř š ť ú ů ý ž** (and upper-case forms). Must be preserved
  and not stripped/confused: `Plzeň`, `Příkopě`, `Nábřeží`, `Žižkov`, `České
  Budějovice`, `Ústí nad Labem`, `Hradec Králové`.

## 5. Street "types" (when a leading word is present)

| Full | Abbrev | English | Capitalisation note |
|------|--------|---------|---------------------|
| náměstí | nám. | square | usually **lower-case** leading word: `náměstí Míru` |
| ulice | ul. | street | almost always omitted |
| třída | tř. | avenue / boulevard | `Klatovská třída` (trailing) or `třída Míru` (leading) |
| nábřeží | nábř. | embankment / quay | `nábřeží Ludvíka Svobody` |
| sady | — | park / gardens | `Sady Pětatřicátníků` |

Notes:
- The type token can be **leading** (`náměstí Míru`, `třída Míru`) OR **trailing**
  (`Klatovská třída`, `Sokolská třída`, `Lannova třída`). Trailing-type names behave
  like ordinary names (the whole thing is effectively the street label); leading
  `náměstí`/`nám.`/`třída`/`tř.` are the ones worth extracting into `type`.
- **Prepositional names** start with a preposition and are a single street label
  with **NO type**: `Na Příkopě`, `U Prašné brány`, `V Celnici`, `K Louži`,
  `Pod Kaštany`, `Na Poříčí`, `Ke Karlovu`, `Nad Královskou oborou`. The first word
  after the preposition is capitalised. Do **not** treat the preposition as a type.
- **Ordinal / date names**: `5. května`, `28. října`, `17. listopadu`, `1. máje`,
  `8. května` — the leading token is a number+period and is part of the street name,
  NOT a house number.

## 6. Country variants

Czech: **Česko** (short), **Česká republika** (official). English: **Czechia**
(short, official since 2016), **Czech Republic**. ISO code **CZ** / CZE. All should
normalise to `CZ`.

## 7. Prior work

- **libpostal** keeps the dual number whole as `house_number` (e.g.
  `Na Pankráci 1690/125` → road `na pankráci`, house_number `1690/125`). Known bug
  (#653): a house-name abbreviation can be mis-tagged as `city`; issue #202 covers
  general CZ parsing errors. libpostal does NOT split popisné vs orientační.
- **Google libaddressinput** (`RegionDataConstants`): CZ `fmt "%N%n%O%n%A%n%Z %C"`,
  requires `%A%C%Z`, postal-code regex `\d{3} ?\d{2}`.
- **RÚIAN** (Registr územní identifikace, adres a nemovitostí) is the authoritative
  national address registry; distinguishes `číslo domovní` (popisné/evidenční) from
  `číslo orientační`.
- **OpenStreetMap** tags `addr:street`, `addr:conscriptionnumber` (popisné),
  `addr:streetnumber` (orientační), `addr:housenumber` (usually the `cp/co` combo),
  `addr:postcode`, `addr:city`.

## 8. Failure modes to test (>=8)

1. **Dual number `123/45`** — must split descriptive vs orientation, not treat as
   a fraction or range. (`Spálená 82/4`)
2. **Orientation letter** — `Studentská 1903/14a` (letter belongs to orientation).
3. **PSČ spaced `110 00`** vs **unspaced `11000`** — both valid; don't read the
   two halves as two tokens / don't merge into house number.
4. **No-type names** — `Národní 25`: whole thing is the street, `type` null. Parser
   must not invent a type.
5. **Prepositional names** — `Na Příkopě 22`, `U Prašné brány 1`: preposition is
   part of the street, NOT a type; number still trails.
6. **Leading type `náměstí`** — `náměstí Míru 9` → type `náměstí`, street `Míru`.
7. **`nám.` abbreviation** — `nám. Míru 9` must map to the same as `náměstí`.
8. **Trailing type `třída`** — `Klatovská třída 12` (type trails the name).
9. **Diacritics** — `Plzeň`, `Příkopě`, `Žižkov`, `České Budějovice`; must survive
   round-trip, not be ASCII-folded into a wrong token.
10. **Multi-word Prague district city** — `Praha 1`, `Praha 4`: keep district number
    with `Praha`, don't read `1`/`4` as a house number or state.
11. **Ordinal/date street names** — `5. května 65`: `5.` is part of the street,
    `65` is the house number; don't swap them.
12. **District line between street and PSČ** — `..., Dejvice, 160 00 Praha 6`.
13. **Country variants** — `Česko` / `Česká republika` / `Czechia` /
    `Czech Republic` / `CZ` all → `CZ`. `Praha` == `Prague`.
14. **Descriptive-only number** — `čp. 12` / bare village number (no orientation).
