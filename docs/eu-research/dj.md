# Djibouti (DJ) — address research

- **Language / script:** French and Arabic are official (Somali/Afar spoken).
  International mail is written in Latin/French; Arabic-script forms are out of
  scope (`__skip` policy).
- **Order:** house NUMBER first (when present), then a PREFIX voie type + name
  ("10 Avenue Georges Clemenceau"). Numbers frequently ABSENT. Djibouti City's
  European-named streets dominate (de Rome, de Genève, de Venise, Clemenceau,
  Joffre, Place Menelik).
- **Voie types:** Avenue/Av, Boulevard/Bd, Rue, Place, Impasse, Route,
  Rond-point, Carrefour, Passage, Allée, Cité, Voie. Type echoed verbatim.
- **Postcode:** NONE. Never-matching sentinel in the postal slot.
- **PO box:** DOMINANT — "BP" / "B.P." / "Boîte Postale" ("B.P. 1234,
  Djibouti"); parsed as a secondary unit.
- **Regions (`state`):** the 6 regions (Djibouti, Ali Sabieh, Arta, Dikhil,
  Obock, Tadjourah). Five share a name with their main town, and "Djibouti" is
  both the dominant routing city AND the country name — any of these as a region
  token would make the non-greedy street under-match (and "Djibouti" as a
  trailing country token would truncate a real "…, Djibouti" city line). The
  `state` list is therefore curated DISJOINT: only "Arta" (never used here as a
  routing-city token) is kept, demonstrated with sub-localities inside the Arta
  region ("Damerjog, Arta"; "Loyada, Arta"; "We'a, Arta"; "Doraleh, Arta").
  Correspondingly, "Djibouti" is removed from the trailing-country vocabulary
  (only the codes DJI/DJ remain). Ali Sabieh, Dikhil, Tadjourah, Obock are kept
  as CITIES, not regions.
- **Modelling notes / skips:** quartier→city chains ("…, Plateau du Serpent,
  Djibouti"), leading secondary units, and landmark/relative addresses are out of
  scope (`__skip`); Arabic-script variants are not modelled.
- **Sources:** UPU addressing notes for Djibouti; La Poste de Djibouti
  conventions; ISO 3166-2:DJ region list; OpenStreetMap Djibouti City street data.
