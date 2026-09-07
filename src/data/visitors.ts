import type { CityId } from "../types";

/**
 * Roughly how many people arrive in a year.
 *
 * Rounded estimates of visitor arrivals, in the ballpark the published indices
 * put them — Euromonitor's city destination ranking and Mastercard's, which
 * disagree with each other by a million or two and are themselves a year or
 * more behind. Rounded hard on purpose: the honest precision here is "about
 * twenty million", and a figure like 22,431,907 would be claiming a
 * measurement nobody has.
 *
 * A real build would pull these from one named source with a year attached and
 * say which. This is a stand-in, in the same way the city catalogue is.
 *
 * Deliberately partial. Blacksburg and Ann Arbor are absent because nobody
 * publishes a visitor count for a college town of forty thousand, and inventing
 * one to fill the row would be the only made-up number in the app.
 */
export const CITY_VISITORS: Partial<Record<CityId, number>> = {
  // Asia
  hongkong: 26_000_000,
  bangkok: 22_000_000,
  dubai: 16_000_000,
  singapore: 14_000_000,
  kl: 14_000_000,
  tokyo: 13_000_000,
  seoul: 11_000_000,
  osaka: 10_000_000,
  kyoto: 8_000_000,
  taipei: 7_000_000,
  shanghai: 6_000_000,
  hcmc: 5_000_000,
  beijing: 4_000_000,
  delhi: 4_000_000,
  hanoi: 4_000_000,
  chengdu: 3_000_000,
  xian: 3_000_000,
  jakarta: 2_500_000,
  busan: 2_000_000,
  manila: 2_000_000,
  siemreap: 2_000_000,

  // Europe
  london: 19_000_000,
  paris: 17_000_000,
  ist: 16_000_000,
  rome: 10_000_000,
  amsterdam: 9_000_000,
  barcelona: 9_000_000,
  prague: 8_000_000,
  oxford: 7_000_000,
  madrid: 7_000_000,
  vienna: 7_000_000,
  athens: 6_000_000,
  berlin: 6_000_000,
  dublin: 6_000_000,
  vatican: 6_000_000,
  lisbon: 5_000_000,
  venice: 5_000_000,
  budapest: 4_000_000,
  cph: 3_000_000,
  krakow: 3_000_000,
  porto: 2_000_000,
  reykjavik: 2_000_000,
  dubrovnik: 1_300_000,

  // Americas
  nyc: 13_000_000,
  la: 7_000_000,
  miami: 7_000_000,
  cdmx: 6_000_000,
  honolulu: 5_000_000,
  sf: 5_000_000,
  toronto: 5_000_000,
  vegas: 5_000_000,
  lima: 3_000_000,
  montreal: 3_000_000,
  vancouver: 3_000_000,
  bsas: 2_500_000,
  bogota: 2_000_000,
  boston: 2_000_000,
  chicago: 2_000_000,
  dc: 2_000_000,
  rio: 2_000_000,
  santiago: 2_000_000,
  saopaulo: 2_000_000,
  capetown: 1_500_000,
  cusco: 1_500_000,
  seattle: 1_500_000,
  austin: 1_000_000,
  denver: 1_000_000,
  neworleans: 1_000_000,
  philly: 1_000_000,
  minneapolis: 700_000,

  // Africa
  cairo: 3_000_000,
  marra: 3_000_000,
  accra: 1_000_000,
  addis: 1_000_000,
  nairobi: 1_000_000,
  zanzibar: 600_000,

  // Oceania
  sydney: 4_000_000,
  auckland: 2_500_000,
};

export function visitorsPerYear(city: CityId): number | undefined {
  return CITY_VISITORS[city];
}
