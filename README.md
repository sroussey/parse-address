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

## European addresses

Six European countries are supported in addition to US/CA, built on a shared,
configuration-driven engine (`src/maps/_eu`). European addressing differs from
the US/CA grammar along three axes the engine models per country: where the
house number sits (before vs after the street), where the street *type* sits
(leading `Rue`, trailing `Street`, or fused as in `Bäckerstraße`), and whether
the postcode precedes the city (continental) or comes last (UK).

```ts
import { AddressParser, IntlAddressParser } from '@sroussey/parse-address'

new AddressParser('de').parseLocation('Bäckerstraße 12, 10115 Berlin')
// { street: 'Bäcker', type: 'Straße', number: '12', postal_code: '10115', city: 'Berlin', country: 'DE' }

new AddressParser('fr').parseLocation('10 Rue de Rivoli, 75001 Paris')
// { number: '10', type: 'Rue', street: 'de Rivoli', postal_code: '75001', city: 'Paris', country: 'FR' }

new AddressParser('gb').parseLocation('221B Baker Street, London, NW1 6XE')
// { number: '221', civic_number_suffix: 'B', street: 'Baker', type: 'Street', city: 'London', postal_code: 'NW1 6XE', country: 'GB' }

new AddressParser('it').parseLocation('Via Roma 15, 00184 Roma RM')
// { type: 'Via', street: 'Roma', number: '15', postal_code: '00184', city: 'Roma', state: 'RM', country: 'IT' }

new AddressParser('es').parseLocation('Calle de Alcalá, 42, 28014 Madrid')
// { type: 'Calle', street: 'de Alcalá', number: '42', postal_code: '28014', city: 'Madrid', country: 'ES' }

new AddressParser('nl').parseLocation("Spuistraat 63, 2511 BD 's-Gravenhage")
// { street: 'Spui', type: 'straat', number: '63', postal_code: '2511 BD', city: "'s-Gravenhage", country: 'NL' }
```

| Code | Country | Number | Type | Postcode | Region field |
|------|---------|--------|------|----------|--------------|
| `de` | Germany | after street | fused suffix (`-straße`) | 5-digit, before city | – |
| `fr` | France | before street | leading (`Rue`) | 5-digit, before city | – |
| `gb` | United Kingdom | before street | trailing (`Street`) | last, after city | county → `state` |
| `it` | Italy | after street | leading (`Via`) | 5-digit, before city | province → `state` |
| `es` | Spain | after street (comma) | leading (`Calle`) | 5-digit, before city | province → `state` |
| `nl` | Netherlands | after street | fused suffix (`-straat`) | 4-digit+2-letter, before city | – |

Each country's addressing rules, prior-work notes and known failure modes are
documented under [`docs/eu-research`](docs/eu-research); the parsers are validated
against 100+ real-address fixtures per country in `__tests__/eu-fixtures`.

### Fields

US and CA share the street fields (`number`, `civic_number_suffix`, `prefix`,
`street`, `type`, `suffix`, `sec_unit_type`, `sec_unit_num`). Canadian results add
`province`, `postal_code`, `fsa`, `ldu`; US results add `postal_code`, `plus4`,
`state`. European results use the shared street fields plus `postal_code`, `city`,
and (where applicable) `state` for the province/county; the street `type` carries
a `short_street_type` code as in US/CA.

### SEC EDGAR region codes

Canadian provinces are recognized both by their canonical two-letter code (`QC`,
`ON`, …) and by SEC EDGAR's `A0`–`B0` / `Z4` codes, which normalize to the
canonical code (e.g. `A8` → `QC`). This lets an EDGAR-sourced address parse
without pre-mapping the region code.

### Country detection precedence

`IntlAddressParser` auto-detects in this fixed order: explicit country name/code →
explicit European country name / UK & NL postcode shape → postal-code shape →
full region names → region codes → French street types → default US. The
continental countries (DE/FR/IT/ES) share a bare 5-digit postcode that is
ambiguous with a US ZIP, so unless the input carries an explicit country name
they fall through to the US default — **pass a `country` argument** to any
`IntlAddressParser`/`AddressParser` method when you know the country.

### Guarantee: no dropped street tokens

A parse never silently drops a word from the street line. When the structured
parse cannot fully resolve an input, the parser falls back to a minimal result
(house number + full street remainder) rather than a truncated one.
