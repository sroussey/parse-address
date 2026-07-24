import type { Pattern } from "xregexp";

export type CountryMappings =
  | "us"
  | "ca"
  // European countries (see src/maps/_eu)
  | "de"
  | "fr"
  | "gb"
  | "it"
  | "es"
  | "nl"
  | "be"
  | "at"
  | "pl"
  | "ch"
  | "pt"
  | "se"
  | "dk"
  | "no"
  | "fi"
  | "ie"
  | "cz"
  | "gr"
  // Offshore jurisdictions / Crown Dependencies (UK-style grammar)
  | "je"
  | "gg"
  | "ky"
  | "vg"
  | "bm"
  | "gi"
  // Batch 1 (non-European, street-based)
  | "au"
  | "nz"
  | "sg"
  | "il"
  | "za"
  | "tr"
  | "br"
  | "mx"
  | "ar"
  | "cl"
  | "co"
  | "pe"
  | "in"
  | "my"
  | "ae"
  | "lu"
  | "is"
  | "mt"
  | "cy"
  | "uy"
  | "ec"
  | "ve"
  | "bo"
  | "ro"
  | "hr"
  | "sk"
  | "si"
  | "cr"
  | "sa"
  | "qa"
  | "kw"
  | "bh"
  | "pa"
  | "gt"
  | "do"
  | "ee"
  | "lv"
  | "lt"
  | "hu"
  | "th"
  | "ph"
  | "id"
  | "pk"
  | "al"
  | "rs"
  | "ba"
  | "me"
  | "ci";

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
