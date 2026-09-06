/**
 * Where you go to actually buy the thing.
 *
 * Arrivals does not sell tickets and should not pretend to. Letterboxd doesn't
 * sell you a film either — it hands you off to whoever is streaming it — and
 * that is the right shape here: the reviews are the product, the booking is
 * somebody else's. So this builds search URLs rather than calling an API.
 *
 * The upside over a fare feed is not just that it's free. A link is *live*:
 * whoever the user lands on is quoting seats they will actually sell, today,
 * which no cached API response can promise. There is nothing here to go stale,
 * no key to leak and no quota to exhaust.
 *
 * All three take a plain, documented URL shape — the same reasoning as the spot
 * links, which use Google's Maps search URL rather than an invented place id
 * that would rot.
 */

export interface Trip {
  /** IATA code, e.g. "GSO". */
  from: string;
  to: string;
  depart: Date;
  /** Undefined for a one-way. */
  back?: Date;
}

export interface BookingLink {
  id: string;
  label: string;
  url: string;
}

/** ISO yyyy-mm-dd in local time — `toISOString` would shift the day in half the world. */
export function isoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Google Flights takes a free-text query, which is the only entry point it
 * documents. Spelling the dates out in ISO keeps it out of the argument about
 * whether 8/12 is August or December.
 */
export function googleFlightsUrl(trip: Trip): string {
  const parts = [`Flights from ${trip.from} to ${trip.to}`, `on ${isoDate(trip.depart)}`];
  if (trip.back) parts.push(`through ${isoDate(trip.back)}`);
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(parts.join(" "))}`;
}

/** Skyscanner's path form wants lowercase codes and yymmdd. */
export function skyscannerUrl(trip: Trip): string {
  const stamp = (date: Date) => isoDate(date).slice(2).replace(/-/g, "");
  const legs = [trip.from.toLowerCase(), trip.to.toLowerCase(), stamp(trip.depart)];
  if (trip.back) legs.push(stamp(trip.back));
  return `https://www.skyscanner.net/transport/flights/${legs.join("/")}/`;
}

/** Kayak's is uppercase codes and ISO dates, in the path. */
export function kayakUrl(trip: Trip): string {
  const dates = [isoDate(trip.depart)];
  if (trip.back) dates.push(isoDate(trip.back));
  return `https://www.kayak.com/flights/${trip.from.toUpperCase()}-${trip.to.toUpperCase()}/${dates.join("/")}`;
}

/** Google first: it is the one the user asked for by name, and the least loaded. */
export function bookingLinks(trip: Trip): BookingLink[] {
  return [
    { id: "google", label: "Google Flights", url: googleFlightsUrl(trip) },
    { id: "skyscanner", label: "Skyscanner", url: skyscannerUrl(trip) },
    { id: "kayak", label: "Kayak", url: kayakUrl(trip) },
  ];
}

/**
 * How far ahead a ticket can be bought. Airlines load schedules roughly a year
 * out and no further, so a calendar that ran to 2031 would be offering dates
 * every one of these sites will refuse.
 */
export const BOOKING_HORIZON_DAYS = 355;
