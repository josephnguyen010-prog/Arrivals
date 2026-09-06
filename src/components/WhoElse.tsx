import { Link } from "react-router-dom";
import { Stars } from "./Stars";
import { FEED } from "../data/seed";
import { daysAgo } from "../lib/dates";
import { formatStay } from "../lib/trips";
import type { CityId } from "../types";

/**
 * Who you follow that has been here, and what they made of it.
 *
 * The Activity feed answers "what has anyone been doing lately", which is a
 * different question from "what do the people I follow make of *this* place" —
 * and the second one is the one you have while looking at a city. The feed
 * could only answer it by scrolling until you found the entry.
 *
 * Each row opens their trip rather than the city, because the city page is
 * your record of somewhere and their write-up is theirs.
 */
export function WhoElse({ city }: { city: CityId }) {
  const been = FEED.filter((item) => item.city === city).sort(
    (a, b) => daysAgo(a.day, a.when) - daysAgo(b.day, b.when),
  );

  if (been.length === 0) {
    return (
      <div className="whoelse">
        <p className="field-label">Who else has been</p>
        <p className="empty">Nobody you follow has logged this one yet.</p>
      </div>
    );
  }

  const average = been.reduce((sum, item) => sum + item.rating, 0) / been.length;

  return (
    <div className="whoelse">
      <p className="field-label">
        Who else has been
        <span className="whoelse-avg">
          {been.length === 1 ? "1 person" : `${been.length} people`} · {round(average)} avg
        </span>
      </p>

      <ul className="whos">
        {been.map((item) => (
          <li key={item.id}>
            <Link to={`/activity/${item.id}`}>
              <span className="favatar small" aria-hidden="true">
                {initialsOf(item.who)}
              </span>

              <span className="who-body">
                <span className="who-top">
                  <b>{item.who}</b>
                  <Stars value={item.rating} size={12} />
                </span>
                <span className="who-when">
                  {item.day} {item.when} · {formatStay(item.nights)}
                </span>
                {/* Enough of their verdict to be worth the row, and no more —
                    the whole of it is one click away, where it belongs. */}
                <span className="who-note">{item.note}</span>
              </span>

              <span className="who-go" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One decimal, and no trailing ".0" on a whole number. */
function round(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
