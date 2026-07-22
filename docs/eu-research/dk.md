# Danish (DK) Street-Address Research

Research for a street-address parser/normalizer. Sources: PostNord / Post Danmark
addressing norms, DAWA / Danmarks Adresser (DAR — the authoritative Danish address
register), Google libaddressinput (Chromium i18n), libpostal, and OpenStreetMap /
Wikipedia street data. Key references at the bottom.

---

## 1. Canonical order

Danish addresses run **street name → house number → (floor/door) → postal code → city**,
i.e. the number comes **AFTER** the street name, and the **4-digit postal code precedes
the city**:

```
Vejnavn Husnr[, Etage. Dør], Postnr By
Nørregade 12, 3. tv, 1165 København
```

Google libaddressinput format for DK: `fmt = "%N%n%O%n%A%n%Z %C"`
(Name / Organisation / street-Address line / **Postal-code SPACE City**), required
fields `A` (address), `C` (city), `Z` (postcode); postal-code regex `\d{4}`.

DAWA "adressebetegnelse" components (in order): `vejnavn` (street name),
`husnummer` (house number), optional `etage` (floor), optional `dør` (door),
optional `supplerende bynavn` (supplementary locality), `postnummer` (4-digit),
`postnummerets navn` / `postdistrikt` (postal-district = city).

Multi-line mail form:
```
Firstname Lastname
Nørregade 12, 3. tv
1165 København K
Danmark
```

---

## 2. Street types are FUSED as a suffix (one word)

The overwhelmingly common pattern is that the generic street type is **glued onto the
end of the name as one lowercase word** — `Nørre` + `gade` → **Nørregade**. There is no
space. This is the single most important DK-specific fact for a parser: the "type" is a
**suffix of a single token**, not a separate word as in English ("Main Street").

Common fused suffixes (definite form in parentheses — Danish often uses the definite
article form as the actual name):

| Suffix (indefinite / **definite**) | Meaning | Example |
|---|---|---|
| `-gade` | street | Nørre**gade**, Vester**gade**, Isted**gade** |
| `-vej` / `-**vejen**` | road | Enghave**vej**, Strand**vejen** |
| `-vænge` / `-**vænget**` | close / small residential road | Rosen**vænget**, Birke**vænget** |
| `-allé` / `-**alléen**` | avenue (often written SPACED, see §7) | (mostly spaced) |
| `-boulevard` / `-**boulevarden**` | boulevard | Å**boulevarden**, **Boulevarden** |
| `-plads` / `-**pladsen**` | square | Rådhus**pladsen** |
| `-torv` / `-**torvet**` | square / market square | Ama**gertorv**, Kul**torvet**, Ny**torv** |
| `-stræde` | narrow street / alley | Læder**stræde**, Pile**stræde** |
| `-gang` / `-**gangen**` | passage / corridor | (Pistol**stræde**-type alleys) |
| `-park` / `-**parken**` | park | Ege**parken** |
| `-have` / `-**haven**` | garden | Æble**haven** |
| `-bro` / `-**broen**` | bridge | Vester**bro**, Dybbøls**bro** |
| `-havn` / `-**havnen**` | harbour | Ny**havn** |
| `-vold` / `-**volden**` | rampart | Vester **Voldgade** (Vold+gade) |
| `-brogade` | (bro+gade compound) | Vesterbro**gade**, Nørrebro**gade** |
| `-holmen`, `-marken`, `-bakken`, `-banen`, `-passagen`, `-toften`, `-lunden`, `-højen` | terrain features used as street types | Sluse**holmen** |

Most frequent by far: **`-gade`** and **`-vej`**. Because the suffix is fused, a naive
splitter that looks for a trailing whitespace-delimited "type" word will fail on nearly
every central-Copenhagen address.

**Many streets have NO separable type at all** and must be kept whole:
- Pedestrian/proper-name streets: `Strøget`, `Nyhavn` (arguably Ny+havn), `Vesterbro`.
- Genitive proper-name streets where the type IS spaced and capitalised:
  `Sankt Peders Stræde`, `Sankt Hans Torv`, `Sankt Annæ Plads`,
  `H.C. Andersens Boulevard`, `Store Torv`, `Kongens Nytorv` (Ny+torv fused),
  `Islands Brygge` (brygge = wharf), `Sønder Boulevard`, `Frederiksberg Allé`,
  `Nørre Allé`, `Falkoner Allé`.

So a robust splitter needs BOTH: (a) suffix stripping on a single token, and (b) a
fallback that keeps the whole string as the name when no known fused suffix matches or
when the type appears as a separate capitalised word.

---

## 3. House number (husnummer)

DAR rules: a house number is **1–999 optionally followed by a single capital letter A–Z
with no space** (letters I, J, O, Q are not used for new numbers). The letter is a
**full, inseparable part of the house number**.

- Plain: `12`
- With letter: `12A`, `34B`, `7C` (parser: number `12`, suffix `A`)
- Ranges (a building spanning several numbers): `12-14`, `10-16`
  (parser: number `12`, civic-suffix `-14`)
- Corner addresses may combine, but formal DAR does not use ranges — ranges appear in
  everyday/business writing.

---

## 4. Floor + door (etage + dør) — the secondary unit

After the house number, an apartment is identified by **floor then side/door**, comma- or
space-separated, e.g. `3. tv` = *tredje sal til venstre* (3rd floor, left).

**Floor (etage):**
- `st.` / `st` = *stuen* — ground floor
- `1.`, `2.`, `3.` … = 1st, 2nd, 3rd floor (the "." is the Danish ordinal marker)
- `1. sal` — "1st floor" spelled with the word *sal*
- `kl.` / `k1`, `k2` = *kælder* — basement (k2 = one below, etc.)

**Side / door (dør):**
- `tv` / `tv.` = *til venstre* — to the **left**
- `th` / `th.` = *til højre* — to the **right**
- `mf` / `mf.` = *midt for* — in the **middle**
- Numeric door (buildings with 4+ doors): `1`, `2`, `3` … counted left→right
- Systematic codes: up to 4 chars of `a–z / 0–9 / -`, e.g. `a101`
- The word `dør` may appear: `2. dør 14`

Typical full unit strings: `st. tv`, `st. th`, `1. tv`, `2. th`, `3. tv`, `4. mf`,
`st.`, `1. sal`, `kld.`.

**Parser modelling used in the samples**: the whole floor+side string is the secondary
unit. `sec_unit_type = "sal"` whenever a floor/door unit is present, and
`sec_unit_num` holds the literal string, e.g. `"3. tv"`, `"st."`, `"2. th"`, `"st. tv"`,
`"1. sal"`, `"4. mf"`.

---

## 5. Postal code (postnummer)

- **Exactly 4 digits.** Regex `\d{4}`. No letters, no space inside.
- **Precedes** the city: `1165 København`, `8000 Aarhus C`.
- Rough geography: 1xxx–2xxx Copenhagen area; 3xxx North Zealand; 4xxx rest of
  Zealand + islands; 5xxx Funen; 6xxx South Jutland; 7xxx West/Central Jutland;
  8xxx East/Central Jutland (Aarhus 8000); 9xxx North Jutland (Aalborg 9000).
- Copenhagen city centre uses low numbers block-by-block (e.g. 1050 Kongens Nytorv,
  1107 Grønnegade, 1165 Nørregade, 1200 Højbro Plads, 1456 Vestergade, 1550
  Rådhuspladsen). PO-box-like low ranges are normal, not errors.

---

## 6. City handling and Danish characters

- The three extra vowels **æ, ø, å** appear constantly in street and city names
  (Nørregade, Østerbrogade, Åboulevarden, Blågårdsgade, Læderstræde, Ærøgade).
  A parser must be UTF-8 clean; do NOT strip or ASCII-fold blindly (folding `å→aa`,
  `ø→oe`, `æ→ae` is the historical transliteration and is sometimes seen, but the
  canonical spelling keeps the letters). `Å` was historically written `Aa`
  (Aarhus ↔ Århus — see below).
- **Postal-district vs city**: Copenhagen's postal district text carries a compass
  letter — `København K` (centre), `V`, `Ø`, `N`, `S`, `NV`, `SV`. Likewise
  `Aarhus C`, `Odense C`, `Frederiksberg C`, `Aalborg`. In these samples the `city`
  field is set to the exact text that follows the postal code in the input (so
  `2200 København N` → city `København N`), matching how a normalizer would echo the
  postal district. A stricter normalizer might collapse all of these to `København`.
- **Aarhus / Århus**: officially spelled **Aarhus** since 2011 (was **Århus**). Both
  spellings occur in the wild; treat as the same city.
- **København / Copenhagen**: `København` is the Danish name; `Copenhagen` is the
  English exonym. Both should resolve to the same place.

---

## 7. Secondary-unit & spaced-type edge cases

- **Allé is usually SPACED**, unlike gade/vej: `Frederiksberg Allé`, `Falkoner Allé`,
  `Nørre Allé`, `Frederiks Allé`. Here the type word is a separate, capitalised token —
  the opposite of the fused rule — and note the accent `é`.
- Genitive proper-noun streets keep the type **spaced and capitalised**:
  `Sankt Peders Stræde`, `Store Kongensgade` (Store spaced, gade fused!),
  `Vester Voldgade` (Vester spaced, Vold+gade fused).
- **Sankt / Skt.** "saint" names: `Sankt Peders Stræde`, `Sankt Hans Torv`,
  `Sankt Annæ Plads`, `Sankt Pauls Gade`; abbreviation `Skt.` also occurs.
- Initials with periods: `H.C. Andersens Boulevard`, `H.C. Ørsteds Vej`.

---

## 8. Country variants

`Danmark` (native), `Denmark` (English), `DK` (ISO-3166 alpha-2). Any of these →
country `DK`. Country line is usually omitted for domestic mail.

---

## 9. Prior work

- **DAWA / DAR (Danmarks Adresser)** — authoritative register + web API; defines the
  formal grammar for husnummer / etage / dør. The gold source for validation.
- **Google libaddressinput** — `fmt "%N%n%O%n%A%n%Z %C"`, required `ACZ`, zip `\d{4}`.
- **libpostal** — statistical parser trained on OSM/OpenAddresses; emits `road`,
  `house_number`, `unit`, `level`, `postcode`, `city`. Does not natively split the
  fused Danish type out of `road`.
- **OpenStreetMap / Wikipedia** — street geometry and real street/postal pairings.
- **PostNord / Post Danmark** — placement rules (postnr before by, 4 digits).

---

## 10. Failure modes (8+)

1. **Fused `-gade` / `-vej`**: `Nørregade`, `Istedgade`, `Enghavevej` — the type is the
   suffix of one token, so a whitespace splitter never sees it. (Most common failure.)
2. **Floor + side unit `3. tv`**: `tredje til venstre` — two tokens with a `.` ordinal
   marker plus a directional abbreviation; easily mistaken for a house number or dropped.
3. **`st.` ground floor**: bare `st.` (stuen) is a floor with no number and no side —
   parsers expecting a digit choke.
4. **4-digit postal code before city**: `1165 København` — must not be read as a house
   number or year; must be captured as the postcode that PRECEDES the city.
5. **`æ / ø / å` (and `é`)**: `Østerbrogade`, `Åboulevarden`, `Blågårdsgade`,
   `Frederiksberg Allé` — UTF-8 handling; blind ASCII-folding corrupts the name.
6. **Ranges `12-14`**: hyphenated house-number span; a tokenizer may split on `-` and
   lose the second number or read it as two addresses.
7. **`12A` letter suffix**: the trailing letter is part of the house number, not a floor
   or unit; must attach to the number, not become the side/door.
8. **Multi-word names**: `Store Kongensgade`, `Vester Voldgade`, `Gammel Kongevej`,
   `Nordre Frihavnsgade` — the name spans several words while the type is still fused to
   the last one; and spaced-type streets (`Falkoner Allé`, `Store Torv`).
9. **`Sankt …` saint names**: `Sankt Peders Stræde`, `Sankt Hans Torv`,
   `Sankt Annæ Plads` (+ `Skt.` abbrev) — multi-word, genitive, spaced type.
10. **Definite-form types**: `-vejen`, `-torvet`, `-pladsen`, `-boulevarden`,
    `-vænget`, `-haven`, `-parken` differ from the indefinite `-vej/-torv/…`; a
    suffix table must include both forms.
11. **Spaced vs fused type ambiguity**: `Amagertorv` (fused) vs `Store Torv` (spaced);
    `Åboulevarden` (fused) vs `Sønder Boulevard` (spaced) — same type, opposite gluing.
12. **Postal-district compass letter**: `København K/V/Ø/N/S`, `Aarhus C` — the letter
    is part of the district string, not a separate line or a state.

---

## References

- DAWA / Danmarks Adresser docs — https://dawadocs.dataforsyningen.dk/dok/adresser ;
  rules https://danmarksadresser.dk/regler-og-vejledning/adresser
- Google libaddressinput DK — https://chromium-i18n.appspot.com/ssl-address/data/DK
  (`fmt "%N%n%O%n%A%n%Z %C"`, required `ACZ`, zip `\d{4}`)
- libpostal — https://github.com/openvenues/libpostal
- AddressZen Danish guide — https://addresszen.com/guides/decoding-danish-addresses-a-practical-guide/
- PostGrid Denmark format — https://www.postgrid.com/global-address-format/denmark-address-format/
- Wikipedia postal codes in Denmark — https://en.wikipedia.org/wiki/Postal_codes_in_Denmark
- Aarhus street/postal data — https://en.wikipedia.org/wiki/Category:Streets_in_Aarhus
