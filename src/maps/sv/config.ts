import type { EuCountryConfig } from "../_eu/types";

/**
 * Salvadoran (SV) address configuration.
 *
 * Order: street TYPE + name FIRST ("Calle Rubén Darío", "Avenida Los Andes",
 *        "Boulevard de los Héroes", "Pasaje 1"), then the house number AFTER the
 *        name, usually with a "#"/"No." marker ("Calle Arce #123"). The San
 *        Salvador grid uses "Calle"/"Avenida" + a numbered/oriented name
 *        ("Calle Poniente", "Avenida Norte"), so digits are allowed in the name.
 * Type: leads the name (prefix), verbatim (Calle / C., Avenida / Av., Pasaje /
 *        Pje., Boulevard / Bulevar / Blvd., Diagonal, Alameda, Autopista,
 *        Carretera, Final).
 * Colonia / Residencial / Urbanización / Reparto: the neighbourhood routing
 *        unit, written between the street and the city. It has no output field
 *        and is CONSUMED and DROPPED via a `(?<drop>...)` inside `secUnitPattern`.
 * Postcode: 4 digits (Correos de El Salvador), written AFTER the city with no
 *        comma ("San Salvador 1101"). Optional (usage is light). Modelled as
 *        `after-city`.
 * State: the departamento (14) -- when written it precedes the postcode after a
 *        comma ("San Miguel, San Miguel 3301"); `countyPattern` is restricted to
 *        the 14-name list so the country name is never captured as the region.
 */

const TYPES = [
  "Prolongación", "Prolongacion", "Boulevard", "Bulevar", "Autopista",
  "Carretera", "Diagonal", "Alameda", "Avenida", "Pasaje", "Paseo", "Calle",
  "Final", "Callejón", "Callejon",
  // abbreviations (kept verbatim)
  "Blvd.", "Av.", "Av", "C.", "Pje.", "Diag.",
];

// 14 departamentos, longest-first, spaces -> \s+.
const STATES = [
  "San Salvador", "San Vicente", "San Miguel", "La Libertad", "La Unión",
  "La Union", "La Paz", "Santa Ana", "Ahuachapán", "Ahuachapan", "Chalatenango",
  "Cuscatlán", "Cuscatlan", "Sonsonate", "Usulután", "Usulutan", "Morazán",
  "Morazan", "Cabañas", "Cabanas",
].sort((a, b) => b.length - a.length);
const REGION_ALT = STATES.map((s) => s.replace(/ /g, "\\s+")).join("|");

export const svConfig: EuCountryConfig = {
  code: "sv",
  country: "SV",
  countryNames: ["El Salvador", "EL SALVADOR", "SLV", "SV"],
  order: "street-number",
  typePlacement: "prefix",
  postalPlacement: "after-city",
  normalizeTypeCase: false,
  allowDigitsInName: true,

  // 4-digit CP, after the city (trailing). Optional (frequently omitted).
  postalPattern: "(?<postal_code>\\d{4})",
  // Number: optional "#"/"No."/"Nº" marker, digits, optional letter suffix; OR
  // "s/n".
  houseNumberPattern:
    "(?:(?:No\\.?|N[°ºo]\\.?|\\#)\\s*)?(?:(?<number>\\d+)(?<civic_number_suffix>\\s?[A-Za-z](?![A-Za-z]))?|(?<civic_number_suffix_2>[sS]/[nN]))",

  types: TYPES,
  typeDisplayMap: {},

  // Departamento captured after the city; restricted to the 14-name list so a
  // trailing country name is not mistaken for the region.
  countyPattern: `(?:${REGION_ALT})`,
  regionMap: {
    "la union": "La Unión", ahuachapan: "Ahuachapán", cuscatlan: "Cuscatlán",
    usulutan: "Usulután", morazan: "Morazán", cabanas: "Cabañas",
  },

  // Colonia / Residencial / Urbanización / Reparto / Barrio (dropped) OR a real
  // Apartamento / Local / Nivel secondary unit -- whichever occupies the single
  // slot between the street and the city.
  secUnitPattern:
    "(?:(?<drop>(?:Colonia|Col\\.?|Residencial|Resid\\.?|Res\\.?|Urbanización|Urbanizacion|Urb\\.?|Reparto|Repto\\.?|Lotificación|Lotificacion|Lotif\\.?|Barrio|Bo\\.?)\\s+[^,\\n]+)|(?<sec_unit_type>Apartamento|Apto|Apt|Local|Piso|Nivel|Edificio|Edif)\\.?\\s*(?<sec_unit_num>[\\wºª°-]+)?)",
  secUnitDisplayMap: {
    apartamento: "Apto", apto: "Apto", apt: "Apto", local: "Local",
    piso: "Piso", nivel: "Nivel", edificio: "Edif", edif: "Edif",
  },

  poBoxNames: ["Apartado Postal", "Apartado", "Apdo."],
  poBoxDisplayMap: {
    "apartado postal": "Apartado Postal", apartado: "Apartado Postal",
    "apdo.": "Apartado Postal",
  },
};

export default svConfig;
