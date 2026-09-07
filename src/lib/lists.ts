import type { CityId, CityList } from "../types";
import { isKnownCity } from "../data/cities";

const KEY = "arrivals.lists.v1";
/** Pre-rename key. Read once so a rename doesn't wipe someone's lists. */
const LEGACY_KEY = "postmark.lists.v1";

/** Lists you made, kept beside the ones from people you follow. */
export function loadMyLists(): CityList[] {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (list): list is CityList =>
          list && typeof list.id === "string" && typeof list.title === "string" && Array.isArray(list.cities),
      )
      // Both screens map these straight to `requireCity`, which throws on an id
      // the catalogue has dropped — and a throw here is the whole app, not the
      // one list.
      .map((list) => {
        const cities = list.cities.filter(isKnownCity);
        return cities.length === list.cities.length ? list : { ...list, cities };
      });
  } catch {
    return [];
  }
}

export function saveMyLists(lists: CityList[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lists));
  } catch {
    // Storage unavailable; the session still works.
  }
}

export function makeList(title: string, blurb: string, cities: CityId[]): CityList {
  return {
    id: `my-${Date.now()}`,
    title: title.trim(),
    blurb: blurb.trim(),
    by: "@joseph",
    cities,
    mine: true,
  };
}
