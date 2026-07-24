# Algeria (DZ) postal-address research

Scope: parse and normalize Algerian street addresses (Latin-script French form)
for a config-driven `EuCountryConfig`. Algeria is bilingual (Arabic + French);
mail addressing in Latin script uses the **French** convention (number-first,
prefix voie type, 5-digit postcode before the locality).

Sources
- UPU "Postal addressing systems — Algeria" (07/2002). Postcode: *5 digits to the
  left of the locality name*. Example: `M. Said Mohamed / 2, rue de l'Indépendance /
  16027 ALGIERS / ALGERIA`. Contact addr: `4, boulevard Belkacem Krim / 16027 ALGIERS`.
- GeoPostcodes "Algeria address format": *street + house number, postal code,
  commune, wilaya*; first 2 postcode digits = wilaya, last 3 = commune/locality.
- Smarty / PostGrid Algeria guides; worldpostalcode (Alger 16000, Oran 31000).

## 1. Line order — NUMBER FIRST, prefix voie type
`[number?][,] [voie-type] [street-name]`, then `[postcode(5)] [city] [wilaya?]`.
- The UPU official style writes a **comma after the house number**:
  "2, rue de l'Indépendance", "8, boulevard Belkacem Krim". The number pattern is
  small (≤4 digits) so a 5-digit run is unambiguously the postcode.
- Type LEADS the name (French). Number is often absent for named streets.

## 2. Postcode — 5 digits, BEFORE the locality
- Exactly 5 digits. First 2 = wilaya (province), last 3 = commune/delivery office.
  Leading zeros significant ("05000 Batna", "09000 Blida", "01000 Adrar").
- Written **before** the city ("16027 ALGIERS"), per UPU. Optional in the grammar.
- A trailing "City 16000" form (postcode AFTER city) also appears informally but is
  NOT the official layout and is a documented skip (see §9).

## 3. Street types (types de voie)
Rue, Avenue (Av), Boulevard (Bd, Bld), Cité (housing estate — very common in
Algeria), Route (Rte), Chemin, Passage, Place, Impasse, Allée, Rampe (Algiers
slope streets), Rond-point, Voie, Quai. Kept verbatim; only the first word is the
type. "Cité 200 Logements" → type Cité, street "200 Logements".

## 4. Particles / accents / apostrophes
- Lowercase particles stay in the name: de, du, de la, de l', des, d'.
- Elision `l'`/`d'` no space ("de l'Indépendance", "d'Isly"). Accept curly `’`.
- Apostrophes inside transliterated names: "Larbi Ben M'hidi" — the `'` is part of
  the name, never a separator.
- Accents: é è à ç ("Sétif", "Béjaïa", "Médéa", "Ghardaïa", "Saïda").

## 5. Numbered / dated street names
"Place du 1er Novembre", "Avenue du 1er Novembre" — the digits belong to the NAME.
Because the house number is consumed at the front and the postcode is a strict
5-digit token, these interior numerics stay inside the street name.

## 6. Wilaya (province) — optional -> state
58 wilayas, each with a 2-digit number (ISO 3166-2:DZ): Alger 16, Oran 31,
Constantine 25, Annaba 23, Blida 09, Sétif 19, Batna 05, Tlemcen 13, Béjaïa 06,
Tizi Ouzou 15, Ouargla 30, Ghardaïa 47, ... Written after the city, often as
"Wilaya d'Alger" / "Wilaya de Tlemcen". The config's `regionPattern` consumes the
optional "Wilaya d'/de " lead-in without capturing it, so `state` holds the bare
wilaya name, mapped to its 2-digit code.

## 7. Secondary units
Appartement (Appt/Apt), Immeuble (Imm), Bâtiment (Bât), Villa, Étage, Porte —
modelled as TRAILING units, before the postcode ("8 Rue Belouizdad, Appartement 4,
16000 Alger"). Leading units are a skip.

## 8. PO box — B.P. / Boîte Postale
`B.P.` / `BP` / `Boîte Postale` + number, then the 5-digit postcode + city.
Box number is not a house number → `sec_unit_type:"BP"`.

## 9. Failure modes (parser MUST handle, or intentionally skip)
1. Comma after number: "2, rue de l'Indépendance, 16027 Alger" (UPU official form).
2. Lowercase type echoed: "rue"→"rue", "boulevard"→"boulevard" (verbatim).
3. 5-digit postcode before city, incl. leading zeros: "09000 Blida".
4. No house number: "Rue Larbi Ben M'hidi, 31000 Oran".
5. Apostrophe in name: "M'hidi", "d'Isly" — not a split point.
6. Elision "de l'ALN", "de l'Indépendance".
7. Cité + numbered name: "Cité 200 Logements, 09000 Blida".
8. Wilaya "Wilaya d'Alger" / bare "Oran" → 2-digit code state; lead-in dropped.
9. Wilaya equal to city name ("25000 Constantine, Constantine") → state 25.
10. B.P. box before postcode: "BP 45, 16000 Alger" — box, not house number.
11. bis / letter repetition index: "10 bis Rue Didouche Mourad".
12. Two-word city: "15000 Tizi Ouzou".
13. **[SKIP]** postcode written AFTER the city ("Rue X, Alger 16000") — DZ postcode
    is officially before the locality.
14. **[SKIP]** quartier/commune between street and postcode ("..., Quartier Hydra,
    16000 Alger") — no slot exists between street and postcode.
15. **[SKIP]** Arabic-script addresses (Latin/French only).
16. **[SKIP]** leading secondary unit before the house number.
