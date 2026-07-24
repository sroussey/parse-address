# Albanian (AL) Street-Address Research

Research for a config-driven address parser. Sources: Google libaddressinput
(`AL`, format `%N%n%O%n%A%n%Z %C`, postal regex `\d{4}`); Smarty global address
formatting — Albania
(https://www.smarty.com/global-address-formatting/albania-format-examples);
PostGrid Albania address format
(https://www.postgrid.com/global-address-format/albania-address-format/);
GeoPostcodes Albania address-format guide
(https://www.geopostcodes.com/country/albania/address-format/); Umbrex "How to
address an international letter to Albania"; Universal Postal Union addressing
data; Wikipedia (Albanian postal codes, Boulevard Dëshmorët e Kombit). Modelled
against the repo's HR/SI/CZ sibling conventions.

---

## 1. Canonical order

Albanian writes the **street first, then the house number**, and (per
libaddressinput `%Z %C`) the **postcode BEFORE the city**:

```
<Type> <Name> <No.>[letter]
[AL-]<PPPP> <City>
[Shqipëria]
```

Single-line: `Rruga Myslym Shyri 8, 1001 Tiranë`,
`Bulevardi Dëshmorët e Kombit 12, 1001 Tiranë`.

Key facts:
- **Generic street word ALWAYS LEADS** (`Rruga`, `Bulevardi`, `Sheshi`) — there
  is no trailing-generic case as in the BCMS siblings.
- **Number after the street.**
- **4-digit postcode ("Kodi Postar"), before the city**, no separator (Google
  libaddressinput; Smarty; PostGrid).
- The postcode is **very often omitted** in domestic practice
  (`Rruga Kavajës 15, Tiranë`); the before-city grammar makes it optional.
- No region (**qark**, 12 counties) line in postal addresses.

**Ordering caveat.** Real Albanian corpora are inconsistent: some write the
postcode AFTER the city (`Rruga Hafiz Podgorica 156, Durrës 2001`). The
authoritative libaddressinput template and this parser use **postcode-before-city**;
the city-then-postcode variant is a documented failure mode (§7).

## 2. Street "types" (always leading)

| Word | English | Extracted |
|------|---------|-----------|
| Rruga (Rr.) | street | yes → `type` |
| Bulevardi (Bul.) | boulevard | yes |
| Sheshi | square | yes |
| Lagjja | neighbourhood/quarter | yes (rare) |

Only a **leading** generic is extracted into `type` (spelling preserved,
`normalizeTypeCase:false`), e.g. `Rruga Myslym Shyri` → type `Rruga`, street
`Myslym Shyri`. The abbreviations `Rr.`/`Bul.` are accepted (optional trailing
dot). A bare name with no leading generic stays whole in `street`.

## 3. House number

- Digits plus an optional **single letter** suffix (`12a`, `45b`) → letter into
  `civic_number_suffix`. Same pattern as HR/SI.
- The **modern Albanian addressing system** (adopted ~2013) adds
  `Nd.` (Ndërtesa = building), `Hyrja` (entrance), `Ap.` (Apartament):
  `Rruga X, Nd. 5, Hyrja 3, Ap. 12`. Not modelled → `__skip` (§7).

## 4. Postcode & the AL- prefix

- Regex `\d{4}`; first digit = zone (Tiranë `1xxx`, Durrës `2xxx`, Shkodër
  `4xxx`, Berat `5xxx`, Fier `6xxx`, Korçë/Pogradec `7xxx`, Gjirokastër `8xxx`,
  Vlorë `9xxx`).
- Optional international **`AL-`** prefix captured into a `drop` group (consumed,
  not emitted) so a boundary trim never strands it as a lost street token — the
  same treatment HR uses for `HR-`. (Rare in practice; included for robustness.)

## 5. Diacritics

Albanian letters in names/cities: **ë ç** (and the digraphs gj, xh, dh, ll, nj,
rr, sh, th, zh spelled with plain letters). Preserve: `Tiranë`, `Vlorë`,
`Shkodër`, `Korçë`, `Sarandë`, `Gërmenji`, `Frashëri`, `Dëshmorët`.

## 6. Region / units / PO box / script

- **No qark** in the address line → no `state`.
- Secondary units: the `Nd./Hyrja/Ap.` chain (see §3) — not modelled.
- PO box: **Kutia Postare** (K.P.) — not in `poBoxNames`; `__skip`.
- Script: Albanian is **Latin only** (no Cyrillic), so no script failure mode
  as in RS/BA/ME.
- Country spellings → `AL`: **Shqipëria**, **Shqipëri**, **Albania**, **ALB**,
  **AL**.

## 7. Failure modes to test (>=8)

1. **Leading Rruga/Bulevardi/Sheshi** — `Rruga Myslym Shyri 8` → type `Rruga`,
   street `Myslym Shyri`. (PASS)
2. **Abbreviation** — `Rr.`/`Bul.` with trailing dot. (PASS)
3. **Letter suffix** — `12a`, `45b` → `civic_number_suffix`. (PASS)
4. **Postcode omitted** — `Rruga Kavajës 15, Tiranë` parses, no postcode. (PASS)
5. **`AL-` prefix** — consumed via `drop`, no token loss. (PASS)
6. **Diacritics / multi-word name** — `Punëtorët e Rilindjes`, `e Durrësit`. (PASS)
7. **Roman numeral in name** — `Bulevardi Zogu I 45`, `Brigada VIII`. (PASS)
8. **Country variants** — Shqipëria / Albania / ALB → `AL`. (PASS)
9. **City-then-postcode** — `Rruga Hafiz Podgorica 156, Durrës 2001` — postcode
   after city; before-city grammar fails → `__skip`.
10. **Modern Nd./Hyrja/Ap. system** — `..., Nd. 5, Hyrja 3, Ap. 12` → `__skip`.
11. **`bb` / numeric-only name** — `Lagjja 14` (the digit is taken as the house
    number, leaving no name) → `__skip`.
12. **Digit-led (date) name after a leading type** — `Rruga 13 Dhjetori 7`:
    the street-first grammar excludes digits from the name (allowDigitsInName not
    set), so the leading `13` is captured as the number → `__skip`.
13. **Rural village line** — `Fshati Lin, Pogradec 7301`, no street/number →
    `__skip`.
14. **PO box (Kutia Postare)** — not modelled → `__skip`.
