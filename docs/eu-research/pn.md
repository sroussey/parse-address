# Pitcairn Islands (PN) Street Address Research

Research for the config-driven Intl address parser. The Pitcairn Islands are a
British Overseas Territory with a single inhabited island (Pitcairn) and a single
settlement, Adamstown (population ~40). UK addressing model: number-first,
trailing English type, single territory-wide postcode. Same skeleton as SH / FK.

---

## 1. Canonical address order

```
[Number] [Street/Place] [Type]   <- Main Road (numbering is rare)
[Settlement]                     <- Adamstown
[Postcode]                       <- PCRN 1ZZ
PITCAIRN ISLANDS
```

Single-line form:

```
Main Road, Adamstown, PCRN 1ZZ
Main Road, Adamstown, Pitcairn Islands, PCRN 1ZZ
Public Hall, Main Road, Adamstown, PCRN 1ZZ
```

**Number first, suffix type, postcode LAST (after-city).** Almost nothing is
numbered; most lines are `<place/building>, Adamstown, PCRN 1ZZ`.

## 2. Postcode

- A **single code for the whole territory: `PCRN 1ZZ`** (Royal Mail
  overseas-territory code). Capture: `(?<postal_code>PCRN\s*1ZZ)`, normalised to
  upper-case with one space before `1ZZ`. Optional.

## 3. Locality (city)

- The **settlement is the routing `city`**, essentially always **Adamstown** (the
  only settlement). Landmarks/areas: Bounty Bay (the landing), The Edge, Aute
  Valley, Taro Ground, Big Fence, Ginger Valley.
- **No sub-region / county:** `countyPattern` is a never-match sentinel — nothing
  lands in `state`. The country name ("Pitcairn Islands" / "Pitcairn Island" /
  "Pitcairn") may appear before the postcode and is consumed, not captured.

## 4. Street types

Roads/paths are few and informally named; typed forms used: Road, Lane, Street,
Track, Hill, Way, Path, Drive, Place, Row, Walk; Rd, St, Dr. Examples: Main Road,
Pulau Road, Church Road, School Lane, Landing Road, Aute Valley Road.

## 5. PO Box and buildings

- Formal mail typically addresses a person + Adamstown + PCRN 1ZZ; PO boxes are
  supported for completeness. Public/company/church addresses lead with a named
  building ("Public Hall", "Government Office", "Seventh Day Adventist Church",
  "General Store", "Medical Centre"), so `buildingKeywords` (House, Building,
  Hall, Centre, Chambers, Lodge, Church, Store, Office, Court) is enabled.

## 6. Parser convention / __skip

A bare "Adamstown, PCRN 1ZZ" line (no street token) is indistinguishable from a
number-less street with the postcode last and is taken as a street; those, plus
"Bounty Bay, Adamstown, ..." and island-only lines, are `__skip`. Addressable
lines carry a street, building+street, or PO box.

## 7. Sources

Royal Mail postcode data (PCRN 1ZZ); Government of the Pitcairn Islands; UPU
note; Wikipedia "Adamstown, Pitcairn Islands".
