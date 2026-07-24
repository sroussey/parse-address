# Ethiopia (ET) — address research

## Script & language
Native Amharic/Ge'ez script is OUT OF SCOPE (`__skip`). International addressing uses
English/Latin ("Bole Road, Addis Ababa").

## Grammar
- **Order:** house NUMBER first (when present), then street name + trailing English type.
  Numbers are usually ABSENT.
- **Type placement:** trailing English suffix (Road, Avenue, Street, Square, ...). Many
  roads are type-less ("Bole Medhanealem", "Sidist Kilo").
- **Canonical example:** "Bole Road, Addis Ababa".

## Locality — sub-city / woreda / kebele
Addis Ababa is organised as **sub-city ("kifle ketema") → woreda → kebele**. In writing this
appears as an area chain between the street and the routing city
("Bole Road, Bole Sub City, Woreda 03, Kebele 05, Addis Ababa"). These are treated as area
tokens in the `city` slot: the comma chain is kept together and the leading area(s) dropped
in `postNormalize`, keeping the last locality as `city` (mirrors KE/TZ). Woreda/Kebele carry
digits, which is fine — `cityAllowsCommas` permits digits in the chain, and dropped phrases
are exempted from the token-loss guard via `__dropped`.

## Region -> state
The **regional states** (Oromia, Amhara, Tigray, Afar, Sidama, Harari, Benishangul-Gumuz,
Gambella) map to `state`. The list is kept DISJOINT from the routing cities: the two
chartered **city-regions Addis Ababa and Dire Dawa are cities in their own right and are
excluded** from the region list — otherwise a bare "..., Addis Ababa" would be mis-taken as
the region and eat the routing city (a documented failure mode; cf. NG "Lagos").

## Postcode
A **4-digit** postcode exists but has very low adoption. Written AFTER the city
("Addis Ababa 1000") and modelled as OPTIONAL — absent on the vast majority of addresses.

## PO Box
The DOMINANT postal form: "P.O. Box 1234, Addis Ababa". Variants: "PO Box", "P.O.Box",
"P. O. Box", "P O Box", "Post Box", "Private Bag".

## Sources
Ethiopian Postal Service (Ethio Post); UPU S42 ET template & postcode note (4-digit, low
adoption); Smarty / GeoPostcodes ET address-format guides; general references for the
regional-state and city lists.
