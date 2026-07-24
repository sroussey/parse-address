# Iceland (IS) Postal Address Research

Scope: parsing & normalising Icelandic street addresses. Sources at the bottom.

---

## 1. Line order — STREET NAME FIRST, house number AFTER

Iceland writes the **street name, then the house number**, then a 3-digit
postcode and the town:

```
Laugavegur 22
101 Reykjavík
ICELAND        (country line, international only)
```

Single-string form: `Laugavegur 22, 101 Reykjavík`.

- `order: street-number`, `typePlacement: fused`, `postalPlacement: before-city`.

## 2. Street type — FUSED into the name (compound suffix)

Icelandic street names are single **glued compound words** whose second element
is a generic geographic suffix. Following the codebase's Nordic pattern (NO/SE/
DK/FI), the type is peeled off the end of the name:

| Suffix    | Meaning        | Example → split                    |
|-----------|----------------|------------------------------------|
| -gata     | street         | Hverfisgata → Hverfis + gata       |
| -vegur    | road/way       | Laugavegur → Lauga + vegur         |
| -stígur   | path           | Skólavörðustígur → Skólavörðu + stígur |
| -stræti   | street         | Bankastræti → Banka + stræti       |
| -braut    | broadway       | Suðurlandsbraut → Suðurlands + braut |
| -tún      | field          | Borgartún → Borgar + tún           |
| -múli     | ridge          | Síðumúli → Síðu + múli              |
| -vogur    | bay/cove       | Gnoðarvogur → Gnoðar + vogur        |
| -holt / -hlíð / -lundur / -garður / -mýri / -teigur / -bakki / -sund / -nes | (terrain) | Þverholt → Þver + holt |

The type is echoed lower-case as written (`normalizeTypeCase: false`), matching
the Norwegian corpus (output `type: "gata"`, not `"Gata"`).

Guardrails:
- `minFusedStem` = 3 (default): a split only applies if the remaining stem is ≥ 3
  chars, protecting short whole-word names (`Ártún` → stem `Ár` (2) is NOT split;
  stays whole with no type).
- Names ending in a **non-listed** suffix stay whole and untyped: `Kringlan`,
  `Fákafen`, `Álfheimar`, `Hamraborg`, `Miðvangur`.
- `splitSpacedType: false` — Icelandic never writes the generic as a separate
  word, so a spaced last word is never split.

## 3. Postcode — exactly 3 digits, before the town

- Format: **3 digits** (`Póstnúmer`). First digit = postal zone; last two =
  delivery area. Regex `\d{3}`.
- Position: **before** the town (`101 Reykjavík`, `600 Akureyri`, `200
  Kópavogur`). Leading digit 1 = greater Reykjavík; 2 = suburbs; 3–9 = country.

## 4. Region / state

None on the address line.

## 5. Secondary units

- Apartment: `íbúð` / `íb.` + number (`íbúð 5`).
- Floor: `hæð` — written ordinal-first (`2. hæð`) or `hæð 2`; abbreviation `h.`.
  (Icelandic modern practice also uses a 4-digit dwelling code, but plain
  íbúð/hæð dominate in written addresses.)
- Placed after the street (continental "after" placement).

## 6. PO boxes

`Pósthólf` (+ number) is the Icelandic PO box; also `Box`/`P.O. Box` for intl.
The box replaces the street: `Pósthólf 100, 121 Reykjavík`.

## 7. Orthography

Names carry the Icelandic letters **á é í ó ú ý ð þ æ ö**. Match Unicode
letters, not `[A-Za-z]`. Data also arrives accent-stripped in OCR/foreign systems
(`Reykjavik` for `Reykjavík`) — the parser must tolerate both.

## 8. Country variants

`Ísland`, `Iceland`, `ISL`, `IS`. Normalised country = `IS`.

---

## Failure modes the parser MUST handle (concrete)

1. **Fused split, longest suffix wins**: `Skólavörðustígur` must split on `stígur`
   (not `gata`/`stræti`), `Bankastræti` on `stræti`.
2. **Short-stem guard**: `Ártún` (stem `Ár`, 2 chars) must NOT split — stays whole,
   no type. (Documents the `minFusedStem` boundary; sample is `__skip`.)
3. **Non-productive suffix, no type**: `Kringlan`, `Fákafen`, `Álfheimar`,
   `Hamraborg`, `Miðvangur` — whole name, `type` absent.
4. **Number after the name**: `Laugavegur 22` — the trailing number is the house
   number; the name (digit-free) is captured first.
5. **Non-ASCII letters in the stem**: `Þingholtsstræti` (þ), `Bergþórugata` (þ),
   `Óðinsgata` (ð), `Ægisgata` (æ) — split correctly; `\b` after a non-ASCII
   letter is unreliable (JS `\b` is ASCII), so the floor pattern uses an explicit
   `(?=[\s,]|$)` lookahead instead.
6. **Embedded generic inside the stem**: `Sundlaugavegur` → `Sundlauga` + `vegur`
   (only the *trailing* `vegur` is the type, not the interior `laug`).
7. **Letter civic suffix / range**: `Laugavegur 22a` → number 22 + suffix `a`;
   `Grettisgata 40-42` → number 40 + range `-42`.
8. **Ordinal-first floor**: `Hverfisgata 4, 2. hæð` — `2. hæð` is the floor
   (num-then-type), the reverse of `íbúð 5` (type-then-num); both fold to a unit.
9. **No commas / run-together**: `Laugavegur 22 101 Reykjavík` — split on the
   3-digit postcode boundary.
10. **Accent-stripped OCR form**: `Skólavörðustígur 12, 101 Reykjavik` — town
    without its accent must still parse.
11. **PO box**: `Pósthólf 100, 121 Reykjavík` — box, not a house number.
12. **3-char stem edge**: `Nóatún` (stem `Nóa`, 3) and `Túngata` (stem `Tún`, 3)
    both split (≥ minFusedStem).

---

## Sources

- Íslandspóstur / Pósturinn (postal operator), postcode search & Götuskrá street
  register: https://www.posturinn.is ; Wikipedia "Íslandspóstur":
  https://en.wikipedia.org/wiki/%C3%8Dslandsp%C3%B3stur
- Wikipedia, "Street names in Iceland" (two-element compound structure, shared
  suffixes): https://en.wikipedia.org/wiki/Street_names_in_Iceland
- PostGrid Iceland address format (name+number, 3-digit postcode before town):
  https://www.postgrid.com/global-address-format/iceland-address-format/
- Smarty / Umbrex Iceland format examples; Expat Focus Iceland postal service.
