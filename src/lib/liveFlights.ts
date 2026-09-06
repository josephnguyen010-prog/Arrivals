/**
 * Real flights, when there is somewhere to ask.
 *
 * The app itself holds no key and talks to no airline: it calls one endpoint,
 * which is a serverless function in the portfolio repo holding a SerpApi key
 * and caching the answer per route for six hours. `VITE_FLIGHTS_API` points at
 * it. Unset — which is the default, and the case for anyone who clones this —
 * `liveFlightsEnabled` is false, nothing is fetched, and the panel shows the
 * modelled fare and plain search links exactly as it did before.
 *
 * Every failure lands in the same place: no flights, no error on screen, the
 * fallback showing. A visitor cannot act on "quota exhausted" and should not be
 * shown it.
 */

export interface LiveFlight {
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departAirport: string;
  arriveAirport: string;
  /** "2026-10-12 06:05" as the upstream gives it — local to each airport. */
  departTime: string;
  arriveTime: string;
  durationMin: number | null;
  stops: number;
  price: number | null;
}

export interface LiveFlights {
  flights: LiveFlight[];
  /** Google's own read on the going rate, when it offers one: [low, high]. */
  typical: [number, number] | null;
  lowest: number | null;
  fetchedAt: string;
}

const ENDPOINT = (import.meta.env?.VITE_FLIGHTS_API ?? "").toString().trim();

export function liveFlightsEnabled(): boolean {
  return ENDPOINT.length > 0;
}

export interface FlightQuery {
  from: string;
  to: string;
  /** ISO yyyy-mm-dd. */
  depart: string;
  back?: string;
}

export function flightsUrl(query: FlightQuery, endpoint = ENDPOINT): string {
  const params = new URLSearchParams({ from: query.from, to: query.to, depart: query.depart });
  if (query.back) params.set("back", query.back);
  return `${endpoint}?${params}`;
}

/**
 * Never throws and never rejects: an unreachable endpoint, a 502 from a spent
 * quota and a body that isn't the shape we expect all mean the same thing to
 * the caller, which is that there is nothing live to show.
 */
export async function fetchLiveFlights(
  query: FlightQuery,
  options: { signal?: AbortSignal; endpoint?: string } = {},
): Promise<LiveFlights | null> {
  const endpoint = options.endpoint ?? ENDPOINT;
  if (!endpoint) return null;

  try {
    const response = await fetch(flightsUrl(query, endpoint), { signal: options.signal });
    if (!response.ok) return null;
    return parseLiveFlights(await response.json());
  } catch {
    return null;
  }
}

/**
 * Pure, so the shape the panel depends on is testable without a network or a
 * key. Anything malformed is dropped rather than rendered half-blank: a row
 * with no airline and no time is worse than one fewer row.
 */
export function parseLiveFlights(body: unknown): LiveFlights | null {
  if (!isRecord(body) || !Array.isArray(body.flights)) return null;

  const flights = body.flights.filter(isRecord).map(toFlight).filter(isFlight);
  if (flights.length === 0) return null;

  return {
    flights,
    typical: toTypical(body.typical),
    lowest: typeof body.lowest === "number" ? body.lowest : null,
    fetchedAt: typeof body.fetchedAt === "string" ? body.fetchedAt : "",
  };
}

function toFlight(raw: Record<string, unknown>): LiveFlight | null {
  const departTime = str(raw.departTime);
  const arriveTime = str(raw.arriveTime);
  const airline = str(raw.airline);
  if (!departTime || !arriveTime || !airline) return null;

  return {
    airline,
    airlineLogo: str(raw.airlineLogo),
    flightNumber: str(raw.flightNumber),
    departAirport: str(raw.departAirport),
    arriveAirport: str(raw.arriveAirport),
    departTime,
    arriveTime,
    durationMin: typeof raw.durationMin === "number" ? raw.durationMin : null,
    stops: typeof raw.stops === "number" && raw.stops >= 0 ? Math.floor(raw.stops) : 0,
    price: typeof raw.price === "number" ? raw.price : null,
  };
}

function toTypical(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const [low, high] = value;
  if (typeof low !== "number" || typeof high !== "number") return null;
  return low <= high ? [low, high] : [high, low];
}

/** "2026-10-12 06:05" → "6:05am". The upstream gives local time at each end. */
export function clockTime(stamp: string): string {
  const match = /(\d{1,2}):(\d{2})\s*$/.exec(stamp);
  if (!match) return stamp;

  const hours24 = Number(match[1]);
  if (!Number.isFinite(hours24) || hours24 > 23) return stamp;

  const suffix = hours24 < 12 ? "am" : "pm";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${match[2]}${suffix}`;
}

/** Minutes to "13h 35m", which is how a duration reads on a ticket. */
export function duration(minutes: number | null): string {
  if (minutes === null || !Number.isFinite(minutes) || minutes < 0) return "";
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

export function stopsLabel(stops: number): string {
  if (stops <= 0) return "Non-stop";
  return stops === 1 ? "1 stop" : `${stops} stops`;
}

/**
 * A day is the point at which the number stops being worth showing as live —
 * the cache is six hours, so anything past this means the function is failing
 * and serving stale-while-revalidate.
 */
export function isStale(fetchedAt: string, now = Date.now()): boolean {
  const at = Date.parse(fetchedAt);
  if (!Number.isFinite(at)) return true;
  return now - at > 24 * 60 * 60 * 1000;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFlight(value: LiveFlight | null): value is LiveFlight {
  return value !== null;
}
