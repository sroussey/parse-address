# Polynésie française (PF) — address research

**Grammar = FR (metropolitan France) grammar, verbatim.** Polynésie française is a French
overseas department/collectivity that uses the standard La Poste address format.
The config is an exact clone of `src/maps/fr/config.ts`; only
`code`/`country`/`countryNames`/`postalPattern` differ.

- **Order:** house NUMBER first, then PREFIX voie type + name
  (`12 Rue Schoelcher`).
- **Repetition index:** `bis` / `ter` / `quater` / single letter after the number.
- **Postcode:** 5 digits, prefix `987` (pattern `987\d\d`), written
  BEFORE the commune. `CEDEX nn` markers after the city are dropped.
- **country field:** `PF`.
- **No region/state** — `countyPattern` set to never-match `(?!x)x`.
- **Sample localities:** Papeete, Faaa, Punaauia, Pirae, Mahina, Uturoa.

Everything else (voie type vocabulary, `bis/ter/quater`, `d'`/`l'` elision, PO box
`BP`/`CS`, secondary units `Appartement`/`Bât`/`Étage`, `normalizeTypeCase:false`)
is copied unchanged from FR.
