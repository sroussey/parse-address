import XRegExp from "xregexp";

import { keys, invert, values, flatten } from "../../utils";
import { provinceCodesMap } from "./provinces";
import { directionsMap } from "./directions";
import { streetTypeMap } from "./street-type";
import { AddressRuleset } from "../../types/ruleset";

XRegExp.uninstall("namespacing");

const type = flatten(streetTypeMap)
  .sort()
  .filter(function (v, i, arr) {
    return arr.indexOf(v) === i;
  })
  .join("|");

const fraction = "(?<civic_number_suffix>\\d+\\/\\d+)";

const province =
  "\\b(?:" +
  keys(provinceCodesMap)
    .concat(values(provinceCodesMap))
    .map(XRegExp.escape)
    .join("|") +
  ")\\b";

const direct = values(directionsMap)
  .sort((a, b) => Number(a.length < b.length))
  .reduce(function (prev, curr) {
    return prev.concat([XRegExp.escape(curr.replace(/\w/g, "$&.")), curr]);
  }, keys(directionsMap))
  .join("|");

const directionCode = invert(directionsMap);

const dircode = keys(directionCode).join("|");

// Canadian postal code pattern: A1A 1A1
const postal_code = "(?<postal_code>[A-Za-z]\\d[A-Za-z])(?:\\s*(?<postal_code_suffix>\\d[A-Za-z]\\d))?";

const corner = "(?:\\band\\b|\\bat\\b|&|\\@)";

const namednumber = `(one|two|three|four|five|six|seven|eight|nine)`;
const stnumber = `(?<number>${namednumber}(?=\\W)|(\\d+-?\\d*)|([N|S|E|W]\\d{1,3}[N|S|E|W]\\d{1,6}))(?=\\D)`;

const namedfloor = `
  (?:
    (?:\\W+)
    (?<sec_unit_num_5>\\d+)(?:st|nd|rd|th)\\W+
    (?<sec_unit_type_5>Flo*r)\\W*
  )`;

const street = `
    (?:
      (?:(?<street_0>${direct})\\W+
          (?<type_0>${type})\\b
      )
      |
      (?:(?<prefix_0>${direct})\\W+)?
      (?:
        (?<type_5>${type})\\W+
        (?<street_5>[^,]+?)
        (?:[^\\w,]+(?<suffix_5>${direct})\\b)?
        |
        (?<street_4>[\\w\\s]+)
        (?:[^\\w]+(?<type_4>${type})\\b)
        (?:[^\\w]+(?<suffix_4>${direct})\\b)?
        (?:${namedfloor.replace(/_\d/g, "$&1")})
        |
        (?<street_1>[^,]*\\d)
        (?:[^\\w,]*(?<suffix_1>${direct})\\b)
        |
        (?<street_2>[^,]+)
        (?:[^\\w,]+(?<type_2>${type})\\b)
        (?:[^\\w,]+(?<suffix_2>${direct})\\b)?
        |
        (?<street_3>[^,]+?)
        (?:[^\\w,]+(?<type_3>${type})\\b)?
        (?:[^\\w,]+(?<suffix_3>${direct})\\b)?
      )
    )`;

const po_box = "p\\W*(?:[om]|ost\\ ?office)\\W*b(?:ox)?";

const sec_unit_type_numbered = `
    (?<sec_unit_type_1>su?i?te
      |${po_box}
      |(?:ap|dep)(?:ar)?t(?:me?nt)?
      |ro*m
      |flo*r?
      |uni?t
      |bu?i?ldi?n?g
      |ha?nga?r
      |lo?t
      |pier
      |slip
      |spa?ce?
      |stop
      |tra?i?le?r
      |box
      |r\.?r\.?
      |rural route)(?![a-z]
    )
    `;

const sec_unit_type_unnumbered = `
    (?<sec_unit_type_2>ba?se?me?n?t
      |fro?nt
      |lo?bby
      |lowe?r
      |off?i?ce?
      |pe?n?t?ho?u?s?e?
      |rear
      |side
      |uppe?r
    )\\b`;

const sec_unit = `
    (?:                               #fix3
      (?:                             #fix1
        (?:
          (?:${sec_unit_type_numbered}\\W*)
          |(?<sec_unit_type_3>\\#)\\W*
        )
        (?<sec_unit_num_1>[\\w-]+)
      )
      |
      ${sec_unit_type_unnumbered}
    )`;

const city_and_province = `
    (?:
      (?<city>[^\\d,]+?)\\W+
      (?<province>${province})
    )
    `;

const country = `(?<country>(?:Canada|CAN|CA))`;

const place = `
    (?:${city_and_province}\\W*)?
    (?:${postal_code}\\W*)?
    (?:${country})?
    `;

const address = XRegExp(
  `
    ^
    [^\\w\\#]*
    (${stnumber})\\W*
    (?:${fraction}\\W*)?
        ${street}\\W+
    (?:${sec_unit})?\\W*          #fix2
        ${place}
    \\W*$`,
  "ix"
);

const sep = "(?:\\W+|$)"; // no support for \Z

const informal_address = XRegExp(
  `
    ^
    \\s* 
    (?:${sec_unit + sep})? 
    (?:${stnumber})?\\W* 
    (?:${fraction}\\W*)? 
    ${street + sep}
    (?:${sec_unit.replace(/_\d/g, "$&1") + sep})? 
    (?:${place})? 
    `,
  "ix"
);

const street_address = XRegExp(
  `
    ^
    \\s* 
    (?:${sec_unit + sep})? 
    (?:${stnumber})?\\W* 
    (?:${fraction}\\W*)? 
       ${street + sep} 
    (?:${sec_unit.replace(/_\d/g, "$&1") + sep})? 
    `,
  "ix"
);

const po_address = XRegExp(
  `
    ^
    \\s*
    (?:${sec_unit.replace(/_\d/g, "$&1") + sep})?
    (?:${place})?
    `,
  "ix"
);

const intersection = XRegExp(
  `^\\W* 
    ${street.replace(/_\d/g, "1$&")}\\W*? 
    \\s+${corner}\\s+ 
    ${street.replace(/_\d/g, "2$&")}($|\\W+) 
    ${place}\\W*$`,
  "ix"
);

export const AddressRulesetCA: AddressRuleset = {
  type,
  fraction,
  state: province, // Canada uses provinces, map state to province pattern
  direct,
  dircode,
  postal_code,
  corner,
  street,
  stnumber,
  po_box,
  street_address,
  address,
  intersection,
  po_address,
  informal_address,
  directionCode,
};

export default AddressRulesetCA; 