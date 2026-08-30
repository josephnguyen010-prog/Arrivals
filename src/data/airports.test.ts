import { describe, expect, it } from "vitest";
import { AIRPORTS, airportByCode, searchAirports } from "./airports";

describe("airports", () => {
  it("gives every airport a unique code", () => {
    const codes = AIRPORTS.map((airport) => airport.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("keeps every coordinate on the globe", () => {
    for (const airport of AIRPORTS) {
      expect(airport.lat, airport.code).toBeGreaterThanOrEqual(-90);
      expect(airport.lat, airport.code).toBeLessThanOrEqual(90);
      expect(airport.lon, airport.code).toBeGreaterThanOrEqual(-180);
      expect(airport.lon, airport.code).toBeLessThanOrEqual(180);
    }
  });

  it("finds an airport by its exact code", () => {
    expect(airportByCode("ROA")?.city).toBe("Roanoke");
  });

  it("covers the Virginia regional cluster", () => {
    for (const code of ["ORF", "RIC", "ROA", "CHO", "LYH", "SHD", "PHF"]) {
      expect(airportByCode(code), code).toBeDefined();
    }
  });

  /**
   * A US airport tagged with the country instead of its state used to be
   * invisible to a state-name search — LAX and SFO didn't turn up for
   * "california" because Sacramento and San Diego had a state and they
   * didn't. Every US entry needs a real state, every non-US entry a country.
   */
  it("never uses the country as a stand-in region for a US airport", () => {
    const placeholders = AIRPORTS.filter((airport) => airport.region === "United States").map((a) => a.code);
    expect(placeholders).toEqual([]);
  });
});

describe("searchAirports", () => {
  it("ranks an exact code match first", () => {
    const [top] = searchAirports("roa");
    expect(top.code).toBe("ROA");
  });

  it("finds a small city by name even without a code", () => {
    const results = searchAirports("charlottesville");
    expect(results.some((airport) => airport.code === "CHO")).toBe(true);
  });

  it("returns nothing for an empty term", () => {
    expect(searchAirports("   ")).toEqual([]);
  });

  it("finds every California airport by state name, hubs included", () => {
    const codes = searchAirports("california").map((airport) => airport.code);
    expect(codes).toEqual(expect.arrayContaining(["LAX", "SFO", "SAN", "SMF"]));
  });
});
