import type { CityId } from "../types";

/**
 * What a day actually runs: a private room, three meals out, local transit,
 * and one paid thing to do. One traveller, in US dollars, today's rates —
 * a real build would pull this from a cost-of-living index instead of a
 * fixed table, and it would age the way this one will.
 */
export const CITY_DAILY_USD: Record<CityId, number> = {
  amsterdam: 150,
  austin: 140,
  bangkok: 55,
  barcelona: 110,
  berlin: 120,
  boston: 170,
  bsas: 70,
  cairo: 50,
  capetown: 75,
  cdmx: 70,
  chicago: 160,
  cph: 190,
  dc: 180,
  delhi: 45,
  denver: 140,
  hanoi: 45,
  hcmc: 45,
  hongkong: 130,
  honolulu: 190,
  ist: 65,
  kyoto: 110,
  la: 170,
  lisbon: 100,
  london: 190,
  marra: 60,
  miami: 170,
  neworleans: 150,
  nyc: 210,
  osaka: 110,
  paris: 170,
  philly: 150,
  porto: 90,
  prague: 90,
  rio: 80,
  rome: 140,
  seattle: 170,
  seoul: 100,
  sf: 200,
  singapore: 140,
  sydney: 160,
  taipei: 80,
  tokyo: 130,
  toronto: 150,
  vegas: 160,
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
