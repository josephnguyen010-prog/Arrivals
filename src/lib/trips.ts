import { REGIONS, CITIES, cityById } from "../data/cities";
import type { LogState, Visit } from "../types";

/**
 * How long a trip was, and how long you have spent somewhere across all of them.
 *
 * A visit's length is optional: the field arrived after the app did, so every
 * trip logged before it has none. Everything here counts what it has rather
 * than refusing to add up — a country with two dated trips and one undated one
 * reports the two and says so, which is more useful than a blank.
 */

/** "1 night", "6 nights". Nights rather than days: it is what you book. */
export function formatNights(nights: number): string {
  if (!Number.isFinite(nights) || nights < 0) return "";
  if (nights === 0) return "day trip";
  return nights === 1 ? "1 night" : `${nights} nights`;
}

/**
 * The same number said the way you'd say it out loud once it gets long — three
 * weeks reads better than 21 nights, and a month better than 30.
 */
export function formatStay(nights: number): string {
  if (!Number.isFinite(nights) || nights < 0) return "";
  if (nights === 0) return "day trip";
  if (nights < 14) return formatNights(nights);
  if (nights < 28) {
    const weeks = Math.round(nights / 7);
    return `${weeks} weeks`;
  }
  const months = Math.round(nights / 30);
  return months === 1 ? "a month" : `${months} months`;
}

export interface CountryStay {
  /** Nights across every trip that recorded one. */
  nights: number;
  /** Trips to this country, counted whether or not they have a length. */
  trips: number;
  /** How many of those never recorded one, so the total can admit to it. */
  undated: number;
}

/** Every visit to a city in this country, totalled. */
export function stayInCountry(log: LogState, country: string): CountryStay {
  return totalStay(log.visits.filter((visit) => cityById(visit.city)?.country === country));
}

/** The same, for one city. */
export function stayInCity(log: LogState, cityId: string): CountryStay {
  return totalStay(log.visits.filter((visit) => visit.city === cityId));
}

function totalStay(visits: Visit[]): CountryStay {
  let nights = 0;
  let undated = 0;

  for (const visit of visits) {
    if (typeof visit.nights === "number" && Number.isFinite(visit.nights) && visit.nights >= 0) {
      nights += visit.nights;
    } else {
      undated += 1;
    }
  }

  return { nights, trips: visits.length, undated };
}

/** Nights across everywhere you have been, for the profile's own line. */
export function totalNights(log: LogState): CountryStay {
  return totalStay(log.visits);
}

/**
 * The countries you have spent the most time in, longest first. Countries with
 * no recorded nights are left out rather than listed at zero — an unmeasured
 * trip is not a short one.
 */
export function longestStays(log: LogState, limit = 5): { country: string; stay: CountryStay }[] {
  const countries = new Set<string>();
  for (const visit of log.visits) {
    const country = cityById(visit.city)?.country;
    if (country) countries.add(country);
  }

  return [...countries]
    .map((country) => ({ country, stay: stayInCountry(log, country) }))
    .filter((row) => row.stay.nights > 0)
    .sort((a, b) => b.stay.nights - a.stay.nights || a.country.localeCompare(b.country))
    .slice(0, limit);
}

/** Countries in a region that this app has a city for — the denominator. */
export function countriesIn(region: string): string[] {
  const names = new Set(CITIES.filter((city) => city.region === region).map((city) => city.country));
  return [...names].sort((a, b) => a.localeCompare(b));
}

export { REGIONS };
