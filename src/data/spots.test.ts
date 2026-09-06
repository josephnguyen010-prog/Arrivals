import { describe, expect, it } from "vitest";
import { cityById } from "./cities";
import { SEED_LOG } from "./seed";
import { SEED_SPOTS } from "./spots";
import { SPOT_CATEGORIES } from "../types";

describe("seeded spots", () => {
  /**
   * The check that was missing. A city you have been to, rated, and written a
   * review of, showing an empty Spots section reads as a bug rather than as a
   * blank you are invited to fill — and Osaka, Taipei and Buenos Aires all did
   * exactly that. The catalogue at large is allowed to be empty; the log is not.
   */
  it("gives every city in the seeded log something to show", () => {
    const withSpots = new Set(SEED_SPOTS.map((spot) => spot.city));
    const logged = [...new Set(SEED_LOG.visits.map((visit) => visit.city))];
    const empty = logged.filter((city) => !withSpots.has(city));
    expect(empty).toEqual([]);
  });

  it("only files spots against cities that exist", () => {
    const orphans = SEED_SPOTS.filter((spot) => !cityById(spot.city)).map((spot) => spot.city);
    expect(orphans).toEqual([]);
  });

  it("uses only the categories the app knows", () => {
    const unknown = SEED_SPOTS.filter((spot) => !SPOT_CATEGORIES.includes(spot.category));
    expect(unknown).toEqual([]);
  });

  it("gives every spot a unique id", () => {
    const ids = SEED_SPOTS.map((spot) => spot.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  /** Links are rendered into an href, so nothing but http(s) may reach one. */
  it("only ever links out over https", () => {
    for (const spot of SEED_SPOTS) {
      if (!spot.url) continue;
      expect(new URL(spot.url).protocol, spot.name).toBe("https:");
    }
  });

  it("says something about every spot it lists", () => {
    for (const spot of SEED_SPOTS) {
      expect(spot.name.trim().length, spot.id).toBeGreaterThan(0);
      // `note` is optional on the type; every seeded one is expected to have it.
      expect((spot.note ?? "").trim().length, spot.name).toBeGreaterThan(0);
    }
  });
});
