# BJ address research (bj)

## Language & order
- French administrative addressing; house NUMBER first, then a PREFIX voie
  type (Rue / Avenue / Av. / Boulevard / Bd / Place / Route / Impasse / ...).
- Street numbers are frequently ABSENT (unnumbered streets are the norm), so
  the house number is optional.

## Postcode
- No operational postal-code routing. Modelled with a never-matching
  sentinel so the city is read directly after the street.

## PO box (dominant delivery form)
- "B.P." / "BP" / "Boîte Postale" is the dominant delivery form, e.g.
  "BP 1234, Cotonou". The box number is not a house number.

## Region / province (optional -> state)
- Rarely written; supported after the city from a restricted list:
  Alibori, Atacora, Atlantique, Borgou, Collines, Couffo, Donga, Littoral, Mono, Ouémé, Plateau, Zou.
- Names that double as cities are excluded from the list so the routing city
  is never mis-classified as a state.

## Cities used in the corpus
- Cotonou, Porto-Novo, Parakou, Abomey, Bohicon, Natitingou.

## Neighbourhoods (quartiers) -- consumed and dropped
- Cadjèhoun, Ganhi, Akpakpa, Fidjrossè, Cocotomey, Zongo, Jéricho, Haie Vive, Sainte-Rita, Gbégamey.

## Modelling notes
- Mirrors the Cameroon/Senegal French-Africa template (prefix type, number
  first, BP dominant). City slot kept digit/comma-free so numbered/dated
  French street names ("Boulevard du 13 Janvier") do not leak into the city.
- Multi-locality "street, quartier, ville" chains that do not fit the single
  city slot are marked __skip in the corpus.
