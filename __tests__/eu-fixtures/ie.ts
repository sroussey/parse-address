// AUTO-GENERATED from research sub-agent corpus (samples-ie.json).
// Ground-truth field breakdowns for IE addresses; consumed by __tests__/eu.spec.ts.
import type { EuSample } from "./types";

export const ieSamples: EuSample[] = [
  {
    "input": "10 Grafton Street, Dublin 2, D02 VK65",
    "number": "10",
    "street": "Grafton",
    "type": "Street",
    "postal_code": "D02 VK65",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Normal Dublin address, Eircode last"
  },
  {
    "input": "10A O'Connell Street, Dublin 1, D01 T2P2",
    "number": "10",
    "civic_number_suffix": "A",
    "street": "O'Connell",
    "type": "Street",
    "postal_code": "D01 T2P2",
    "city": "Dublin 1",
    "country": "IE",
    "notes": "Number+suffix, apostrophe street name"
  },
  {
    "input": "Apt 5, 12 Baggot Street, Dublin 4",
    "number": "12",
    "street": "Baggot",
    "type": "Street",
    "sec_unit_type": "Apt",
    "sec_unit_num": "5",
    "city": "Dublin 4",
    "country": "IE",
    "notes": "Sub-unit prefix, no Eircode"
  },
  {
    "input": "Apt 5, 12 Pearse Street, Dublin 2, D02 X285",
    "number": "12",
    "street": "Pearse",
    "type": "Street",
    "sec_unit_type": "Apt",
    "sec_unit_num": "5",
    "postal_code": "D02 X285",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Sub-unit prefix with Eircode"
  },
  {
    "input": "Rose Cottage, Blarney, Co. Cork, T23 YK44",
    "street": "Rose Cottage",
    "postal_code": "T23 YK44",
    "city": "Blarney",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Named house, no number, county in state"
  },
  {
    "input": "14 Main Street, Midleton, Co. Cork",
    "number": "14",
    "street": "Main",
    "type": "Street",
    "city": "Midleton",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Town + county, no Eircode"
  },
  {
    "input": "27 Patrick Street, Cork, T12 X70A",
    "number": "27",
    "street": "Patrick",
    "type": "Street",
    "postal_code": "T12 X70A",
    "city": "Cork",
    "country": "IE",
    "notes": "Cork city centre"
  },
  {
    "input": "5 St Patrick's Street, Cork, T12 AN12",
    "number": "5",
    "street": "St Patrick's",
    "type": "Street",
    "postal_code": "T12 AN12",
    "city": "Cork",
    "country": "IE",
    "notes": "Leading St=Saint part of name, trailing Street is type"
  },
  {
    "input": "Eyre Square, Galway, H91 CX56",
    "street": "Eyre",
    "type": "Square",
    "postal_code": "H91 CX56",
    "city": "Galway",
    "country": "IE",
    "notes": "Square, no house number"
  },
  {
    "input": "Custom House Quay, Dublin 1, D01 VX88",
    "street": "Custom House",
    "type": "Quay",
    "postal_code": "D01 VX88",
    "city": "Dublin 1",
    "country": "IE",
    "notes": "Quay, no number"
  },
  {
    "input": "3 Terenure Road, Dublin 6W, D6W FK29",
    "number": "3",
    "street": "Terenure",
    "type": "Road",
    "postal_code": "D6W FK29",
    "city": "Dublin 6W",
    "country": "IE",
    "notes": "D6W special routing key"
  },
  {
    "input": "Flat 2, 8 Rathmines Road, Dublin 6, D06 H2K4",
    "number": "8",
    "street": "Rathmines",
    "type": "Road",
    "sec_unit_type": "Flat",
    "sec_unit_num": "2",
    "postal_code": "D06 H2K4",
    "city": "Dublin 6",
    "country": "IE",
    "notes": "Flat sub-unit"
  },
  {
    "input": "22 Lower Baggot Street, Dublin 2, D02 F7X4",
    "number": "22",
    "street": "Lower Baggot",
    "type": "Street",
    "postal_code": "D02 F7X4",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Directional multi-word street name"
  },
  {
    "input": "45 North Circular Road, Dublin 7, D07 KX52",
    "number": "45",
    "street": "North Circular",
    "type": "Road",
    "postal_code": "D07 KX52",
    "city": "Dublin 7",
    "country": "IE",
    "notes": "Directional multi-word street"
  },
  {
    "input": "1 Saint Stephen's Green, Dublin 2, D02 HK21",
    "number": "1",
    "street": "Saint Stephen's",
    "type": "Green",
    "postal_code": "D02 HK21",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Green is the type"
  },
  {
    "input": "17 Main St, Bray, Co. Wicklow, A98 DE34",
    "number": "17",
    "street": "Main",
    "type": "St",
    "postal_code": "A98 DE34",
    "city": "Bray",
    "state": "Co. Wicklow",
    "country": "IE",
    "notes": "Abbreviated type St, county"
  },
  {
    "input": "9 Church Rd, Greystones, Co. Wicklow, A63 K4P2",
    "number": "9",
    "street": "Church",
    "type": "Rd",
    "postal_code": "A63 K4P2",
    "city": "Greystones",
    "state": "Co. Wicklow",
    "country": "IE",
    "notes": "Abbreviated Rd"
  },
  {
    "input": "6 Newtown Ave, Blackrock, Co. Dublin, A94 XF29",
    "number": "6",
    "street": "Newtown",
    "type": "Ave",
    "postal_code": "A94 XF29",
    "city": "Blackrock",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Abbreviated Ave, Co. Dublin"
  },
  {
    "input": "Lissadell House, Ballinfull, Co. Sligo, F91 R2H8",
    "street": "Lissadell House",
    "postal_code": "F91 R2H8",
    "city": "Ballinfull",
    "state": "Co. Sligo",
    "country": "IE",
    "notes": "Named house, no number, no type"
  },
  {
    "input": "Sea View, Kinsale, Co. Cork",
    "__skip": "named house with no number",
    "street": "Sea View",
    "city": "Kinsale",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Named house, no Eircode"
  },
  {
    "input": "The Old Rectory, Adare, Co. Limerick, V94 F6D7",
    "street": "The Old Rectory",
    "postal_code": "V94 F6D7",
    "city": "Adare",
    "state": "Co. Limerick",
    "country": "IE",
    "notes": "The-prefixed named house"
  },
  {
    "input": "Ballyvolane, Fermoy, Co. Cork",
    "street": "Ballyvolane",
    "city": "Fermoy",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Townland, no street, no Eircode"
  },
  {
    "input": "Kilmurry, Co. Cork",
    "__skip": "townland only, no street/number",
    "city": "Kilmurry",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Locality + county only"
  },
  {
    "input": "12 Shop Street, Galway, H91 T8V3",
    "number": "12",
    "street": "Shop",
    "type": "Street",
    "postal_code": "H91 T8V3",
    "city": "Galway",
    "country": "IE",
    "notes": "Galway city"
  },
  {
    "input": "4 Quay Street, Galway, H91 P2X9",
    "number": "4",
    "street": "Quay",
    "type": "Street",
    "postal_code": "H91 P2X9",
    "city": "Galway",
    "country": "IE",
    "notes": "Quay Street (Quay is name here, Street is type)"
  },
  {
    "input": "23 O'Connell Street Upper, Limerick, V94 H2K9",
    "__skip": "directional qualifier (Upper) kept whole in ground truth",
    "number": "23",
    "street": "O'Connell Street Upper",
    "postal_code": "V94 H2K9",
    "city": "Limerick",
    "country": "IE",
    "notes": "Type embedded, Upper trailing modifier"
  },
  {
    "input": "8 William Street, Limerick, V94 XR52",
    "number": "8",
    "street": "William",
    "type": "Street",
    "postal_code": "V94 XR52",
    "city": "Limerick",
    "country": "IE",
    "notes": "Limerick city"
  },
  {
    "input": "15 The Mall, Waterford, X91 F8K3",
    "number": "15",
    "street": "The Mall",
    "postal_code": "X91 F8K3",
    "city": "Waterford",
    "country": "IE",
    "notes": "The Mall, type-in-name"
  },
  {
    "input": "7 Barronstrand Street, Waterford, X91 KD82",
    "number": "7",
    "street": "Barronstrand",
    "type": "Street",
    "postal_code": "X91 KD82",
    "city": "Waterford",
    "country": "IE",
    "notes": "Waterford city"
  },
  {
    "input": "31 O'Connell Street, Ennis, Co. Clare, V95 A2X7",
    "number": "31",
    "street": "O'Connell",
    "type": "Street",
    "postal_code": "V95 A2X7",
    "city": "Ennis",
    "state": "Co. Clare",
    "country": "IE",
    "notes": "Apostrophe, county Clare"
  },
  {
    "input": "2 Abbey Street, Ennis, Co. Clare",
    "number": "2",
    "street": "Abbey",
    "type": "Street",
    "city": "Ennis",
    "state": "Co. Clare",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "19 Marine Terrace, Dun Laoghaire, Co. Dublin, A96 D6P8",
    "number": "19",
    "street": "Marine",
    "type": "Terrace",
    "postal_code": "A96 D6P8",
    "city": "Dun Laoghaire",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Multi-word town Dun Laoghaire"
  },
  {
    "input": "5 Corrig Avenue, Dún Laoghaire, Co. Dublin, A96 XF71",
    "number": "5",
    "street": "Corrig",
    "type": "Avenue",
    "postal_code": "A96 XF71",
    "city": "Dún Laoghaire",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Fada in town name"
  },
  {
    "input": "44 Bridge Street, Carrick-on-Shannon, Co. Leitrim, N41 K2V6",
    "number": "44",
    "street": "Bridge",
    "type": "Street",
    "postal_code": "N41 K2V6",
    "city": "Carrick-on-Shannon",
    "state": "Co. Leitrim",
    "country": "IE",
    "notes": "Hyphenated town name"
  },
  {
    "input": "3 Church Lane, Newbridge, Co. Kildare, W12 F4H8",
    "number": "3",
    "street": "Church",
    "type": "Lane",
    "postal_code": "W12 F4H8",
    "city": "Newbridge",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "Lane type"
  },
  {
    "input": "16 Oak Close, Naas, Co. Kildare, W91 P3D2",
    "number": "16",
    "street": "Oak",
    "type": "Close",
    "postal_code": "W91 P3D2",
    "city": "Naas",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "Close type"
  },
  {
    "input": "27B Beech Drive, Portlaoise, Co. Laois, R32 XK94",
    "number": "27",
    "civic_number_suffix": "B",
    "street": "Beech",
    "type": "Drive",
    "postal_code": "R32 XK94",
    "city": "Portlaoise",
    "state": "Co. Laois",
    "country": "IE",
    "notes": "Number+suffix, Drive type"
  },
  {
    "input": "11 Willow Court, Portlaoise, Co. Laois",
    "number": "11",
    "street": "Willow",
    "type": "Court",
    "city": "Portlaoise",
    "state": "Co. Laois",
    "country": "IE",
    "notes": "Court type, no Eircode"
  },
  {
    "input": "8 Market Place, Kilkenny, R95 D8F2",
    "number": "8",
    "street": "Market",
    "type": "Place",
    "postal_code": "R95 D8F2",
    "city": "Kilkenny",
    "country": "IE",
    "notes": "Place type"
  },
  {
    "input": "1 High Street, Kilkenny, R95 VF43",
    "number": "1",
    "street": "High",
    "type": "Street",
    "postal_code": "R95 VF43",
    "city": "Kilkenny",
    "country": "IE",
    "notes": "High Street"
  },
  {
    "input": "20 Parnell Street, Dublin 1, D01 F5P2",
    "number": "20",
    "street": "Parnell",
    "type": "Street",
    "postal_code": "D01 F5P2",
    "city": "Dublin 1",
    "country": "IE",
    "notes": "Dublin 1"
  },
  {
    "input": "13 Dame Street, Dublin 2, D02 KX88",
    "number": "13",
    "street": "Dame",
    "type": "Street",
    "postal_code": "D02 KX88",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Dame Street"
  },
  {
    "input": "10-12 Dame Street, Dublin 2, D02 R5T9",
    "number": "10-12",
    "street": "Dame",
    "type": "Street",
    "postal_code": "D02 R5T9",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Number range"
  },
  {
    "input": "5 Merrion Square, Dublin 2, D02 X285",
    "number": "5",
    "street": "Merrion",
    "type": "Square",
    "postal_code": "D02 X285",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Square with number"
  },
  {
    "input": "34 Fitzwilliam Square, Dublin 2, D02 T294",
    "number": "34",
    "street": "Fitzwilliam",
    "type": "Square",
    "postal_code": "D02 T294",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Georgian square"
  },
  {
    "input": "7 Mespil Road, Dublin 4, D04 K2F8",
    "number": "7",
    "street": "Mespil",
    "type": "Road",
    "postal_code": "D04 K2F8",
    "city": "Dublin 4",
    "country": "IE",
    "notes": "Dublin 4"
  },
  {
    "input": "18 Sandymount Avenue, Dublin 4, D04 XH93",
    "number": "18",
    "street": "Sandymount",
    "type": "Avenue",
    "postal_code": "D04 XH93",
    "city": "Dublin 4",
    "country": "IE",
    "notes": "Sandymount Avenue"
  },
  {
    "input": "9 Ailesbury Road, Ballsbridge, Dublin 4, D04 F2K7",
    "number": "9",
    "street": "Ailesbury",
    "type": "Road",
    "postal_code": "D04 F2K7",
    "city": "Ballsbridge, Dublin 4",
    "country": "IE",
    "notes": "Locality + Dublin district in city"
  },
  {
    "input": "25 Griffith Avenue, Dublin 9, D09 T8X4",
    "number": "25",
    "street": "Griffith",
    "type": "Avenue",
    "postal_code": "D09 T8X4",
    "city": "Dublin 9",
    "country": "IE",
    "notes": "Dublin 9"
  },
  {
    "input": "3 Malahide Road, Dublin 3, D03 VF62",
    "number": "3",
    "street": "Malahide",
    "type": "Road",
    "postal_code": "D03 VF62",
    "city": "Dublin 3",
    "country": "IE",
    "notes": "Dublin 3"
  },
  {
    "input": "40 Howth Road, Dublin 5, D05 K4H2",
    "number": "40",
    "street": "Howth",
    "type": "Road",
    "postal_code": "D05 K4H2",
    "city": "Dublin 5",
    "country": "IE",
    "notes": "Dublin 5"
  },
  {
    "input": "12 Palmerston Park, Dublin 6, D06 XK29",
    "number": "12",
    "street": "Palmerston",
    "type": "Park",
    "postal_code": "D06 XK29",
    "city": "Dublin 6",
    "country": "IE",
    "notes": "Park type"
  },
  {
    "input": "6 Ashfield Green, Dublin 15, D15 F2P8",
    "number": "6",
    "street": "Ashfield",
    "type": "Green",
    "postal_code": "D15 F2P8",
    "city": "Dublin 15",
    "country": "IE",
    "notes": "Green as suffix type"
  },
  {
    "input": "21 Elm Grove, Dublin 16, D16 A4V7",
    "number": "21",
    "street": "Elm",
    "type": "Grove",
    "postal_code": "D16 A4V7",
    "city": "Dublin 16",
    "country": "IE",
    "notes": "Grove type"
  },
  {
    "input": "9 Beacon Crescent, Sandyford, Dublin 18, D18 K2X9",
    "number": "9",
    "street": "Beacon",
    "type": "Crescent",
    "postal_code": "D18 K2X9",
    "city": "Sandyford, Dublin 18",
    "country": "IE",
    "notes": "Crescent type"
  },
  {
    "input": "2 Liffey Row, Lucan, Co. Dublin, K78 F4D2",
    "number": "2",
    "street": "Liffey",
    "type": "Row",
    "postal_code": "K78 F4D2",
    "city": "Lucan",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Row type"
  },
  {
    "input": "14 Riverside Walk, Swords, Co. Dublin, K67 X2P9",
    "number": "14",
    "street": "Riverside",
    "type": "Walk",
    "postal_code": "K67 X2P9",
    "city": "Swords",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Walk type"
  },
  {
    "input": "5 The Rise, Malahide, Co. Dublin, K36 F8V4",
    "number": "5",
    "street": "The Rise",
    "postal_code": "K36 F8V4",
    "city": "Malahide",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "The Rise estate name"
  },
  {
    "input": "8 Hazel Hill, Skerries, Co. Dublin",
    "number": "8",
    "street": "Hazel",
    "type": "Hill",
    "city": "Skerries",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Hill type, no Eircode"
  },
  {
    "input": "3 Seapoint Terrace, Bray, Co. Wicklow, A98 X2K7",
    "number": "3",
    "street": "Seapoint",
    "type": "Terrace",
    "postal_code": "A98 X2K7",
    "city": "Bray",
    "state": "Co. Wicklow",
    "country": "IE",
    "notes": "Terrace type"
  },
  {
    "input": "17 Woodview Drive, Arklow, Co. Wicklow, Y14 F2D8",
    "number": "17",
    "street": "Woodview",
    "type": "Drive",
    "postal_code": "Y14 F2D8",
    "city": "Arklow",
    "state": "Co. Wicklow",
    "country": "IE",
    "notes": "Arklow, Y14"
  },
  {
    "input": "22 Convent Road, Wexford, Y35 K2V9",
    "number": "22",
    "street": "Convent",
    "type": "Road",
    "postal_code": "Y35 K2V9",
    "city": "Wexford",
    "country": "IE",
    "notes": "Wexford town"
  },
  {
    "input": "4 Selskar Street, Wexford, Y35 XF62",
    "number": "4",
    "street": "Selskar",
    "type": "Street",
    "postal_code": "Y35 XF62",
    "city": "Wexford",
    "country": "IE",
    "notes": "Wexford"
  },
  {
    "input": "10 Friary Street, Kilkenny, R95 K4P2",
    "number": "10",
    "street": "Friary",
    "type": "Street",
    "postal_code": "R95 K4P2",
    "city": "Kilkenny",
    "country": "IE",
    "notes": "Kilkenny"
  },
  {
    "input": "6 Emmet Place, Clonmel, Co. Tipperary, E91 F2K8",
    "number": "6",
    "street": "Emmet",
    "type": "Place",
    "postal_code": "E91 F2K8",
    "city": "Clonmel",
    "state": "Co. Tipperary",
    "country": "IE",
    "notes": "Clonmel"
  },
  {
    "input": "13 Gladstone Street, Clonmel, Co. Tipperary",
    "number": "13",
    "street": "Gladstone",
    "type": "Street",
    "city": "Clonmel",
    "state": "Co. Tipperary",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "29 Pearse Road, Sligo, F91 K2X8",
    "number": "29",
    "street": "Pearse",
    "type": "Road",
    "postal_code": "F91 K2X8",
    "city": "Sligo",
    "country": "IE",
    "notes": "Sligo town"
  },
  {
    "input": "5 Wine Street, Sligo, F91 VD73",
    "number": "5",
    "street": "Wine",
    "type": "Street",
    "postal_code": "F91 VD73",
    "city": "Sligo",
    "country": "IE",
    "notes": "Sligo"
  },
  {
    "input": "8 Shop Street, Westport, Co. Mayo, F28 K2P9",
    "number": "8",
    "street": "Shop",
    "type": "Street",
    "postal_code": "F28 K2P9",
    "city": "Westport",
    "state": "Co. Mayo",
    "country": "IE",
    "notes": "Westport Mayo"
  },
  {
    "input": "14 Bridge Street, Ballina, Co. Mayo, F26 XF82",
    "number": "14",
    "street": "Bridge",
    "type": "Street",
    "postal_code": "F26 XF82",
    "city": "Ballina",
    "state": "Co. Mayo",
    "country": "IE",
    "notes": "Ballina"
  },
  {
    "input": "3 Main Street, Castlebar, Co. Mayo",
    "number": "3",
    "street": "Main",
    "type": "Street",
    "city": "Castlebar",
    "state": "Co. Mayo",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "7 Society Street, Ballinasloe, Co. Galway, H53 F2K8",
    "number": "7",
    "street": "Society",
    "type": "Street",
    "postal_code": "H53 F2K8",
    "city": "Ballinasloe",
    "state": "Co. Galway",
    "country": "IE",
    "notes": "Galway county town"
  },
  {
    "input": "2 Sea Road, Galway, H91 K4X2",
    "number": "2",
    "street": "Sea",
    "type": "Road",
    "postal_code": "H91 K4X2",
    "city": "Galway",
    "country": "IE",
    "notes": "Galway city"
  },
  {
    "input": "18 Dominick Street, Galway, H91 T2V8",
    "number": "18",
    "street": "Dominick",
    "type": "Street",
    "postal_code": "H91 T2V8",
    "city": "Galway",
    "country": "IE",
    "notes": "Galway"
  },
  {
    "input": "9 O'Brien's Place, Athlone, Co. Westmeath, N37 F2K9",
    "number": "9",
    "street": "O'Brien's",
    "type": "Place",
    "postal_code": "N37 F2K9",
    "city": "Athlone",
    "state": "Co. Westmeath",
    "country": "IE",
    "notes": "Apostrophe street, Athlone"
  },
  {
    "input": "4 Church Street, Mullingar, Co. Westmeath, N91 XK72",
    "number": "4",
    "street": "Church",
    "type": "Street",
    "postal_code": "N91 XK72",
    "city": "Mullingar",
    "state": "Co. Westmeath",
    "country": "IE",
    "notes": "Mullingar"
  },
  {
    "input": "11 Main Street, Tullamore, Co. Offaly, R35 F2K8",
    "number": "11",
    "street": "Main",
    "type": "Street",
    "postal_code": "R35 F2K8",
    "city": "Tullamore",
    "state": "Co. Offaly",
    "country": "IE",
    "notes": "Tullamore Offaly"
  },
  {
    "input": "6 O'Connell Square, Cavan, H12 XK92",
    "number": "6",
    "street": "O'Connell",
    "type": "Square",
    "postal_code": "H12 XK92",
    "city": "Cavan",
    "country": "IE",
    "notes": "Cavan town"
  },
  {
    "input": "3 Farnham Street, Cavan, Co. Cavan, H12 F2K8",
    "number": "3",
    "street": "Farnham",
    "type": "Street",
    "postal_code": "H12 F2K8",
    "city": "Cavan",
    "state": "Co. Cavan",
    "country": "IE",
    "notes": "Cavan"
  },
  {
    "input": "8 The Diamond, Monaghan, H18 K2X9",
    "number": "8",
    "street": "The Diamond",
    "postal_code": "H18 K2X9",
    "city": "Monaghan",
    "country": "IE",
    "notes": "The Diamond, no generic type"
  },
  {
    "input": "15 Park Road, Dundalk, Co. Louth, A91 F2K8",
    "number": "15",
    "street": "Park",
    "type": "Road",
    "postal_code": "A91 F2K8",
    "city": "Dundalk",
    "state": "Co. Louth",
    "country": "IE",
    "notes": "Dundalk Louth"
  },
  {
    "input": "22 Laurence Street, Drogheda, Co. Louth, A92 XK72",
    "number": "22",
    "street": "Laurence",
    "type": "Street",
    "postal_code": "A92 XK72",
    "city": "Drogheda",
    "state": "Co. Louth",
    "country": "IE",
    "notes": "Drogheda"
  },
  {
    "input": "5 West Street, Drogheda, Co. Louth",
    "number": "5",
    "street": "West",
    "type": "Street",
    "city": "Drogheda",
    "state": "Co. Louth",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "9 Trinity Street, Drogheda, Co. Louth, A92 K2V8",
    "number": "9",
    "street": "Trinity",
    "type": "Street",
    "postal_code": "A92 K2V8",
    "city": "Drogheda",
    "state": "Co. Louth",
    "country": "IE",
    "notes": "Drogheda"
  },
  {
    "input": "12 Kenyon Street, Nenagh, Co. Tipperary, E45 F2K8",
    "number": "12",
    "street": "Kenyon",
    "type": "Street",
    "postal_code": "E45 F2K8",
    "city": "Nenagh",
    "state": "Co. Tipperary",
    "country": "IE",
    "notes": "Nenagh"
  },
  {
    "input": "3 Liberty Square, Thurles, Co. Tipperary, E41 X2K9",
    "number": "3",
    "street": "Liberty",
    "type": "Square",
    "postal_code": "E41 X2K9",
    "city": "Thurles",
    "state": "Co. Tipperary",
    "country": "IE",
    "notes": "Thurles"
  },
  {
    "input": "7 O'Connell Street, Dungarvan, Co. Waterford, X35 F2K8",
    "number": "7",
    "street": "O'Connell",
    "type": "Street",
    "postal_code": "X35 F2K8",
    "city": "Dungarvan",
    "state": "Co. Waterford",
    "country": "IE",
    "notes": "Dungarvan"
  },
  {
    "input": "4 Grattan Square, Dungarvan, Co. Waterford",
    "number": "4",
    "street": "Grattan",
    "type": "Square",
    "city": "Dungarvan",
    "state": "Co. Waterford",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "18 O'Connell Street, Sligo, F91 P2K8",
    "number": "18",
    "street": "O'Connell",
    "type": "Street",
    "postal_code": "F91 P2K8",
    "city": "Sligo",
    "country": "IE",
    "notes": "Sligo"
  },
  {
    "input": "Apartment 12, The Waterfront, Cork, T12 F8K2",
    "__skip": "building name (no street number)",
    "street": "The Waterfront",
    "sec_unit_type": "Apt",
    "sec_unit_num": "12",
    "postal_code": "T12 F8K2",
    "city": "Cork",
    "country": "IE",
    "notes": "Apartment in named development, no number"
  },
  {
    "input": "Apt 4B, 30 Camden Street, Dublin 2, D02 X2K9",
    "number": "30",
    "street": "Camden",
    "type": "Street",
    "sec_unit_type": "Apt",
    "sec_unit_num": "4B",
    "postal_code": "D02 X2K9",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Apt number with letter"
  },
  {
    "input": "Unit 4, Riverside Business Park, Bandon, Co. Cork, P72 F2K8",
    "__skip": "business park (no street number)",
    "street": "Riverside Business Park",
    "sec_unit_type": "Unit",
    "sec_unit_num": "4",
    "postal_code": "P72 F2K8",
    "city": "Bandon",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Commercial Unit"
  },
  {
    "input": "1 Washington Street, Cork, T12 K2X9",
    "number": "1",
    "street": "Washington",
    "type": "Street",
    "postal_code": "T12 K2X9",
    "city": "Cork",
    "country": "IE",
    "notes": "Cork"
  },
  {
    "input": "48 MacCurtain Street, Cork, T23 F2K8",
    "number": "48",
    "street": "MacCurtain",
    "type": "Street",
    "postal_code": "T23 F2K8",
    "city": "Cork",
    "country": "IE",
    "notes": "Cork, T23 routing key"
  },
  {
    "input": "6 Oliver Plunkett Street, Cork, T12 XK92",
    "number": "6",
    "street": "Oliver Plunkett",
    "type": "Street",
    "postal_code": "T12 XK92",
    "city": "Cork",
    "country": "IE",
    "notes": "Multi-word name"
  },
  {
    "input": "3 Grand Parade, Cork, T12 F2V8",
    "number": "3",
    "street": "Grand Parade",
    "postal_code": "T12 F2V8",
    "city": "Cork",
    "country": "IE",
    "notes": "Parade, no standard trailing type in list"
  },
  {
    "input": "9 South Mall, Cork, T12 K4X8",
    "__skip": "type word (Mall) kept whole in ground truth",
    "number": "9",
    "street": "South Mall",
    "postal_code": "T12 K4X8",
    "city": "Cork",
    "country": "IE",
    "notes": "Mall, type not in trailing list, kept in name"
  },
  {
    "input": "14 St. Patrick's Hill, Cork, T23 F2K8",
    "number": "14",
    "street": "St. Patrick's",
    "type": "Hill",
    "postal_code": "T23 F2K8",
    "city": "Cork",
    "country": "IE",
    "notes": "St.=Saint in name, Hill is type"
  },
  {
    "input": "22 Douglas Road, Cork, T12 X2K9",
    "number": "22",
    "street": "Douglas",
    "type": "Road",
    "postal_code": "T12 X2K9",
    "city": "Cork",
    "country": "IE",
    "notes": "Cork"
  },
  {
    "input": "5 Model Farm Road, Cork, T12 K2F8",
    "number": "5",
    "street": "Model Farm",
    "type": "Road",
    "postal_code": "T12 K2F8",
    "city": "Cork",
    "country": "IE",
    "notes": "Multi-word road name"
  },
  {
    "input": "3 Ballincollig, Co. Cork",
    "__skip": "number + townland, no street",
    "number": "3",
    "city": "Ballincollig",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Number but no named street, town + county"
  },
  {
    "input": "Ard na Gréine, Schull, Co. Cork, P81 F2K8",
    "street": "Ard na Gréine",
    "postal_code": "P81 F2K8",
    "city": "Schull",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "Irish-language named house, no number"
  },
  {
    "input": "The Bungalow, Kilmuckridge, Co. Wexford",
    "street": "The Bungalow",
    "city": "Kilmuckridge",
    "state": "Co. Wexford",
    "country": "IE",
    "notes": "Named house, no Eircode"
  },
  {
    "input": "Riverside, Leixlip, Co. Kildare, W23 F2K8",
    "street": "Riverside",
    "postal_code": "W23 F2K8",
    "city": "Leixlip",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "Named house Riverside"
  },
  {
    "input": "26 Beau Park Avenue, Clongriffin, Dublin 13, D13 F2K8",
    "number": "26",
    "street": "Beau Park",
    "type": "Avenue",
    "postal_code": "D13 F2K8",
    "city": "Clongriffin, Dublin 13",
    "country": "IE",
    "notes": "Multi-word estate + Avenue"
  },
  {
    "input": "7 Carysfort Downs, Blackrock, Co. Dublin, A94 K2X8",
    "number": "7",
    "street": "Carysfort Downs",
    "postal_code": "A94 K2X8",
    "city": "Blackrock",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Downs, non-standard type kept in name"
  },
  {
    "input": "11 Oakwood Grove, Tallaght, Dublin 24, D24 F2K8",
    "number": "11",
    "street": "Oakwood",
    "type": "Grove",
    "postal_code": "D24 F2K8",
    "city": "Tallaght, Dublin 24",
    "country": "IE",
    "notes": "Tallaght Dublin 24"
  },
  {
    "input": "3 Cherry Orchard Green, Dublin 10, D10 K2X8",
    "number": "3",
    "street": "Cherry Orchard",
    "type": "Green",
    "postal_code": "D10 K2X8",
    "city": "Dublin 10",
    "country": "IE",
    "notes": "Dublin 10"
  },
  {
    "input": "8 Coolock Lane, Dublin 17, D17 F2K8",
    "number": "8",
    "street": "Coolock",
    "type": "Lane",
    "postal_code": "D17 F2K8",
    "city": "Dublin 17",
    "country": "IE",
    "notes": "Dublin 17"
  },
  {
    "input": "5 Ballymun Road, Dublin 11, D11 K2X8",
    "number": "5",
    "street": "Ballymun",
    "type": "Road",
    "postal_code": "D11 K2X8",
    "city": "Dublin 11",
    "country": "IE",
    "notes": "Dublin 11"
  },
  {
    "input": "19 Kimmage Road Lower, Dublin 12, D12 F2K8",
    "__skip": "directional qualifier (Lower) kept whole",
    "number": "19",
    "street": "Kimmage Road Lower",
    "postal_code": "D12 F2K8",
    "city": "Dublin 12",
    "country": "IE",
    "notes": "Road with trailing Lower modifier"
  },
  {
    "input": "2 Clontarf Road, Dublin 3",
    "number": "2",
    "street": "Clontarf",
    "type": "Road",
    "city": "Dublin 3",
    "country": "IE",
    "notes": "No Eircode, Dublin district only"
  },
  {
    "input": "44 Foxrock Avenue, Dublin 18",
    "number": "44",
    "street": "Foxrock",
    "type": "Avenue",
    "city": "Dublin 18",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "16C Rialto Cottages, Dublin 8, D08 F2K8",
    "number": "16",
    "civic_number_suffix": "C",
    "street": "Rialto Cottages",
    "postal_code": "D08 F2K8",
    "city": "Dublin 8",
    "country": "IE",
    "notes": "Number+suffix, Cottages non-standard type"
  },
  {
    "input": "7 Meadow Vale, Kilcock, Co. Kildare, W23 K2X8",
    "number": "7",
    "street": "Meadow Vale",
    "postal_code": "W23 K2X8",
    "city": "Kilcock",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "Vale non-standard type"
  },
  {
    "input": "12 The Grange, Malahide, Co. Dublin, K36 F2K8",
    "number": "12",
    "street": "The Grange",
    "postal_code": "K36 F2K8",
    "city": "Malahide",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "The Grange estate"
  },
  {
    "input": "9 Highfield Manor, Kilkenny, R95 K2X8",
    "number": "9",
    "street": "Highfield Manor",
    "postal_code": "R95 K2X8",
    "city": "Kilkenny",
    "country": "IE",
    "notes": "Manor non-standard type"
  },
  {
    "input": "3 Woodlawn Heights, Tralee, Co. Kerry, V92 F2K8",
    "number": "3",
    "street": "Woodlawn",
    "type": "Heights",
    "postal_code": "V92 F2K8",
    "city": "Tralee",
    "state": "Co. Kerry",
    "country": "IE",
    "notes": "Heights type, Kerry"
  },
  {
    "input": "18 Rock Street, Tralee, Co. Kerry, V92 X2K8",
    "number": "18",
    "street": "Rock",
    "type": "Street",
    "postal_code": "V92 X2K8",
    "city": "Tralee",
    "state": "Co. Kerry",
    "country": "IE",
    "notes": "Tralee"
  },
  {
    "input": "5 New Street, Killarney, Co. Kerry, V93 F2K8",
    "number": "5",
    "street": "New",
    "type": "Street",
    "postal_code": "V93 F2K8",
    "city": "Killarney",
    "state": "Co. Kerry",
    "country": "IE",
    "notes": "Killarney"
  },
  {
    "input": "10 Henry Street, Limerick, V94 F2K8",
    "number": "10",
    "street": "Henry",
    "type": "Street",
    "postal_code": "V94 F2K8",
    "city": "Limerick",
    "country": "IE",
    "notes": "Limerick"
  },
  {
    "input": "3 Catherine Street, Limerick, V94 K2X8",
    "number": "3",
    "street": "Catherine",
    "type": "Street",
    "postal_code": "V94 K2X8",
    "city": "Limerick",
    "country": "IE",
    "notes": "Limerick"
  },
  {
    "input": "27 Ennis Road, Limerick, V94 X2K8",
    "number": "27",
    "street": "Ennis",
    "type": "Road",
    "postal_code": "V94 X2K8",
    "city": "Limerick",
    "country": "IE",
    "notes": "Limerick"
  },
  {
    "input": "2 Cathedral Place, Limerick",
    "number": "2",
    "street": "Cathedral",
    "type": "Place",
    "city": "Limerick",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "8 Bohermore, Galway, H91 K2X8",
    "number": "8",
    "street": "Bohermore",
    "postal_code": "H91 K2X8",
    "city": "Galway",
    "country": "IE",
    "notes": "Type-less street name"
  },
  {
    "input": "3 Prospect Hill, Galway, H91 X2K8",
    "number": "3",
    "street": "Prospect",
    "type": "Hill",
    "postal_code": "H91 X2K8",
    "city": "Galway",
    "country": "IE",
    "notes": "Hill type"
  },
  {
    "input": "12 Fairgreen Road, Naas, Co. Kildare, W91 F2K8",
    "number": "12",
    "street": "Fairgreen",
    "type": "Road",
    "postal_code": "W91 F2K8",
    "city": "Naas",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "Naas"
  },
  {
    "input": "5 Poplar Square, Naas, Co. Kildare",
    "number": "5",
    "street": "Poplar",
    "type": "Square",
    "city": "Naas",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "Apt 3, 45 Prussia Street, Dublin 7, D07 K2X8",
    "number": "45",
    "street": "Prussia",
    "type": "Street",
    "sec_unit_type": "Apt",
    "sec_unit_num": "3",
    "postal_code": "D07 K2X8",
    "city": "Dublin 7",
    "country": "IE",
    "notes": "Apt prefix Dublin 7"
  },
  {
    "input": "Flat 1, 6 Synge Street, Dublin 8, D08 X2K8",
    "number": "6",
    "street": "Synge",
    "type": "Street",
    "sec_unit_type": "Flat",
    "sec_unit_num": "1",
    "postal_code": "D08 X2K8",
    "city": "Dublin 8",
    "country": "IE",
    "notes": "Flat prefix"
  },
  {
    "input": "1 Eglinton Road, Bray, Co. Wicklow, A98 F2K8",
    "number": "1",
    "street": "Eglinton",
    "type": "Road",
    "postal_code": "A98 F2K8",
    "city": "Bray",
    "state": "Co. Wicklow",
    "country": "IE",
    "notes": "Bray"
  },
  {
    "input": "9 Vevay Road, Bray, Co. Wicklow",
    "number": "9",
    "street": "Vevay",
    "type": "Road",
    "city": "Bray",
    "state": "Co. Wicklow",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "24 Strand Road, Portmarnock, Co. Dublin, D13 X2K8",
    "number": "24",
    "street": "Strand",
    "type": "Road",
    "postal_code": "D13 X2K8",
    "city": "Portmarnock",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Portmarnock"
  },
  {
    "input": "3 Anglesea Street, Dublin 2, D02 K2X8",
    "number": "3",
    "street": "Anglesea",
    "type": "Street",
    "postal_code": "D02 K2X8",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Temple Bar area"
  },
  {
    "input": "58 Capel Street, Dublin 1, D01 X2K8",
    "number": "58",
    "street": "Capel",
    "type": "Street",
    "postal_code": "D01 X2K8",
    "city": "Dublin 1",
    "country": "IE",
    "notes": "Capel Street"
  },
  {
    "input": "7 Wellington Quay, Dublin 2, D02 F2K8",
    "number": "7",
    "street": "Wellington",
    "type": "Quay",
    "postal_code": "D02 F2K8",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Quay type with number"
  },
  {
    "input": "Bothar na Tra, An Spideal, Co. na Gaillimhe, H91 K2X8",
    "street": "Bothar na Tra",
    "postal_code": "H91 K2X8",
    "city": "An Spideal",
    "state": "Co. na Gaillimhe",
    "country": "IE",
    "notes": "Irish-language type-first street, Gaeltacht"
  },
  {
    "input": "5 Sráid na Siopaí, An Daingean, Co. Chiarraí, V92 X2K8",
    "number": "5",
    "street": "Sráid na Siopaí",
    "postal_code": "V92 X2K8",
    "city": "An Daingean",
    "state": "Co. Chiarraí",
    "country": "IE",
    "notes": "Irish Sráid=Street type-first, Dingle"
  },
  {
    "input": "10 Cnoc na Cathrach, Gaillimh, H91 F2K8",
    "number": "10",
    "street": "Cnoc na Cathrach",
    "postal_code": "H91 F2K8",
    "city": "Gaillimh",
    "country": "IE",
    "notes": "Irish-language area name, Galway in Irish"
  },
  {
    "input": "14 The Coombe, Dublin 8, D08 K2X8",
    "number": "14",
    "street": "The Coombe",
    "postal_code": "D08 K2X8",
    "city": "Dublin 8",
    "country": "IE",
    "notes": "The Coombe, no generic type"
  },
  {
    "input": "3 Thomas Street, Dublin 8",
    "number": "3",
    "street": "Thomas",
    "type": "Street",
    "city": "Dublin 8",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "9 Meath Street, Dublin 8, D08 X2K8",
    "number": "9",
    "street": "Meath",
    "type": "Street",
    "postal_code": "D08 X2K8",
    "city": "Dublin 8",
    "country": "IE",
    "notes": "Dublin 8"
  },
  {
    "input": "20 Manor Street, Stoneybatter, Dublin 7, D07 F2K8",
    "number": "20",
    "street": "Manor",
    "type": "Street",
    "postal_code": "D07 F2K8",
    "city": "Stoneybatter, Dublin 7",
    "country": "IE",
    "notes": "Locality + district"
  },
  {
    "input": "15 Nassau Street, Dublin 2, D02 XR20",
    "number": "15",
    "street": "Nassau",
    "type": "Street",
    "postal_code": "D02 XR20",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Dublin 2"
  },
  {
    "input": "1 Kildare Street, Dublin 2, D02 XR20",
    "number": "1",
    "street": "Kildare",
    "type": "Street",
    "postal_code": "D02 XR20",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Leinster House area"
  },
  {
    "input": "8 Dawson Street, Dublin 2, D02 K2X8",
    "number": "8",
    "street": "Dawson",
    "type": "Street",
    "postal_code": "D02 K2X8",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Dawson Street"
  },
  {
    "input": "42 Wexford Street, Dublin 2",
    "number": "42",
    "street": "Wexford",
    "type": "Street",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "3 Aungier Street, Dublin 2, D02 F2K8",
    "number": "3",
    "street": "Aungier",
    "type": "Street",
    "postal_code": "D02 F2K8",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Dublin 2"
  },
  {
    "input": "7 Werburgh Street, Dublin 8, D08 K2X8",
    "number": "7",
    "street": "Werburgh",
    "type": "Street",
    "postal_code": "D08 K2X8",
    "city": "Dublin 8",
    "country": "IE",
    "notes": "Dublin 8"
  },
  {
    "input": "11A Talbot Street, Dublin 1, D01 F2K8",
    "number": "11",
    "civic_number_suffix": "A",
    "street": "Talbot",
    "type": "Street",
    "postal_code": "D01 F2K8",
    "city": "Dublin 1",
    "country": "IE",
    "notes": "Number+suffix"
  },
  {
    "input": "5 Gardiner Street Lower, Dublin 1, D01 K2X8",
    "__skip": "directional qualifier (Lower) kept whole",
    "number": "5",
    "street": "Gardiner Street Lower",
    "postal_code": "D01 K2X8",
    "city": "Dublin 1",
    "country": "IE",
    "notes": "Street with trailing Lower modifier"
  },
  {
    "input": "18 Ranelagh, Dublin 6, D06 F2K8",
    "number": "18",
    "street": "Ranelagh",
    "postal_code": "D06 F2K8",
    "city": "Dublin 6",
    "country": "IE",
    "notes": "Type-less street name (village name as street)"
  },
  {
    "input": "3 Rathgar Road, Dublin 6, D06 X2K8",
    "number": "3",
    "street": "Rathgar",
    "type": "Road",
    "postal_code": "D06 X2K8",
    "city": "Dublin 6",
    "country": "IE",
    "notes": "Dublin 6"
  },
  {
    "input": "10 Terenure Road East, Dublin 6W, D6W K2X8",
    "__skip": "directional qualifier (East) kept whole",
    "number": "10",
    "street": "Terenure Road East",
    "postal_code": "D6W K2X8",
    "city": "Dublin 6W",
    "country": "IE",
    "notes": "D6W routing key, directional trailing"
  },
  {
    "input": "22 Templeogue Road, Dublin 6W, D6W F2K8",
    "number": "22",
    "street": "Templeogue",
    "type": "Road",
    "postal_code": "D6W F2K8",
    "city": "Dublin 6W",
    "country": "IE",
    "notes": "Second D6W example"
  },
  {
    "input": "6 Villiers Road, Dublin 6, D06 K2X8",
    "number": "6",
    "street": "Villiers",
    "type": "Road",
    "postal_code": "D06 K2X8",
    "city": "Dublin 6",
    "country": "IE",
    "notes": "Dublin 6"
  },
  {
    "input": "1 Marlborough Road, Donnybrook, Dublin 4, D04 F2K8",
    "number": "1",
    "street": "Marlborough",
    "type": "Road",
    "postal_code": "D04 F2K8",
    "city": "Donnybrook, Dublin 4",
    "country": "IE",
    "notes": "Locality + district"
  },
  {
    "input": "9 Serpentine Avenue, Ballsbridge, Dublin 4",
    "number": "9",
    "street": "Serpentine",
    "type": "Avenue",
    "city": "Ballsbridge, Dublin 4",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "3 Farney Park, Sandymount, Dublin 4, D04 K2X8",
    "number": "3",
    "street": "Farney",
    "type": "Park",
    "postal_code": "D04 K2X8",
    "city": "Sandymount, Dublin 4",
    "country": "IE",
    "notes": "Park type"
  },
  {
    "input": "The Mill, Slane, Co. Meath, C15 F2K8",
    "street": "The Mill",
    "postal_code": "C15 F2K8",
    "city": "Slane",
    "state": "Co. Meath",
    "country": "IE",
    "notes": "Named building, C15 routing key (Meath)"
  },
  {
    "input": "12 Trim Road, Navan, Co. Meath, C15 X2K8",
    "number": "12",
    "street": "Trim",
    "type": "Road",
    "postal_code": "C15 X2K8",
    "city": "Navan",
    "state": "Co. Meath",
    "country": "IE",
    "notes": "Navan Meath"
  },
  {
    "input": "5 Market Square, Navan, Co. Meath",
    "number": "5",
    "street": "Market",
    "type": "Square",
    "city": "Navan",
    "state": "Co. Meath",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "8 Dublin Road, Trim, Co. Meath, C15 K2X8",
    "number": "8",
    "street": "Dublin",
    "type": "Road",
    "postal_code": "C15 K2X8",
    "city": "Trim",
    "state": "Co. Meath",
    "country": "IE",
    "notes": "Dublin Road (Dublin is name here)"
  },
  {
    "input": "3 Barrack Street, Carlow, R93 F2K8",
    "number": "3",
    "street": "Barrack",
    "type": "Street",
    "postal_code": "R93 F2K8",
    "city": "Carlow",
    "country": "IE",
    "notes": "Carlow town"
  },
  {
    "input": "17 Tullow Street, Carlow, Co. Carlow, R93 X2K8",
    "number": "17",
    "street": "Tullow",
    "type": "Street",
    "postal_code": "R93 X2K8",
    "city": "Carlow",
    "state": "Co. Carlow",
    "country": "IE",
    "notes": "Carlow"
  },
  {
    "input": "9 Pearse Street, Ballina, Co. Mayo",
    "number": "9",
    "street": "Pearse",
    "type": "Street",
    "city": "Ballina",
    "state": "Co. Mayo",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "4 Main Street, Donegal Town, Co. Donegal, F94 F2K8",
    "number": "4",
    "street": "Main",
    "type": "Street",
    "postal_code": "F94 F2K8",
    "city": "Donegal Town",
    "state": "Co. Donegal",
    "country": "IE",
    "notes": "Donegal, F94"
  },
  {
    "input": "12 Port Road, Letterkenny, Co. Donegal, F92 X2K8",
    "number": "12",
    "street": "Port",
    "type": "Road",
    "postal_code": "F92 X2K8",
    "city": "Letterkenny",
    "state": "Co. Donegal",
    "country": "IE",
    "notes": "Letterkenny, F92"
  },
  {
    "input": "3 Upper Main Street, Letterkenny, Co. Donegal",
    "number": "3",
    "street": "Upper Main",
    "type": "Street",
    "city": "Letterkenny",
    "state": "Co. Donegal",
    "country": "IE",
    "notes": "Directional leading modifier, no Eircode"
  },
  {
    "input": "8 The Square, Roscommon, F42 F2K8",
    "number": "8",
    "street": "The Square",
    "postal_code": "F42 F2K8",
    "city": "Roscommon",
    "country": "IE",
    "notes": "The Square, F42"
  },
  {
    "input": "5 Abbey Street, Roscommon, Co. Roscommon",
    "number": "5",
    "street": "Abbey",
    "type": "Street",
    "city": "Roscommon",
    "state": "Co. Roscommon",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "7 Main Street, Longford, N39 F2K8",
    "number": "7",
    "street": "Main",
    "type": "Street",
    "postal_code": "N39 F2K8",
    "city": "Longford",
    "country": "IE",
    "notes": "Longford, N39"
  },
  {
    "input": "3 Ballymahon Street, Longford, Co. Longford, N39 X2K8",
    "number": "3",
    "street": "Ballymahon",
    "type": "Street",
    "postal_code": "N39 X2K8",
    "city": "Longford",
    "state": "Co. Longford",
    "country": "IE",
    "notes": "Longford"
  },
  {
    "input": "9 Bridge Street, Tuam, Co. Galway, H54 F2K8",
    "number": "9",
    "street": "Bridge",
    "type": "Street",
    "postal_code": "H54 F2K8",
    "city": "Tuam",
    "state": "Co. Galway",
    "country": "IE",
    "notes": "Tuam, H54"
  },
  {
    "input": "12 Vicar Street, Tuam, Co. Galway",
    "number": "12",
    "street": "Vicar",
    "type": "Street",
    "city": "Tuam",
    "state": "Co. Galway",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "Glenview, Recess, Co. Galway, H91 X2K8",
    "street": "Glenview",
    "postal_code": "H91 X2K8",
    "city": "Recess",
    "state": "Co. Galway",
    "country": "IE",
    "notes": "Named house, Connemara"
  },
  {
    "input": "5 Church View, Clonakilty, Co. Cork, P85 F2K8",
    "__skip": "type word (View) kept whole in ground truth",
    "number": "5",
    "street": "Church View",
    "postal_code": "P85 F2K8",
    "city": "Clonakilty",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "View non-standard type, Clonakilty P85"
  },
  {
    "input": "18 Pearse Street, Clonakilty, Co. Cork",
    "number": "18",
    "street": "Pearse",
    "type": "Street",
    "city": "Clonakilty",
    "state": "Co. Cork",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "3 Emmet Square, Birr, Co. Offaly, R42 F2K8",
    "number": "3",
    "street": "Emmet",
    "type": "Square",
    "postal_code": "R42 F2K8",
    "city": "Birr",
    "state": "Co. Offaly",
    "country": "IE",
    "notes": "Birr, R42"
  },
  {
    "input": "7 Castle Street, Athy, Co. Kildare, R14 F2K8",
    "number": "7",
    "street": "Castle",
    "type": "Street",
    "postal_code": "R14 F2K8",
    "city": "Athy",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "Athy, R14"
  },
  {
    "input": "22 Leinster Street, Athy, Co. Kildare",
    "number": "22",
    "street": "Leinster",
    "type": "Street",
    "city": "Athy",
    "state": "Co. Kildare",
    "country": "IE",
    "notes": "No Eircode"
  },
  {
    "input": "Apt 7, 3 Charlotte Quay, Dublin 4, D04 F2K8",
    "number": "3",
    "street": "Charlotte",
    "type": "Quay",
    "sec_unit_type": "Apt",
    "sec_unit_num": "7",
    "postal_code": "D04 F2K8",
    "city": "Dublin 4",
    "country": "IE",
    "notes": "Apt prefix with Quay type"
  },
  {
    "input": "Apartment 9, 21 Hanover Quay, Dublin 2, D02 X2K8",
    "__skip": "type word (Quay) kept whole in ground truth",
    "number": "21",
    "street": "Hanover",
    "type": "Quay",
    "sec_unit_type": "Apt",
    "sec_unit_num": "9",
    "postal_code": "D02 X2K8",
    "city": "Dublin 2",
    "country": "IE",
    "notes": "Apartment spelled out"
  },
  {
    "input": "1 Grattan Crescent, Inchicore, Dublin 8, D08 K2X8",
    "number": "1",
    "street": "Grattan",
    "type": "Crescent",
    "postal_code": "D08 K2X8",
    "city": "Inchicore, Dublin 8",
    "country": "IE",
    "notes": "Crescent, locality + district"
  },
  {
    "input": "45 Mount Merrion Avenue, Blackrock, Co. Dublin, A94 X2K8",
    "number": "45",
    "street": "Mount Merrion",
    "type": "Avenue",
    "postal_code": "A94 X2K8",
    "city": "Blackrock",
    "state": "Co. Dublin",
    "country": "IE",
    "notes": "Multi-word avenue name"
  },
  {
    "input": "3 Newtownmountkennedy, Co. Wicklow, A63 F2K8",
    "__skip": "number + townland, no street",
    "number": "3",
    "postal_code": "A63 F2K8",
    "city": "Newtownmountkennedy",
    "state": "Co. Wicklow",
    "country": "IE",
    "notes": "Very long single-word town name, no street"
  },
  {
    "input": "10 Fr. Griffin Road, Galway, H91 K2X8",
    "number": "10",
    "street": "Fr. Griffin",
    "type": "Road",
    "postal_code": "H91 K2X8",
    "city": "Galway",
    "country": "IE",
    "notes": "Abbreviated Fr. (Father) in name"
  },
  {
    "input": "5 St. Augustine Street, Galway, H91 F2K8",
    "number": "5",
    "street": "St. Augustine",
    "type": "Street",
    "postal_code": "H91 F2K8",
    "city": "Galway",
    "country": "IE",
    "notes": "St.=Saint leading in name"
  },
  {
    "input": "9 Mardyke Walk, Cork, T12 K2X8",
    "number": "9",
    "street": "Mardyke",
    "type": "Walk",
    "postal_code": "T12 K2X8",
    "city": "Cork",
    "country": "IE",
    "notes": "Walk type"
  },
  {
    "input": "3 Sunday's Well Road, Cork, T23 F2K8",
    "number": "3",
    "street": "Sunday's Well",
    "type": "Road",
    "postal_code": "T23 F2K8",
    "city": "Cork",
    "country": "IE",
    "notes": "Apostrophe multi-word name"
  },
  {
    "input": "7 Blackrock Road, Cork, T12 X2K8",
    "number": "7",
    "street": "Blackrock",
    "type": "Road",
    "postal_code": "T12 X2K8",
    "city": "Cork",
    "country": "IE",
    "notes": "Cork"
  },
  {
    "input": "Cnoc Aoibhinn, Bearna, Co. na Gaillimhe",
    "street": "Cnoc Aoibhinn",
    "city": "Bearna",
    "state": "Co. na Gaillimhe",
    "country": "IE",
    "notes": "Irish named house, no Eircode, Irish county form"
  },
  {
    "input": "24 The Paddocks, Enniscorthy, Co. Wexford, Y21 F2K8",
    "number": "24",
    "street": "The Paddocks",
    "postal_code": "Y21 F2K8",
    "city": "Enniscorthy",
    "state": "Co. Wexford",
    "country": "IE",
    "notes": "The Paddocks estate, Y21"
  },
  {
    "input": "6 Slaney Street, Enniscorthy, Co. Wexford",
    "number": "6",
    "street": "Slaney",
    "type": "Street",
    "city": "Enniscorthy",
    "state": "Co. Wexford",
    "country": "IE",
    "notes": "No Eircode"
  }
];
