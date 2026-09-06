import { Link } from "react-router-dom";
import { BookFlight } from "./BookFlight";
import { airportByCode, nearestAirport } from "../data/airports";
import { coordsFor, flightHoursFor, greatCircleKm } from "../data/coords";
import { fareEstimate } from "../data/fares";
import { useProfile } from "../state/ProfileContext";
import type { City } from "../types";

/** Nose points along +x — animateMotion's rotate="auto" needs it that way. */
const PLANE_ICON =
  "M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5L21,16z";

/**
 * The ticket, printed rather than bought: where you'd fly from, where you'd
 * land, how far and how long, and what the seat costs. Everything on it is
 * derived — great-circle distance, a fare curve, the destination's latitude —
 * so it fills itself in for all 44 cities without a booking to hang on.
 *
 * The stub carries the fare because that is where a real pass puts the number
 * you keep, and because it is the one figure on here that is an estimate. Torn
 * off from the facts rather than mixed in with them.
 */
export function BoardingPass({ city }: { city: City }) {
  const { profile } = useProfile();
  const home = profile.homeAirport
    ? airportByCode(profile.homeAirport)
    : undefined;

  if (!home) {
    return (
      <div className="boarding-pass-empty">
        <p className="field-label">Your ticket</p>
        <p className="empty">
          <Link to="/">Set your home airport</Link> to see the flight and what
          the fare runs.
        </p>
      </div>
    );
  }

  const cityCoords = coordsFor(city.id);
  if (!cityCoords) return null;

  const arrival = nearestAirport(cityCoords);

  /**
   * Comparing airports rather than coordinates is what makes this fire at all.
   * The old check asked whether the home airport sat at the city's own centre,
   * which is never true — SEA is 17km from the middle of Seattle — so a
   * Seattle native got a boarding pass to Seattle.
   */
  if (arrival && arrival.code === home.code) {
    return (
      <div className="boarding-pass-empty">
        <p className="field-label">Your ticket</p>
        <p className="empty">
          {city.name} is where you fly out of — no ticket needed.
        </p>
      </div>
    );
  }

  const km = greatCircleKm({ lat: home.lat, lon: home.lon }, cityCoords);
  const hours = flightHoursFor(km);
  const fare = fareEstimate(km, cityCoords.lat, city.region);

  return (
    <div className="boarding-pass">
      <p className="field-label">Your ticket</p>

      <div className="pass-row">
        <div className="pass">
          <div className="pass-stripe" aria-hidden="true" />

          <div className="pass-body">
            <div className="pass-main">
              <div className="pass-head">
                <span className="pass-mark">Arrivals</span>
                <span className="pass-kind">Boarding pass</span>
              </div>

              <div className="pass-route">
                <div className="pass-port">
                  <b>{home.code}</b>
                  <span>{home.city}</span>
                </div>

                <svg
                  className="pass-arc"
                  viewBox="0 0 320 70"
                  role="img"
                  aria-label={`Flight from ${home.city} (${home.code}) to ${city.name}${
                    arrival ? ` (${arrival.code})` : ""
                  }`}
                >
                  <path
                    id={`arc-${city.id}`}
                    d="M 14 52 Q 160 6 306 52"
                    fill="none"
                    className="pass-line"
                  />
                  <circle cx="14" cy="52" r="3.5" className="pass-dot" />
                  <circle cx="306" cy="52" r="3.5" className="pass-dot" />
                  <g className="pass-plane">
                    <animateMotion
                      dur="9s"
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href={`#arc-${city.id}`} />
                    </animateMotion>
                    <path
                      transform="scale(0.62) rotate(90) translate(-12,-12)"
                      d={PLANE_ICON}
                    />
                  </g>
                </svg>

                <div className="pass-port">
                  <b>{arrival ? arrival.code : "———"}</b>
                  <span>{city.name}</span>
                </div>
              </div>

              <dl className="pass-grid">
                <div>
                  <dt>Distance</dt>
                  <dd>{Math.round(km).toLocaleString()} km</dd>
                </div>
                <div>
                  <dt>Flight time</dt>
                  <dd>{formatHours(hours)}</dd>
                </div>
                <div>
                  <dt>Cheapest</dt>
                  <dd>{fare.cheapest.slice(0, 2).join(" · ")}</dd>
                </div>
                <div>
                  <dt>Peak</dt>
                  <dd>{fare.peak.slice(0, 2).join(" · ")}</dd>
                </div>
              </dl>

              <Barcode seed={`${home.code}${arrival?.code ?? city.id}`} />
            </div>

            <div className="pass-stub">
              <span className="pass-stub-label">Typical fare</span>
              <b className="pass-fare">${fare.typical.toLocaleString()}</b>
              <span className="pass-band">
                ${fare.low.toLocaleString()}–${fare.high.toLocaleString()}
              </span>
              <span className="pass-stub-note">
                Cheap season to peak · return, economy
              </span>
            </div>
          </div>
        </div>

        <div className="book-col">
          <BookFlight from={home.code} to={arrival?.code} cityName={city.name} />
        </div>
      </div>
    </div>
  );
}

/**
 * Bars off a hash of the route, so a given pair of airports always prints the
 * same code. Random bars would reshuffle on every render, which reads as a
 * loading state rather than as ink.
 */
function Barcode({ seed }: { seed: string }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const bars: number[] = [];
  for (let i = 0; i < 60; i += 1) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    bars.push(1 + (hash % 3));
  }

  // Widths are flex-grow rather than pixels so the code runs the full width of
  // the pass at any size, the way the printed one does.
  return (
    <div className="pass-barcode" aria-hidden="true">
      {bars.map((weight, i) => (
        <i key={i} style={{ flexGrow: weight }} />
      ))}
    </div>
  );
}

function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (wholeHours === 0) return `${minutes}m`;
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
}
