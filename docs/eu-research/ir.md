# Iran (IR) — address research

Scope: Latin **transliteration** of Persian addresses, as used in international /
SEC filings. Native Perso-Arabic (RTL) script is **out of scope** (marked
`__skip`).

## Written form (transliterated, small-endian)

Iranian addresses are written most-specific-first once romanized:

```
No. 12, Vali-e Asr Street, Tehran 1968834111
Plaque 8, Ferdowsi Avenue, Isfahan
```

Segments, left to right:

1. **House number** — `No. N`, `Plaque N`, or `Pelak N` (Pelak = plaque/number).
   - `No.` is a generic number marker (the shared token model already strips
     `no.` before a digit, so it is never scored as a lost token).
   - `Plaque` / `Pelak` are real words; they are consumed via a `(?<drop>...)`
     group so they are dropped from output but not counted as lost street tokens.
2. **Street** — a name plus a type. Two idioms:
   - English **suffix** type: `Vali-e Asr Street`, `Ferdowsi Avenue`,
     `Keshavarz Boulevard`, `Azadi Square`, `Modarres Highway`,
     `Chamran Expressway`. This is the **dominant** filing form and the one
     modelled structurally (suffix placement → `street` + `type`).
   - Persian **leading generic**: `Khiaban <X>` (street), `Bozorgraah <X>`
     (highway), `Kucheh <X>` (alley). With suffix placement these carry no
     trailing type and parse **type-less, whole** into `street`
     (`Khiaban Vali-e Asr`) — lossless, nothing dropped.
3. **City** — the routing city (Tehran, Isfahan, Mashhad, Shiraz, Tabriz, Karaj,
   Qom, Ahvaz, ...).
4. **Postcode** — a distinctive **10-digit** code (e.g. `1968834111`), written
   **last, after the city**, and **OPTIONAL** (frequently omitted in filings).
5. **Province (Ostan)** — optional, → `state`.

## Modelling decisions

- `order: number-street`, `typePlacement: suffix`, `postalPlacement: after-city`.
- Postcode `\d{10}`, optional (the after-city grammar makes the whole place tail
  optional and offers a postcode-absent branch).
- **Province is RESTRICTED** to explicitly province-marked spellings
  (`Tehran Province`, `Isfahan Province`, `Ostan-e Fars`, ...). This is essential:
  most Iranian province names **equal their principal city** (Tehran, Isfahan,
  Kerman, Qom, Yazd, Ardabil, Hamadan, ...). Restricting the state slot to the
  `... Province` / `Ostan-e ...` forms keeps `state` **disjoint** from `city`, so
  a plain `..., City` tail never mis-fires into the province slot, and a
  `..., City, X Province` tail splits correctly.
- `normalizeTypeCase: false` — English types echoed verbatim (Street, Avenue).
- Optional leading secondary unit (`Unit 3`, `Apt. 5`, `Floor 2`).
- PO Box supported (`PO Box 1837, Tehran`).

## Known gaps / `__skip`

- **Alley → main-street chains** — `No. 5, Kucheh Yas, Vali-e Asr Street, Tehran`
  carries *two* street segments (the alley and the artery it opens off). The
  engine has one street slot; these are `__skip`'d rather than forced lossily.
- Deeper multi-segment chains (alley + alley + boulevard + numbered district) are
  likewise `__skip`'d.
- A **bare alley** as the sole street (`Kucheh Yas, Isfahan`) parses fine,
  type-less, into `street`.
- **Native-script** samples are `__skip`'d (out of scope).

## Validation

`ISO2=ir` harness: **checked=45, failures=0** (4 `__skip`: 2 deep chains, 2
native-script).
