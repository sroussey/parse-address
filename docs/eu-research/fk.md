# Falkland Islands (FK) Street Address Research

Research for the config-driven Intl address parser. The Falklands are a British
Overseas Territory using the UK addressing model (same skeleton as GB / SH /
Bermuda): number-first, trailing English type, single territory-wide postcode.

---

## 1. Canonical address order

```
[Number] [Street] [Type]      <- 2 Ross Road / John Street
[Settlement]                  <- Stanley (or a Camp settlement)
[Postcode]                    <- FIQQ 1ZZ
FALKLAND ISLANDS
```

Single-line form:

```
Ross Road, Stanley, FIQQ 1ZZ
2 Ross Road, Stanley, FIQQ 1ZZ
Dean Street, Stanley, Falkland Islands, FIQQ 1ZZ
```

**Number first, suffix type, postcode LAST (after-city).** The house number is
often absent (named houses; bare street on a settlement).

## 2. Postcode

- A **single code for the entire territory: `FIQQ 1ZZ`** (Royal Mail /
  BFPO-style overseas-territory code). Capture: `(?<postal_code>FIQQ\s*1ZZ)`,
  normalised to upper-case with one space before `1ZZ`.
- Optional — routinely omitted on internal mail.

## 3. Locality (city)

- The **settlement is the routing `city`.** The overwhelming majority is
  **Stanley** (the capital, on East Falkland). "Camp" (everything outside
  Stanley) settlements: Goose Green, Darwin, San Carlos, Port Howard, Fox Bay,
  Port Louis, Port Stephens, North Arm, Mount Pleasant (RAF base).
- **No sub-region / county** is written, so `countyPattern` is a never-match
  sentinel `(?!x)x` — nothing lands in `state`.

## 4. Street types

Trailing English suffixes echoed verbatim: Road, Street, Lane, Drive, Place,
Close, Hill, Row, Walk, Avenue, Crescent, Terrace, Way, Court, Rise, Path; Rd,
St, Ave, Av, Dr, Cres. Stanley examples: Ross Road (the seafront), John Street,
Fitzroy Road, Davis Street, Dean Street, Philomel Street, Villiers Street,
Callaghan Road, Snake Hill, Brisbane Road, St Mary's Walk, Crozier Place,
Endurance Avenue, Pioneer Row.

## 5. PO Box and buildings

- PO boxes are used ("PO Box 25, Stanley"). Registered/company and hospitality
  addresses lead with a named building ("Malvina House, Ross Road, Stanley"),
  so `buildingKeywords` (House, Building, Cottage, Lodge, Chambers, Centre, Hall,
  Farm, Court) is enabled.

## 6. Parser convention / __skip

With the postcode last, a bare "settlement, FIQQ 1ZZ" line (no street token) is
indistinguishable from a number-less street and would be taken as a street; those
are marked `__skip`. Addressable lines carry a street, building+street, or PO box.

## 7. Sources

Royal Mail postcode data (FIQQ 1ZZ); Falkland Islands Government / Post Office;
UPU addressing note; Wikipedia "Stanley, Falkland Islands" (street names).
