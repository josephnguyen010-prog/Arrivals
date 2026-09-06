import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { BoardingPass } from "../components/BoardingPass";
import { CityPanel } from "../components/CityPanel";
import { SpotForm } from "../components/SpotForm";
import { SpotList } from "../components/SpotList";
import { CityPhoto } from "../components/CityPhoto";
import { PhotoCreditLine } from "../components/PhotoCreditLine";
import { Stars } from "../components/Stars";
import { requireCity } from "../data/cities";
import type { BudgetLevelId } from "../data/costs";
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
 * It carries what they said, and what you would do about it: put the city on
 * your Departures board, and see what going would cost. The cost used to be a
 * click away on the city page, which is the wrong side of a link — reading a
 * friend on somewhere new is exactly the moment the question comes up.
 */
export function FriendVisit() {
  const { id = "" } = useParams();
  const { log, toggleWishlist } = useLog();
  const item = FEED.find((entry) => entry.id === id);

  /* The trip you might take, not the one they took. Local to this screen —
     the city page keeps its own, and neither should move the other. */
  const [nights, setNights] = useState(5);
  const [budgetId, setBudgetId] = useState<BudgetLevelId>("comfortable");
  const [addingSpot, setAddingSpot] = useState(false);

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

            {/* Only when you have been, and now for a good reason rather than
                the old one. This link existed to make up for what the page was
                missing; the page carries all of it now — the facts, the cost,
                the ticket, who else has been, the spots — so the one thing
                left on the city page is your own record of the place. */}
            {visits.length > 0 && (
              <p className="empty city-line">
                You've been {visits.length === 1 ? "once" : `${visits.length} times`}.{" "}
                <Link to={`/city/${city.id}`}>Your review and visits</Link>
              </p>
            )}
          </div>

          {/* The same panel the city page carries, all three tabs. Leaving
              the roll-up off here was my own tidiness and it cost information:
              the person reading a recommendation wants to know who else rated
              the place, including the author of the page they are on. */}
          <CityPanel
            city={city}
            nights={nights}
            onNights={setNights}
            budgetId={budgetId}
            onBudget={setBudgetId}
          />
        </div>
      </div>

      {/* The ticket and where to buy it, on the page. This was behind the link
          below, which is a page load between reading that somewhere is worth
          going and being able to go — the whole reason anyone opens a friend's
          write-up in the first place. */}
      <section className="going">
        <p className="field-label">Getting there</p>

        <BoardingPass city={city} nights={nights} />
      </section>

      <div className="spots-head">
        <h2 style={{ border: "none", margin: 0, padding: 0 }}>Spots</h2>
        <button className="ghost" onClick={() => setAddingSpot(true)}>
          + Add a spot
        </button>
      </div>
      <p className="lede">
        The things you'd actually tell someone about {city.name}, with a link or a photo if you
        have one.
      </p>
      <SpotList city={city} />

      {addingSpot && <SpotForm city={city} onClose={() => setAddingSpot(false)} />}
    </section>
  );
}
