import type { PostalCodeRepair } from "../../types/postal";

/**
 * A five-digit ZIP, alone or leading a ZIP+4 in any spelling a form carries:
 * "05401-1234", the dashless "054011234", and the truncated tails filers leave
 * behind ("77002-2", "10467 2490", "10022-").
 *
 * The separator is REQUIRED in that last form, so a bare run of 6-8 digits is
 * not read as a ZIP with junk after it. "125721" for Rhinebeck is 12572 plus a
 * stray digit, but "750119" for Coppell is not 75011 -- and nothing in the
 * value says which, so both are refused.
 */
export const usPostalRepair: PostalCodeRepair = {
  accept: [
    // ZIP+4, dashed or run together. Anchored, so a 10-digit phone number
    // ("9178433621") cannot pass as a 9-digit ZIP+4 with a digit trailing it.
    "([0-9]{5})-?[0-9]{4}",
    "([0-9]{5})",
    // A ZIP+4 the filer cut short: the separator, then however much of the +4
    // survived (down to none of it). Digits ONLY -- `.*` here would accept
    // "10001 NEW YORK NY" as ZIP 10001, which is the junk-passthrough this API
    // exists to refuse. Recovering a ZIP from free text is a different and
    // riskier rule than repairing a truncated one.
    "([0-9]{5})[-\\s]([0-9]{0,4})",
  ],
  canonical: (m) => m[1]!,
};

export default usPostalRepair;
