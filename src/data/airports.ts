/**
 * Where a trip can start from — deliberately much bigger and much rougher
 * than the city catalogue. Arrivals only writes up 43 cities worth visiting;
 * home is wherever you actually are, so this leans toward regional airports
 * a small city might use rather than just the hubs. A real build would pull
 * from a full airport directory (OurAirports, or an airline's own), not a
 * hand-picked few hundred.
 */
export interface Airport {
  code: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
  /** The airport you arrive at for this city, as against the nearest strip of tarmac. */
  gateway?: true;
}

export const AIRPORTS: Airport[] = [
  // Major international hubs
  { code: "JFK", name: "John F. Kennedy International", city: "New York", region: "New York", lat: 40.6413, lon: -73.7781, gateway: true },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", region: "California", lat: 33.9416, lon: -118.4085, gateway: true },
  { code: "ORD", name: "O'Hare International", city: "Chicago", region: "Illinois", lat: 41.9742, lon: -87.9073, gateway: true },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", region: "California", lat: 37.6213, lon: -122.379, gateway: true },
  { code: "SEA", name: "Seattle-Tacoma International", city: "Seattle", region: "Washington", lat: 47.4502, lon: -122.3088, gateway: true },
  { code: "DEN", name: "Denver International", city: "Denver", region: "Colorado", lat: 39.8561, lon: -104.6737, gateway: true },
  { code: "MIA", name: "Miami International", city: "Miami", region: "Florida", lat: 25.7959, lon: -80.287, gateway: true },
  { code: "IAD", name: "Washington Dulles International", city: "Washington", region: "Virginia", lat: 38.9531, lon: -77.4565, gateway: true },
  { code: "YYZ", name: "Toronto Pearson International", city: "Toronto", region: "Canada", lat: 43.6777, lon: -79.6248, gateway: true },
  { code: "MEX", name: "Mexico City International", city: "Mexico City", region: "Mexico", lat: 19.4363, lon: -99.0721, gateway: true },
  { code: "EZE", name: "Ministro Pistarini International", city: "Buenos Aires", region: "Argentina", lat: -34.8222, lon: -58.5358, gateway: true },
  { code: "GIG", name: "Rio de Janeiro-Galeão International", city: "Rio de Janeiro", region: "Brazil", lat: -22.81, lon: -43.2506, gateway: true },
  { code: "GRU", name: "São Paulo-Guarulhos International", city: "São Paulo", region: "Brazil", lat: -23.4356, lon: -46.4731, gateway: true },
  { code: "LHR", name: "Heathrow", city: "London", region: "United Kingdom", lat: 51.47, lon: -0.4543, gateway: true },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", region: "France", lat: 49.0097, lon: 2.5479, gateway: true },
  { code: "AMS", name: "Schiphol", city: "Amsterdam", region: "Netherlands", lat: 52.3105, lon: 4.7683, gateway: true },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", region: "Germany", lat: 50.0379, lon: 8.5622, gateway: true },
  { code: "FCO", name: "Leonardo da Vinci–Fiumicino", city: "Rome", region: "Italy", lat: 41.8003, lon: 12.2389, gateway: true },
  { code: "BCN", name: "Barcelona-El Prat", city: "Barcelona", region: "Spain", lat: 41.2974, lon: 2.0833, gateway: true },
  { code: "LIS", name: "Humberto Delgado Airport", city: "Lisbon", region: "Portugal", lat: 38.7813, lon: -9.1359, gateway: true },
  { code: "PRG", name: "Václav Havel Airport", city: "Prague", region: "Czechia", lat: 50.1008, lon: 14.26, gateway: true },
  { code: "CPH", name: "Copenhagen Airport", city: "Copenhagen", region: "Denmark", lat: 55.618, lon: 12.656, gateway: true },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", region: "Türkiye", lat: 41.2753, lon: 28.7519, gateway: true },
  { code: "CAI", name: "Cairo International", city: "Cairo", region: "Egypt", lat: 30.1219, lon: 31.4056, gateway: true },
  { code: "CPT", name: "Cape Town International", city: "Cape Town", region: "South Africa", lat: -33.9715, lon: 18.6021, gateway: true },
  { code: "RAK", name: "Marrakesh Menara", city: "Marrakesh", region: "Morocco", lat: 31.6069, lon: -8.0363, gateway: true },
  { code: "DEL", name: "Indira Gandhi International", city: "Delhi", region: "India", lat: 28.5562, lon: 77.1, gateway: true },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", region: "Thailand", lat: 13.69, lon: 100.7501, gateway: true },
  { code: "SGN", name: "Tân Sơn Nhất International", city: "Ho Chi Minh City", region: "Vietnam", lat: 10.8188, lon: 106.652, gateway: true },
  { code: "HKG", name: "Hong Kong International", city: "Hong Kong", region: "Hong Kong", lat: 22.308, lon: 113.9185, gateway: true },
  { code: "ICN", name: "Incheon International", city: "Seoul", region: "South Korea", lat: 37.4602, lon: 126.4407, gateway: true },
  { code: "HND", name: "Haneda Airport", city: "Tokyo", region: "Japan", lat: 35.5494, lon: 139.7798, gateway: true },
  { code: "TPE", name: "Taiwan Taoyuan International", city: "Taipei", region: "Taiwan", lat: 25.0797, lon: 121.2342, gateway: true },
  { code: "SIN", name: "Changi Airport", city: "Singapore", region: "Singapore", lat: 1.3644, lon: 103.9915, gateway: true },
  { code: "SYD", name: "Kingsford Smith Airport", city: "Sydney", region: "Australia", lat: -33.9399, lon: 151.1753, gateway: true },

  // The five catalogue cities the hub list above was missing. Kyoto and Osaka
  // share KIX, which is the honest answer rather than a tidy one: Kyoto has no
  // airport of its own, and the train from Kansai is how you actually arrive.
  { code: "BER", name: "Brandenburg Airport", city: "Berlin", region: "Germany", lat: 52.3667, lon: 13.5033, gateway: true },
  { code: "HAN", name: "Noi Bai International", city: "Hanoi", region: "Vietnam", lat: 21.2212, lon: 105.8072, gateway: true },
  { code: "KIX", name: "Kansai International", city: "Osaka", region: "Japan", lat: 34.4342, lon: 135.2440, gateway: true },
  { code: "OPO", name: "Francisco Sá Carneiro Airport", city: "Porto", region: "Portugal", lat: 41.2481, lon: -8.6814, gateway: true },

  // Virginia — the regional cluster a small city actually flies from
  { code: "ORF", name: "Norfolk International", city: "Norfolk", region: "Virginia", lat: 36.8946, lon: -76.2012 },
  { code: "RIC", name: "Richmond International", city: "Richmond", region: "Virginia", lat: 37.5052, lon: -77.3197 },
  { code: "ROA", name: "Roanoke-Blacksburg Regional", city: "Roanoke", region: "Virginia", lat: 37.3255, lon: -79.9754 },
  { code: "CHO", name: "Charlottesville-Albemarle", city: "Charlottesville", region: "Virginia", lat: 38.1386, lon: -78.4529 },
  { code: "LYH", name: "Lynchburg Regional", city: "Lynchburg", region: "Virginia", lat: 37.3266, lon: -79.2004 },
  { code: "SHD", name: "Shenandoah Valley Regional", city: "Staunton", region: "Virginia", lat: 38.2638, lon: -78.8964 },
  { code: "PHF", name: "Newport News/Williamsburg International", city: "Newport News", region: "Virginia", lat: 37.1319, lon: -76.493 },
  { code: "DCA", name: "Reagan National", city: "Washington", region: "Virginia", lat: 38.8512, lon: -77.0402 },

  // Mid-Atlantic and Southeast
  { code: "BWI", name: "Baltimore/Washington International", city: "Baltimore", region: "Maryland", lat: 39.1754, lon: -76.6684 },
  { code: "PHL", name: "Philadelphia International", city: "Philadelphia", region: "Pennsylvania", lat: 39.8744, lon: -75.2424 },
  { code: "PIT", name: "Pittsburgh International", city: "Pittsburgh", region: "Pennsylvania", lat: 40.4915, lon: -80.2329 },
  { code: "CLT", name: "Charlotte Douglas International", city: "Charlotte", region: "North Carolina", lat: 35.2144, lon: -80.9473 },
  { code: "RDU", name: "Raleigh-Durham International", city: "Raleigh", region: "North Carolina", lat: 35.8776, lon: -78.7875 },
  { code: "GSO", name: "Piedmont Triad International", city: "Greensboro", region: "North Carolina", lat: 36.0978, lon: -79.9373 },
  { code: "CHS", name: "Charleston International", city: "Charleston", region: "South Carolina", lat: 32.8986, lon: -80.0405 },
  { code: "SAV", name: "Savannah/Hilton Head International", city: "Savannah", region: "Georgia", lat: 32.1276, lon: -81.2021 },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International", city: "Atlanta", region: "Georgia", lat: 33.6407, lon: -84.4277 },
  { code: "JAX", name: "Jacksonville International", city: "Jacksonville", region: "Florida", lat: 30.4941, lon: -81.6879 },
  { code: "TPA", name: "Tampa International", city: "Tampa", region: "Florida", lat: 27.9755, lon: -82.5332 },
  { code: "MCO", name: "Orlando International", city: "Orlando", region: "Florida", lat: 28.4312, lon: -81.3081 },
  { code: "FLL", name: "Fort Lauderdale-Hollywood International", city: "Fort Lauderdale", region: "Florida", lat: 26.0726, lon: -80.1527 },

  // Northeast
  { code: "BOS", name: "Logan International", city: "Boston", region: "Massachusetts", lat: 42.3656, lon: -71.0096 },
  { code: "PVD", name: "T. F. Green International", city: "Providence", region: "Rhode Island", lat: 41.724, lon: -71.4283 },
  { code: "BDL", name: "Bradley International", city: "Hartford", region: "Connecticut", lat: 41.9389, lon: -72.6832 },
  { code: "ALB", name: "Albany International", city: "Albany", region: "New York", lat: 42.7483, lon: -73.8017 },
  { code: "SYR", name: "Syracuse Hancock International", city: "Syracuse", region: "New York", lat: 43.1112, lon: -76.1063 },
  { code: "ROC", name: "Frederick Douglass Greater Rochester International", city: "Rochester", region: "New York", lat: 43.1189, lon: -77.6724 },
  { code: "BUF", name: "Buffalo Niagara International", city: "Buffalo", region: "New York", lat: 42.9405, lon: -78.7322 },
  { code: "PWM", name: "Portland International Jetport", city: "Portland", region: "Maine", lat: 43.6462, lon: -70.3093 },
  { code: "BTV", name: "Burlington International", city: "Burlington", region: "Vermont", lat: 44.4719, lon: -73.1533 },
  { code: "MHT", name: "Manchester-Boston Regional", city: "Manchester", region: "New Hampshire", lat: 42.9326, lon: -71.4357 },
  { code: "EWR", name: "Newark Liberty International", city: "Newark", region: "New Jersey", lat: 40.6895, lon: -74.1745 },
  { code: "LGA", name: "LaGuardia Airport", city: "New York", region: "New York", lat: 40.7769, lon: -73.874 },

  // Midwest
  { code: "DTW", name: "Detroit Metropolitan", city: "Detroit", region: "Michigan", lat: 42.2124, lon: -83.3534 },
  { code: "CLE", name: "Cleveland Hopkins International", city: "Cleveland", region: "Ohio", lat: 41.4058, lon: -81.8539 },
  { code: "CMH", name: "John Glenn Columbus International", city: "Columbus", region: "Ohio", lat: 39.998, lon: -82.8919 },
  { code: "CVG", name: "Cincinnati/Northern Kentucky International", city: "Cincinnati", region: "Ohio", lat: 39.0533, lon: -84.663 },
  { code: "IND", name: "Indianapolis International", city: "Indianapolis", region: "Indiana", lat: 39.7169, lon: -86.2956 },
  { code: "MKE", name: "Milwaukee Mitchell International", city: "Milwaukee", region: "Wisconsin", lat: 42.9472, lon: -87.8966 },
  { code: "MSP", name: "Minneapolis-Saint Paul International", city: "Minneapolis", region: "Minnesota", lat: 44.8848, lon: -93.2223 },
  { code: "STL", name: "St. Louis Lambert International", city: "St. Louis", region: "Missouri", lat: 38.7487, lon: -90.37 },
  { code: "MCI", name: "Kansas City International", city: "Kansas City", region: "Missouri", lat: 39.2976, lon: -94.7139 },
  { code: "OMA", name: "Eppley Airfield", city: "Omaha", region: "Nebraska", lat: 41.3032, lon: -95.8941 },
  { code: "DSM", name: "Des Moines International", city: "Des Moines", region: "Iowa", lat: 41.534, lon: -93.6631 },
  { code: "GRR", name: "Gerald R. Ford International", city: "Grand Rapids", region: "Michigan", lat: 42.8808, lon: -85.5228 },

  // South and Central
  { code: "BNA", name: "Nashville International", city: "Nashville", region: "Tennessee", lat: 36.1263, lon: -86.6774 },
  { code: "MEM", name: "Memphis International", city: "Memphis", region: "Tennessee", lat: 35.0424, lon: -89.9767 },
  { code: "BHM", name: "Birmingham-Shuttlesworth International", city: "Birmingham", region: "Alabama", lat: 33.5629, lon: -86.7535 },
  { code: "MSY", name: "Louis Armstrong New Orleans International", city: "New Orleans", region: "Louisiana", lat: 29.9934, lon: -90.258 },
  { code: "LIT", name: "Bill and Hillary Clinton National", city: "Little Rock", region: "Arkansas", lat: 34.7294, lon: -92.2243 },
  { code: "OKC", name: "Will Rogers World Airport", city: "Oklahoma City", region: "Oklahoma", lat: 35.3931, lon: -97.6007 },
  { code: "TUL", name: "Tulsa International", city: "Tulsa", region: "Oklahoma", lat: 36.1984, lon: -95.8881 },
  { code: "DFW", name: "Dallas/Fort Worth International", city: "Dallas", region: "Texas", lat: 32.8998, lon: -97.0403 },
  { code: "IAH", name: "George Bush Intercontinental", city: "Houston", region: "Texas", lat: 29.9902, lon: -95.3368 },
  { code: "AUS", name: "Austin-Bergstrom International", city: "Austin", region: "Texas", lat: 30.1975, lon: -97.6664 },
  { code: "SAT", name: "San Antonio International", city: "San Antonio", region: "Texas", lat: 29.5337, lon: -98.4698 },
  { code: "ELP", name: "El Paso International", city: "El Paso", region: "Texas", lat: 31.8072, lon: -106.3781 },

  // Mountain and West
  { code: "PHX", name: "Phoenix Sky Harbor International", city: "Phoenix", region: "Arizona", lat: 33.4373, lon: -112.0078 },
  { code: "ABQ", name: "Albuquerque International Sunport", city: "Albuquerque", region: "New Mexico", lat: 35.0402, lon: -106.6091 },
  { code: "SLC", name: "Salt Lake City International", city: "Salt Lake City", region: "Utah", lat: 40.7899, lon: -111.9791 },
  { code: "BOI", name: "Boise Airport", city: "Boise", region: "Idaho", lat: 43.5644, lon: -116.2228 },
  { code: "BIL", name: "Billings Logan International", city: "Billings", region: "Montana", lat: 45.8077, lon: -108.5429 },
  { code: "LAS", name: "Harry Reid International", city: "Las Vegas", region: "Nevada", lat: 36.084, lon: -115.1537 },

  // Pacific
  { code: "SAN", name: "San Diego International", city: "San Diego", region: "California", lat: 32.7338, lon: -117.1933 },
  { code: "SMF", name: "Sacramento International", city: "Sacramento", region: "California", lat: 38.6954, lon: -121.5908 },
  { code: "PDX", name: "Portland International", city: "Portland", region: "Oregon", lat: 45.5898, lon: -122.5951 },
  { code: "ANC", name: "Ted Stevens Anchorage International", city: "Anchorage", region: "Alaska", lat: 61.1743, lon: -149.9982 },
  { code: "HNL", name: "Daniel K. Inouye International", city: "Honolulu", region: "Hawaii", lat: 21.3245, lon: -157.9251 },
];

const BY_CODE = new Map(AIRPORTS.map((airport) => [airport.code, airport]));

export function airportByCode(code: string): Airport | undefined {
  return BY_CODE.get(code);
}

/**
 * Ranked the way city search is: an exact code first, then a city that
 * starts with what you typed, then a code prefix, then anything else that
 * mentions it.
 */
export function searchAirports(term: string): Airport[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return [];

  const scored: { airport: Airport; rank: number }[] = [];
  for (const airport of AIRPORTS) {
    const code = airport.code.toLowerCase();
    const city = airport.city.toLowerCase();
    const name = airport.name.toLowerCase();

    if (code === needle) {
      scored.push({ airport, rank: 0 });
    } else if (city.startsWith(needle)) {
      scored.push({ airport, rank: 1 });
    } else if (code.startsWith(needle)) {
      scored.push({ airport, rank: 2 });
    } else if (city.includes(needle) || name.includes(needle) || airport.region.toLowerCase().includes(needle)) {
      scored.push({ airport, rank: 3 });
    }
  }

  return scored
    .sort((a, b) => a.rank - b.rank || a.airport.city.localeCompare(b.airport.city))
    .map((entry) => entry.airport);
}

/**
 * Where you land, given where you're going. The catalogue names cities and
 * this list names airports, so the join is geography rather than a column of
 * hand-typed codes that would rot the moment a city moved. The radius is the
 * honesty check: past it there is no airport for the place, and the pass says
 * the city's name alone instead of pointing at one three hours away.
 */
export function nearestAirport(to: { lat: number; lon: number }, withinKm = 130): Airport | undefined {
  let best: Airport | undefined;
  let bestKm = Infinity;
  let bestGateway: Airport | undefined;
  let bestGatewayKm = Infinity;

  for (const airport of AIRPORTS) {
    const km = roughKm(airport, to);
    if (km < bestKm) {
      best = airport;
      bestKm = km;
    }
    if (airport.gateway && km < bestGatewayKm) {
      bestGateway = airport;
      bestGatewayKm = km;
    }
  }

  // A gateway inside the radius wins even when something smaller is closer:
  // New York's nearest runway is LaGuardia and nobody crosses an ocean into it.
  if (bestGateway && bestGatewayKm <= withinKm) return bestGateway;
  return bestKm <= withinKm ? best : undefined;
}

/** Equirectangular, which is plenty over the ~100km this is ever asked about. */
function roughKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x = toRad(b.lon - a.lon) * Math.cos(toRad((a.lat + b.lat) / 2));
  const y = toRad(b.lat - a.lat);
  return 6371 * Math.sqrt(x * x + y * y);
}
