import { describe, expect, it } from "vitest";
import {
  carrierCode,
  clockTime,
  duration,
  flightsUrl,
  isStale,
  logoFor,
  parseLiveFlights,
  stopsLabel,
} from "./liveFlights";

/** The shape the serverless function returns, trimmed from SerpApi's own. */
const BODY = {
  flights: [
    {
      airline: "United",
      airlineLogo: "https://example.test/ua.png",
      flightNumber: "UA 401",
      departAirport: "GSO",
      arriveAirport: "HND",
      departTime: "2026-10-12 06:05",
      arriveTime: "2026-10-13 21:40",
      durationMin: 815,
      stops: 1,
      price: 982,
    },
    {
      airline: "Delta",
      airlineLogo: "",
      flightNumber: "DL 288",
      departAirport: "GSO",
      arriveAirport: "HND",
      departTime: "2026-10-12 07:15",
      arriveTime: "2026-10-13 23:20",
      durationMin: 900,
      stops: 2,
      price: 1047,
    },
  ],
  typical: [900, 1300],
  lowest: 982,
  fetchedAt: "2026-09-05T12:00:00.000Z",
};

describe("parseLiveFlights", () => {
  it("reads the flights the function returns", () => {
    const parsed = parseLiveFlights(BODY)!;
    expect(parsed.flights).toHaveLength(2);
    expect(parsed.flights[0].airline).toBe("United");
    expect(parsed.flights[0].price).toBe(982);
    expect(parsed.typical).toEqual([900, 1300]);
    expect(parsed.lowest).toBe(982);
  });

  /**
   * Everything below is the same requirement said different ways: a bad
   * response has to look exactly like no response, because both end at the
   * fallback and neither may put an error in front of a visitor.
   */
  it("returns null for a body that isn't the right shape", () => {
    expect(parseLiveFlights(null)).toBeNull();
    expect(parseLiveFlights("nope")).toBeNull();
    expect(parseLiveFlights({})).toBeNull();
    expect(parseLiveFlights({ flights: "no" })).toBeNull();
  });

  it("returns null rather than an empty list when nothing survives", () => {
    expect(parseLiveFlights({ flights: [] })).toBeNull();
    expect(parseLiveFlights({ flights: [{ airline: "United" }] })).toBeNull();
  });

  it("drops a half-formed flight instead of rendering a blank row", () => {
    const parsed = parseLiveFlights({
      ...BODY,
      flights: [BODY.flights[0], { airline: "", departTime: "", arriveTime: "" }],
    })!;
    expect(parsed.flights).toHaveLength(1);
  });

  it("survives a missing price, logo or duration", () => {
    const parsed = parseLiveFlights({
      flights: [{ ...BODY.flights[0], price: null, airlineLogo: undefined, durationMin: "long" }],
    })!;
    expect(parsed.flights[0].price).toBeNull();
    expect(parsed.flights[0].airlineLogo).toBe("");
    expect(parsed.flights[0].durationMin).toBeNull();
  });

  it("ignores a typical range that isn't two numbers, and orders one that is", () => {
    expect(parseLiveFlights({ ...BODY, typical: [900] })!.typical).toBeNull();
    expect(parseLiveFlights({ ...BODY, typical: ["a", "b"] })!.typical).toBeNull();
    expect(parseLiveFlights({ ...BODY, typical: [1300, 900] })!.typical).toEqual([900, 1300]);
  });

  it("never reports a negative number of stops", () => {
    const parsed = parseLiveFlights({ flights: [{ ...BODY.flights[0], stops: -3 }] })!;
    expect(parsed.flights[0].stops).toBe(0);
  });
});

describe("flightsUrl", () => {
  it("carries the route and both dates", () => {
    const url = new URL(
      flightsUrl({ from: "GSO", to: "HND", depart: "2026-10-12", back: "2026-10-19" }, "https://x.test/api/flights"),
    );
    expect(url.searchParams.get("from")).toBe("GSO");
    expect(url.searchParams.get("to")).toBe("HND");
    expect(url.searchParams.get("depart")).toBe("2026-10-12");
    expect(url.searchParams.get("back")).toBe("2026-10-19");
  });

  it("leaves the return date off a one-way", () => {
    const url = new URL(flightsUrl({ from: "GSO", to: "HND", depart: "2026-10-12" }, "https://x.test/api/flights"));
    expect(url.searchParams.has("back")).toBe(false);
  });
});

describe("clockTime", () => {
  it("reads the upstream stamp as a wall clock", () => {
    expect(clockTime("2026-10-12 06:05")).toBe("6:05am");
    expect(clockTime("2026-10-12 21:40")).toBe("9:40pm");
  });

  it("gets both ends of the day right", () => {
    expect(clockTime("2026-10-12 00:15")).toBe("12:15am");
    expect(clockTime("2026-10-12 12:00")).toBe("12:00pm");
  });

  it("hands back anything it can't read rather than inventing a time", () => {
    expect(clockTime("soon")).toBe("soon");
    expect(clockTime("2026-10-12 33:00")).toBe("2026-10-12 33:00");
  });
});

describe("duration and stops", () => {
  it("writes minutes the way a ticket does", () => {
    expect(duration(815)).toBe("13h 35m");
    expect(duration(120)).toBe("2h");
    expect(duration(45)).toBe("45m");
  });

  it("says nothing when there is no duration", () => {
    expect(duration(null)).toBe("");
    expect(duration(-5)).toBe("");
  });

  it("names the stops", () => {
    expect(stopsLabel(0)).toBe("Non-stop");
    expect(stopsLabel(1)).toBe("1 stop");
    expect(stopsLabel(2)).toBe("2 stops");
  });
});

describe("isStale", () => {
  const at = "2026-09-05T12:00:00.000Z";
  const now = Date.parse(at);

  it("trusts a fresh fetch", () => {
    expect(isStale(at, now + 60 * 60 * 1000)).toBe(false);
  });

  it("stops trusting one a day old", () => {
    expect(isStale(at, now + 25 * 60 * 60 * 1000)).toBe(true);
  });

  it("treats an unreadable timestamp as stale", () => {
    expect(isStale("", now)).toBe(true);
    expect(isStale("whenever", now)).toBe(true);
  });
});

describe("airline marks", () => {
  it("uses the logo the upstream gave, when it gave one", () => {
    expect(logoFor({ airlineLogo: "https://example.test/ua.png", flightNumber: "UA 401" })).toBe(
      "https://example.test/ua.png",
    );
  });

  /** Codeshares and smaller carriers come back with the field empty. */
  it("derives one from the flight number when it didn't", () => {
    expect(logoFor({ airlineLogo: "", flightNumber: "NH 7012" })).toBe(
      "https://www.gstatic.com/flights/airline_logos/70px/NH.png",
    );
  });

  it("asks for nothing rather than a broken URL when there is no code", () => {
    expect(logoFor({ airlineLogo: "", flightNumber: "" })).toBe("");
    expect(logoFor({ airlineLogo: "", flightNumber: "charter" })).toBe("");
  });

  it("reads the carrier off the front of a flight number", () => {
    expect(carrierCode("UA 401")).toBe("UA");
    expect(carrierCode("JL 5")).toBe("JL");
    expect(carrierCode("ua401")).toBe("UA");
  });

  it("handles the codes with a digit in them", () => {
    expect(carrierCode("B6 622")).toBe("B6");
    expect(carrierCode("9W 120")).toBe("9W");
  });

  it("refuses a bare flight number with no carrier on it", () => {
    expect(carrierCode("401")).toBe("");
    expect(carrierCode("12 345")).toBe("");
    expect(carrierCode("")).toBe("");
  });
});
