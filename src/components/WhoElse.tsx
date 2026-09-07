import { Link } from "react-router-dom";
import { Stars } from "./Stars";
import { FEED } from "../data/seed";
import { daysAgo } from "../lib/dates";
import { formatStay } from "../lib/trips";
import type { CityId, FeedItem } from "../types";

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
/** Whether anyone you follow has been, so the panel can leave the tab off
 *  rather than offer one that opens on "nobody has". Twenty-six of the
 *  eighty cities have no entry, and a tab invites a click in a way a
 *  section further down the page does not. */
export function anyoneBeen(city: CityId): boolean {
  return FEED.some((item) => item.city === city);
}

/**
 * Everyone you follow who has been, newest first — except that whoever's page
 * this is heads the list, because on their own write-up their row is the
 * write-up and not a cross-reference to it.
 */
export function entriesFor(city: CityId, current?: string): FeedItem[] {
  return FEED.filter((item) => item.city === city).sort((a, b) => {
    if (a.id === current) return -1;
    if (b.id === current) return 1;
    return daysAgo(a.day, a.when) - daysAgo(b.day, b.when);
  });
}

/**
 * `current` is the entry whose own page this is, and it changes how that one
 * row reads rather than whether it appears. This pane carries the write-up on
 * a friend's page — it is the only place their words are printed there — so
 * their row goes first, prints in full rather than clamped at two lines, and
 * drops the link and the arrow, both of which pointed at the page you are
 * already on. Everyone else keeps the two-line summary and the way through to
 * their own write-up.
 */
export function WhoElse({
  city,
  heading = true,
  current,
}: {
  city: CityId;
  heading?: boolean;
  current?: string;
}) {
  const been = entriesFor(city, current);

  if (been.length === 0) {
    return (
      <div className="whoelse">
        {heading && <p className="field-label">Who else has been</p>}
        <p className="empty">Nobody you follow has logged this one yet.</p>
      </div>
    );
  }

  const average = been.reduce((sum, item) => sum + item.rating, 0) / been.length;

  return (
    <div className="whoelse">
      <p className="field-label">
        {heading ? "Who else has been" : ""}
        <span className="whoelse-avg">
          {been.length === 1 ? "1 person" : `${been.length} people`} · {round(average)} avg
        </span>
      </p>

      <ul className="whos">
        {been.map((item) => {
          const isCurrent = item.id === current;

          const body = (
            <>
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
                {/* Enough of somebody else's verdict to be worth the row, and
                    no more — the whole of it is one click away, where it
                    belongs. Whoever's page this is gets all of it instead,
                    because here there is no click that would reach the rest. */}
                <span className={isCurrent ? "who-note whole" : "who-note"}>{item.note}</span>
              </span>

              {!isCurrent && (
                <span className="who-go" aria-hidden="true">
                  →
                </span>
              )}
            </>
          );

          return (
            <li key={item.id}>
              {isCurrent ? (
                <div className="who-row current">{body}</div>
              ) : (
                <Link to={`/activity/${item.id}`}>{body}</Link>
              )}
            </li>
          );
        })}
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
