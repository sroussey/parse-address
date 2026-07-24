# Fiji (FJ) postal-address research

Scope: parse and normalize Fijian street addresses for a config-driven
`EuCountryConfig`. Fiji uses the **English** convention: number-first with a
**trailing** street type, no postcode.

Sources
- Post Fiji — national operator; PO-box and street delivery, no postcode routing.
- UPU "Postal addressing systems — Fiji" note.
- Smarty "Fiji address format examples": "14 Milverton Rd Suva FJI",
  "Ap. 5 14 Papaya Ct Suva FJI", "G.P.O. Box 16471 Suva FJI"; structure =
  addressee / building / street / neighborhood / city / country (FJI).
- Umbrex "How to address a letter to Fiji": "MR. JOHN DAVID, 14 VIRIA STREET,
  VATUWAQA, SUVA, FIJI". Postcodes are NOT used; forms may accept 00000 / N/A.

## 1. Line order — NUMBER FIRST, trailing type
`[unit?] [number?] [street-name] [type]`, then `[suburb?] [city] [country?]`.
- English trailing suffix: "14 Viria Street", "14 Milverton Road".
- A **suburb / local area** often sits between the street and the city
  ("14 Viria Street, Vatuwaqa, Suva"; "5 Loftus Street, Walu Bay, Suva").
- Single-string forms join with commas; country as "Fiji" / "FJI".

## 2. Postcode — NONE
Fiji has no postal-code system. `postalPattern` is a never-matching sentinel, so
the postcode-absent place branch is always taken and a "street, suburb, city" chain
ends at the routing city.

## 3. Street types (trailing suffix)
Street (St), Road (Rd), Avenue (Ave), Drive (Dr), Place, Lane, Terrace (Tce),
Parade (Pde), Crescent (Cres), Close, Court, Circle, Highway (Hwy), Way, Rise,
Loop, Esplanade, Quay, Boulevard. Kept verbatim. The name is greedy so the
**rightmost** type word wins ("Ratu Mara Road" → "Ratu Mara" + "Road").

## 4. Suburb + city chain (single city slot)
Fiji, like South Africa, writes a suburb before the routing city but the engine has
one city slot. `cityAllowsCommas` keeps "Vatuwaqa, Suva" together; `postNormalize`
keeps the LAST locality ("Suva") as the city and records the earlier suburb(s) as
dropped (so the token-preservation guard does not score them as lost). This is safe
here because English suffix-type streets are captured greedily up to the first
comma, so a suburb never steals street tokens (contrast CM/DZ prefix grammar).

## 5. Region/division — NOT modelled
The 4 divisions (Central, Western, Northern, Eastern) + Rotuma are administrative,
not routinely written on mail. `countyPattern` is a never-matching sentinel so
nothing lands in `state`; a "..., Suva, Central" tail (division in place of a city)
is a documented skip.

## 6. Secondary units (leading)
Flat, Apartment (Apt), Ap. (Smarty spelling), Unit, Suite, Floor, Room, Lot —
modelled as LEADING units ("Flat 2, 14 Milverton Road, Suva"; "Ap. 5 14 Papaya
Court, Suva"). Ap./Apt normalize to "Apt".

## 7. PO box
"PO Box" / "P.O. Box"; the Suva head office uses "G.P.O. Box"; also "Private Mail
Bag" (PMB, often no number). Box number is not a house number.

## 8. Cities / suburbs (reference)
Cities: Suva, Lautoka, Nadi, Nausori, Ba, Labasa, Lami, Sigatoka, Savusavu,
Rakiraki, Pacific Harbour. Suva suburbs: Vatuwaqa, Walu Bay, Samabula, Nabua,
Toorak, Nasese, Flagstaff, Korovou.

## 9. Failure modes (parser MUST handle, or intentionally skip)
1. No postcode at all (normal): "14 Milverton Road, Suva".
2. Suburb + city chain: "14 Viria Street, Vatuwaqa, Suva" → city Suva, suburb
   dropped (not scored as token loss).
3. Multiword street name: "12 Ratu Mara Road" → street "Ratu Mara", type Road.
4. Abbreviation echoed: "14 Milverton Rd, Suva".
5. Leading unit: "Flat 2, 14 Milverton Road, Suva"; "Ap. 5 14 Papaya Court, Suva"
   (space-separated, no comma).
6. Glued letter suffix on number: "14A Extension Street, Suva".
7. Explicit country "Fiji"/"FJI" in the tail, with or without a suburb.
8. Parade/Terrace types: "37 Victoria Parade, Suva".
9. Two-word city: "3 Beach Road, Pacific Harbour".
10. **[SKIP]** administrative division in the tail ("..., Suva, Central") — no
    region support; the division would be taken as the routing city.
11. **[SKIP]** leading recipient/personal name ("Mr John David, 14 Viria Street,
    ...") — not part of the address grammar.
12. **[SKIP]** landmark/relative informal address ("Opposite Nabua Market, Suva").
13. **[SKIP]** a descriptor between a PO box and the city ("PO Box 2519, Government
    Buildings, Suva") — treated as a leading locality, not cleanly isolated.
