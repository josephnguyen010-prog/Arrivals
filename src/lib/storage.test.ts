import { beforeEach, describe, expect, it } from "vitest";
import { loadLog } from "./storage";
import { SEED_LOG } from "../data/seed";
import type { LogState } from "../types";

/** Enough of the real thing for the loader, which only gets and sets. */
function stubStorage(): void {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key),
    },
  });
}

function write(log: unknown): void {
  localStorage.setItem("arrivals.log.v1", JSON.stringify(log));
  // Both backfills have had their chance, so the seed can't be merged back in
  // and confuse what the loader is being asked about here.
  localStorage.setItem("arrivals.reviews.backfilled", "1");
  localStorage.setItem("arrivals.nights.backfilled", "1");
}

const BASE: LogState = { rated: {}, visits: [], wishlist: [], reviews: {} };

describe("loadLog", () => {
  beforeEach(stubStorage);

  it("returns the seed when there is nothing saved", () => {
    expect(loadLog()).toEqual(SEED_LOG);
  });

  it("keeps a log whose cities all still exist", () => {
    const log: LogState = {
      rated: { "5": ["tokyo"], "4": ["lisbon"] },
      visits: [{ id: "v1", city: "tokyo", when: "Mar 2026", day: "04", nights: 6 }],
      wishlist: ["porto"],
      reviews: { tokyo: "Go in November." },
    };
    write(log);
    expect(loadLog()).toEqual(log);
  });

  /* The bug this guards: a saved id outlives the catalogue that produced it,
     and every screen hands what it finds to `requireCity`, which throws. */
  it("drops a rated city the catalogue no longer carries", () => {
    write({ ...BASE, rated: { "5": ["tokyo", "atlantis"], "4": ["nowhere"] } });
    expect(loadLog().rated).toEqual({ "5": ["tokyo"], "4": [] });
  });

  it("drops a visit to a city that has gone", () => {
    write({
      ...BASE,
      visits: [
        { id: "v1", city: "atlantis", when: "Mar 2026", day: "04" },
        { id: "v2", city: "tokyo", when: "Mar 2026", day: "05" },
      ],
    });
    expect(loadLog().visits.map((visit) => visit.id)).toEqual(["v2"]);
  });

  it("drops a wishlist entry that has gone", () => {
    write({ ...BASE, wishlist: ["atlantis", "porto"] });
    expect(loadLog().wishlist).toEqual(["porto"]);
  });

  it("drops a review of a city that has gone", () => {
    write({ ...BASE, reviews: { atlantis: "Sank.", porto: "Cheap and steep." } });
    expect(loadLog().reviews).toEqual({ porto: "Cheap and steep." });
  });

  it("survives a rated map holding something that isn't a list", () => {
    write({ ...BASE, rated: { "5": "tokyo", "4": ["lisbon"] } });
    expect(loadLog().rated).toEqual({ "4": ["lisbon"] });
  });

  it("falls back to the seed on corrupt json", () => {
    localStorage.setItem("arrivals.log.v1", "{not json");
    expect(loadLog()).toEqual(SEED_LOG);
  });

  it("reads the pre-rename key when the current one is empty", () => {
    localStorage.setItem("postmark.log.v1", JSON.stringify({ ...BASE, wishlist: ["porto"] }));
    localStorage.setItem("arrivals.reviews.backfilled", "1");
    localStorage.setItem("arrivals.nights.backfilled", "1");
    expect(loadLog().wishlist).toEqual(["porto"]);
  });
});
