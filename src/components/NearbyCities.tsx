import { Link } from "react-router-dom";
import { CITIES } from "../data/cities";
import { coordsFor, greatCircleKm } from "../data/coords";
import { isWished, visitsFor } from "../lib/ranking";
import { useLog } from "../state/LogContext";
import type { City } from "../types";

/** Three is enough to suggest a route and short enough to sit under the facts. */
const HOW_MANY = 3;

/**
 * What else is near enough to fold into the same trip.
 *
 * Joined by distance rather than by country, which was the obvious idea and a
 * bad one: only four of the catalogue's twenty-seven countries hold more than
 * one city, so thirty-odd city pages would have shown an empty box. Every city
 * has neighbours, so this is never empty — Lisbon gets Porto at 274km, Sydney
 * gets Singapore at 6,306km, and the number is the answer either way.
 */
export function NearbyCities({ city }: { city: City }) {
  const { log } = useLog();
  const from = coordsFor(city.id);
  if (!from) return null;

  const near = CITIES.map((other) => {
    if (other.id === city.id) return null;
    const to = coordsFor(other.id);
    return to ? { city: other, km: greatCircleKm(from, to) } : null;
  })
    .filter((entry): entry is { city: City; km: number } => entry !== null)
    .sort((a, b) => a.km - b.km)
    .slice(0, HOW_MANY);

  if (near.length === 0) return null;

  return (
    <div className="nearby">
      <p className="field-label">Nearby</p>
      <ul className="nearlist">
        {near.map(({ city: other, km }) => {
          const been = visitsFor(log, other.id).length > 0;
          const wished = isWished(log, other.id);
          return (
            <li key={other.id}>
              <Link to={`/city/${other.id}`}>
                <span className="near-name">
                  {other.name}
                  {/* Whichever of the two is true; been wins, because having
                      gone somewhere outranks meaning to. */}
                  {been ? (
                    <small className="near-been">been</small>
                  ) : wished ? (
                    <small className="near-wish">on your board</small>
                  ) : null}
                </span>
                <span className="near-km">{Math.round(km).toLocaleString()} km</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
