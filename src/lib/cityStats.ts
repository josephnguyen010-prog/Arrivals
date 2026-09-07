import { coordsFor } from "../data/coords";
import { MONTHS, seasonIdFor, seasonProfile } from "../data/fares";
import { FEED } from "../data/seed";
import type { CityId } from "../types";

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
