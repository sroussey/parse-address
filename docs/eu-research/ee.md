# Estonian (Eesti) Postal Address Research — for a street-address parser

Estonia is monolingual (Estonian, Latin script with ä, ö, õ, ü, š, ž). Addresses
are handled by **Omniva** (omniva.ee). This note records the conventions the
parser relies on and the decisions taken.

Sources consulted:
- Google libaddressinput `EE` (`fmt "%N%n%O%n%A%n%Z %C"`, `zip "\d{5}"`, `require "ACZ"`).
- Omniva (omniva.ee) postal-code / street search.
- Smarty "Estonia address format & examples" (verbatim samples used below).
- PostGrid / Umbrex Estonia address-format guides.

---

## 1. Canonical order

Street line runs **street name FIRST, then house number**; the geographic line
puts the **5-digit index BEFORE the city**:

```
[Recipient]
Street[ Type] HouseNumber[-Apartment]
INDEX City
[County code]   [COUNTRY]
```

libaddressinput `fmt "%N%n%O%n%A%n%Z %C"` confirms: address line, then
`%Z %C` = index + city. Examples (Smarty, verbatim):

- `Mäe 40, 80040 Pärnu`
- `Aardla 130-44, 50415 Tartu`   (house 130, apartment 44)
- `Lodjapuu Tee 17 ... 75326 Rae`  (type word "Tee" is a SEPARATE word)

Config: `order: "street-number"`, `postalPlacement: "before-city"`.

## 2. Street type is a SEPARATE trailing word — and usually ABSENT

The generic word is written **as its own space-delimited word after the name**
("Pärnu **maantee**", "Endla **tänav**", "Vabaduse **puiestee**") — NOT fused
like Finnish "-tie"/"-katu". (The task brief's "-tänav fused" framing is not how
Estonian is written; Kotus/EKI street-name guidance and every Omniva/Smarty
example use a separate word.) Very many streets carry **no type at all**: the
name stands alone — "Pikk", "Lai", "Viru", "Gonsiori", "Liivalaia".

So `typePlacement: "suffix"` with the type OPTIONAL: a bare name falls through to
the untyped alternative and yields `type = null`.

### Type vocabulary (full + abbreviation)
| Full | Abbrev | Meaning |
|------|--------|---------|
| maantee | mnt | highway/road |
| puiestee | pst | avenue |
| tänav | tn | street |
| tee | — | road |
| väljak | — | square |
| põik | — | side-street |
| plats | — | square/place |
| allee | — | alley |

`-katu`/`-tie` etc. do not apply. `maantee` and `puiestee` end in "tee"/"…tee"
but, because matching is space-anchored (separate word), the longest full word
wins and there is no mid-word split risk. Abbreviations appear with or without a
trailing dot ("mnt" / "mnt."). Type is echoed verbatim (`normalizeTypeCase:false`).

## 3. House number, civic suffix, apartment

- Plain integer: `40`, `41`, `100`.
- Glued or spaced single letter = civic suffix: `41a`, `23A`, `4 b`.
- **Apartment (korter)** is written glued with a hyphen: `130-44` = house 130,
  apt 44; `41-7` = house 41, apt 7. Modelled as `sec_unit_type "krt"`,
  `sec_unit_num` the number after the hyphen. (An internal hyphen inside a NAME —
  "Suur-Karja", "Väike-Karja" — has letters on both sides and is not an apartment.)

## 4. Postcode

- **Exactly 5 digits** (`\d{5}`), leading zeros significant; no country letter
  prefix. First two digits ≈ region (10/11/12/13 Tallinn, 5x Tartu, 8x Pärnu,
  2x NE/Narva). Precedes the city.

## 5. Region / county

Not part of the delivery line. Domestic mail sometimes appends a **3-letter
county sorting code** (PÄR = Pärnumaa, TAR = Tartumaa, HAR = Harjumaa) after the
city; the parser does not capture it (such samples are `__skip`).

## 6. PO box

`Postkast` (spelled out) or **`P.K.`** (also `PK`) + number, replacing the
street: "Postkast 1, 75326 Rae". Modelled via `poBoxNames`.

## 7. Diacritics

`ä ö õ ü š ž` are ordinary letters (Tänav, Sõpruse, Müürivahe, Rüütli, Jõhvi,
Puškini). Full UTF-8; no accent-folding.

## 8. Country variants

`Eesti`, `Estonia`, `EST` (alpha-3), `EE` (alpha-2) → normalize to `EE`.

---

## Failure modes (things a naive parser gets wrong)

1. **Separate-word type treated as fused** (or vice-versa): "Pärnu maantee" must
   split at the space into name "Pärnu" + type "maantee"; a Finnish-style fused
   splitter would corrupt it.
2. **Type-less names**: "Pikk 41" has NO type; a parser that requires a type word
   fails or invents one. Must accept a bare name (`type = null`).
3. **5-digit index BEFORE the city**: `80040 Pärnu`; parsers tuned for
   ZIP-after-city or 4-digit codes misplace it.
4. **Hyphen apartment vs range vs name-hyphen**: `130-44` is house+apartment,
   `Suur-Karja` is a name — the hyphen means different things; must not treat
   `130-44` as a numeric range or split the name.
5. **Civic letter vs following word**: `23A` letter is a civic suffix, but a lone
   letter that is actually the start of the city (`41 Tallinn`) must NOT be eaten
   as a suffix (guarded by "letter not followed by another letter").
6. **`mnt` / `pst` / `tn` abbreviations** (with/without dot) must map to the same
   type family as the full word.
7. **Diacritics** `ä ö õ ü š`: byte-level/ASCII parsers corrupt "Müürivahe",
   "Sõpruse", "Jõhvi", "Puškini".
8. **Trailing county code** (`PÄR`, `TAR`) after the city is administrative, not a
   region field — must not be mistaken for a state or swallowed into the city.
9. **`Linn`/`vald`** ("town"/"rural municipality") tokens attach to the place name
   ("Pärnu linn"); should stay with the city, not be read as a street type.
10. **Reversed/place-first order** ("10133 Tallinn, Pikk 41") is not the street
    grammar's shape and is `__skip`.
