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
});
