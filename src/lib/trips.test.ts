import { describe, expect, it } from "vitest";
import { dateOf, daysAgo } from "./dates";
import { formatNights, formatStay, longestStays, stayInCity, stayInCountry, totalNights } from "./trips";
import type { LogState, Visit } from "../types";

function logOf(visits: Visit[]): LogState {
  return { rated: {}, visits, wishlist: [], reviews: {} };
}

describe("dateOf", () => {
  it("reads the two parts a visit stores", () => {
    expect(dateOf("12", "Mar 2026")).toEqual(new Date(2026, 2, 12));
  });

  it("refuses anything it can't read rather than returning an invalid Date", () => {
    expect(dateOf("12", "Smarch 2026")).toBeNull();
    expect(dateOf("12", "Mar")).toBeNull();
    expect(dateOf("0", "Mar 2026")).toBeNull();
    expect(dateOf("32", "Mar 2026")).toBeNull();
    expect(dateOf("", "")).toBeNull();
  });
});

describe("daysAgo", () => {
  const now = new Date(2026, 8, 5).getTime();

  it("counts back to the day", () => {
    expect(daysAgo("01", "Sep 2026", now)).toBe(4);
    expect(daysAgo("05", "Aug 2026", now)).toBe(31);
  });

  /**
   * The whole reason the feed moved off relative ages. Anything unreadable has
   * to sink to the bottom, never float to the top where it would head the
   * screen.
   */
  it("sinks an unreadable date instead of floating it", () => {
    expect(daysAgo("", "whenever", now)).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe("formatNights and formatStay", () => {
  it("counts nights, not days", () => {
    expect(formatNights(1)).toBe("1 night");
    expect(formatNights(6)).toBe("6 nights");
    expect(formatNights(0)).toBe("day trip");
  });

  it("says a long stay the way a person would", () => {
    expect(formatStay(6)).toBe("6 nights");
    expect(formatStay(14)).toBe("2 weeks");
    expect(formatStay(21)).toBe("3 weeks");
    expect(formatStay(30)).toBe("a month");
    expect(formatStay(60)).toBe("2 months");
  });

  it("says nothing for a length that isn't one", () => {
    expect(formatNights(-1)).toBe("");
    expect(formatStay(Number.NaN)).toBe("");
  });
});

describe("stayInCountry", () => {
  const log = logOf([
    { id: "a", city: "tokyo", when: "Jan 2026", day: "06", nights: 9 },
    { id: "b", city: "osaka", when: "Apr 2025", day: "03", nights: 4 },
    { id: "c", city: "kyoto", when: "May 2024", day: "01" }, // logged before the field existed
    { id: "d", city: "lisbon", when: "Feb 2026", day: "28", nights: 6 },
  ]);

  it("totals every city in the country", () => {
    expect(stayInCountry(log, "Japan")).toEqual({ nights: 13, trips: 3, undated: 1 });
  });

  /** The point of `undated`: the total is honest about what it couldn't count. */
  it("counts the trips it couldn't measure rather than dropping them", () => {
    expect(stayInCountry(log, "Japan").trips).toBe(3);
    expect(stayInCountry(log, "Japan").undated).toBe(1);
  });

  it("knows a country with nothing in it", () => {
    expect(stayInCountry(log, "Peru")).toEqual({ nights: 0, trips: 0, undated: 0 });
  });

  it("totals one city on its own", () => {
    expect(stayInCity(log, "tokyo")).toEqual({ nights: 9, trips: 1, undated: 0 });
  });

  it("totals everywhere", () => {
    expect(totalNights(log)).toEqual({ nights: 19, trips: 4, undated: 1 });
  });
});

describe("longestStays", () => {
  const log = logOf([
    { id: "a", city: "tokyo", when: "Jan 2026", day: "06", nights: 9 },
    { id: "b", city: "osaka", when: "Apr 2025", day: "03", nights: 4 },
    { id: "c", city: "lisbon", when: "Feb 2026", day: "28", nights: 6 },
    { id: "d", city: "cdmx", when: "May 2023", day: "17", nights: 21 },
  ]);

  it("ranks countries by time spent", () => {
    expect(longestStays(log).map((row) => row.country)).toEqual(["Mexico", "Japan", "Portugal"]);
  });

  /** An unmeasured trip is not a short one, so it doesn't rank at zero. */
  it("leaves out a country whose trips were never measured", () => {
    const withUndated = logOf([{ id: "x", city: "bsas", when: "Dec 2019", day: "30" }]);
    expect(longestStays(withUndated)).toEqual([]);
  });

  it("honours the limit", () => {
    expect(longestStays(log, 2)).toHaveLength(2);
  });
});
