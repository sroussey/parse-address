# Norfolk Island (NF) Street Address Research

Research for the config-driven Intl address parser. Norfolk Island is an
Australian external territory using the Australian addressing model (number
first, trailing English type, 4-digit postcode last) — same skeleton as NZ / AU.

---

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 12 Taylors Road / New Cascade Road
[Locality]                    <- Burnt Pine, Kingston, Cascade, ...
[Postcode]                    <- 2899
NORFOLK ISLAND
```

Single-line form:

```
Taylors Road, Burnt Pine, 2899
12 Taylors Road, Burnt Pine, 2899
Taylors Road, Burnt Pine, Norfolk Island, 2899
```

**Number first, suffix type, postcode LAST (after-city).** Rural properties are
often named or use only the road, so the number is optional.

## 2. Postcode

- A **single Australian-style 4-digit code: `2899`** for the whole territory
  (Australia Post). Capture: `(?<postal_code>2899)`.
- (Historically some mail added `NSW` before `2899`; the modern form is just the
  territory name + `2899`.)

## 3. Locality (city)

- The **locality is the routing `city`.** Main town: **Burnt Pine**. Other
  localities: Kingston (historic Georgian precinct), Cascade, Middlegate,
  Longridge, Steeles Point, Ball Bay, Anson Bay, Rocky Point.
- **No state/region** is written (the territory is not within a state), so
  `countyPattern` is a never-match sentinel — nothing lands in `state`.

## 4. Street types

Trailing English suffixes echoed verbatim: Road, Drive, Lane, Avenue, Street,
Place, Close, Court, Way, Row, Terrace, Hill, Track, Rise, Circle, Esplanade,
Parade, Crescent; Rd, Dr, Ave, Av, St, Ln, Ct, Pl, Tce, Cres, Cir. Examples:
Taylors Road, Grassy Road, Douglas Drive, New Cascade Road, Queen Elizabeth
Avenue, Bumboras Road, Country Road, Collins Head Road, Rooty Hill Road, Quality
Row (Kingston).

## 5. PO Box and buildings

- PO boxes are common ("PO Box 95, Burnt Pine, Norfolk Island, 2899"); Locked
  Bag also supported. Accommodation/company addresses lead with a named building
  ("Bounty Lodge, Taylors Road, Burnt Pine, 2899"), so `buildingKeywords` is on.

## 6. Parser convention / __skip

A bare "locality, 2899" line (no street token) is indistinguishable from a
number-less street with the postcode last and is taken as a street; those are
`__skip`. Addressable lines carry a street, building+street, or PO box.

## 7. Sources

Australia Post postcode 2899; Norfolk Island Regional Council; Wikipedia
"Norfolk Island" and locality/road names; UPU note.
