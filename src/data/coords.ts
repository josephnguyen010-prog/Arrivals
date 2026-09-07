import type { CityId } from "../types";

export interface LatLon {
  lat: number;
  lon: number;
}

/** Airport-ish coordinates, one pair per city — real geography, not an estimate. */
export const CITY_COORDS: Record<CityId, LatLon> = {
  accra: { lat: 5.6037, lon: -0.187 },
  addis: { lat: 9.0192, lon: 38.7525 },
  amsterdam: { lat: 52.3676, lon: 4.9041 },
  annarbor: { lat: 42.2808, lon: -83.743 },
  athens: { lat: 37.9838, lon: 23.7275 },
  austin: { lat: 30.2672, lon: -97.7431 },
  bangkok: { lat: 13.7563, lon: 100.5018 },
  barcelona: { lat: 41.3874, lon: 2.1686 },
  beijing: { lat: 39.9042, lon: 116.4074 },
  berlin: { lat: 52.52, lon: 13.405 },
  blacksburg: { lat: 37.2296, lon: -80.4139 },
  bogota: { lat: 4.711, lon: -74.0721 },
  boston: { lat: 42.3601, lon: -71.0589 },
  bsas: { lat: -34.6037, lon: -58.3816 },
  budapest: { lat: 47.4979, lon: 19.0402 },
  busan: { lat: 35.1796, lon: 129.0756 },
  cairo: { lat: 30.0444, lon: 31.2357 },
  capetown: { lat: -33.9249, lon: 18.4241 },
  cdmx: { lat: 19.4326, lon: -99.1332 },
  chengdu: { lat: 30.5728, lon: 104.0668 },
  chicago: { lat: 41.8781, lon: -87.6298 },
  cph: { lat: 55.6761, lon: 12.5683 },
  cusco: { lat: -13.5319, lon: -71.9675 },
  dc: { lat: 38.9072, lon: -77.0369 },
  delhi: { lat: 28.6139, lon: 77.209 },
  denver: { lat: 39.7392, lon: -104.9903 },
  dublin: { lat: 53.3498, lon: -6.2603 },
  hanoi: { lat: 21.0278, lon: 105.8342 },
  hcmc: { lat: 10.8231, lon: 106.6297 },
  hongkong: { lat: 22.3193, lon: 114.1694 },
  honolulu: { lat: 21.3069, lon: -157.8583 },
  ist: { lat: 41.0082, lon: 28.9784 },
  jakarta: { lat: -6.2088, lon: 106.8456 },
  kl: { lat: 3.139, lon: 101.6869 },
  krakow: { lat: 50.0647, lon: 19.945 },
  kyoto: { lat: 35.0116, lon: 135.7681 },
  la: { lat: 34.0522, lon: -118.2437 },
  lima: { lat: -12.0464, lon: -77.0428 },
  lisbon: { lat: 38.7223, lon: -9.1393 },
  london: { lat: 51.5072, lon: -0.1276 },
  madrid: { lat: 40.4168, lon: -3.7038 },
  manila: { lat: 14.5995, lon: 120.9842 },
  marra: { lat: 31.6295, lon: -7.9811 },
  miami: { lat: 25.7617, lon: -80.1918 },
  minneapolis: { lat: 44.9778, lon: -93.265 },
  nairobi: { lat: -1.2921, lon: 36.8219 },
  neworleans: { lat: 29.9511, lon: -90.0715 },
  nyc: { lat: 40.7128, lon: -74.006 },
  osaka: { lat: 34.6937, lon: 135.5023 },
  oxford: { lat: 51.752, lon: -1.2577 },
  paris: { lat: 48.8566, lon: 2.3522 },
  philly: { lat: 39.9526, lon: -75.1652 },
  porto: { lat: 41.1579, lon: -8.6291 },
  prague: { lat: 50.0755, lon: 14.4378 },
  reykjavik: { lat: 64.1466, lon: -21.9426 },
  rio: { lat: -22.9068, lon: -43.1729 },
  rome: { lat: 41.9028, lon: 12.4964 },
  santiago: { lat: -33.4489, lon: -70.6693 },
  saopaulo: { lat: -23.5558, lon: -46.6396 },
  seattle: { lat: 47.6062, lon: -122.3321 },
  seoul: { lat: 37.5665, lon: 126.978 },
  sf: { lat: 37.7749, lon: -122.4194 },
  shanghai: { lat: 31.2304, lon: 121.4737 },
  siemreap: { lat: 13.3671, lon: 103.8448 },
  singapore: { lat: 1.3521, lon: 103.8198 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  taipei: { lat: 25.033, lon: 121.5654 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  toronto: { lat: 43.6532, lon: -79.3832 },
  vatican: { lat: 41.9029, lon: 12.4534 },
  vegas: { lat: 36.1699, lon: -115.1398 },
  venice: { lat: 45.4408, lon: 12.3155 },
  vienna: { lat: 48.2082, lon: 16.3738 },
  xian: { lat: 34.3416, lon: 108.9398 },
  zanzibar: { lat: -6.1659, lon: 39.2026 },
};

export function coordsFor(id: CityId): LatLon | undefined {
  return CITY_COORDS[id];
}

const EARTH_RADIUS_KM = 6371;

/** Straight-line distance, not a flight path — no airline flies the chord. */
export function greatCircleKm(a: LatLon, b: LatLon): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLon * sinLon;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

const CRUISE_KMH = 880;
/** Taxi, climb, descent — the part of a flight that isn't cruising. */
const OVERHEAD_HOURS = 0.75;

export function flightHoursFor(km: number): number {
  return km / CRUISE_KMH + OVERHEAD_HOURS;
}
