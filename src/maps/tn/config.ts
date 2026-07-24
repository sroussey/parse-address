import type { EuCountryConfig } from "../_eu/types";

/**
 * Tunisia (TN) address configuration — French romanized form.
 *
 * Order: house number FIRST, then the voie type + name ("12 Rue du Caire"),
 *        French convention (La Poste Tunisienne). Numbers may carry no comma.
 * Type: leads the street name (prefix), kept verbatim (Rue, Avenue/Av,
 *        Boulevard/Bd, Impasse, Passage, Place, Résidence, and — very common in
 *        Tunisia — Cité, a planned residential estate: "Cité Ennasr"). Particles
 *        (de/du/de la/des) and the Arabic article "El" stay with the name.
 * Postcode: exactly 4 numeric digits, written BEFORE the city on the last line
 *        ("1002 Tunis"). First two digits = governorate, last two = delivery
 *        office. Leading zeros are significant.
 * CEDEX: a bulk-mail marker after the city ("1080 Tunis Cedex"), dropped.
 * PO box: "BP" / "Boîte Postale" ("BP 350, 1080 Tunis Cedex"). Arabic-script
 *        addresses are out of scope (a documented failure mode).
 */

const TYPES = [
  "Boulevard", "Résidence", "Residence", "Impasse", "Passage", "Avenue",
  "Rond-point", "Rond Point", "Place", "Allée", "Allee", "Cité", "Cite",
  "Rue", "Route",
  // abbreviations (kept verbatim)
  "Bd", "Bld", "Av", "Imp", "Rés", "Res", "Rte",
];

export const tnConfig: EuCountryConfig = {
  code: "tn",
  country: "TN",
  countryNames: ["Tunisie", "Tunisia", "TUN", "TN"],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Exactly 4 digits, before the commune. A 4-digit run is never a house number
  // here (house numbers are <= 3 digits in practice, but kept <= 4 for safety
  // via the leading position; the postcode is disambiguated by sitting in the
  // place tail).
  postalPattern: "(?<postal_code>\\d{4})",
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},

  // Drop the "Cedex" delivery marker from the city (with or without a number).
  citySuffixPattern: "\\s+CEDEX(?:\\s+\\d{1,3})?",

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Étage|Etage|Immeuble|Imm\\.?|Bloc|Bureau|Escalier|Esc\\.?)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement", appt: "Appt", apt: "Appt", app: "Appt",
    étage: "Étage", etage: "Étage", immeuble: "Immeuble", imm: "Immeuble",
    bloc: "Bloc", bureau: "Bureau", escalier: "Escalier", esc: "Escalier",
  },

  poBoxNames: ["BP", "B.P", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    bp: "BP", "b.p": "BP", "boîte postale": "BP", "boite postale": "BP",
  },
};

export default tnConfig;
