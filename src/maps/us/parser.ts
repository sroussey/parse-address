import XRegExp from "xregexp";
import { each, isNumeric, capitalize } from "../../utils";
import { normalizeMap } from "./normalize";
import { streetAbbrevsToShortCodeMap } from "./street-abbrevs";
import addressRuleset from "./ruleset";
import { AddressParserImpl } from "../../types/parser";

export class AddressParserUS implements AddressParserImpl {
  normalizeAddress(parts) {
    const self = this;

    if (!parts) return null;
    const parsed: Record<string, any> = {};

    Object.keys(parts).forEach((part) => {
      if (["input", "index"].includes(part) || isNumeric(part)) {
        return;
      }

      const key = isNumeric(part.split("_").pop())
        ? part.split("_").slice(0, -1).join("_")
        : part;

      if (parts[part]) {
        parsed[key] = parts[part].trim().replace(/^\s+|\s+$|[^\w\s\-#&]/g, "");
      }
    });

    each(normalizeMap, function (map, key) {
      if (parsed[key] && map[parsed[key].toLowerCase()]) {
        parsed[key] = map[parsed[key].toLowerCase()];
      }
    });

    ["type", "type1", "type2"].forEach(function (key) {
      if (key in parsed) {
        // Map the address short code
        const lowerCaseType = parsed[key].toLowerCase();
        parsed[`short_street_${key}`] =
          self.findStreetTypeShortCode(lowerCaseType);

        parsed[key] =
          parsed[key].charAt(0).toUpperCase() +
          parsed[key].slice(1).toLowerCase();
      }
    });

    if (parsed.city) {
      const directionCode = addressRuleset.directionCode;
      parsed.city = XRegExp.replace(
        parsed.city,
        XRegExp(`^(?<dircode>${addressRuleset.dircode})\\s+(?=\\S)`, "ix"),
        function (match) {
          return capitalize(directionCode[match.dircode.toUpperCase()]) + " ";
        }
      );
    }

    switch (parts.number) {
      case "One":
        parsed.number = 1;
        break;
      case "Two":
        parsed.number = 1;
        break;
      case "Three":
        parsed.number = 1;
        break;
      case "Four":
        parsed.number = 1;
        break;
      case "Five":
        parsed.number = 1;
        break;
      case "Six":
        parsed.number = 1;
        break;
      case "Seven":
        parsed.number = 1;
        break;
      case "Eight":
        parsed.number = 1;
        break;
      case "Nine":
        parsed.number = 1;
        break;
    }

    parsed.country = "US";

    return parsed;
  }

  parseStreet(street_address: string) {
    const parts = XRegExp.exec(street_address, addressRuleset.street_address);
    return this.normalizeAddress(parts);
  }

  parseAddress(address: string) {
    const parts = XRegExp.exec(address, addressRuleset.address);
    return this.normalizeAddress(parts);
  }

  parseInformalAddress(address: string) {
    const parts = XRegExp.exec(address, addressRuleset.informal_address);
    return this.normalizeAddress(parts);
  }

  parsePoAddress(address: string) {
    const parts = XRegExp.exec(address, addressRuleset.po_address);
    return this.normalizeAddress(parts);
  }

  parseLocation(address: string) {
    if (XRegExp(addressRuleset.corner, "xi").test(address)) {
      return this.parseIntersection(address);
    }

    if (XRegExp("^" + addressRuleset.po_box, "xi").test(address)) {
      return this.parsePoAddress(address);
    }

    return this.parseAddress(address) || this.parseInformalAddress(address);
  }

  parseIntersection(address: string) {
    let parts = XRegExp.exec(address, addressRuleset.intersection);
    // @ts-ignore
    parts = this.normalizeAddress(parts);

    if (parts) {
      parts.type2 = parts.type2 || "";
      parts.type1 = parts.type1 || "";

      if ((parts.type2 && !parts.type1) || parts.type1 === parts.type2) {
        let type = parts.type2;
        const short_street_type = parts.short_street_type2;
        type = XRegExp.replace(type, /s\W*$/, "");

        if (XRegExp(`^${addressRuleset.type}$`, "ix").test(type)) {
          parts.type1 = parts.type2 = type;
          parts.short_street_type1 = parts.short_street_type2 =
            short_street_type;
        }
      }
    }

    return parts;
  }

  findStreetTypeShortCode(streetType?: string): string {
    const blankShortCode = "BL";

    if (!streetType) {
      return blankShortCode;
    }

    const matchedEntry = Object.entries(streetAbbrevsToShortCodeMap).find(
      ([_, streetTypeString]) => {
        // Check against singular and plural versions
        return (
          streetTypeString === streetType ||
          `${streetTypeString}s` === streetType
        );
      }
    );

    return matchedEntry ? matchedEntry[0] : blankShortCode;
  }
}
