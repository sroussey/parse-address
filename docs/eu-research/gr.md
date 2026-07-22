# Greek (GR) Street-Address Research

Research for a street-address parser/normalizer. Sources: ELTA/Hellenic Post
conventions, Wikipedia "Postal codes in Greece", PostGrid / GeoPostcodes /
Smarty / Informatica address-format guides, libpostal (`resources/dictionaries/el/`),
Google libaddressinput, and OpenStreetMap (`addr:*` tags). Real Greek street /
postcode / city combinations verified against vrisko.gr, govmap.gr, xo.gr.

---

## 1. Canonical order

Greek addresses are written **street name FIRST, then house number**, then the
5-digit postal code, then the city:

```
<Recipient name>
<Street name> <house number>
<NNN NN> <City>
<Country>
```

Example (Greek script):

```
Ερμού 15
105 63 Αθήνα
Ελλάδα
```

Latin transliteration (very common on international mail, e-commerce, OSM):

```
Ermou 15
105 63 Athina
Greece
```

Key facts:

- **Number comes AFTER the street name**: `Ερμού 15` = "Ermou (street) 15". This
  is the opposite of US/UK order. `Σταδίου 24`, `Τσιμισκή 10`.
- The **postal code precedes the city** on the same line: `105 63 Αθήνα`.
- On a single inline (one-line) form, components are comma-separated:
  `Ερμού 15, 105 63 Αθήνα` or `Ερμού 15, 105 63, Αθήνα`.
- Region/prefecture (νομός / περιφέρεια, e.g. `ΑΤΤΙΚΗΣ`) is **optional** and
  usually omitted in everyday addressing; the postal code already encodes it.

---

## 2. Street names usually have NO type word (MOST IMPORTANT)

The dominant pattern in Greece is **just the name + number, with no street-type
word at all**. The generic word `Οδός` ("street") is almost always omitted:

- `Ερμού 15` (not "Οδός Ερμού 15") — most common form.
- `Σταδίου 24`, `Ακαδημίας 3`, `Πατησίων 42`, `Αιόλου 100`, `Μητροπόλεως 5`.

Because Greek street names are typically the **genitive case of a person or
place** (Ερμού = "of Hermes", Σταδίου = "of the Stadium", Βενιζέλου = "of
Venizelos"), the name alone unambiguously identifies the street. A parser for GR
should therefore treat the token(s) before the number as the **street name** and
leave `type = null` in the common case.

Type words that DO sometimes appear as a **leading** prefix:

| Greek        | Abbrev(s)      | Latin              | Meaning | Frequency |
|--------------|----------------|--------------------|---------|-----------|
| Οδός         | Οδ.            | Odos               | street  | rare (usually omitted) |
| Λεωφόρος     | Λεωφ., Λ.      | Leoforos / Leof.   | avenue  | common for major arteries |
| Πλατεία      | Πλ.            | Plateia / Pl.      | square  | common |

libpostal's `el/street_types.txt` confirms exactly these three families:
`οδός`, `λεωφόρος` (abbrev `λεωφ`, `λ`), `πλατεία` (abbrev `πλ`).

Parsing rule:
- `Λεωφόρος Κηφισίας 10` → type `Λεωφόρος`, street `Κηφισίας`, number `10`.
- `Λεωφ. Συγγρού 134` → type `Λεωφ.`, street `Συγγρού`, number `134`.
- `Λ. Αλεξάνδρας 5` → type `Λ.`, street `Αλεξάνδρας`, number `5`.
- `Πλατεία Συντάγματος 1` → type `Πλατεία`, street `Συντάγματος`, number `1`.
- `Πλ. Ομονοίας 4` → type `Πλ.`, street `Ομονοίας`, number `4`.
- `Οδός Ερμού 15` → type `Οδός`, street `Ερμού`, number `15` (Οδός present but rare).

Note the type is a **leading** prefix (before the name), never a suffix — unlike
English "Main Street". There is no trailing-type case in Greek.

---

## 3. House / civic number

- Plain integer after the street name: `15`, `24`, `134`, `255`.
- **Greek-letter suffix** on the number: `15Α`, `12Β`, `7Γ` (Α/Β/Γ/Δ used like
  A/B/C/D bis-numbers). Store number `15`, `civic_number_suffix = "Α"`. The
  suffix is a Greek capital letter (Α Β Γ Δ Ε …); occasionally Latin (`15A`).
- **Range**: `15-17`, `40-42` — two civic numbers joined by a hyphen. Keep the
  whole thing as the number (`15-17`).
- Sometimes an explicit marker `αρ.` (short for **αριθμός** = "number") precedes
  the number: `Ερμού, αρ. 15` or `Ερμού αρ. 15`. The `αρ.` token should be
  stripped; number = `15`.
- Building/floor detail may follow: `όροφος` (floor, abbrev `όρ.`), `διαμέρισμα`
  (apartment, abbrev `διαμ.`), `Τ.Θ.` / `ΤΘ` (Ταχυδρομική Θυρίδα = PO box).

---

## 4. Postal code (Ταχυδρομικός Κώδικας — ΤΚ)

- **5 digits**, introduced by ELTA in 1983.
- Conventionally written as **`NNN NN`** — three digits, a space, then two:
  `105 63`, `106 77`, `546 21`, `262 22`. The space is the official ELTA style.
- Frequently also written with **no space**: `10563`. A parser must accept both.
- Regex: `\d{3}\s?\d{2}` (i.e. `\d{3}` optional-space `\d{2}`).
- The **first 3 digits** identify the city/municipality/prefecture; in big
  cities the **last 2** identify the delivering post office.
- The postal code comes **before the city**: `105 63 Αθήνα`.
- Prefix ranges by area (real): Athens/Attica `10x xx`–`11x xx`, `12x xx`,
  `14x xx`, `15x xx`, `16x xx`, `17x xx`, `18x xx`; Thessaloniki `54x xx`;
  Patras `26x xx`; Heraklion (Crete) `71x xx`; Larissa `41x xx`;
  Volos `38x xx`; Ioannina `45x xx`; Chania `73x xx`; Rhodes `85x xx`.
- PO box is written `Τ.Θ. <number>` and may replace the street line.

---

## 5. City handling

- City is written in the **nominative** (Αθήνα, Θεσσαλονίκη) even though the
  street name is genitive.
- Common cities (Greek / Latin):
  - Αθήνα / Athina / Athens
  - Θεσσαλονίκη / Thessaloniki / Salonica
  - Πειραιάς / Pireas / Piraeus
  - Πάτρα / Patra / Patras
  - Ηράκλειο / Irakleio / Heraklion
  - Λάρισα / Larisa / Larissa
  - Βόλος / Volos
  - Ιωάννινα / Ioannina
  - Χανιά / Chania
  - Ρόδος / Rodos / Rhodes
  - Καλαμάτα / Kalamata
  - Κέρκυρα / Kerkyra / Corfu
  - Κηφισιά / Kifisia, Γλυφάδα / Glyfada, Μαρούσι / Marousi (Attica suburbs)
- The optional region/prefecture is usually written in **caps + genitive**
  (`ΑΤΤΙΚΗΣ`, `ΘΕΣΣΑΛΟΝΙΚΗΣ`) when present; treat as `state`.

---

## 6. Country variants

`Ελλάδα` (native), `Greece` (English), `Hellas` / `Hellenic Republic`
(formal/transliterated), `Ελλάς` (katharevousa), ISO `GR` / `GRC`. Normalize all
to `GR`.

---

## 7. Prior work

- **libpostal** — statistical parser trained on OSM. Ships an `el/` dictionary
  set: `street_types.txt` (`οδός`, `λεωφόρος`/`λεωφ`/`λ`, `πλατεία`/`πλ`),
  plus Greek→Latin transliterators (`Greek-Latin`, `Greek-Latin-BGN`,
  `Greek-Latin-UNGEGN`). Labels: `house_number`, `road`, `postcode`, `city`.
- **Google libaddressinput** — GR format string roughly
  `%N%n%O%n%A%n%Z %C` → name, organisation, address lines, then `postcode city`.
  Confirms `%Z %C` = **postcode then city**, no state field required.
- **OpenStreetMap** — `addr:street` (name only, no type in most GR data),
  `addr:housenumber` (incl. suffixes/ranges), `addr:postcode` (5 digits, no
  space in OSM), `addr:city`. Greek OSM data is a primary training corpus.
- **ELTA / Hellenic Post** — defines the 5-digit ΤΚ and the `NNN NN` printed
  style; recommends `postcode + city` on one line, country last.

---

## 8. Failure modes (parser must handle ≥ 8)

1. **No-type names** — `Ερμού 15`: there is NO street-type word; a parser that
   requires a type (Street/Ave) will fail. The whole token before the number is
   the street name; `type = null`.
2. **Number AFTER the street** — `Σταδίου 24`. A US-trained parser that expects
   `24 Σταδίου` (number first) mis-assigns fields.
3. **`NNN NN` spaced postal code** — `105 63` contains an internal space, so a
   naive tokenizer splits it into `105` + `63` and may read `105` as a house
   number. Must match `\d{3}\s?\d{2}` as one unit. Also accept `10563`.
4. **`Λεωφ.` / `Λ.` avenue prefix** — `Λεωφ. Συγγρού 134` / `Λ. Κηφισίας 255`:
   leading type must be split off; the abbreviation ends in a period that can be
   confused with a sentence boundary. Also full `Λεωφόρος`.
5. **`Πλατεία` / `Πλ.` square prefix** — `Πλατεία Συντάγματος 1`: multi-word
   place; without recognizing `Πλατεία` as a type, the street becomes
   "Πλατεία Συντάγματος" instead of "Συντάγματος".
6. **Greek-letter number suffix** — `15Α`, `12Β`: the trailing Greek capital
   glues to the digits; must be split into number `15` + suffix `Α`, and NOT be
   mistaken for the start of the city name.
7. **`αρ.` marker** — `Ερμού αρ. 15`: the `αρ.` (αριθμός) token must be
   recognized and stripped, otherwise it is misread as part of the name or an
   apartment.
8. **Greek vs Latin script** — same address may arrive as `Ερμού 15` or
   `Ermou 15`. Multiple transliteration schemes exist (`Ermou`, `Ermoú`); the
   parser needs permissive Unicode character classes for both scripts.
9. **Accents / tonos** — `Ερμού` vs `Ερμου`, `Πλατεία` vs `Πλατεια`,
   `Θεσσαλονίκη` vs `Θεσσαλονικη`. The polytonic/monotonic tonos mark (´) may be
   present, absent, or on a different vowel; matching must be accent-insensitive.
10. **Number range** — `15-17`: hyphenated dual civic number must stay together,
    not be treated as street-number-minus-something or a numeric range split.
11. **Οδός present** — `Οδός Ερμού 15`: the rare explicit `Οδός` type must be
    stripped so street = `Ερμού`, not `Οδός Ερμού`.
12. **Country variants** — `Ελλάδα` / `Greece` / `Hellas` / `Ελλάς` / `GR` all
    normalize to `GR`; trailing country token must not be swallowed into city.
13. **Optional region in CAPS** — a trailing `ΑΤΤΙΚΗΣ` / `ΘΕΣΣΑΛΟΝΙΚΗΣ` is the
    prefecture (state), not a second city; must not be merged with the city.
14. **PO box** — `Τ.Θ. 1234` replaces the street; `ΤΚ`/`Τ.Θ.` markers should
    not be parsed as street names.
