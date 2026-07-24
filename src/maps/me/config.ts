import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Montenegrin (ME) address configuration -- LATIN script.
 *
 * Order: street name first, house number after ("Njegoševa 25",
 *        "Bulevar Svetog Petra Cetinjskog 130", "Ulica Slobode 5").
 * Type:  only a LEADING generic is extracted -- "Ulica", "Bulevar", "Trg",
 *        "Obala", "Put", "Aleja", "Šetalište". A TRAILING "ulica" stays inside
 *        the name with `type` null (the HR/CZ convention). Many names stand
 *        alone ("Njegoševa", "Slobode").
 * Postcode: five digits, no space, BEFORE the city ("81000 Podgorica",
 *        "84000 Bijelo Polje" -- two-word cities), with an optional "ME-" prefix
 *        sunk into a `drop` group.
 * No region line and no state in Montenegrin postal addresses.
 *
 * Montenegro also uses both Latin and Cyrillic officially; this models Latin.
 */

const TYPES = [
  "Šetalište", "Setaliste", "Bulevar", "Obala", "Ulica", "Aleja", "Trg", "Put",
  // rare abbreviations
  "Bul", "Ul",
];

export const meConfig: EuCountryConfig = {
  code: "me",
  country: "ME",
  countryNames: ["Crna Gora", "Montenegro", "MNE", "ME"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Five digits, before the city; optional "ME-" prefix dropped (see HR/SI).
  postalPattern: "(?:(?<drop>ME-))?(?<postal_code>\\d{5})",

  // House number plus an optional single-letter suffix ("25", "130", "5a").
  houseNumberPattern:
    "(?<number>\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z0-9]))?",

  types: TYPES,
  typeDisplayMap: {},
};

export default meConfig;
