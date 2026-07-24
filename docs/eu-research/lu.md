# Luxembourg (LU) Postal Address Research

Scope: parsing & normalising Grand Duchy of Luxembourg street addresses for a
config-driven XRegExp parser. Sources at the bottom.

---

## 1. Line order — NUMBER FIRST, then French voie type + name

Luxembourg writes the **house number before the street**, conventionally with a
**comma** after the number, then a French thoroughfare type + name:

```
71, Route de Longwy
L-4750 Pétange
LUXEMBOURG            (country line, international only)
```

Single-string form: `71, Route de Longwy, L-4750 Pétange`. The comma after the
number is the local convention (UPU / POST Luxembourg examples) but is often
omitted in practice, so the parser tolerates both `71, Route…` and `71 Route…`.

Parse order: `[number][, ] [voie-type] [name]` then `[L-]NNNN [commune]`.

- `order: number-street`, `typePlacement: prefix`, `postalPlacement: before-city`.

## 2. Street types (types de voie) — French, leading word

Same family as France: **Rue, Route, Avenue, Boulevard, Grand-Rue, Impasse,
Place, Allée, Montée, Val, Cité, Quai, Passage, Esplanade, Cour, Coin, Zone,
Parc, Plateau**, plus La-Poste-style abbreviations (Bd, Av, Rte, Imp, Pl, All).
Multi-word types (**Grand-Rue**, **Rond-Point**) must be matched longest-first.
"Grand-Rue" and "Esplanade" are frequently the *whole* street (no name after).

The type is echoed as written (`normalizeTypeCase: false`) — "Route", "Bd",
"rte" are kept verbatim; only the short code is derived.

Lowercase French particles/articles stay with the NAME, not the type:
`de`, `du`, `de la`, `de l'`, `des`, `d'`. Elisions `d'`/`l'` attach with no
space (`Route d'Esch`, `Rue de l'Eau`). Accept both `'` and `’`.

## 3. Postcode — 4 digits, optional "L-" prefix, before the commune

- Format: **4 digits**, optionally prefixed **`L-`** (`L-4750`, `L-1660`); a
  bare `4750` also occurs. First digit is never 0.
- Position: **before** the commune on the last line (`L-4750 Pétange`).
- Normalisation choice: the prefix is echoed as written — `L-4750` stays
  `L-4750`, bare `1930` stays `1930`. (Forcing an `L-` onto a bare source makes
  the postcode unfindable in the input and would trip the parser's
  token-preservation guard.)
- One postcode ≈ one street or block; there are ~ many thousand LU codes.

## 4. Region / state

None. The Grand Duchy has cantons but they are **not** written in the postal
address line, so there is no `state` field.

## 5. Secondary units

`Appartement`/`Appt`/`Apt`, `Étage`, `Bâtiment`, `Bloc`, `Escalier`/`Esc` +
number. Placed after the street (continental "after" placement).

## 6. PO boxes

`Boîte Postale` / `B.P.` / `BP` + number, displayed as `BP`. The box replaces
the street line: `B.P. 24, L-2011 Luxembourg`. Box number is NOT a house number.

## 7. Communes & multilingual note

Luxembourg is officially trilingual (Luxembourgish/French/German) but street
signage and postal addressing are **overwhelmingly French**. A minority of
streets carry Luxembourgish prepositional names with **no French type**
(`Op der Heed`, `An der Gaass`, `Um Bierg`) — these parse as a bare (untyped)
street name. Communes are frequently hyphenated (`Esch-sur-Alzette`,
`Mondorf-les-Bains`, `Roodt-sur-Syre`) and accented (`Pétange`).

## 8. Country variants

`Luxembourg`, `Luxemburg`, `Lëtzebuerg`, `Grand Duchy of Luxembourg`,
`Grand-Duché de Luxembourg`, `LUX`, `LU`. Normalised country = `LU`.

---

## Failure modes the parser MUST handle (concrete)

1. **Comma after the number**: `71, Route de Longwy` — the comma is a separator,
   not a field boundary; `[\s,]+` after the number absorbs it.
2. **No comma variant**: `71 Route de Longwy` must parse identically.
3. **Bare vs L- postcode**: `1930 Luxembourg` and `L-1930 Luxembourg` both parse;
   the output echoes the source spelling.
4. **Elision `d'`/`l'`**: `Route d'Esch`, `Rue de l'Eau`, `Place d'Armes` — no
   space, must not split on the apostrophe; accept curly `’`.
5. **Multi-word / whole-street type**: `Grand-Rue`, `Esplanade` — the type is the
   entire street (no name after); must be matched longest-first so `Grand-Rue`
   beats `Rue`.
6. **Luxembourgish prepositional names (no type)**: `Op der Heed`, `An der Gaass`,
   `Um Bierg` — whole thing is the (untyped) street name.
7. **Hyphenated / compound names**: `Rue du Marché-aux-Herbes`,
   `Boulevard Grande-Duchesse Charlotte`, `Rue Notre-Dame` — hyphens are part of
   the name.
8. **Letter civic suffix & ranges**: `18A, Rue de la Gare` → number 18 + suffix A;
   `2-4, Rue de l'Alzette` → number 2 + range suffix `-4`.
9. **Type word / place name inside the NAME**: `Rue du Pont` (Pont is name),
   `Rue de Luxembourg`, `Route de Trèves` — only the FIRST word is the type.
10. **Number word inside the name**: `Rue des Trois Cantons` — embedded number
    word is part of the name; the leading token before the type is the house no.
11. **Hyphenated / accented communes**: `Esch-sur-Alzette`, `Mondorf-les-Bains`,
    `Pétange`, `Senningerberg` — city may contain hyphens & accents.
12. **PO box**: `B.P. 24, L-2011 Luxembourg`, `Boîte Postale 1304, L-1013
    Luxembourg` — box, not a house number; `sec_unit_type: BP`.
13. **Trailing country**: `…, L-4750 Pétange, Grand Duchy of Luxembourg` /
    `…, LUXEMBOURG` — consumed, normalised to `LU`.
14. **Abbreviated type**: `Bd Royal`, `Rte de Lyon`, `Av. …` — kept verbatim,
    short code derived.

---

## Sources

- POST Luxembourg (postal operator) addressing examples; UPU S42 country page —
  Luxembourg Postcode type & position:
  https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/luxEn.pdf
- PostGrid Luxembourg address format (order, comma-after-number, `L-` prefix,
  postcode-before-city): https://www.postgrid.com/global-address-format/luxembourg-address-format/
- Wikipedia, "Postal codes in Luxembourg" (4-digit, `L-` prefix):
  https://en.wikipedia.org/wiki/Postal_codes_in_Luxembourg
- Bitboost / Umbrex international address guides (Luxembourg examples).
- French voie-type vocabulary reused from La Poste / FANTOIR (see fr.md in this
  repo's docs/eu-research).
