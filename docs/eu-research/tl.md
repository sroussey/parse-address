# Timor-Leste (TL) address research

## Language / script
Portuguese (co-official with Tetum) is the administrative language for street
addressing. Latin script with Portuguese diacritics (é, í, ç, ã). Small-endian
place ordering but, like PT/MZ, the street line itself is **type-first, number-
after**: `Rua José Maria Marques 15`.

## Grammar family
Same as Portugal (pt) / Mozambique (mz): a leading thoroughfare **TYPE**
(prefix), the name (keeping the particles de/da/do/dos/das), then the house
**number AFTER** the name. Modeled as `order: street-number`,
`typePlacement: prefix`, `normalizeTypeCase: false` (types echoed verbatim,
including abbreviations Av., Trav., Estr.).

### Thoroughfare types
Rua, Avenida (Av.), Estrada (Estr.), Travessa (Tv./Trav.), Alameda (Al.),
Largo (Lgo.), Praça (Pç.), Beco. "Estrada Nacional" appears but is parsed as
type Estrada + name "Nacional".

## Locality layers
Hierarchy: **suco / bairro** (village / neighbourhood) → **posto administrativo**
(subdistrict) → **município** (municipality, formerly "district").

- **Bairro / suco** — has no output field. Dili's bairros are a known, closed-ish
  set (Colmera, Farol, Bidau, Lecidere, Comoro, Vila Verde, Bairro Pite, Santa
  Cruz, Audian, Bemori, Manleuana, ...), so they are dropped via the shared
  `areaNames` mechanism (consumed right after the street, never emitted, exempt
  from the token-preservation guard). Keying the drop on the KNOWN list — rather
  than "any first comma segment" — means an ordinary town that is NOT a Dili
  bairro ("Maliana", "Suai", "Gleno", "Same") is left alone and correctly becomes
  the `city`.
- **Município → `state`.** The 13 municipalities (Aileu, Ainaro, Baucau,
  Bobonaro, Cova Lima, Dili, Ermera, Lautém, Liquiçá, Manatuto, Manufahi,
  Oecusse, Viqueque) are matched by `regionPattern` and mapped to their
  ISO 3166-2:TL codes (TL-DI, TL-BA, ...). "Dili" is both a town (`city`) and a
  municipality (`state`) — the standard capital collision, handled by the
  city + region split ("..., Dili, Dili" → city Dili, state TL-DI).

## Postcode
**Timor-Leste has no operational postcode system.** `postalPattern` is therefore
a never-match sentinel `(?<postal_code>(?!x)x)`; `postal_code` is never emitted
and no postcode is ever required or consumed.

## Secondary unit
Portuguese-style floor unit: "1º", "3º Esq", "R/C" (rés-do-chão / ground floor),
folded to `sec_unit_type: Andar` via `defaultSecUnitType`.

## Known limitation (1 sample marked `__skip`)
A **numberless** address of the form `TYPE + multiword-name` written **directly**
before a city that is *also* a municipality name — e.g. `Avenida de Portugal,
Dili` — mis-parses: the shared prefix-name capture is non-greedy, so it splits at
the first space ("de"), and "Portugal" is taken as the city while the trailing
"Dili" is absorbed as the municipality (`state`). This is inherent to the generic
non-greedy prefix-name grammar. Any of the far more common real forms
disambiguates it: a house number (`Avenida de Portugal 12, Dili`) anchors the
name, or an intervening bairro (`..., Farol, Dili`) provides the comma boundary.
Only the bare numberless + municipality-city collision is skipped.

## Sources
- Wikipedia: "Municipalities of Timor-Leste", "Sucos of Timor-Leste", ISO 3166-2:TL
- UPU Universal Postal Union S42 addressing notes (Timor-Leste has no postcode)
- PostGrid / Smarty global address-format guides (Timor-Leste)
- Correios de Timor-Leste (national post) address usage
