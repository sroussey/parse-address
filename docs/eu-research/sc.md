# Seychelles (SC) Street Address Research

Research for the config-driven Intl address parser. Seychelles is an English-
speaking (also French/Seselwa Creole) Indian Ocean archipelago, a former British
colony, with a British-derived number-first, trailing-type grammar (same skeleton
as GB / SH / Fiji). Focus: no postcode system, district-as-city, island-as-state.

---

## 1. Canonical address order

Number (often absent) FIRST, then the street name + trailing TYPE, then the
administrative DISTRICT (routing locality), then the main ISLAND:

```
[Number] [Street] [Type]      <- Revolution Avenue / 5 Palm Street
[District]                    <- Victoria, Beau Vallon, Anse Royale
[Island]                      <- Mahé, Praslin, La Digue
SEYCHELLES
```

Single-line form used by parsers:

```
Revolution Avenue, Victoria, Mahé
5 Palm Street, Victoria, Mahé
Latanier Road, Mont Fleuri, Mahé
```

So: **number first, suffix type, NO postcode**, the routing city is the district
and the **island plays the role of `state`**. The house number is frequently
absent (houses are named or use the district only).

## 2. Postcode

- **Seychelles has NO postal-code system.** Mail is routed by district + island.
- The postal slot is therefore a never-matching sentinel
  `(?<postal_code>(?!x)x)`, so the place tail is always parsed without a code.

## 3. Locality (city) and region (state)

- **District = `city`.** There are 26/27 administrative districts, most on Mahé:
  Victoria (capital), Beau Vallon, Anse Royale, Anse aux Pins, Bel Air,
  Bel Ombre, Cascade, Glacis, Mont Fleuri, Mont Buxton, Roche Caiman,
  English River, Saint Louis, Takamaka, Baie Lazare, Pointe Larue, Les Mamelles,
  Plaisance, Au Cap; on Praslin: Grand Anse, Baie Sainte Anne; on La Digue:
  La Passe.
- **Island = `state`.** Restricted to the inhabited islands `Mahé | Praslin |
  La Digue | Silhouette` (accepting "Mahe" without the accent). `countyPattern`
  is limited to this list so an ordinary district is never read as an island and
  the country name never lands in `state`; `regionMap` canonicalises the display
  (Mahe -> Mahé).

## 4. Street types

Full English words and Royal-Mail-style abbreviations, echoed verbatim
(`normalizeTypeCase: false`): Street, Road, Avenue, Lane, Drive, Close, Court,
Place, Crescent, Terrace, Boulevard, Way, Highway, Path, Hill, Rise, Walk,
Steps; St, Rd, Ave, Av, Dr, Cres, Hwy, Blvd. Victoria examples: Revolution
Avenue, Albert Street, Francis Rachel Street, Independence Avenue, Market Street,
Manglier Street, Huteau Lane, Latanier Road, State House Avenue.

## 5. PO Box and buildings

- PO boxes are very common (Victoria GPO): "P.O. Box 56, Victoria, Mahé".
- Corporate/registered offices lead with a named building
  ("Caravelle House, Manglier Street, Victoria, Mahé"), so `buildingKeywords`
  (House, Building, Complex, Chambers, Centre, Tower, Arcade, Mall) is enabled.

## 6. Parser convention / __skip

A bare "district, island" line with **no street token** has no postcode to anchor
a place-only parse, and with the postcode last a number-less locality is
indistinguishable from a street; those lines are marked `__skip` in the corpus
(same convention as the Caribbean / Pacific siblings). Addressable lines carry a
street, a building+street, or a PO box.

## 7. Sources

SeyPost; Universal Postal Union addressing note (Seychelles); Wikipedia
"Districts of Seychelles"; general knowledge of Victoria street names.
