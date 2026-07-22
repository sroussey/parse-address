# UK (GB) Street Address Research

Research notes for a TypeScript / XRegExp-based street-address parser & normalizer.
Focus: real Royal Mail addressing (PAF), the official GOV.UK postcode regex, BS7666,
libpostal / Google libaddressinput behaviour, and concrete failure modes.

---

## 1. Canonical address order (the key difference from continental Europe)

UK addresses put the **house NUMBER first, then the street name**, e.g. `10 Downing Street`.
This is the same order as the US/Canada (number-first) and the *opposite* of most of
continental Europe (e.g. German/French "Bahnhofstraße 10", "10 rue de la Paix" — number last).

The **postcode comes LAST**, at the very end of the address, *after* the post town:

```
[Addressee]
[Sub-building / Flat]        <- e.g. "Flat 2"
[Building no + Thoroughfare] <- e.g. "10 Downing Street"
[Dependent locality]         <- optional
POST TOWN                    <- e.g. "LONDON"  (Royal Mail prints in CAPS)
[County]                     <- optional, mostly deprecated
POSTCODE                     <- e.g. "SW1A 2AA"  (LAST line, or last token)
[COUNTRY]                    <- optional: UNITED KINGDOM / GB
```

Single-line / comma-joined form used by parsers:

```
10 Downing Street, London, SW1A 2AA
Flat 4, 12 Abbey Road, London, NW8 9AY
```

So for a parser: **postcode is anchored at the END** of the string (after the town),
never in the middle as it can appear in some other locales. The town/post town sits
*immediately before* the postcode. This ordering is the single most important GB rule.

Royal Mail PAF address element order (top → bottom):
Organisation Name → Department Name → Sub-Building Name (Premises) → Building Name →
Building Number → Dependent Thoroughfare → Thoroughfare (street) → Double-Dependent
Locality → Dependent Locality → Post Town → Postcode.

---

## 2. UK postcode format (outward + inward)

A postcode = **outward code** + space + **inward code**.

- **Outward code (outcode)**: area + district. Formats: `A9`, `A99`, `AA9`, `AA99`, `A9A`, `AA9A`
  (A = letter, 9 = digit). Examples: `M1`, `B33`, `CR2`, `DN55`, `SW1A`, `EC1A`.
- **Inward code (incode)**: **always** digit + letter + letter (`9AA`). Examples: `1AA`, `1AE`, `8TH`, `6XH`, `1PT`, `1BB`.
- Separated by a **single space** (canonical). Users sometimes omit it (`SW1A1AA`) or double it.

Worked examples (outward | inward):

| Postcode  | Outward | Inward | Outcode shape |
|-----------|---------|--------|---------------|
| `SW1A 1AA` | SW1A | 1AA | AA9A |
| `M1 1AE`   | M1   | 1AE | A9   |
| `B33 8TH`  | B33  | 8TH | A99  |
| `CR2 6XH`  | CR2  | 6XH | AA9  |
| `DN55 1PT` | DN55 | 1PT | AA99 |
| `EC1A 1BB` | EC1A | 1BB | AA9A |
| `W1A 0AX`  | W1A  | 0AX | A9A  |
| `GIR 0AA`  | GIR  | 0AA | special (old Girobank, Bootle) |

**Constraints beyond the shape** (from BS7666 / Royal Mail):
- First position letters never include `QVX`.
- Second position letters never include `IJZ`.
- The single-letter-then-`A9A` third position uses a restricted set (`ABCDEFGHJKPSTUW`);
  the two-letter `AA9A` fourth position uses (`ABEHMNPRVWXY`). Most regexes omit these
  fine constraints; the GOV.UK regex encodes some of them.
- Inward-code letters never include `CIKMOV` (the "no-CIKMOV" rule). Again, many
  practical regexes skip this.

### Authoritative GOV.UK validation regex

The regex published in the GOV.UK "Bulk Data Transfer" / register guidance
(the one most commonly cited as "the GOV.UK postcode regex"):

```
^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$
```

Notes on this regex:
- Handles the `GIR 0AA` special case first (alternation).
- Encodes the "second letter not I/J/Y-boundary" restriction via `[A-Ha-hJ-Yj-y]`.
- Requires a literal space between outward and inward.
- Inward code = `[0-9][A-Za-z]{2}` (digit + 2 letters) — confirms **inward is always digit+letter+letter**.
- Case-insensitive by construction (both cases enumerated).

**Practical parser variant** (case-insensitive flag, optional/normalizable space, anchored at END of input):

```
\b(GIR ?0AA|(?:[A-PR-UWYZ][0-9]{1,2}|[A-PR-UWYZ][A-HK-Y][0-9]{1,2}|[A-PR-UWYZ][0-9][A-HJKPSTUW]|[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]) ?[0-9][ABD-HJLNP-UW-Z]{2})\b
```

For normalization: uppercase, collapse internal whitespace to exactly one space,
and re-insert the space 3 chars from the end if the user omitted it (`SW1A1AA` → `SW1A 1AA`).
The inward code is always the last 3 characters (`9AA`); everything before it (minus the
space) is the outward code.

---

## 3. British street (thoroughfare) types

The **type is a SUFFIX** appended to the end of the street name: in `Downing Street`,
`Street` is the type and `Downing` is the name. (Contrast with a leading-article style;
UK almost always has the descriptor last.) A minority of thoroughfares have **no type
word at all** (e.g. `Cheapside`, `Piccadilly`, `Whitehall`, `The Strand`, `Pall Mall`,
`Haymarket`, `Broadway`) — the parser must tolerate a type-less street.

Common full types and their Royal-Mail-approved / common abbreviations:

| Full type  | Common abbrev(s) |
|------------|------------------|
| Street     | St  (ambiguous with "Saint" — see §7) |
| Road       | Rd  |
| Lane       | Ln  |
| Avenue     | Av, Ave |
| Close      | Cl  |
| Drive      | Dr  |
| Court      | Ct  |
| Place      | Pl  |
| Way        | (rarely abbreviated) |
| Gardens    | Gdns |
| Grove      | Gro, Gr |
| Crescent   | Cres |
| Terrace    | Terr, Ter |
| Row        | (none) |
| Walk       | Wlk |
| Hill       | (none) |
| Rise       | (none) |
| Mews       | (none) |
| Square     | Sq  |
| Green      | Grn |
| Gate       | (none) |
| Wharf      | (none) |
| Parade     | Par, Pde |
| Broadway   | (none) |
| Vale       | (none) |
| Croft      | (none) |

Other frequently-seen types worth including in the type dictionary:
`Approach, Bank, Boulevard (Blvd), Bridge, Buildings, Causeway, Chase, Circle, Circus,
Cliff, Common, Copse, Corner, Cottages, Dale, Dene, Dell, Embankment, End, Esplanade,
Field(s), Fold, Furlong, Gables, Garth, Ghyll, Glade, Glebe, Hollow, Island, Junction,
Knoll, Lawn, Lea, Leaze, Links, Loan, Loke, Mall, Market, Meadow(s), Mount, Orchard,
Paddock, Pantiles, Pastures, Path, Pavement, Piece, Pines, Promenade, Quadrant, Quay,
Ridge, Ride, Ring, Spinney, Strand, Vennel, View, Villas, Wood(s), Wynd, Yard`.

Scottish-specific: `Wynd, Vennel, Loan, Brae, Gait/Gate`. Welsh: `Heol (= road, prefix),
Ffordd, Rhodfa, Maes` (Welsh puts descriptor first, e.g. `Heol Isaf`, `Ffordd y Brenin`).

**Suffix parsing rule:** match the type as the *trailing* token(s) of the street phrase.
`Gardens`, `Mews`, `Buildings` are plurals — don't strip the `s`. Multi-word types don't
really exist, but multi-word *names* do (`Kings Cross Road`, `Bishops Bridge Road`).

---

## 4. House-number variants

- Plain integer: `10`, `221`, `1`, `44`.
- **Number + letter suffix** (very common): `10A`, `12B`, `221B` (Sherlock Holmes,
  221B Baker Street). The trailing letter is a *civic number suffix*, split off:
  `221B` → number `221`, suffix `B`. Suffix is usually one letter (`A`–`Z`), occasionally lowercase.
- **Ranges**: `10-12`, `10–12` (en dash), `1-5`. Treat the whole thing as the number token.
- **Fractional / half**: rare in UK (`10½`), mostly ignorable.
- **Flat/sub-building prefix before the number**: `Flat 2, 10 Downing Street`,
  `Flat 4, 12 Abbey Road`. The sub-unit precedes the building number.
- **Named house, NO number**: `Rose Cottage, Church Lane, ...`, `The Old Vicarage, ...`,
  `Dunroamin, ...`. Here `number` is null; the house/building name replaces the number and
  sits before the thoroughfare. PAF stores this as `building_name`.
- **Building name before number** (both present): `Victoria House, 15 Bridge Street`,
  `Sherlock Court, 221 Baker Street`.
- **Number attached to building name in range form**: `Flat 1, 110-114 The Tower`.
- **PO Box**: `PO Box 18144` (no thoroughfare).

Parser guidance: try to peel a leading integer(+optional letter) as `number`(+`civic_number_suffix`).
If the leading token is alphabetic and there's no integer, it's a **named house** →
`number` null and the name goes to `street`/building or a note.

---

## 5. Secondary (sub-building) units

Common secondary-unit keywords (usually **prefix**, before the building number):
`Flat`, `Apartment` / `Apt`, `Unit`, `Suite`, `Floor`, `Room`, `Block`, `Studio`,
`Maisonette`, `Penthouse`, `Basement`, `Ground Floor`, `First Floor`, `Rooms`.

Forms:
- `Flat 2, 10 Downing Street` — `sec_unit_type=Flat`, `sec_unit_num=2`.
- `Apartment 5, 20 Deansgate` — `Apartment`, `5`.
- `Unit 4, 3 Enterprise Way` — `Unit`, `4`.
- `Flat 2B, 14 …` — sec_unit_num can carry its own letter (`2B`).
- Sometimes appended: `10 Downing Street, Flat 2` (rare; usually leading).
- Flat number can be *just a letter*: `Flat A, 5 …`.

Unlike the US, the unit almost always comes **first** in the string, before the house
number, joined by a comma. `Flat 2, 10 …` is the canonical order.

---

## 6. Town / post town, county, country

- **Post town**: mandatory in every valid address; Royal Mail prints it in CAPITALS
  (e.g. `LONDON`, `MANCHESTER`, `BIRMINGHAM`). A parser should treat it case-insensitively
  and normally take it as the token(s) immediately before the postcode. Post town is *not*
  always the nearest city — Royal Mail assigns them (e.g. many places route via a distant
  post town). Some are two words: `MILTON KEYNES`, `WELWYN GARDEN CITY`, `STOKE-ON-TRENT`,
  `BURY ST EDMUNDS`, `NEWCASTLE UPON TYNE`, `ST ALBANS`, `LEIGHTON BUZZARD`, `WESTON-SUPER-MARE`.
- **London districts**: For London the post town is just `LONDON`; the *district* is
  encoded by the postcode area letters (`SW1`, `E1`, `NW8`, `EC1A`, `W1`, `SE1`). People
  often also write the district name (Chelsea, Camden, Soho) as a locality line — this is a
  dependent locality, not the post town. Don't mistake `London` for a street token.
- **County (deprecated but still appears)**: Historically a former-postal-county line
  (e.g. `Surrey`, `Kent`, `West Midlands`, `Greater Manchester`, `Hampshire`,
  `Merseyside`). Royal Mail deprecated the postal county in 1996 — the postcode makes it
  redundant — but users still type it. Represent it as **optional** and store in the
  `state` field *only when explicitly present*, else `null`.
- **Country variants**: `United Kingdom`, `UK`, `GB`, `Great Britain`, `England`,
  `Scotland`, `Wales`, `Northern Ireland`, `GBR`, `U.K.`. Note GB technically excludes NI;
  the country ISO code for the whole state is `GB`. Northern Ireland uses `BT` postcodes.

---

## 7. Prior work & known failure modes (≥8)

Prior art surveyed: Royal Mail PAF Programmer's Guide (Ed.7), GOV.UK postcode register
regex, BS7666 (addressing standard), openvenues **libpostal** (statistical parser),
Google **libaddressinput** (`GB` metadata: `fmt` uses order `%N %O %A %C %Z` — recipient,
org, street/address, city=post town, postcode; **no state/county field** in the required
set), ideal-postcodes / Smarty UK format guides, theodi/parse-uk-addresses.

Concrete failure modes a parser must handle:

1. **Postcode-last ordering.** Anchoring the postcode at the END, after the post town,
   not in the middle. A US-trained regex expecting ZIP-then-nothing, or a locale that
   allows mid-string codes, mis-splits `London SW1A 2AA` (must peel `SW1A 2AA` from the tail).

2. **`221B` letter suffix.** `221B Baker Street` must split to number `221` +
   civic_number_suffix `B`, *not* number `221` with `B` bleeding into the street name
   (`B Baker Street`), and not the whole `221B` treated as street. Distinguish from a flat.

3. **`Flat 2` / sub-building prefix.** `Flat 2, 10 Abbey Road` — the leading `Flat 2` is a
   secondary unit, not the building number. Naive parsers take `2` as the house number and
   drop `10`. The real building number is the integer *after* the comma.

4. **Named houses with no number.** `Rose Cottage, Church Lane, Otterton, EX9 7HG` and
   `The Old Vicarage, ...` have no numeric house number. A number-first regex fails to
   anchor; must fall back to treating the leading name as building/street with `number=null`.

5. **Double-barrelled / multi-word town names.** `Stoke-on-Trent`, `Milton Keynes`,
   `Weston-super-Mare`, `Bury St Edmunds`, `Newcastle upon Tyne`, `Welwyn Garden City`.
   A parser that grabs only one token before the postcode as the city truncates these.

6. **`St.` = Saint vs Street ambiguity.** `St Albans` / `St. Ives` / `Bury St Edmunds`
   have `St` = **Saint** (part of a place/street name), while `High St` has `St` = **Street**
   (type suffix). Position matters: `St` at the *start* of a name → Saint; `St` at the
   *end* → Street. `St John's Street` contains both.

7. **Single vs double / missing space in postcode.** `SW1A1AA`, `SW1A  1AA`, `SW1A 1AA`
   must all normalize to `SW1A 1AA`. The space is not a reliable delimiter — must locate
   the inward code as the final 3 chars (`9AA`) instead.

8. **Missing post town.** Users often type just street + postcode (`10 Downing Street,
   SW1A 2AA`). The parser must still parse and leave `city` null (or derive it from the
   postcode via a lookup) rather than mis-assigning the postcode area as the city.

9. **London district vs post town.** `10 Downing Street, Westminster, London, SW1A 2AA` —
   `Westminster` is a locality, `London` is the post town. Don't merge them or drop London.

10. **Type-less streets.** `Piccadilly`, `Cheapside`, `Whitehall`, `The Strand`,
    `Pall Mall`, `Broadway` — no `Street`/`Road` suffix. `type` must be allowed to be null
    without the street name being swallowed by the town.

11. **Building name AND number.** `Victoria House, 15 Bridge Street` — building name comes
    first, then the real number. Parser must not treat `Victoria House` as the number line.

12. **Number ranges.** `10-12 High Street`, `110-114 The Tower` — the `10-12` is one
    number token; naive `\d+` grabs only `10`.

13. **Flat number with letter / letter-only.** `Flat 2B, 14 …` and `Flat A, 5 …` —
    sec_unit_num may include a letter or be a bare letter.

14. **Post town not equal to nearest city / all-caps PAF form.** Input may be
    `LONDON` (caps) or mixed case; matching must be case-insensitive and must not assume
    the town equals the district encoded in the postcode.

15. **County present but deprecated.** `... Guildford, Surrey, GU1 3UW` — `Surrey` is an
    optional county → goes to `state`; must not be mistaken for a second town or street.

16. **Country suffix noise.** Trailing `United Kingdom` / `UK` / `England` must be
    stripped to `country=GB` and not left inside the city/postcode fields.

---

## 8. Field-mapping decisions for this parser

- `number` — leading integer (or range) of the building. Null for named houses / PO Box.
- `civic_number_suffix` — trailing letter of the building number (`221B` → `B`), else null.
- `street` — thoroughfare name **without** the type suffix (`Downing`). For type-less
  streets, the whole name (`Piccadilly`). For named houses, the house name may live here.
- `type` — the trailing thoroughfare type as written (`Street`, `Rd`), else null.
- `sec_unit_type` / `sec_unit_num` — leading `Flat`/`Apartment`/`Unit`… and its number.
- `city` — the **post town** (token(s) immediately before the postcode). Null if absent.
- `state` — the county, **only if explicitly present**, else null (GB has no required state).
- `postal_code` — the postcode, normalized to `OUTWARD INWARD` with a single space; **last**.
- `country` — normalized to `GB`.

---

## Sources

- GOV.UK postcode regex helper — https://github.com/stemount/gov-uk-official-postcode-regex-helper
- ideal-postcodes postcode validation guide — https://ideal-postcodes.co.uk/guides/postcode-validation
- ideal-postcodes PAF data fields — https://docs.ideal-postcodes.co.uk/docs/data/paf/
- Royal Mail PAF Programmer's Guide (Ed.7) — https://www.poweredbypaf.com/wp-content/uploads/2017/07/Latest-Programmers_guide_Edition-7-Version-6.pdf
- Wikipedia: Postcode Address File — https://en.wikipedia.org/wiki/Postcode_Address_File
- Wikipedia: Post town — https://en.wikipedia.org/wiki/Post_town
- Smarty UK address format examples — https://www.smarty.com/global-address-formatting/uk-address-format-examples
- libpostal — https://github.com/openvenues/libpostal (issues #39, #73 saint-vs-street, #165, #206, #244, #561)
- theodi/parse-uk-addresses — https://github.com/theodi/parse-uk-addresses
- Alastair Aitchison, UK postcode regex — https://alastaira.wordpress.com/2011/04/06/parsing-free-text-addresses-and-a-uk-postcode-regular-expression-pattern/
