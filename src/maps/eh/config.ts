import type { EuCountryConfig } from "../_eu/types";

/**
 * Western Sahara (EH) address configuration — French/Latin form.
 *
 * DISPUTED TERRITORY: the areas under Moroccan administration (El Aaiún /
 * Laayoune, Dakhla, Smara, Boujdour) are addressed in the MOROCCAN format
 * (Barid Al-Maghrib / La Poste), so this config mirrors the Morocco (MA) idiom.
 *
 * Order: house number FIRST, then the voie type + name ("12 Rue de Smara"). A
 *   comma after the number is common ("12, Rue ...").
 * Type: leads the street name (prefix), kept verbatim — Rue, Avenue/Av., Bd,
 *   Boulevard, Impasse/Imp, Place, Résidence, and the romanized Arabic
 *   "Zankat"/"Derb" for a medina street/alley. Particles (de/du/de la/des) stay
 *   with the name.
 * Quartier: a neighbourhood ("Colomina", "Hay Essalam", "Maatalla", "Hay Al
 *   Wahda") sits between the street and the city and carries no output field, so
 *   a recognised quartier is CONSUMED and DROPPED (areaNames). Unknown quartiers
 *   are a documented failure mode.
 * Postcode: exactly 5 numeric digits, OPTIONAL, written AFTER the city
 *   ("Laayoune 70000"). Cities route 70000 (Laayoune), 71000 (Boujdour),
 *   72000 (Smara), 73000 (Dakhla).
 * PO box: "BP" / "Boîte Postale". Arabic-script addresses are out of scope.
 */

const TYPES = [
  "Boulevard", "Résidence", "Residence", "Impasse", "Passage", "Avenue",
  "Lotissement", "Rond-point", "Rond Point", "Place", "Allée", "Allee",
  "Zankat", "Zanqat", "Zanka", "Zenkat", "Derb", "Rue", "Route",
  // abbreviations (kept verbatim)
  "Bd", "Bld", "Av", "Imp", "Rés", "Res", "Lot", "Rte",
];

// Recognised neighbourhoods of El Aaiún / Dakhla / Smara / Boujdour. A quartier
// before the city is consumed and dropped (it is not a routing field). Both bare
// ("Colomina") and "Hay X" prefixed forms.
const QUARTIERS = [
  "Colomina Nueva", "Colomina", "Hay Essalam", "Hay Al Wahda", "Hay Al Amal",
  "Hay Al Aouda", "Hay Al Matar", "Hay Al Qods", "Maatalla", "Madina Mounawara",
  "Quartier Administratif", "Ville Nouvelle", "El Aaiún Plage",
];

export const ehConfig: EuCountryConfig = {
  code: "eh",
  country: "EH",
  countryNames: [
    "Western Sahara", "Sahara Occidental", "ESH", "EH", "Maroc", "Morocco",
  ],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  // Keep the voie type exactly as written (Bd, Av, Rue, Derb).
  normalizeTypeCase: false,

  postalPattern: "(?<postal_code>\\d{5})",
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},

  // No administrative region is written in a Saharan/Moroccan address, so nothing
  // may land in the trailing state slot (a stray quartier is dropped, not taken
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

export default ehConfig;
