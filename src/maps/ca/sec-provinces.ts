// SEC EDGAR "State or Country" codes for Canadian provinces/territories.
//
// EDGAR encodes Canadian regions as A0-A9 / B0 (with Z4 as a catch-all for the
// territories) rather than the ISO / Canada Post two-letter codes. Recognizing
// them lets an address that carries e.g. "A8" for Quebec parse correctly instead
// of leaving the province token unmatched. Keys are lowercase so the normalizer
// (which lowercases before lookup) maps them to the canonical province code.
export const secProvinceCodesMap = {
  a0: 'AB', // Alberta
  a1: 'BC', // British Columbia
  a2: 'MB', // Manitoba
  a3: 'NB', // New Brunswick
  a4: 'NL', // Newfoundland and Labrador
  a5: 'NS', // Nova Scotia
  a6: 'ON', // Ontario
  a7: 'PE', // Prince Edward Island
  a8: 'QC', // Quebec
  a9: 'SK', // Saskatchewan
  b0: 'YT', // Yukon
  z4: 'NT', // EDGAR catch-all for the territories (NWT / Nunavut); NT by default
} as const;
