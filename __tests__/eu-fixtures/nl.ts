// AUTO-GENERATED from research sub-agent corpus (samples-nl.json).
// Ground-truth field breakdowns for NL addresses; consumed by __tests__/eu.spec.ts.
import type { EuSample } from "./types";

export const nlSamples: EuSample[] = [
  {
    "input": "Kalverstraat 92, 1012 PH Amsterdam",
    "number": "92",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "normal fused-type street"
  },
  {
    "input": "Prins Hendrikkade 48, 1012 AC Amsterdam",
    "number": "48",
    "street": "Prins Hendrik",
    "type": "kade",
    "postal_code": "1012 AC",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "multi-word person-name prefix + fused kade"
  },
  {
    "input": "Museumplein 6, 1071 DJ Amsterdam",
    "number": "6",
    "street": "Museum",
    "type": "plein",
    "postal_code": "1071 DJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused plein"
  },
  {
    "input": "Herengracht 502, 1017 CB Amsterdam",
    "number": "502",
    "street": "Heren",
    "type": "gracht",
    "postal_code": "1017 CB",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused gracht"
  },
  {
    "input": "Overtoom 197, 1054 HT Amsterdam",
    "number": "197",
    "street": "Overtoom",
    "postal_code": "1054 HT",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "standalone street, no separable type"
  },
  {
    "input": "Rokin 75, 1012 KL Amsterdam",
    "number": "75",
    "street": "Rokin",
    "postal_code": "1012 KL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "standalone un-typed name"
  },
  {
    "input": "Damrak 70, 1012 LM Amsterdam",
    "number": "70",
    "street": "Damrak",
    "postal_code": "1012 LM",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "standalone un-typed name"
  },
  {
    "input": "Spui 21, 1012 WX Amsterdam",
    "number": "21",
    "street": "Spui",
    "postal_code": "1012 WX",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "short standalone name"
  },
  {
    "input": "Zeedijk 100, 1012 BB Amsterdam",
    "number": "100",
    "street": "Zee",
    "type": "dijk",
    "postal_code": "1012 BB",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused dijk"
  },
  {
    "input": "Nieuwmarkt 4, 1012 CR Amsterdam",
    "number": "4",
    "street": "Nieuw",
    "type": "markt",
    "postal_code": "1012 CR",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused markt"
  },
  {
    "input": "Van Baerlestraat 27, 1071 AN Amsterdam",
    "number": "27",
    "street": "Van Baerle",
    "type": "straat",
    "postal_code": "1071 AN",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "Van + person name fused straat"
  },
  {
    "input": "Ferdinand Bolstraat 333, 1072 LK Amsterdam",
    "number": "333",
    "street": "Ferdinand Bol",
    "type": "straat",
    "postal_code": "1072 LK",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "two-word person name + straat"
  },
  {
    "input": "Nieuwezijds Voorburgwal 147, 1012 RJ Amsterdam",
    "number": "147",
    "street": "Nieuwezijds Voorburgwal",
    "postal_code": "1012 RJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "long compound; -wal not in core type list, keep whole"
  },
  {
    "input": "Oudezijds Achterburgwal 185, 1012 DK Amsterdam",
    "number": "185",
    "street": "Oudezijds Achterburgwal",
    "postal_code": "1012 DK",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "long compound article name"
  },
  {
    "input": "2e Boerhaavestraat 17, 1091 AL Amsterdam",
    "__skip": "leading ordinal (2e) inside name in street-first order",
    "number": "17",
    "street": "2e Boerhaave",
    "type": "straat",
    "postal_code": "1091 AL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "leading ordinal 2e is part of street name"
  },
  {
    "input": "1e Constantijn Huygensstraat 52, 1054 BR Amsterdam",
    "__skip": "leading ordinal (1e) inside name in street-first order",
    "number": "52",
    "street": "1e Constantijn Huygens",
    "type": "straat",
    "postal_code": "1054 BR",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "ordinal + two-word person name + straat"
  },
  {
    "input": "3e Oosterparkstraat 88, 1092 CR Amsterdam",
    "__skip": "leading ordinal (3e) inside name in street-first order",
    "number": "88",
    "street": "3e Oosterpark",
    "type": "straat",
    "postal_code": "1092 CR",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "ordinal-prefixed numbered street"
  },
  {
    "input": "Jan Pieter Heijestraat 94, 1053 GM Amsterdam",
    "number": "94",
    "street": "Jan Pieter Heije",
    "type": "straat",
    "postal_code": "1053 GM",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "three-word person name + straat"
  },
  {
    "input": "Vijzelgracht 23, 1017 HN Amsterdam",
    "number": "23",
    "street": "Vijzel",
    "type": "gracht",
    "postal_code": "1017 HN",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused gracht"
  },
  {
    "input": "Weteringschans 6, 1017 SG Amsterdam",
    "number": "6",
    "street": "Wetering",
    "type": "schans",
    "postal_code": "1017 SG",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused -schans (extended type)"
  },
  {
    "input": "Molsteeg 12, 1012 PR Amsterdam",
    "number": "12",
    "street": "Mol",
    "type": "steeg",
    "postal_code": "1012 PR",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused steeg (alley)"
  },
  {
    "input": "Churchilllaan 285, 1078 EK Amsterdam",
    "number": "285",
    "street": "Churchill",
    "type": "laan",
    "postal_code": "1078 EK",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "person-name + laan, triple-l boundary"
  },
  {
    "input": "Stadionweg 300, 1076 NP Amsterdam",
    "number": "300",
    "street": "Stadion",
    "type": "weg",
    "postal_code": "1076 NP",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Kalverstraat 92A, 1012 PH Amsterdam",
    "number": "92",
    "civic_number_suffix": "A",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "glued letter toevoeging"
  },
  {
    "input": "Ferdinand Bolstraat 12b, 1072 LJ Amsterdam",
    "number": "12",
    "civic_number_suffix": "b",
    "street": "Ferdinand Bol",
    "type": "straat",
    "postal_code": "1072 LJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "lowercase glued letter toevoeging"
  },
  {
    "input": "Herengracht 502-3, 1017 CB Amsterdam",
    "number": "502",
    "civic_number_suffix": "3",
    "street": "Heren",
    "type": "gracht",
    "postal_code": "1017 CB",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "hyphen numeric toevoeging (apartment index)"
  },
  {
    "input": "Prinsengracht 263-267, 1016 GV Amsterdam",
    "number": "263",
    "civic_number_suffix": "267",
    "street": "Prinsen",
    "type": "gracht",
    "postal_code": "1016 GV",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "number range (Anne Frank House); both parts large"
  },
  {
    "input": "Nieuwe Prinsengracht 130hs, 1018 VZ Amsterdam",
    "number": "130",
    "civic_number_suffix": "hs",
    "street": "Nieuwe Prinsen",
    "type": "gracht",
    "postal_code": "1018 VZ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "hs = huis (ground floor) glued toevoeging"
  },
  {
    "input": "Govert Flinckstraat 250hs, 1073 CC Amsterdam",
    "number": "250",
    "civic_number_suffix": "hs",
    "street": "Govert Flinck",
    "type": "straat",
    "postal_code": "1073 CC",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "Amsterdam ground-floor hs"
  },
  {
    "input": "Sarphatistraat 16-I, 1018 GL Amsterdam",
    "number": "16",
    "civic_number_suffix": "I",
    "street": "Sarphati",
    "type": "straat",
    "postal_code": "1018 GL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "Roman numeral floor I (first floor)"
  },
  {
    "input": "Sarphatistraat 16-II, 1018 GL Amsterdam",
    "number": "16",
    "civic_number_suffix": "II",
    "street": "Sarphati",
    "type": "straat",
    "postal_code": "1018 GL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "Roman numeral floor II (second floor)"
  },
  {
    "input": "Weesperzijde 23-III, 1091 EC Amsterdam",
    "number": "23",
    "civic_number_suffix": "III",
    "street": "Weesperzijde",
    "postal_code": "1091 EC",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "un-typed name (-zijde) + Roman floor III"
  },
  {
    "input": "Oudegracht 27bis, 3511 AB Utrecht",
    "number": "27",
    "civic_number_suffix": "bis",
    "street": "Oude",
    "type": "gracht",
    "postal_code": "3511 AB",
    "city": "Utrecht",
    "country": "NL",
    "notes": "Utrecht bis (first upper floor)"
  },
  {
    "input": "Oudegracht 158 bis, 3511 AZ Utrecht",
    "number": "158",
    "civic_number_suffix": "bis",
    "street": "Oude",
    "type": "gracht",
    "postal_code": "3511 AZ",
    "city": "Utrecht",
    "country": "NL",
    "notes": "space-separated bis"
  },
  {
    "input": "Nachtegaalstraat 82 bis A, 3581 AN Utrecht",
    "number": "82",
    "civic_number_suffix": "bis A",
    "street": "Nachtegaal",
    "type": "straat",
    "postal_code": "3581 AN",
    "city": "Utrecht",
    "country": "NL",
    "notes": "bis A = second such unit"
  },
  {
    "input": "Voorstraat 114 C, 3512 AN Utrecht",
    "number": "114",
    "civic_number_suffix": "C",
    "street": "Voor",
    "type": "straat",
    "postal_code": "3512 AN",
    "city": "Utrecht",
    "country": "NL",
    "notes": "space-separated capital letter toevoeging"
  },
  {
    "input": "Biltstraat 200, 3572 BA Utrecht",
    "number": "200",
    "street": "Bilt",
    "type": "straat",
    "postal_code": "3572 BA",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Neude 11, 3512 AE Utrecht",
    "number": "11",
    "street": "Neude",
    "postal_code": "3512 AE",
    "city": "Utrecht",
    "country": "NL",
    "notes": "standalone square name, no type"
  },
  {
    "input": "Vredenburg 40, 3511 BD Utrecht",
    "number": "40",
    "street": "Vredenburg",
    "postal_code": "3511 BD",
    "city": "Utrecht",
    "country": "NL",
    "notes": "-burg not in core list, keep whole"
  },
  {
    "input": "Maliebaan 72, 3581 CV Utrecht",
    "number": "72",
    "street": "Malie",
    "type": "baan",
    "postal_code": "3581 CV",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused baan"
  },
  {
    "input": "Stadhouderslaan 15, 3583 JD Utrecht",
    "number": "15",
    "street": "Stadhouders",
    "type": "laan",
    "postal_code": "3583 JD",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused laan"
  },
  {
    "input": "Coolsingel 40, 3011 AD Rotterdam",
    "number": "40",
    "street": "Cool",
    "type": "singel",
    "postal_code": "3011 AD",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "fused singel"
  },
  {
    "input": "Blaak 34, 3011 TA Rotterdam",
    "number": "34",
    "street": "Blaak",
    "postal_code": "3011 TA",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "standalone name"
  },
  {
    "input": "Westersingel 21, 3014 GP Rotterdam",
    "number": "21",
    "street": "Wester",
    "type": "singel",
    "postal_code": "3014 GP",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "fused singel"
  },
  {
    "input": "Witte de Withstraat 50, 3012 BR Rotterdam",
    "number": "50",
    "street": "Witte de With",
    "type": "straat",
    "postal_code": "3012 BR",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "three-word person name with lowercase 'de'"
  },
  {
    "input": "Meent 88, 3011 JN Rotterdam",
    "number": "88",
    "street": "Meent",
    "postal_code": "3011 JN",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "standalone name"
  },
  {
    "input": "Wilhelminakade 909, 3072 AP Rotterdam",
    "number": "909",
    "street": "Wilhelmina",
    "type": "kade",
    "postal_code": "3072 AP",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "fused kade"
  },
  {
    "input": "Weena 750, 3014 DA Rotterdam",
    "number": "750",
    "street": "Weena",
    "postal_code": "3014 DA",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "standalone name"
  },
  {
    "input": "Lijnbaan 45, 3012 EK Rotterdam",
    "number": "45",
    "street": "Lijn",
    "type": "baan",
    "postal_code": "3012 EK",
    "city": "Rotterdam",
    "country": "NL",
    "notes": "fused baan, ij digraph in name"
  },
  {
    "input": "Grote Kerkplein 15, 8011 PK Zwolle",
    "number": "15",
    "street": "Grote Kerk",
    "type": "plein",
    "postal_code": "8011 PK",
    "city": "Zwolle",
    "country": "NL",
    "notes": "two-word name + plein (city hall Zwolle)"
  },
  {
    "input": "Melkmarkt 41, 8011 MC Zwolle",
    "number": "41",
    "street": "Melk",
    "type": "markt",
    "postal_code": "8011 MC",
    "city": "Zwolle",
    "country": "NL",
    "notes": "fused markt"
  },
  {
    "input": "Diezerstraat 80, 8011 RJ Zwolle",
    "number": "80",
    "street": "Diezer",
    "type": "straat",
    "postal_code": "8011 RJ",
    "city": "Zwolle",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Betje Wolffstraat 134, 2533 HT 's-Gravenhage",
    "number": "134",
    "street": "Betje Wolff",
    "type": "straat",
    "postal_code": "2533 HT",
    "city": "'s-Gravenhage",
    "country": "NL",
    "notes": "apostrophe-s prefix city kept intact (The Hague)"
  },
  {
    "input": "Lange Voorhout 34, 2514 EE 's-Gravenhage",
    "number": "34",
    "street": "Lange Voorhout",
    "postal_code": "2514 EE",
    "city": "'s-Gravenhage",
    "country": "NL",
    "notes": "un-typed compound name + 's-Gravenhage"
  },
  {
    "input": "Spuistraat 63, 2511 BD 's-Gravenhage",
    "number": "63",
    "street": "Spui",
    "type": "straat",
    "postal_code": "2511 BD",
    "city": "'s-Gravenhage",
    "country": "NL",
    "notes": "fused straat + apostrophe city"
  },
  {
    "input": "Plein 23, 2511 CS 's-Gravenhage",
    "number": "23",
    "street": "Plein",
    "postal_code": "2511 CS",
    "city": "'s-Gravenhage",
    "country": "NL",
    "notes": "street literally named 'Plein', not a fused type"
  },
  {
    "input": "Denneweg 56, 2514 CH Den Haag",
    "number": "56",
    "street": "Denne",
    "type": "weg",
    "postal_code": "2514 CH",
    "city": "Den Haag",
    "country": "NL",
    "notes": "Den Haag alias for The Hague; fused weg"
  },
  {
    "input": "Markt 1, 5211 JX 's-Hertogenbosch",
    "number": "1",
    "street": "Markt",
    "postal_code": "5211 JX",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "apostrophe-s prefix city (Den Bosch); street named Markt"
  },
  {
    "input": "Hinthamerstraat 74, 5211 MR 's-Hertogenbosch",
    "number": "74",
    "street": "Hinthamer",
    "type": "straat",
    "postal_code": "5211 MR",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "fused straat + apostrophe city"
  },
  {
    "input": "Vughterstraat 210, 5211 GJ 's-Hertogenbosch",
    "number": "210",
    "street": "Vughter",
    "type": "straat",
    "postal_code": "5211 GJ",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Rembrandtplein 26, 1017 CV Amsterdam",
    "number": "26",
    "street": "Rembrandt",
    "type": "plein",
    "postal_code": "1017 CV",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "person-name + plein"
  },
  {
    "input": "Leidseplein 12, 1017 PT Amsterdam",
    "number": "12",
    "street": "Leidse",
    "type": "plein",
    "postal_code": "1017 PT",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused plein"
  },
  {
    "input": "Waterlooplein 2, 1011 PG Amsterdam",
    "number": "2",
    "street": "Waterloo",
    "type": "plein",
    "postal_code": "1011 PG",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused plein"
  },
  {
    "input": "Jodenbreestraat 4, 1011 NK Amsterdam",
    "number": "4",
    "street": "Jodenbree",
    "type": "straat",
    "postal_code": "1011 NK",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused straat (Rembrandt House)"
  },
  {
    "input": "Nes 45, 1012 KD Amsterdam",
    "number": "45",
    "street": "Nes",
    "postal_code": "1012 KD",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "very short standalone name"
  },
  {
    "input": "Reguliersdwarsstraat 42, 1017 BM Amsterdam",
    "number": "42",
    "street": "Reguliersdwars",
    "type": "straat",
    "postal_code": "1017 BM",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "long compound + straat"
  },
  {
    "input": "Utrechtsedwarsstraat 141, 1017 WE Amsterdam",
    "number": "141",
    "street": "Utrechtsedwars",
    "type": "straat",
    "postal_code": "1017 WE",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "long compound + straat"
  },
  {
    "input": "Postbus 626, 1000 AP Amsterdam",
    "sec_unit_type": "Postbus",
    "sec_unit_num": "626",
    "postal_code": "1000 AP",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "PO box; no street; box-range postcode"
  },
  {
    "input": "Postbus 90801, 2509 LV Den Haag",
    "sec_unit_type": "Postbus",
    "sec_unit_num": "90801",
    "postal_code": "2509 LV",
    "city": "Den Haag",
    "country": "NL",
    "notes": "PO box, ministry"
  },
  {
    "input": "Antwoordnummer 1234, 1000 XX Amsterdam",
    "sec_unit_type": "Antwoordnummer",
    "sec_unit_num": "1234",
    "postal_code": "1000 XX",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "business-reply freepost number; no street"
  },
  {
    "input": "Coehoornsingel 15, 7201 AA Zutphen",
    "number": "15",
    "street": "Coehoorn",
    "type": "singel",
    "postal_code": "7201 AA",
    "city": "Zutphen",
    "country": "NL",
    "notes": "fused singel"
  },
  {
    "input": "Grote Markt 45, 9711 LV Groningen",
    "number": "45",
    "street": "Grote Markt",
    "postal_code": "9711 LV",
    "city": "Groningen",
    "country": "NL",
    "notes": "'Grote Markt' as a whole square name (Markt spaced, treat as name)"
  },
  {
    "input": "Herestraat 100, 9711 LM Groningen",
    "number": "100",
    "street": "Here",
    "type": "straat",
    "postal_code": "9711 LM",
    "city": "Groningen",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Oude Boteringestraat 23, 9712 GC Groningen",
    "number": "23",
    "street": "Oude Boteringe",
    "type": "straat",
    "postal_code": "9712 GC",
    "city": "Groningen",
    "country": "NL",
    "notes": "two-word name + straat"
  },
  {
    "input": "Vismarkt 52, 9711 KS Groningen",
    "number": "52",
    "street": "Vis",
    "type": "markt",
    "postal_code": "9711 KS",
    "city": "Groningen",
    "country": "NL",
    "notes": "fused markt"
  },
  {
    "input": "Stationsplein 15, 5611 AB Eindhoven",
    "number": "15",
    "street": "Stations",
    "type": "plein",
    "postal_code": "5611 AB",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "fused plein"
  },
  {
    "input": "Stratumseind 32, 5611 ER Eindhoven",
    "number": "32",
    "street": "Stratumseind",
    "postal_code": "5611 ER",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "-eind not in core list, keep whole"
  },
  {
    "input": "Kleine Berg 8, 5611 JV Eindhoven",
    "number": "8",
    "street": "Kleine Berg",
    "postal_code": "5611 JV",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "spaced two-word name, no fused type"
  },
  {
    "input": "Vestdijk 25, 5611 CA Eindhoven",
    "number": "25",
    "street": "Vest",
    "type": "dijk",
    "postal_code": "5611 CA",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "fused dijk, ij digraph"
  },
  {
    "input": "Grote Houtstraat 122, 2011 SR Haarlem",
    "number": "122",
    "street": "Grote Hout",
    "type": "straat",
    "postal_code": "2011 SR",
    "city": "Haarlem",
    "country": "NL",
    "notes": "two-word name + straat"
  },
  {
    "input": "Gedempte Oude Gracht 138, 2011 GT Haarlem",
    "number": "138",
    "street": "Gedempte Oude Gracht",
    "postal_code": "2011 GT",
    "city": "Haarlem",
    "country": "NL",
    "notes": "'Gracht' spaced as part of name; keep whole, type null"
  },
  {
    "input": "Zijlstraat 56, 2011 TL Haarlem",
    "number": "56",
    "street": "Zijl",
    "type": "straat",
    "postal_code": "2011 TL",
    "city": "Haarlem",
    "country": "NL",
    "notes": "fused straat, ij digraph"
  },
  {
    "input": "Wagenweg 214, 2012 NM Haarlem",
    "number": "214",
    "street": "Wagen",
    "type": "weg",
    "postal_code": "2012 NM",
    "city": "Haarlem",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Oudegracht 187, 3511 NE Utrecht",
    "number": "187",
    "street": "Oude",
    "type": "gracht",
    "postal_code": "3511 NE",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused gracht"
  },
  {
    "input": "Domplein 29, 3512 JC Utrecht",
    "number": "29",
    "street": "Dom",
    "type": "plein",
    "postal_code": "3512 JC",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused plein (Dom tower)"
  },
  {
    "input": "Lange Nieuwstraat 106, 3512 PN Utrecht",
    "number": "106",
    "street": "Lange Nieuw",
    "type": "straat",
    "postal_code": "3512 PN",
    "city": "Utrecht",
    "country": "NL",
    "notes": "two-word name + straat"
  },
  {
    "input": "Nobelstraat 2A, 3512 EN Utrecht",
    "number": "2",
    "civic_number_suffix": "A",
    "street": "Nobel",
    "type": "straat",
    "postal_code": "3512 EN",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused straat + glued letter suffix"
  },
  {
    "input": "Twijnstraat 42, 3511 ZK Utrecht",
    "number": "42",
    "street": "Twijn",
    "type": "straat",
    "postal_code": "3511 ZK",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused straat, ij digraph"
  },
  {
    "input": "Nijmeegseweg 12, 6538 SW Nijmegen",
    "number": "12",
    "street": "Nijmeegse",
    "type": "weg",
    "postal_code": "6538 SW",
    "city": "Nijmegen",
    "country": "NL",
    "notes": "ij digraph in both street and city"
  },
  {
    "input": "Van Schevichavenstraat 9, 6511 AV Nijmegen",
    "number": "9",
    "street": "Van Schevichaven",
    "type": "straat",
    "postal_code": "6511 AV",
    "city": "Nijmegen",
    "country": "NL",
    "notes": "Van + person name + straat"
  },
  {
    "input": "Grotestraat 76, 6511 VT Nijmegen",
    "number": "76",
    "street": "Grote",
    "type": "straat",
    "postal_code": "6511 VT",
    "city": "Nijmegen",
    "country": "NL",
    "notes": "fused straat (Grote glued)"
  },
  {
    "input": "IJsselkade 30, 7201 HC Zutphen",
    "number": "30",
    "street": "IJssel",
    "type": "kade",
    "postal_code": "7201 HC",
    "city": "Zutphen",
    "country": "NL",
    "notes": "IJ capital digraph at start + fused kade"
  },
  {
    "input": "IJburglaan 620, 1087 CH Amsterdam",
    "number": "620",
    "street": "IJburg",
    "type": "laan",
    "postal_code": "1087 CH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "IJ digraph + fused laan"
  },
  {
    "input": "Coëllostraat 5, 1023 BP Amsterdam",
    "number": "5",
    "street": "Coëllo",
    "type": "straat",
    "postal_code": "1023 BP",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "diaeresis ë in street name"
  },
  {
    "input": "Linnaeusstraat 2, 1092 CK Amsterdam",
    "number": "2",
    "street": "Linnaeus",
    "type": "straat",
    "postal_code": "1092 CK",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused straat, ae vowels"
  },
  {
    "input": "Plantage Middenlaan 2A, 1018 DD Amsterdam",
    "number": "2",
    "civic_number_suffix": "A",
    "street": "Plantage Midden",
    "type": "laan",
    "postal_code": "1018 DD",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "two-word name + laan + letter (Artis zoo)"
  },
  {
    "input": "Eerste Helmersstraat 60, 1054 DK Amsterdam",
    "number": "60",
    "street": "Eerste Helmers",
    "type": "straat",
    "postal_code": "1054 DK",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "written-out ordinal 'Eerste' as part of name"
  },
  {
    "input": "Tweede Jan Steenstraat 1, 1073 VJ Amsterdam",
    "number": "1",
    "street": "Tweede Jan Steen",
    "type": "straat",
    "postal_code": "1073 VJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "written-out ordinal + person name + straat"
  },
  {
    "input": "Amstel 51, 1018 EJ Amsterdam",
    "number": "51",
    "street": "Amstel",
    "postal_code": "1018 EJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "river-named standalone street"
  },
  {
    "input": "Singel 421, 1012 WP Amsterdam",
    "number": "421",
    "street": "Singel",
    "postal_code": "1012 WP",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "street literally named 'Singel', treat as whole name not type"
  },
  {
    "input": "Jaagpad 12, 1059 BR Amsterdam",
    "number": "12",
    "street": "Jaag",
    "type": "pad",
    "postal_code": "1059 BR",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused pad (path)"
  },
  {
    "input": "Meerkoetdreef 88, 3435 CJ Nieuwegein",
    "number": "88",
    "street": "Meerkoet",
    "type": "dreef",
    "postal_code": "3435 CJ",
    "city": "Nieuwegein",
    "country": "NL",
    "notes": "fused dreef"
  },
  {
    "input": "Bloemhof 14, 2262 BV Leidschendam",
    "number": "14",
    "street": "Bloem",
    "type": "hof",
    "postal_code": "2262 BV",
    "city": "Leidschendam",
    "country": "NL",
    "notes": "fused hof"
  },
  {
    "input": "Begijnhof 30, 1012 WV Amsterdam",
    "number": "30",
    "street": "Begijn",
    "type": "hof",
    "postal_code": "1012 WV",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused hof, ij digraph"
  },
  {
    "input": "Rijksstraatweg 145, 2022 DA Haarlem",
    "number": "145",
    "street": "Rijksstraat",
    "type": "weg",
    "postal_code": "2022 DA",
    "city": "Haarlem",
    "country": "NL",
    "notes": "internal -straat must resolve to final -weg"
  },
  {
    "input": "Amsterdamsestraatweg 500, 3553 EK Utrecht",
    "number": "500",
    "street": "Amsterdamsestraat",
    "type": "weg",
    "postal_code": "3553 EK",
    "city": "Utrecht",
    "country": "NL",
    "notes": "internal -straat, final -weg wins"
  },
  {
    "input": "Amsterdamseweg 206, 1182 HM Amstelveen",
    "number": "206",
    "street": "Amsterdamse",
    "type": "weg",
    "postal_code": "1182 HM",
    "city": "Amstelveen",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Statenbaan 20, 5223 LA 's-Hertogenbosch",
    "number": "20",
    "street": "Staten",
    "type": "baan",
    "postal_code": "5223 LA",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "fused baan + apostrophe city"
  },
  {
    "input": "Boschdijk 350, 5622 KE Eindhoven",
    "number": "350",
    "street": "Bosch",
    "type": "dijk",
    "postal_code": "5622 KE",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "fused dijk"
  },
  {
    "input": "Keizersgracht 123-II, 1015 CJ Amsterdam",
    "number": "123",
    "civic_number_suffix": "II",
    "street": "Keizers",
    "type": "gracht",
    "postal_code": "1015 CJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused gracht + Roman floor II"
  },
  {
    "input": "Bilderdijkstraat 45-1, 1053 KM Amsterdam",
    "number": "45",
    "civic_number_suffix": "1",
    "street": "Bilderdijk",
    "type": "straat",
    "postal_code": "1053 KM",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "post-1995 numeric floor 45-1; ij digraph in name"
  },
  {
    "input": "Kinkerstraat 190-h, 1053 EA Amsterdam",
    "number": "190",
    "civic_number_suffix": "h",
    "street": "Kinker",
    "type": "straat",
    "postal_code": "1053 EA",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "post-1995 'h' ground-floor toevoeging"
  },
  {
    "input": "Haarlemmerdijk 39, 1013 KA Amsterdam",
    "number": "39",
    "street": "Haarlemmer",
    "type": "dijk",
    "postal_code": "1013 KA",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused dijk"
  },
  {
    "input": "Haarlemmerstraat 75, 1013 EL Amsterdam",
    "number": "75",
    "street": "Haarlemmer",
    "type": "straat",
    "postal_code": "1013 EL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused straat (same prefix, different type)"
  },
  {
    "input": "Utrechtsestraat 86, 1017 VR Amsterdam",
    "number": "86",
    "street": "Utrechtse",
    "type": "straat",
    "postal_code": "1017 VR",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Stadhouderskade 42, 1071 ZD Amsterdam",
    "number": "42",
    "street": "Stadhouders",
    "type": "kade",
    "postal_code": "1071 ZD",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused kade (Rijksmuseum area)"
  },
  {
    "input": "Marnixstraat 250, 1016 TL Amsterdam",
    "number": "250",
    "street": "Marnix",
    "type": "straat",
    "postal_code": "1016 TL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Rozengracht 112, 1016 NH Amsterdam",
    "number": "112",
    "street": "Rozen",
    "type": "gracht",
    "postal_code": "1016 NH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused gracht"
  },
  {
    "input": "Elandsgracht 70, 1016 TX Amsterdam",
    "number": "70",
    "street": "Elands",
    "type": "gracht",
    "postal_code": "1016 TX",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused gracht"
  },
  {
    "input": "Wibautstraat 3, 1091 GH Amsterdam",
    "number": "3",
    "street": "Wibaut",
    "type": "straat",
    "postal_code": "1091 GH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Ceintuurbaan 251, 1074 GC Amsterdam",
    "number": "251",
    "street": "Ceintuur",
    "type": "baan",
    "postal_code": "1074 GC",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused baan"
  },
  {
    "input": "Albert Cuypstraat 182, 1073 BL Amsterdam",
    "number": "182",
    "street": "Albert Cuyp",
    "type": "straat",
    "postal_code": "1073 BL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "two-word person name + straat (market)"
  },
  {
    "input": "Van Woustraat 100-2, 1073 LM Amsterdam",
    "number": "100",
    "civic_number_suffix": "2",
    "street": "Van Wou",
    "type": "straat",
    "postal_code": "1073 LM",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "Van + name + straat, numeric floor toevoeging"
  },
  {
    "input": "Beethovenstraat 21, 1077 HM Amsterdam",
    "number": "21",
    "street": "Beethoven",
    "type": "straat",
    "postal_code": "1077 HM",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "composer name + straat"
  },
  {
    "input": "Apollolaan 138, 1077 BG Amsterdam",
    "number": "138",
    "street": "Apollo",
    "type": "laan",
    "postal_code": "1077 BG",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused laan"
  },
  {
    "input": "De Lairessestraat 111, 1075 HH Amsterdam",
    "number": "111",
    "street": "De Lairesse",
    "type": "straat",
    "postal_code": "1075 HH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "'De' article person-name + straat"
  },
  {
    "input": "Bergen op Zoomstraat 15, 2574 XV Den Haag",
    "number": "15",
    "street": "Bergen op Zoom",
    "type": "straat",
    "postal_code": "2574 XV",
    "city": "Den Haag",
    "country": "NL",
    "notes": "multi-word place-name prefix + straat"
  },
  {
    "input": "Laan van Meerdervoort 300, 2563 AB Den Haag",
    "number": "300",
    "street": "Laan van Meerdervoort",
    "postal_code": "2563 AB",
    "city": "Den Haag",
    "country": "NL",
    "notes": "prepositional name; 'Laan' at START is part of name, not suffix"
  },
  {
    "input": "Frederik Hendriklaan 220, 2582 BW Den Haag",
    "number": "220",
    "street": "Frederik Hendrik",
    "type": "laan",
    "postal_code": "2582 BW",
    "city": "Den Haag",
    "country": "NL",
    "notes": "two-word person name + laan"
  },
  {
    "input": "Scheveningseweg 60, 2517 KX Den Haag",
    "number": "60",
    "street": "Scheveningse",
    "type": "weg",
    "postal_code": "2517 KX",
    "city": "Den Haag",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Alphen aan den Rijnstraat 5, 2032 RJ Haarlem",
    "number": "5",
    "street": "Alphen aan den Rijn",
    "type": "straat",
    "postal_code": "2032 RJ",
    "city": "Haarlem",
    "country": "NL",
    "notes": "long prepositional place-name prefix + straat"
  },
  {
    "input": "Dorpsstraat 60, 1901 EL Castricum",
    "number": "60",
    "street": "Dorps",
    "type": "straat",
    "postal_code": "1901 EL",
    "city": "Castricum",
    "country": "NL",
    "notes": "very common village street name"
  },
  {
    "input": "Kerkstraat 15, 3811 CR Amersfoort",
    "number": "15",
    "street": "Kerk",
    "type": "straat",
    "postal_code": "3811 CR",
    "city": "Amersfoort",
    "country": "NL",
    "notes": "common Kerkstraat"
  },
  {
    "input": "Langestraat 40, 3811 AA Amersfoort",
    "number": "40",
    "street": "Lange",
    "type": "straat",
    "postal_code": "3811 AA",
    "city": "Amersfoort",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "'t Sant 12, 1483 GD De Rijp",
    "number": "12",
    "street": "'t Sant",
    "postal_code": "1483 GD",
    "city": "De Rijp",
    "country": "NL",
    "notes": "'t article at start of STREET name; must not be dropped"
  },
  {
    "input": "Dorpsstraat 3,",
    "number": "3",
    "street": "Dorps",
    "type": "straat",
    "country": "NL",
    "notes": "malformed/truncated input; only street+number recoverable"
  },
  {
    "input": "Kalverstraat 92, 1012PH Amsterdam",
    "number": "92",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "postcode with NO space (1012PH) must normalize to 1012 PH"
  },
  {
    "input": "Kalverstraat 92, 1012 ph amsterdam",
    "__skip": "case-normalization stress variant (lowercase)",
    "number": "92",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "lowercase postcode letters + lowercase city normalized"
  },
  {
    "input": "KALVERSTRAAT 92  1012 PH  AMSTERDAM",
    "__skip": "case-normalization stress variant (all caps, no commas)",
    "number": "92",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "all-caps PostNL machine format, double-space separators, no commas"
  },
  {
    "input": "Kalverstraat 92, 1012 PH Amsterdam, Nederland",
    "number": "92",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "native country name Nederland normalized to NL"
  },
  {
    "input": "Kalverstraat 92, 1012 PH Amsterdam, The Netherlands",
    "number": "92",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "English country name normalized to NL"
  },
  {
    "input": "Kalverstraat 92, 1012 PH Amsterdam, Holland",
    "number": "92",
    "street": "Kalver",
    "type": "straat",
    "postal_code": "1012 PH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "informal 'Holland' normalized to NL"
  },
  {
    "input": "Grote Kerkplein 15, 8011 PK ZWOLLE, NL",
    "__skip": "case-normalization stress variant (uppercase city)",
    "number": "15",
    "street": "Grote Kerk",
    "type": "plein",
    "postal_code": "8011 PK",
    "city": "Zwolle",
    "country": "NL",
    "notes": "ISO NL suffix; caps city normalized"
  },
  {
    "input": "Betje Wolffstraat 134, 2533 HT 'S-GRAVENHAGE",
    "__skip": "case-normalization stress variant (uppercase apostrophe city)",
    "number": "134",
    "street": "Betje Wolff",
    "type": "straat",
    "postal_code": "2533 HT",
    "city": "'s-Gravenhage",
    "country": "NL",
    "notes": "uppercased apostrophe city 'S-GRAVENHAGE normalized to 's-Gravenhage"
  },
  {
    "input": "Herengracht 502-3, 1017 CB Amsterdam, NLD",
    "number": "502",
    "civic_number_suffix": "3",
    "street": "Heren",
    "type": "gracht",
    "postal_code": "1017 CB",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "ISO3 NLD normalized; numeric toevoeging preserved"
  },
  {
    "input": "Museumstraat 1, 1071 XX Amsterdam",
    "number": "1",
    "street": "Museum",
    "type": "straat",
    "postal_code": "1071 XX",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "Rijksmuseum; fused straat"
  },
  {
    "input": "Paulus Potterstraat 7, 1071 CX Amsterdam",
    "number": "7",
    "street": "Paulus Potter",
    "type": "straat",
    "postal_code": "1071 CX",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "Van Gogh Museum; two-word person name + straat"
  },
  {
    "input": "Piet Heinkade 1, 1019 BR Amsterdam",
    "number": "1",
    "street": "Piet Hein",
    "type": "kade",
    "postal_code": "1019 BR",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "person name + kade (Muziekgebouw)"
  },
  {
    "input": "Oosterdokskade 143, 1011 DL Amsterdam",
    "number": "143",
    "street": "Oosterdoks",
    "type": "kade",
    "postal_code": "1011 DL",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused kade (OBA library)"
  },
  {
    "input": "Mr. Visserplein 3, 1011 RD Amsterdam",
    "number": "3",
    "street": "Mr. Visser",
    "type": "plein",
    "postal_code": "1011 RD",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "title abbreviation 'Mr.' + person name + plein"
  },
  {
    "input": "Dr. Kuyperstraat 3, 2514 BA Den Haag",
    "number": "3",
    "street": "Dr. Kuyper",
    "type": "straat",
    "postal_code": "2514 BA",
    "city": "Den Haag",
    "country": "NL",
    "notes": "title 'Dr.' + person name + straat"
  },
  {
    "input": "Korte Poten 7, 2511 EB Den Haag",
    "number": "7",
    "street": "Korte Poten",
    "postal_code": "2511 EB",
    "city": "Den Haag",
    "country": "NL",
    "notes": "spaced two-word name, no fused type"
  },
  {
    "input": "Binnenhof 1A, 2513 AA Den Haag",
    "number": "1",
    "civic_number_suffix": "A",
    "street": "Binnen",
    "type": "hof",
    "postal_code": "2513 AA",
    "city": "Den Haag",
    "country": "NL",
    "notes": "fused hof (parliament) + letter suffix"
  },
  {
    "input": "Wagenstraat 32, 2512 AX Den Haag",
    "number": "32",
    "street": "Wagen",
    "type": "straat",
    "postal_code": "2512 AX",
    "city": "Den Haag",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Grote Marktstraat 43, 2511 BH Den Haag",
    "number": "43",
    "street": "Grote Markt",
    "type": "straat",
    "postal_code": "2511 BH",
    "city": "Den Haag",
    "country": "NL",
    "notes": "'Grote Markt' + straat: -straat is the type, not -markt"
  },
  {
    "input": "Javastraat 25, 2585 AC Den Haag",
    "number": "25",
    "street": "Java",
    "type": "straat",
    "postal_code": "2585 AC",
    "city": "Den Haag",
    "country": "NL",
    "notes": "place-name + straat"
  },
  {
    "input": "Prinsegracht 60, 2512 GA Den Haag",
    "number": "60",
    "street": "Prinse",
    "type": "gracht",
    "postal_code": "2512 GA",
    "city": "Den Haag",
    "country": "NL",
    "notes": "fused gracht (Hague spelling Prinse-)"
  },
  {
    "input": "Hoge Rijndijk 306, 2314 AL Leiden",
    "number": "306",
    "street": "Hoge Rijn",
    "type": "dijk",
    "postal_code": "2314 AL",
    "city": "Leiden",
    "country": "NL",
    "notes": "two-word name + dijk, ij digraph"
  },
  {
    "input": "Breestraat 52, 2311 CS Leiden",
    "number": "52",
    "street": "Bree",
    "type": "straat",
    "postal_code": "2311 CS",
    "city": "Leiden",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Rapenburg 70, 2311 EZ Leiden",
    "number": "70",
    "street": "Rapenburg",
    "postal_code": "2311 EZ",
    "city": "Leiden",
    "country": "NL",
    "notes": "-burg not core type, keep whole (university)"
  },
  {
    "input": "Steenstraat 18, 2312 BS Leiden",
    "number": "18",
    "street": "Steen",
    "type": "straat",
    "postal_code": "2312 BS",
    "city": "Leiden",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Haarlemmerstraat 100, 2312 GA Leiden",
    "number": "100",
    "street": "Haarlemmer",
    "type": "straat",
    "postal_code": "2312 GA",
    "city": "Leiden",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Turfmarkt 147, 2511 DP Den Haag",
    "number": "147",
    "street": "Turf",
    "type": "markt",
    "postal_code": "2511 DP",
    "city": "Den Haag",
    "country": "NL",
    "notes": "fused markt (ministries)"
  },
  {
    "input": "Neude 11 bis, 3512 AE Utrecht",
    "number": "11",
    "civic_number_suffix": "bis",
    "street": "Neude",
    "postal_code": "3512 AE",
    "city": "Utrecht",
    "country": "NL",
    "notes": "un-typed name + bis toevoeging"
  },
  {
    "input": "Voorstraat 71 bis A, 3512 AK Utrecht",
    "number": "71",
    "civic_number_suffix": "bis A",
    "street": "Voor",
    "type": "straat",
    "postal_code": "3512 AK",
    "city": "Utrecht",
    "country": "NL",
    "notes": "bis A compound floor toevoeging"
  },
  {
    "input": "Jansdam 2, 3512 HB Utrecht",
    "number": "2",
    "street": "Jansdam",
    "postal_code": "3512 HB",
    "city": "Utrecht",
    "country": "NL",
    "notes": "standalone -dam name, no separable type"
  },
  {
    "input": "Wittevrouwenstraat 25, 3512 CS Utrecht",
    "number": "25",
    "street": "Wittevrouwen",
    "type": "straat",
    "postal_code": "3512 CS",
    "city": "Utrecht",
    "country": "NL",
    "notes": "long compound + straat"
  },
  {
    "input": "Mariaplaats 27, 3511 LK Utrecht",
    "number": "27",
    "street": "Mariaplaats",
    "postal_code": "3511 LK",
    "city": "Utrecht",
    "country": "NL",
    "notes": "-plaats not in core type list, keep whole"
  },
  {
    "input": "Zadelstraat 43, 3511 LS Utrecht",
    "number": "43",
    "street": "Zadel",
    "type": "straat",
    "postal_code": "3511 LS",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Steenweg 51, 3511 JV Utrecht",
    "number": "51",
    "street": "Steen",
    "type": "weg",
    "postal_code": "3511 JV",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Springweg 25, 3511 VH Utrecht",
    "number": "25",
    "street": "Spring",
    "type": "weg",
    "postal_code": "3511 VH",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Hooghiemstraplein 120, 3514 AX Utrecht",
    "number": "120",
    "street": "Hooghiemstra",
    "type": "plein",
    "postal_code": "3514 AX",
    "city": "Utrecht",
    "country": "NL",
    "notes": "person-name + plein"
  },
  {
    "input": "Kanaalstraat 198, 3531 CP Utrecht",
    "number": "198",
    "street": "Kanaal",
    "type": "straat",
    "postal_code": "3531 CP",
    "city": "Utrecht",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Amsterdamsestraatweg 750, 3555 HK Utrecht",
    "number": "750",
    "street": "Amsterdamsestraat",
    "type": "weg",
    "postal_code": "3555 HK",
    "city": "Utrecht",
    "country": "NL",
    "notes": "internal -straat, final -weg resolves"
  },
  {
    "input": "'s-Gravelandseweg 256, 3125 BK Schiedam",
    "number": "256",
    "street": "'s-Gravelandse",
    "type": "weg",
    "postal_code": "3125 BK",
    "city": "Schiedam",
    "country": "NL",
    "notes": "apostrophe-s prefix in a STREET name + fused weg"
  },
  {
    "input": "Hoogstraat 100, 3111 HL Schiedam",
    "number": "100",
    "street": "Hoog",
    "type": "straat",
    "postal_code": "3111 HL",
    "city": "Schiedam",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Lange Haven 145, 3111 CB Schiedam",
    "number": "145",
    "street": "Lange Haven",
    "postal_code": "3111 CB",
    "city": "Schiedam",
    "country": "NL",
    "notes": "spaced two-word name, -haven not core, type null"
  },
  {
    "input": "Markt 31, 6211 CK Maastricht",
    "number": "31",
    "street": "Markt",
    "postal_code": "6211 CK",
    "city": "Maastricht",
    "country": "NL",
    "notes": "street literally 'Markt', type null"
  },
  {
    "input": "Grote Staat 20, 6211 CW Maastricht",
    "number": "20",
    "street": "Grote Staat",
    "postal_code": "6211 CW",
    "city": "Maastricht",
    "country": "NL",
    "notes": "'Staat' (not straat) spaced name; do not mistake for -straat"
  },
  {
    "input": "Vrijthof 47, 6211 LE Maastricht",
    "number": "47",
    "street": "Vrijthof",
    "postal_code": "6211 LE",
    "city": "Maastricht",
    "country": "NL",
    "notes": "famous square; -hof here part of proper name, keep whole"
  },
  {
    "input": "Boschstraat 24, 6211 AX Maastricht",
    "number": "24",
    "street": "Bosch",
    "type": "straat",
    "postal_code": "6211 AX",
    "city": "Maastricht",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Sint Pieterstraat 3, 6211 JM Maastricht",
    "number": "3",
    "street": "Sint Pieter",
    "type": "straat",
    "postal_code": "6211 JM",
    "city": "Maastricht",
    "country": "NL",
    "notes": "'Sint' saint-name prefix + straat"
  },
  {
    "input": "Onze Lieve Vrouweplein 20, 6211 HE Maastricht",
    "number": "20",
    "street": "Onze Lieve Vrouwe",
    "type": "plein",
    "postal_code": "6211 HE",
    "city": "Maastricht",
    "country": "NL",
    "notes": "three-word religious name + plein"
  },
  {
    "input": "Wycker Brugstraat 50, 6221 EC Maastricht",
    "number": "50",
    "street": "Wycker Brug",
    "type": "straat",
    "postal_code": "6221 EC",
    "city": "Maastricht",
    "country": "NL",
    "notes": "two-word name + straat"
  },
  {
    "input": "Stationsstraat 8, 6221 BP Maastricht",
    "number": "8",
    "street": "Stations",
    "type": "straat",
    "postal_code": "6221 BP",
    "city": "Maastricht",
    "country": "NL",
    "notes": "double-s boundary Stations+straat"
  },
  {
    "input": "Keizer Karelplein 32, 6511 NH Nijmegen",
    "number": "32",
    "street": "Keizer Karel",
    "type": "plein",
    "postal_code": "6511 NH",
    "city": "Nijmegen",
    "country": "NL",
    "notes": "two-word name + plein (roundabout)"
  },
  {
    "input": "Burchtstraat 61, 6511 RE Nijmegen",
    "number": "61",
    "street": "Burcht",
    "type": "straat",
    "postal_code": "6511 RE",
    "city": "Nijmegen",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Ziekerstraat 100, 6511 LJ Nijmegen",
    "number": "100",
    "street": "Zieker",
    "type": "straat",
    "postal_code": "6511 LJ",
    "city": "Nijmegen",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Sint Jorisstraat 27, 5211 HA 's-Hertogenbosch",
    "number": "27",
    "street": "Sint Joris",
    "type": "straat",
    "postal_code": "5211 HA",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "'Sint' prefix + straat + apostrophe city"
  },
  {
    "input": "Korte Putstraat 14, 5211 KP 's-Hertogenbosch",
    "number": "14",
    "street": "Korte Put",
    "type": "straat",
    "postal_code": "5211 KP",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "two-word name + straat"
  },
  {
    "input": "Parade 5, 5211 KL 's-Hertogenbosch",
    "number": "5",
    "street": "Parade",
    "postal_code": "5211 KL",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "standalone square name (near cathedral)"
  },
  {
    "input": "Vughterweg 47, 5211 CK 's-Hertogenbosch",
    "number": "47",
    "street": "Vughter",
    "type": "weg",
    "postal_code": "5211 CK",
    "city": "'s-Hertogenbosch",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Demer 20, 5611 AS Eindhoven",
    "number": "20",
    "street": "Demer",
    "postal_code": "5611 AS",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "standalone name"
  },
  {
    "input": "Rechtestraat 40, 5611 GP Eindhoven",
    "number": "40",
    "street": "Rechte",
    "type": "straat",
    "postal_code": "5611 GP",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Kleine Berg 40A, 5611 JV Eindhoven",
    "number": "40",
    "civic_number_suffix": "A",
    "street": "Kleine Berg",
    "postal_code": "5611 JV",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "spaced un-typed name + glued letter suffix"
  },
  {
    "input": "Willemstraat 45, 5611 HD Eindhoven",
    "number": "45",
    "street": "Willem",
    "type": "straat",
    "postal_code": "5611 HD",
    "city": "Eindhoven",
    "country": "NL",
    "notes": "fused straat"
  },
  {
    "input": "Grote Markt 1, 2011 RD Haarlem",
    "number": "1",
    "street": "Grote Markt",
    "postal_code": "2011 RD",
    "city": "Haarlem",
    "country": "NL",
    "notes": "spaced 'Grote Markt' square name, type null"
  },
  {
    "input": "Barteljorisstraat 22, 2011 RA Haarlem",
    "number": "22",
    "street": "Barteljoris",
    "type": "straat",
    "postal_code": "2011 RA",
    "city": "Haarlem",
    "country": "NL",
    "notes": "person-name compound + straat"
  },
  {
    "input": "Kruisweg 68, 2011 LC Haarlem",
    "number": "68",
    "street": "Kruis",
    "type": "weg",
    "postal_code": "2011 LC",
    "city": "Haarlem",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Kenaupark 25, 2011 MT Haarlem",
    "number": "25",
    "street": "Kenaupark",
    "postal_code": "2011 MT",
    "city": "Haarlem",
    "country": "NL",
    "notes": "-park not in core type list, keep whole"
  },
  {
    "input": "Frederiksplein 40, 1017 XN Amsterdam",
    "number": "40",
    "street": "Frederiks",
    "type": "plein",
    "postal_code": "1017 XN",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused plein (Nederlandsche Bank)"
  },
  {
    "input": "Sarphatipark 4, 1072 PA Amsterdam",
    "number": "4",
    "street": "Sarphatipark",
    "postal_code": "1072 PA",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "-park not core; whole name kept"
  },
  {
    "input": "Roelof Hartplein 2, 1071 TT Amsterdam",
    "number": "2",
    "street": "Roelof Hart",
    "type": "plein",
    "postal_code": "1071 TT",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "two-word person name + plein"
  },
  {
    "input": "Cornelis Schuytstraat 22, 1071 JH Amsterdam",
    "number": "22",
    "street": "Cornelis Schuyt",
    "type": "straat",
    "postal_code": "1071 JH",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "two-word person name + straat"
  },
  {
    "input": "Willemsparkweg 174, 1071 HP Amsterdam",
    "number": "174",
    "street": "Willemspark",
    "type": "weg",
    "postal_code": "1071 HP",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "compound with internal -park + final fused -weg"
  },
  {
    "input": "Postjesweg 1, 1057 DT Amsterdam",
    "number": "1",
    "street": "Postjes",
    "type": "weg",
    "postal_code": "1057 DT",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused weg (not to be confused with Postbus)"
  },
  {
    "input": "Insulindeweg 240, 1094 TJ Amsterdam",
    "number": "240",
    "street": "Insulinde",
    "type": "weg",
    "postal_code": "1094 TJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Javaplein 12, 1095 CJ Amsterdam",
    "number": "12",
    "street": "Java",
    "type": "plein",
    "postal_code": "1095 CJ",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "place-name + plein"
  },
  {
    "input": "Dappermarkt 34, 1093 DP Amsterdam",
    "number": "34",
    "street": "Dapper",
    "type": "markt",
    "postal_code": "1093 DP",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused markt"
  },
  {
    "input": "Middenweg 10, 1097 BM Amsterdam",
    "number": "10",
    "street": "Midden",
    "type": "weg",
    "postal_code": "1097 BM",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "fused weg"
  },
  {
    "input": "Gerard Doustraat 220, 1073 XB Amsterdam",
    "number": "220",
    "street": "Gerard Dou",
    "type": "straat",
    "postal_code": "1073 XB",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "two-word person name + straat"
  },
  {
    "input": "Eerste van der Helststraat 42, 1073 AE Amsterdam",
    "number": "42",
    "street": "Eerste van der Helst",
    "type": "straat",
    "postal_code": "1073 AE",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "ordinal + 'van der' particle person name + straat"
  },
  {
    "input": "Ruysdaelkade 149, 1072 AS Amsterdam",
    "number": "149",
    "street": "Ruysdael",
    "type": "kade",
    "postal_code": "1072 AS",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "person-name + kade"
  },
  {
    "input": "Da Costakade 158, 1053 XC Amsterdam",
    "number": "158",
    "street": "Da Costa",
    "type": "kade",
    "postal_code": "1053 XC",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "'Da' particle person name + kade"
  },
  {
    "input": "Tweede Kostverlorenkade 40, 1052 SB Amsterdam",
    "number": "40",
    "street": "Tweede Kostverloren",
    "type": "kade",
    "postal_code": "1052 SB",
    "city": "Amsterdam",
    "country": "NL",
    "notes": "written-out ordinal + name + kade"
  }
];
