# MG address research (mg)

## Language & order
- French administrative addressing; house NUMBER first, then a PREFIX voie
  type (Rue / Avenue / Av. / Boulevard / Bd / Place / Route / Impasse / ...).
- Street numbers are frequently ABSENT (unnumbered streets are the norm), so
  the house number is optional.

## Postcode
- Small 3-digit postcode written BEFORE the city (e.g. "101 Antananarivo").
  Modelled as OPTIONAL; most written addresses omit it.

## PO box (dominant delivery form)
- "B.P." / "BP" / "Boîte Postale" is the dominant delivery form, e.g.
  "BP 1234, Antananarivo". The box number is not a house number.

## Region / province (optional -> state)
- Rarely written; supported after the city from a restricted list:
  Analamanga, Vakinankaratra, Atsinanana, Boeny, Haute Matsiatra, Diana, Sava, Menabe, Anosy.
- Names that double as cities are excluded from the list so the routing city
  is never mis-classified as a state.

## Cities used in the corpus
- Antananarivo, Toamasina, Antsirabe, Fianarantsoa, Mahajanga, Toliara, Antsiranana.

## Neighbourhoods (quartiers) -- consumed and dropped
- Analakely, Isoraka, Ambatonakanga, Antaninarenina, Ankorondrano, Andraharo, Ivandry, Tsaralalàna, Behoririka, Ampefiloha.

## Modelling notes
- Mirrors the Cameroon/Senegal French-Africa template (prefix type, number
  first, BP dominant). City slot kept digit/comma-free so numbered/dated
  French street names ("Boulevard du 13 Janvier") do not leak into the city.
- Multi-locality "street, quartier, ville" chains that do not fit the single
  city slot are marked __skip in the corpus.
