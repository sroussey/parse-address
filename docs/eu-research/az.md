# Azerbaijan (AZ) address research

## Language / script
Azerbaijani, Latin script (adopted 1991). Distinctive letters: ç ə ğ ı İ ö ş ü.
Note the dotted capital **İ** (U+0130) — see the known limitation below.

## Order — street-first, SUFFIX type, number after the type
The dominant written street line is **name → type-suffix → number**:
`28 May küçəsi 5`, `Neftçilər prospekti 25`, `Heydər Əliyev prospekti 152`.
Modeled `order: street-number`, `typePlacement: suffix`. The building number
follows the type; it may be introduced by "ev" (house) / № / #, and carry a range
or slash sub-part ("5/7") or a glued letter ("12A" → 12 + A).

### Type (izafet suffix noun)
- **küçəsi** (street) — abbr. küç.
- **prospekti** (avenue) — abbr. pr.
- **döngəsi** (lane / side-street)
- **şosesi** (highway / road)
- **meydanı** (square)
- **yolu** (road)

Echoed as written (`normalizeTypeCase: false`); a short code is still derived
(KUC, PR, ...). Numbered street names ("28 May", "8 Noyabr", "20 Yanvar") are
common, so `allowDigitsInName: true` — the trailing building number is still the
last number token because the greedy name backtracks to the type.

## Postcode
**"AZ" + 4 digits** ("AZ1000", "AZ1073"). Modeled OPTIONAL and **before the city**
(per the task brief). An internal space ("AZ 1000") is normalised away and the
prefix upper-cased. Note: international-envelope renderings instead write it AFTER
the city ("BAKU AZ1010") — that form is out of scope (see skips).

## Rayon (district) — dropped
"<name> rayonu" (e.g. "Nəsimi rayonu", "Yasamal rayonu", "Səbail rayonu") is an
administrative sublayer with no output field. When a routing city follows, it is
consumed and DROPPED via a keyword-anchored `(?<drop>...)` (anchored on the
"rayon"/"rayonu" word and DIGIT-FREE, so it can never swallow a numbered street),
and exempted from the token guard. The routing **city** is Baku (Bakı), Ganja
(Gəncə), Sumqayıt, Mingəçevir, Naxçıvan, etc. An optional "şəhəri" / "ş." (= city)
qualifier after the city name is consumed ("Bakı şəhəri" → city Bakı).

## Secondary unit
mənzil (apartment) "mənzil 12" / "m. 12", blok — "28 May küçəsi 5, mənzil 12" →
sec_unit_type mənzil, sec_unit_num 12.

## Known limitations (3 samples `__skip`)
1. **Big-endian order** ("Bakı, Nəsimi rayonu, 28 May küçəsi 5"): the reverse of
   the modeled small-endian street-first form. Not modeled.
2. **International English envelope** ("15 Neftchilar Avenue, BAKU AZ1010,
   AZERBAIJAN"): English suffix type "Avenue" and postcode AFTER the city. The
   config targets the native small-endian, postcode-before-city form.
3. **İ (U+0130) in a street name** ("İnşaatçılar prospekti 40, Nəsimi rayonu,
   Bakı"): the parse is CORRECT, but the upstream token-preservation guard
   (`src/invariant.ts`) lowercases the whole address, and `"İ".toLowerCase()` →
   `"i̇"` (i + combining dot, U+0307) LENGTHENS the string. Indexing the boundary
   in the lowercased copy then applying that index to the original shifts the
   street/boundary cut by one character, and the guard falsely reports token loss.
   This affects Azerbaijani İ-initial/İ-containing street names in general and
   would require a src-side Unicode fix (index on the original, or a
   length-preserving fold). All non-İ street names parse and pass cleanly.

## Sources
- Wikipedia: "Postal codes in Azerbaijan" (AZ + 4 digits), "Administrative
  divisions of Azerbaijan" (rayonlar), "Azerbaijani alphabet"
- PostGrid / Smarty / Angloinfo Azerbaijan address-format guides
- Azərpoçt (national post) usage
