import { describe, expect, it } from "vitest";
import { CITIES } from "./cities";
import { CITY_DAILY_USD, dailyCostFor } from "./costs";

describe("city costs", () => {
  it("covers every city in the catalogue", () => {
    const missing = CITIES.filter((city) => dailyCostFor(city.id) === undefined).map((city) => city.id);
    expect(missing).toEqual([]);
  });

  it("has no entry for a city that doesn't exist", () => {
    const ids = new Set(CITIES.map((city) => city.id));
    const orphans = Object.keys(CITY_DAILY_USD).filter((id) => !ids.has(id));
    expect(orphans).toEqual([]);
  });

  it("gives every city a positive daily rate", () => {
    for (const city of CITIES) {
      expect(dailyCostFor(city.id), city.id).toBeGreaterThan(0);
    }
  });
});
