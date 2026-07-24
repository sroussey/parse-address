# Eritrea (ER) — address research

## Script & language
Native Tigrinya/Ge'ez script is OUT OF SCOPE (`__skip`). International addressing uses
English/Latin, with strong **Italian influence** in Asmara's street grid.

## Grammar
- **Order:** house NUMBER first (when present), then street name + trailing English type.
  Numbers are usually ABSENT.
- **Type placement:** trailing English suffix (Avenue, Street, Road, ...). Many roads are
  type-less, especially Italian-era names ("Combishtato", "Adi Hawesha").
- **Canonical example:** "Harnet Avenue, Asmara" (Harnet = "Liberty"; the main avenue,
  formerly Corso Italia / Viale De Bono).

## Locality
District/quarter (Paradiso, Akria, ...) = **city** slot. A district commonly precedes the
routing city; the comma chain is kept together and the leading district(s) dropped in
`postNormalize`, keeping the last locality as `city` (mirrors KE/TZ).

## Region -> state
The **six regions ("zoba")** — Maekel (Central), Anseba, Debub (Southern), Gash-Barka,
Northern Red Sea (Semenawi Keyih Bahri), Southern Red Sea (Debubawi Keyih Bahri) — map to
`state`. The list is DISJOINT from the routing cities (Maekel vs Asmara, Anseba vs Keren,
Gash-Barka vs Barentu, Northern Red Sea vs Massawa, ...), so the restricted county slot
never eats a city. Both the hyphenated ("Gash-Barka") and spaced ("Gash Barka") spellings
and the Tigrinya-Latin names ("Semenawi/Debubawi Keyih Bahri") are accepted.

## Postcode
Eritrea has **NO operational postcode system**. Modelled with a never-matching sentinel
`(?<postal_code>(?!x)x)` so no code is ever emitted.

## PO Box
The DOMINANT postal form: "P.O. Box 254, Asmara". Variants: "PO Box", "P. O. Box",
"P O Box", "Post Box", "Private Bag".

## Sources
Eritrean Postal Service; UPU S42 ER template & postcode note (no operational code); Smarty /
GeoPostcodes ER address-format guides; general references for the zoba and city lists.
