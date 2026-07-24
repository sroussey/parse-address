export interface ParsedAddress {
  city?: string;
  state?: string;
  number?: string;
  civic_number_suffix?: string;
  prefix?: string;
  street?: string;
  street1?: string;
  street2?: string;
  type?: string;
  type1?: string;
  type2?: string;
  sec_unit_num?: string;
  sec_unit_type?: string;
  suffix?: string;
  building?: string;
  postal_code?: string;
  fsa?: string;
  ldu?: string;
  province?: string;
  plus4?: string;
  country: string;
  /**
   * A leading legal-entity / "c/o" segment removed before parsing (EDGAR
   * records concatenate the filer's name in front of the street line). Kept so
   * no part of the caller's input is silently discarded.
   */
  organization?: string;
  short_street_type?: string;
  short_street_type1?: string;
  short_street_type2?: string;
}

export interface AddressTestCase extends ParsedAddress {
  __skipTest?: boolean;
}

export type AddressTestCaseMap = Record<string, AddressTestCase>;
