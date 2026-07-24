# Afghanistan (AF) — address research

Scope: Latin **transliteration** of Afghan (Dari/Pashto) addresses, as used in
international / SEC filings. Native Perso-Arabic (RTL) script is **out of scope**
(marked `__skip`).

## Written form (transliterated, small-endian)

```
House 12, Street 4, Wazir Akbar Khan, Kabul
House 5, Darulaman Road, Karte Se, Kabul
```

Segments, left to right:

1. **Building** — `House N`. In Afghan usage this labels the dwelling, not a
   street-position civic number, so it is modelled as a **secondary unit**
   (`sec_unit_type` = "House"). (The brief allows `sec_unit` or `number`; unit is
   the cleaner fit and keeps `number` free.)
2. **Street** — two common shapes, both handled by one suffix grammar over a
   **digit-admitting** name:
   - **Numbered street**: `Street 4`, `Kucha 4` → whole, type-less `street`
     ("Street 4", "Kucha 4"). The name admits the trailing digit
     (`order: number-street` makes the street-name class digit-safe).
   - **Named road**: `Darulaman Road`, `Jalalabad Road`, `Malik Asghar Watt`,
     `Kabul-Jalalabad Highway` → `street` + trailing `type`.
3. **Area / district** — the neighbourhood (Wazir Akbar Khan, Shahr-e Naw,
   Karte Se/Char/Naw, Taimani, Khair Khana, Macroryan, Qala-e Fatullah, ...) or a
   **numbered district** (`District N`, `Nahia N`). → `city`. The city slot
   therefore **admits digits** (`cityAllowsDigits: true`).
4. **Province (Welayat)** — → `state`, **RESTRICTED** to the 34-province list.

## Modelling decisions

- `order: number-street`, `typePlacement: suffix`, `postalPlacement: after-city`.
- Postcode: Afghanistan has a **4-digit** code (e.g. Kabul `1001`) but it is
  rarely written. Modelled `\d{4}`, **OPTIONAL** (`Kabul 1001`).
- **Province is RESTRICTED** to the 34 provinces (Kabul, Herat, Balkh, Kandahar,
  Nangarhar, Kunduz, ...). The area/neighbourhood names that occupy `city` are
  never province names, so `state` stays **disjoint** from `city`:
  `..., <Area>, <Province>` splits cleanly, and a lone `..., <Area>` stays a city.
- `House` (and `Apartment`/`Shop`/`Floor`/...) captured as a **leading** unit.
- PO Box supported (`PO Box 325, Kabul`).
- `normalizeTypeCase: false` — English types echoed verbatim (Road, Highway).

## Known gaps / `__skip`

- **Single trailing locality** — when only one locality follows the street
  (`House 3, Street 2, Taimani`), it fills `city`; if that lone locality were
  actually a province, it would still land in `city` (the same one-slot behaviour
  as the AE/SA configs). Samples use a real city name here, so the parse is
  correct as written.
- **Three-or-more-locality chains** — `House 3, Street 3, Karte Se, District 3,
  Kabul` exceeds one area + one province and is `__skip`'d (the middle locality
  cannot be placed losslessly). Deep alley+street+area+district+province chains
  likewise `__skip`'d.
- Named roads coexist with numbered streets under the single suffix grammar:
  numbered streets keep the number in the name (type-less), named roads split off
  the trailing type. Both are lossless.
- **Native-script** samples are `__skip`'d (out of scope).

## Validation

`ISO2=af` harness: **checked=40, failures=0** (4 `__skip`: 2 deep chains, 2
native-script).
