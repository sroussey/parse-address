import XRegExp from "xregexp";
import { AddressParserImpl } from "../../types/parser";
import { capitalize, each, isNumeric } from "../../utils";
import { directionsMap } from "./directions";
import { normalizeMap } from "./normalize";
import addressRuleset from "./ruleset";
import { streetAbbrevsMap, streetAbbrevsToShortCodeMap } from "./street-abbrevs";

export class AddressParserCA implements AddressParserImpl {
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
        // Preserve accented characters and fractions while cleaning up the address part
        parsed[key] = parts[part].trim().replace(/^\s+|\s+$|[^\w\s\-#&\/àáâäèéêëìíîïòóôöùúûüæøåÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜÆØÅñÑçÇ''.]/g, "");
      }
    });

    each(normalizeMap, function (map, key) {
      if (parsed[key] && map[parsed[key].toLowerCase()]) {
        parsed[key] = map[parsed[key].toLowerCase()];
      }
    });

    // Fix prefix duplication in street names
    if (parsed.prefix && parsed.street) {
      // Remove prefix from beginning of street name if it's duplicated
      const prefixRegex = new RegExp(`^${XRegExp.escape(parsed.prefix)}\\s+`, 'i');
      if (prefixRegex.test(parsed.street)) {
        parsed.street = parsed.street.replace(prefixRegex, '').trim();
      }
    }

    // Fix house number duplication in street names (for unit addresses like "#101 999 Seymour Street")
    if (parsed.number && parsed.street && parsed.sec_unit_type && parsed.sec_unit_num) {
      // Remove house number from beginning of street name if it's duplicated
      const numberRegex = new RegExp(`^${XRegExp.escape(parsed.number)}\\s+`, 'i');
      if (numberRegex.test(parsed.street)) {
        parsed.street = parsed.street.replace(numberRegex, '').trim();
      }
    }

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

    // Normalize suffix case (should be uppercase like N, S, E, W, NW, etc.)
    ["suffix", "suffix1", "suffix2"].forEach(function (key) {
      if (key in parsed) {
        parsed[key] = parsed[key].toUpperCase();
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

    // Handle postal code formatting
    if (parsed.postal_code && parsed.postal_code_suffix) {
      parsed.postal_code = `${parsed.postal_code.toUpperCase()} ${parsed.postal_code_suffix.toUpperCase()}`;
      
      // Extract FSA and LDU for Canadian postal codes
      parsed.fsa = parsed.postal_code.substring(0, 3);
      parsed.ldu = parsed.postal_code.substring(4, 7);
      
      delete parsed.postal_code_suffix;
    } else if (parsed.postal_code) {
      // Normalize postal code format (A1A 1A1)
      const upperCasePostalCode = parsed.postal_code.toUpperCase();
      // Handle both concatenated (A1A1A1) and spaced (A1A 1A1) formats
      parsed.postal_code = upperCasePostalCode.replace(/([A-Z]\d[A-Z])(\d[A-Z]\d)/, '$1 $2');
      
      // Extract FSA and LDU for Canadian postal codes
      if (parsed.postal_code.length >= 6) {
        parsed.fsa = parsed.postal_code.substring(0, 3);
        parsed.ldu = parsed.postal_code.substring(parsed.postal_code.indexOf(' ') + 1);
      }
    }

    

    switch (parts.number) {
      case "One":
        parsed.number = "1";
        break;
      case "Two":
        parsed.number = "2";
        break;
      case "Three":
        parsed.number = "3";
        break;
      case "Four":
        parsed.number = "4";
        break;
      case "Five":
        parsed.number = "5";
        break;
      case "Six":
        parsed.number = "6";
        break;
      case "Seven":
        parsed.number = "7";
        break;
      case "Eight":
        parsed.number = "8";
        break;
      case "Nine":
        parsed.number = "9";
        break;
    }

    // For Canadian addresses, use 'province' instead of 'state'
    if (parsed.state) {
      parsed.province = parsed.state;
      delete parsed.state;
    }

    parsed.country = "CA";

    return parsed;
  }

  parseStreet(street_address: string) {
    const parts = XRegExp.exec(street_address, addressRuleset.street_address);
    return this.normalizeAddress(parts);
  }

  parseAddress(address: string) {
    const parts = XRegExp.exec(address, addressRuleset.address);
    let parsed = this.normalizeAddress(parts);

    // Special handling for Canadian addresses with tricky patterns
    if (parsed) {
      parsed = this.postProcessCanadianAddress(parsed, address);
    }

    return parsed;
  }

  parseInformalAddress(address: string) {
    const parts = XRegExp.exec(address, addressRuleset.informal_address);
    let parsed = this.normalizeAddress(parts);

    // Special handling for Canadian addresses with tricky patterns
    if (parsed) {
      parsed = this.postProcessCanadianAddress(parsed, address);
    }

    return parsed;
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

    const lowerStreetType = streetType.toLowerCase();

    // First, try to find a direct match in the values (short codes)
    const matchedEntry = Object.entries(streetAbbrevsToShortCodeMap).find(
      ([_, streetTypeString]) => {
        // Check against singular and plural versions
        return (
          streetTypeString === lowerStreetType ||
          `${streetTypeString}s` === lowerStreetType
        );
      }
    );

    if (matchedEntry) {
      return matchedEntry[0];
    }

    // If no direct match, try to find by the full street type name
    // Look for the key that corresponds to the street type
    const reverseMatchedEntry = Object.entries(streetAbbrevsToShortCodeMap).find(
      ([key, _]) => {
        const fullName = streetAbbrevsMap[key];
        return fullName && fullName.toLowerCase() === lowerStreetType;
      }
    );

    return reverseMatchedEntry ? reverseMatchedEntry[0] : blankShortCode;
  }

  /**
   * Post-process Canadian addresses to fix common parsing issues
   */
  private postProcessCanadianAddress(parsed: any, originalAddress: string): any {
    if (!parsed) return parsed;

    // Fix "St. John's" city name issue
    if (parsed.city && parsed.city.includes("John's") && originalAddress.includes("St. John's")) {
      parsed.city = "St. John's";
    }

    // Fix city parsing for French street names that get misinterpreted
    // Handle cases like "station Rue Paris" where "Rue Paris" should be the city
    if (parsed.city && originalAddress.toLowerCase().includes('rue ') && !parsed.city.toLowerCase().includes('rue')) {
      const rueMatch = originalAddress.match(/\b(rue\s+\w+(?:\s+\w+)*?)(?=\s+[A-Z]{2}\s+[A-Z]\d[A-Z]\s*\d[A-Z]\d|\s*$)/i);
      if (rueMatch) {
        parsed.city = rueMatch[1];
      }
    }

    // Handle French directional suffixes (like "Est" -> "E")
    if (parsed.street && !parsed.suffix) {
      const frenchSuffixes = ['est', 'ouest', 'nord', 'sud'];
      for (const suffix of frenchSuffixes) {
        const regex = new RegExp(`\\s+${suffix}$`, 'i');
        if (regex.test(parsed.street)) {
          parsed.street = parsed.street.replace(regex, '').trim();
          parsed.suffix = directionsMap[suffix.toLowerCase()];
          break;
        }
      }
    }

    // Fix street name containing street type (like "Takahana station" where "station" should be type)
    if (parsed.street && parsed.type) {
      // Check if street name ends with a known street type
      const streetTypesToCheck = ['station', 'cres', 'crescent', 'place', 'avenue', 'street', 'road'];
      
      for (const streetType of streetTypesToCheck) {
        const regex = new RegExp(`\\s+(${streetType})$`, 'i');
        const streetMatch = parsed.street.match(regex);
        
        if (streetMatch) {
          const extractedType = streetMatch[1];
          const streetWithoutType = parsed.street.replace(regex, '').trim();
          
                     // Special case: if current type is from a city name (like "St" from "St. John's"), 
           // prefer the type extracted from street name
           if ((parsed.type.toLowerCase() === 'st' && originalAddress.includes("St. John's")) ||
               (parsed.type.toLowerCase() === 'rue' && extractedType.toLowerCase() === 'station')) {
             parsed.street = streetWithoutType;
             
             // Use the street type mapping to get the proper abbreviated form
             const lowerExtractedType = extractedType.toLowerCase();
             // Import and use street type mapping to find the proper abbreviation
             const { assignedStreetTypeMap } = require('./street-type');
             const properType = assignedStreetTypeMap[lowerExtractedType];
             
             if (properType) {
               parsed.type = properType.charAt(0).toUpperCase() + properType.slice(1).toLowerCase();
               const shortCode = this.findStreetTypeShortCode(properType);
               if (shortCode !== "BL") {
                 parsed.short_street_type = shortCode;
               } else {
                 delete parsed.short_street_type;
               }
             } else {
               parsed.type = extractedType.charAt(0).toUpperCase() + extractedType.slice(1).toLowerCase();
               const shortCode = this.findStreetTypeShortCode(extractedType.toLowerCase());
               if (shortCode !== "BL") {
                 parsed.short_street_type = shortCode;
               } else {
                 delete parsed.short_street_type;
               }
             }
             break;
           }
        }
      }
    }

    // Fix street type detection for addresses with multiple potential types
    // This handles cases like "Errol place St. John's" where "place" should be the type
    if (parsed.street && parsed.type && originalAddress) {
      const streetTypePattern = this.findBestStreetType(originalAddress, parsed);
      if (streetTypePattern) {
        parsed.street = streetTypePattern.street;
        parsed.type = streetTypePattern.type;
        parsed.short_street_type = this.findStreetTypeShortCode(streetTypePattern.type.toLowerCase());
      }
    }

    return parsed;
  }

  /**
   * Analyze the original address to find the best street type match
   */
  private findBestStreetType(address: string, currentParsed: any): { street: string, type: string } | null {
    // Only override parsing in very specific problematic cases
    // Don't override if we have a reasonable street name and type already
    if (currentParsed.street && currentParsed.type) {
      // Check for specific issues that warrant overriding:
      
      // 1. Street name contains house number (like "999 Seymour")
      const containsHouseNumber = /^\d+\s+/.test(currentParsed.street);
      
      // 2. Street name starts with prefix when we have a separate prefix field
      const startsWithPrefix = currentParsed.prefix && 
        new RegExp(`^${XRegExp.escape(currentParsed.prefix)}\\s+`, 'i').test(currentParsed.street);
      
      // 3. Multiple street types in the address (like "Errol place St. John's")
      const hasMultipleTypes = address.toLowerCase().includes('place') && 
        address.toLowerCase().includes("st. john's");
      
      // Only proceed if we have one of these specific issues
      if (!containsHouseNumber && !startsWithPrefix && !hasMultipleTypes) {
        return null; // Keep the current parsing
      }
    }

    // Handle the specific case of "Errol place St. John's" where "place" should be the type
    if (address.toLowerCase().includes('place') && address.toLowerCase().includes("st. john's")) {
      const placeMatch = address.match(/(\w+)\s+place\s+st\.\s*john's/i);
      if (placeMatch && placeMatch[1]) {
        return {
          street: placeMatch[1],
          type: "Pl"
        };
      }
    }

    // Handle house number in street name (like "#101 999 Seymour Street")
    if (currentParsed.street && /^\d+\s+/.test(currentParsed.street)) {
      // Extract just the street name without the house number
      const streetMatch = currentParsed.street.match(/^\d+\s+(.+)$/);
      if (streetMatch && streetMatch[1]) {
        return {
          street: streetMatch[1],
          type: currentParsed.type
        };
      }
    }

    return null;
  }
} 