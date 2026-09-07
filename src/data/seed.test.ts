import { describe, expect, it } from "vitest";
import { CITIES, cityById } from "./cities";
import { FEED, LISTS, SEED_LOG } from "./seed";

/**
 * The lists used to carry a `count` that named more cities than they stored,
 * so a card read "14 cities" over a page showing five. There is no count any
 * more — the cities are the count — but they still have to be real ones.
 */
describe("seeded lists", () => {
  it("names only cities the catalogue has", () => {
    const unknown = LISTS.flatMap((list) =>
      list.cities.filter((id) => !cityById(id)).map((id) => `${list.title}: ${id}`),
    );
    expect(unknown).toEqual([]);
  });

  it("does not name the same city twice in one list", () => {
    for (const list of LISTS) {
      expect(new Set(list.cities).size, list.title).toBe(list.cities.length);
    }
  });

  it("gives every list something to show", () => {
    for (const list of LISTS) {
      expect(list.cities.length, list.title).toBeGreaterThan(0);
      expect(list.title.length, list.id).toBeGreaterThan(0);
      expect(list.by.startsWith("@"), list.title).toBe(true);
    }
  });

  it("has no two lists sharing an id", () => {
    expect(new Set(LISTS.map((list) => list.id)).size).toBe(LISTS.length);
  });
});

describe("seeded log and feed", () => {
  it("logs visits only to cities that exist", () => {
    const unknown = SEED_LOG.visits.filter((visit) => !cityById(visit.city)).map((v) => v.city);
    expect(unknown).toEqual([]);
  });

  it("rates only cities that exist", () => {
    const unknown = Object.values(SEED_LOG.rated)
      .flat()
      .filter((id) => !cityById(id));
    expect(unknown).toEqual([]);
  });

  it("wishes for and reviews only cities that exist", () => {
    expect(SEED_LOG.wishlist.filter((id) => !cityById(id))).toEqual([]);
    expect(Object.keys(SEED_LOG.reviews).filter((id) => !cityById(id))).toEqual([]);
  });

  it("writes up only cities that exist, under unique ids", () => {
    expect(FEED.filter((item) => !cityById(item.city)).map((i) => i.city)).toEqual([]);
    expect(new Set(FEED.map((item) => item.id)).size).toBe(FEED.length);
  });

  it("does not rate a city it never visited", () => {
    // The two go together: a rating comes out of a trip, which is the rule the
    // stars are gated on. A seeded account that broke it would look like a bug.
    const visited = new Set(SEED_LOG.visits.map((visit) => visit.city));
    const rated = Object.values(SEED_LOG.rated).flat();
    expect(rated.filter((id) => !visited.has(id))).toEqual([]);
  });

  it("keeps the catalogue itself free of duplicate ids", () => {
    expect(new Set(CITIES.map((city) => city.id)).size).toBe(CITIES.length);
  });
});

/**
 * The catalogue list is derived from CITIES rather than written out, because a
 * hand-kept copy of the catalogue is exactly the drift the lists' old `count`
 * field used to cause. These guard that it stays derived.
 */
describe("the catalogue list", () => {
  it("carries every city in the catalogue, once each", async () => {
    const { CATALOGUE } = await import("../state/ListsContext");
    expect(CATALOGUE.cities).toHaveLength(CITIES.length);
    expect(new Set(CATALOGUE.cities).size).toBe(CITIES.length);
    expect([...CATALOGUE.cities].sort()).toEqual(CITIES.map((c) => c.id).sort());
  });

  it("is in alphabetical order by city name", async () => {
    const { CATALOGUE } = await import("../state/ListsContext");
    const names = CATALOGUE.cities.map((id) => cityById(id)!.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("does not collide with a seeded list's id", async () => {
    const { CATALOGUE } = await import("../state/ListsContext");
    expect(LISTS.map((list) => list.id)).not.toContain(CATALOGUE.id);
  });
});
