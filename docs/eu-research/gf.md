# French Guiana (GF) — address research

**Grammar = FR (metropolitan France) grammar, verbatim.** French Guiana is a French
overseas department/collectivity that uses the standard La Poste address format.
The config is an exact clone of `src/maps/fr/config.ts`; only
`code`/`country`/`countryNames`/`postalPattern` differ.

- **Order:** house NUMBER first, then PREFIX voie type + name
  (`12 Rue Schoelcher`).
- **Repetition index:** `bis` / `ter` / `quater` / single letter after the number.
- **Postcode:** 5 digits, prefix `973` (pattern `973\d\d`), written
  BEFORE the commune. `CEDEX nn` markers after the city are dropped.
- **country field:** `GF`.
- **No region/state** — `countyPattern` set to never-match `(?!x)x`.
- **Sample localities:** Cayenne, Kourou, Matoury, Saint-Laurent-du-Maroni, Rémire-Montjoly, Maripasoula.

Everything else (voie type vocabulary, `bis/ter/quater`, `d'`/`l'` elision, PO box
`BP`/`CS`, secondary units `Appartement`/`Bât`/`Étage`, `normalizeTypeCase:false`)
is copied unchanged from FR.
