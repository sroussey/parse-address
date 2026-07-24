// AUTO-GENERATED from research sub-agent corpus (samples-bm-gi.json, country GI).
// Ground-truth field breakdowns for GI addresses; consumed by __tests__/eu.spec.ts.
// __skip marks documented out-of-scope corporate-address permutations.
import type { EuSample } from "./types";

export const giSamples: EuSample[] = [
  {
    "input": "Suite 1, Burns House, 19 Town Range, Gibraltar, GX11 1AA",
    "number": "19",
    "building": "Burns House",
    "street": "Town Range",
    "sec_unit_type": "Suite",
    "sec_unit_num": "1",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 23, Portland House, Glacis Road, Gibraltar, GX11 1AA",
    "building": "Portland House",
    "street": "Glacis",
    "type": "Road",
    "sec_unit_type": "Suite",
    "sec_unit_num": "23",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Madison Building, Midtown, Queensway, Gibraltar, GX11 1AA",
    "building": "Madison Building",
    "street": "Queensway",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "PO Box 199, Madison Building, Midtown, Queensway, Gibraltar, GX11 1AA",
    "building": "Madison Building",
    "street": "Queensway",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "199",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "Burns House, 19 Town Range, Gibraltar, GX11 1AA",
    "number": "19",
    "building": "Burns House",
    "street": "Town Range",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "World Trade Center, 6 Bayside Road, Gibraltar, GX11 1AA",
    "number": "6",
    "building": "World Trade Center",
    "street": "Bayside",
    "type": "Road",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Unit 1.02, 1st Floor, 6 Bayside Road, Gibraltar, GX11 1AA",
    "number": "6",
    "street": "Bayside",
    "type": "Road",
    "sec_unit_type": "Unit",
    "sec_unit_num": "1.02",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "stacked/floating secondary units in a corporate permutation not modelled"
  },
  {
    "input": "Suite 4.3.02, Block 4, Eurotowers, Gibraltar, GX11 1AA",
    "building": "Eurotowers",
    "sec_unit_type": "Suite",
    "sec_unit_num": "4.3.02",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "Block 2, Watergardens, Suite 9, Gibraltar, GX11 1AA",
    "building": "Watergardens",
    "sec_unit_type": "Suite",
    "sec_unit_num": "9",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "Suite 24, Watergardens 6, Gibraltar, GX11 1AA",
    "building": "Watergardens 6",
    "sec_unit_type": "Suite",
    "sec_unit_num": "24",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "Regal House, Queensway, Gibraltar, GX11 1AA",
    "building": "Regal House",
    "street": "Queensway",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Neptune House, Marina Bay, Gibraltar, GX11 1AA",
    "building": "Neptune House",
    "street": "Marina Bay",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "International Commercial Centre, Casemates Square, Gibraltar, GX11 1AA",
    "building": "International Commercial Centre",
    "street": "Casemates",
    "type": "Square",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 785, Europort, Gibraltar, GX11 1AA",
    "building": "Europort",
    "sec_unit_type": "Suite",
    "sec_unit_num": "785",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "First Floor, Grand Ocean Plaza, Ocean Village, Gibraltar, GX11 1AA",
    "building": "Grand Ocean Plaza",
    "street": "Ocean Village",
    "sec_unit_type": "Floor",
    "sec_unit_num": "First",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "292 Main Street, Gibraltar, GX11 1AA",
    "number": "292",
    "street": "Main",
    "type": "Street",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "57 Line Wall Road, Gibraltar, GX11 1AA",
    "number": "57",
    "street": "Line Wall",
    "type": "Road",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "28 Irish Town, Gibraltar, GX11 1AA",
    "number": "28",
    "street": "Irish Town",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Hadfield House, 4 Library Ramp, Gibraltar, GX11 1AA",
    "number": "4",
    "building": "Hadfield House",
    "street": "Library",
    "type": "Ramp",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Sovereign Place, 117 Main Street, Gibraltar, GX11 1AA",
    "number": "117",
    "building": "Sovereign Place",
    "street": "Main",
    "type": "Street",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Leanse Place, 50 Town Range, Gibraltar, GX11 1AA",
    "number": "50",
    "building": "Leanse Place",
    "street": "Town Range",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 5.28, World Trade Center, 6 Bayside Road, Gibraltar, GX11 1AA",
    "number": "6",
    "building": "World Trade Center",
    "street": "Bayside",
    "type": "Road",
    "sec_unit_type": "Suite",
    "sec_unit_num": "5.28",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 2, 4 Giro's Passage, Gibraltar, GX11 1AA",
    "number": "4",
    "street": "Giro's",
    "type": "Passage",
    "sec_unit_type": "Suite",
    "sec_unit_num": "2",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "10 Governor's Street, Gibraltar, GX11 1AA",
    "number": "10",
    "street": "Governor's",
    "type": "Street",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "47a Irish Town, Gibraltar, GX11 1AA",
    "number": "47",
    "civic_number_suffix": "a",
    "street": "Irish Town",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "5 Main Street, Gibraltar",
    "number": "5",
    "street": "Main",
    "type": "Street",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 3, 9 Cooperage Lane, Gibraltar",
    "number": "9",
    "street": "Cooperage",
    "type": "Lane",
    "sec_unit_type": "Suite",
    "sec_unit_num": "3",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "32 Line Wall Road, Gibraltar",
    "number": "32",
    "street": "Line Wall",
    "type": "Road",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Europa House, 4 Cannon Lane, Gibraltar",
    "number": "4",
    "building": "Europa House",
    "street": "Cannon",
    "type": "Lane",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "1 Corral Road, Gibraltar",
    "number": "1",
    "street": "Corral",
    "type": "Road",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "6 Bayside Road, Gibraltar, GX11 1AA, GI",
    "number": "6",
    "street": "Bayside",
    "type": "Road",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 1, Portland House, Glacis Road, Gibraltar, GIB",
    "building": "Portland House",
    "street": "Glacis",
    "type": "Road",
    "sec_unit_type": "Suite",
    "sec_unit_num": "1",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Grand Ocean Plaza, Ocean Village, Gibraltar, Gibraltar",
    "building": "Grand Ocean Plaza",
    "street": "Ocean Village",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "Suite 872, Europort, Gibraltar, GX11 1AA",
    "building": "Europort",
    "sec_unit_type": "Suite",
    "sec_unit_num": "872",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "2nd Floor, The Tower, Marina Bay, Gibraltar, GX11 1AA",
    "building": "The Tower",
    "street": "Marina Bay",
    "sec_unit_type": "Floor",
    "sec_unit_num": "2nd",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Flat 3, 109 Main Street, Gibraltar, GX11 1AA",
    "number": "109",
    "street": "Main",
    "type": "Street",
    "sec_unit_type": "Flat",
    "sec_unit_num": "3",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Unit F7, First Floor, Leisure Island Business Centre, Ocean Village, Gibraltar, GX11 1AA",
    "building": "Leisure Island Business Centre",
    "street": "Ocean Village",
    "sec_unit_type": "Unit",
    "sec_unit_num": "F7",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "stacked/floating secondary units in a corporate permutation not modelled"
  },
  {
    "input": "200 Main Street, Gibraltar, GX11 1AA",
    "number": "200",
    "street": "Main",
    "type": "Street",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "5 Secretary's Lane, Gibraltar, GX11 1AA",
    "number": "5",
    "street": "Secretary's",
    "type": "Lane",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "3 Bell Lane, Gibraltar",
    "number": "3",
    "street": "Bell",
    "type": "Lane",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "84 Irish Town, Gibraltar, GX11 1AA",
    "number": "84",
    "street": "Irish Town",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "PO Box 555, Gibraltar, GX11 1AA",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "555",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 34, International Commercial Centre, 2a Casemates Square, Gibraltar, GX11 1AA",
    "number": "2",
    "civic_number_suffix": "a",
    "building": "International Commercial Centre",
    "street": "Casemates",
    "type": "Square",
    "sec_unit_type": "Suite",
    "sec_unit_num": "34",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "1st Floor, Grand Ocean Plaza, Gibraltar, GX11 1AA",
    "building": "Grand Ocean Plaza",
    "sec_unit_type": "Floor",
    "sec_unit_num": "1st",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "Block 5, Watergardens, Gibraltar, GX11 1AA",
    "building": "Watergardens",
    "sec_unit_type": "Block",
    "sec_unit_num": "5",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  },
  {
    "input": "15 John Mackintosh Square, Gibraltar, GX11 1AA",
    "number": "15",
    "street": "John Mackintosh",
    "type": "Square",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "PO Box 1338, 292 Main Street, Gibraltar, GX11 1AA",
    "number": "292",
    "street": "Main",
    "type": "Street",
    "sec_unit_type": "PO Box",
    "sec_unit_num": "1338",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite B, 8 Governor's Parade, Gibraltar, GX11 1AA",
    "number": "8",
    "street": "Governor's",
    "type": "Parade",
    "sec_unit_type": "Suite",
    "sec_unit_num": "B",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "26 Line Wall Road, Gibraltar, GX11 1AA",
    "number": "26",
    "street": "Line Wall",
    "type": "Road",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Heritage House, 235 Main Street, Gibraltar, GX11 1AA",
    "number": "235",
    "building": "Heritage House",
    "street": "Main",
    "type": "Street",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "2 Convent Place, Gibraltar, GX11 1AA",
    "number": "2",
    "street": "Convent",
    "type": "Place",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "9 Cornwall's Lane, Gibraltar, GX11 1AA",
    "number": "9",
    "street": "Cornwall's",
    "type": "Lane",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 41, Victoria House, 26 Main Street, Gibraltar, GX11 1AA",
    "number": "26",
    "building": "Victoria House",
    "street": "Main",
    "type": "Street",
    "sec_unit_type": "Suite",
    "sec_unit_num": "41",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "First Floor, 9 Cooperage Lane, Gibraltar",
    "number": "9",
    "street": "Cooperage",
    "type": "Lane",
    "sec_unit_type": "Floor",
    "sec_unit_num": "First",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Watergate House, 2/8 Casemates Square, Gibraltar, GX11 1AA",
    "number": "2/8",
    "building": "Watergate House",
    "street": "Casemates",
    "type": "Square",
    "postal_code": "GX11 1AA",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "corporate-address permutation (building/unit/box ordering) not structurally modelled"
  },
  {
    "input": "47 Irish Town, Gibraltar",
    "number": "47",
    "street": "Irish Town",
    "city": "Gibraltar",
    "country": "GI"
  },
  {
    "input": "Suite 785, Europort, Gibraltar, GIB",
    "building": "Europort",
    "sec_unit_type": "Suite",
    "sec_unit_num": "785",
    "city": "Gibraltar",
    "country": "GI",
    "__skip": "building name is an un-suffixed proper noun (no building keyword) — not structurally recoverable"
  }
];
