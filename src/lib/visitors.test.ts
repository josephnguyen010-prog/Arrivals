import { describe, expect, it } from "vitest";
import { formatCount, msPerVisitor, visitorsSoFar, yearProgress } from "./visitors";
import { CITY_VISITORS, visitorsPerYear } from "../data/visitors";
import { CITIES, cityById } from "../data/cities";

describe("yearProgress", () => {
  it("is nought at the first instant of the year", () => {
    expect(yearProgress(new Date(2026, 0, 1, 0, 0, 0))).toBe(0);
  });

  it("is about a half at midsummer", () => {
    expect(yearProgress(new Date(2026, 6, 2))).toBeCloseTo(0.5, 1);
  });

  it("never quite reaches one, and never passes it", () => {
    const last = yearProgress(new Date(2026, 11, 31, 23, 59, 59));
    expect(last).toBeLessThan(1);
    expect(last).toBeGreaterThan(0.999);
  });

  it("handles a leap year without drifting", () => {
    expect(yearProgress(new Date(2028, 6, 2))).toBeCloseTo(0.5, 1);
  });
});

describe("visitorsSoFar", () => {
  it("is nought on new year's morning", () => {
    expect(visitorsSoFar(22_000_000, new Date(2026, 0, 1))).toBe(0);
  });

  it("is about half the year's total at midsummer", () => {
    const half = visitorsSoFar(22_000_000, new Date(2026, 6, 2));
    expect(half).toBeGreaterThan(10_700_000);
    expect(half).toBeLessThan(11_300_000);
  });

  it("never exceeds the annual figure", () => {
    expect(visitorsSoFar(1_000_000, new Date(2026, 11, 31, 23, 59))).toBeLessThanOrEqual(1_000_000);
  });

  it("only ever climbs", () => {
    const march = visitorsSoFar(5_000_000, new Date(2026, 2, 1));
    const june = visitorsSoFar(5_000_000, new Date(2026, 5, 1));
    expect(june).toBeGreaterThan(march);
  });

  it("floors rather than rounds, so it never shows a number it has not reached", () => {
    expect(Number.isInteger(visitorsSoFar(22_000_000, new Date(2026, 4, 17, 3, 21)))).toBe(true);
  });

  it("copes with nonsense instead of rendering NaN", () => {
    expect(visitorsSoFar(0, new Date(2026, 5, 1))).toBe(0);
    expect(visitorsSoFar(-5, new Date(2026, 5, 1))).toBe(0);
    expect(visitorsSoFar(Number.NaN, new Date(2026, 5, 1))).toBe(0);
  });
});

describe("msPerVisitor", () => {
  it("gives the busiest city roughly one a second", () => {
    expect(msPerVisitor(26_000_000)).toBeGreaterThan(900);
    expect(msPerVisitor(26_000_000)).toBeLessThan(1400);
  });

  it("gives the quietest one a long wait, and says so honestly", () => {
    expect(msPerVisitor(600_000)).toBeGreaterThan(45_000);
  });

  it("is infinite for a city with no figure, so nothing schedules a tick", () => {
    expect(msPerVisitor(0)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("formatCount", () => {
  it("groups the digits", () => {
    expect(formatCount(12481903)).toBe("12,481,903");
  });

  it("never shows a negative or a fraction", () => {
    expect(formatCount(-4)).toBe("0");
    expect(formatCount(1999.7)).toBe("1,999");
  });
});

describe("the visitor table", () => {
  it("has no entry for a city that doesn't exist", () => {
    expect(Object.keys(CITY_VISITORS).filter((id) => !cityById(id))).toEqual([]);
  });

  it("gives every figure it does carry a positive, rounded value", () => {
    for (const [id, n] of Object.entries(CITY_VISITORS)) {
      expect(n, id).toBeGreaterThan(0);
      // Rounded to at least the nearest hundred thousand: the sources are not
      // precise enough to justify anything finer.
      expect(n! % 100_000, id).toBe(0);
    }
  });

  it("covers all but the two college towns nobody publishes a count for", () => {
    const missing = CITIES.filter((c) => visitorsPerYear(c.id) === undefined).map((c) => c.id);
    expect(missing.sort()).toEqual(["annarbor", "blacksburg"]);
  });
});
