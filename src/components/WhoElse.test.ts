import { describe, expect, it } from "vitest";
import { anyoneBeen, entriesFor } from "./WhoElse";
import { FEED } from "../data/seed";
import { daysAgo } from "../lib/dates";

describe("anyoneBeen", () => {
  it("is true when somebody you follow has been", () => {
    expect(anyoneBeen("nyc")).toBe(true);
  });

  it("is false for a city nobody you follow has logged", () => {
    expect(anyoneBeen("denver")).toBe(false);
  });
});

/**
 * On a friend's write-up this pane *is* the write-up — it is the only place
 * their words are printed on that screen — so their row has to come first and
 * be the one rendered in full.
 */
describe("entriesFor", () => {
  it("puts whoever's page it is at the top", () => {
    const [, second] = entriesFor("tokyo");
    expect(second, "tokyo is the two-entry case this rests on").toBeDefined();
    expect(entriesFor("tokyo", second.id)[0].id).toBe(second.id);
  });

  it("leaves the rest newest first behind them", () => {
    const ordered = entriesFor("tokyo", entriesFor("tokyo")[1].id);
    const rest = ordered.slice(1);
    const ages = rest.map((item) => daysAgo(item.day, item.when));
    expect([...ages].sort((a, b) => a - b)).toEqual(ages);
  });

  it("keeps everyone, including the page you are on", () => {
    expect(entriesFor("tokyo", "f6")).toHaveLength(2);
    expect(entriesFor("nyc", "f12").map((item) => item.id)).toEqual(["f12"]);
  });

  it("is the plain newest-first order when no page is named", () => {
    const ids = entriesFor("tokyo").map((item) => item.id);
    const expected = FEED.filter((item) => item.city === "tokyo")
      .sort((a, b) => daysAgo(a.day, a.when) - daysAgo(b.day, b.when))
      .map((item) => item.id);
    expect(ids).toEqual(expected);
  });
});
