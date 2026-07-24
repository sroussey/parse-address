import type { EuCountryConfig } from "../_eu/types";

/**
 * Côte d'Ivoire / Ivory Coast (CI) address configuration — French romanized form.
 *
 * The DOMINANT form is a PO box, not a street: "01 BP 1234 Abidjan 01". The
 * leading two-digit number is the postal district ("01"…"26" in Abidjan) and is
 * repeated after the city as the routing code. La Poste distributes almost all
 * mail through boxes, so this postal-box shape is what the config centres on.
 *
 * Order: house number FIRST (when present), then the voie type + name
 *        ("7 Rue des Jardins"). Abidjan streets are often numbered ("Rue 12").
 * Type: leads the street name (prefix), kept verbatim (Rue, Avenue/Av,
 *        Boulevard/Bd, Impasse, Place, Allée). Particles stay with the name.
 * Commune -> city: Abidjan is divided into communes (Cocody, Plateau, Yopougon,
 *        Treichville, Marcory, Adjamé, Deux Plateaux, Riviera…). In a street
 *        address the commune is the meaningful locality and is kept as the CITY;
 *        the trailing metropolis marker "Abidjan" is consumed (citySuffix) and
 *        not emitted. A bare commune with no "Abidjan" is likewise the city.
 * Postcode: the two-digit district written after the city ("Abidjan 01") — in
 *        the box form the city IS "Abidjan" and the district is the postcode.
 * PO box: "NN BP" (district-prefixed) or bare "BP" / "Boîte Postale".
 */

// Abidjan (and other cities') district-prefixed box words, longest/most-specific
// FIRST so the ordered alternation matches "01 BP" before bare "BP". Districts
// 01-30 cover Abidjan's postal zones with headroom.
const DISTRICTS = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, "0"));
const CI_BP_NAMES = [
  ...DISTRICTS.map((d) => `${d} BP`),
  "BP",
  "Boîte Postale",
  "Boite Postale",
];
const CI_BP_DISPLAY: Record<string, string> = {
  bp: "BP",
  "boîte postale": "BP",
  "boite postale": "BP",
};
for (const d of DISTRICTS) CI_BP_DISPLAY[`${d} bp`] = `${d} BP`;

const TYPES = [
  "Boulevard", "Résidence", "Residence", "Impasse", "Passage", "Avenue",
  "Rond-point", "Rond Point", "Place", "Allée", "Allee", "Rue", "Route",
  // abbreviations (kept verbatim)
  "Bd", "Bld", "Av", "Imp", "Rte",
];

export const ciConfig: EuCountryConfig = {
  code: "ci",
  country: "CI",
  countryNames: ["Côte d'Ivoire", "Cote d'Ivoire", "Ivory Coast", "CIV", "CI"],
  order: "number-street",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,

  // Two-digit routing district after the city ("Abidjan 01").
  postalPattern: "(?<postal_code>\\d{2})",
  houseNumberPattern:
    "(?<number>\\d{1,4})(?:\\s+(?<civic_number_suffix>bis|ter|[A-Za-z])(?=[\\s,]))?",

  types: TYPES,
  typeDisplayMap: {},

  // The trailing metropolis marker "Abidjan" after a commune is consumed (the
  // commune is the emitted city). Optional, so a bare "Abidjan" line keeps
  // Abidjan as the city.
  citySuffixPattern: "[\\s,]+Abidjan",
  // No region is written, so nothing may land in the trailing state slot.
  countyPattern: "(?!x)x",

  secUnitPattern:
    "(?<sec_unit_type>Appartement|Appt\\.?|Apt\\.?|App\\.?|Étage|Etage|Immeuble|Imm\\.?|Villa|Lot|Bureau)\\.?\\s*(?<sec_unit_num>[\\w-]+)?",
  secUnitDisplayMap: {
    appartement: "Appartement", appt: "Appt", apt: "Appt", app: "Appt",
    étage: "Étage", etage: "Étage", immeuble: "Immeuble", imm: "Immeuble",
    villa: "Villa", lot: "Lot", bureau: "Bureau",
  },

  poBoxNames: CI_BP_NAMES,
  poBoxDisplayMap: CI_BP_DISPLAY,
};

export default ciConfig;
