# Cameroon (CM) postal-address research

Scope: everything needed to parse and normalize Cameroonian street addresses for a
config-driven `EuCountryConfig`. Cameroon is bilingual (French + English); the
addressing convention is overwhelmingly the **French** one (number-first,
prefix voie type), which is what this config models.

Sources
- CAMPOST (Cameroon Postal Services) — national operator; confirms PO-box (B.P.)
  based delivery and the absence of an operational postcode routing system.
- UPU "Postal addressing systems" country notes (Cameroon) — line order.
- Google libaddressinput / libpostal (fr locale reused for CM).
- Smarty "Cameroon address format examples"; PostGrid "Cameroon address format";
  exampleaddress.com Cameroon corpus (Boulevard du 20 Mai, Avenue Ahmadou Ahidjo,
  Rue Joffre, Rue Prince Bell, Avenue Kennedy — Yaoundé / Douala).

## 1. Line order — NUMBER FIRST, prefix voie type
`[number?] [voie-type] [street-name]`, then `[quartier?] [city] [region?]`.
- The generic **type leads** the name, French-style ("Rue Joffre", "Avenue
  Kennedy", "Boulevard du 20 Mai"). This is the opposite of the English trailing
  suffix.
- The **house number is very frequently absent** — many Cameroonian streets are
  unnumbered, so a bare "Boulevard du 20 Mai, Yaoundé" is entirely normal.
- Single-string forms join with commas: `10 Rue Joffre, Douala`.

## 2. Postcode — NONE
Cameroon has **no operational postal-code system**. Some third-party datasets show
a placeholder five-digit code, but CAMPOST does not route on it and it is not
written on mail. The config's `postalPattern` is a never-matching sentinel
`(?<postal_code>(?!x)x)`, so the (optional) postcode slot is inert and the city is
read directly after the street.

## 3. Street types (types de voie) — leading word
Common set (kept verbatim; La Poste-style abbreviations appear in practice):
Rue (r.), Avenue (Av, Av.), Boulevard (Bd, Bld, Boul.), Place (Pl), Carrefour
(junction; "Carr"), Route (Rte), Chemin (Che), Impasse (Imp), Allée (All),
Ruelle, Rond-point (Rd-pt), Voie, Quai, Montée.
- Only the FIRST word after the number is the type; interior words ("du Faubourg",
  "de la Liberté", "Prince Bell") belong to the name.
- Anglophone NW/SW addresses use an English **trailing** type ("Commercial Avenue",
  "Station Road"). The francophone prefix grammar does not extract a trailing type,
  so these parse with the type word kept inside the street name (lossless, `type`
  unset) — documented, acceptable behaviour.

## 4. Particles / accents
- Lowercase particles stay in the name and are not the type: `de`, `du`, `de la`,
  `de l'`, `des`, `d'`. E.g. "Boulevard de la Liberté" → type Boulevard, street
  "de la Liberté".
- Apostrophe elision `d'`, `l'` attaches with no space ("Rue d'Alger", "Place de
  l'Indépendance"). Accept `'` and curly `’`.
- Accents: é è ê à â ô û ç etc. ("Ngaoundéré", "Bébey Eyidi"). Match unicode.

## 5. Numbered / dated street names
Independence-era date names are common and the digits are part of the NAME, not a
house number: "Boulevard du 20 Mai", "Rue du 8 Mai 1945". Because the number is
consumed (optionally) at the FRONT, these numeric tails stay inside the street
name. This is why the city slot is deliberately kept digit-free (see §9).

## 6. Region (région) — optional -> state
The 10 regions: Adamaoua (AD), Centre (CE), Est (ES), Extrême-Nord (EN), Littoral
(LT), Nord (NO), Nord-Ouest (NW), Ouest (OU), Sud (SU), Sud-Ouest (SW). Written
after the city, rarely present. English spellings (Far North, Northwest, ...) are
mapped too. Codes follow ISO 3166-2:CM.

## 7. Secondary units
Appartement (Appt/Apt/App), Immeuble (Imm — named building/block), Bâtiment (Bât),
Étage, Porte. Modelled as a TRAILING unit ("8 Rue Castelnau, Appartement 3,
Douala"). A LEADING unit before the number is a documented failure mode (skip).

## 8. PO box (dominant) — B.P. / Boîte Postale
`B.P.` / `BP` / `Boîte Postale` + number is the **dominant** delivery form
("B.P. 1234, Douala"). The box number is NOT a house number (a classic libpostal
misparse). Normalized `sec_unit_type:"BP"`. May carry a trailing region.

## 9. Failure modes (parser MUST handle, or intentionally skip)
1. No house number: "Boulevard du 20 Mai, Yaoundé" — number null, type+name+city.
2. Dated/numbered name kept whole: "Rue du 8 Mai 1945, Bafoussam" — digits stay in
   the name, number null.
3. Particle chains in name: "Boulevard de la Liberté" — "de la" not a type/unit.
4. Elision: "Rue d'Alger", "Place de l'Indépendance" — no split on apostrophe.
5. B.P. box read as house number (libpostal) — kept as `sec_unit_type:"BP"`.
6. Full "Boîte Postale 512" spelling normalized to BP.
7. Abbreviated type echoed verbatim: "Bd de la Liberté", "Av Charles de Gaulle".
8. Region in tail: "..., Douala, Littoral" — Littoral → state LT, not city.
9. bis / letter repetition index: "10 bis Rue Joffre", "12 A Rue Sylvani".
10. Anglophone trailing-type street ("Commercial Avenue, Bamenda") — type kept in
    name, lossless, `type` unset (documented).
11. **[SKIP]** quartier + city chain ("Rue Prince Bell, Akwa, Douala") — single
    city slot; digit-free-city constraint (needed for §5) precludes a comma chain,
    so it degrades to a lossless single-street fallback.
12. **[SKIP]** leading secondary unit before the number ("Appartement 3, 8 Rue
    Castelnau, Douala").
13. **[SKIP]** leading building name with no keyword set ("Immeuble Ancien Dalip,
    Avenue de Gaulle, Douala").
14. **[SKIP]** landmark/relative informal address ("Face Hôpital Laquintinie,
    Douala" — "face"/"derrière"/"à côté de").
