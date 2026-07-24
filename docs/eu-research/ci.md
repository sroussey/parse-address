# Côte d'Ivoire / Ivory Coast (CI) Postal Address Research — French romanized form

Scope: parse/normalize Ivorian addresses in **French** (the official language).
Sources: La Poste de Côte d'Ivoire (national operator), UPU addressing files
(CIV), PostGrid / Smarty / Pingen / Umbrex Ivory Coast address guides, CNN 2017
"Ivory Coast street addresses are now made of three words" (context on the near-
absence of formal street numbering), libpostal.

Sources:
- UPU — Côte d'Ivoire (CIV) address format: https://youbianku.com/files/upu/CIV.pdf
- PostGrid — Ivory Coast address format: https://www.postgrid.com/global-address-format/ivory-coast-address-format/
- Smarty — Ivory Coast address format example: https://www.smarty.com/global-address-formatting/ivory-coast-address-format-example
- Pingen — address example Ivory Coast: https://www.pingen.com/en/address-formats/address-example-ivory-coast
- Umbrex — addressing a letter to Ivory Coast: https://umbrex.com/resources/how-to-address-an-international-letter-to-any-country/how-to-address-an-international-letter-to-ivory-coast/

---

## 1. Order — the PO BOX form is DOMINANT

Côte d'Ivoire has almost no door-to-door delivery; the overwhelmingly dominant
address is a **district-prefixed Boîte Postale**:

```
01 BP 1234 Abidjan 01
└┬┘ ┬  └┬─┘ └──┬──┘ ┬
 │  │   │      │    └ district code, repeated after the city (the routing code)
 │  │   │      └ city (Abidjan)
 │  │   └ box number
 │  └ "BP" (Boîte Postale)
 └ postal district (Abidjan zones 01…26; other cities have their own)
```

Real forms: `06 BP 37 Abidjan 06`, `17 BP 105 Abidjan 17`, `08 BP 2081 Abidjan
08`. Outside Abidjan a bare `BP 1234, Yamoussoukro` is used. Street addresses
exist but are secondary and often unnumbered.

Street form (secondary):
```
7 Rue des Jardins      <- number (often absent), type (prefix), name
Cocody                 <- commune (kept as the city — see §4)
Abidjan                <- metropolis marker (consumed)
```

## 2. Street type (type de voie) — leading word, kept verbatim

Prefix type: **Rue, Avenue (Av), Boulevard (Bd/Bld), Impasse (Imp), Place,
Allée, Route (Rte), Rond-point**. Abidjan streets are frequently **numbered or
coded** rather than named: "Rue 12", "Rue 38", "Rue A43" — here the code is the
street name. Particles (`de`, `du`, `de la`, `des`, `d'`) stay with the name;
colonial French names (Boulevard de Marseille, Avenue Franchet d'Esperey) and
Ivorian names (Boulevard Nangui Abrogoua, Avenue Houphouët-Boigny) both appear.

## 3. Postcode — a two-digit district, AFTER the city

There is **no 5-digit postcode**. The routing token is the **two-digit district**
written after the city in the box form ("Abidjan 01"), and it equals the leading
district on the "NN BP" box. Modelled as an **after-city two-digit postcode**.
Street addresses usually carry no district at all.

## 4. Commune → city; "Abidjan" is a metropolis marker

Abidjan is split into **communes** (Cocody, Plateau, Yopougon, Treichville,
Marcory, Adjamé, Abobo, Koumassi, Port-Bouët, Attécoubé, Bingerville, plus
sub-areas Deux Plateaux, Riviera, Angré). In a street address the commune is the
meaningful locality and is kept as the **city**; the trailing metropolis marker
**"Abidjan" is consumed** (a citySuffix) and not emitted. A bare commune with no
"Abidjan" is likewise the city ("Rue du Commerce, Plateau" → city "Plateau"). In
the box form there is no commune, so the city IS "Abidjan" and the two-digit
district is the postcode.

## 5. Region — none in the address

Ivory Coast's districts/régions are not written as a separate field; no state.

## 6. Secondary units (compléments)

`Appartement` (Appt/Apt/App), `Étage`, `Immeuble` (Imm), `Villa`, `Lot`,
`Bureau`. Rare in practice (the box form dominates).

## 7. PO box — Boîte Postale (BP), district-prefixed

Two shapes: **district-prefixed** "NN BP <num>" (Abidjan, districts 01–26; the
config enumerates 01–30 with headroom) and **bare** "BP <num>" (other cities).
"Boîte Postale" spelled out normalizes to BP. The leading "NN" is the postal
district; the box number is not a house number.

## 8. Failure modes (parser MUST handle / documents its limits)

1. **District-prefixed box (dominant)** — "01 BP 1234 Abidjan 01": "01 BP" is the
   box marker, "1234" the box, city "Abidjan", "01" the district postcode.
2. **Small/large box numbers** — "06 BP 37 …", "08 BP 2081 …": any box length.
3. **Comma or space separators** — "01 BP 1234, Abidjan 01" and the space form
   both parse.
4. **Bare BP outside Abidjan** — "BP 1234, Yamoussoukro", "BP 45, Bouaké":
   no district, no postcode.
5. **Commune → city** — "7 Rue des Jardins, Cocody, Abidjan" → city "Cocody",
   "Abidjan" consumed; street "des Jardins".
6. **Bare commune → city** — "Rue du Commerce, Plateau" → city "Plateau".
7. **Two-word commune** — "Deux Plateaux", "Riviera Golf" kept whole as the city.
8. **Numbered / coded streets** — "Rue 12", "Rue 38", "Rue A43": the code is the
   street name, not a house number.
9. **Multiword / elision names** — "Franchet d'Esperey", "Valéry Giscard
   d'Estaing", "Houphouët-Boigny", "du Général de Gaulle" kept whole.
10. **Unnumbered street** — most street forms have no house number.
11. **Spelled-out box** — "Boîte Postale 500, San-Pédro" normalized to BP.
12. **Numbered commune** ("Zone 3" / "Zone 4") — a digit collides with the
    digit-excluded city and the two-digit district postcode; not modelled.
13. **Box-LAST full form** ("Rue X, Cocody, Abidjan 01 BP 1234") — the box after
    the city is not modelled (box-first is dominant).
14. **Bare "Commune, Abidjan"** with no street — parses the commune as a street
    name, not a city (failure mode).
15. **Non-Latin script** — out of scope; documented failure mode.
