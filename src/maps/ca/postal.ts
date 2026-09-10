import type { PostalCodeRepair } from "../../types/postal";

/**
 * Canada Post uses no D, F, I, O, Q or U in any position, so an O or an I is
 * always a mistyped zero or one rather than a letter to preserve.
 *
 * S/5 and Z/2 are deliberately NOT folded: S and Z are both valid letters
 * there, so "MSJ 2T3" could be M5J or a genuine code, and guessing would assign
 * a real address to a wrong postal code.
 */
export const caPostalRepair: PostalCodeRepair = {
  fold: (upper) => upper.replace(/[OI]/g, (c) => (c === "O" ? "0" : "1")),
  accept: ["([A-Z][0-9][A-Z])[-\\s]?([0-9][A-Z][0-9])"],
  canonical: (m) => `${m[1]} ${m[2]}`,
};

export default caPostalRepair;
