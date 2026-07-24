# Moldova (MD) Street-Address Research

Config-driven address parser research. Moldova shares Romania's addressing
grammar (common language/history), so the parser mirrors the RO config with a
Moldovan postcode.

Sources: Poșta Moldovei (national operator, UPU member; www.posta.md);
Wikipedia "Postal codes in Moldova" (MD-NNNN, first digit = zone); Smarty
(https://www.smarty.com/global-address-formatting/moldova-address-format-examples);
PostGrid (https://www.postgrid.com/global-address-format/moldova-address-format/);
GeoPostcodes (https://www.geopostcodes.com/country/moldova/address-format/);
Google libaddressinput (`MD`); OpenStreetMap / libpostal.

---

## 1. Canonical order

Moldova writes the **street TYPE first, then the name, then the house number**,
and (domestically) puts the **postal code BEFORE the city**:

```
<Type> <Name> [nr.] <No.>[, bl./sc./et./ap. ...]
MD-<4 digits> <Localitate>
[Republica Moldova]
```

Single-line: `Strada Ștefan cel Mare nr. 12, MD-2012 Chișinău` or
`bd. Dacia 45, MD-2062 Chișinău`.

- **Number comes AFTER the street** (type Strada/Bulevardul/Calea leads).
- The **postcode precedes the locality** in domestic Poșta Moldovei usage
  (`%Z %C`, like Romania). An international/courier variant writes the code last
  (`..., Chișinău, MD-2012`); that ordering is `__skip` in the samples.
- **No region/state** is written in the address line (raions are not part of the
  postal address; the postcode encodes the routing).

## 2. Street types (prefix)

| Full | Abbrev | English |
|------|--------|---------|
| Strada | str. | street |
| Bulevardul | bd. / B-dul | boulevard |
| Șoseaua | șos. | highway/chaussée |
| Calea | — | avenue/way |
| Aleea | Al. | alley/lane |
| Piața | Pța. | square |
| Drumul | Dr. | road |
| Intrarea | Intr. | access lane |
| Stradela | — | small street |

The type is a **leading** word; the config keeps the spelling exactly as written
(`normalizeTypeCase:false`) so `str.` stays `str.` and `Strada` stays `Strada`.

## 3. House number

- Optional marker **`nr.`** (număr), consumed into a `drop` group (not emitted,
  not scored as a lost token — `nr.` is not in the shared `NUMBER_MARKERS`).
- May be a **range** (`49-53`) — kept whole in `number`.
- May carry a **single-letter suffix** (`12A`, `49B`) → `civic_number_suffix`.
- Bare numbers with no marker also occur (`bd. Dacia 45`).

## 4. Postal code

- **"MD-" + four digits** (`MD-2012`, `MD-3300`). First digit = postal zone
  (2 = Chișinău, 3 = north/Tiraspol/Bălți, 4 = north-east, 5/6/7 elsewhere).
- The **"MD-" prefix** is captured into a `drop` group (named `drop_1` so it does
  not clash with the `nr.` `drop`; the normalizer folds the numeric suffix). It
  is consumed but not emitted, and — being a `[a-z]{1,2}-` prefix before four
  digits — the shared `NUMBER_MARKERS` also exempts it from token counting.
- `postal_code` is emitted **without** the prefix (`2012`), matching the digits.

## 5. Region / secondary units

- **No `state`** field (no județ/raion in the address line).
- Apartment-block markers stack: **bl.** (bloc), **sc.** (scara), **et.** (etaj),
  **ap.** (apartament). The shared grammar has **one** secondary-unit slot:
  a single trailing unit (`ap. 12`, `bl. 3`, full word `apartament`) is captured
  (display normalised to `ap./bl./sc./et.`); a stacked chain is `__skip`.

## 6. Diacritics & country

- Romanian diacritics **ă â î ș ț** must survive: `Chișinău`, `Bălți`, `Bănulescu`,
  `Hîncești`, `Testemițanu`, `Sfatul Țării`.
- Country spellings → `MD`: **Republica Moldova**, **Moldova**, **MDA**, **MD**.
- **PO box** (Căsuța Poștală / CP / OP) is not modelled (no `poBoxNames`); such
  lines are `__skip`.

## 7. Failure modes to test (>=8)

1. **`nr.` marker** — `Strada Ștefan cel Mare nr. 12`: marker dropped, number=12,
   not a lost token.
2. **Bare number, no marker** — `bd. Dacia 45`.
3. **Number range** — `49-53` kept whole.
4. **Letter suffix** — `12A`, `49B` → `civic_number_suffix`.
5. **Prefix type vocabulary** — Strada/str./Bulevardul/bd./B-dul/Calea/Șoseaua/
   șos./Aleea/Al./Piața/Drumul/Intrarea/Stradela, echoed verbatim.
6. **Date/number street names** — `Strada 31 August 1989 nr. 78`: leading number
   is part of the name, house number trails.
7. **"MD-" postcode prefix** — dropped, `postal_code=2012`, not a lost token.
8. **Postcode-before-city** — `MD-2012 Chișinău` parsed as postcode then city.
9. **Diacritics** round-trip — `Chișinău`, `Bălți`, `Hîncești`.
10. **Single secondary unit** — `ap. 12`, `bl. 3`, `apartament`.
11. **Stacked units** (`bl./sc./et./ap.`) — `__skip` (one slot only).
12. **Postcode-last courier variant** — `..., Chișinău, MD-2012` — `__skip`.
13. **PO box** (Căsuța Poștală) — `__skip` (not modelled).
14. **City-first with mun. prefix** — `mun. Chișinău, str. ...` — `__skip`.
15. **Country variants** — Republica Moldova / Moldova / MDA all → `MD`.
16. **Slash sub-number** — `6/2` — `__skip` (not modelled as a suffix).
