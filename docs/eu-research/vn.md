# Vietnam (VN) address research

## Language / script
Vietnamese, Latin script with rich diacritics (Nguyễn, Lê Lợi, Hồ Chí Minh). The
engine's word boundaries are Unicode-aware (`\p{L}`), so accented names match and
are preserved verbatim. Everything is kept lossless.

## Order — SMALL-ENDIAN
The house **number leads**: `123 Đường Lê Lợi`, `56 Nguyễn Huệ`, `25/7 Hai Bà
Trưng`. Modeled `order: number-street`. House numbers may carry a slash sub-part
("25/7", "12/3A") — kept inside `number` — or a single glued letter ("12A", "5B")
captured as `civic_number_suffix`.

## Street type — OPTIONAL leading generic
A generic thoroughfare word may lead the name: **Đường** (street), **Phố**
(street, Hanoi), **Đại lộ** (avenue/boulevard), **Ngõ** (lane, Hanoi), **Hẻm**
(alley, HCMC). Many streets OMIT it entirely ("56 Nguyễn Huệ"), so the type is
**optional** — the shared prefix grammar already allows a bare, typeless name as
an alternative. `typePlacement: prefix`, echoed verbatim.

## Locality layers (smallest → largest)
`ward → district → province`:
- **Ward** — Phường (urban) / Xã (rural commune) / Thị trấn (township). **Dropped**
  via a keyword-anchored `(?<drop>...)` in the postal slot (between street and
  city): "Phường Bến Nghé", "Phường 12", "Xã Tân Thông Hội". Recorded as dropped
  so the token guard exempts it.
- **District → `city`.** Quận (urban), Huyện (rural), Thành phố (provincial city),
  Thị xã. Numbered ("Quận 1", "Quận 5") and named ("Quận Hoàn Kiếm", "Huyện Củ
  Chi") alike. `cityAllowsDigits: true` so a numbered district survives.
- **Province → `state`** via `regionPattern`, kept as written. The 5 centrally-
  governed municipalities ("TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng",
  "Cần Thơ") plus 58 provinces are listed (common spellings incl. "TP. …",
  "Thành phố …", bare name).

## Postcode
The **2018 six-digit** system (`\d{6}`, e.g. HCMC 700000) has near-zero real
adoption. Modeled **OPTIONAL, before the city** (same slot as the ward drop):
`..., 700000, Quận 1, ...` or `..., 700000 Quận 5, ...`, and it may co-occur with
a ward drop (`..., Phường Bến Nghé, 700000, Quận 1, ...`). Note: some guides call
it "5-digit"; the operative Vietnam Post scheme and observed codes (700000) are
6-digit, which is what is modeled (matching the task brief).

## Design decision — MARKERLESS wards NOT dropped (1 sample `__skip`)
When a ward is written WITHOUT its marker ("56 Nguyễn Huệ, Bến Nghé, Quận 1"),
the bare "Bến Nghé" is grammatically indistinguishable from the last word of a
two-word street name — and because the shared prefix-name capture is non-greedy,
a markerless-drop rule would also mis-split ordinary two-word streets. Two forms
collide directly:
  - `56 Nguyễn Huệ, Bến Nghé, Quận 1`   (markerless ward, want drop "Bến Nghé")
  - `70 Nguyễn Huệ, Quận 1, TP. HCM`    (ward OMITTED, "Nguyễn Huệ" is the street)
A markerless-drop rule fixes the first but breaks the second (splits the street
into "Nguyễn" + dropped "Huệ"). The ward-omitted form is far more common in real
Vietnamese addresses, so the config drops ONLY MARKED wards. The single markerless
example is marked `__skip`; with the marker present ("..., Phường Bến Nghé, Quận
1, ...") it parses cleanly. All ward-omitted and marked-ward forms are green.

## Secondary unit
Floor / apartment / block: Tầng (floor), Lầu (floor, southern), Phòng (room),
Căn, Lô (lot/block), plus English Floor/Room/Block — "Tầng 5" → sec_unit_type
Tầng, sec_unit_num 5.

## Sources
- Smarty global address formatting (Vietnam)
- VALO Vietnam, Vietnam Discovery, YourVietnamTravel address-format guides
- Vietnam Post six-digit postcode system (2018); HCMC = 700000
- Wikipedia: "Provinces of Vietnam", "Administrative divisions of Vietnam"
