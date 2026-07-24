# Monaco (MC) Postal Address Research

Scope: parsing/normalizing Monégasque street addresses for a config-driven
TS/XRegExp parser. Monaco follows FRENCH addressing conventions; its postal
service (part of the French–Monégasque arrangement, La Poste Monaco) uses codes
inside the French 5-digit plan.

Sources: UPU Postal Addressing S42 (Monaco), La Poste / La Poste Monaco
guidance, Google libaddressinput (`MC` format `%O%n%N%n%A%n%Z %C`, same as FR),
libpostal, Wikipedia "Postal codes in Monaco", OpenStreetMap Monaco.

## 1. Line order — NUMBER FIRST (as France)
`[number] [rep-index bis/ter] [voie-type] [street-name]` then
`[postal_code(980xx)] [locality]`. Single-string forms usually join with commas:
`2 Boulevard des Moulins, 98000 Monaco`. A comma after the number is common in
French usage (`2, Boulevard des Moulins`). libaddressinput confirms
postcode-before-city and number-first (French local convention).

## 2. Repetition index — bis / ter / quater (as France)
A house-number suffix: `2 bis`, `7 ter`. Also a single trailing letter
(`12 B`). Represented as `number="2"`, `civic_number_suffix="bis"`. It sits
between the number and the voie type; it is NOT part of the street name.

## 3. Street types (types de voie) — leading word (prefix)
Same French vocabulary: Rue, Avenue (Av.), Boulevard (Bd), Place (Pl.), Quai,
Impasse, Allée, Chemin, Passage, Montée, Descente, Escalier, Ruelle, Rampe,
Esplanade, Promenade, Voie, Square, Villa, Parvis, Galerie, Accès, Cours,
Route, Rond-point. Only the FIRST word after the number is the type; particles
(`de`, `du`, `de la`, `des`, `d'`) stay with the name. Types are kept verbatim
(La Poste keeps `Bd`, `Av.`, `Rue`). Monaco-notable examples: Boulevard des
Moulins, Avenue de la Costa, Avenue Princesse Grace, Rue Grimaldi, Quai Antoine
1er, Boulevard Albert 1er, Boulevard Rainier III, Avenue des Spélugues.

## 4. Postal code — 980xx, 5 digits, before the locality
Monaco shares the block **98000–98099** in the French postal plan. **98000** is
by far the most common (used for ordinary residential mail across the whole
Principality). Higher codes in the block (e.g. 98007, 98012, 98025) are
CEDEX/bulk codes for administrations and large recipients. The code PRECEDES the
locality. An optional `MC` / `MC-` ISO prefix may lead the code on international
mail (`MC-98000`). Regex used: `(?:MC[-\s]?)?(?<postal_code>980\d\d)`.

## 5. Locality (quartier / ward), no province
Monaco has no city subdivision that behaves like a French commune; the locality
written on the last line is the Principality or one of its wards: **Monaco**,
**Monte-Carlo**, **La Condamine**, **Fontvieille**, **Monaco-Ville**,
Moneghetti, Larvotto, Saint-Roman, La Rousse, Les Révoires, Jardin Exotique.
There is NO state/region/province field. Country variants: `Monaco`, `MC`,
`MCO`, `Principauté de Monaco`; normalized `country = MC`.

## 6. Secondary units & PO boxes
Units (French): Appartement (Appt/Apt), Bâtiment (Bât), Escalier (Esc), Étage,
Bloc, Bureau. PO boxes: **BP** (Boîte Postale) and **CS** — the box number is
NOT a house number (`BP 179` → sec_unit_type "BP", num "179"). **CEDEX** may
trail the locality (`98007 Monaco Cedex`) and is stripped (not part of the city,
not a unit).

## 7. Accents & elision (as France)
Names carry accents (é è ê à ô û ç, e.g. Spélugues, Pêcheurs, Félix). Elision
`d'`/`l'` attaches with no space (`Avenue d'Ostende`, `Avenue de l'Annonciade`).
Data also arrives uppercase/accent-stripped for OCR (`2 BD DES MOULINS 98000
MONACO`). Match Unicode `\p{L}`, preserve the original for output.

## 8. Failure modes (parser MUST handle)
1. `bis`/`ter`/letter rep-index between number and type (`2 bis Boulevard des
   Moulins`) — not swallowed into the street name.
2. Comma after the number (`2, Boulevard des Moulins, 98000 Monaco`).
3. Digits INSIDE the name: regnal/roman ordinals (`Quai Antoine 1er`,
   `Boulevard Albert 1er`, `Boulevard Rainier III`) — not a house number.
4. `Monte-Carlo` as the locality (hyphenated) vs `Monaco`.
5. Uppercase/accent-stripped OCR form, no comma (`5 RUE GRIMALDI 98000 MONACO`).
6. Abbreviated types with a dot (`Bd`, `Av.`, `Pl.`) kept verbatim.
7. Elision `d'`/`l'` in the name (`Avenue d'Ostende`, `Place d'Armes`).
8. CEDEX trailing the locality (`98007 Monaco Cedex`) and 98000-block codes.
9. BP/CS PO box lines — box number is not a house number.
10. Locality-only line (`98000 Monaco`) and numberless street lines
    (`Avenue de la Costa, 98000 Monaco`).
11. `Monaco` appearing as both locality and country (`..., 98000 Monaco,
    Monaco`).
12. `MC-`/`MC ` ISO prefix on the postcode.

## 9. Known modeling limits (marked __skip in samples)
- A leading named residential tower before the number-street block
  (`Le Roccabella, 24 Avenue Princesse Grace, ...`): the building grammar is not
  enabled for MC.
- Landmark-only lines with no street (`Palais de Monaco, 98000 Monaco`).
