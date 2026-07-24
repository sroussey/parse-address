# American Samoa (AS) — address research

## Status
US territory. SEC-mapped as foreign; addressed in US style. Modelled
`number-street` / `suffix` / `after-city`.

## Reality of AS addressing
American Samoa has very few named or numbered streets. Delivery is overwhelmingly
**PO-box based**, routed to a village as the "city": "PO Box 1234, Pago Pago, AS
96799". The whole territory uses a **single ZIP: 96799**. Where a road exists it
is a numbered "Route 0NN" (main coastal road) or a small set of named roads
(Airport Road, Ottoville Road, Fagaima Road).

## Grammar
- **Order:** house NUMBER first, street name + trailing type; ranges / letter
  suffix / "#" supported.
- **Street type:** trailing US suffix set, echoed verbatim. "Route 0NN" parses as
  a bare, type-less street (lossless).
- **State:** territory code **AS** before the ZIP ("Pago Pago, AS 96799").
  `countyPattern = (?:AS|American\s+Samoa)`, `regionMap → AS`.
- **Postal:** US ZIP / ZIP+4, LAST (always 96799).
- **Country tail:** optional "USA"/"United States"/"American Samoa" consumed;
  output "AS".

## Villages (routing "city")
Pago Pago, Tafuna, Nu'uuli, Fagatogo, Leone, Faleniu, Ili'ili, Vaitogi, Utulei,
Mapusaga, Aua, Fagaalu, Malaeimi, Pavaiai, Aunu'u.

## PO boxes
"PO Box", "P.O. Box", "P O Box", "PMB" → box result with village + AS + ZIP.
The corpus leans on box lines (the dominant real-world form) plus a handful of
Route / named-road street lines.

## Skipped forms (lossless, documented)
- Bare "Village, AS 96799" (no street / number / box) — a no-street line cannot
  be split; the village collapses to the street slot.

## Corpus
`samples-as.json`: 42 samples — 40 asserted PASS, 2 `__skip`.
Validated: `ISO2=as` harness → failures=0.
