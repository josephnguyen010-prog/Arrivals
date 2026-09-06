import { Link, useParams } from "react-router-dom";
import { CityNotes } from "../components/CityNotes";
import { CityPhoto } from "../components/CityPhoto";
import { PhotoCreditLine } from "../components/PhotoCreditLine";
import { Stars } from "../components/Stars";
import { requireCity } from "../data/cities";
import { FEED } from "../data/seed";
import { formatStay } from "../lib/trips";
import { isWished, visitsFor } from "../lib/ranking";
import { useLog } from "../state/LogContext";

/**
 * Somebody else's trip, opened from the feed. Deliberately not the city page:
 * that one is your record of a place you have been — your rating, your review,
 * your stamps — and reaching it from Activity made every city a friend
 * mentioned look like one you had visited.
 *
 * So this screen carries exactly two things: what they said, and the one thing
 * you can do about it, which is put the city on your Departures board.
 */
export function FriendVisit() {
  const { id = "" } = useParams();
  const { log, toggleWishlist } = useLog();
  const item = FEED.find((entry) => entry.id === id);

  if (!item) {
    return (
      <section className="screen">
        <Link className="back" to="/activity">
          ← Activity
        </Link>
        <p className="empty">That entry is no longer in your feed.</p>
      </section>
    );
  }

  const city = requireCity(item.city);
  const wished = isWished(log, city.id);
  const visits = visitsFor(log, city.id);

  return (
    <section className="screen">
      <Link className="back" to="/activity">
        ← Activity
      </Link>

      <div className="city-top">
        <div>
          {/* The photograph, not the stamp: a stamp is the mark of your own
              visit, and this is a city you may never have set foot in. */}
          <div className="friend-shot">
            <CityPhoto city={city} alt={city.name} />
          </div>
          <div className="photo-line">
            <PhotoCreditLine city={city.id} />
          </div>
        </div>

        <div className="city-head">
          <div>
            <p className="eyebrow">
              {city.country} · {city.region}
            </p>
            <h1>{city.name}</h1>

            <div className="friend-by">
              <b>{item.who}</b>
              <span className="handle">{item.handle}</span>
              <span className="when">
                {item.day} {item.when} · {formatStay(item.nights)}
              </span>
            </div>

            <div className="city-rating">
              <Stars value={item.rating} />
              <small>{item.who.split(" ")[0]}'s rating</small>
            </div>

            <p className="friend-say">{item.note}</p>

            <div className="tags">
              {item.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <button
              className={wished ? "wish-btn on" : "wish-btn"}
              aria-pressed={wished}
              onClick={() => toggleWishlist(city.id)}
            >
              {wished ? "✓ On your Departures board" : "+ Add to Departures"}
            </button>

            {/* Always. This is the only way off this page, and it used to be
                shown only for cities you had already been to — so a friend's
                write-up of somewhere new was a dead end, and the one reader
                most likely to want the fare and the ticket was the one who
                couldn't reach them. The count is what's conditional, not the
                way out. */}
            <p className="empty city-line">
              {visits.length > 0 && (
                <>You've been {visits.length === 1 ? "once" : `${visits.length} times`}. </>
              )}
              <Link to={`/city/${city.id}`}>
                {visits.length > 0
                  ? `Your page for ${city.name}`
                  : `What ${city.name} costs, and how to get there`}
              </Link>
            </p>
          </div>

          <CityNotes city={city} />
        </div>
      </div>
    </section>
  );
}
