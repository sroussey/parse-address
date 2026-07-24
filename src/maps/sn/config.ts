import type { EuCountryConfig } from "../_eu/types";

/**
 * Senegal (SN) address configuration — French romanized form.
 *
 * Order: house number FIRST (when present), then the voie type + name
 *        ("10 Rue Paul Holle"). Streets are frequently unnumbered.
 * Type: leads the street name (prefix), kept verbatim (Rue, Avenue/Av,
 *        Boulevard/Bd, Impasse, Place, Allée). Particles stay with the name.
 * Quartier: a neighbourhood ("Médina", "Plateau", "Point E", "Sicap Liberté")
 *        commonly sits between the street and the city (usually Dakar); it is
 *        not a routing field, so a recognised quartier is CONSUMED and DROPPED
 *        (areaNames). Unknown quartiers are a documented failure mode.
 * Postcode: a 5-digit code exists (introduced 2018) but is RARELY written; most
 *        addresses have NO postcode. It is optional and precedes the city
 *        ("12500 Dakar") when present.
 * PO box: DOMINANT. "BP" / "Boîte Postale" ("BP 3225, Dakar"). Most Senegalese
 *        mail is delivered to a box, not to a street.
 */

const TYPES = [
  "Boulevard", "Résidence", "Residence", "Impasse", "Passage", "Avenue",
  "Rond-point", "Rond Point", "Place", "Allée", "Allee", "Rue", "Route",
  // abbreviations (kept verbatim)
  "Bd", "Bld", "Av", "Imp", "Rte",
];

// Major Dakar-area quartiers (and a few other cities). A recognised
// neighbourhood before the city is consumed and dropped.
const QUARTIERS = [
  "Sicap Liberté", "Sicap Baobabs", "Fann Résidence", "Fann Residence",
  "Grand Dakar", "Grand Yoff", "Point E", "Sacré-Cœur", "Sacre-Coeur",
  "Gueule Tapée", "Parcelles Assainies", "Zone de Captage", "Cité Keur Gorgui",
  "Médina", "Medina", "Plateau", "Fann", "Mermoz", "Liberté", "Sicap",
  "Yoff", "Ouakam", "Ngor", "Almadies", "HLM", "Colobane", "Amitié",
  "Dieuppeul", "Hann", "Bopp", "Baobabs",
];

export const snConfig: EuCountryConfig = {
  code: "sn",
  country: "SN",
  countryNames: ["Sénégal", "Senegal", "SEN", "SN"],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // Optional 5-digit code before the city; usually absent.
  postalPattern: "(?<postal_code>\\d{5})",
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},

  // A recognised quartier between the street and the city is consumed/dropped.
  areaNames: QUARTIERS,

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Étage|Etage|Immeuble|Imm\\.?|Villa|Bureau)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement", appt: "Appt", apt: "Appt", app: "Appt",
    étage: "Étage", etage: "Étage", immeuble: "Immeuble", imm: "Immeuble",
    villa: "Villa", bureau: "Bureau",
  },

  poBoxNames: ["BP", "B.P", "Boîte Postale", "Boite Postale"],
  poBoxDisplayMap: {
    bp: "BP", "b.p": "BP", "boîte postale": "BP", "boite postale": "BP",
  },
};

export default snConfig;
