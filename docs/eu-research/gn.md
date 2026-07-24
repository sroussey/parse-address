# Guinea (GN, Guinée-Conakry) — address research

- **Language / script:** French. Addresses in Latin/French.
- **Order:** house NUMBER first (when present), then a PREFIX voie type + name
  ("10 Avenue de la République"). Numbers frequently ABSENT.
- **Voie types:** Avenue/Av, Boulevard/Bd, Rue, Route, Place, Impasse,
  Rond-point, Carrefour, Passage, Allée, Cité, Voie. Type echoed verbatim.
  Conakry streets are often written with a coded name ("Rue KA 020", "Rue DI
  030"); the number-first grammar allows digits inside the name so these stay
  intact.
- **Postcode:** NONE. Never-matching sentinel in the postal slot.
- **PO box:** DOMINANT — "BP" / "B.P." / "Boîte Postale" ("B.P. 1234, Conakry");
  parsed as a secondary unit.
- **Regions (`state`):** the 8 administrative regions (Boké, Conakry, Faranah,
  Kankan, Kindia, Labé, Mamou, Nzérékoré). ALL eight share a name with a major
  city, so any region token equal to a routing city would make the non-greedy
  street under-match. The `state` list is therefore curated DISJOINT from the
  corpus cities: only Faranah and Mamou (never used here as a routing-city token)
  are kept, each demonstrated with a sub-locality inside that region
  ("Kissidougou, Faranah"; "Dalaba, Mamou"; "Pita, Mamou"). Cities include
  Conakry and its communes (Kaloum, Dixinn, Matam, Ratoma), Kindia, Kankan,
  Labé, Nzérékoré, Boké, Kamsar, Siguiri. Region echoed as written.
- **Modelling notes / skips:** multi-locality chains ("…, Almamya, Kaloum,
  Conakry"), leading secondary units, and landmark/relative addresses ("Près du
  marché Madina") are out of scope (`__skip`).
- **Sources:** UPU addressing notes for Guinea; Office de la Poste Guinéenne
  conventions; ISO 3166-2:GN region list; OpenStreetMap Conakry street data.
