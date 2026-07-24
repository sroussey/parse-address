# The Gambia (GM) Street Address Research

Config-driven Intl address parser. English-speaking West Africa. Postal
operator: **Gambia Post (GAMPOST)**. Number-first, trailing English street
types, **no postcode system**, and a dominant PO Box / Private Mail Bag form.

## 1. Canonical address order

Physical (street) form — **house NUMBER first, then street + trailing English
type**, then an optional area/district, then the town:

```
[Number] [Street] [Type]      <- 12 Kairaba Avenue
[Area / district]  (dropped)  <- Fajara
[Town]                        <- Serrekunda
[Country]
```

PO Box form (dominant):

```
P.O. Box [Box], [Town]        <- P.O. Box 3312, Banjul
```

So: **number first, suffix type, no postcode (after-city grammar with the
postcode branch absent)** — the BW skeleton.

## 2. Postcodes

**None.** The Gambia has never operated a postal-code system. Modelled with a
never-match sentinel `(?<postal_code>(?!x)x)`; the after-city grammar falls
through to its "..., Town" (postcode-absent) branch.

## 3. Region / division

The 8 administrative divisions/regions (West Coast, Lower River, North Bank,
Central River, Upper River, plus the cities of Banjul and Kanifing) are
essentially never written on mail. No `state` is modelled — the county slot is
disabled `(?!x)x` so it cannot swallow the routing town.

## 4. Localities

Greater Banjul areas commonly written where a suburb sits: Fajara, Kotu,
Kololi, Senegambia, Bakau, Bijilo, Manjai Kunda, Pipeline. Kept in the comma
chain and the leading area(s) dropped in `postNormalize`.

## 5. PO Box / Private Mail Bag

Dominant. "P.O. Box", "PO Box", "P. O. Box", "Private Mail Bag" / "PMB". Box
numbers are plain digits (a 0-3 letter prefix is allowed for parity).

## 6. Street types

English suffixes: Street, Road, Avenue, Drive, Close, Crescent, Boulevard,
Highway, Lane, Way, Terrace, Parade (+ abbreviations). Many roads are type-less,
so the type is optional.

## 7. Known gaps / failure modes

- Bare quarter/settlement with no street ("Half Die, Banjul") and relative
  "Off <road>" descriptors — marked `__skip`.

## 8. Sources

Gambia Post (GAMPOST); UPU S42 GM template (no postcode field); Smarty /
PostGrid GM address guides. 46 validated samples (2 `__skip`).
