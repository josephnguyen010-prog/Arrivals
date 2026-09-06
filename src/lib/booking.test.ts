import { describe, expect, it } from "vitest";
import { bookingLinks, googleFlightsUrl, isoDate, kayakUrl, skyscannerUrl, type Trip } from "./booking";

const RETURN: Trip = {
  from: "GSO",
  to: "HND",
  depart: new Date(2026, 9, 12), // 12 Oct 2026
  back: new Date(2026, 9, 19),
};

const ONE_WAY: Trip = { from: "GSO", to: "HND", depart: new Date(2026, 9, 12) };

describe("isoDate", () => {
  it("writes a local date without shifting it", () => {
    expect(isoDate(new Date(2026, 9, 12))).toBe("2026-10-12");
  });

  it("pads single-digit months and days", () => {
    expect(isoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  /**
   * The reason this isn't `toISOString().slice(0, 10)`. A date built at local
   * midnight west of Greenwich converts to the previous day in UTC, so half
   * the world would book a flight for the day before the one they picked.
   */
  it("keeps the day the user actually clicked, whatever the timezone", () => {
    const midnight = new Date(2026, 0, 1); // 1 Jan, local
    expect(isoDate(midnight)).toBe("2026-01-01");
  });
});

describe("googleFlightsUrl", () => {
  it("spells the trip out as a search query", () => {
    const url = new URL(googleFlightsUrl(RETURN));
    expect(url.origin + url.pathname).toBe("https://www.google.com/travel/flights");
    expect(url.searchParams.get("q")).toBe("Flights from GSO to HND on 2026-10-12 through 2026-10-19");
  });

  it("leaves the return leg out of a one-way", () => {
    const q = new URL(googleFlightsUrl(ONE_WAY)).searchParams.get("q")!;
    expect(q).toBe("Flights from GSO to HND on 2026-10-12");
    expect(q).not.toContain("through");
  });

  it("escapes the query rather than pasting spaces into a URL", () => {
    expect(googleFlightsUrl(ONE_WAY)).not.toContain(" ");
  });
});

describe("skyscannerUrl", () => {
  it("uses lowercase codes and yymmdd stamps", () => {
    expect(skyscannerUrl(RETURN)).toBe("https://www.skyscanner.net/transport/flights/gso/hnd/261012/261019/");
  });

  it("drops the second stamp for a one-way", () => {
    expect(skyscannerUrl(ONE_WAY)).toBe("https://www.skyscanner.net/transport/flights/gso/hnd/261012/");
  });
});

describe("kayakUrl", () => {
  it("uses uppercase codes and ISO dates", () => {
    expect(kayakUrl(RETURN)).toBe("https://www.kayak.com/flights/GSO-HND/2026-10-12/2026-10-19");
  });

  it("drops the second date for a one-way", () => {
    expect(kayakUrl(ONE_WAY)).toBe("https://www.kayak.com/flights/GSO-HND/2026-10-12");
  });
});

describe("bookingLinks", () => {
  it("offers Google first, then the two comparison sites", () => {
    expect(bookingLinks(RETURN).map((link) => link.id)).toEqual(["google", "skyscanner", "kayak"]);
  });

  /** Every one of these opens in a new tab, so every one has to be https. */
  it("only ever builds https links", () => {
    for (const link of bookingLinks(RETURN)) {
      expect(new URL(link.url).protocol, link.id).toBe("https:");
    }
  });

  it("carries both airports into every link", () => {
    for (const link of bookingLinks(RETURN)) {
      expect(link.url.toUpperCase(), link.id).toContain("GSO");
      expect(link.url.toUpperCase(), link.id).toContain("HND");
    }
  });
});
