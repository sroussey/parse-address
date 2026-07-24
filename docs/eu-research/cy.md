# Cyprus (CY) Postal Address Research

Scope: parsing & normalising Cypriot street addresses (Latin-script / English
form, the usual international rendering). Sources at the bottom.

---

## 1. Line order — NUMBER FIRST, then name + English generic, postcode before city

Cyprus (Republic of Cyprus, government-controlled area) writes the **house
number first**, then the street name with a trailing English generic
(a legacy of British rule), then a **4-digit postcode before the city**:

```
25 Makariou Avenue
1065 Nicosia
CYPRUS         (country line, international only)
```

Single-string form: `25 Makariou Avenue, 1065 Nicosia`.

- `order: number-street`, `typePlacement: suffix`, `postalPlacement: before-city`.

## 2. Street type — English generic, TRAILING (suffix)

English generics trail the name (`Makariou Avenue`, `Ledra Street`,
`Grivas Digenis Boulevard`): **Street, Avenue, Road, Boulevard, Square, Court,
Drive, Lane, Circle, Park**, plus abbreviations **Ave, St, Str, Rd, Blvd, Sq**.
Type echoed as written (`normalizeTypeCase: false`); short code derived.

The Greek-script form uses a *prefix* generic instead (`Λεωφόρος Μακαρίου` =
Avenue Makariou) and the Greek convention often puts the **number after** the
name. That prefix/number-after form is **out of scope** for this best-effort
config (a single grammar can't be both prefix and suffix); a Greek-order line
like `Onasagorou 15` cannot be split by a number-first suffix grammar and is
documented as a `__skip`. A bare transliterated name with **no generic**
(`Onasagorou`, `Stasikratous`) parses untyped.

## 3. Postcode — 4 digits, before the city, optional "CY-" prefix

- Format: **4 digits** (`1065`, `3040`, `6023`, `8046`). First digit ≈ district
  (1–2 Nicosia, 3–4 Limassol, 5 Famagusta/Paralimni area, 6–7 Larnaca, 8 Paphos).
- Position: **before** the city (`1065 Nicosia`).
- International inbound mail prefixes **`CY-`** (`CY-1065 Nicosia`). The prefix is
  captured into the postcode group and echoed as written (`CY-1065` stays
  `CY-1065`, bare `1065` stays `1065`) — stripping or forcing it would desync the
  postcode from the source and trip the token-preservation guard.

## 4. Region / state

None on the address line (districts are implied by the postcode, not written).

## 5. Secondary units

`Flat`, `Apartment`/`Apt`, `Office`, `Shop`, `Floor`, `Suite`, `Block` + number.
Placed after the street (`… Avenue, Office 302, 1065 Nicosia`).

## 6. PO boxes

`P.O. Box` / `PO Box` (Greek `Τ.Θ.`) + number, displayed `PO Box`; a very common
form for Cypriot businesses. Replaces the street:
`P.O. Box 21455, 1509 Nicosia`.

## 7. Orthography

Latin transliteration varies (`Makariou`/`Makarios`, `Griva`/`Grivas`); the
parser is spelling-agnostic. Names often carry a Roman numeral or single letter
(`Makariou III`, `Georgiou A`). Cities are ASCII in the Latin form
(`Nicosia`, `Limassol`, `Larnaca`, `Paphos`, `Strovolos`, `Aglantzia`).

## 8. Country variants

`Cyprus`, `Κύπρος`, `Kypros`, `CYP`, `CY`. Normalised country = `CY`.

---

## Failure modes the parser MUST handle (concrete)

1. **Rightmost generic wins (greedy name)**: `Grivas Digenis Avenue` → name
   `Grivas Digenis` + type `Avenue`; `Themistokli Dervi Avenue`,
   `Spyrou Kyprianou Avenue` — multi-word name before the trailing type.
2. **Bare untyped name**: `15 Onasagorou`, `5 Stasikratous` — no generic; whole
   name in `street`, `type` absent.
3. **Greek-order (name-then-number) not supported**: `Onasagorou 15` — a
   number-first grammar leaves `15` glued in the name (`__skip`, documents limit).
4. **`CY-` prefix**: `25 Makariou Avenue, CY-1065 Nicosia` — prefix kept, city
   still parsed.
5. **Abbreviated generics**: `Makariou Ave`, `Ledra St`, `Grivas Digenis Blvd` —
   kept verbatim, short code derived.
6. **Roman numeral / letter inside name**: `Archbishop Makarios III Avenue`,
   `Makariou III Avenue`, `Georgiou A Street` — part of the name.
7. **Date/number name after the house number**: `3 28th October Avenue`,
   `1 1st April Street` — embedded digits are the name; only the leading token is
   the house number.
8. **No commas / run-together**: `25 Makariou Avenue 1065 Nicosia` — split on the
   4-digit postcode boundary.
9. **Two-word city**: `Ayia Napa`, `Agios Tychonas` — city may contain a space.
10. **Trailing secondary unit**: `… Avenue, Office 302, 1065 Nicosia`;
    `… Street, Flat 5, …`; `… Street, Shop 2, …`.
11. **PO box**: `P.O. Box 21455, 1509 Nicosia` — box, not a house number.
12. **Letter civic suffix / range**: `25A Makariou Avenue`;
    `25-27 Makariou Avenue`.
13. **Trailing country / alpha-3**: `…, 1065 Nicosia, Cyprus` / `…, CYP` —
    consumed, normalised to `CY`.

---

## Sources

- Cyprus Post (Ταχυδρομικές Υπηρεσίες Κύπρου) addressing guidance:
  https://www.cypruspost.post ; UPU S42 Cyprus page (postcode type & position):
  https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/cypEn.pdf
- Wikipedia, "Postal codes in Cyprus" (4-digit numeric, `CY-` for inbound intl):
  https://en.wikipedia.org/wiki/Postal_codes_in_Cyprus
- PostGrid Cyprus address format (number+street, postcode-before-city, `CY-`
  prefix note): https://www.postgrid.com/global-address-format/cyprus-address-format/
- Umbrex / Smarty Cyprus format examples.
