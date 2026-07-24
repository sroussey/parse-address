import type { EuCountryConfig } from "../_eu/types";

/**
 * Morocco (MA) address configuration — French romanized form.
 *
 * Order: house number FIRST, then the voie type + name ("12 Rue Ibn Batouta"),
 *        French colonial convention (Barid Al-Maghrib / La Poste). A comma after
 *        the number is common ("12, Rue ...").
 * Type: leads the street name (prefix), kept verbatim (Rue, Avenue/Av., Bd,
 *        Impasse/Imp, Résidence, and the romanized Arabic "Derb"/"Zankat" for a
 *        medina street/alley). Particles (de/du/de la/des) stay with the name.
 * Quartier: a neighbourhood ("Maarif", "Agdal", "Hay Riad", "Guéliz") sits
 *        between the street and the city and carries no output field, so a
 *        recognised quartier is CONSUMED and DROPPED (areaNames). Unknown
 *        quartiers are a documented failure mode.
 * Postcode: exactly 5 numeric digits, written AFTER the city on the last line
 *        ("Casablanca 20250"); first two digits route the province. Barid
 *        Al-Maghrib also prints it BEFORE the city ("20250 Casablanca") — the
 *        postcode-first variant is a documented failure mode.
 * PO box: "BP" / "Boîte Postale" ("BP 1234, Rabat"). Arabic-script addresses are
 *        out of scope (a documented failure mode).
 */

const TYPES = [
  "Boulevard", "Résidence", "Residence", "Impasse", "Passage", "Avenue",
  "Lotissement", "Rond-point", "Rond Point", "Place", "Allée", "Allee",
  "Zankat", "Zanqat", "Zanka", "Zenkat", "Derb", "Rue", "Route",
  // abbreviations (kept verbatim)
  "Bd", "Bld", "Av", "Imp", "Rés", "Res", "Lot", "Rte",
];

// Major quartiers (Casablanca / Rabat / Marrakech / Fès / Tanger). A recognised
// neighbourhood before the city is consumed and dropped (it is not a routing
// field here). Both bare ("Maarif") and "Hay X" / "Quartier X" prefixed forms.
const QUARTIERS = [
  "Quartier Industriel", "Hay Mohammadi", "Hay Hassani", "Hay Riad",
  "Ain Diab", "Aïn Diab", "Sidi Maarouf", "Sidi Bernoussi", "Roches Noires",
  "Ville Nouvelle", "Yacoub El Mansour", "Sidi Youssef Ben Ali",
  "Maarif", "Maârif", "Gauthier", "Bourgogne", "Anfa", "Oasis", "Belvédère",
  "Agdal", "Hassan", "Souissi", "Guéliz", "Gueliz", "Hivernage", "Hamria",
  "Medina", "Médina", "Palmeraie",
];

export const maConfig: EuCountryConfig = {
  code: "ma",
  country: "MA",
  countryNames: ["Maroc", "Morocco", "MAR", "MA"],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  // Moroccan corpora keep the voie type exactly as written (Bd, Av, Rue, Derb).
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{5})",
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},

  // No administrative region is written in a Moroccan address, so nothing may
  // land in the trailing state slot (a stray quartier is dropped, not mis-taken
  // as a state).
  countyPattern: "(?!x)x",

  // A recognised quartier between the street and the city is consumed/dropped.
  areaNames: QUARTIERS,

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Étage|Etage|Immeuble|Imm\\.?|Bâtiment|Batiment|Bloc|Bureau)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement", appt: "Appt", apt: "Appt", app: "Appt",
    étage: "Étage", etage: "Étage", immeuble: "Immeuble", imm: "Immeuble",
    bâtiment: "Bâtiment", batiment: "Bâtiment", bloc: "Bloc", bureau: "Bureau",
  },

  poBoxNames: ["BP", "B.P", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    bp: "BP", "b.p": "BP", "boîte postale": "BP", "boite postale": "BP",
  },
};

export default maConfig;
