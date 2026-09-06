import { describe, expect, it } from "vitest";
import { nearestAirport } from "./airports";
import { CITIES } from "./cities";
import { coordsFor, greatCircleKm } from "./coords";
import { baseFareUsd, fareEstimate, MONTHS, seasonIdFor, seasonProfile } from "./fares";
import type { Region } from "../types";

/** Seattle — a real home airport, so the distances under test are real ones. */
const SEA = { lat: 47.4502, lon: -122.3088 };

function kmTo(cityId: string): number {
  const coords = coordsFor(cityId);
  if (!coords) throw new Error(`no coordinates for ${cityId}`);
  return greatCircleKm(SEA, coords);
}

describe("baseFareUsd", () => {
  it("costs more the further you go", () => {
    const distances = [200, 800, 2000, 4000, 7000, 10000, 14000, 19000];
    for (let i = 1; i < distances.length; i += 1) {
      expect(baseFareUsd(distances[i]), `${distances[i]}km`).toBeGreaterThan(baseFareUsd(distances[i - 1]));
    }
  });

  /**
   * The property the whole curve exists for. A fare proportional to distance
   * would put a transatlantic return at ten times a short hop; the fixed cost
   * of a departure is shared over the distance, so the rate per kilometre has
   * to fall the further out you look.
   */
  it("charges less per kilometre the further you go", () => {
    const rate = (km: number) => baseFareUsd(km) / km;
    expect(rate(8000)).toBeLessThan(rate(1500));
    expect(rate(15000)).toBeLessThan(rate(8000));
  });

  it("interpolates between the anchors rather than stepping", () => {
    const midpoint = baseFareUsd(4000);
    expect(midpoint).toBeGreaterThan(baseFareUsd(3000));
    expect(midpoint).toBeLessThan(baseFareUsd(5000));
    // 4000km sits halfway between the 3000 and 5000 anchors.
    expect(midpoint).toBeCloseTo((baseFareUsd(3000) + baseFareUsd(5000)) / 2, 5);
  });

  it("flattens past the furthest anchor instead of running away", () => {
    expect(baseFareUsd(30000)).toBe(baseFareUsd(20000));
  });

  it("survives a zero or negative distance", () => {
    expect(baseFareUsd(0)).toBeGreaterThan(0);
    expect(baseFareUsd(-500)).toBe(baseFareUsd(0));
  });
});

describe("seasons", () => {
  it("reads the hemisphere off the latitude", () => {
    expect(seasonIdFor(51.5)).toBe("northern"); // London
    expect(seasonIdFor(-33.9)).toBe("southern"); // Sydney
    expect(seasonIdFor(1.35)).toBe("tropical"); // Singapore
  });

  /**
   * Normalising is what lets the raw rows be retuned by eye: an average month
   * has to cost the typical fare, or every city gets quietly dearer the day
   * someone nudges July.
   */
  it("normalises every profile to an average month of 1", () => {
    for (const id of ["northern", "southern", "tropical"] as const) {
      const profile = seasonProfile(id);
      const mean = profile.reduce((sum, value) => sum + value, 0) / profile.length;
      expect(mean, id).toBeCloseTo(1, 10);
    }
  });

  it("covers all twelve months", () => {
    expect(seasonProfile("northern")).toHaveLength(12);
    expect(MONTHS).toHaveLength(12);
  });

  it("puts the southern peak opposite the northern one", () => {
    const northern = seasonProfile("northern");
    const southern = seasonProfile("southern");
    const dearest = (profile: number[]) => profile.indexOf(Math.max(...profile));
    // July for the north, and the southern summer at the turn of the year.
    expect(MONTHS[dearest(northern)]).toBe("Jul");
    expect(MONTHS[dearest(southern)]).toBe("Dec");
  });
});

describe("fareEstimate", () => {
  const tokyo = () => fareEstimate(kmTo("tokyo"), 35.68, "Asia");

  it("brackets the typical fare between the cheap season and the peak", () => {
    const fare = tokyo();
    expect(fare.low).toBeLessThan(fare.typical);
    expect(fare.high).toBeGreaterThan(fare.typical);
  });

  it("never calls the same month both cheapest and peak", () => {
    const fare = tokyo();
    const overlap = fare.cheapest.filter((month) => fare.peak.includes(month));
    expect(overlap).toEqual([]);
  });

  it("names the months cheapest-first and dearest-first", () => {
    const fare = tokyo();
    expect(fare.cheapest[0]).toBe("Feb");
    expect(fare.peak[0]).toBe("Jul");
  });

  it("charges more for a thin market than a competitive one at the same distance", () => {
    const km = 9000;
    const europe = fareEstimate(km, 48, "Europe");
    const africa = fareEstimate(km, 30, "Africa");
    expect(africa.typical).toBeGreaterThan(europe.typical);
  });

  it("lands a Seattle–Tokyo return in a range a traveller would recognise", () => {
    const fare = tokyo();
    expect(fare.typical).toBeGreaterThan(500);
    expect(fare.typical).toBeLessThan(1100);
  });

  it("lands a Seattle–San Francisco return well under a long haul", () => {
    const shortHop = fareEstimate(kmTo("sf"), 37.77, "Americas");
    expect(shortHop.typical).toBeLessThan(tokyo().typical / 2);
  });

  /** Nothing on the pass may render as a dash, a NaN or a negative number. */
  it("gives every city in the catalogue a usable fare from a real home airport", () => {
    for (const city of CITIES) {
      const coords = coordsFor(city.id);
      expect(coords, city.id).toBeDefined();
      const fare = fareEstimate(greatCircleKm(SEA, coords!), coords!.lat, city.region as Region);
      expect(Number.isFinite(fare.typical), city.id).toBe(true);
      expect(fare.typical, city.id).toBeGreaterThan(0);
      expect(fare.low, city.id).toBeGreaterThan(0);
      expect(fare.cheapest, city.id).toHaveLength(3);
    }
  });
});

describe("nearestAirport", () => {
  /**
   * The pass names the airport you land at, so every city in the catalogue has
   * to resolve to one. This is the test that catches a city added without an
   * airport within reach of it.
   */
  it("finds an arrival airport for every city in the catalogue", () => {
    const stranded = CITIES.filter((city) => {
      const coords = coordsFor(city.id);
      return !coords || !nearestAirport(coords);
    }).map((city) => city.id);
    expect(stranded).toEqual([]);
  });

  it("prefers the gateway over whatever runway happens to be closest", () => {
    // LaGuardia is nearer the middle of New York than JFK and flies almost no
    // long haul; National is nearer Washington than Dulles and flies none.
    expect(nearestAirport(coordsFor("nyc")!)?.code).toBe("JFK");
    expect(nearestAirport(coordsFor("dc")!)?.code).toBe("IAD");
  });

  it("sends Kyoto to Kansai, the way you actually arrive", () => {
    expect(nearestAirport(coordsFor("kyoto")!)?.code).toBe("KIX");
  });

  it("falls back to the nearest airport where there is no gateway", () => {
    expect(nearestAirport(coordsFor("vegas")!)?.code).toBe("LAS");
  });

  it("returns nothing rather than an airport an ocean away", () => {
    expect(nearestAirport({ lat: -49.35, lon: 70.22 })).toBeUndefined();
  });
});
