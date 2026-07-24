# Morocco (MA) Postal Address Research — French romanized form

Scope: parse/normalize Moroccan street addresses written in the **French
romanized** convention. Arabic-script addresses are explicitly out of scope (a
failure mode). Sources: Barid Al-Maghrib / Poste Maroc (national operator),
UPU Universal Postal Union addressing files (MAR), GeoPostcodes Morocco address
format guide, PostGrid / Pingen / Umbrex Morocco address guides, libpostal.

Sources:
- GeoPostcodes — Morocco address format: https://www.geopostcodes.com/country/morocco/address-format/
- Pingen — address example Morocco: https://www.pingen.com/en/address-formats/address-example-morocco
- PostGrid — Morocco address format: https://www.postgrid.com/global-address-format/morocco-address-format/
- UPU — Morocco (MAR) postcode type & position: https://youbianku.com/files/upu/MAR.pdf
- Umbrex — addressing a letter to Morocco: https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-morocco/

---

## 1. Order — NUMBER FIRST, French colonial convention

Morocco writes the **house number BEFORE the voie type + name**, exactly like
France (the country was a French/Spanish protectorate and the modern civic
grammar is French). A comma after the number is common in practice.

```
12 Rue Ibn Batouta          <- number, type (prefix), name
Quartier Maarif             <- neighbourhood (quartier) — NOT a routing field
Casablanca 20250            <- city, then 5-digit postcode
MAROC                       <- country (international mail only)
```

Single-string join: `12 Rue Ibn Batouta, Maarif, Casablanca 20250`.

Parse order: `[number] [type] [name]`, then `[quartier?]`, then `[city] [postcode]`.

## 2. Street type (type de voie) — leading word, kept verbatim

Prefix type, immediately after the number. Common set (kept verbatim, La Poste
abbreviations tolerated): **Rue, Avenue (Av/Av.), Boulevard (Bd/Bld),
Impasse (Imp), Place, Passage, Allée, Résidence (Rés), Lotissement (Lot),
Rond-point, Route (Rte)**. Two romanized-Arabic types are distinctively
Moroccan: **Derb** (a medina alley) and **Zankat / Zanqat / Zanka / Zenkat**
(the Arabic word for "street", transliterated). Particles (`de`, `du`, `de la`,
`des`, `d'`, `El`, `Al`) stay with the NAME, not the type. Only the FIRST word
is the type — an embedded "Bab", "Derb", "Souk" inside the name stays in the name.

## 3. Postcode (code postal) — 5 digits, position varies

- **Exactly 5 numeric digits**, no letters, no separator. First two digits route
  the province/prefecture (10=Rabat, 20=Casablanca, 40=Marrakech, 30=Fès,
  90=Tanger, 50=Meknès, 60=Oujda, 14=Kénitra, 26=Settat, …).
- **Position varies.** Barid Al-Maghrib / GeoPostcodes document the code AFTER
  the city on domestic mail ("Casablanca 20250"); international guides also show
  it BEFORE ("20250 Casablanca"). This config models **city-then-postcode**
  (after-city); the postcode-first order is a documented failure mode.
- The postcode is frequently **omitted** entirely on domestic mail (city alone).

## 4. Quartier (neighbourhood) — consumed, not a field

A quartier sits between the street and the city ("Maarif", "Agdal", "Gauthier",
"Hay Riad", "Ain Diab", "Guéliz"). It is a real orientation aid but carries no
output field here, so a **recognised** quartier is consumed/dropped (an
enumerated `areaNames` set of the major Casablanca/Rabat/Marrakech/Fès/Tanger
neighbourhoods). Unknown quartiers are a failure mode.

## 5. Region — none in the address

Morocco's 12 administrative regions are not written in a postal address; there
is no state/province field. (The postcode's first two digits encode the routing
province.)

## 6. Secondary units (compléments)

`Appartement` (Appt/Apt/App), `Étage` (floor), `Immeuble` (Imm, building),
`Bâtiment`, `Bloc`, `Bureau`. They sit after the street, before the place tail.

## 7. PO box — Boîte Postale (BP)

`BP` / `B.P` / `Boîte Postale` + number, e.g. `BP 1234, Rabat`. The box number is
NOT a house number (a classic libpostal misparse). Normalized to `BP`. A "Poste
Restante" variant exists but is rare.

## 8. Failure modes (parser MUST handle / documents its limits)

1. **Quartier drop** — "12 Rue Ibn Batouta, Maarif, Casablanca 20250": "Maarif"
   is consumed, not emitted; street stays "Ibn Batouta", city "Casablanca".
2. **Multiword / regnal name kept whole** — "45 Avenue Mohammed V", "Hassan II",
   "Hassan I": the numeral is part of the name, never a house number or unit.
3. **Derb / Zankat medina types** — "3 Derb Sidi Bouloukat", "14 Zankat Oued Fes":
   romanized-Arabic types recognised as the leading type.
4. **Abbreviated types** — "8 Bd Zerktouni", "12 Imp Ibn Rochd", "30 Av …" kept
   verbatim.
5. **Elision / particles** — "27 Boulevard d'Anfa", "10 Rue de la Liberté",
   "5 Avenue des FAR": `d'`/`de la`/`des` stay with the name.
6. **El / Al article in name** — "6 Rue El Houria", "7 Résidence Al Andalous".
7. **PO box (BP)** — "BP 1234, Rabat", "Boîte Postale 4021, Fès 30000": box
   number not a house number; spelled-out form normalized to BP.
8. **bis repetition index** — "12 bis Rue Verlet Hanus": civic_number_suffix.
9. **Secondary units** — "Appartement 8", "Étage 3", "Immeuble B", "Bloc C".
10. **Two-word quartier** — "Ain Diab", "Roches Noires", "Hay Riad" dropped whole.
11. **Arabic-script address** — out of scope; documented failure mode.
12. **postcode-before-city** ("20000 Casablanca") — not modelled (config is
    city-then-postcode).
13. **"Angle" corner-of-two-streets** ("Angle Bd X et Rue Y") — not modelled.
14. **Unknown quartier** not in the enumerated set is not dropped.
