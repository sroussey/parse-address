# Mayotte (YT) — address research

**Grammar = FR (metropolitan France) grammar, verbatim.** Mayotte is a French
overseas department/collectivity that uses the standard La Poste address format.
The config is an exact clone of `src/maps/fr/config.ts`; only
`code`/`country`/`countryNames`/`postalPattern` differ.

- **Order:** house NUMBER first, then PREFIX voie type + name
  (`12 Rue Schoelcher`).
- **Repetition index:** `bis` / `ter` / `quater` / single letter after the number.
- **Postcode:** 5 digits, prefix `976` (pattern `976\d\d`), written
  BEFORE the commune. `CEDEX nn` markers after the city are dropped.
- **country field:** `YT`.
- **No region/state** — `countyPattern` set to never-match `(?!x)x`.
- **Sample localities:** Mamoudzou, Pamandzi, Dembeni, Sada, Bandraboua, Chirongui.

Everything else (voie type vocabulary, `bis/ter/quater`, `d'`/`l'` elision, PO box
`BP`/`CS`, secondary units `Appartement`/`Bât`/`Étage`, `normalizeTypeCase:false`)
is copied unchanged from FR.
