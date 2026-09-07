import { describe, expect, it } from "vitest";
import { cheapestMonth, friendsVerdict } from "./cityStats";

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
