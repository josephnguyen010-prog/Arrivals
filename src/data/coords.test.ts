import { describe, expect, it } from "vitest";
import { CITIES } from "./cities";
import { CITY_COORDS, coordsFor, flightHoursFor, greatCircleKm } from "./coords";

describe("city coords", () => {
  it("covers every city in the catalogue", () => {
    const missing = CITIES.filter((city) => !coordsFor(city.id)).map((city) => city.id);
    expect(missing).toEqual([]);
  });

  it("has no entry for a city that doesn't exist", () => {
    const ids = new Set(CITIES.map((city) => city.id));
    const orphans = Object.keys(CITY_COORDS).filter((id) => !ids.has(id));
    expect(orphans).toEqual([]);
  });

  it("keeps every coordinate on the globe", () => {
    for (const city of CITIES) {
      const coords = coordsFor(city.id)!;
      expect(coords.lat, city.id).toBeGreaterThanOrEqual(-90);
      expect(coords.lat, city.id).toBeLessThanOrEqual(90);
      expect(coords.lon, city.id).toBeGreaterThanOrEqual(-180);
      expect(coords.lon, city.id).toBeLessThanOrEqual(180);
    }
  });
});

describe("greatCircleKm", () => {
  it("is zero for the same point", () => {
    const point = coordsFor("paris")!;
    expect(greatCircleKm(point, point)).toBeCloseTo(0, 6);
  });

  it("matches the known Paris-Tokyo distance to within 2%", () => {
    const km = greatCircleKm(coordsFor("paris")!, coordsFor("tokyo")!);
    expect(km).toBeGreaterThan(9700 * 0.98);
    expect(km).toBeLessThan(9700 * 1.02);
  });
});

describe("flightHoursFor", () => {
  it("grows with distance", () => {
    expect(flightHoursFor(1000)).toBeLessThan(flightHoursFor(5000));
  });

  it("is always at least the ground overhead", () => {
    expect(flightHoursFor(0)).toBeCloseTo(0.75, 6);
  });
});
