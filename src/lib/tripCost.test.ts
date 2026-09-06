import { describe, expect, it } from "vitest";
import { requireCity } from "../data/cities";
import { tripCost } from "./tripCost";

const lisbon = requireCity("lisbon");
const bangkok = requireCity("bangkok");
const seattle = requireCity("seattle");

describe("tripCost", () => {
  it("adds the flight to the days on the ground", () => {
    const cost = tripCost(lisbon, "GSO", 5, "comfortable")!;
    expect(cost.ground).toBe(cost.perNight * 5);
    expect(cost.total).toBe(cost.flights! + cost.ground);
  });

  /**
   * The reason this function exists. Showing only the ground half was wrong by
   * five times for Bangkok and by a fifth for New York, in opposite directions,
   * so no fixed caveat could have covered it.
   */
  it("is dominated by the flight for a cheap place that is far away", () => {
    const cost = tripCost(bangkok, "GSO", 5, "comfortable")!;
    expect(cost.flights!).toBeGreaterThan(cost.ground * 3);
  });

  it("is dominated by the ground for a dear place that is close", () => {
    const cost = tripCost(requireCity("nyc"), "GSO", 5, "comfortable")!;
    expect(cost.ground).toBeGreaterThan(cost.flights!);
  });

  it("scales the ground cost with the pace", () => {
    const thrifty = tripCost(lisbon, "GSO", 5, "shoestring")!;
    const plush = tripCost(lisbon, "GSO", 5, "splurge")!;
    expect(plush.ground).toBeGreaterThan(thrifty.ground);
    // The flight is the same seat whichever way you live once you land.
    expect(plush.flights).toBe(thrifty.flights);
  });

  it("scales the ground cost with the length, and the flight not at all", () => {
    const short = tripCost(lisbon, "GSO", 3, "comfortable")!;
    const long = tripCost(lisbon, "GSO", 12, "comfortable")!;
    expect(long.ground).toBe(short.perNight * 12);
    expect(long.flights).toBe(short.flights);
  });

  /** Without a home airport there is no route, so the total is the ground half
   *  alone — and says so by leaving `flights` null rather than putting up 0. */
  it("leaves the flight out rather than calling it nothing", () => {
    const cost = tripCost(lisbon, "", 5, "comfortable")!;
    expect(cost.flights).toBeNull();
    expect(cost.total).toBe(cost.ground);
  });

  it("charges no airfare to the city you fly out of", () => {
    const cost = tripCost(seattle, "SEA", 5, "comfortable")!;
    expect(cost.alreadyThere).toBe(true);
    expect(cost.flights).toBeNull();
    expect(cost.total).toBe(cost.ground);
  });

  it("still costs a day when the trip is nought nights", () => {
    const cost = tripCost(lisbon, "GSO", 0, "comfortable")!;
    expect(cost.ground).toBe(cost.perNight);
  });

  it("gives every city in the catalogue a usable total", () => {
    for (const id of ["tokyo", "cairo", "sydney", "rio", "hanoi", "vegas"]) {
      const cost = tripCost(requireCity(id), "GSO", 7, "comfortable")!;
      expect(Number.isFinite(cost.total), id).toBe(true);
      expect(cost.total, id).toBeGreaterThan(0);
    }
  });
});

/**
 * The page named February as the cheapest month and never said what February
 * was worth. These are the invariants that number has to hold to be worth
 * printing beside the total.
 */
describe("the seasonal spread", () => {
  it("brackets the typical total between the cheap season and the peak", () => {
    const cost = tripCost(lisbon, "GSO", 5, "comfortable")!;
    expect(cost.season!.cheapTotal).toBeLessThan(cost.total);
    expect(cost.season!.peakTotal).toBeGreaterThan(cost.total);
  });

  it("is worth what the fare's own spread is worth", () => {
    const cost = tripCost(lisbon, "GSO", 5, "comfortable")!;
    expect(cost.season!.saving).toBe(cost.season!.peakTotal - cost.season!.cheapTotal);
    expect(cost.season!.saving).toBeGreaterThan(0);
  });

  /** Only the flight moves with the season, so the saving is the same however
   *  you live once you land, and however long you stay. */
  it("does not change with the pace or the length", () => {
    const short = tripCost(lisbon, "GSO", 3, "shoestring")!;
    const long = tripCost(lisbon, "GSO", 14, "splurge")!;
    expect(long.season!.saving).toBe(short.season!.saving);
  });

  it("moves the cheap and peak totals with the ground cost", () => {
    const short = tripCost(lisbon, "GSO", 3, "comfortable")!;
    const long = tripCost(lisbon, "GSO", 10, "comfortable")!;
    expect(long.season!.cheapTotal - short.season!.cheapTotal).toBe(long.ground - short.ground);
  });

  it("names a month at each end, and not the same one", () => {
    const cost = tripCost(lisbon, "GSO", 5, "comfortable")!;
    expect(cost.season!.cheapestMonth).toBeTruthy();
    expect(cost.season!.peakMonth).toBeTruthy();
    expect(cost.season!.cheapestMonth).not.toBe(cost.season!.peakMonth);
  });

  /** Nothing to report when there is no flight in the total. */
  it("says nothing without a route", () => {
    expect(tripCost(lisbon, "", 5, "comfortable")!.season).toBeNull();
    expect(tripCost(seattle, "SEA", 5, "comfortable")!.season).toBeNull();
  });

  it("gets the southern hemisphere the right way round", () => {
    const sydney = tripCost(requireCity("sydney"), "GSO", 5, "comfortable")!;
    expect(sydney.season!.cheapestMonth).toBe("Jun");
    expect(sydney.season!.peakMonth).toBe("Dec");
  });
});
