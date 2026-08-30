import { Link } from "react-router-dom";
import { airportByCode } from "../data/airports";
import { coordsFor, flightHoursFor, greatCircleKm } from "../data/coords";
import { useProfile } from "../state/ProfileContext";
import type { City } from "../types";

/** Nose points along +x — animateMotion's rotate="auto" needs it that way. */
const PLANE_ICON =
  "M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5L21,16z";

/**
 * The line every seatback map draws, minus the plane's actual GPS: a curve
 * from home to here, and how long the great-circle says it should take.
 * Decorative motion, honest numbers — the two don't pretend to be the same
 * thing.
 */
export function FlightPath({ city }: { city: City }) {
  const { profile } = useProfile();
  const home = profile.homeAirport ? airportByCode(profile.homeAirport) : undefined;

  if (!home) {
    return (
      <div className="flight-path">
        <p className="field-label">Getting there</p>
        <p className="empty">
          <Link to="/">Set your home airport</Link> to see the distance and flight time from here.
        </p>
      </div>
    );
  }

  const cityCoords = coordsFor(city.id);
  if (!cityCoords) return null;

  const homeLabel = `${home.city} (${home.code})`;

  if (Math.abs(home.lat - cityCoords.lat) < 1e-6 && Math.abs(home.lon - cityCoords.lon) < 1e-6) {
    return (
      <div className="flight-path">
        <p className="field-label">Getting there</p>
        <p className="empty">{home.city} is where you're flying from — you're already here.</p>
      </div>
    );
  }

  const km = greatCircleKm({ lat: home.lat, lon: home.lon }, cityCoords);
  const hours = flightHoursFor(km);

  return (
    <div className="flight-path">
      <p className="field-label">Getting there</p>

      <svg className="flight-map" viewBox="0 0 600 140" role="img" aria-label={`Flight path from ${homeLabel} to ${city.name}`}>
        <path id="flight-arc" d="M 60 90 Q 300 20 540 90" fill="none" className="flight-line" />
        <circle cx="60" cy="90" r="4" className="flight-dot" />
        <circle cx="540" cy="90" r="4" className="flight-dot" />
        <text x="60" y="112" textAnchor="middle" className="flight-label">
          {home.city}
        </text>
        <text x="540" y="112" textAnchor="middle" className="flight-label">
          {city.name}
        </text>
        <g className="flight-plane">
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
            <mpath href="#flight-arc" />
          </animateMotion>
          <path transform="scale(0.7) rotate(90) translate(-12,-12)" d={PLANE_ICON} />
        </g>
      </svg>

      <div className="cost-total">
        <b>{formatHours(hours)}</b>
        <span>{Math.round(km).toLocaleString()} km, roughly · flying from {homeLabel}</span>
      </div>

      <p className="cost-disclaimer">Straight-line distance — a real route and time depend on the airline.</p>
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
