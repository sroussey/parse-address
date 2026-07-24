# Somalia (SO) — address research

## Script & language
Somali is written in the **Latin alphabet** (the official 1972 orthography). International
addressing is Latin/English. Native Arabic-script samples are OUT OF SCOPE (`__skip`).

## Grammar
- **Order:** house NUMBER first (when present), then street name + trailing English type.
  Numbers are usually ABSENT — most lines are just "Street, City".
- **Type placement:** trailing English suffix (Road, Street, Avenue, ...). Many named
  roads carry NO type and parse type-less ("Corso Somalia", "Wadada Sodonka",
  "Jidka Warshadaha"). Somali road words ("Jidka" = the road, "Wadada" = street) appear
  as part of the bare name rather than as recognised types.
- **Canonical example:** "Maka Al Mukarama Road, Mogadishu" (the main artery of Mogadishu).

## Locality
Area/district (Hodan, Wadajir, Waberi, Hamar Weyne, ...) = **city** slot. A district
commonly precedes the routing city; the comma chain is kept together and the leading
district(s) dropped in `postNormalize`, keeping the last locality as `city` (mirrors KE/TZ).

## Region -> state
The **18 official regions** (Awdal, Bakool, Banaadir, Bari, Bay, Galguduud, Gedo, Hiiraan,
Middle/Lower Juba, Mudug, Nugaal, Sanaag, Middle/Lower Shabelle, Sool, Togdheer, Woqooyi
Galbeed) map to `state`. The list is DISJOINT from the routing cities — region capitals
(Mogadishu, Baidoa, Galkayo, Bosaso, Garowe, Burao, Hargeisa) have names unlike their
region — so the restricted county slot never eats a city. Banaadir is the region containing
Mogadishu. Common spelling variants included ("Banadir", "Nugal", "Hiran").

## Postcode
Somalia has **NO operational postcode system**. Modelled with a never-matching sentinel
`(?<postal_code>(?!x)x)` so no code is ever emitted.

## PO Box
The DOMINANT postal form: "P.O. Box 1159, Mogadishu". Variants: "PO Box", "P. O. Box",
"P O Box", "Post Box", "Private Bag". The box replaces the thoroughfare.

## Sources
Somali Postal Service (Somali Post); UPU S42 SO template & postcode note (no operational
code); Smarty / GeoPostcodes SO address-format guides; general geographic references for
region/city lists.
