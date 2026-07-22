import XRegExp from "xregexp";
import type { EuCountryConfig } from "./types";

XRegExp.uninstall("namespacing");

/**
 * Escape a literal token for use inside an `x` (free-spacing) pattern. Regex
 * metacharacters are escaped and literal spaces become `\s+` (a bare space is
 * ignored in free-spacing mode, which would silently break multiword tokens
 * like "Grande Rue" or "United Kingdom").
 */
function lit(s: string): string {
  return XRegExp.escape(s).replace(/\ /g, "\\s+");
}

/**
 * The compiled grammar for one European country. Mirrors the four entry-point
 * regexes the US/CA rulesets expose, so `AddressParserEU` can dispatch the same
 * way `AddressParserUS` does.
 */
export interface EuRuleset {
  address: RegExp;
  street_address: RegExp;
  informal_address: RegExp;
  po_address: RegExp;
  place_only: RegExp;
  po_box: string;
  config: EuCountryConfig;
}

/** Build the trailing "place" fragment (postcode + city + optional region/country). */
function buildPlace(config: EuCountryConfig): string {
  const country = config.countryNames.length
    ? `(?:[\\s,]+(?<country>${config.countryNames
        .map((n) => lit(n))
        .join("|")}))?`
    : "";

  const region = config.regionPattern
    ? `(?:[\\s,]+(?:${config.regionPattern}))?`
    : "";

  // City stops before a comma, a region, or the country. We keep it permissive
  // (any non-comma, non-digit run) so accented and multi-word names survive.
  const cityInner = config.cityAllowsCommas
    ? "[^\\n]"
    : config.cityAllowsDigits
    ? "[^,\\n]"
    : "[^,\\d\\n]";
  const city = `(?<city>${cityInner}+?)`;
  const county = config.countyPattern ?? "[^,\\d\\n]+?";
  const citySuffix = config.citySuffixPattern ? `(?:${config.citySuffixPattern})?` : "";

  if (config.postalPlacement === "before-city") {
    // The postcode is optional so a "..., City (PROV)" tail with no CAP parses.
    return `
      (?:[\\s,]+
        (?:(?:${config.postalPattern})[\\s,]+)?
        ${city}
        ${citySuffix}
        ${region}
        ${country}
      )?`;
  }

  // after-city (UK/IE): post town, optional comma-delimited county, then the
  // postcode last. Two alternatives: (A) the postcode-present form (identical to
  // the original UK grammar -- optional town + postcode); (B) a postcode-absent
  // form (town + optional county), for Irish addresses with no Eircode. The
  // county carries no digits, so it never swallows a postcode.
  const cityB = city.replace("<city>", "<city_2>");
  return `
    (?:[\\s,]+
      (?:
        (?:${city}${citySuffix}(?:[,][\\s]*(?<state>${county}))?[\\s,]+)?
        (?:${config.postalPattern})
        |
        ${cityB}${citySuffix}(?:[,][\\s]*(?<state_2>${county}))?
      )
      ${country}
    )?`;
}

/** A standalone "postcode + city" (or "city + postcode") location line. */
function buildPlaceOnly(config: EuCountryConfig): string {
  const country = config.countryNames.length
    ? `(?:[\\s,]+(?<country>${config.countryNames
        .map((n) => lit(n))
        .join("|")}))?`
    : "";
  const region = config.regionPattern
    ? `(?:[\\s,]+(?:${config.regionPattern}))?`
    : "";
  const city = config.cityAllowsDigits
    ? `(?<city>[^,\\n][^,\\n]*?)`
    : `(?<city>[^,\\d\\n][^,\\d\\n]*?)`;
  const citySuffix = config.citySuffixPattern ? `(?:${config.citySuffixPattern})?` : "";

  if (config.postalPlacement === "before-city") {
    return `^\\s*(?:${config.postalPattern})[\\s,]+${city}${citySuffix}${region}${country}\\s*$`;
  }
  return `^\\s*${city}${citySuffix}(?:[,][\\s]*(?<state>[^,\\d\\n]+?))?[\\s,]+(?:${config.postalPattern})${country}\\s*$`;
}

/** Build the street + house-number core in the country's written order. */
function buildStreetCore(config: EuCountryConfig): string {
  const num = config.houseNumberPattern;
  // Longest type spelling first so "Grande Rue" wins over "Rue".
  const typeAlt = [...(config.types ?? [])]
    .sort((a, b) => b.length - a.length)
    .map(lit)
    .join("|");

  // For number-first orders the house number is already consumed at the front,
  // so a street name may safely contain digits ("Rue du 8 Mai 1945"). For
  // street-first orders digits are excluded so the trailing number is found.
  const numberFirst = config.order === "number-street";
  const nameChar = numberFirst || config.allowDigitsInName ? "[^,\\n]" : "[^,\\d\\n]";
  const name1 = `(?<street_1>${nameChar}+?)`;
  const name2 = `(?<street_2>${nameChar}+?)`;
  // A bare street name (no leading/trailing type).
  const plainName = `(?<street>${nameChar}+?)`;

  let streetBlock: string;
  switch (config.typePlacement) {
    case "prefix": {
      // Either "TYPE [name]" (name optional: "Grande Rue" is a whole type) or a
      // bare untyped name (lieu-dit). The type keeps an optional trailing dot.
      // The name may follow a space OR abut a type that ends in "/" or "."
      // (Spanish "C/Alcalá"), matched via a lookbehind on the separator.
      const sep = "(?:\\s+|(?<=[/.]))";
      streetBlock = `(?:(?<type>(?:${typeAlt})\\.?)(?:${sep}${name1})?|${name2})`;
      break;
    }
    case "suffix": {
      // Either "name TYPE" (greedy name so the *rightmost* type word wins:
      // "Notting Hill Gate" -> "Notting Hill" + "Gate") or a bare untyped name
      // ("Deansgate"). Alternation is type-first so a real type is preferred.
      const g1 = `(?<street_1>${nameChar}+)`;
      const g2 = `(?<street_2>${nameChar}+)`;
      streetBlock = `(?:${g1}[\\s]+(?<type>${typeAlt})|${g2})`;
      break;
    }
    case "fused":
    case "none":
    default:
      streetBlock = plainName;
      break;
  }

  // The house number is optional in both orders (bare "Place de la République"
  // or a location-only line); a missing number simply leaves `number` unset.
  if (numberFirst) {
    return `(?:${num}[\\s,]+)?${streetBlock}`;
  }
  // street-number
  return `${streetBlock}(?:[\\s,]+${num})?`;
}

function buildSecUnit(config: EuCountryConfig): string {
  return config.secUnitPattern ? `(?:[\\s,]+(?:${config.secUnitPattern}))?` : "";
}

/**
 * The inner `(?<building>...)` capture: an optional run of preceding words plus
 * a trailing building keyword ("Ugland House", "Clifton House", or a bare
 * "Chambers"). The keyword must sit at a word boundary (start of the segment or
 * after a space), so an ordinary street ("Warehouse Lane") is never mistaken for
 * a building. Returns "" when the country supplies no `buildingKeywords`.
 */
function buildingGroup(config: EuCountryConfig): string {
  const kws = config.buildingKeywords ?? [];
  if (!kws.length) return "";
  const alt = [...kws].sort((a, b) => b.length - a.length).map(lit).join("|");
  return `(?<building>(?:[^,\\n]*?\\s)?(?:${alt}))`;
}

export function buildEuRuleset(config: EuCountryConfig): EuRuleset {
  const core = buildStreetCore(config);
  const place = buildPlace(config);
  const secUnit = buildSecUnit(config);
  // A leading secondary unit ("Flat 4, 12 ..."), used by the UK.
  const secLead =
    config.secUnitPlacement === "before" && config.secUnitPattern
      ? `(?:(?:${config.secUnitPattern})[\\s,]+)?`
      : "";
  const secTrail = config.secUnitPlacement === "before" ? "" : secUnit;

  // An optional leading "Building Name," segment (registered-agent / company
  // filing addresses). Empty for countries without `buildingKeywords`.
  const bg = buildingGroup(config);
  const buildingLead = bg ? `(?:${bg}\\s*,[\\s]+)?` : "";
  // In a PO-box line the building sits between the box number and the place,
  // both comma-delimited ("PO Box 309, Ugland House, George Town ..."); the
  // place fragment supplies its own leading separator, so no trailing comma here.
  const buildingPo = bg ? `(?:[\\s,]+${bg})?` : "";

  const poNames = (config.poBoxNames ?? []).map((n) => lit(n));
  // Alternation used both to detect PO-box inputs and to capture the box word.
  const po_box = poNames.length ? poNames.join("|") : "(?!x)x"; // never-match sentinel

  const address = XRegExp(
    `^\\s*${buildingLead}${secLead}${core}${secTrail}${place}[\\s,]*$`,
    "xi"
  );

  // Street-only: same core, no trailing place required.
  const street_address = XRegExp(`^\\s*${buildingLead}${secLead}${core}${secTrail}`, "xi");

  // Informal: tolerate a missing house number and a partial place tail.
  const informal_address = XRegExp(
    `^\\s*${buildingLead}${secLead}${core}${secTrail}${place}`,
    "xi"
  );

  // PO-box shape: box lead-in word (captured) + (optionally grouped) box number,
  // then an optional building, then the place. The box replaces the street.
  const po_address = XRegExp(
    `^\\s*(?<sec_unit_type>${po_box})[\\s.:]*(?<sec_unit_num>\\d[\\d\\s-]*\\d|\\d)?${buildingPo}${place}\\s*$`,
    "xi"
  );

  const place_only = XRegExp(buildPlaceOnly(config), "xi");

  return {
    address,
    street_address,
    informal_address,
    po_address,
    place_only,
    po_box,
    config,
  };
}
