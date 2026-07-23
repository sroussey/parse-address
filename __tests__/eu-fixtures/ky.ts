// AUTO-GENERATED from research sub-agent corpus (samples-ky-vg.json, country KY).
// Ground-truth field breakdowns for KY addresses; consumed by __tests__/eu.spec.ts.
// __skip marks documented out-of-scope corporate-address permutations.
import type { EuSample } from "./types";

export const kySamples: EuSample[] = [
  {
    "input": "PO Box 309, Ugland House, Grand Cayman, KY1-1104",
    "building": "Ugland House",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "309",
    "postal_code": "KY1-1104",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "Maples Corporate Services Limited, PO Box 309, Ugland House, Grand Cayman, KY1-1104",
    "building": "Ugland House",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "309",
    "postal_code": "KY1-1104",
    "city": "Grand Cayman",
    "country": "KY",
    "__skip": "leading registered-agent/company name (dropped in ground truth) is not an address field"
  },
  {
    "input": "PO Box 309, Ugland House, South Church Street, George Town, Grand Cayman, KY1-1104",
    "building": "Ugland House",
    "street": "South Church",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "309",
    "postal_code": "KY1-1104",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "121 South Church Street, George Town, Grand Cayman, KY1-1104",
    "number": "121",
    "street": "South Church",
    "type": "Street",
    "postal_code": "KY1-1104",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "2 Church Street, George Town, KY1-1002",
    "number": "2",
    "street": "Church",
    "type": "Street",
    "postal_code": "KY1-1002",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 10008, Willow House, Cricket Square, Grand Cayman, KY1-1001",
    "building": "Willow House",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "10008",
    "postal_code": "KY1-1001",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "Willow House, Cricket Square, PO Box 10233, George Town, Grand Cayman, KY1-1002",
    "building": "Willow House",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "10233",
    "postal_code": "KY1-1002",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "4th Floor, Willow House, Cricket Square, PO Box 884, Grand Cayman, KY1-1103",
    "building": "Willow House",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "884",
    "postal_code": "KY1-1103",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "2nd Floor, Willow House, Cricket Square, PO Box 709, Grand Cayman, KY1-1107",
    "building": "Willow House",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "709",
    "postal_code": "KY1-1107",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "5th Floor, Genesis Building, Genesis Close, PO Box 446, Grand Cayman, KY1-1106",
    "building": "Genesis Building",
    "street": "Genesis",
    "type": "Close",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "446",
    "postal_code": "KY1-1106",
    "city": "Grand Cayman",
    "country": "KY",
    "__skip": "stacked/floating secondary units in a corporate permutation not modelled"
  },
  {
    "input": "Ansbacher House, 20 Genesis Close, Grand Cayman, KY1-1208",
    "number": "20",
    "building": "Ansbacher House",
    "street": "Genesis",
    "type": "Close",
    "postal_code": "KY1-1208",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "SIX, 2nd Floor, Cricket Square, PO Box 2681, Grand Cayman, KY1-1111",
    "building": "Cricket Square",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "2681",
    "postal_code": "KY1-1111",
    "city": "Grand Cayman",
    "country": "KY",
    "__skip": "stacked/floating secondary units in a corporate permutation not modelled"
  },
  {
    "input": "Century Yard, Cricket Square, Hutchins Drive, PO Box 2681, George Town, Grand Cayman, KY1-1111",
    "building": "Century Yard",
    "street": "Hutchins",
    "type": "Drive",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "2681",
    "postal_code": "KY1-1111",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "Boundary Hall, Cricket Square, PO Box 1093, Grand Cayman, KY1-1102",
    "building": "Boundary Hall",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1093",
    "postal_code": "KY1-1102",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "PO Box 1093, Boundary Hall, Cricket Square, Grand Cayman, KY1-1102",
    "building": "Boundary Hall",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1093",
    "postal_code": "KY1-1102",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "190 Elgin Avenue, George Town, Grand Cayman, KY1-9008",
    "number": "190",
    "street": "Elgin",
    "type": "Avenue",
    "postal_code": "KY1-9008",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "Walkers Corporate Limited, 190 Elgin Avenue, George Town, Grand Cayman, KY1-9008",
    "number": "190",
    "street": "Elgin",
    "type": "Avenue",
    "postal_code": "KY1-9008",
    "city": "George Town",
    "country": "KY",
    "__skip": "leading registered-agent/company name (dropped in ground truth) is not an address field"
  },
  {
    "input": "PO Box 265, 190 Elgin Avenue, George Town, Grand Cayman, KY1-9008",
    "number": "190",
    "street": "Elgin",
    "type": "Avenue",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "265",
    "postal_code": "KY1-9008",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 1350, Clifton House, 75 Fort Street, George Town, Grand Cayman, KY1-1108",
    "number": "75",
    "building": "Clifton House",
    "street": "Fort",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1350",
    "postal_code": "KY1-1108",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "Clifton House, 75 Fort Street, PO Box 1350, George Town, Grand Cayman, KY1-1108",
    "number": "75",
    "building": "Clifton House",
    "street": "Fort",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1350",
    "postal_code": "KY1-1108",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 2547, Zephyr House, 122 Mary Street, George Town, Grand Cayman, KY1-1104",
    "number": "122",
    "building": "Zephyr House",
    "street": "Mary",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "2547",
    "postal_code": "KY1-1104",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "Zephyr House, 122 Mary Street, George Town, Grand Cayman, KY1-1104",
    "number": "122",
    "building": "Zephyr House",
    "street": "Mary",
    "type": "Street",
    "postal_code": "KY1-1104",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 2681, Century Yard, Cricket Square, Grand Cayman, KY1-1111",
    "building": "Century Yard",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "2681",
    "postal_code": "KY1-1111",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "89 Nexus Way, Camana Bay, Grand Cayman, KY1-9009",
    "number": "89",
    "street": "Nexus",
    "type": "Way",
    "postal_code": "KY1-9009",
    "city": "Camana Bay",
    "country": "KY"
  },
  {
    "input": "PO Box 31106, 89 Nexus Way, Camana Bay, Grand Cayman, KY1-1205",
    "number": "89",
    "street": "Nexus",
    "type": "Way",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "31106",
    "postal_code": "KY1-1205",
    "city": "Camana Bay",
    "country": "KY"
  },
  {
    "input": "One Nexus Way, Camana Bay, Grand Cayman, KY1-9005",
    "building": "One Nexus Way",
    "street": "Nexus",
    "type": "Way",
    "postal_code": "KY1-9005",
    "city": "Camana Bay",
    "country": "KY",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "Grand Pavilion, 802 West Bay Road, PO Box 10338, Grand Cayman, KY1-1003",
    "number": "802",
    "building": "Grand Pavilion",
    "street": "West Bay",
    "type": "Road",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "10338",
    "postal_code": "KY1-1003",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "802 West Bay Road, Grand Cayman, KY1-1003",
    "number": "802",
    "street": "West Bay",
    "type": "Road",
    "postal_code": "KY1-1003",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "PO Box 30599, Landmark Square, 64 Earth Close, Grand Cayman, KY1-1203",
    "number": "64",
    "building": "Landmark Square",
    "street": "Earth",
    "type": "Close",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "30599",
    "postal_code": "KY1-1203",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "Landmark Square, 1st Floor, PO Box 30124, Grand Cayman, KY1-1201",
    "building": "Landmark Square",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "30124",
    "postal_code": "KY1-1201",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "Governor's Square, 23 Lime Tree Bay Avenue, PO Box 1748, Grand Cayman, KY1-1109",
    "number": "23",
    "building": "Governor's Square",
    "street": "Lime Tree Bay",
    "type": "Avenue",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1748",
    "postal_code": "KY1-1109",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "PO Box 707, 3rd Floor, Harbour Place, 103 South Church Street, George Town, Grand Cayman, KY1-1107",
    "number": "103",
    "building": "Harbour Place",
    "street": "South Church",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "707",
    "postal_code": "KY1-1107",
    "city": "George Town",
    "country": "KY",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "Harbour Place, 103 South Church Street, George Town, Grand Cayman, KY1-1002",
    "number": "103",
    "building": "Harbour Place",
    "street": "South Church",
    "type": "Street",
    "postal_code": "KY1-1002",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 694, 5 Fort Street, George Town, Grand Cayman, KY1-1107",
    "number": "5",
    "street": "Fort",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "694",
    "postal_code": "KY1-1107",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 268, Elizabethan Square, Shedden Road, George Town, Grand Cayman, KY1-1104",
    "building": "Elizabethan Square",
    "street": "Shedden",
    "type": "Road",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "268",
    "postal_code": "KY1-1104",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "Elizabethan Square, Shedden Road, PO Box 268, George Town, Grand Cayman, KY1-1104",
    "building": "Elizabethan Square",
    "street": "Shedden",
    "type": "Road",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "268",
    "postal_code": "KY1-1104",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 32021, Dr Roy's Drive, George Town, Grand Cayman, KY1-1208",
    "street": "Dr Roy's",
    "type": "Drive",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "32021",
    "postal_code": "KY1-1208",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "94 Solaris Avenue, Camana Bay, Grand Cayman, KY1-1108",
    "number": "94",
    "street": "Solaris",
    "type": "Avenue",
    "postal_code": "KY1-1108",
    "city": "Camana Bay",
    "country": "KY"
  },
  {
    "input": "45 Market Street, Camana Bay, Grand Cayman, KY1-1205",
    "number": "45",
    "street": "Market",
    "type": "Street",
    "postal_code": "KY1-1205",
    "city": "Camana Bay",
    "country": "KY"
  },
  {
    "input": "PO Box 2075, Gardenia Court, 45 Market Street, Camana Bay, Grand Cayman, KY1-1105",
    "number": "45",
    "building": "Gardenia Court",
    "street": "Market",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "2075",
    "postal_code": "KY1-1105",
    "city": "Camana Bay",
    "country": "KY"
  },
  {
    "input": "Gardenia Court, Camana Bay, PO Box 2075, Grand Cayman, KY1-1105",
    "building": "Gardenia Court",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "2075",
    "postal_code": "KY1-1105",
    "city": "Camana Bay",
    "country": "KY",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "Regatta Office Park, Windward 3, West Bay Road, PO Box 705, Grand Cayman, KY1-1107",
    "building": "Regatta Office Park",
    "street": "West Bay",
    "type": "Road",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "705",
    "postal_code": "KY1-1107",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "Regatta Office Park, West Bay Road, PO Box 705, Grand Cayman, KY1-1107",
    "building": "Regatta Office Park",
    "street": "West Bay",
    "type": "Road",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "705",
    "postal_code": "KY1-1107",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "10 Market Street, Suite 769, Camana Bay, Grand Cayman, KY1-9006",
    "number": "10",
    "street": "Market",
    "type": "Street",
    "postal_code": "KY1-9006",
    "city": "Camana Bay",
    "country": "KY",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "PO Box 30592, Buckingham Square, 720 West Bay Road, Grand Cayman, KY1-1203",
    "number": "720",
    "building": "Buckingham Square",
    "street": "West Bay",
    "type": "Road",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "30592",
    "postal_code": "KY1-1203",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "36 West Bay Road, Seven Mile Beach, Grand Cayman, KY1-1205",
    "number": "36",
    "street": "West Bay",
    "type": "Road",
    "postal_code": "KY1-1205",
    "city": "Seven Mile Beach",
    "country": "KY"
  },
  {
    "input": "PO Box 10052, Grand Cayman, KY1-1001",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "10052",
    "postal_code": "KY1-1001",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "PO Box 1984, Grand Cayman, KY1-1104",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1984",
    "postal_code": "KY1-1104",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "PO Box 30464, Grand Cayman, KY1-1202",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "30464",
    "postal_code": "KY1-1202",
    "city": "Grand Cayman",
    "country": "KY"
  },
  {
    "input": "Ugland House, 121 South Church Street, PO Box 309, George Town, Grand Cayman, KY1-1104, Cayman Islands",
    "number": "121",
    "building": "Ugland House",
    "street": "South Church",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "309",
    "postal_code": "KY1-1104",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 268GT, Grand Cayman, KY1-1104",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "268GT",
    "postal_code": "KY1-1104",
    "city": "Grand Cayman",
    "country": "KY",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "Cricket Square, PO Box 2681, George Town, Grand Cayman, KY1-1111, Cayman Islands",
    "building": "Cricket Square",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "2681",
    "postal_code": "KY1-1111",
    "city": "George Town",
    "country": "KY",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "Genesis Building, Genesis Close, PO Box 448, George Town, Grand Cayman, KY1-1106",
    "building": "Genesis Building",
    "street": "Genesis",
    "type": "Close",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "448",
    "postal_code": "KY1-1106",
    "city": "George Town",
    "country": "KY"
  },
  {
    "input": "PO Box 240, Stake Bay, Cayman Brac, KY2-2101",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "240",
    "postal_code": "KY2-2101",
    "city": "Stake Bay",
    "country": "KY"
  },
  {
    "input": "West End, Cayman Brac, KY2-2201",
    "postal_code": "KY2-2201",
    "city": "West End",
    "country": "KY"
  },
  {
    "input": "PO Box 51, Blossom Village, Little Cayman, KY3-2501",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "51",
    "postal_code": "KY3-2501",
    "city": "Blossom Village",
    "country": "KY"
  },
  {
    "input": "Blossom Village, Little Cayman, KY3-2501, Cayman Islands",
    "postal_code": "KY3-2501",
    "city": "Blossom Village",
    "country": "KY"
  },
  {
    "input": "Bodden Town, Grand Cayman, KY1-1601",
    "postal_code": "KY1-1601",
    "city": "Bodden Town",
    "country": "KY"
  },
  {
    "input": "PO Box 1990, West Bay, Grand Cayman, KY1-1104, Cayman Islands",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1990",
    "postal_code": "KY1-1104",
    "city": "West Bay",
    "country": "KY"
  },
  {
    "input": "Cayman Corporate Centre, 27 Hospital Road, George Town, Grand Cayman, KY1-9008",
    "number": "27",
    "building": "Cayman Corporate Centre",
    "street": "Hospital",
    "type": "Road",
    "postal_code": "KY1-9008",
    "city": "George Town",
    "country": "KY"
  }
];
