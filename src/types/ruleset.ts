import type { Pattern } from "xregexp";

export type CountryMappings = "us" | "ca";

export interface AddressRuleset {
  type: Pattern;
  fraction: Pattern;
  state: Pattern;
  direct: Pattern;
  dircode: Pattern;
  postal_code: Pattern;
  corner: Pattern;
  street: Pattern;
  stnumber: Pattern;
  po_box: Pattern;
  address: RegExp;
  street_address: RegExp;
  intersection: RegExp;
  po_address: RegExp;
  informal_address: RegExp;
  directionCode: Record<string, string>;
}
