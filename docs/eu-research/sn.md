# Senegal (SN) Postal Address Research — French romanized form

Scope: parse/normalize Senegalese street addresses in the **French** convention
(Senegal's official language and its postal working language). Sources: La Poste
du Sénégal (national operator), UPU addressing files (SEN), PostGrid / Pingen /
Umbrex Senegal address guides, libpostal.

Sources:
- UPU — Sénégal, code postal type & place: https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/senFr.pdf
- PostGrid — Senegal address format: https://www.postgrid.com/global-address-format/senegal-address-format/
- Pingen — address example Senegal: https://www.pingen.com/en/address-formats/address-example-senegal
- Wikipedia — La Poste (Senegal): https://en.wikipedia.org/wiki/La_Poste_(Senegal)
- UPU — Senegal (SEN) postcode file: https://youbianku.com/files/upu/SEN.pdf

---

## 1. Order — NUMBER FIRST (when numbered); PO BOX DOMINANT

Senegal uses the French civic grammar (**number before type + name**), but the
single most important fact for a parser is that **most mail is delivered to a
Boîte Postale (BP), not to a street** — street numbering is sparse and delivery
to the door is limited. The dominant real-world line is:

```
BP 3225                <- Boîte Postale + number (dominant)
Dakar                  <- city
SÉNÉGAL                <- country (international only)
```

Street form (secondary):
```
10 Rue Paul Holle      <- number, type (prefix), name
Médina                 <- quartier — NOT a routing field
Dakar                  <- city (rarely a postcode before it)
```

## 2. Street type (type de voie) — leading word, kept verbatim

Prefix type after the number: **Rue, Avenue (Av), Boulevard (Bd/Bld), Impasse
(Imp), Place, Allée, Résidence (Rés), Route (Rte), Rond-point, Passage**.
Particles (`de`, `du`, `de la`, `des`, `d'`) and the Arabic article `El` stay
with the NAME. Colonial-era French names dominate central Dakar (Rue Carnot,
Avenue Faidherbe, Rue Félix Faure) alongside Senegalese names (Avenue Cheikh
Anta Diop, Avenue Léopold Sédar Senghor, Avenue Lamine Guèye).

## 3. Postcode — usually ABSENT; a 5-digit code exists but is rarely written

- Senegal introduced a **5-digit** postcode (first digit = routing region, next
  two = office, last two = delivery area) around 2018, but it is **rarely used**
  on everyday mail. Most addresses have **no postcode at all**.
- When present it precedes the city ("12500 Dakar"), the French model. It is
  therefore modelled as **optional, before-city**.

## 4. Quartier (neighbourhood) — consumed, not a field

A Dakar quartier commonly sits between the street and the city: "Médina",
"Plateau", "Fann", "Point E", "Mermoz", "Sicap Liberté", "Sacré-Cœur", "Grand
Yoff", "Almadies", "HLM", "Colobane". It carries no output field, so a
**recognised** quartier is consumed/dropped (an enumerated `areaNames` set of
the major Dakar-area neighbourhoods). Unknown / numbered sub-quartiers (e.g.
"Sacré-Cœur 3") are a failure mode.

## 5. Region — none in the address

Senegal's 14 régions are not written in a postal address; no state field.

## 6. Secondary units (compléments)

`Appartement` (Appt/Apt/App), `Étage`, `Immeuble` (Imm), `Villa`, `Bureau`.
A leading "Villa NNN" dwelling number with no street is a documented failure mode.

## 7. PO box — Boîte Postale (BP), the dominant form

`BP` / `B.P` / `Boîte Postale` + number, e.g. `BP 3225, Dakar`. Box number is
NOT a house number. Normalized to `BP`. This is the workhorse of Senegalese
addressing.

## 8. Failure modes (parser MUST handle / documents its limits)

1. **PO box dominant, no postcode** — "BP 3225, Dakar", "BP 45, Saint-Louis":
   box number not a house number, city follows with no postcode.
2. **Quartier drop without a postcode anchor** — "10 Rue Paul Holle, Médina,
   Dakar": "Médina" consumed, street "Paul Holle", city "Dakar".
3. **Two-word quartier** — "Point E", "Sicap Liberté", "Grand Yoff" dropped whole.
4. **Multiword names kept whole** — "Cheikh Anta Diop", "Léopold Sédar Senghor",
   "Amadou Assane Ndoye": never truncated to the first word.
5. **Rare 5-digit postcode** — "12 Avenue Cheikh Anta Diop, 12500 Dakar":
   optional postcode before city.
6. **Unnumbered street** — "Rue de Thiong, Plateau, Dakar": no house number.
7. **Elision / particles** — "1 Rue de Thann", "7 Rue de la Corniche",
   "de Bayeux".
8. **Accents & hyphen names** — "Félix Faure", "Béranger Féraud", "Saint-Michel".
9. **Secondary units** — "Appartement 3" (+ quartier).
10. **Spelled-out box** — "Boîte Postale 5000, Dakar" normalized to BP.
11. **Numbered sub-quartier** ("Sacré-Cœur 3") — a digit breaks the locality;
    not dropped (failure mode).
12. **Unenumerated quartier** ("Cité Fadia") — not dropped (failure mode).
13. **Quartier between the box and the city** ("BP 3225, Fann Résidence, Dakar")
    — not consumed by the PO-box grammar (failure mode).
14. **Leading "Villa NNN"** dwelling number with no street — not modelled.
