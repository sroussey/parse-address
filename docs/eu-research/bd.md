# Bangladesh (BD) Street Address Research

Research for the config-driven XRegExp address parser. Focus: Bangladesh Post's
4-digit postcode (very commonly **hyphen-glued** to the city, "Dhaka-1212"), the
numbered "House N, Road N" planned-area grammar, the Block/Sector/area locality
chain, and the 8 divisions. Target: the common single-line romanised business
form; native Bangla-script forms are out of scope.

---

## 1. Canonical address order

The dominant modelable urban form (Dhanmondi, Gulshan, Banani, Uttara planned
areas) is:

```
House N, Road N, [Block X,] [Sector N,] Area, City-NNNN[, Division]
```

Real examples the parser targets (Smarty / GeoPostcodes / PostGrid):

```
House 12, Road 5, Block C, Gulshan, Dhaka-1212
House 45, Road 27, Dhanmondi, Dhaka-1209
Plot 7, Road 12, Sector 4, Uttara, Dhaka-1230
House 3, Road 11, Banani, Dhaka 1213
```

So: **house number first (labelled "House"/"Plot"/"Holding"), a numbered PREFIX
"Road N" thoroughfare, then a Block/Sector/area chain, then the city with the
postcode AFTER it (after-city).**

---

## 2. Postcode — the 4-digit code, usually hyphen-glued

- **Exactly 4 digits** (Bangladesh Post's postcode). First two digits are the
  district sorting zone.
- **Placement: after the city.** In real Bangladeshi usage the code is most often
  **glued to the city with a hyphen** ("Dhaka-1212", "Chattogram-4000"); the
  space/comma form ("Dhaka 1209") also occurs. Both are supported:
  - space form -> the shared after-city place grammar captures `\d{4}`;
  - hyphen-glued form -> the whole "..., Dhaka-1212" lands in the comma-permissive
    city capture with no grammar-parsed code, and `postNormalize` peels the
    `-NNNN` off the routing-city part.

---

## 3. Thoroughfare — numbered PREFIX "Road N"

The dominant urban thoroughfare is a **numbered road**: `Road 5`, `Road 27`,
`Road No. 3`. Modelled as a PREFIX type ("Road"/"Rd") whose "name" is the road
number, mirroring Pakistan's "Street N".

- A "No."/"No" between the type and the number ("Road No. 12") is folded into the
  type spelling (`Road No.`), then the display map canonicalises it back to
  "Road", keeping the number as the street name.
- Lesser types: Lane, Avenue, Sarak/Sarani (Bengali road).
- **Named / suffix roads** ("Dhanmondi Road", "Kemal Ataturk Avenue") do NOT fit
  the numbered prefix form and are documented `__skip`.

---

## 4. House number variants

- Lead-in `House`/`Ho.`/`Holding`/`Plot`/`No.`, then the number.
- **Slash sub-part**: `House 12/A` -> number "12/A".
- **Hyphen letter suffix**: `Plot 7-B` -> 7 + civic_number_suffix "B".
- **Secondary unit leads**: `Flat B5`, `Apartment 4`.
- **Letter-led house id** ("House C-25") is NOT a numeric house number ->
  documented `__skip`.
- The label words "House"/"Ho"/"Plot"/"Holding" carry no output field; they are
  added to `__dropped` so the token-preservation guard does not miscount them.

---

## 5. Block / Sector / area chain

A `Block C`, `Sector 4` and the area/thana (Gulshan, Dhanmondi, Banani, Uttara,
Mohakhali, Bashundhara, ...) sit between the road and the city. The IN/ZA trick
keeps the comma chain in the city capture, then `postNormalize` keeps the routing
city and drops the rest.

**Ambiguity handled:** the division names (Dhaka, Chattogram, Sylhet, Rajshahi,
Khulna, ...) are ALSO the names of their capital cities. A bare division name
before the postcode therefore collides with the routing city, so the county slot
requires the explicit word **"Division"** ("Dhaka Division"); a bare "Dhaka" is
always the city.

---

## 6. Division — output as a short code

8 divisions -> `state`: Dhaka DH, Chattogram/Chittagong CT, Khulna KH, Rajshahi
RJ, Barishal/Barisal BR, Sylhet SY, Rangpur RP, Mymensingh MY. Captured after a
space-form postcode via the `bd_state` helper ("Dhaka 1212, Dhaka"), or as an
explicit "X Division" via the county slot / the glued-form chain tail; all fold to
the code. Usually omitted (the postcode routes it).

Secondary units: Flat / Apartment / Apt, Floor, Suite, Room, Unit. PO box:
PO Box / P.O. Box / GPO Box. Building keywords: Bhaban/Bhawan, Tower(s),
Centre/Center, Complex, Plaza, Building, Chamber(s), Heights.

---

## 7. Prior work & known failure modes (>=8)

Prior art: Bangladesh Post; Wikipedia "Postal codes in Bangladesh"; Smarty global
address formatting (BD); GeoPostcodes / PostGrid / Umbrex Bangladesh guides; the
government "Postal Codes in Bangladesh" PDF directory.

1. **Hyphen-glued "City-NNNN".** The dominant real form; the shared place
   separator is `[\s,]+`, so the code is recovered from the city tail in
   `postNormalize` rather than by the grammar.
2. **Division name == city name.** Dhaka/Chattogram/Sylhet/... are cities AND
   divisions; the county slot requires the literal "Division" word to avoid
   stealing the routing city.
3. **"Road No. N".** A "No." between the type and the number is folded into the
   type spelling so the road number stays the street name.
4. **Named / suffix roads.** "Dhanmondi Road", "Kemal Ataturk Avenue" — not the
   numbered prefix form; documented `__skip`.
5. **Letter-led house id.** "House C-25" — not a numeric house number; documented
   `__skip`.
6. **House sub-parts.** `House 12/A`, `Plot 7-B` — a `\d+`-only number truncates
   them; kept via `\d+(?:/[0-9A-Za-z]+)?` + hyphen letter suffix.
7. **Block / Sector chain.** Multiple localities before the city; dropped
   (recorded in `__dropped`).
8. **Label-only lead-ins.** "House"/"Ho"/"Plot"/"Holding" — exempted from the
   token guard via `__dropped`.
9. **Building-led corporate line.** "BSEC Bhaban, 102 Kazi Nazrul Islam Avenue"
   — a building name + a named suffix Avenue; documented `__skip`.
10. **UPU single-line order.** "15 Dhanmondi Road 1209 Dhaka" (postcode before the
    city, no comma delimiters); documented `__skip`.
11. **Native Bangla script.** Out of scope; romanised forms only.
12. **Chattogram / Chittagong spelling.** Both anglicisations are accepted.

---

## 8. Field-mapping decisions

- `number` — leading integer (or `n/x`), `House`/`Plot`/`Holding`/`No.` lead-in.
- `civic_number_suffix` — trailing letter after a hyphen ("7-B").
- `street` — the road NUMBER (for "Road N"); `type` — "Road"/"Lane"/"Avenue".
- `sec_unit_type`/`sec_unit_num` — Flat/Apartment + value; PO Box + value.
- `building` — a leading name ending in a building keyword.
- `city` — routing city (postcode peeled off in the glued form); Block/Sector/area
  dropped.
- `state` — 2-letter division code (usually absent).
- `postal_code` — 4-digit code.
- `country` — `BD`.

---

## Sources

- Bangladesh Post Office — https://bdpost.gov.bd/
- Wikipedia — Postal codes in Bangladesh — https://en.wikipedia.org/wiki/Postal_codes_in_Bangladesh
- Smarty — Bangladesh address format & examples — https://www.smarty.com/global-address-formatting/bangladesh-address-format-examples
- GeoPostcodes — Bangladesh address format — https://www.geopostcodes.com/country/bangladesh/address-format/
- PostGrid — Bangladesh Address Format With Examples — https://www.postgrid.com/global-address-format/bangladesh-address-format/
- Umbrex — How to Address an International Letter to Bangladesh — https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-bangladesh/
- Bangladesh Government — Postal Codes in Bangladesh (directory PDF) — https://file-mymensingh.portal.gov.bd/files/atpara.netrokona.gov.bd/page/.../Postal%20Codes%20in%20Bangladesh.pdf
