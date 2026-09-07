import { requireCity } from "../data/cities";
import { coordsFor } from "../data/coords";
import { MONTHS, seasonIdFor, seasonProfile } from "../data/fares";
import { FEED } from "../data/seed";
import { orderedIds } from "./ranking";
import type { City, CityId, LogState } from "../types";

/**
 * The numbers a city page can put beside your own.
 *
 * Everything here is derived from what the app already holds — your log, the
 * feed, the catalogue — rather than invented. There is no global user base to
 * average, so "what people made of it" means the people you follow, which is
 * the only readership this app has ever claimed to have.
 */

export interface FriendsVerdict {
  count: number;
  /** Their mean rating, unrounded — the caller decides how to print it. */
  average: number;
}

/** What the people you follow made of it, or null when none of them have been. */
export function friendsVerdict(city: CityId): FriendsVerdict | null {
  const been = FEED.filter((item) => item.city === city);
  if (been.length === 0) return null;
  return {
    count: been.length,
    average: been.reduce((sum, item) => sum + item.rating, 0) / been.length,
  };
}

/** The cities immediately either side of it in your ranking. */
export function ratingNeighbours(
  log: LogState,
  city: CityId,
): { better: City | null; worse: City | null } {
  const ordered = orderedIds(log);
  const at = ordered.indexOf(city);
  if (at === -1) return { better: null, worse: null };
  return {
    better: at > 0 ? requireCity(ordered[at - 1]) : null,
    worse: at < ordered.length - 1 ? requireCity(ordered[at + 1]) : null,
  };
}

/**
 * What the rank actually means, in cities rather than in arithmetic.
 *
 * "Ranked against the other cities you gave 4.5 stars" described the mechanism
 * and told you nothing — you already knew what you had given it. The two names
 * either side are the same fact made concrete, and they are the thing the
 * comparison flow went to the trouble of working out.
 *
 * Null when the city is unrated; the page has its own line for that.
 */
export function rankingLine(log: LogState, city: CityId): string | null {
  const ordered = orderedIds(log);
  if (!ordered.includes(city)) return null;
  if (ordered.length === 1) return "The only city you've rated so far.";

  const { better, worse } = ratingNeighbours(log, city);
  if (!better) return `Your highest-rated city, just above ${worse!.name}.`;
  if (!worse) return `The bottom of your list, just below ${better.name}.`;
  return `You put it below ${better.name} and above ${worse.name}.`;
}

/**
 * The month a fare is at its lowest, which is the one piece of the seasonal
 * model that needs no home airport: the shape of the year comes from the
 * city's latitude, and only the amount comes from the distance.
 *
 * Labelled as the cheapest month rather than the best one. The model knows
 * about fares and nothing about weather or crowds, and every northern city
 * gives the same answer — which is honest as "flights are cheapest in
 * February" and a fabrication as "February is when to go".
 */
export function cheapestMonth(city: CityId): string | null {
  const coords = coordsFor(city);
  if (!coords) return null;
  const profile = seasonProfile(seasonIdFor(coords.lat));
  let best = 0;
  for (let month = 1; month < profile.length; month += 1) {
    if (profile[month] < profile[best]) best = month;
  }
  return MONTHS[best];
}
