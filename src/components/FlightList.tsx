import { useState } from "react";
import {
  clockTime,
  duration,
  logoFor,
  stopsLabel,
  type LiveFlight,
} from "../lib/liveFlights";

/**
 * What is actually flying, when there is a key behind the endpoint to ask.
 *
 * Capped to the panel's leftover height and scrolled rather than allowed to
 * grow: the panel shares a bottom edge with the ticket, and a list is the one
 * thing on the page whose length nobody controls. Three rows show, the rest
 * scroll, and the whole set is a click away on Google.
 */
export function FlightList({
  flights,
  cheapest,
}: {
  flights: LiveFlight[];
  cheapest: number | null;
}) {
  return (
    <ul className="flights" aria-label="Flights on this route">
      {flights.map((flight, index) => {
        const best = cheapest !== null && flight.price === cheapest;
        return (
          <li key={`${flight.flightNumber}-${index}`} className="flight">
            <AirlineMark flight={flight} />

            <span className="flight-body">
              <span className="flight-top">
                <b>{flight.airline}</b>
                <small>{stopsLabel(flight.stops)}</small>
              </span>
              <span className="flight-when">
                {clockTime(flight.departTime)} → {clockTime(flight.arriveTime)}
                {flight.durationMin !== null && (
                  <> · {duration(flight.durationMin)}</>
                )}
              </span>
            </span>

            <span className={best ? "flight-price best" : "flight-price"}>
              {flight.price === null
                ? "—"
                : `$${flight.price.toLocaleString()}`}
              {best && <small>cheapest</small>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The logo, or the carrier's letters in a chip when there isn't one. The
 * `onError` is the point of the component: Google has no mark for every
 * airline that flies, and a missing file renders as the browser's broken-image
 * icon, which looks like the app is broken rather than the logo missing.
 */
function AirlineMark({ flight }: { flight: LiveFlight }) {
  const [failed, setFailed] = useState(false);
  const src = logoFor(flight);

  return (
    <span className="flight-mark" aria-hidden="true">
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <i>{initials(flight.airline)}</i>
      )}
    </span>
  );
}

/** A stand-in mark for the airlines Google gives us no logo for. */
function initials(airline: string): string {
  return airline
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}
