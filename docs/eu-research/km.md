# Comoros (KM, Comores) — address research

- **Language / script:** French and Arabic are official (Comorian/Shikomori
  spoken). International mail is written in Latin/French; Arabic-script forms are
  out of scope (`__skip` policy).
- **Order:** house NUMBER first (when present), then a PREFIX voie type + name
  ("10 Avenue de la Corniche"). Numbers frequently ABSENT.
- **Voie types:** Avenue/Av, Boulevard/Bd, Rue, Route, Place, Impasse,
  Rond-point, Carrefour, Passage, Allée, Cité, Voie. Type echoed verbatim.
- **Postcode:** NONE. Never-matching sentinel in the postal slot.
- **PO box:** DOMINANT — "BP" / "B.P." / "Boîte Postale" ("B.P. 1234, Moroni");
  parsed as a secondary unit.
- **Regions (`state`):** the 3 island-regions — Grande Comore (Ngazidja),
  Anjouan (Ndzuwani), Mohéli (Mwali). Rarely written → optional. The islands are
  naturally DISJOINT from the routing cities (Moroni, Mutsamudu, Fomboni, Domoni,
  Mitsamiouli, Ouani, Sima, Foumbouni, Mbéni), so no under-match risk. Both the
  French and Comorian spellings are accepted; the two-word "Grande Comore"
  escapes its space as `\s+`. Region echoed as written.
- **Modelling notes / skips:** quartier→city chains ("…, Coulée, Moroni"),
  leading secondary units, and landmark/relative addresses ("Près de la Grande
  Mosquée") are out of scope (`__skip`); Arabic-script variants are not modelled.
- **Sources:** UPU addressing notes for the Comoros; Société Nationale des Postes
  et des Services Financiers (SNPSF) conventions; ISO 3166-2:KM island list;
  OpenStreetMap Moroni street data.
