import type { City } from "../types";

/**
 * Running heads for a sorted grid — the letter or the region a run of cards
 * files under, the way a dictionary prints the page's first word at the top.
 *
 * The point is that a sort is invisible once the list is longer than a screen.
 * "Sorted by name" and "sorted by region" look identical while you are halfway
 * down either one; a head every few rows is what turns an order into an index
 * you can skip through, and it is why the region *filter* stopped earning its
 * place on the board — scrolling to a labelled run does the same work.
 */
export interface CityGroup {
  /** Printed above the run. Empty for an order that has no index — a board in
      the sequence you added things to is a chronology, and "October" is not a
      heading anybody scans for. */
  key: string;
  cities: City[];
}

/**
 * Runs of adjacent cities sharing a head, in the order they arrive. Adjacency
 * rather than a map is the whole contract: the caller has already sorted, and
 * bucketing here would silently reorder a list somebody chose the order of.
 */
export function groupCities(
  cities: City[],
  headOf: ((city: City) => string) | null,
): CityGroup[] {
  if (!headOf) return cities.length ? [{ key: "", cities }] : [];

  const groups: CityGroup[] = [];
  for (const city of cities) {
    const key = headOf(city);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.cities.push(city);
    else groups.push({ key, cities: [city] });
  }
  return groups;
}

/**
 * The letter a name files under. Accents are stripped rather than given their
 * own head, so Zürich sits under Z with Zanzibar instead of starting a section
 * of one at the end of the alphabet; anything left that isn't a letter files
 * under "#", which is where a dictionary's numerals go.
 */
export function initialOf(city: City): string {
  const first = city.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")[0];
  if (!first) return "#";
  const upper = first.toUpperCase();
  return /[A-Z]/.test(upper) ? upper : "#";
}

/** The other head the board offers. A region is already its own label. */
export function regionOf(city: City): string {
  return city.region;
}
