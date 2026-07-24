# San Marino (SM) Postal Address Research

Scope: parsing/normalizing Sammarinese street addresses. San Marino uses ITALIAN
addressing; Poste San Marino delivers and the CAP is inside the Italian 5-digit
plan (all 4789x). Italy (Poste Italiane) handles international exchange.

Sources: UPU Postal Addressing S42 (San Marino / Italy), Google libaddressinput
(`SM` format `%N%n%O%n%A%n%Z %C`, street first for the type-led toponimo,
postcode before city), libpostal, Wikipedia "Postal codes in San Marino" &
"Castelli of San Marino", Poste San Marino, OSM San Marino.

## 1. Line order — TYPE + NAME, then house number (as Italy)
`[toponimo-type] [street-name] [house-number]` then `[CAP(4789x)] [locality]
[(RSM)]`, e.g. `Via Ventotto Luglio 15, 47893 Borgo Maggiore`. A comma before
the civico is possible (`Via Piana, 12`). Postcode precedes the locality.

## 2. Street type — leading word (prefix), Italian
Via (V), Viale (V.le), Vicolo, Piazza (P.za), Piazzale (P.le), Piazzetta,
Strada (Str), **Contrada (C.da)** — very characteristic of San Marino's historic
centre — Salita, Corso (C.so), Largo (L.go), Borgo, Galleria, Campo, Rampa,
Località (Loc), Strada Statale. Only the FIRST word is the type; particles
(`del`, `della`, `di`, `dei`, `delle`, `alla`, `la`) and the elided `Ca'`
(casa), `Sant'` stay with the name. Types kept verbatim (incl. `V.le`, `P.za`).
Notable: Contrada Omerelli, Contrada del Collegio, Salita alla Rocca, Via
Ventotto Luglio, Piazza della Libertà, Strada di Montecchio.

## 3. House number (civico) & "snc"
Digits (capped at 4 so the 5-digit CAP is never taken as the civico), with an
Italian civico suffix: glued letter (`25A`), slash (`30/A`), `bis`/`ter`, or a
bare `snc` (senza numero civico → `civic_number_suffix = "snc"`).

## 4. CAP — 5 digits 47890–47899, before the locality
By convention: 47890 Città di San Marino · 47891 Dogana (Serravalle) · 47892
Acquaviva · 47893 Borgo Maggiore · 47894 Chiesanuova · 47895 Domagnano · 47896
Faetano · 47897 Fiorentino · 47898 Montegiardino · 47899 Serravalle (frazioni
share their castello's code, e.g. Rovereta under 47891). Regex
`(?<postal_code>4789\d)`.

## 5. Locality — a castello (municipality) or frazione; no province
The nine castelli: Città di San Marino (capital), Serravalle, Borgo Maggiore,
Domagnano, Fiorentino, Acquaviva, Faetano, Chiesanuova, Montegiardino; plus
frazioni (Dogana, Rovereta, Falciano, Cailungo, Gualdicciola, Murata). San
Marino is NOT an Italian province, so there is no province `sigla` field. A
trailing country marker `(RSM)` / `Rep. San Marino` / `RSM` / `SM` /
`Repubblica di San Marino` is consumed; normalized `country = SM`.
NOTE: the bare string "San Marino" is treated as a CITY (the capital), never as
the country name, so `47890 Città di San Marino` keeps its full city.

## 6. Secondary units & PO boxes
Units (Italian): Interno (Int.), Scala (Sc.), Piano, Palazzo (Pal.),
Appartamento (App.). PO box: **Casella Postale** (C.P./CP) — box number is not a
house number.

## 7. Failure modes (parser MUST handle)
1. `(RSM)` trailing the locality (`47893 Borgo Maggiore (RSM)`) — consumed, not
   part of the city.
2. The bare capital name `San Marino` / `Città di San Marino` as CITY, not
   country (would otherwise be stolen by a trailing-country match).
3. `snc` (no civico) — must not leave the CAP as the civico.
4. A no-number street line (`Via del Serrone, 47892 Acquaviva`) — the 4-digit
   civico cap prevents the 5-digit CAP being grabbed as the house number.
5. Civico suffixes: glued letter (`25A`), slash (`30/A`).
6. Characteristic `Contrada` type and article/particle names (`alla Rocca`,
   `della Libertà`, `del Collegio`, `dei Magazzeni`, `delle Foibe`).
7. Elided `Ca'` (`Via Ca' dei Lunghi`) and `Sant'` (`P.za Sant'Agata`) — the
   apostrophe stays in the name.
8. Date-word street names (`Via Ventotto Luglio`, `Via Tre Settembre`,
   `Via Cinque Febbraio`) — the words are the name, not a number.
9. Abbreviated types (`V.le`, `P.za`) kept verbatim.
10. Locality-only lines (`47890 San Marino`, `47899 Serravalle`) and
    frazione localities (`47891 Dogana`, `47891 Rovereta`).
11. Country markers `RSM` / `SM` / `Rep. San Marino` after a comma.

## 8. Known modeling limits (marked __skip in samples)
- A leading landmark/building before a typed street (`Palazzo Pubblico, Piazza
  della Libertà, 47890 San Marino`): the building grammar is not enabled for SM.
