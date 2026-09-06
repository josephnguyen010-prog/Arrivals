import { airportByCode, nearestAirport } from "../data/airports";
import { coordsFor, greatCircleKm } from "../data/coords";
import { BUDGET_LEVELS, dailyCostFor, type BudgetLevelId } from "../data/costs";
import { fareEstimate } from "../data/fares";
import type { City } from "../types";

/**
 * What the whole thing costs — the flight and the days on the ground, added up.
 *
 * The page worked both halves out and never put them together. It showed a
 * ground total under "Trip cost" and a fare on the boarding pass two hundred
 * pixels away, with an eleven-pixel line admitting the first excluded the
 * second. Which half dominates flips city by city: from Greensboro, Bangkok is
 * $275 on the ground against a $1,260 flight, and New York is $1,050 against
 * $200 — so the headline number was 18% of the truth in one direction and
 * most of it in the other. No amount of small print fixes a number that is
 * wrong by five times.
 */

export interface TripCostBreakdown {
  /** Return economy, or null when there is no home airport to fly from. */
  flights: number | null;
  /** Bed, food, transit and one paid thing a day, times the nights. */
  ground: number;
  /** Both, where both are known. */
  total: number;
  perNight: number;
  /** The airport this priced the flight from, for the label. */
  fromCode: string | null;
  /** Set when the home airport is the city's own — you cannot fly to yourself. */
  alreadyThere: boolean;
  /**
   * The same trip in the cheapest month and at peak. Null without a flight in
   * it: the ground half doesn't move with the season, so there would be no
   * spread to report and a saving of nought is not worth the room.
   */
  season: SeasonSpread | null;
}

export interface SeasonSpread {
  cheapTotal: number;
  peakTotal: number;
  cheapestMonth: string;
  peakMonth: string;
  /** What going in the cheap month rather than the dear one is worth. */
  saving: number;
  /** The fare in each of the twelve months, January first. */
  byMonth: number[];
}

export function tripCost(
  city: City,
  homeAirport: string,
  nights: number,
  budgetId: BudgetLevelId,
): TripCostBreakdown | null {
  const daily = dailyCostFor(city.id);
  if (daily === undefined) return null;

  const level = BUDGET_LEVELS.find((candidate) => candidate.id === budgetId) ?? BUDGET_LEVELS[1];
  const perNight = Math.round(daily * level.multiplier);
  // A night's sleep is what you pay for, but a day trip still costs a day.
  const ground = perNight * Math.max(1, nights);

  const home = homeAirport ? airportByCode(homeAirport) : undefined;
  const coords = coordsFor(city.id);

  if (!home || !coords) {
    return {
      flights: null,
      ground,
      total: ground,
      perNight,
      fromCode: null,
      alreadyThere: false,
      season: null,
    };
  }

  const arrival = nearestAirport(coords);
  if (arrival && arrival.code === home.code) {
    return {
      flights: null,
      ground,
      total: ground,
      perNight,
      fromCode: home.code,
      alreadyThere: true,
      season: null,
    };
  }

  const fare = fareEstimate(greatCircleKm({ lat: home.lat, lon: home.lon }, coords), coords.lat, city.region);

  return {
    flights: fare.typical,
    ground,
    total: fare.typical + ground,
    perNight,
    fromCode: home.code,
    alreadyThere: false,
    // The page names February as the cheapest month and never says what
    // February is worth. This is the number that makes the seasonal model
    // worth having.
    season: {
      cheapTotal: fare.low + ground,
      peakTotal: fare.high + ground,
      cheapestMonth: fare.cheapest[0],
      peakMonth: fare.peak[0],
      saving: fare.high - fare.low,
      byMonth: fare.byMonth,
    },
  };
}
