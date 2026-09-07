import type { CityId } from "../types";

/**
 * What a day actually runs: a private room, three meals out, local transit,
 * and one paid thing to do. One traveller, in US dollars, today's rates —
 * a real build would pull this from a cost-of-living index instead of a
 * fixed table, and it would age the way this one will.
 */
export const CITY_DAILY_USD: Record<CityId, number> = {
  accra: 65,
  addis: 55,
  amsterdam: 150,
  annarbor: 110,
  athens: 95,
  austin: 140,
  bangkok: 55,
  barcelona: 110,
  beijing: 80,
  berlin: 120,
  blacksburg: 90,
  bogota: 55,
  boston: 170,
  bsas: 70,
  budapest: 85,
  busan: 75,
  cairo: 50,
  capetown: 75,
  cdmx: 70,
  chengdu: 55,
  chicago: 160,
  cph: 190,
  cusco: 55,
  dc: 180,
  delhi: 45,
  denver: 140,
  dublin: 140,
  hanoi: 45,
  hcmc: 45,
  hongkong: 130,
  honolulu: 190,
  ist: 65,
  jakarta: 50,
  kl: 55,
  krakow: 70,
  kyoto: 110,
  la: 170,
  lima: 60,
  lisbon: 100,
  london: 190,
  madrid: 115,
  manila: 50,
  marra: 60,
  miami: 170,
  minneapolis: 135,
  nairobi: 70,
  neworleans: 150,
  nyc: 210,
  osaka: 110,
  oxford: 130,
  paris: 170,
  philly: 150,
  porto: 90,
  prague: 90,
  reykjavik: 180,
  rio: 80,
  rome: 140,
  santiago: 75,
  saopaulo: 70,
  seattle: 170,
  seoul: 100,
  sf: 200,
  shanghai: 90,
  siemreap: 40,
  singapore: 140,
  sydney: 160,
  taipei: 80,
  tokyo: 130,
  toronto: 150,
  vatican: 150,
  vegas: 160,
  venice: 150,
  vienna: 130,
  xian: 55,
  zanzibar: 60,
};

export function dailyCostFor(id: CityId): number | undefined {
  return CITY_DAILY_USD[id];
}

/**
 * The daily rate above is the middle one. Shoestring skips the sit-down
 * meals and books a bunk; splurge is the trip where the room and the
 * dinner are the point.
 */
export const BUDGET_LEVELS = [
  { id: "shoestring", label: "Shoestring", multiplier: 0.5 },
  { id: "comfortable", label: "Comfortable", multiplier: 1 },
  { id: "splurge", label: "Splurge", multiplier: 2 },
] as const;

export type BudgetLevelId = (typeof BUDGET_LEVELS)[number]["id"];
