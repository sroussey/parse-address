import type { EuCountryConfig } from "/home/user/parse-address/src/maps/_eu/types";

/**
 * Greenland (GL) address configuration.
 *
 * Greenland is a Danish autonomous territory and uses the Danish postal system,
 * but its street/building grammar is distinctive:
 *   - Street name FIRST, then the premises identifier AFTER. Greenlandic street
 *     names are long single or multi-word Kalaallisut/Danish words
 *     ("Aqqusinersuaq", "Jens Kreutzmannip Aqqutaa", "Imaneq") and carry no
 *     productive fused generic, so the type is NOT parsed (typePlacement "none").
 *   - Older stock and settlements identify a building by its "B-number"
 *     (bygningsnummer), e.g. "B-1140". When the premises token is a B-number it
 *     is emitted as `building` (via postNormalize) rather than as `number`; a
 *     plain "10" / "10A" stays in `number`/`civic_number_suffix`.
 *   - Postcode is 4 digits, the first two always "39" (3900-3992), written
 *     BEFORE the city ("3900 Nuuk"). No "GL-" prefix is used domestically.
 *   - No state/region.
 *
 * Sources: Wikipedia "Postal codes in Greenland" (GL, 4 digits, "39"..);
 * ResearchGate (house-number + B-number plates on Nuuk buildings); Smarty
 * (https://www.smarty.com/global-address-formatting/greenland-address-format-examples);
 * PostGrid (https://www.postgrid.com/global-address-format/greenland-address-format/);
 * GeoPostcodes (https://www.geopostcodes.com/country/greenland/address-format/);
 * TELE-POST / Post Greenland (postcode-before-city, "Postboks" boxes).
 */

export const glConfig: EuCountryConfig = {
  code: "gl",
  country: "GL",
  countryNames: ["Kalaallit Nunaat", "Grønland", "Greenland", "GRL", "GL"],
  order: "street-number",
  typePlacement: "none",
  postalPlacement: "before-city",

  // 4 digits, first two "39" (Greenland's whole range is 3900-3992).
  postalPattern: "(?<postal_code>39\\d{2})",
  // Premises: a B-number ("B-1140" / "B1140"), or a plain number with an
  // optional glued single-letter suffix ("10A"). The B-number is rehomed to
  // `building` in postNormalize.
  houseNumberPattern:
    "(?<number>[Bb]-?\\d+|\\d+)(?<civic_number_suffix>[A-Za-z](?![A-Za-z]))?",

  typeDisplayMap: {},

  poBoxNames: ["Postboks", "Postbox", "Boks", "PO Box", "P.O. Box"],
  poBoxDisplayMap: { postboks: "Postboks", boks: "Postboks", postbox: "Postboks", "po box": "PO Box", "p.o. box": "PO Box" },

  // A premises captured as a B-number belongs in `building`, not `number`.
  // Canonicalise it to "B-<digits>" and drop the (now empty) number field.
  postNormalize: (parsed: Record<string, any>) => {
    const n = parsed.number;
    if (typeof n === "string") {
      const m = /^[Bb]-?(\d+)$/.exec(n);
      if (m) {
        parsed.building = "B-" + m[1];
        delete parsed.number;
        // A B-number never carries a letter suffix; discard any stray capture.
        if (parsed.civic_number_suffix) delete parsed.civic_number_suffix;
      }
    }
  },
};

export default glConfig;
