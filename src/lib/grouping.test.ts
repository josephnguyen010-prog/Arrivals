import { describe, expect, it } from "vitest";
import type { City, Region } from "../types";
import { groupCities, initialOf, regionOf } from "./grouping";

function city(name: string, region: Region = "Europe"): City {
  return {
    id: name.toLowerCase().replace(/\W+/g, "-"),
    name,
    country: "Somewhere",
    region,
    photo: "",
  };
}

describe("initialOf", () => {
  it("files a name under its first letter", () => {
    expect(initialOf(city("Osaka"))).toBe("O");
  });

  it("files an accented name with its unaccented neighbours", () => {
    expect(initialOf(city("Zürich"))).toBe("Z");
    expect(initialOf(city("Ávila"))).toBe("A");
  });

  it("files anything that isn't a letter under #", () => {
    expect(initialOf(city("1000 Islands"))).toBe("#");
  });

  it("ignores leading space rather than making a head out of it", () => {
    expect(initialOf(city("  Lima"))).toBe("L");
  });
});

describe("groupCities", () => {
  it("gives an unheaded order one run and no heads", () => {
    const cities = [city("Lima"), city("Osaka")];
    expect(groupCities(cities, null)).toEqual([{ key: "", cities }]);
  });

  it("has nothing to head when there is nothing in the list", () => {
    expect(groupCities([], null)).toEqual([]);
    expect(groupCities([], initialOf)).toEqual([]);
  });

  it("runs adjacent cities under one head", () => {
    const groups = groupCities(
      [city("Lima"), city("Lisbon"), city("Osaka")],
      initialOf,
    );
    expect(groups.map((group) => group.key)).toEqual(["L", "O"]);
    expect(groups[0].cities).toHaveLength(2);
  });

  /* The caller sorts; this only walks. An unsorted list is meant to come back
     with the same order and a head wherever it changes, not silently bucketed
     into an order nobody asked for. */
  it("never reorders, so a repeated head opens a second run", () => {
    const groups = groupCities(
      [city("Lima"), city("Osaka"), city("Lisbon")],
      initialOf,
    );
    expect(groups.map((group) => group.key)).toEqual(["L", "O", "L"]);
  });

  it("heads a region run with the region's own name", () => {
    const groups = groupCities(
      [city("Lima", "Americas"), city("Osaka", "Asia")],
      regionOf,
    );
    expect(groups.map((group) => group.key)).toEqual(["Americas", "Asia"]);
  });
});
