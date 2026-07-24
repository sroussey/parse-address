# Haiti (HT) — address research

- **Language / script:** French (and Haitian Creole). Addresses written in Latin/French.
- **Order:** house NUMBER first (when present), then a PREFIX voie type + name
  ("10 Rue Pavée"). Numbers are frequently ABSENT — a bare "Rue Capois" is normal.
- **Voie types:** Rue, Avenue/Av, Boulevard/Bd, Route, Impasse, Ruelle, Chemin,
  Place, Allée, Carrefour, Rond-point, Cité, Voie. Type echoed verbatim
  (`normalizeTypeCase: false`). Numbered street names occur ("Rue 13" in
  Cap-Haïtien), so the number-first grammar allows digits inside the name.
- **Postcode:** OPTIONAL 4-digit code, usually written with an "HT" prefix before
  the city ("HT6110 Port-au-Prince") but also as a bare 4-digit ("6110 …"). Most
  addresses carry none. Modelled as `postalPattern: HT\d{4}|\d{4}`, and the whole
  postal slot is optional (before-city).
- **PO box:** "BP" / "B.P." / "Boîte Postale" is a common delivery form
  ("BP 1234, Port-au-Prince"); parsed as a secondary unit (BP + number).
- **Regions (`state`):** the 10 departments (Ouest, Sud-Est, Nord, Nord-Est,
  Artibonite, Centre, Sud, Grand'Anse, Nord-Ouest, Nippes). Rarely written →
  optional. Curated disjoint from the routing cities (Port-au-Prince, Cap-Haïtien,
  Delmas, Pétion-Ville, Jacmel, Gonaïves, Hinche, Jérémie, Les Cayes …), so no
  department name coincides with a city and the non-greedy street cannot
  under-match. Region echoed as written (no code map).
- **Modelling notes / skips:** a quartier→city chain ("…, Bourdon, Pétion-Ville")
  is not isolated by the single city slot; a numbered locality with a digit
  ("Delmas 33") does not fit the digit-free city slot; relative/landmark
  addresses ("En face de …") and a leading secondary unit are out of scope. These
  are marked `__skip`.
- **Sources:** UPU S42 / Universal Postal Union addressing notes for Haiti;
  OFATMA/Poste d'Haïti conventions; exampleaddress.com Haiti corpus; OpenStreetMap
  Port-au-Prince / Cap-Haïtien street data.
