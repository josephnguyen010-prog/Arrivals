import { describe, expect, it } from "vitest";
import { cheapestMonth, friendsVerdict, rankingLine, ratingNeighbours } from "./cityStats";
import { SEED_LOG } from "../data/seed";
import type { LogState } from "../types";

const EMPTY: LogState = { rated: {}, visits: [], wishlist: [], reviews: {} };
const only = (id: string): LogState => ({ ...EMPTY, rated: { "4": [id] } });

describe("friendsVerdict", () => {
  it("averages the people you follow who have been", () => {
    // Tokyo is the one city two of them logged.
    expect(friendsVerdict("tokyo")).toEqual({ count: 2, average: 4.25 });
  });

  it("reports a single write-up as one person", () => {
    expect(friendsVerdict("nyc")).toEqual({ count: 1, average: 4.5 });
  });

  it("is null where none of them have been", () => {
    expect(friendsVerdict("denver")).toBeNull();
  });
});

describe("ratingNeighbours", () => {
  it("gives the cities either side in your ranking", () => {
    const { better, worse } = ratingNeighbours(SEED_LOG, "tokyo");
    expect(better?.id).toBe("hcmc");
    expect(worse?.id).toBe("ist");
  });

  it("has nothing above your top city", () => {
    expect(ratingNeighbours(SEED_LOG, "hcmc").better).toBeNull();
  });

  it("has nothing below your last", () => {
    expect(ratingNeighbours(SEED_LOG, "cdmx").worse).toBeNull();
  });
});

describe("rankingLine", () => {
  it("names both neighbours in the middle of the list", () => {
    expect(rankingLine(SEED_LOG, "tokyo")).toBe(
      "You put it below Ho Chi Minh City and above Istanbul.",
    );
  });

  it("says so at the top", () => {
    expect(rankingLine(SEED_LOG, "hcmc")).toBe("Your highest-rated city, just above Tokyo.");
  });

  it("says so at the bottom", () => {
    expect(rankingLine(SEED_LOG, "cdmx")).toBe(
      "The bottom of your list, just below Buenos Aires.",
    );
  });

  it("handles the very first city you rate", () => {
    expect(rankingLine(only("tokyo"), "tokyo")).toBe("The only city you've rated so far.");
  });

  it("is null for a city you haven't rated", () => {
    expect(rankingLine(SEED_LOG, "denver")).toBeNull();
  });
});

/**
 * The month a fare bottoms out. Latitude decides the shape of the year, so
 * this needs no home airport — and it is deliberately not called the best
 * month, because the model knows nothing about weather or crowds.
 */
describe("cheapestMonth", () => {
  it("gives a northern city a northern low season", () => {
    expect(cheapestMonth("tokyo")).toBe("Feb");
    expect(cheapestMonth("london")).toBe("Feb");
  });

  it("flips for the southern hemisphere", () => {
    expect(cheapestMonth("sydney")).toBe("Jun");
  });

  it("is null for a city the catalogue has no coordinates for", () => {
    expect(cheapestMonth("atlantis")).toBeNull();
  });
});
