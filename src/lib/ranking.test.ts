import { describe, expect, it } from "vitest";
import type { LogState } from "../types";
import {
  addVisit,
  finishPlacement,
  inDateOrder,
  isWished,
  nextOpponent,
  orderedIds,
  questionsLeft,
  rankOf,
  ratingOf,
  recordAnswer,
  settleEarly,
  startPlacement,
  toggleWish,
  visitOrdinals,
} from "./ranking";

/** Builds a log without repeating the empty fields at every call site. */
function log(partial: Partial<LogState> = {}): LogState {
  return { rated: {}, visits: [], wishlist: [], reviews: {}, ...partial };
}

const empty: LogState = log();

/** Places a city by answering every duel with a fixed preference function. */
function place(
  state: LogState,
  cityId: string,
  rating: number,
  prefersChallenger: (opponent: string) => boolean,
) {
  let { state: next, placement } = startPlacement(state, cityId, rating);
  let opponent = nextOpponent(next, placement);
  while (opponent) {
    placement = recordAnswer(placement, prefersChallenger(opponent));
    opponent = nextOpponent(next, placement);
  }
  return { state: finishPlacement(next, placement), asked: placement.asked };
}

describe("placing a city", () => {
  it("asks nothing when the rating is empty", () => {
    const { state, asked } = place(empty, "tokyo", 5, () => true);
    expect(asked).toBe(0);
    expect(state.rated["5"]).toEqual(["tokyo"]);
  });

  it("puts the challenger on top when it wins every comparison", () => {
    let state = place(empty, "a", 4, () => true).state;
    state = place(state, "b", 4, () => true).state;
    state = place(state, "c", 4, () => true).state;
    expect(state.rated["4"]).toEqual(["c", "b", "a"]);
  });

  it("puts the challenger at the bottom when it loses every comparison", () => {
    let state = place(empty, "a", 4, () => false).state;
    state = place(state, "b", 4, () => false).state;
    state = place(state, "c", 4, () => false).state;
    expect(state.rated["4"]).toEqual(["a", "b", "c"]);
  });

  it("lands a city in the middle when it beats one and loses to another", () => {
    let state: LogState = log({ rated: { "4": ["best", "worst"] } });
    state = place(state, "middle", 4, (opponent) => opponent === "worst").state;
    expect(state.rated["4"]).toEqual(["best", "middle", "worst"]);
  });

  it("never asks more than ceil(log2(n + 1)) questions", () => {
    let state = empty;
    for (let i = 0; i < 15; i++) {
      const { state: next, asked } = place(state, `city${i}`, 3, (opponent) => opponent < `city${i}`);
      expect(asked).toBeLessThanOrEqual(Math.ceil(Math.log2(i + 1)));
      state = next;
    }
    expect(state.rated["3"]).toHaveLength(15);
  });
});

describe("leaving the questions early", () => {
  const state: LogState = log({ rated: { "4": ["best", "middle", "worst"] } });

  it("lands in the middle of the rating when nothing was answered", () => {
    const { state: cleaned, placement } = startPlacement(state, "new", 4);
    const settled = finishPlacement(cleaned, settleEarly(placement));
    expect(settled.rated["4"]).toEqual(["best", "new", "middle", "worst"]);
  });

  it("keeps what the answers so far ruled out", () => {
    const { state: cleaned, placement } = startPlacement(state, "new", 4);
    // Lost to "middle", so it belongs somewhere below it either way.
    const answered = recordAnswer(placement, false);
    const settled = finishPlacement(cleaned, settleEarly(answered));
    expect(settled.rated["4"].indexOf("new")).toBeGreaterThan(settled.rated["4"].indexOf("middle"));
  });

  it("leaves a settled placement where it already is", () => {
    const settled = { cityId: "new", rating: 4, lo: 2, hi: 2, asked: 2 };
    expect(settleEarly(settled)).toEqual(settled);
  });
});

describe("re-rating a city", () => {
  it("moves it out of its old rating rather than duplicating it", () => {
    let state: LogState = log({ rated: { "5": ["tokyo"], "3": ["osaka"] } });
    state = place(state, "tokyo", 3, () => true).state;
    expect(state.rated["5"]).toEqual([]);
    expect(state.rated["3"]).toEqual(["tokyo", "osaka"]);
    expect(orderedIds(state)).toEqual(["tokyo", "osaka"]);
  });

  it("does not compare a city against itself", () => {
    const state: LogState = log({ rated: { "4": ["tokyo"] } });
    const { state: cleaned, placement } = startPlacement(state, "tokyo", 4);
    expect(nextOpponent(cleaned, placement)).toBeNull();
  });
});

describe("reading the ranking", () => {
  const state: LogState = log({ rated: { "5": ["a"], "4.5": ["b", "c"], "2": ["d"] } });

  it("orders by rating first, then by position inside it", () => {
    expect(orderedIds(state)).toEqual(["a", "b", "c", "d"]);
  });

  it("reports rank against every rated city", () => {
    expect(rankOf(state, "c")).toEqual({ pos: 3, total: 4 });
  });

  it("returns the rating a city was given", () => {
    expect(ratingOf(state, "b")).toBe(4.5);
    expect(ratingOf(state, "unrated")).toBeNull();
  });
});

describe("questionsLeft", () => {
  it("is zero once the bracket has closed", () => {
    expect(questionsLeft({ cityId: "x", rating: 4, lo: 2, hi: 2, asked: 3 })).toBe(0);
  });

  it("halves as the bracket narrows", () => {
    expect(questionsLeft({ cityId: "x", rating: 4, lo: 0, hi: 7, asked: 0 })).toBe(3);
    expect(questionsLeft({ cityId: "x", rating: 4, lo: 0, hi: 3, asked: 1 })).toBe(2);
  });
});

describe("Departures", () => {
  it("adds and removes a city", () => {
    let state = toggleWish(empty, "seoul");
    expect(isWished(state, "seoul")).toBe(true);
    state = toggleWish(state, "seoul");
    expect(isWished(state, "seoul")).toBe(false);
  });

  it("puts the newest intention first", () => {
    const state = toggleWish(toggleWish(empty, "seoul"), "porto");
    expect(state.wishlist).toEqual(["porto", "seoul"]);
  });

  it("drops a city off the board once you log a visit to it", () => {
    const state = log({ wishlist: ["seoul", "porto"] });
    const after = addVisit(state, { id: "v1", city: "seoul", when: "Aug 2026", day: "04" });
    expect(after.wishlist).toEqual(["porto"]);
    expect(after.visits).toHaveLength(1);
  });

  it("leaves the board alone when the visit was somewhere else", () => {
    const state = log({ wishlist: ["seoul"] });
    const after = addVisit(state, { id: "v1", city: "tokyo", when: "Aug 2026", day: "04" });
    expect(after.wishlist).toEqual(["seoul"]);
  });
});

describe("visitOrdinals", () => {
  it("numbers repeat visits from the oldest forward", () => {
    const visits = [
      { id: "3", city: "hcmc", when: "Mar 2026", day: "12" },
      { id: "2", city: "tokyo", when: "Apr 2025", day: "01" },
      { id: "1", city: "hcmc", when: "Jan 2023", day: "02" },
    ];
    expect(visitOrdinals(visits)).toEqual({ "1": 1, "2": 1, "3": 2 });
  });
});

/**
 * `addVisit` puts a new visit at the front of the array whatever date it
 * carries. Everything that reads the log for display has to date-order it
 * first, and these are the two places that used to trust storage order.
 */
describe("inDateOrder", () => {
  const jan2026 = { id: "a", city: "tokyo", when: "Jan 2026", day: "06" };
  const mar2026 = { id: "b", city: "hcmc", when: "Mar 2026", day: "12" };
  const dec2019 = { id: "c", city: "bsas", when: "Dec 2019", day: "30" };

  it("puts the newest first however the log was stored", () => {
    // The order addVisit leaves behind after logging the 2019 trip today.
    expect(inDateOrder([dec2019, mar2026, jan2026]).map((v) => v.id)).toEqual(["b", "a", "c"]);
  });

  it("leaves the stored array alone", () => {
    const stored = [dec2019, mar2026];
    inDateOrder(stored);
    expect(stored.map((v) => v.id)).toEqual(["c", "b"]);
  });

  it("sinks a visit whose date cannot be read rather than heading the screen", () => {
    const broken = { id: "x", city: "tokyo", when: "sometime", day: "??" };
    expect(inDateOrder([broken, mar2026]).map((v) => v.id)).toEqual(["b", "x"]);
  });
});

describe("visitOrdinals against stored order", () => {
  it("numbers a city's trips oldest-first whatever order they arrive in", () => {
    const first = { id: "old", city: "hcmc", when: "Jan 2023", day: "02" };
    const second = { id: "new", city: "hcmc", when: "Mar 2026", day: "12" };
    // The 2023 trip logged last, so it sits at the front of the stored array.
    const ordinals = visitOrdinals([first, second]);
    expect(ordinals["old"]).toBe(1);
    expect(ordinals["new"]).toBe(2);
  });
});
