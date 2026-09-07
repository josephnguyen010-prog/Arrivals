import type { CityId } from "../types";

/**
 * The things worth knowing before you go, or worth remembering after. Kept to
 * what is firmly established and short enough to read in one pass — this is a
 * postcard back, not an encyclopedia entry.
 *
 * A real build would pull this from Wikidata alongside the city list itself.
 */
export interface CityFacts {
  /** One sentence. */
  history: string;
  /** Three things to eat, the ones the city is actually known for. */
  dishes: string[];
  landmarks: string[];
  /** One more thing worth knowing, and the only line here meant to surprise. */
  fact: string;
}

export const CITY_FACTS: Record<CityId, CityFacts> = {
  accra: {
    history:
      "A Ga trading town that grew up around three European forts and became the capital of the first African colony to win independence.",
    dishes: ["Jollof rice", "Waakye", "Banku with tilapia"],
    landmarks: ["Independence Arch", "Kwame Nkrumah Memorial Park", "Makola Market"],
    fact: "Ghana went free in 1957, the first in sub-Saharan Africa, and half the continent followed within a decade.",
  },
  addis: {
    history:
      "Founded in 1886 and named new flower; Ethiopia was never colonised, so it kept its own calendar and its own script.",
    dishes: ["Injera with doro wat", "Kitfo", "Shiro"],
    landmarks: ["Holy Trinity Cathedral", "The National Museum and Lucy", "Merkato"],
    fact: "The Ethiopian calendar runs seven to eight years behind this one, and the day is counted from dawn.",
  },
  amsterdam: {
    history:
      "A fishing village that dammed the Amstel around 1270 and spent the 17th century as the richest port in the world.",
    dishes: ["Stroopwafel", "Bitterballen", "Raw herring"],
    landmarks: ["The canal ring", "Rijksmuseum", "Anne Frank House"],
    fact: "The houses are narrow because tax was charged on the width of the canal frontage.",
  },
  annarbor: {
    history:
      "Named in 1824 for two settlers' wives, both called Ann, and for the burr oak stands around them; the university moved up from Detroit in 1837 and never left.",
    dishes: ["A Zingerman's reuben", "Detroit-style pizza", "Cider and doughnuts"],
    landmarks: ["Michigan Stadium", "The Diag", "Nichols Arboretum"],
    fact: "Michigan Stadium holds more than 107,000 people, which makes it the largest stadium in the United States.",
  },
  athens: {
    history:
      "Lived in for more than three thousand years without a break, and the place the word democracy was coined.",
    dishes: ["Souvlaki", "Moussaka", "Loukoumades"],
    landmarks: ["The Acropolis", "The Ancient Agora", "Plaka"],
    fact: "The Parthenon's columns swell slightly in the middle so that from a distance they read as straight.",
  },
  auckland: {
    history:
      "Built across an isthmus the Maori called Tamaki Makaurau, and briefly the capital before Wellington took it in 1865.",
    dishes: ["Hangi", "Whitebait fritters", "Fish and chips"],
    landmarks: ["The Sky Tower", "Mount Eden", "Waiheke Island"],
    fact: "The city sits on a field of about fifty volcanoes, and the field is dormant rather than extinct.",
  },
  austin: {
    history:
      "Founded as Waterloo and renamed in 1839 when it was picked as the capital of the Republic of Texas.",
    dishes: ["Brisket", "Breakfast tacos", "Queso"],
    landmarks: [
      "Texas State Capitol",
      "Congress Avenue bats",
      "Barton Springs",
    ],
    fact: "The bats under Congress Avenue Bridge are the largest urban colony in North America — around 1.5 million of them.",
  },
  bangkok: {
    history:
      "Made the capital in 1782, when the Chakri dynasty moved the court across the river from Thonburi.",
    dishes: ["Pad thai", "Som tam", "Boat noodles"],
    landmarks: ["Grand Palace", "Wat Pho", "Wat Arun"],
    fact: "Its full ceremonial name runs to 168 letters and holds the record for the longest place name in the world.",
  },
  barcelona: {
    history:
      "Roman Barcino, then a Mediterranean sea power; the 1888 and 1929 expos and the 1992 Olympics each rebuilt it.",
    dishes: ["Pa amb tomàquet", "Fideuà", "Crema catalana"],
    landmarks: ["Sagrada Família", "Park Güell", "La Rambla"],
    fact: "The Sagrada Família has been under construction since 1882 and still isn't finished.",
  },
  beijing: {
    history:
      "A capital on and off since Kublai Khan made it the seat of the Yuan in the 1270s, rebuilt by the Ming around the Forbidden City in the 1400s.",
    dishes: ["Peking duck", "Zhajiangmian", "Jianbing"],
    landmarks: ["The Forbidden City", "The Temple of Heaven", "The Great Wall at Mutianyu"],
    fact: "The Forbidden City was closed to ordinary people for nearly five centuries, and close to a thousand of its buildings still stand.",
  },
  berlin: {
    history:
      "Prussian capital, then German, then cut in two by a wall for 28 years until 1989.",
    dishes: ["Currywurst", "Döner kebab", "Berliner doughnut"],
    landmarks: ["Brandenburg Gate", "Reichstag", "East Side Gallery"],
    fact: "The city has more bridges than Venice — somewhere around 900 of them.",
  },
  blacksburg: {
    history:
      "A crossroads town laid out in 1798 and given its shape by the land-grant college founded here in 1872, along with the grey Hokie Stone quarried up the road that faces almost every building on campus.",
    dishes: ["Country ham biscuits", "Brunswick stew", "Apple butter"],
    landmarks: ["Burruss Hall", "The Drillfield", "Lane Stadium"],
    fact: "The crowd jumping to Enter Sandman at Lane Stadium has registered on seismographs.",
  },
  bogota: {
    history:
      "Founded in 1538 on a plateau 2,600 metres up, which is why sitting near the equator does nothing for the temperature.",
    dishes: ["Ajiaco", "Bandeja paisa", "Arepas"],
    landmarks: ["Monserrate", "La Candelaria", "The Gold Museum"],
    fact: "Every Sunday a hundred kilometres of road shut to cars completely and the city rides bicycles instead.",
  },
  boston: {
    history:
      "Founded by Puritans in 1630 and the staging ground for the American Revolution.",
    dishes: ["Clam chowder", "Lobster roll", "Boston cream pie"],
    landmarks: ["Fenway Park", "The Freedom Trail", "Boston Common"],
    fact: "The subway opened in 1897, the first in the United States.",
  },
  bsas: {
    history:
      "Founded twice — 1536 and again in 1580 — and rebuilt by the waves of immigrants who arrived by ship.",
    dishes: ["Asado", "Empanadas", "Dulce de leche"],
    landmarks: ["Teatro Colón", "Caminito, La Boca", "Recoleta Cemetery"],
    fact: "Its widest street, 9 de Julio, runs to sixteen lanes.",
  },
  budapest: {
    history:
      "Buda and Pest sat on opposite banks as separate cities until a chain bridge and then a merger joined them in 1873.",
    dishes: ["Goulash", "Lángos", "Chimney cake"],
    landmarks: ["The Parliament Building", "Fisherman's Bastion", "Széchenyi Baths"],
    fact: "More than a hundred thermal springs run under the city, which is why the baths predate the country.",
  },
  busan: {
    history:
      "A fishing port that grew into the country's second city, and the one corner of the peninsula the front never reached during the Korean War.",
    dishes: ["Dwaeji gukbap", "Milmyeon", "Ssiat hotteok"],
    landmarks: ["Gamcheon Culture Village", "Haeundae Beach", "Jagalchi Fish Market"],
    fact: "Gamcheon's painted hillside was a refugee settlement long before it was a photograph.",
  },
  cairo: {
    history:
      "Founded in 969 by the Fatimids beside older capitals; the pyramids at Giza predate it by three and a half thousand years.",
    dishes: ["Koshari", "Ful medames", "Molokhia"],
    landmarks: ["Pyramids of Giza", "Egyptian Museum", "Khan el-Khalili"],
    fact: "The Great Pyramid was the tallest building on earth for some 3,800 years.",
  },
  capetown: {
    history:
      "A Dutch East India Company supply station from 1652, and still where Parliament sits — one of the country's three capitals; Robben Island, in its bay, held Nelson Mandela for eighteen years.",
    dishes: ["Bobotie", "Gatsby", "Koeksisters"],
    landmarks: ["Table Mountain", "Robben Island", "Cape of Good Hope"],
    fact: "Table Mountain makes its own cloud — the 'tablecloth' pours over the edge and evaporates halfway down.",
  },
  cdmx: {
    history:
      "Built on the lake island of Tenochtitlan, razed by Cortés in 1521, and sinking into the drained lakebed ever since.",
    dishes: ["Tacos al pastor", "Tlacoyos", "Chiles en nogada"],
    landmarks: ["The Zócalo", "Frida Kahlo Museum", "Teotihuacan"],
    fact: "Built on a drained lake, the city has sunk about ten metres in the last century.",
  },
  chengdu: {
    history:
      "Over two thousand years old and never once renamed, which almost no Chinese city of its age can say.",
    dishes: ["Mapo tofu", "Dan dan noodles", "Hotpot"],
    landmarks: ["The Giant Panda Breeding Base", "Wuhou Shrine", "The teahouses in People's Park"],
    fact: "The numbing half of Sichuan heat is not chilli but a peppercorn, and it is a citrus relative.",
  },
  chicago: {
    history:
      "Burned down in 1871, and answered by inventing the steel-framed skyscraper.",
    dishes: ["Deep-dish pizza", "Italian beef", "Chicago-style hot dog"],
    landmarks: ["Cloud Gate", "Willis Tower", "Art Institute"],
    fact: "The Chicago River was reversed in 1900 so it would flow away from the lake the city drinks from.",
  },
  cph: {
    history:
      "A herring market fortified by Bishop Absalon in 1167, and the seat of the Danish crown ever since.",
    dishes: ["Smørrebrød", "Frikadeller", "Wienerbrød"],
    landmarks: ["Nyhavn", "Tivoli Gardens", "The Little Mermaid"],
    fact: "Around half of all commutes are made by bicycle, and the bridges have their own rush hour.",
  },
  cusco: {
    history:
      "The Inca capital, laid out in the shape of a puma, with Spanish churches set straight onto Inca foundations.",
    dishes: ["Cuy", "Rocoto relleno", "Chicha morada"],
    landmarks: ["Sacsayhuamán", "Qorikancha", "The Plaza de Armas"],
    fact: "The Inca stonework is cut so closely that a knife blade will not go between the blocks.",
  },
  dc: {
    history:
      "The national capital, sited on the Potomac by compromise in 1790 and burned by British troops in 1814.",
    dishes: ["Half-smoke", "Mumbo sauce", "Ethiopian injera"],
    landmarks: ["The National Mall", "Lincoln Memorial", "The Smithsonian"],
    fact: "Nothing may rise much above the width of the street it faces, which is why the capital has no skyscrapers.",
  },
  delhi: {
    history:
      "Seven cities on one site: the Mughals built Shahjahanabad in the 17th century, the British built New Delhi in the 20th.",
    dishes: ["Chole bhature", "Butter chicken", "Parathe"],
    landmarks: ["Red Fort", "Humayun's Tomb", "Qutub Minar"],
    fact: "The iron pillar at the Qutub complex is about 1,600 years old and has barely rusted.",
  },
  denver: {
    history:
      "A gold-rush camp of 1858 that stayed on as the supply town for the Rockies.",
    dishes: ["Green chili", "Denver omelette", "Rocky Mountain oysters"],
    landmarks: [
      "Red Rocks Amphitheatre",
      "Union Station",
      "Colorado State Capitol",
    ],
    fact: "One step of the Capitol is exactly a mile above sea level, and it's marked.",
  },
  dubai: {
    history:
      "A pearling and trading town on a creek, a few thousand people strong, until oil arrived in 1966 — almost everything you can see is younger than that.",
    dishes: ["Shawarma", "Machboos", "Luqaimat"],
    landmarks: ["The Burj Khalifa", "Dubai Creek", "The Gold Souk"],
    fact: "The Burj Khalifa is tall enough that you can watch the sun set from the base, take the lift up, and watch it set again.",
  },
  dublin: {
    history:
      "Founded by Vikings around a black pool — dubh linn — and the capital since the Normans walled it.",
    dishes: ["Coddle", "Boxty", "Soda bread"],
    landmarks: ["Trinity College and the Book of Kells", "The Ha'penny Bridge", "Kilmainham Gaol"],
    fact: "Ulysses covers one day here, 16 June 1904, and people still walk the route every year on the date.",
  },
  dubrovnik: {
    history:
      "A merchant republic called Ragusa that kept its independence for centuries by paying off whoever was strongest, inside walls that still run unbroken.",
    dishes: ["Black risotto", "Peka", "Rozata"],
    landmarks: ["The city walls", "Stradun", "Lokrum"],
    fact: "Ragusa abolished the slave trade in 1416, centuries before most of Europe thought to.",
  },
  hanoi: {
    history:
      "Founded as Thăng Long in 1010, and capital of the reunified country since 1976.",
    dishes: ["Phở", "Bún chả", "Egg coffee"],
    landmarks: ["Hoàn Kiếm Lake", "Temple of Literature", "The Old Quarter"],
    fact: "A working railway runs down a residential street so narrow that people pull in their chairs as the train passes.",
  },
  hcmc: {
    history:
      "Khmer Prey Nokor, then Saigon under the Nguyễn lords and the French, renamed in 1976.",
    dishes: ["Bánh mì", "Cơm tấm", "Hủ tiếu"],
    landmarks: [
      "Notre-Dame Cathedral Basilica",
      "Bến Thành Market",
      "Independence Palace",
    ],
    fact: "The Củ Chi tunnels on its edge run for some 250 kilometres.",
  },
  hongkong: {
    history:
      "Ceded to Britain in 1842, returned in 1997, and vertical for most of the time between.",
    dishes: ["Dim sum", "Wonton noodles", "Egg tarts"],
    landmarks: ["Victoria Peak", "The Star Ferry", "Tian Tan Buddha"],
    fact: "Skyscrapers here are still built behind scaffolding made of bamboo.",
  },
  honolulu: {
    history:
      "Capital of the Kingdom of Hawai'i from 1845, annexed with the islands in 1898, and bombed at Pearl Harbor in 1941.",
    dishes: ["Poke", "Loco moco", "Spam musubi"],
    landmarks: ["Waikīkī Beach", "Diamond Head", "Pearl Harbor"],
    fact: "ʻIolani is the only royal palace on American soil, and it had electric light before the White House did.",
  },
  ist: {
    history:
      "Byzantium, then Constantinople: capital of the Roman and Ottoman empires for sixteen centuries, though Türkiye's capital is Ankara now.",
    dishes: ["Balık ekmek", "Simit", "Baklava"],
    landmarks: ["Hagia Sophia", "The Blue Mosque", "Grand Bazaar"],
    fact: "Commuters cross between Europe and Asia to get to work.",
  },
  jakarta: {
    history:
      "A pepper port the Dutch renamed Batavia in 1619 and ran for three centuries before it took its own name back.",
    dishes: ["Nasi goreng", "Soto betawi", "Kerak telor"],
    landmarks: ["The National Monument", "Kota Tua", "Istiqlal Mosque"],
    fact: "The city is sinking several centimetres a year, which is why Indonesia is building a new capital in Borneo.",
  },
  kl: {
    history:
      "A tin prospectors' camp at a river junction in the 1850s that was running the country within a century.",
    dishes: ["Nasi lemak", "Char kway teow", "Roti canai"],
    landmarks: ["The Petronas Towers", "Batu Caves", "Merdeka Square"],
    fact: "Kuala Lumpur means muddy confluence, which is exactly what the tin prospectors found there.",
  },
  krakow: {
    history:
      "Poland's capital until 1596, and the only large Polish city to come through the war more or less intact.",
    dishes: ["Pierogi", "Obwarzanek", "Zapiekanka"],
    landmarks: ["The Main Market Square", "Wawel Castle", "Kazimierz"],
    fact: "A trumpet call sounds from St Mary's tower every hour and stops mid-note, for a trumpeter shot in the 13th century.",
  },
  kyoto: {
    history:
      "Japan's capital for over a thousand years until 1869, laid out as Heian-kyō on a grid copied from Chang'an and spared the bombing that flattened other cities.",
    dishes: ["Kaiseki", "Yudofu", "Matcha sweets"],
    landmarks: ["Fushimi Inari", "Kinkaku-ji", "Kiyomizu-dera"],
    fact: "It was on the 1945 shortlist of atomic targets and taken off it, which is why the temples are still standing.",
  },
  la: {
    history:
      "A Spanish pueblo of 1781; the film business arrived in the 1910s for the light and the cheap land.",
    dishes: ["Tacos", "Korean barbecue", "French dip"],
    landmarks: ["The Hollywood Sign", "Griffith Observatory", "Venice Beach"],
    fact: "The Hollywood sign originally read HOLLYWOODLAND and was an advert for a housing development.",
  },
  lima: {
    history:
      "Founded by Pizarro in 1535 as the City of Kings, and the seat of Spanish South America for two centuries.",
    dishes: ["Ceviche", "Lomo saltado", "Ají de gallina"],
    landmarks: ["The Plaza Mayor", "Huaca Pucllana", "The Malecón in Miraflores"],
    fact: "It sits in a desert and it almost never rains, yet it is grey and damp for half the year.",
  },
  lisbon: {
    history:
      "Phoenician, Roman and Moorish in turn; the 1755 earthquake levelled it and the Baixa was rebuilt on a grid.",
    dishes: ["Pastel de nata", "Bacalhau à Brás", "Bifana"],
    landmarks: ["Belém Tower", "Jerónimos Monastery", "Tram 28"],
    fact: "Tram 28's wooden cars date from the 1930s: modern trams can't take the hills and the corners.",
  },
  london: {
    history:
      "Roman Londinium, burned in 1666, bombed in the Blitz, and rebuilt each time on the same river.",
    dishes: ["Fish and chips", "Sunday roast", "Chicken tikka masala"],
    landmarks: ["Tower of London", "The British Museum", "Westminster"],
    fact: "The Metropolitan line, opened in 1863, was the first underground railway anywhere.",
  },
  madrid: {
    history:
      "A Moorish fortress made capital in 1561 for the plainest of reasons: it sits in the exact middle of the peninsula.",
    dishes: ["Cocido madrileño", "Bocadillo de calamares", "Churros con chocolate"],
    landmarks: ["The Prado", "Plaza Mayor", "Retiro Park"],
    fact: "Dinner starts around ten at night, and the city has more bars per head than anywhere else in Europe.",
  },
  manila: {
    history:
      "A Spanish walled city from 1571 and the Pacific end of the galleon trade, rebuilt from rubble after 1945.",
    dishes: ["Adobo", "Sisig", "Halo-halo"],
    landmarks: ["Intramuros", "Rizal Park", "San Agustin Church"],
    fact: "For 250 years one galleon a year carried silver from here to Acapulco and silk back the other way.",
  },
  marra: {
    history:
      "Founded by the Almoravids in 1070 as the base for an empire that reached into Spain, and one of Morocco's four imperial cities.",
    dishes: ["Tagine", "Couscous", "Harira"],
    landmarks: ["Jemaa el-Fnaa", "Koutoubia Mosque", "Bahia Palace"],
    fact: "The whole city is painted one shade of ochre by law, which is how it became the Red City.",
  },
  miami: {
    history:
      "Incorporated in 1896 on Julia Tuttle's land deal with the railroad, and remade by Cuban exile after 1959.",
    dishes: ["Cuban sandwich", "Stone crab", "Pastelitos"],
    landmarks: ["The Art Deco District", "Little Havana", "Vizcaya"],
    fact: "It's the only major American city founded by a woman, Julia Tuttle.",
  },
  minneapolis: {
    history:
      "Milled the world's flour on the falls of the Mississippi, the only true waterfall on the whole river.",
    dishes: ["Juicy Lucy", "Walleye", "Hotdish"],
    landmarks: ["The Stone Arch Bridge", "Minnehaha Falls", "The Walker Art Center"],
    fact: "Eleven kilometres of enclosed skyways stitch downtown together, because January sits well below freezing.",
  },
  montreal: {
    history:
      "A fur-trading post founded in 1642 on an island in the St Lawrence, and still the largest French-speaking city in the Americas.",
    dishes: ["Poutine", "Montreal-style bagels", "Smoked meat"],
    landmarks: ["Notre-Dame Basilica", "Mount Royal", "The Old Port"],
    fact: "Winter moves the city underground: the RESO runs about thirty kilometres of tunnels beneath the centre.",
  },
  nairobi: {
    history:
      "A railway depot pitched in a swamp in 1899, capital of British East Africa and then of Kenya.",
    dishes: ["Nyama choma", "Ugali", "Mandazi"],
    landmarks: ["Nairobi National Park", "The Karen Blixen Museum", "The Giraffe Centre"],
    fact: "It is the only capital with a national park inside the city limits, so the lions have a skyline behind them.",
  },
  neworleans: {
    history:
      "French from 1718, Spanish, then American in 1803; jazz was invented here around 1900.",
    dishes: ["Gumbo", "Po'boy", "Beignets"],
    landmarks: [
      "The French Quarter",
      "St. Louis Cathedral",
      "The Garden District",
    ],
    fact: "The dead are buried above ground: the water table is too high to dig.",
  },
  nyc: {
    history:
      "Dutch New Amsterdam from 1624, English from 1664, and the port that took in most of the immigration.",
    dishes: ["A pizza slice", "Bagel with lox", "Pastrami on rye"],
    landmarks: ["Statue of Liberty", "Central Park", "Brooklyn Bridge"],
    fact: "More people live in the city than in any of forty of the fifty states.",
  },
  osaka: {
    history:
      "The country's rice and money market under the Tokugawa — run by merchants, not samurai, and still called the nation's kitchen.",
    dishes: ["Takoyaki", "Okonomiyaki", "Kushikatsu"],
    landmarks: ["Osaka Castle", "Dotonbori", "Shinsekai"],
    fact: "Instant noodles were invented here in 1958, and there's a museum about it.",
  },
  oxford: {
    history:
      "Teaching has gone on here since at least 1096, which makes it the oldest university in the English-speaking world and the town the word campus was never needed for.",
    dishes: ["Oxford sausage", "Cream tea", "A Sunday roast"],
    landmarks: ["The Radcliffe Camera", "Christ Church", "The Bodleian Library"],
    fact: "The Bodleian is owed a copy of every book published in Britain, and it has never lent one out — it refused even Charles I.",
  },
  paris: {
    history:
      "A Gaulish island settlement the Romans called Lutetia; Haussmann cut the boulevards through it in the 1850s and 60s.",
    dishes: ["Steak frites", "Croissant", "Soupe à l'oignon"],
    landmarks: ["Eiffel Tower", "The Louvre", "Notre-Dame"],
    fact: "The Eiffel Tower grows about 15cm taller in summer as the iron expands.",
  },
  philly: {
    history:
      "Laid out by William Penn in 1682, and capital of the United States from 1790 to 1800.",
    dishes: ["Cheesesteak", "Roast pork sandwich", "Soft pretzel"],
    landmarks: [
      "Independence Hall",
      "The Liberty Bell",
      "The Art Museum steps",
    ],
    fact: "City Hall was the tallest habitable building in the world when it was finished in 1894.",
  },
  porto: {
    history:
      "Roman Portus Cale gave Portugal its name; the port wine trade built the quays.",
    dishes: ["Francesinha", "Tripas à moda do Porto", "Bifana"],
    landmarks: ["Dom Luís I Bridge", "Livraria Lello", "Ribeira"],
    fact: "The port wine isn't aged in Porto — the lodges are across the river in Vila Nova de Gaia.",
  },
  prague: {
    history:
      "Seat of the Holy Roman Emperor under Charles IV, and one of the few European capitals the war left standing.",
    dishes: ["Svíčková", "Goulash", "Trdelník"],
    landmarks: ["Charles Bridge", "Prague Castle", "The Astronomical Clock"],
    fact: "The astronomical clock has been running since 1410, the oldest one still working.",
  },
  reykjavik: {
    history:
      "Settled in 874 and the northernmost capital of any sovereign state on earth.",
    dishes: ["Plokkfiskur", "Hot dogs with crispy onions", "Rye bread ice cream"],
    landmarks: ["Hallgrímskirkja", "Harpa", "The old harbour"],
    fact: "Nearly every building is heated by geothermal water, so the hot tap runs with a faint smell of sulphur.",
  },
  rio: {
    history:
      "Portuguese from 1565 and Brazil's capital until Brasília took over in 1960; the court itself moved here in 1808, fleeing Napoleon.",
    dishes: ["Feijoada", "Pão de queijo", "Açaí"],
    landmarks: ["Christ the Redeemer", "Sugarloaf Mountain", "Copacabana"],
    fact: "Christ the Redeemer is hit by lightning several times a year, so a stock of the original stone is kept for repairs.",
  },
  rome: {
    history:
      "Founded by tradition in 753 BC; capital of an empire, then of the papacy, then of Italy from 1871.",
    dishes: ["Cacio e pepe", "Carbonara", "Supplì"],
    landmarks: ["The Colosseum", "The Pantheon", "Trevi Fountain"],
    fact: "Around a million and a half euros a year is fished out of the Trevi Fountain and given to charity.",
  },
  santiago: {
    history:
      "Founded in 1541 in a valley pinned between the Andes and the coastal range.",
    dishes: ["Completo", "Pastel de choclo", "Empanada de pino"],
    landmarks: ["Cerro San Cristóbal", "Plaza de Armas", "Barrio Bellavista"],
    fact: "After winter rain clears the air the Andes stand straight over the streets, six thousand metres up.",
  },
  saopaulo: {
    history:
      "A Jesuit mission of 1554 that coffee money turned into the largest city in the southern hemisphere.",
    dishes: ["Feijoada", "Pastel", "Mortadella sandwich"],
    landmarks: ["Avenida Paulista", "The Municipal Market", "Ibirapuera Park"],
    fact: "More people of Japanese descent live here than anywhere else outside Japan itself.",
  },
  seattle: {
    history:
      "A timber port named for Chief Si'ahl, remade by Boeing, then by grunge, then by software.",
    dishes: ["Salmon", "Oysters", "Teriyaki"],
    landmarks: [
      "Pike Place Market",
      "The Space Needle",
      "The Puget Sound ferries",
    ],
    fact: "The first Starbucks opened at Pike Place in 1971 and is still there.",
  },
  seoul: {
    history:
      "Capital of the Joseon dynasty from 1394; flattened in the Korean War and rebuilt inside a generation.",
    dishes: ["Bibimbap", "Korean fried chicken", "Tteokbokki"],
    landmarks: [
      "Gyeongbokgung Palace",
      "Bukchon Hanok Village",
      "Namsan Tower",
    ],
    fact: "Its subway is one of the longest networks in the world, and every platform has screen doors.",
  },
  sf: {
    history:
      "A mission village of 1776 that went from a thousand people to twenty-five thousand in the year of the Gold Rush.",
    dishes: ["Sourdough", "Cioppino", "Mission burrito"],
    landmarks: ["Golden Gate Bridge", "Alcatraz", "The cable cars"],
    fact: "The Golden Gate Bridge is painted continuously — the crew finishes one end and starts again at the other.",
  },
  shanghai: {
    history:
      "A walled market town on the Huangpu until the treaty ports of the 1840s turned it into the busiest harbour in Asia.",
    dishes: ["Xiaolongbao", "Shengjianbao", "Hairy crab"],
    landmarks: ["The Bund", "Yu Garden", "The Oriental Pearl Tower"],
    fact: "Pudong, the skyline in every photograph of the city, was farmland and warehouses until 1990.",
  },
  siemreap: {
    history:
      "A small town beside Angkor, capital of the Khmer Empire, which held perhaps a million people when London held fifty thousand.",
    dishes: ["Fish amok", "Lok lak", "Num banh chok"],
    landmarks: ["Angkor Wat", "The Bayon", "Ta Prohm"],
    fact: "Angkor Wat is on Cambodia's flag — the only building on any national flag in the world.",
  },
  singapore: {
    history:
      "A British trading post from 1819, briefly part of Malaysia, and a city and a country at once since 1965.",
    dishes: ["Hainanese chicken rice", "Chilli crab", "Laksa"],
    landmarks: ["Gardens by the Bay", "Marina Bay Sands", "The hawker centres"],
    fact: "Chewing gum has been restricted since 1992; the therapeutic kind needs a prescription.",
  },
  sydney: {
    history:
      "Gadigal country long before the First Fleet landed in 1788 and made a penal colony of it.",
    dishes: ["Meat pie", "Barramundi", "Lamington"],
    landmarks: ["The Opera House", "Harbour Bridge", "Bondi Beach"],
    fact: "The Opera House roof carries more than a million tiles, in two shades of white.",
  },
  taipei: {
    history:
      "A Qing walled city, then the Japanese colonial capital, then the seat of the Republic of China from 1949.",
    dishes: ["Beef noodle soup", "Xiao long bao", "Bubble tea"],
    landmarks: [
      "Taipei 101",
      "Chiang Kai-shek Memorial",
      "Shilin Night Market",
    ],
    fact: "Taipei 101 hangs a 660-tonne steel ball near the top to damp the sway in a typhoon.",
  },
  tokyo: {
    history:
      "Edo, a fishing village the shoguns made the largest city on earth by 1700, renamed Tokyo in 1868.",
    dishes: ["Sushi", "Monjayaki", "Ramen"],
    landmarks: ["Senso-ji", "Shibuya Crossing", "Meiji Jingū"],
    fact: "Shibuya Crossing takes as many as 3,000 people at a time.",
  },
  toronto: {
    history:
      "York from 1793, burned by American troops in 1813, and renamed Toronto in 1834.",
    dishes: ["Peameal bacon sandwich", "Butter tart", "Roti"],
    landmarks: ["CN Tower", "St. Lawrence Market", "The Distillery District"],
    fact: "The CN Tower was the tallest free-standing structure in the world for 32 years.",
  },
  vancouver: {
    history:
      "A sawmill settlement that became Canada's Pacific port the moment the railway reached it in 1887.",
    dishes: ["Japadog", "Salmon candy", "Nanaimo bars"],
    landmarks: ["Stanley Park", "Granville Island", "The Capilano Suspension Bridge"],
    fact: "You can ski in the morning and be on a beach by the afternoon, which very few cities can say honestly.",
  },
  vatican: {
    history:
      "The smallest sovereign state on earth, drawn up in 1929 around the basilica built over St Peter's tomb.",
    dishes: ["Cacio e pepe", "Supplì", "Maritozzo"],
    landmarks: ["St Peter's Basilica", "The Sistine Chapel", "The Vatican Museums"],
    fact: "At about a fifth of a square mile, the whole country would fit inside Central Park eight times.",
  },
  vegas: {
    history:
      "A railroad water stop that legalised gambling in 1931 and built the Strip on it.",
    dishes: ["Shrimp cocktail", "Buffet prime rib", "Chinatown pho"],
    landmarks: ["The Strip", "Fremont Street", "The Bellagio fountains"],
    fact: "The Luxor's beam is the brightest in the world, and pulls in its own swarm of moths and the bats that eat them.",
  },
  venice: {
    history:
      "Built on wooden piles in a lagoon by mainlanders in flight, and then a republic of its own for a thousand years.",
    dishes: ["Sarde in saor", "Cicchetti", "Risotto al nero di seppia"],
    landmarks: ["St Mark's Basilica", "The Rialto Bridge", "The Grand Canal"],
    fact: "The whole city stands on millions of alder piles, which petrified underwater instead of rotting.",
  },
  vienna: {
    history:
      "A Roman frontier camp that spent six centuries as the Habsburg seat, running an empire from the Hofburg.",
    dishes: ["Wiener schnitzel", "Sachertorte", "Tafelspitz"],
    landmarks: ["Schönbrunn Palace", "St Stephen's Cathedral", "The Belvedere"],
    fact: "The tap water is Alpine spring water, piped in from the mountains since 1873 and never treated.",
  },
  xian: {
    history:
      "The eastern end of the Silk Road and the capital of thirteen dynasties, inside Ming walls that still run the whole circuit.",
    dishes: ["Roujiamo", "Biangbiang noodles", "Yangrou paomo"],
    landmarks: ["The Terracotta Army", "The city walls", "The Muslim Quarter"],
    fact: "The Terracotta Army turned up in 1974 under farmers digging a well, and no two of the faces are the same.",
  },
  zanzibar: {
    history:
      "The Omani sultans' capital and the hinge of the East African spice and slave trades, in coral-stone houses that still stand.",
    dishes: ["Zanzibar pizza", "Urojo soup", "Pilau"],
    landmarks: ["Stone Town", "The House of Wonders", "Forodhani Gardens"],
    fact: "The shortest war in recorded history was fought here in 1896 and was over in about thirty-eight minutes.",
  },
};

export function factsFor(id: CityId): CityFacts | undefined {
  return CITY_FACTS[id];
}
