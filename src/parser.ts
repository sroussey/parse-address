import XRegExp from 'xregexp'

import {
  normalizeMap,
  stateCodesMap,
  directionsMap,
  streetTypeMap,
  streetAbbrevsToShortCodeMap,
} from './maps'

import {
  keys,
  each,
  invert,
  values,
  flatten,
  isNumeric,
  capitalize,
} from './utils'

XRegExp.uninstall('namespacing')

export class AddressParser {
  private addressMatch: Record<string, any>
  private directionCode: Record<string, any>

  constructor() {
    this.directionCode = invert(directionsMap)

    /*
    const Street_Type_Match = {}
    each(Street_Type,function(v,k){ Street_Type_Match[v] = XRegExp.escape(v) })
    each(Street_Type,function(v,k){ Street_Type_Match[v] = Street_Type_Match[v] + '|' + XRegExp.escape(k) })
    each(Street_Type_Match,function(v,k){ Street_Type_Match[k] = new RegExp( '\\b(?:' +  Street_Type_Match[k]  + ')\\b', 'i') })
    */

    this.addressMatch = {
      type: flatten(streetTypeMap).sort().filter(function (v, i, arr) { return arr.indexOf(v) === i }).join('|'),
      fraction: '\\d+\\/\\d+',
      state: '\\b(?:' + keys(stateCodesMap).concat(values(stateCodesMap)).map(XRegExp.escape).join('|') + ')\\b',
      direct: values(directionsMap).sort((a, b) => Number(a.length < b.length)).reduce(function (prev, curr) { return prev.concat([XRegExp.escape(curr.replace(/\w/g, '$&.')), curr]) }, keys(directionsMap)).join('|'),
      dircode: keys(this.directionCode).join('|'),
      zip: '(?<zip>\\d{5})[- ]?(?<plus4>\\d{4})?',
      corner: '(?:\\band\\b|\\bat\\b|&|\\@)',
    }

    this.addressMatch.number = '(?<number>(\\d+-?\\d*)|([N|S|E|W]\\d{1,3}[N|S|E|W]\\d{1,6}))(?=\\D)'

    this.addressMatch.street = `
      (?:
        (?:(?<street_0>${this.addressMatch.direct})\\W+
            (?<type_0>${ this.addressMatch.type })\\b
        )
        |
        (?:(?<prefix_0>${ this.addressMatch.direct })\\W+)?
        (?:
          (?<street_1>[^,]*\\d)
          (?:[^\\w,]*(?<suffix_1>${ this.addressMatch.direct })\\b)
          |
          (?<street_2>[^,]+)
          (?:[^\\w,]+(?<type_2>${ this.addressMatch.type })\\b)
          (?:[^\\w,]+(?<suffix_2>${ this.addressMatch.direct })\\b)?
          |
          (?<street_3>[^,]+?)
          (?:[^\\w,]+(?<type_3>${ this.addressMatch.type })\\b)?
          (?:[^\\w,]+(?<suffix_3>${ this.addressMatch.direct })\\b)?
        )
      )`

    this.addressMatch.po_box = 'p\\W*(?:[om]|ost\\ ?office)\\W*b(?:ox)?'

    this.addressMatch.sec_unit_type_numbered = `
      (?<sec_unit_type_1>su?i?te
        |${ this.addressMatch.po_box }
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
        |box)(?![a-z]
      )
      `

    this.addressMatch.sec_unit_type_unnumbered = `
      (?<sec_unit_type_2>ba?se?me?n?t
        |fro?nt
        |lo?bby
        |lowe?r
        |off?i?ce?
        |pe?n?t?ho?u?s?e?
        |rear
        |side
        |uppe?r
      )\\b`

    this.addressMatch.sec_unit = `
      (?:                               #fix3
        (?:                             #fix1
          (?:
            (?:${ this.addressMatch.sec_unit_type_numbered }\\W*)
            |(?<sec_unit_type_3>\\#)\\W*
          )
          (?<sec_unit_num_1>[\\w-]+)
        )
        |
        ${ this.addressMatch.sec_unit_type_unnumbered }
      )`

    this.addressMatch.city_and_state = `
      (?:
        (?<city>[^\\d,]+?)\\W+
        (?<state>${ this.addressMatch.state })
      )
      `

    this.addressMatch.place = `
      (?:${ this.addressMatch.city_and_state }\\W*)?
      (?:${ this.addressMatch.zip })?
      `

    this.addressMatch.address = XRegExp(`
      ^
      [^\\w\\#]*
      (${ this.addressMatch.number })\\W*
      (?:${ this.addressMatch.fraction }\\W*)?
          ${ this.addressMatch.street }\\W+
      (?:${ this.addressMatch.sec_unit })?\\W*          #fix2
          ${ this.addressMatch.place }
      \\W*$`, 'ix')

    const sep = '(?:\\W+|$)' // no support for \Z

    this.addressMatch.informal_address = XRegExp(`
      ^
      \\s* 
      (?:${ this.addressMatch.sec_unit + sep })? 
      (?:${ this.addressMatch.number })?\\W* 
      (?:${ this.addressMatch.fraction }\\W*)? 
         ${ this.addressMatch.street + sep } 
      (?:${ this.addressMatch.sec_unit.replace(/_\d/g, '$&1') + sep })? 
      (?:${ this.addressMatch.place })? 
      `, 'ix')

    this.addressMatch.po_address = XRegExp(`
      ^
      \\s*
      (?:${ this.addressMatch.sec_unit.replace(/_\d/g, '$&1') + sep })?
      (?:${ this.addressMatch.place })?
      `, 'ix')

    this.addressMatch.intersection = XRegExp('                     \n\
      ^\\W*                                                 \n\
      '+ this.addressMatch.street.replace(/_\d/g, '1$&') + '\\W*?      \n\
      \\s+'+ this.addressMatch.corner + '\\s+                         \n\
      '+ this.addressMatch.street.replace(/_\d/g, '2$&') + '($|\\W+) \n\
      '+ this.addressMatch.place + '\\W*$', 'ix')
  }

  normalizeAddress(parts) {
    const self = this

    if (!parts) return null
    const parsed: Record<string, any> = {}

    Object.keys(parts).forEach((part) => {
      if (['input', 'index'].includes(part) || isNumeric(part)) {
        return
      }

      const key = isNumeric(part.split('_').pop())
        ? part.split('_').slice(0, -1).join('_')
        : part

      if (parts[part]) {
        parsed[key] = parts[part].trim().replace(/^\s+|\s+$|[^\w\s\-#&]/g, '')
      }
    })

    each(normalizeMap, function (map, key) {
      if (parsed[key] && map[parsed[key].toLowerCase()]) {
        parsed[key] = map[parsed[key].toLowerCase()]
      }
    })

    ;['type', 'type1', 'type2'].forEach(function (key) {
      if (key in parsed) {
        // Map the address short code
        const lowerCaseType = parsed[key].toLowerCase()
        parsed[`short_street_${key}`] = self.findStreetTypeShortCode(lowerCaseType)

        parsed[key] = parsed[key].charAt(0).toUpperCase() + parsed[key].slice(1).toLowerCase()
      }
    })

    if (parsed.city) {
      parsed.city = XRegExp.replace(parsed.city,
        XRegExp(`^(?<dircode>${ this.addressMatch.dircode })\\s+(?=\\S)`, 'ix'),
        function (match) {
          return capitalize(self.directionCode[match.dircode.toUpperCase()]) + ' '
        })
    }

    return parsed
  }

  parseAddress(address: string) {
    const parts = XRegExp.exec(address, this.addressMatch.address)
    return this.normalizeAddress(parts)
  }

  parseInformalAddress(address: string) {
    const parts = XRegExp.exec(address, this.addressMatch.informal_address)
    return this.normalizeAddress(parts)
  }

  parsePoAddress(address: string) {
    const parts = XRegExp.exec(address, this.addressMatch.po_address)
    return this.normalizeAddress(parts)
  }

  parseLocation(address: string) {
    if (XRegExp(this.addressMatch.corner, 'xi').test(address)) {
      return this.parseIntersection(address)
    }

    if (XRegExp('^' + this.addressMatch.po_box, 'xi').test(address)) {
      return this.parsePoAddress(address)
    }

    return this.parseAddress(address)
      || this.parseInformalAddress(address)
  }

  parseIntersection(address: string) {
    let parts = XRegExp.exec(address, this.addressMatch.intersection)
    // @ts-ignore
    parts = this.normalizeAddress(parts)

    if (parts) {
      parts.type2 = parts.type2 || ''
      parts.type1 = parts.type1 || ''

      if (parts.type2 && !parts.type1 || (parts.type1 === parts.type2)) {
        let type = parts.type2
        const short_street_type = parts.short_street_type2
        type = XRegExp.replace(type, /s\W*$/, '')

        if (XRegExp(`^${ this.addressMatch.type }$`, 'ix').test(type)) {
          parts.type1 = parts.type2 = type
          parts.short_street_type1 = parts.short_street_type2 = short_street_type
        }
      }
    }

    return parts
  }

  findStreetTypeShortCode(streetType?: string): string {
    const blankShortCode = 'BL'

    if (!streetType) {
      return blankShortCode
    }

    const matchedEntry = Object.entries(streetAbbrevsToShortCodeMap).find(
      ([_, streetTypeString]) => {
        // Check against singular and plural versions
        return streetTypeString === streetType || `${streetTypeString}s` === streetType
      }
    )

    return matchedEntry ? matchedEntry[0] : blankShortCode
  }
}
