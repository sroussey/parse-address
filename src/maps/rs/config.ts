import type { EuCountryConfig } from "../_eu/types";

/**
 * Serbian (RS) address configuration -- LATIN script.
 *
 * Serbian is digraphia: written in both Cyrillic ("Улица Делиградска 2") and
 * Latin ("Ulica Deligradska 2"). This config models the LATIN form only;
 * Cyrillic input is a documented failure mode (the type/city vocab and the
 * `[^,\d]` name classes are Latin, and the Cyrillic "улица" is not in `types`).
 *
 * Order: street name first, house number after ("Ulica Deligradska 2",
 *        "Bulevar kralja Aleksandra 73", "Njegoševa 5").
 * Type:  only a LEADING generic is extracted -- "Ulica", "Bulevar" (Bul.),
 *        "Trg", "Šetalište", "Obala", "Put", "Aleja". The very common TRAILING
 *        "ulica" ("Njegoševa ulica", "Cara Dušana ulica") is not a leading word,
 *        so it stays inside the name with `type` null -- the same convention HR
 *        and CZ use.
 * Postcode: five digits, no space, BEFORE the city ("11000 Beograd"), with an
 *        optional international "RS-" prefix sunk into a `drop` group.
 * No region/okrug line in postal addresses; the Belgrade municipality form
 * ("..., Savski Venac, Beograd 11000") is not modelled (see research §7).
 */

// Only leading generics. "Venac"/"Kej" are intentionally omitted: they almost
// always TRAIL ("Obilićev venac", "Karađorđev kej") and would wrongly pull the
// house number into the name if treated as a leading prefix.
const TYPES = [
  "Šetalište", "Setaliste", "Bulevar", "Obala", "Ulica", "Aleja", "Trg", "Put",
  // rare abbreviations
  "Bul", "Ul",
];

export const rsConfig: EuCountryConfig = {
  code: "rs",
  country: "RS",
  countryNames: ["Srbija", "Serbia", "SRB", "RS"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Five digits, before the city; optional "RS-" prefix dropped (see HR/SI).
  postalPattern: "(?:(?<drop>RS-))?(?<postal_code>\\d{5})",

  // House number plus an optional single-letter suffix ("48C", "2a", "5").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
};

export default rsConfig;
