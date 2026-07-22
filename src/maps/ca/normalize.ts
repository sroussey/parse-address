import { provinceCodesMap } from './provinces'
import { secProvinceCodesMap } from './sec-provinces'
import { directionsMap } from './directions'
import { streetTypeMap } from './street-type'

// Full province names and SEC EDGAR codes both normalize to the canonical
// two-letter province code (keys are disjoint: full names vs "A0"-style codes).
const provinceNormalizeMap = { ...provinceCodesMap, ...secProvinceCodesMap }

export const normalizeMap = {
  prefix: directionsMap,
  prefix1: directionsMap,
  prefix2: directionsMap,
  suffix: directionsMap,
  suffix1: directionsMap,
  suffix2: directionsMap,
  type: streetTypeMap,
  type1: streetTypeMap,
  type2: streetTypeMap,
  province: provinceNormalizeMap,
} 