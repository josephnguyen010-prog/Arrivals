export type CityId = string;

/** The five the board filters by, and the five a passport fills up. */
export type Region = "Asia" | "Europe" | "Americas" | "Africa" | "Oceania";

export interface City {
  id: CityId;
  name: string;
  country: string;
  region: Region;
  photo: string;
}

export interface Visit {
  id: string;
  city: CityId;
  /** Month and year, e.g. "Mar 2026". Visits are day-precision at most. */
  when: string;
  day: string;
  /**
   * Nights away. Optional because every visit logged before the field existed
   * has none, and a trip you can't remember the length of is still a trip —
   * the country totals count what they have rather than refusing to add up.
   */
  nights?: number;
  /** What the trip was like. Yours — the feed's notes belong to other people. */
  note?: string;
}

/**
 * `rated` maps a star rating to the cities given it, ordered best first.
 * Order inside a rating is the preference the comparison flow discovers;
 * the rating itself is what the user chose outright.
 */
export interface LogState {
  rated: Record<string, CityId[]>;
  visits: Visit[];
  /** Departures: cities you mean to reach, newest intention first. */
  wishlist: CityId[];
  /**
   * What you think of the city, as against a visit's note, which is what one
   * trip was like. The same split as the rating: the city is the thing you
   * have an opinion about, the trip is the thing that happened.
   */
  reviews: Record<CityId, string>;
}

export const SPOT_CATEGORIES = [
  "Favourite restaurant",
  "Hidden gem",
  "Must-see view",
  "Skip it",
] as const;

export type SpotCategory = (typeof SPOT_CATEGORIES)[number];

export interface Spot {
  id: string;
  city: CityId;
  category: SpotCategory;
  name: string;
  note?: string;
  /** Already validated as http(s) before it is stored. */
  url?: string;
  /** A downscaled JPEG data URL — the original never reaches storage. */
  photo?: string;
}

/** An in-flight insertion. `lo`/`hi` bracket the slot the city belongs in. */
export interface Placement {
  cityId: CityId;
  rating: number;
  lo: number;
  hi: number;
  asked: number;
}

/**
 * Someone you follow, and a trip they logged. Their note is their review of the
 * city, and it is read-only: it lives on the entry, not on your city page.
 */
export interface FeedItem {
  id: string;
  who: string;
  handle: string;
  city: CityId;
  rating: number;
  /**
   * Dated the same way a visit is, and for the same reason: the two are shown
   * in one column and have to sort against each other. These used to be
   * relative ages — "2d", "5mo" — which could only ever be recent, so every
   * entry a friend wrote sorted above every trip you had taken.
   */
  day: string;
  when: string;
  /** How long they were there. It used to be buried in a tag string. */
  nights: number;
  note: string;
  tags: string[];
}

export interface CityList {
  id: string;
  title: string;
  by: string;
  blurb: string;
  /**
   * Every city in the list. There used to be a `count` beside this holding
   * what the list *claimed*, because the seeded ones named more cities than
   * they stored — so a card read "14 cities" over a page showing five, and the
   * page carried a note apologising for it. The lists are complete now, and a
   * total that can disagree with the thing it counts is worth nobody's time.
   */
  cities: CityId[];
  /** Yours to edit, rather than someone else's to read. */
  mine?: boolean;
}
