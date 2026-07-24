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
  building_address: RegExp | null;
  settlement_only: RegExp | null;
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
  // Offshore filings write the country name BEFORE the (last) postcode
  // ("St Helier, Jersey, JE4 9WG"); consume it without capturing (the output
  // `country` is set from config regardless). Optional, so UK/IE -- which put
  // the country after the postcode -- are unaffected.
  const countryBefore = config.countryNames.length
    ? `(?:(?:${config.countryNames.map((n) => lit(n)).join("|")})[\\s,]+)?`
    : "";
  return `
    (?:[\\s,]+
      (?:
        (?:${city}${citySuffix}(?:[,][\\s]*(?<state>${county}))?[\\s,]+)?
        ${countryBefore}
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
function buildingGroup(config: EuCountryConfig, suffix = ""): string {
  const kws = config.buildingKeywords ?? [];
  if (!kws.length) return "";
  const alt = [...kws].sort((a, b) => b.length - a.length).map(lit).join("|");
  return `(?<building${suffix}>(?:[^,\\n]*?\\s)?(?:${alt}))`;
}

export function buildEuRuleset(config: EuCountryConfig): EuRuleset {
  const core = buildStreetCore(config);
  const place = buildPlace(config);
  const secUnit = buildSecUnit(config);
  // A leading secondary unit ("Flat 4, 12 ..."), used by the UK/offshore. A
  // floor written ordinal-first ("2nd Floor", "First Floor", "Ground Floor") is
  // also accepted -- its number precedes the type, the reverse of the config
  // pattern -- via distinct `*_5` groups folded to sec_unit_* in normalization.
  const floorFirst =
    "(?<sec_unit_num_5>\\d+(?:st|nd|rd|th)|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Ground|Lower|Upper|Mezzanine)\\s+(?<sec_unit_type_5>Floor)";
  const secLead =
    config.secUnitPlacement === "before" && config.secUnitPattern
      ? `(?:(?:${floorFirst}|${config.secUnitPattern})[\\s,]+)?`
      : "";
  const secTrail = config.secUnitPlacement === "before" ? "" : secUnit;

  // An optional development/area name ("Cricket Square", "Wickhams Cay 1") that
  // trails a building but is not the routing city; consumed, never emitted.
  // Copy before sorting: `config` is a shared module-level singleton and
  // `droppableTokens()` hands `config.areaNames` straight to callers.
  const areaAlt = [...(config.areaNames ?? [])]
    .sort((a, b) => b.length - a.length)
    .map(lit)
    .join("|");
  const areaDrop = areaAlt ? `(?:[\\s,]+(?:${areaAlt}))?` : "";

  // An optional leading "Building Name," segment (registered-agent / company
  // filing addresses). Empty for countries without `buildingKeywords`. The
  // keyword set is kept DISJOINT from the country's street types (see each
  // config), so a leading "<name> House/Chambers/Building" is unambiguously a
  // building while a real street like "9 Halkett Place" (Place is a type, not a
  // building word) parses as street+type. That lets this stay greedy.
  const bg = buildingGroup(config);
  // Type-word buildings ("Victoria Place") fire only when a house number
  // follows, via a `(?=\d)` lookahead -- see buildingTypeKeywords.
  // A type-word building must NOT begin with a house number: "Victoria Place"
  // (no leading digit) is a building, but "9 Halkett Place" (leading digit) is a
  // real street whose type is "Place". The leading word is therefore forced to
  // start with a non-digit, which also lets a non-numbered street follow the
  // building ("Trafalgar Court, Les Banques, ...").
  const typeKws = config.buildingTypeKeywords ?? [];
  const bgType = typeKws.length
    ? `(?<building_3>(?:[^,\\d\\n][^,\\n]*?\\s)?(?:${[...typeKws]
        .sort((a, b) => b.length - a.length)
        .map(lit)
        .join("|")}))`
    : "";
  const leadPure = bg ? `${bg}${areaDrop}\\s*,[\\s]+` : "";
  const leadType = bgType ? `${bgType}${areaDrop}\\s*,[\\s]*` : "";
  const leadAlts = [leadPure, leadType].filter(Boolean).join("|");
  const buildingLead = leadAlts ? `(?:${leadAlts})?` : "";
  // In a PO-box line the building sits between the box number and the place,
  // both comma-delimited ("PO Box 309, Ugland House, George Town ..."); the
  // place fragment supplies its own leading separator, so no trailing comma here.
  const buildingPo = bg ? `(?:[\\s,]+${bg}${areaDrop})?` : "";

  const poNames = (config.poBoxNames ?? []).map((n) => lit(n));
  // Alternation used both to detect PO-box inputs and to capture the box word.
  const po_box = poNames.length ? poNames.join("|") : "(?!x)x"; // never-match sentinel

  // An optional TRAILING PO box, sitting after the street and before the place
  // ("Clifton House, 75 Fort Street, PO Box 1350, George Town, ..."). Offshore
  // filings float the box freely; a leading box is handled by secLead/po_address
  // and a trailing one here. Named `*_2` (folded to sec_unit_* in normalize); if
  // a leading unit and a trailing box both appear, the box wins (last write).
  const poNum = config.poBoxNumberPattern ?? "\\d[\\d\\s-]*\\d|\\d";
  const poTrail = poNames.length
    ? `(?:[\\s,]+(?<sec_unit_type_6>${po_box})[\\s.:]*(?<sec_unit_num_6>${poNum}))?`
    : "";

  // Leading cluster order: an optional secondary unit ("Flat 4", "Suite 23")
  // may PRECEDE an optional building ("Suite 23, Portland House, 19 Town
  // Range"), matching UK and offshore usage; a bare building-first line
  // ("Ugland House, South Church Street") still works because the unit is
  // optional. (A building-first-then-unit order is not modelled.)
  const address = XRegExp(
    `^\\s*${secLead}${buildingLead}${core}${secTrail}${areaDrop}${poTrail}${place}[\\s,]*$`,
    "xi"
  );

  // Street-only: same core, no trailing place required.
  const street_address = XRegExp(`^\\s*${secLead}${buildingLead}${core}${secTrail}`, "xi");

  // Informal: tolerate a missing house number and a partial place tail.
  const informal_address = XRegExp(
    `^\\s*${secLead}${buildingLead}${core}${secTrail}${areaDrop}${poTrail}${place}`,
    "xi"
  );

  // PO-box shape: box lead-in word (captured) + (optionally grouped) box number,
  // then an optional building, then the place. The box replaces the street. A
  // building may also LEAD the box ("Sea Meadow House, PO Box 116, ..."), so an
  // optional pre-box building (named `building_2`, folded to `building` in
  // normalization) is allowed too -- the two orders never co-occur in one line.
  const bgPre = buildingGroup(config, "_2");
  const buildingLeadPo = bgPre ? `(?:${bgPre}${areaDrop}\\s*,[\\s]*)?` : "";
  const po_address = XRegExp(
    `^\\s*${buildingLeadPo}(?<sec_unit_type>${po_box})[\\s.:]*(?<sec_unit_num>${poNum})?${buildingPo}${place}\\s*$`,
    "xi"
  );

  const place_only = XRegExp(buildPlaceOnly(config), "xi");

  // Settlement-only line: "Bodden Town, Grand Cayman, KY1-1601" -- a bare
  // settlement followed by the island (a REQUIRED citySuffix) and the postcode,
  // with no street. Requiring the island suffix is what keeps it from claiming a
  // real numberless street ("Les Banques, St Peter Port, ..."), which has no
  // island token. Built only for after-city countries that define a citySuffix.
  const settlement_only =
    config.postalPlacement === "after-city" && config.citySuffixPattern
      ? XRegExp(
          `^\\s*(?<city>${
            config.cityAllowsDigits ? "[^,\\n]" : "[^,\\d\\n]"
          }+?)(?:${config.citySuffixPattern})[\\s,]+(?:${config.postalPattern})${
            config.countryNames.length
              ? `(?:[\\s,]+(?<country>${config.countryNames.map((n) => lit(n)).join("|")}))?`
              : ""
          }\\s*$`,
          "xi"
        )
      : null;

  // Building-only line: a building followed by a REQUIRED development/area, then
  // the place, with no street of its own ("OMC Chambers, Wickhams Cay 1, Road
  // Town, Tortola, VG1110"). The mandatory area is what keeps this from hijacking
  // a building-then-street line ("Ogier House, The Esplanade, ..."), which has no
  // area and is handled by `address` instead. Only built where both a building
  // keyword set and area names exist.
  const bgOnly = buildingGroup(config, "_4");
  const building_address =
    bgOnly && areaAlt
      ? XRegExp(
          `^\\s*${secLead}${bgOnly}(?:[\\s,]+(?:${areaAlt}))${poTrail}${place}[\\s,]*$`,
          "xi"
        )
      : null;

  return {
    address,
    street_address,
    informal_address,
    po_address,
    building_address,
    settlement_only,
    place_only,
    po_box,
    config,
  };
}
