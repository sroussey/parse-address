# Central African Republic (CF) — address research

- **Language / script:** French (and Sango). Addresses in Latin/French.
- **Order:** house NUMBER first (when present), then a PREFIX voie type + name
  ("10 Avenue des Martyrs"). Numbers frequently ABSENT.
- **Voie types:** Avenue/Av, Boulevard/Bd, Rue, Place, Impasse, Route,
  Rond-point, Carrefour, Passage, Allée, Cité, Voie. Type echoed verbatim.
- **Postcode:** NONE. Never-matching sentinel in the postal slot.
- **PO box:** DOMINANT — "BP" / "B.P." / "Boîte Postale" ("B.P. 1344, Bangui");
  parsed as a secondary unit. Bangui carries the vast majority of addressable mail.
- **Regions (`state`):** the 16 prefectures (plus the autonomous commune of
  Bangui). Rarely written → optional. "Bangui" is the dominant routing city, so
  it is deliberately EXCLUDED from the `state` list (a region token equal to a
  city would make the non-greedy street under-match). Kept, disjoint from the
  corpus cities: Bamingui-Bangoran, Basse-Kotto, Haute-Kotto, Haut-Mbomou,
  Mambéré-Kadéï, Nana-Grébizi, Nana-Mambéré, Ombella-M'Poko, Ouham-Pendé,
  Sangha-Mbaéré, Kémo, Lobaye, Mbomou, Ouaka, Ouham, Vakaga (each prefecture's
  chief town has a different name — Ouham↔Bossangoa, Ouaka↔Bambari, etc.).
  Compound names carry hyphens / an apostrophe (M'Poko) and are echoed as written.
- **Modelling notes / skips:** quartier→city chains ("…, Sica 1, Bangui"),
  leading secondary units, and landmark/relative addresses are out of scope
  (`__skip`).
- **Sources:** UPU addressing notes for the CAR; Office National des Postes
  conventions; ISO 3166-2:CF prefecture list; OpenStreetMap Bangui street data.
