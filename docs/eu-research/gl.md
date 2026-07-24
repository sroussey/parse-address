# Greenland (GL) Street-Address Research

Config-driven address parser research. Greenland is a self-governing Danish
territory using the **Danish postal system**, but its street/building grammar is
distinctive (long Kalaallisut names; building "B-numbers"). The parser uses the
Danish street-first, postcode-before-city layout with **no street-type parsing**
(`typePlacement:"none"`).

Sources: Wikipedia "Postal codes in Greenland" (GL, 4 digits, first two "39");
ResearchGate (house-number + **B-number** plates on Nuuk buildings —
https://www.researchgate.net/figure/House-number-and-B-number-plate-on-the-house-in-Greenland-Nuuk...);
Smarty (https://www.smarty.com/global-address-formatting/greenland-address-format-examples);
PostGrid (https://www.postgrid.com/global-address-format/greenland-address-format/);
GeoPostcodes (https://www.geopostcodes.com/country/greenland/address-format/);
TELE-POST / Post Greenland; OpenStreetMap Nuuk data.

---

## 1. Canonical order

**Street name FIRST, premises AFTER; postcode BEFORE the city:**

```
<Street> <No. | B-number>
<39NN> <Locality>
[Kalaallit Nunaat]
```

Single-line: `Aqqusinersuaq 10, 3900 Nuuk` or `Aqqusinersuaq B-1140, 3900 Nuuk`.

- **Premises after the street.**
- The **4-digit postcode precedes the locality** (Danish convention).
- **No region/state.**

## 2. Street "type"

Greenlandic street names are **long single or multi-word Kalaallisut/Danish
words** with no productive fused generic that is safe to peel:
- Kalaallisut generics appear as bound genitives — `Aqqutaa` ("his/its road",
  e.g. `Jens Kreutzmannip Aqqutaa`), `Aqquserna` ("route", `Aalisartut
  Aqquserna`), `-suaq` ("big", `Aqqusinersuaq`). These are **not** split out.
- Danish-origin names ending `-vej` (`Hans Egedesvej`, `Industrivej`) are common
  and are **kept whole** (unlike DK, GL does not peel `-vej`).

So `typePlacement:"none"`: the whole street name is captured, no `type` emitted.

## 3. Premises: number vs B-number (building)

- A **plain house number** (`10`) with optional glued **letter suffix** (`10A`)
  → `number` / `civic_number_suffix`.
- A **B-number** (`bygningsnummer`, e.g. `B-1140`, `B-957`, `B-32`), the older
  building-identifier still used across Greenland, is routed to **`building`**
  (canonicalised to `B-<digits>`) by a `postNormalize` hook that reads the
  captured `number`, and — because `building` is a street field in the
  token-preservation model — the B-number is preserved. Written `B1140` (no
  hyphen) is accepted and canonicalised to `B-1140`.

## 4. Postal code

- **Four digits, first two "39"** (`3900`–`3992`). No "GL-" prefix domestically.
  `postalPattern` = `39\d{2}`.
- Ranges (illustrative): 3900 Nuuk, 3905 Nuussuaq, 3910 Kangerlussuaq, 3911
  Sisimiut, 3912 Maniitsoq, 3913 Tasiilaq, 3920 Qaqortoq, 3921 Narsaq, 3922
  Nanortalik, 3940 Paamiut, 3950 Aasiaat, 3951 Qasigiannguit, 3952 Ilulissat,
  3953 Qeqertarsuaq, 3961 Uummannaq, 3962 Upernavik.

## 5. PO box / units

- **PO box**: `Postboks` (also `Boks`, `Postbox`) + number, replacing the street
  (`Postboks 100, 3900 Nuuk`). Emitted `sec_unit_type:"Postboks"`.
- No floor/side secondary unit is modelled (rare in Greenland); such forms are
  `__skip`.
- **Blok-name** addressing (`Blok P`, `Blok 10`) is **not** modelled distinctly;
  a bare `Blok N` parses `Blok` as the street name → `__skip`.

## 6. Country

- Country spellings → `GL`: **Kalaallit Nunaat**, **Grønland**, **Greenland**,
  **GRL**, **GL**.

## 7. Failure modes to test (>=8)

1. **Plain number** — `Aqqusinersuaq 10` → `number` 10.
2. **B-number → building** — `Aqqusinersuaq B-1140` → `building` B-1140, no
   `number`; token preserved.
3. **B-number without hyphen** — `B1140` canonicalised to `B-1140`.
4. **Letter suffix** — `Imaneq 10A` → number 10 + suffix A.
5. **Multiword Kalaallisut name** — `Jens Kreutzmannip Aqqutaa 5` kept whole.
6. **Name with initials/dots** — `H.J. Rinkip Aqqutaa 3`.
7. **Danish `-vej` name kept whole** — `Hans Egedesvej 8` (no type parsed).
8. **Postcode-before-city** — `3900 Nuuk` parsed as postcode then city.
9. **`39NN` range** — Nuuk 3900 … Upernavik 3962 all captured.
10. **PO box** — `Postboks 100`, `Boks 350` → `sec_unit_type` Postboks.
11. **Location-only line** — `3900 Nuuk` (no street) parses to postcode + city.
12. **Country variants** — Kalaallit Nunaat / Grønland / Greenland / GRL → `GL`.
13. **Blok-name** — `Blok P, B-16` / `Blok 10` — `__skip`.
14. **Floor unit** — `1. sal` — `__skip` (not modelled).
15. **City-first ordering** — `Nuuk, 3900` — `__skip`.
16. **Diacritic-free but long names** — `Kissarneqqortuunnguaq` round-trips.
