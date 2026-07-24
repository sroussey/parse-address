# Chad (TD, Tchad) — address research

- **Language / script:** French AND Arabic are official. International mail is
  written in Latin/French; Arabic-script forms are out of scope (`__skip` policy).
- **Order:** house NUMBER first (when present), then a PREFIX voie type + name
  ("10 Avenue Charles de Gaulle"). Numbers frequently ABSENT.
- **Voie types:** Avenue/Av, Boulevard/Bd, Rue, Place, Impasse, Route,
  Rond-point, Carrefour, Passage, Allée, Cité, Voie. Type echoed verbatim.
- **Postcode:** NONE. Never-matching sentinel in the postal slot.
- **PO box:** DOMINANT — "BP" / "B.P." / "Boîte Postale" ("B.P. 456,
  N'Djaména"); parsed as a secondary unit. Note the apostrophe in the capital's
  name "N'Djaména", which the city slot preserves.
- **Regions (`state`):** the 23 provinces. Rarely written → optional. The
  province capitals carry different names than the provinces (Moundou↔Logone
  Occidental, Sarh↔Moyen-Chari, Abéché↔Ouaddaï, Bongor↔Mayo-Kebbi Est,
  Mongo↔Guéra …), so the list stays disjoint from the routing cities. Included:
  Barh-el-Gazel, Chari-Baguirmi, Ennedi-Est, Ennedi-Ouest, Hadjer-Lamis, Logone
  Occidental, Logone Oriental, Mayo-Kebbi Est, Mayo-Kebbi Ouest, Moyen-Chari,
  Wadi Fira, Ouaddaï, Tandjilé, Batha, Borkou, Guéra, Kanem, Mandoul, Salamat,
  Sila, Tibesti. Two-word names escape their space as `\s+`; region echoed as
  written. ("Lac" is omitted to avoid a short-token collision.)
- **Modelling notes / skips:** quartier→city chains ("…, Chagoua, N'Djaména"),
  leading secondary units, and landmark/relative addresses are out of scope
  (`__skip`); Arabic-script variants are not modelled.
- **Sources:** UPU addressing notes for Chad; Société des Postes conventions;
  ISO 3166-2:TD province list; OpenStreetMap N'Djaména street data.
