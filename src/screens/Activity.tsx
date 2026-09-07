import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CityPhoto } from "../components/CityPhoto";
import { Stars } from "../components/Stars";
import { requireCity } from "../data/cities";
import { FEED } from "../data/seed";
import { daysAgo } from "../lib/dates";
import { formatStay } from "../lib/trips";
import { isWished, ratingOf } from "../lib/ranking";
import { useLog } from "../state/LogContext";
import { useProfile } from "../state/ProfileContext";
import type { FeedItem, Visit } from "../types";

/**
 * Two weights of entry, in one column, newest first.
 *
 * A friend's trip is the loud one: they wrote something, so their words are
 * the body of the entry and you can read it without opening anything. Your own
 * stamps are the quiet one — a line, because you already know what you did and
 * the feed is mostly for what other people did.
 *
 * Opening a friend's entry opens *their* trip, not the city. The city page is
 * your record of somewhere you have been, and routing the feed at it made
 * every city a friend mentioned arrive dressed as one of yours.
 */
export function Activity() {
  const { log } = useLog();
  const { profile, initials } = useProfile();

  const entries = useMemo(() => {
    const theirs = FEED.map((item) => ({
      kind: "friend" as const,
      age: daysAgo(item.day, item.when),
      item,
    }));
    const yours = log.visits.map((visit) => ({
      kind: "you" as const,
      age: daysAgo(visit.day, visit.when),
      visit,
    }));
    // Oldest last. Ties keep a friend's entry above your own line, which reads
    // better than a stamp splitting two things somebody wrote.
    return [...theirs, ...yours].sort((a, b) => a.age - b.age || (a.kind === "friend" ? -1 : 1));
  }, [log.visits]);

  return (
    <section className="screen">
      <h2>From people you follow</h2>
      <p className="lede">
        What they said about where they went, and your own stamps in among it — one column,
        newest first.
      </p>

      <div className="feed">
        {entries.map((entry) =>
          entry.kind === "friend" ? (
            <FriendEntry key={entry.item.id} item={entry.item} />
          ) : (
            <YourLine key={entry.visit.id} visit={entry.visit} you={profile.name} initials={initials} />
          ),
        )}
      </div>
    </section>
  );
}

/** Somebody else's trip, with what they wrote about the city. */
function FriendEntry({ item }: { item: FeedItem }) {
  const { log, toggleWishlist } = useLog();
  const city = requireCity(item.city);
  const wished = isWished(log, city.id);
  const to = `/activity/${item.id}`;

  return (
    <article className="fentry">
      <span className="favatar" aria-hidden="true">
        {initialsOf(item.who)}
      </span>

      <Link className="fshot" to={to} tabIndex={-1} aria-hidden="true">
        <CityPhoto city={city} loading="lazy" />
      </Link>

      <div className="fbody">
        <p className="fwho">
          <b>{item.who}</b>
          <span className="handle">{item.handle}</span>
          <span className="fverb">{verbFor(item)}</span>
          <span className="when">
            {item.day} {item.when} · {formatStay(item.nights)}
          </span>
        </p>

        <h3 className="ftitle">
          <Link to={to}>{city.name}</Link>
          <small>{city.country}</small>
        </h3>

        <Stars value={item.rating} size={15} />

        {/* Their words, in full. This is the entry — you shouldn't have to open
            anything to find out what somebody thought. */}
        <p className="fsay">{item.note}</p>

        <div className="tags">
          {item.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* The one thing their trip can do to your account. */}
        <button
          className={wished ? "fwish on" : "fwish"}
          aria-pressed={wished}
          onClick={() => toggleWishlist(city.id)}
        >
          {wished ? `✓ ${city.name} is on your Departures board` : `+ Add ${city.name} to Departures`}
        </button>
      </div>
    </article>
  );
}

/** One of your own stamps: a line, not an entry. */
function YourLine({ visit, you, initials }: { visit: Visit; you: string; initials: string }) {
  const { log } = useLog();
  const city = requireCity(visit.city);
  const rating = ratingOf(log, city.id);

  return (
    <Link className="fline" to={`/city/${city.id}`}>
      <span className="favatar small" aria-hidden="true">
        {initials}
      </span>
      <span className="ftext">
        <b>{you.split(" ")[0]}</b> stamped <b>{city.name}</b>
        {visit.note ? ` — ${visit.note}` : ""}
      </span>
      {/* Always rendered, never conditional. The line is a grid with a track
          reserved for it, and a `&&` that returns false puts no item in that
          track at all — so an unrated visit would slide its date up into the
          star column and undo the alignment for every row around it. Stars
          draws nothing for a null rating, which is what belongs there. */}
      <Stars value={rating} size={13} />
      <span className="when">
        {visit.day} {visit.when}
        {typeof visit.nights === "number" && ` · ${formatStay(visit.nights)}`}
      </span>
    </Link>
  );
}

/** "Mai Tran" → "MT". One letter is fine; the chip is a marker, not a name. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** What they did, from the tag the trip already carries. */
function verbFor(item: FeedItem): string {
  const first = item.tags[0]?.toLowerCase() ?? "";
  if (first === "first visit") return "visited";
  if (first.endsWith("visit")) return "went back to";
  return "was in";
}
