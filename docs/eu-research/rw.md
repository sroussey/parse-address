# Rwanda (RW) Street Address Research

Config-driven Intl address parser. English (since 2008) / Kinyarwanda-speaking
East Africa. Postal operator: **Rwanda i-Posita**. A systematic **coded street
grammar** in Kigali, no postcode, a common PO Box.

## 1. Canonical address order (Kigali coded system)

Kigali streets are coded: a 2-letter **zone code** (KG = Gasabo,
KN = Nyarugenge, KK = Kicukiro), a road number, and an English type
abbreviation:

```
KG 11 Ave        <- "KG 11" = street NAME, "Ave" = TYPE
KN 5 Rd
KK 15 Ave
KG 546 St
```

Full form with an (optional) house number and sector:

```
[Number] KG 11 Ave, [Sector], [City], [Province]
24 KG 11 Ave, Kimihurura, Kigali, Kigali City
```

Modelled as ordinary **number-first, suffix-type**: with no leading house
number the whole "KG 11 Ave" parses as street "KG 11" + type "Ave"; a leading
house number ("24 KG 11 Ave") is consumed first. Legacy French prefix-type
names ("Boulevard de la Revolution") have no trailing type and are kept whole
as `street`.

## 2. Postcodes

**None.** Rwanda does not operate a postal-code system. Never-match sentinel.

## 3. Province (-> state)

5 provinces: Kigali City, Northern, Southern, Eastern, Western. Only the
explicit forms ("Kigali City", "City of Kigali", "<Name> Province", and the
unambiguous bare Northern/Southern/Eastern/Western) are recognised so a bare
city ("Kigali") is never eaten.

## 4. Localities (Kigali sectors)

Kacyiru, Kimihurura, Remera, Nyarutarama, Kimironko, Gikondo, Nyamirambo,
Gisozi. Kept in the comma chain; leading sector(s) dropped.

## 5. PO Box

Common. "P.O. Box 6912, Kigali"; "Private Bag" also seen.

## 6. Known gaps (`__skip`)

- House number written **after** the coded street ("KG 11 Ave, 24, Kigali") —
  irregular.
- Bare industrial-zone plots with no street.

## 7. Sources

City of Kigali street-addressing system; Rwanda i-Posita; Smarty /
GeoPostcodes RW guides. 44 validated samples (2 `__skip`).
