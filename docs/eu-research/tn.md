# Tunisia (TN) Postal Address Research — French romanized form

Scope: parse/normalize Tunisian street addresses in the **French romanized**
convention. Arabic-script addresses are out of scope (a failure mode). Sources:
La Poste Tunisienne (national operator), UPU addressing files, Wikipedia
"Postal codes in Tunisia" / "La Poste Tunisienne", PostGrid / Smarty / Umbrex
Tunisia address guides, libpostal.

Sources:
- Wikipedia — Postal codes in Tunisia: https://en.wikipedia.org/wiki/Postal_codes_in_Tunisia
- Wikipedia — La Poste Tunisienne: https://en.wikipedia.org/wiki/La_Poste_Tunisienne
- PostGrid — Tunisia address format: https://www.postgrid.com/global-address-format/tunisia-address-format/
- Smarty — Tunisia address format examples: https://www.smarty.com/global-address-formatting/tunisia-address-format-examples
- Umbrex — addressing a letter to Tunisia: https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-tunisia/

---

## 1. Order — NUMBER FIRST, French convention

Tunisia (a former French protectorate) uses the French civic grammar: the
**house number precedes the voie type + name**.

```
12 Rue du Caire       <- number, type (prefix), name
1002 Tunis            <- 4-digit postcode, then city
TUNISIE               <- country (international mail only)
```

Single-string join: `12 Rue du Caire, 1002 Tunis`.

Parse order: `[number] [type] [name]`, then `[postcode(4)] [city] [CEDEX?]`.

## 2. Street type (type de voie) — leading word, kept verbatim

Prefix type after the number. Common set (verbatim, abbreviations tolerated):
**Rue, Avenue (Av), Boulevard (Bd/Bld), Impasse (Imp), Place, Passage, Allée,
Résidence (Rés), Route (Rte), Rond-point**. Distinctively Tunisian is **Cité**
— a planned residential estate ("Cité Ennasr", "Cité El Khadra", "Cité
Olympique"): here Cité is the leading type and the estate name follows.
Particles (`de`, `du`, `de la`, `des`, `d'`) and the Arabic article `El` stay
with the NAME.

## 3. Postcode (code postal) — exactly 4 digits, BEFORE the city

- **Exactly 4 numeric digits.** First two digits = governorate, last two =
  delivery office. Leading zeros are significant (rare; most begin 1–9).
  Examples: 1000/1002 Tunis, 2037 Ariana, 3000 Sfax, 4000 Sousse, 5000
  Monastir, 7000 Bizerte, 8000 Nabeul, 2000 Le Bardo, 2026 La Marsa.
- Written **BEFORE the city** on the last line ("1002 Tunis"), the French model.
  (Some international guides show the reversed "TUNIS 1002"; that city-first
  order is a documented failure mode.)

## 4. CEDEX

A bulk-mail delivery marker after the city ("1080 Tunis Cedex"), optionally with
a number. It is not part of the city name and is stripped (citySuffix).

## 5. Region — none in the address

Tunisia's 24 governorates are not written as a separate field in a postal
address (the postcode encodes the governorate). No state/province field.

## 6. Secondary units (compléments)

`Appartement` (Appt/Apt/App), `Étage` (floor), `Immeuble` (Imm), `Bloc`,
`Escalier` (Esc), `Bureau`. Sit after the street, before the place tail. Note:
in `Cité` estates a deeper "Bloc N, Appartement M" chain is common and only the
outermost unit is modelled (a failure mode).

## 7. PO box — Boîte Postale (BP)

`BP` / `B.P` / `Boîte Postale` + number, e.g. `BP 350, 1080 Tunis Cedex`. Box
number is not a house number. Normalized to `BP`.

## 8. Failure modes (parser MUST handle / documents its limits)

1. **4-digit postcode before city** — "12 Rue du Caire, 1002 Tunis": the 4-digit
   run is the postcode, not a house number, and it precedes the city.
2. **Cité estate type** — "Cité Ennasr, 2037 Ariana", "Cité El Khadra, 1003
   Tunis": Cité is the leading type; the estate name is the street.
3. **CEDEX stripped** — "BP 350, 1080 Tunis Cedex" → city "Tunis".
4. **PO box (BP)** — box number not a house number; "Boîte Postale 100…"
   normalized to BP.
5. **Elision / particles** — "3 Rue d'Angleterre", "14 Avenue de la Liberté",
   "2 Avenue de l'Indépendance".
6. **Date/number names** — "20 Bd du 7 Novembre", "1 Rue du 18 Janvier 1952",
   "12 Bd 9 Avril 1938": embedded digits are part of the name, not the number.
7. **El article in name** — "7 Rue El Jazira".
8. **Multiword personal names** — "5 Avenue Habib Bourguiba", "Charles de
   Gaulle", "Pierre de Coubertin": kept whole.
9. **Regnal numeral** — "1 Avenue Mohamed V".
10. **Secondary units** — "Appartement 4", "Étage 2", "Immeuble A".
11. **Cities with a leading article** — "Le Bardo", "La Marsa": kept whole.
12. **Arabic-script address** — out of scope; documented failure mode.
13. **city-then-postcode** ("Tunis 1002") — not modelled.
14. **Named districts before the city** ("Les Berges du Lac") — not modelled
    (before-city single-locality).
