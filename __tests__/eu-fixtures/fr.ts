// AUTO-GENERATED from research sub-agent corpus (samples-fr.json).
// Ground-truth field breakdowns for FR addresses; consumed by __tests__/eu.spec.ts.
import type { EuSample } from "./types";

export const frSamples: EuSample[] = [
  {
    "input": "10 Rue de Rivoli, 75001 Paris",
    "number": "10",
    "street": "de Rivoli",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "normal"
  },
  {
    "input": "55 Rue du Faubourg Saint-Honoré, 75008 Paris",
    "number": "55",
    "street": "du Faubourg Saint-Honoré",
    "type": "Rue",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "type word 'Faubourg' embedded in name; only Rue is the type"
  },
  {
    "input": "8 Avenue des Champs-Élysées, 75008 Paris",
    "number": "8",
    "street": "des Champs-Élysées",
    "type": "Avenue",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "hyphenated accented name"
  },
  {
    "input": "10 bis Avenue Victor Hugo, 75116 Paris",
    "number": "10",
    "civic_number_suffix": "bis",
    "street": "Victor Hugo",
    "type": "Avenue",
    "postal_code": "75116",
    "city": "Paris",
    "country": "FR",
    "notes": "bis repetition index; 75116 arrondissement exception"
  },
  {
    "input": "2 ter Avenue du Général Leclerc, 75014 Paris",
    "number": "2",
    "civic_number_suffix": "ter",
    "street": "du Général Leclerc",
    "type": "Avenue",
    "postal_code": "75014",
    "city": "Paris",
    "country": "FR",
    "notes": "ter repetition index"
  },
  {
    "input": "5 quater Chemin des Vignes, 33000 Bordeaux",
    "number": "5",
    "civic_number_suffix": "quater",
    "street": "des Vignes",
    "type": "Chemin",
    "postal_code": "33000",
    "city": "Bordeaux",
    "country": "FR",
    "notes": "quater repetition index"
  },
  {
    "input": "12 B Rue Nationale, 59000 Lille",
    "number": "12",
    "civic_number_suffix": "B",
    "street": "Nationale",
    "type": "Rue",
    "postal_code": "59000",
    "city": "Lille",
    "country": "FR",
    "notes": "letter repetition index"
  },
  {
    "input": "4 A Allée des Roses, 31000 Toulouse",
    "number": "4",
    "civic_number_suffix": "A",
    "street": "des Roses",
    "type": "Allée",
    "postal_code": "31000",
    "city": "Toulouse",
    "country": "FR",
    "notes": "letter repetition index with accented type"
  },
  {
    "input": "24 Rue d'Alésia, 75014 Paris",
    "number": "24",
    "street": "d'Alésia",
    "type": "Rue",
    "postal_code": "75014",
    "city": "Paris",
    "country": "FR",
    "notes": "apostrophe elision d'"
  },
  {
    "input": "3 Impasse de l'Église, 44000 Nantes",
    "number": "3",
    "street": "de l'Église",
    "type": "Impasse",
    "postal_code": "44000",
    "city": "Nantes",
    "country": "FR",
    "notes": "apostrophe elision l' with accent"
  },
  {
    "input": "17 Rue de l'Abbé Grégoire, 75006 Paris",
    "number": "17",
    "street": "de l'Abbé Grégoire",
    "type": "Rue",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "elision plus accent"
  },
  {
    "input": "9 Rue Jean-Jacques Rousseau, 75001 Paris",
    "number": "9",
    "street": "Jean-Jacques Rousseau",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "hyphenated personal name"
  },
  {
    "input": "1 Rue Jean-Baptiste Clément, 92100 Boulogne-Billancourt",
    "number": "1",
    "street": "Jean-Baptiste Clément",
    "type": "Rue",
    "postal_code": "92100",
    "city": "Boulogne-Billancourt",
    "country": "FR",
    "notes": "hyphenated name and hyphenated commune"
  },
  {
    "input": "35 Boulevard Saint-Germain, 75005 Paris",
    "number": "35",
    "street": "Saint-Germain",
    "type": "Boulevard",
    "postal_code": "75005",
    "city": "Paris",
    "country": "FR",
    "notes": "Saint- name"
  },
  {
    "input": "22 Rue Saint-Honoré, 75001 Paris",
    "number": "22",
    "street": "Saint-Honoré",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "Saint- name"
  },
  {
    "input": "6 Place Sainte-Catherine, 13001 Marseille",
    "number": "6",
    "street": "Sainte-Catherine",
    "type": "Place",
    "postal_code": "13001",
    "city": "Marseille",
    "country": "FR",
    "notes": "Sainte- name"
  },
  {
    "input": "14 Rue Saint-Jean-Baptiste-de-la-Salle, 75006 Paris",
    "number": "14",
    "street": "Saint-Jean-Baptiste-de-la-Salle",
    "type": "Rue",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "long fully-hyphenated saint name"
  },
  {
    "input": "Place de la République, 75011 Paris",
    "street": "de la République",
    "type": "Place",
    "postal_code": "75011",
    "city": "Paris",
    "country": "FR",
    "notes": "no number, article-heavy name"
  },
  {
    "input": "Place de la Comédie, 34000 Montpellier",
    "street": "de la Comédie",
    "type": "Place",
    "postal_code": "34000",
    "city": "Montpellier",
    "country": "FR",
    "notes": "no number, de la"
  },
  {
    "input": "1 Cours de l'Intendance, 33000 Bordeaux",
    "number": "1",
    "street": "de l'Intendance",
    "type": "Cours",
    "postal_code": "33000",
    "city": "Bordeaux",
    "country": "FR",
    "notes": "Cours type, elision"
  },
  {
    "input": "40 Rue du Faubourg Saint-Antoine, 75012 Paris",
    "number": "40",
    "street": "du Faubourg Saint-Antoine",
    "type": "Rue",
    "postal_code": "75012",
    "city": "Paris",
    "country": "FR",
    "notes": "Faubourg embedded in name"
  },
  {
    "input": "18 Rue du Chemin Vert, 75011 Paris",
    "number": "18",
    "street": "du Chemin Vert",
    "type": "Rue",
    "postal_code": "75011",
    "city": "Paris",
    "country": "FR",
    "notes": "Chemin embedded in name (only Rue is the type)"
  },
  {
    "input": "7 Rue du Pont Neuf, 75001 Paris",
    "number": "7",
    "street": "du Pont Neuf",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "Pont embedded in name"
  },
  {
    "input": "11 Rue des Petits Champs, 75001 Paris",
    "number": "11",
    "street": "des Petits Champs",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "des particle"
  },
  {
    "input": "75116 Paris",
    "postal_code": "75116",
    "city": "Paris",
    "country": "FR",
    "notes": "arrondissement postcode only, no street"
  },
  {
    "input": "13008 Marseille",
    "postal_code": "13008",
    "city": "Marseille",
    "country": "FR",
    "notes": "Marseille arrondissement postcode"
  },
  {
    "input": "69003 Lyon",
    "postal_code": "69003",
    "city": "Lyon",
    "country": "FR",
    "notes": "Lyon arrondissement postcode"
  },
  {
    "input": "10 Av. des Champs-Élysées, 75008 Paris",
    "number": "10",
    "street": "des Champs-Élysées",
    "type": "Av.",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "abbreviated type with period Av."
  },
  {
    "input": "3 Bd Voltaire, 75011 Paris",
    "number": "3",
    "street": "Voltaire",
    "type": "Bd",
    "postal_code": "75011",
    "city": "Paris",
    "country": "FR",
    "notes": "abbreviated Bd"
  },
  {
    "input": "1 Pl. Bellecour, 69002 Lyon",
    "number": "1",
    "street": "Bellecour",
    "type": "Pl.",
    "postal_code": "69002",
    "city": "Lyon",
    "country": "FR",
    "notes": "abbreviated Pl. (Place Bellecour)"
  },
  {
    "input": "8 Rte de Lyon, 38000 Grenoble",
    "number": "8",
    "street": "de Lyon",
    "type": "Rte",
    "postal_code": "38000",
    "city": "Grenoble",
    "country": "FR",
    "notes": "abbreviated Rte"
  },
  {
    "input": "10 RUE DE L EGLISE 75011 PARIS",
    "number": "10",
    "street": "DE L EGLISE",
    "type": "RUE",
    "postal_code": "75011",
    "city": "PARIS",
    "country": "FR",
    "notes": "uppercase accent-stripped OCR form, apostrophe lost, no comma"
  },
  {
    "input": "BP 40123, 75362 Paris Cedex 08",
    "sec_unit_type": "BP",
    "sec_unit_num": "40123",
    "postal_code": "75362",
    "city": "Paris",
    "country": "FR",
    "notes": "PO box, CEDEX 08 stripped from city"
  },
  {
    "input": "CS 70001, 35172 Bruz Cedex",
    "sec_unit_type": "CS",
    "sec_unit_num": "70001",
    "postal_code": "35172",
    "city": "Bruz",
    "country": "FR",
    "notes": "CS PO box, CEDEX"
  },
  {
    "input": "10 rue de rivoli 75001 paris",
    "number": "10",
    "street": "de rivoli",
    "type": "rue",
    "postal_code": "75001",
    "city": "paris",
    "country": "FR",
    "notes": "lowercase no comma, split on postcode"
  },
  {
    "input": "2 Rue du 8 Mai 1945, 69100 Villeurbanne",
    "number": "2",
    "street": "du 8 Mai 1945",
    "type": "Rue",
    "postal_code": "69100",
    "city": "Villeurbanne",
    "country": "FR",
    "notes": "digits inside name are a date, not house number"
  },
  {
    "input": "15 Avenue du 11 Novembre 1918, 69100 Villeurbanne",
    "number": "15",
    "street": "du 11 Novembre 1918",
    "type": "Avenue",
    "postal_code": "69100",
    "city": "Villeurbanne",
    "country": "FR",
    "notes": "date name"
  },
  {
    "input": "Rue du 14 Juillet, 93400 Saint-Ouen-sur-Seine",
    "street": "du 14 Juillet",
    "type": "Rue",
    "postal_code": "93400",
    "city": "Saint-Ouen-sur-Seine",
    "country": "FR",
    "notes": "no leading number, date in name"
  },
  {
    "input": "20000 Ajaccio",
    "postal_code": "20000",
    "city": "Ajaccio",
    "country": "FR",
    "notes": "Corsica 20xxx postcode"
  },
  {
    "input": "12 Cours Napoléon, 20000 Ajaccio",
    "number": "12",
    "street": "Napoléon",
    "type": "Cours",
    "postal_code": "20000",
    "city": "Ajaccio",
    "country": "FR",
    "notes": "Corsica, Cours type"
  },
  {
    "input": "5 Rue Victor Hugo, 97400 Saint-Denis",
    "number": "5",
    "street": "Victor Hugo",
    "type": "Rue",
    "postal_code": "97400",
    "city": "Saint-Denis",
    "country": "FR",
    "notes": "La Réunion 974xx DOM"
  },
  {
    "input": "30 Rue de la République, 97200 Fort-de-France",
    "number": "30",
    "street": "de la République",
    "type": "Rue",
    "postal_code": "97200",
    "city": "Fort-de-France",
    "country": "FR",
    "notes": "Martinique 972xx DOM"
  },
  {
    "input": "8 Boulevard du Général de Gaulle, 97100 Basse-Terre",
    "number": "8",
    "street": "du Général de Gaulle",
    "type": "Boulevard",
    "postal_code": "97100",
    "city": "Basse-Terre",
    "country": "FR",
    "notes": "Guadeloupe 971xx DOM"
  },
  {
    "input": "Le Grand Chêne, 24290 Montignac",
    "street": "Le Grand Chêne",
    "postal_code": "24290",
    "city": "Montignac",
    "country": "FR",
    "notes": "lieu-dit rural, no number no type"
  },
  {
    "input": "Lieu-dit La Borie, 46200 Souillac",
    "street": "La Borie",
    "type": "Lieu-dit",
    "postal_code": "46200",
    "city": "Souillac",
    "country": "FR",
    "notes": "explicit lieu-dit prefix"
  },
  {
    "input": "Le Bourg, 12340 Bozouls",
    "street": "Le Bourg",
    "postal_code": "12340",
    "city": "Bozouls",
    "country": "FR",
    "notes": "rural Le Bourg, no number"
  },
  {
    "input": "Les Quatre Chemins, 85000 La Roche-sur-Yon",
    "street": "Les Quatre Chemins",
    "postal_code": "85000",
    "city": "La Roche-sur-Yon",
    "country": "FR",
    "notes": "lieu-dit with numeral word"
  },
  {
    "input": "75008 Paris Cedex 08",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "CEDEX line only, city Paris"
  },
  {
    "input": "31 Rue du Général Leclerc, Appartement 12, 92130 Issy-les-Moulineaux",
    "number": "31",
    "street": "du Général Leclerc",
    "type": "Rue",
    "sec_unit_type": "Appartement",
    "sec_unit_num": "12",
    "postal_code": "92130",
    "city": "Issy-les-Moulineaux",
    "country": "FR",
    "notes": "apartment secondary unit"
  },
  {
    "input": "31 Rue du Général Leclerc, Appt 12, 92130 Issy-les-Moulineaux",
    "number": "31",
    "street": "du Général Leclerc",
    "type": "Rue",
    "sec_unit_type": "Appt",
    "sec_unit_num": "12",
    "postal_code": "92130",
    "city": "Issy-les-Moulineaux",
    "country": "FR",
    "notes": "Appt abbreviation"
  },
  {
    "input": "5 Rue de la Paix, Bât C, 75002 Paris",
    "number": "5",
    "street": "de la Paix",
    "type": "Rue",
    "sec_unit_type": "Bât",
    "sec_unit_num": "C",
    "postal_code": "75002",
    "city": "Paris",
    "country": "FR",
    "notes": "building letter secondary unit"
  },
  {
    "input": "5 Rue de la Paix, Escalier B, 75002 Paris",
    "number": "5",
    "street": "de la Paix",
    "type": "Rue",
    "sec_unit_type": "Escalier",
    "sec_unit_num": "B",
    "postal_code": "75002",
    "city": "Paris",
    "country": "FR",
    "notes": "staircase secondary unit"
  },
  {
    "input": "10 bis Rue de la Paix, 75002 Paris",
    "number": "10",
    "civic_number_suffix": "bis",
    "street": "de la Paix",
    "type": "Rue",
    "postal_code": "75002",
    "city": "Paris",
    "country": "FR",
    "notes": "bis before type"
  },
  {
    "input": "16 Rue du Faubourg du Temple, 75011 Paris",
    "number": "16",
    "street": "du Faubourg du Temple",
    "type": "Rue",
    "postal_code": "75011",
    "city": "Paris",
    "country": "FR",
    "notes": "Faubourg in name, double du"
  },
  {
    "input": "1 Place Charles de Gaulle, 75008 Paris",
    "number": "1",
    "street": "Charles de Gaulle",
    "type": "Place",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "de particle inside a name"
  },
  {
    "input": "45 Quai de la Tournelle, 75005 Paris",
    "number": "45",
    "street": "de la Tournelle",
    "type": "Quai",
    "postal_code": "75005",
    "city": "Paris",
    "country": "FR",
    "notes": "Quai type"
  },
  {
    "input": "23 Quai des Grands Augustins, 75006 Paris",
    "number": "23",
    "street": "des Grands Augustins",
    "type": "Quai",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "Quai des"
  },
  {
    "input": "2 Passage du Grand Cerf, 75002 Paris",
    "number": "2",
    "street": "du Grand Cerf",
    "type": "Passage",
    "postal_code": "75002",
    "city": "Paris",
    "country": "FR",
    "notes": "Passage type"
  },
  {
    "input": "7 Square Trousseau, 75012 Paris",
    "number": "7",
    "street": "Trousseau",
    "type": "Square",
    "postal_code": "75012",
    "city": "Paris",
    "country": "FR",
    "notes": "Square type"
  },
  {
    "input": "3 Villa Léandre, 75018 Paris",
    "number": "3",
    "street": "Léandre",
    "type": "Villa",
    "postal_code": "75018",
    "city": "Paris",
    "country": "FR",
    "notes": "Villa type"
  },
  {
    "input": "9 Cité Bergère, 75009 Paris",
    "number": "9",
    "street": "Bergère",
    "type": "Cité",
    "postal_code": "75009",
    "city": "Paris",
    "country": "FR",
    "notes": "Cité type accented"
  },
  {
    "input": "12 Sentier des Merisiers, 78000 Versailles",
    "number": "12",
    "street": "des Merisiers",
    "type": "Sentier",
    "postal_code": "78000",
    "city": "Versailles",
    "country": "FR",
    "notes": "Sentier type"
  },
  {
    "input": "1 Rond-point des Champs-Élysées, 75008 Paris",
    "number": "1",
    "street": "des Champs-Élysées",
    "type": "Rond-point",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "multi-word type Rond-point"
  },
  {
    "input": "14 Allée de Tourny, 33000 Bordeaux",
    "number": "14",
    "street": "de Tourny",
    "type": "Allée",
    "postal_code": "33000",
    "city": "Bordeaux",
    "country": "FR",
    "notes": "Allée type accented"
  },
  {
    "input": "6 Impasse des Deux Anges, 75006 Paris",
    "number": "6",
    "street": "des Deux Anges",
    "type": "Impasse",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "Impasse type"
  },
  {
    "input": "28 Boulevard Haussmann, 75009 Paris",
    "number": "28",
    "street": "Haussmann",
    "type": "Boulevard",
    "postal_code": "75009",
    "city": "Paris",
    "country": "FR",
    "notes": "single-word name"
  },
  {
    "input": "52 Avenue des Ternes, 75017 Paris",
    "number": "52",
    "street": "des Ternes",
    "type": "Avenue",
    "postal_code": "75017",
    "city": "Paris",
    "country": "FR",
    "notes": "des name"
  },
  {
    "input": "19 Rue de Vaugirard, 75006 Paris",
    "number": "19",
    "street": "de Vaugirard",
    "type": "Rue",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "de name"
  },
  {
    "input": "4 Rue du Cherche-Midi, 75006 Paris",
    "number": "4",
    "street": "du Cherche-Midi",
    "type": "Rue",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "hyphenated common-noun name"
  },
  {
    "input": "50 Avenue Montaigne, 75008 Paris",
    "number": "50",
    "street": "Montaigne",
    "type": "Avenue",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "single name"
  },
  {
    "input": "27 Rue Saint-Guillaume, 75007 Paris",
    "number": "27",
    "street": "Saint-Guillaume",
    "type": "Rue",
    "postal_code": "75007",
    "city": "Paris",
    "country": "FR",
    "notes": "Saint- (Sciences Po address)"
  },
  {
    "input": "5 Avenue Anatole France, 75007 Paris",
    "number": "5",
    "street": "Anatole France",
    "type": "Avenue",
    "postal_code": "75007",
    "city": "Paris",
    "country": "FR",
    "notes": "name containing 'France' (not country)"
  },
  {
    "input": "16 Cours Mirabeau, 13100 Aix-en-Provence",
    "number": "16",
    "street": "Mirabeau",
    "type": "Cours",
    "postal_code": "13100",
    "city": "Aix-en-Provence",
    "country": "FR",
    "notes": "Cours; hyphenated commune"
  },
  {
    "input": "1 Place Masséna, 06000 Nice",
    "number": "1",
    "street": "Masséna",
    "type": "Place",
    "postal_code": "06000",
    "city": "Nice",
    "country": "FR",
    "notes": "leading-zero département 06"
  },
  {
    "input": "7 Promenade des Anglais, 06000 Nice",
    "number": "7",
    "street": "des Anglais",
    "type": "Promenade",
    "postal_code": "06000",
    "city": "Nice",
    "country": "FR",
    "notes": "Promenade type"
  },
  {
    "input": "2 Rue de la Grosse Horloge, 76000 Rouen",
    "number": "2",
    "street": "de la Grosse Horloge",
    "type": "Rue",
    "postal_code": "76000",
    "city": "Rouen",
    "country": "FR",
    "notes": "de la multi-word"
  },
  {
    "input": "10 Grande Rue, 25000 Besançon",
    "number": "10",
    "type": "Grande Rue",
    "postal_code": "25000",
    "city": "Besançon",
    "country": "FR",
    "notes": "Grande Rue is the whole type, no separate name"
  },
  {
    "input": "3 Quai Saint-Antoine, 69001 Lyon",
    "number": "3",
    "street": "Saint-Antoine",
    "type": "Quai",
    "postal_code": "69001",
    "city": "Lyon",
    "country": "FR",
    "notes": "Quai Saint-"
  },
  {
    "input": "8 Rue de la République, 69002 Lyon",
    "number": "8",
    "street": "de la République",
    "type": "Rue",
    "postal_code": "69002",
    "city": "Lyon",
    "country": "FR",
    "notes": "common street name"
  },
  {
    "input": "25 Rue du Taur, 31000 Toulouse",
    "number": "25",
    "street": "du Taur",
    "type": "Rue",
    "postal_code": "31000",
    "city": "Toulouse",
    "country": "FR",
    "notes": "du name"
  },
  {
    "input": "1 Place du Capitole, 31000 Toulouse",
    "number": "1",
    "street": "du Capitole",
    "type": "Place",
    "postal_code": "31000",
    "city": "Toulouse",
    "country": "FR",
    "notes": "Place du"
  },
  {
    "input": "12 Rue Sainte-Catherine, 33000 Bordeaux",
    "number": "12",
    "street": "Sainte-Catherine",
    "type": "Rue",
    "postal_code": "33000",
    "city": "Bordeaux",
    "country": "FR",
    "notes": "Sainte-"
  },
  {
    "input": "4 Place de la Bourse, 33000 Bordeaux",
    "number": "4",
    "street": "de la Bourse",
    "type": "Place",
    "postal_code": "33000",
    "city": "Bordeaux",
    "country": "FR",
    "notes": "de la"
  },
  {
    "input": "2 Rue Crébillon, 44000 Nantes",
    "number": "2",
    "street": "Crébillon",
    "type": "Rue",
    "postal_code": "44000",
    "city": "Nantes",
    "country": "FR",
    "notes": "accented single name"
  },
  {
    "input": "1 Allée Duquesne, 44000 Nantes",
    "number": "1",
    "street": "Duquesne",
    "type": "Allée",
    "postal_code": "44000",
    "city": "Nantes",
    "country": "FR",
    "notes": "Allée single name"
  },
  {
    "input": "10 Rue Nationale, 37000 Tours",
    "number": "10",
    "street": "Nationale",
    "type": "Rue",
    "postal_code": "37000",
    "city": "Tours",
    "country": "FR",
    "notes": "adjective name"
  },
  {
    "input": "5 Place Stanislas, 54000 Nancy",
    "number": "5",
    "street": "Stanislas",
    "type": "Place",
    "postal_code": "54000",
    "city": "Nancy",
    "country": "FR",
    "notes": "Place single name"
  },
  {
    "input": "20 Rue des Grandes-Arcades, 67000 Strasbourg",
    "number": "20",
    "street": "des Grandes-Arcades",
    "type": "Rue",
    "postal_code": "67000",
    "city": "Strasbourg",
    "country": "FR",
    "notes": "des hyphenated"
  },
  {
    "input": "1 Place Kléber, 67000 Strasbourg",
    "number": "1",
    "street": "Kléber",
    "type": "Place",
    "postal_code": "67000",
    "city": "Strasbourg",
    "country": "FR",
    "notes": "accented single name"
  },
  {
    "input": "3 Rue du Bois, 59800 Lille",
    "number": "3",
    "street": "du Bois",
    "type": "Rue",
    "postal_code": "59800",
    "city": "Lille",
    "country": "FR",
    "notes": "du name"
  },
  {
    "input": "7 Grand Place, 59000 Lille",
    "number": "7",
    "type": "Grand Place",
    "postal_code": "59000",
    "city": "Lille",
    "country": "FR",
    "notes": "Grand Place whole type"
  },
  {
    "input": "50 Rue de la Charité, 69002 Lyon",
    "number": "50",
    "street": "de la Charité",
    "type": "Rue",
    "postal_code": "69002",
    "city": "Lyon",
    "country": "FR",
    "notes": "de la accented"
  },
  {
    "input": "9 Rue de la Loge, 13002 Marseille",
    "number": "9",
    "street": "de la Loge",
    "type": "Rue",
    "postal_code": "13002",
    "city": "Marseille",
    "country": "FR",
    "notes": "Marseille arrondissement 13002"
  },
  {
    "input": "1 Quai du Port, 13002 Marseille",
    "number": "1",
    "street": "du Port",
    "type": "Quai",
    "postal_code": "13002",
    "city": "Marseille",
    "country": "FR",
    "notes": "Quai du"
  },
  {
    "input": "16 La Canebière, 13001 Marseille",
    "number": "16",
    "street": "La Canebière",
    "postal_code": "13001",
    "city": "Marseille",
    "country": "FR",
    "notes": "famous street with NO type word (article + name)"
  },
  {
    "input": "2 Boulevard de la Croisette, 06400 Cannes",
    "number": "2",
    "street": "de la Croisette",
    "type": "Boulevard",
    "postal_code": "06400",
    "city": "Cannes",
    "country": "FR",
    "notes": "leading-zero dept 06"
  },
  {
    "input": "11 Rue d'Antibes, 06400 Cannes",
    "number": "11",
    "street": "d'Antibes",
    "type": "Rue",
    "postal_code": "06400",
    "city": "Cannes",
    "country": "FR",
    "notes": "d' elision"
  },
  {
    "input": "3 Rue d'Alsace, 68000 Colmar",
    "number": "3",
    "street": "d'Alsace",
    "type": "Rue",
    "postal_code": "68000",
    "city": "Colmar",
    "country": "FR",
    "notes": "d' elision"
  },
  {
    "input": "18 Rue de l'Université, 75007 Paris",
    "number": "18",
    "street": "de l'Université",
    "type": "Rue",
    "postal_code": "75007",
    "city": "Paris",
    "country": "FR",
    "notes": "l' elision accented"
  },
  {
    "input": "45 Rue de l'Ouest, 75014 Paris",
    "number": "45",
    "street": "de l'Ouest",
    "type": "Rue",
    "postal_code": "75014",
    "city": "Paris",
    "country": "FR",
    "notes": "l' elision"
  },
  {
    "input": "6 Rue de l'Hôtel de Ville, 75004 Paris",
    "number": "6",
    "street": "de l'Hôtel de Ville",
    "type": "Rue",
    "postal_code": "75004",
    "city": "Paris",
    "country": "FR",
    "notes": "elision + multi de particles"
  },
  {
    "input": "1 Rue de l'Odéon, 75006 Paris",
    "number": "1",
    "street": "de l'Odéon",
    "type": "Rue",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "l' accented"
  },
  {
    "input": "8 bis Boulevard de Strasbourg, 75010 Paris",
    "number": "8",
    "civic_number_suffix": "bis",
    "street": "de Strasbourg",
    "type": "Boulevard",
    "postal_code": "75010",
    "city": "Paris",
    "country": "FR",
    "notes": "bis + de"
  },
  {
    "input": "14 ter Rue de Bretagne, 75003 Paris",
    "number": "14",
    "civic_number_suffix": "ter",
    "street": "de Bretagne",
    "type": "Rue",
    "postal_code": "75003",
    "city": "Paris",
    "country": "FR",
    "notes": "ter"
  },
  {
    "input": "3 quater Rue des Archives, 75004 Paris",
    "number": "3",
    "civic_number_suffix": "quater",
    "street": "des Archives",
    "type": "Rue",
    "postal_code": "75004",
    "city": "Paris",
    "country": "FR",
    "notes": "quater + des"
  },
  {
    "input": "25 Avenue de la Grande Armée, 75116 Paris",
    "number": "25",
    "street": "de la Grande Armée",
    "type": "Avenue",
    "postal_code": "75116",
    "city": "Paris",
    "country": "FR",
    "notes": "de la multi-word + 75116"
  },
  {
    "input": "1 Rue des Rosiers, 75004 Paris",
    "number": "1",
    "street": "des Rosiers",
    "type": "Rue",
    "postal_code": "75004",
    "city": "Paris",
    "country": "FR",
    "notes": "des"
  },
  {
    "input": "33 Rue La Fayette, 75009 Paris",
    "number": "33",
    "street": "La Fayette",
    "type": "Rue",
    "postal_code": "75009",
    "city": "Paris",
    "country": "FR",
    "notes": "La as part of proper name (capitalized)"
  },
  {
    "input": "5 Rue Le Peletier, 75009 Paris",
    "number": "5",
    "street": "Le Peletier",
    "type": "Rue",
    "postal_code": "75009",
    "city": "Paris",
    "country": "FR",
    "notes": "Le capitalized proper name"
  },
  {
    "input": "10 Rue du Bac, 75007 Paris",
    "number": "10",
    "street": "du Bac",
    "type": "Rue",
    "postal_code": "75007",
    "city": "Paris",
    "country": "FR",
    "notes": "du"
  },
  {
    "input": "60 Rue François 1er, 75008 Paris",
    "number": "60",
    "street": "François 1er",
    "type": "Rue",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "ordinal/regnal number inside name"
  },
  {
    "input": "2 Avenue Georges V, 75008 Paris",
    "number": "2",
    "street": "Georges V",
    "type": "Avenue",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "roman numeral in name"
  },
  {
    "input": "9 Avenue du Président Wilson, 75116 Paris",
    "number": "9",
    "street": "du Président Wilson",
    "type": "Avenue",
    "postal_code": "75116",
    "city": "Paris",
    "country": "FR",
    "notes": "du + title"
  },
  {
    "input": "15 Rue du Maréchal de-Lattre-de-Tassigny, 92200 Neuilly-sur-Seine",
    "number": "15",
    "street": "du Maréchal de-Lattre-de-Tassigny",
    "type": "Rue",
    "postal_code": "92200",
    "city": "Neuilly-sur-Seine",
    "country": "FR",
    "notes": "hyphenated compound name with particles"
  },
  {
    "input": "1 Avenue de Lattre de Tassigny, 87000 Limoges",
    "number": "1",
    "street": "de Lattre de Tassigny",
    "type": "Avenue",
    "postal_code": "87000",
    "city": "Limoges",
    "country": "FR",
    "notes": "non-hyphenated variant of same name"
  },
  {
    "input": "12 Rue des Trois Frères, 75018 Paris",
    "number": "12",
    "street": "des Trois Frères",
    "type": "Rue",
    "postal_code": "75018",
    "city": "Paris",
    "country": "FR",
    "notes": "numeral word in name"
  },
  {
    "input": "5 Rue des Deux Ponts, 75004 Paris",
    "number": "5",
    "street": "des Deux Ponts",
    "type": "Rue",
    "postal_code": "75004",
    "city": "Paris",
    "country": "FR",
    "notes": "Pont embedded plural"
  },
  {
    "input": "40 Rue Laure Diebold, 69009 Lyon",
    "number": "40",
    "street": "Laure Diebold",
    "type": "Rue",
    "postal_code": "69009",
    "city": "Lyon",
    "country": "FR",
    "notes": "Lyon 9e arrondissement"
  },
  {
    "input": "2 Montée de la Grande Côte, 69001 Lyon",
    "number": "2",
    "street": "de la Grande Côte",
    "type": "Montée",
    "postal_code": "69001",
    "city": "Lyon",
    "country": "FR",
    "notes": "Montée type (Lyon-specific)"
  },
  {
    "input": "10 Traboule de la Tour Rose, 69005 Lyon",
    "number": "10",
    "street": "Traboule de la Tour Rose",
    "postal_code": "69005",
    "city": "Lyon",
    "country": "FR",
    "notes": "unusual non-standard type word kept in street"
  },
  {
    "input": "3 Rue Mouffetard, 75005 Paris",
    "number": "3",
    "street": "Mouffetard",
    "type": "Rue",
    "postal_code": "75005",
    "city": "Paris",
    "country": "FR",
    "notes": "single name"
  },
  {
    "input": "48 Boulevard Jourdan, 75014 Paris",
    "number": "48",
    "street": "Jourdan",
    "type": "Boulevard",
    "postal_code": "75014",
    "city": "Paris",
    "country": "FR",
    "notes": "single name (Cité U)"
  },
  {
    "input": "1 Parvis Notre-Dame - Place Jean-Paul II, 75004 Paris",
    "number": "1",
    "street": "Notre-Dame - Place Jean-Paul II",
    "type": "Parvis",
    "postal_code": "75004",
    "city": "Paris",
    "country": "FR",
    "notes": "Parvis type, compound official name with embedded Place"
  },
  {
    "input": "6 Rue du Commerce, 75015 Paris",
    "number": "6",
    "street": "du Commerce",
    "type": "Rue",
    "postal_code": "75015",
    "city": "Paris",
    "country": "FR",
    "notes": "du"
  },
  {
    "input": "20 Avenue de Ségur, 75007 Paris",
    "number": "20",
    "street": "de Ségur",
    "type": "Avenue",
    "postal_code": "75007",
    "city": "Paris",
    "country": "FR",
    "notes": "de accented"
  },
  {
    "input": "127 Rue de Grenelle, 75007 Paris",
    "number": "127",
    "street": "de Grenelle",
    "type": "Rue",
    "postal_code": "75007",
    "city": "Paris",
    "country": "FR",
    "notes": "3-digit number"
  },
  {
    "input": "1 Esplanade Charles de Gaulle, 92800 Puteaux",
    "number": "1",
    "street": "Charles de Gaulle",
    "type": "Esplanade",
    "postal_code": "92800",
    "city": "Puteaux",
    "country": "FR",
    "notes": "Esplanade type (La Défense)"
  },
  {
    "input": "16 Rue de Vaugirard, 75006 Paris, France",
    "number": "16",
    "street": "de Vaugirard",
    "type": "Rue",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "explicit country 'France'"
  },
  {
    "input": "10 Rue de Rivoli, 75001 Paris, FR",
    "number": "10",
    "street": "de Rivoli",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "explicit ISO country FR"
  },
  {
    "input": "5 Rue Bonaparte, Étage 3, 75006 Paris",
    "number": "5",
    "street": "Bonaparte",
    "type": "Rue",
    "sec_unit_type": "Étage",
    "sec_unit_num": "3",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "floor secondary unit"
  },
  {
    "input": "5 Rue Bonaparte, Bâtiment A Appartement 7, 75006 Paris",
    "__skip": "multiple stacked secondary units (building + apartment)",
    "number": "5",
    "street": "Bonaparte",
    "type": "Rue",
    "sec_unit_type": "Appartement",
    "sec_unit_num": "7",
    "postal_code": "75006",
    "city": "Paris",
    "country": "FR",
    "notes": "multiple units; parse the apartment"
  },
  {
    "input": "31300 Toulouse Cedex",
    "postal_code": "31300",
    "city": "Toulouse",
    "country": "FR",
    "notes": "CEDEX without number, city Toulouse"
  },
  {
    "input": "2 Rue de la Bûcherie, 75005 Paris",
    "number": "2",
    "street": "de la Bûcherie",
    "type": "Rue",
    "postal_code": "75005",
    "city": "Paris",
    "country": "FR",
    "notes": "circumflex accent (Shakespeare & Co)"
  },
  {
    "input": "9 Rue Réaumur, 75003 Paris",
    "number": "9",
    "street": "Réaumur",
    "type": "Rue",
    "postal_code": "75003",
    "city": "Paris",
    "country": "FR",
    "notes": "accented single name"
  },
  {
    "input": "5 Allée du Roi René, 49100 Angers",
    "number": "5",
    "street": "du Roi René",
    "type": "Allée",
    "postal_code": "49100",
    "city": "Angers",
    "country": "FR",
    "notes": "du + accented name"
  },
  {
    "input": "3 Rue Gasparin, 69002 Lyon",
    "number": "3",
    "street": "Gasparin",
    "type": "Rue",
    "postal_code": "69002",
    "city": "Lyon",
    "country": "FR",
    "notes": "single name"
  },
  {
    "input": "1 Chemin du Halage, 45000 Orléans",
    "number": "1",
    "street": "du Halage",
    "type": "Chemin",
    "postal_code": "45000",
    "city": "Orléans",
    "country": "FR",
    "notes": "Chemin type, accented commune"
  },
  {
    "input": "8 Route de Vannes, 44300 Nantes",
    "number": "8",
    "street": "de Vannes",
    "type": "Route",
    "postal_code": "44300",
    "city": "Nantes",
    "country": "FR",
    "notes": "Route type"
  },
  {
    "input": "12 Voie Romaine, 57000 Metz",
    "number": "12",
    "street": "Romaine",
    "type": "Voie",
    "postal_code": "57000",
    "city": "Metz",
    "country": "FR",
    "notes": "Voie type"
  },
  {
    "input": "Hameau de Lavaux, 71960 Fuissé",
    "street": "de Lavaux",
    "type": "Hameau",
    "postal_code": "71960",
    "city": "Fuissé",
    "country": "FR",
    "notes": "Hameau rural, no number, accented commune"
  },
  {
    "input": "Route des Grands Crus, 21220 Gevrey-Chambertin",
    "street": "des Grands Crus",
    "type": "Route",
    "postal_code": "21220",
    "city": "Gevrey-Chambertin",
    "country": "FR",
    "notes": "Route with no number, hyphenated commune"
  },
  {
    "input": "10 BD DE SEBASTOPOL 75004 PARIS",
    "number": "10",
    "street": "DE SEBASTOPOL",
    "type": "BD",
    "postal_code": "75004",
    "city": "PARIS",
    "country": "FR",
    "notes": "uppercase norm form, abbreviated BD, no comma"
  },
  {
    "input": "3 IMP DES LILAS 33700 MERIGNAC",
    "number": "3",
    "street": "DES LILAS",
    "type": "IMP",
    "postal_code": "33700",
    "city": "MERIGNAC",
    "country": "FR",
    "notes": "uppercase abbreviation IMP, accent-stripped commune"
  },
  {
    "input": "7 AV DU GAL DE GAULLE 94160 SAINT-MANDE",
    "number": "7",
    "street": "DU GAL DE GAULLE",
    "type": "AV",
    "postal_code": "94160",
    "city": "SAINT-MANDE",
    "country": "FR",
    "notes": "abbreviations AV and GAL (Général) in uppercase"
  },
  {
    "input": "10 bis, Rue du Cirque, 75008 Paris",
    "number": "10",
    "civic_number_suffix": "bis",
    "street": "du Cirque",
    "type": "Rue",
    "postal_code": "75008",
    "city": "Paris",
    "country": "FR",
    "notes": "comma after bis"
  },
  {
    "input": "2 Rue de la Paix Appt 4B, 75002 Paris",
    "number": "2",
    "street": "de la Paix",
    "type": "Rue",
    "sec_unit_type": "Appt",
    "sec_unit_num": "4B",
    "postal_code": "75002",
    "city": "Paris",
    "country": "FR",
    "notes": "apartment number with letter, no comma before unit"
  },
  {
    "input": "Lieu-dit Le Colombier, 37150 Chenonceaux",
    "street": "Le Colombier",
    "type": "Lieu-dit",
    "postal_code": "37150",
    "city": "Chenonceaux",
    "country": "FR",
    "notes": "lieu-dit prefix, no number"
  },
  {
    "input": "La Croix Blanche, 84160 Cucuron",
    "street": "La Croix Blanche",
    "postal_code": "84160",
    "city": "Cucuron",
    "country": "FR",
    "notes": "lieu-dit, article + name, no type"
  },
  {
    "input": "970 Chemin de Val Fleuri, 06140 Vence",
    "number": "970",
    "street": "de Val Fleuri",
    "type": "Chemin",
    "postal_code": "06140",
    "city": "Vence",
    "country": "FR",
    "notes": "large rural house number, Chemin"
  },
  {
    "input": "1 Place Général de Gaulle, 59000 Lille",
    "number": "1",
    "street": "Général de Gaulle",
    "type": "Place",
    "postal_code": "59000",
    "city": "Lille",
    "country": "FR",
    "notes": "title + de Gaulle (Grand Place officially)"
  },
  {
    "input": "4 Rue de l'Horloge, 84000 Avignon",
    "number": "4",
    "street": "de l'Horloge",
    "type": "Rue",
    "postal_code": "84000",
    "city": "Avignon",
    "country": "FR",
    "notes": "l' elision"
  },
  {
    "input": "1 Rue Winston Churchill, 21000 Dijon",
    "number": "1",
    "street": "Winston Churchill",
    "type": "Rue",
    "postal_code": "21000",
    "city": "Dijon",
    "country": "FR",
    "notes": "foreign personal name, two words"
  },
  {
    "input": "5 Rue du 4 Septembre, 75002 Paris",
    "number": "5",
    "street": "du 4 Septembre",
    "type": "Rue",
    "postal_code": "75002",
    "city": "Paris",
    "country": "FR",
    "notes": "leading number 5 is house; '4' is part of date name"
  },
  {
    "input": "22 Rue des Bons-Enfants, 75001 Paris",
    "number": "22",
    "street": "des Bons-Enfants",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "des + hyphenated common noun"
  },
  {
    "input": "12 Rue Étienne Marcel, 75002 Paris",
    "number": "12",
    "street": "Étienne Marcel",
    "type": "Rue",
    "postal_code": "75002",
    "city": "Paris",
    "country": "FR",
    "notes": "leading-accent name É"
  },
  {
    "input": "8 Boulevard de l'Hôpital, 75013 Paris",
    "number": "8",
    "street": "de l'Hôpital",
    "type": "Boulevard",
    "postal_code": "75013",
    "city": "Paris",
    "country": "FR",
    "notes": "l' + circumflex"
  },
  {
    "input": "3 Place du Général Leclerc, 78000 Versailles",
    "number": "3",
    "street": "du Général Leclerc",
    "type": "Place",
    "postal_code": "78000",
    "city": "Versailles",
    "country": "FR",
    "notes": "Place du + title"
  },
  {
    "input": "2 Avenue de Paris, 94300 Vincennes",
    "number": "2",
    "street": "de Paris",
    "type": "Avenue",
    "postal_code": "94300",
    "city": "Vincennes",
    "country": "FR",
    "notes": "de + city name inside street name"
  },
  {
    "input": "10 Rue de Metz, 31000 Toulouse",
    "number": "10",
    "street": "de Metz",
    "type": "Rue",
    "postal_code": "31000",
    "city": "Toulouse",
    "country": "FR",
    "notes": "de + city name"
  },
  {
    "input": "1 Impasse du Chat qui Pêche, 75005 Paris",
    "number": "1",
    "street": "du Chat qui Pêche",
    "type": "Impasse",
    "postal_code": "75005",
    "city": "Paris",
    "country": "FR",
    "notes": "long descriptive name (narrowest street in Paris)"
  },
  {
    "input": "5 ter, Rue des Tanneries, 75013 Paris",
    "number": "5",
    "civic_number_suffix": "ter",
    "street": "des Tanneries",
    "type": "Rue",
    "postal_code": "75013",
    "city": "Paris",
    "country": "FR",
    "notes": "ter with comma"
  },
  {
    "input": "18 Quai Rambaud, 69002 Lyon",
    "number": "18",
    "street": "Rambaud",
    "type": "Quai",
    "postal_code": "69002",
    "city": "Lyon",
    "country": "FR",
    "notes": "Quai single name (Confluence)"
  },
  {
    "input": "6 Place d'Erlon, 51100 Reims",
    "number": "6",
    "street": "d'Erlon",
    "type": "Place",
    "postal_code": "51100",
    "city": "Reims",
    "country": "FR",
    "notes": "Place d' elision"
  },
  {
    "input": "1 Cours de la Liberté, 69003 Lyon",
    "number": "1",
    "street": "de la Liberté",
    "type": "Cours",
    "postal_code": "69003",
    "city": "Lyon",
    "country": "FR",
    "notes": "Cours de la"
  },
  {
    "input": "Chemin des Vignes, 21700 Nuits-Saint-Georges",
    "street": "des Vignes",
    "type": "Chemin",
    "postal_code": "21700",
    "city": "Nuits-Saint-Georges",
    "country": "FR",
    "notes": "no number, commune contains Saint"
  },
  {
    "input": "2 Rue de la Grande Truanderie, 75001 Paris",
    "number": "2",
    "street": "de la Grande Truanderie",
    "type": "Rue",
    "postal_code": "75001",
    "city": "Paris",
    "country": "FR",
    "notes": "de la + multi-word"
  },
  {
    "input": "3 Rue du Chevalier de la Barre, 75018 Paris",
    "number": "3",
    "street": "du Chevalier de la Barre",
    "type": "Rue",
    "postal_code": "75018",
    "city": "Paris",
    "country": "FR",
    "notes": "multiple particles du + de la"
  },
  {
    "input": "97200 Fort-de-France Cedex",
    "postal_code": "97200",
    "city": "Fort-de-France",
    "country": "FR",
    "notes": "DOM CEDEX, hyphenated commune with de"
  }
];
