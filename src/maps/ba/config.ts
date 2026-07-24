import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Bosnia and Herzegovina (BA) address configuration -- LATIN script.
 *
 * Order: street name first, house number after ("Zmaja od Bosne 10",
 *        "Ulica Ferhadija 15", "Maršala Tita 22").
 * Type:  only a LEADING generic is extracted -- "Ulica", "Bulevar", "Trg",
 *        "Obala", "Put", "Aleja", "Šetalište". The common TRAILING "ulica"
 *        ("Titova ulica", "Ferhadija ulica") stays inside the name with `type`
 *        null (the HR/CZ convention). Many names are fully type-less
 *        ("Ferhadija", "Zmaja od Bosne").
 * Postcode: five digits, no space, BEFORE the city ("71000 Sarajevo"), with an
 *        optional international "BA-" prefix sunk into a `drop` group so the
 *        token-preservation guard never scores the stranded "BA-" as a lost
 *        street token.
 * No entity/canton line (Federation / Republika Srpska / Brčko) in postal
 * addresses -> no `state`.
 */

const TYPES = [
  "Šetalište", "Setaliste", "Bulevar", "Obala", "Ulica", "Aleja", "Trg", "Put",
  // rare abbreviations
  "Bul", "Ul",
];

export const baConfig: EuCountryConfig = {
  code: "ba",
  country: "BA",
  countryNames: [
    "Bosna i Hercegovina", "Bosnia and Herzegovina", "Bosnia", "BIH", "BA",
  ],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Five digits, before the city; optional "BA-" prefix dropped (see HR/SI).
  postalPattern: "(?:(?<drop>BA-))?(?<postal_code>\\d{5})",

  // House number plus an optional single-letter suffix ("10a", "6", "22").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
};

export default baConfig;
