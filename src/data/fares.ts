import type { Region } from "../types";

/**
 * What a return ticket runs, worked out from distance and the calendar rather
 * than asked of an airline. There is no public Google Flights API to ask —
 * Google retired QPX Express in 2018 and never replaced it — and every service
 * that sells one is a scraper with a monthly quota, behind a key that cannot
 * live in a static bundle. So this estimates, and says so on the pass.
 *
 * The shape it is estimating is real: fare per kilometre falls as the distance
 * grows, because the fixed costs of a departure are shared over more of it.
 * A straight line through the origin would price a transatlantic hop like ten
 * short ones and be wrong by a factor of three.
 */

/** Return economy fares against great-circle distance, interpolated between. */
const FARE_ANCHORS: { km: number; usd: number }[] = [
  { km: 0, usd: 90 },
  { km: 500, usd: 180 },
  { km: 1500, usd: 260 },
  { km: 3000, usd: 330 },
  { km: 5000, usd: 480 },
  { km: 8000, usd: 780 },
  { km: 11000, usd: 1000 },
  { km: 15000, usd: 1300 },
  { km: 20000, usd: 1600 },
];

/**
 * How hard the route is to fly, which is competition rather than distance.
 * Europe is dense with carriers undercutting each other; Africa's long-haul
 * routes are thin and mostly leave one airline setting the price.
 */
const REGION_MARKET: Record<Region, number> = {
  Europe: 0.95,
  Asia: 1,
  Americas: 1,
  Africa: 1.25,
  Oceania: 1.15,
};

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Season is a fact about the destination's latitude, not its continent, which
 * is why this reads the coordinates the flight path already uses instead of
 * another hand-keyed column. Rio and Rome are both `Americas`/`Europe` shaped
 * in the catalogue and have opposite summers.
 *
 * Values are relative, not absolute: `seasonProfile` divides by the mean, so
 * only the shape of each curve matters and a whole row can be retuned without
 * moving the typical fare.
 */
const RAW_SEASONS: Record<SeasonId, number[]> = {
  // July and August, plus the fortnight around Christmas.
  northern: [0.88, 0.85, 0.92, 1.0, 1.05, 1.18, 1.28, 1.24, 1.02, 0.95, 0.88, 1.12],
  // The same curve six months along: January is the southern summer holiday.
  southern: [1.26, 1.18, 1.02, 0.95, 0.88, 0.86, 0.95, 0.92, 0.98, 1.05, 1.12, 1.3],
  // No summer to speak of — the dear months are the dry ones.
  tropical: [1.15, 1.1, 1.02, 0.98, 0.9, 0.88, 0.98, 0.96, 0.86, 0.92, 1.08, 1.22],
};

export type SeasonId = "northern" | "southern" | "tropical";

/** Inside this band of the equator there are wet and dry seasons, not four. */
const TROPICS_DEG = 15;

export function seasonIdFor(lat: number): SeasonId {
  if (Math.abs(lat) < TROPICS_DEG) return "tropical";
  return lat < 0 ? "southern" : "northern";
}

/** The raw row, normalised so an average month costs exactly the typical fare. */
export function seasonProfile(id: SeasonId): number[] {
  const raw = RAW_SEASONS[id];
  const mean = raw.reduce((sum, value) => sum + value, 0) / raw.length;
  return raw.map((value) => value / mean);
}

export interface FareEstimate {
  /** Return economy, in US dollars, averaged across the year. */
  typical: number;
  /** The cheap season and the peak — a real range, not a percentage either side. */
  low: number;
  high: number;
  /** Up to three months at each end, cheapest and dearest first. */
  cheapest: string[];
  peak: string[];
  season: SeasonId;
}

export function fareEstimate(km: number, destLat: number, region: Region): FareEstimate {
  const base = baseFareUsd(km) * REGION_MARKET[region];
  const season = seasonIdFor(destLat);
  const profile = seasonProfile(season);

  const byMonth = profile.map((multiplier) => base * multiplier);
  const ranked = profile
    .map((multiplier, month) => ({ month, multiplier }))
    .sort((a, b) => a.multiplier - b.multiplier);

  return {
    typical: roundToTen(base),
    low: roundToTen(Math.min(...byMonth)),
    high: roundToTen(Math.max(...byMonth)),
    cheapest: ranked.slice(0, 3).map((entry) => MONTHS[entry.month]),
    peak: ranked
      .slice(-3)
      .reverse()
      .map((entry) => MONTHS[entry.month]),
    season,
  };
}

/** Linear between the anchors, flat past the last one — nothing is further. */
export function baseFareUsd(km: number): number {
  const distance = Math.max(0, km);
  const last = FARE_ANCHORS[FARE_ANCHORS.length - 1];
  if (distance >= last.km) return last.usd;

  for (let i = 1; i < FARE_ANCHORS.length; i += 1) {
    const lower = FARE_ANCHORS[i - 1];
    const upper = FARE_ANCHORS[i];
    if (distance <= upper.km) {
      const span = upper.km - lower.km;
      const along = (distance - lower.km) / span;
      return lower.usd + along * (upper.usd - lower.usd);
    }
  }

  return last.usd;
}

function roundToTen(usd: number): number {
  return Math.round(usd / 10) * 10;
}
