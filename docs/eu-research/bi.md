# Burundi (BI) — address research

- **Language / script:** French (administrative) and Kirundi. Addresses in
  Latin/French.
- **Order:** house NUMBER first (when present), then a PREFIX voie type + name
  ("10 Avenue de l'Uprona"). Numbers frequently ABSENT.
- **Voie types:** Avenue/Av, Boulevard/Bd, Chaussée, Rue, Place, Impasse, Route,
  Rond-point, Allée, Carrefour, Passage, Voie. Bujumbura's main axis is the
  "Chaussée Prince Louis Rwagasore", so Chaussée is included. Type echoed verbatim.
- **Postcode:** NONE (no operational postal-code system). The postal slot uses a
  never-matching sentinel so the city is read directly after the street.
- **PO box:** DOMINANT delivery form — "BP" / "B.P." / "Boîte Postale"
  ("B.P. 1450, Bujumbura"); parsed as a secondary unit.
- **Regions (`state`):** the 18 provinces. Rarely written → optional. Most
  province names coincide with their capital city (Gitega, Ngozi, Muyinga,
  Ruyigi, Rumonge, Bururi …), which would make a region token equal to a routing
  city and force the non-greedy street to under-match. The `state` list is
  therefore curated DISJOINT from the corpus cities: the provinces routed to as
  cities are excluded, keeping "Bujumbura Mairie / Bujumbura Rural" (safe
  supersets of the city token "Bujumbura") plus Bubanza, Bururi, Cankuzo,
  Cibitoke, Karuzi, Kayanza, Kirundo, Makamba, Muramvya, Mwaro, Rutana. Region
  echoed as written.
- **Modelling notes / skips:** quartier→city chains ("…, Rohero, Bujumbura"),
  leading secondary units, and landmark/relative addresses are out of scope
  (`__skip`).
- **Sources:** UPU addressing notes for Burundi; Régie Nationale des Postes
  (RNP) conventions; ISO 3166-2:BI province list; OpenStreetMap Bujumbura /
  Gitega street data.
