# Andorra (AD) Postal Address Research

Scope: parsing/normalizing Andorran street addresses. Andorra addresses in
CATALAN (the sole official language). Historically Correos (ES) and La Poste
(FR) both delivered; Correus Andorra now runs the domestic post. Grammar mirrors
Spanish/Catalan usage.

Sources: UPU Postal Addressing S42 (Andorra), Google libaddressinput
(`AD` format `%N%n%O%n%A%n%Z %C`, street lines free-form, postcode before city),
libpostal, Wikipedia "Postal codes in Andorra", Govern d'Andorra / Correus, OSM
Andorra.

## 1. Line order — TYPE + NAME, then house number
`[via-type] [street-name], [house-number]` then `[postal_code(ADnnn)]
[locality]`, e.g. `Carrer Prat de la Creu 62, AD500 Andorra la Vella`. A comma
before the number is optional (`Av. Meritxell, 96`). Postcode precedes the
locality.

## 2. Street type — leading word (prefix), Catalan
Carrer (C/), Avinguda (Av.), Plaça, Passeig, Passatge (Ptge.), Carretera
(Ctra.), Camí, Baixada, Pujada, Ronda, Rambla, Rotonda, Travessera, Travessia,
Cantonada, Vial, Via, Urbanització. Only the FIRST word is the type; particles
(`de`, `del`, `de la`, `dels`, `de les`, `d'`) stay with the name. The Catalan
connector `i` ("and") appears inside names (`Avinguda Fiter i Rossell`). Types
kept verbatim (incl. `Av.`, `Ctra.`, `C/`). Notable: Avinguda Meritxell, Avinguda
Carlemany, Carrer Prat de la Creu, Avinguda del Príncep Benlloch.

## 3. House number & "s/n"
Digits, optional glued letter or `bis`. An optional Spanish/Catalan number
marker (`núm.`, `n.º`, `nº`) may precede it. `s/n` (sense número) marks the
absence of a house number (`Carretera General s/n`) and normalizes into
`civic_number_suffix = "s/n"`.

## 4. Postal code — "AD" + 3 digits, ONE per parish, before the locality
`AD100` Canillo · `AD200` Encamp · `AD300` Ordino · `AD400` La Massana ·
`AD500` Andorra la Vella · `AD600` Sant Julià de Lòria · `AD700`
Escaldes-Engordany. Kept uppercase. Regex `(?<postal_code>AD\d{3})`. The letters
`AD` mean the CAP is never confused with a numeric house number.

## 5. Locality (parish or village), no separate state
The seven parishes double as the routing locality; villages within them also
appear: Pas de la Casa (AD200), Arinsal (AD400), Soldeu / El Tarter (AD100),
Santa Coloma (AD500), La Cortinada (AD300), Sispony (AD400). Parish names can be
multi-word with particles (`Sant Julià de Lòria`) and hyphens
(`Escaldes-Engordany`). There is NO separate province/region field. Country
variants: `Andorra`, `AD`, `AND`, `Principat d'Andorra`; normalized
`country = AD`.

## 6. Secondary units & PO boxes
Units (Catalan): pis (floor), porta (door), escala (staircase), bloc, edifici
(ed.), planta; Catalan ordinal floors `2n`, `3r`, `4t`, `1r`, `àtic`, `baixos`,
`principal`, `entresòl` (a floor with no explicit type word takes the default
`Pis`). PO box: **Apartat de Correus** (`Apartat`).

## 7. Accents & elision
Names carry Catalan accents/diacritics (à è é í ï ò ó ú ü ç ·l, e.g. Lòria,
Príncep, Arínsols, Molí). Elision `d'`/`l'` attaches with no space
(`d'Anna Maria Janer`, `de l'Aldosa`). Match Unicode `\p{L}`.

## 8. Failure modes (parser MUST handle)
1. Number after the name, with or without a comma (`Carrer ... 62`,
   `Av. Meritxell, 96`).
2. `s/n` no-number marker (`Carretera General s/n`), with/without comma.
3. Multi-word parish localities with particles (`Sant Julià de Lòria`) and
   hyphens (`Escaldes-Engordany`) — kept whole as the city.
4. Particle chains in the name (`de la`, `dels`, `de les`, `del`) stay with the
   street, not treated as a type.
5. Elision `d'`/`l'` (`d'Anna Maria Janer`, `de l'Aldosa`).
6. `AD`-prefixed postcode never grabbed as a house number.
7. Abbreviated types (`Av.`, `Ctra.`, `C/`) incl. `C/` abutting the name
   (`C/ Prat de la Creu`).
8. Catalan ordinal floor / door units (`2n`, `Àtic`, `Escala B`, `Porta 4`,
   `Bloc 2`) — floors without a type word default to `Pis`.
9. Locality-only lines (`AD500 Andorra la Vella`, `AD700 Escaldes-Engordany`).
10. Numberless street lines (`Avinguda Meritxell, AD500 Andorra la Vella`).
11. Connector `i` inside a name (`Fiter i Rossell`).

## 9. Known modeling limits (marked __skip in samples)
- A leading named building before the street (`Edifici Les Boïgues, Carrer Prat
  de la Creu 62, ...`): the building grammar is not enabled for AD.
