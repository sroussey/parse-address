# parse-address

A forgiving, regex-based street-address parser for **220 jurisdictions**: the
United States, Canada, and essentially every country and territory mapped by a
SEC EDGAR "State or Country" code — Europe, the Americas, Africa, the Middle
East, South/Central/Southeast Asia, the Pacific, the Caribbean, the offshore
financial centres, and the Crown Dependencies. Give it a messy, human-typed
address string and it returns a structured breakdown — house number, street,
type, unit, city, region, postcode, country — being as lenient as possible about
formatting. Non-Latin-script and big-endian address systems (CJK, the East-Slavic
Cyrillic set, and several South/Southeast-Asian scripts) are not yet covered.

It began life as a TypeScript port of the Perl
[`Geo::StreetAddress::US`](https://metacpan.org/pod/Geo::StreetAddress::US) and
keeps that library's US grammar (directional prefixes/suffixes, fractional and
grid-based numbers, secondary units, ZIP+4, every USPS abbreviation). Everything
beyond the US — Canada, Europe, and the offshore jurisdictions — is new work
built on a shared, configuration-driven engine.

## Install

```sh
npm install @sroussey/parse-address
```

## Quick start

The default export is a ready-to-use US parser:

```ts
import addressParser from '@sroussey/parse-address'

addressParser.parseLocation('1005 N Gravenstein Highway, Sebastopol, CA 95472')
// {
//   number: '1005', prefix: 'N', street: 'Gravenstein', type: 'Hwy',
//   city: 'Sebastopol', state: 'CA', postal_code: '95472', country: 'US'
// }
```

Each parser exposes `parseLocation`, `parseAddress`, `parseStreet`,
`parseInformalAddress`, `parsePoAddress`, and `parseIntersection`.

## Parsing other countries

Use `AddressParser` with an explicit country code, or `IntlAddressParser` to
auto-detect (with an optional override):

```ts
import { AddressParser, IntlAddressParser } from '@sroussey/parse-address'

// Explicit country
new AddressParser('ca').parseLocation('123 Avenue du Parc, Montreal, QC H2X 3P6')
// { number: '123', type: 'Ave', street: 'du Parc', city: 'Montreal',
//   province: 'QC', postal_code: 'H2X 3P6', fsa: 'H2X', ldu: '3P6', country: 'CA' }

// Auto-detect country
const intl = new IntlAddressParser()
intl.parseLocation('123 Main St, Toronto, ON M5V 3A8')   // detects CA
intl.parseLocation('10 Downing Street, London SW1A 2AA')  // detects GB
intl.parseStreet('Via Roma 15', 'it')                     // force IT
```

## Supported jurisdictions

**220 jurisdictions** are supported: the US, Canada, and 218 further countries
and territories — every "State or Country" code in SEC EDGAR. The table below
lists the jurisdictions with the most fully documented grammars; all 218
remaining EDGAR-mapped countries and territories (the Americas, Africa, the
Middle East, South/Central/Southeast Asia, the Pacific, and the Caribbean) are
also supported via their ISO two-letter codes.

| Region | Codes |
|--------|-------|
| North America | `us`, `ca` |
| Western Europe | `de`, `fr`, `gb`, `it`, `es`, `nl`, `be`, `at`, `ch`, `ie` |
| Nordic | `se`, `dk`, `no`, `fi` |
| Central / Southern Europe | `pl`, `cz`, `pt`, `gr` |
| Offshore / Crown Dependencies | `ky`, `vg`, `bm`, `gi`, `je`, `gg` |

## European addresses

European addressing differs from the US/CA grammar along three axes the engine
models per country: where the house number sits (before vs after the street),
where the street *type* sits (leading `Rue`, trailing `Street`, or fused as in
`Bäckerstraße`), and whether the postcode precedes the city (continental) or
comes last (UK/Ireland).

```ts
new AddressParser('de').parseLocation('Bäckerstraße 12, 10115 Berlin')
// { street: 'Bäcker', type: 'Straße', number: '12', postal_code: '10115', city: 'Berlin', country: 'DE' }

new AddressParser('fr').parseLocation('10 Rue de Rivoli, 75001 Paris')
// { number: '10', type: 'Rue', street: 'de Rivoli', postal_code: '75001', city: 'Paris', country: 'FR' }

new AddressParser('gb').parseLocation('221B Baker Street, London, NW1 6XE')
// { number: '221', civic_number_suffix: 'B', street: 'Baker', type: 'Street', city: 'London', postal_code: 'NW1 6XE', country: 'GB' }

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
| `be` | Belgium | after street | leading (`Rue`) **or** fused (`-straat`) | 4-digit, before city | – |
| `at` | Austria | after street | fused suffix (`-gasse`) | 4-digit, before city | – |
| `pl` | Poland | after street | leading (`ul.`) | `NN-NNN`, before city | – |
| `ch` | Switzerland | after street | fused (`-strasse`) **or** leading (`Rue`/`Via`) | 4-digit, before city | – |
| `pt` | Portugal | after street | leading (`Rua`) | `PPPP-PPP`, before city | – |
| `se` | Sweden | after street | fused suffix (`-gatan`) | `PPP PP`, before city | – |
| `dk` | Denmark | after street | fused/spaced (`-gade`, `Allé`) | 4-digit, before city | – |
| `no` | Norway | after street | fused/spaced (`-gata`, `gate`) | 4-digit, before city | – |
| `fi` | Finland | after street | fused suffix (`-katu`) | 5-digit, before city | – |
| `ie` | Ireland | before street | trailing (`Street`) | Eircode last (optional) | county → `state` |
| `cz` | Czechia | after street | mostly none / `náměstí` | `NNN NN`, before city | – |
| `gr` | Greece | after street | mostly none / `Λεωφόρος` | `NNN NN`, before city | – |

Belgium and Switzerland are multilingual: a leading French/Italian type
(`Rue`, `Via`) is captured as a prefix, while an untyped Dutch/German name is
fuse-split (`Meirstraat` → `Meir` + `straat`).

## Offshore financial centres & Crown Dependencies

Six offshore jurisdictions share the same engine. Their real-world data is
dominated by **corporate registered-agent addresses** that lead with a named
building and/or a PO box, so these parsers additionally populate a `building`
field and understand the box appearing before or after the street.

```ts
new AddressParser('ky').parseLocation('Ugland House, South Church Street, George Town, Grand Cayman, KY1-1104')
// { building: 'Ugland House', street: 'South Church', type: 'Street',
//   city: 'George Town', postal_code: 'KY1-1104', country: 'KY' }

new AddressParser('bm').parseLocation("Canon's Court, 22 Victoria Street, Hamilton HM 12")
// { building: "Canon's Court", number: '22', street: 'Victoria', type: 'Street',
//   city: 'Hamilton', postal_code: 'HM 12', country: 'BM' }

new AddressParser('je').parseLocation('Ogier House, The Esplanade, St Helier, Jersey, JE4 9WG')
// { building: 'Ogier House', street: 'The Esplanade', city: 'St Helier',
//   postal_code: 'JE4 9WG', country: 'JE' }
```

| Code | Jurisdiction | Postcode | Notes |
|------|--------------|----------|-------|
| `ky` | Cayman Islands | `KY[1-3]-NNNN`, last | island (Grand Cayman) dropped after a district |
| `vg` | British Virgin Islands | `VGNNNN`, last, **optional** | island (Tortola) dropped; `Wickhams Cay` is an area |
| `bm` | Bermuda | `AA NN` / `AA XX`, last, no comma | parish code (`HM`,`CR`,…) as post town |
| `gi` | Gibraltar | `GX11 1AA`, last, **optional** | one territory-wide postcode; city = Gibraltar |
| `je` | Jersey | `JEN NAA`, last | UK-format; parish as city; `Esplanade` kept whole |
| `gg` | Guernsey | `GYN[N] NAA`, last | ISO code `GG`; covers Alderney/Sark (island → `state`) |

There is no field for a leading company/agent name (the registered entity),
so addresses that lead with one — e.g. `Maples Corporate Services Limited,
PO Box 309, …` — are out of scope and excluded from the corpus.

## Fields

US and CA share the street fields (`number`, `civic_number_suffix`, `prefix`,
`street`, `type`, `suffix`, `sec_unit_type`, `sec_unit_num`). Canadian results
add `province`, `postal_code`, `fsa`, `ldu`; US results add `postal_code`,
`plus4`, `state`. European results use the shared street fields plus
`postal_code`, `city`, and (where applicable) `state` for the province/county;
the street `type` carries a `short_street_type` code as in US/CA. Offshore
results may additionally set `building` for a named building that leads a
corporate/registered-agent address.

## Country detection

`IntlAddressParser` auto-detects in this fixed order: explicit country name/code →
explicit European country name / UK & NL postcode shape → postal-code shape →
full region names → region codes → French street types → default US.

The continental countries (DE/FR/IT/ES) share a bare 5-digit postcode that is
ambiguous with a US ZIP, so unless the input carries an explicit country name
they fall through to the US default — **pass a `country` argument** to any
`IntlAddressParser`/`AddressParser` method when you already know the country.

## SEC EDGAR region codes

Addresses sourced from SEC EDGAR filings encode Canadian provinces and
territories with EDGAR's own `A0`–`B0` / `Z4` codes rather than the Canada Post
two-letter codes. The Canadian parser recognizes both and normalizes the EDGAR
code to the canonical province code, so an EDGAR-sourced address parses without
any pre-mapping:

```ts
new AddressParser('ca').parseLocation('123 Main St, Montreal, A8 H2X 3P6')
// { number: '123', street: 'Main', type: 'St', city: 'Montreal',
//   province: 'QC', postal_code: 'H2X 3P6', fsa: 'H2X', ldu: '3P6', country: 'CA' }
//   ^ EDGAR "A8" normalized to "QC"
```

The EDGAR codes are deliberately **not** used for country auto-detection (they
collide with unit tokens such as `Apt A8`); an EDGAR Canadian address is detected
by its postal code, then the code is resolved by the CA parser.

## Guarantee: no dropped street tokens

A parse never silently drops a word from the street line. When the structured
parse cannot fully resolve an input, the parser falls back to a minimal result
(house number + full street remainder) rather than a truncated one.
(Development/area names a jurisdiction deliberately discards — e.g. Cayman's
`Cricket Square` — are exempt from this check.)

## How it's built

Every non-US/CA jurisdiction is one declarative `EuCountryConfig`
(`src/maps/_eu`) describing its grammar — number position, type placement,
postcode shape, region field, units, PO boxes, fused-type splitting — which
`buildEuRuleset` assembles into a parser. Each jurisdiction's addressing rules,
prior-work notes, and known failure modes are documented under
[`docs/eu-research`](docs/eu-research), and every parser is validated against
100+ real-address fixtures (3,000+ total) in `__tests__/eu-fixtures`.

## Credits & license

Originally a port of Timothy B's Perl `Geo::StreetAddress::US`; ported to
TypeScript by [hassansin](https://github.com/hassansin), with the international
engine and additional contributions by [euphonie](https://github.com/euphonie)
and [sroussey](https://github.com/sroussey). Licensed under ISC.
