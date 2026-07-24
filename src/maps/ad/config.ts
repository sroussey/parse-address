import type { EuCountryConfig } from "../_eu/types";

/**
 * Andorra (AD) address configuration.
 *
 * Andorra addresses in CATALAN (Correos/La Poste both historically delivered;
 * Correus Andorra now runs the domestic post). The grammar mirrors Spanish/
 * Catalan usage:
 *   Order:   via type + name, then the house number ("Carrer Prat de la Creu
 *            62", "Av. Meritxell, 96"). A comma before the number is optional.
 *   Type:    leads the name (prefix), kept verbatim incl. abbreviations (Av.,
 *            Ctra., C/). Particles ("de", "del", "de la", "dels", "d'") stay
 *            with the name.
 *   Postcode: "AD" + 3 digits, ONE per parish, written BEFORE the locality:
 *            AD100 Canillo, AD200 Encamp, AD300 Ordino, AD400 La Massana,
 *            AD500 Andorra la Vella, AD600 Sant Julia de Loria,
 *            AD700 Escaldes-Engordany.
 *   City:    the parish or a village within it (Pas de la Casa, Arinsal,
 *            Soldeu, El Tarter, Santa Coloma, Sispony, La Cortinada, ...).
 *   No separate state/region (the parish is the locality). "s/n" marks a
 *   missing house number.
 */

const TYPES = [
  // multiword first
  "Urbanització", "Urbanitzacio",
  // full words (Catalan)
  "Avinguda", "Carretera", "Travessera", "Travessia", "Cantonada", "Baixada",
  "Passatge", "Placeta", "Plaçeta", "Rotonda", "Passeig", "Carrer", "Pujada",
  "Ronda", "Rambla", "Plaça", "Placa", "Camí", "Cami", "Vial", "Via",
  // abbreviations (kept verbatim)
  "Av.", "Av", "Ctra.", "Ctra", "Ptge.", "Ptge", "Pge.", "Pl.", "C/", "Cª",
];

export const adConfig: EuCountryConfig = {
  code: "ad",
  country: "AD",
  countryNames: ["Principat d'Andorra", "Principat d Andorra", "Andorra", "AND", "AD"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "before-city",
  normalizeTypeCase: false,

  // "AD" + 3 digits. Kept uppercase.
  postalPattern: "(?<postal_code>AD\\d{3})",
  postalFormat: (raw: string) => raw.toUpperCase().replace(/\s+/g, ""),
  // Optional "núm." marker, then the number (+ optional letter/bis), OR "s/n".
  houseNumberPattern:
    "(?:(?:n\\.?º\\.?|núm\\.?|núm|nº)\\s*)?(?:(?<number>\\d+(?:-\\d+)?)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z])|\\s?bis)?|(?<civic_number_suffix_2>s/n))",

  types: TYPES,
  typeDisplayMap: {},

  // Catalan floor+door ("2n 1a", "àtic", "baixos") or a marked "pis/porta".
  secUnitPattern:
    "(?:(?<sec_unit_type>pis|porta|pta\\.?|escala|esc\\.?|bloc|edifici|ed\\.?|planta)\\s*(?<sec_unit_num>[\\dA-Za-zªº.-]+)" +
    "|(?<sec_unit_num_2>(?:\\d+\\s*(?:r|n|t|è|é|a)|àtic|atic|baixos?|baix|sobreàtic|sobreatic|entresòl|entresol|principal|pral\\.?)" +
    "(?:[\\s-]+(?:\\d+\\s*a|[A-Za-z](?![A-Za-z])|dreta|esquerra))?))",
  secUnitDisplayMap: {
    pis: "Pis", porta: "Porta", pta: "Porta", escala: "Escala", esc: "Escala",
    bloc: "Bloc", edifici: "Edifici", ed: "Edifici", planta: "Planta",
  },
  defaultSecUnitType: "Pis",

  poBoxNames: ["Apartat de Correus", "Apartat", "AP"],
  poBoxDisplayMap: {
    "apartat de correus": "Apartat de Correus", apartat: "Apartat", ap: "Apartat",
  },
};

export default adConfig;
