# US Street Address Parser [![Build Status](https://travis-ci.org/hassansin/parse-address.svg)](https://travis-ci.org/hassansin/parse-address)

This is a Typescript port for the Perl [Geo::StreetAddress::US](http://search.cpan.org/~timb/Geo-StreetAddress-US-1.04/US.pm) package

_Description from Geo::StreetAddress::US_:

> Geo::StreetAddress::US is a regex-based street address and street intersection parser for the United States. Its basic goal is to be as forgiving as possible when parsing user-provided address strings. Geo::StreetAddress::US knows about directional prefixes and suffixes, fractional building numbers, building units, grid-based addresses (such as those used in parts of Utah), 5 and 9 digit ZIP codes, and all of the official USPS abbreviations for street types and state names... [more](http://search.cpan.org/~timb/Geo-StreetAddress-US-1.04/US.pm)

## Usage:

```ts
import addressParser from '@sroussey/parse-address'

const address = '1005 N Gravenstein Highway Sebastopol CA 95472'
const parsed = addressParser.parseLocation(address)

// Parsed address:
{
 number: '1005',
 prefix: 'N',
 street: 'Gravenstein',
 type: 'Hwy',
 city: 'Sebastopol',
 state: 'CA',
 postal_code: '95472',
}
```

## Canadian addresses

```ts
import { AddressParser, IntlAddressParser } from '@sroussey/parse-address'

// Explicit country
const ca = new AddressParser('ca')
ca.parseLocation('123 Avenue du Parc, Montreal, QC H2X 3P6')
// { number: '123', type: 'Ave', street: 'du Parc', city: 'Montreal',
//   province: 'QC', postal_code: 'H2X 3P6', fsa: 'H2X', ldu: '3P6', country: 'CA' }

// Auto-detect country (US or CA), with an optional override
const intl = new IntlAddressParser()
intl.parseLocation('123 Main St, Toronto, ON M5V 3A8')   // detects CA
intl.parseStreet('123 Main St', 'ca')                    // force CA
```

### Fields

US and CA share the street fields (`number`, `civic_number_suffix`, `prefix`,
`street`, `type`, `suffix`, `sec_unit_type`, `sec_unit_num`). Canadian results add
`province`, `postal_code`, `fsa`, `ldu`; US results add `postal_code`, `plus4`,
`state`.

### SEC EDGAR region codes

Canadian provinces are recognized both by their canonical two-letter code (`QC`,
`ON`, …) and by SEC EDGAR's `A0`–`B0` / `Z4` codes, which normalize to the
canonical code (e.g. `A8` → `QC`). This lets an EDGAR-sourced address parse
without pre-mapping the region code.

### Country detection precedence

`IntlAddressParser` auto-detects in this fixed order: explicit country name/code →
postal-code shape → full region names → region codes (incl. SEC EDGAR codes) →
French street types → default US. Pass a `country` argument to any
`IntlAddressParser` method to skip detection.

### Guarantee: no dropped street tokens

A parse never silently drops a word from the street line. When the structured
parse cannot fully resolve an input, the parser falls back to a minimal result
(house number + full street remainder) rather than a truncated one.
