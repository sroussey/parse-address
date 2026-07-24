# Tokelau (TK) Street Address Research

Research for the config-driven Intl address parser. Tokelau is a tiny dependent
territory of New Zealand: three coral atolls (Atafu, Nukunonu, Fakaofo) with a
combined population of ~1,500. It has NO formal street naming and NO postal code.

---

## 1. Canonical address order

There is effectively no street-addressing system. Mail is routed by person +
atoll village, handled through Apia, Samoa (Tokelau has no airport; supply and
mail come by ship from Samoa). The practical addressable form is a **PO box +
village**:

```
[PO Box N]                    <- PO Box 10
[Village / Atoll]             <- Atafu, Nukunonu, Fakaofo
TOKELAU
```

Single-line form used by parsers:

```
PO Box 10, Atafu, Tokelau
Private Bag 4, Atafu, Tokelau
PO Box 12, Nukunonu, Tokelau
```

The **atoll village is the routing `city`.**

## 2. Postcode

- **Tokelau has NO postal-code system.** The postal slot is a never-matching
  sentinel `(?<postal_code>(?!x)x)`; the place tail parses without a code.

## 3. Locality (city) and region

- **Atoll / village = `city`:** Atafu, Nukunonu, Fakaofo (main villages of the
  same names; Fakaofo also has the islet village Fenua Fala / Fale).
- **No sub-region**: `countyPattern` is a never-match sentinel — nothing lands in
  `state`.

## 4. Street types

Included for completeness (Road, Street, Lane, Avenue, Drive, Way, Path; Rd, St,
Ave, Dr) but essentially unused — there are no named streets.

## 5. PO Box

The normal (and effectively only) addressable form. `poBoxNames` covers
Post Office Box / P.O. Box / PO Box / P O Box / Private Bag. In a PO-box line the
village lands in `city` and "Tokelau" is consumed as the country.

## 6. Parser convention / __skip

A bare "village, Tokelau" line has **no street token and no postcode**, so there
is no anchor to parse it as a pure locality; with the postcode absent it would
otherwise be taken as a street. Such lines (and facility names like "Taupulega"
/ village council) are marked `__skip`. Addressable corpus lines are PO-box /
Private-Bag lines whose village lands in `city`.

## 7. Sources

New Zealand Post / Tokelau addressing practice (mail via Apia, Samoa); UPU note;
Wikipedia "Tokelau" (atolls / villages).
