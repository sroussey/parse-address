// Ground-truth shape for a single European address sample. All address fields
// are optional; only the fields a knowledgeable local would populate are set,
// and the parser is asserted to match each present field. `__skip` marks a
// sample the current grammar intentionally does not cover (with a reason).
export interface EuSample {
  input: string;
  number?: string;
  civic_number_suffix?: string;
  street?: string;
  type?: string;
  sec_unit_type?: string;
  sec_unit_num?: string;
  building?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
  __skip?: string;
}
