import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { BoardingPass } from "../components/BoardingPass";
import { CityPanel } from "../components/CityPanel";
import { SpotList } from "../components/SpotList";
import { CityPhoto } from "../components/CityPhoto";
import { PhotoCreditLine } from "../components/PhotoCreditLine";
import { requireCity } from "../data/cities";
import type { BudgetLevelId } from "../data/costs";
import { dailyCostFor } from "../data/costs";
import { FEED } from "../data/seed";
import { cheapestMonth } from "../lib/cityStats";
import { isWished, visitsFor } from "../lib/ranking";
import { tripCost } from "../lib/tripCost";
import { useLog } from "../state/LogContext";
import { useSpots } from "../state/SpotsContext";
import { useProfile } from "../state/ProfileContext";

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
  const { forCity } = useSpots();
  const { profile } = useProfile();
  const item = FEED.find((entry) => entry.id === id);

  /* The trip you might take, not the one they took. Local to this screen —
     the city page keeps its own, and neither should move the other. */
  const [nights, setNights] = useState(5);
  const [budgetId, setBudgetId] = useState<BudgetLevelId>("comfortable");

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
  const mySpots = forCity(city.id);
  /* Reading a friend on somewhere you have never been is the moment the
     question "what would that cost me" arrives, and this column had nothing in
     it to answer with. Same three figures the city page gives an unvisited
     city, and gone once you have been — by then you have your own record and
     these are the least interesting numbers on the page. */
  const daily = dailyCostFor(city.id);
  const cheapest = cheapestMonth(city.id);
  const week = tripCost(city, profile.homeAirport, 7, "comfortable");

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

            {/* Who went, when, and what they gave it live in the panel to the
                right, on their row — one card for the person, rather than a
                letterhead here repeating the name, the date and the stars that
                are already on screen a column across. */}
            <div className="tags">
              {item.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            {visits.length === 0 && (
              <div className="city-meta">
                {daily !== undefined && (
                  <div className="pstat left">
                    <b>${daily}</b>
                    <span>A day there</span>
                  </div>
                )}
                {week !== null && (
                  <div className="pstat left">
                    <b>${week.total.toLocaleString()}</b>
                    <span>
                      {week.flights === null ? "A week, on the ground" : `A week from ${week.fromCode}`}
                    </span>
                  </div>
                )}
                {cheapest && (
                  <div className="pstat left">
                    <b>{cheapest}</b>
                    <span>Cheapest to fly</span>
                  </div>
                )}
              </div>
            )}

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

          {/* The same panel the city page carries, and on this screen it is
              also where the write-up lives. Printing the note in the middle
              column as well put the same paragraph on screen twice — so the
              column keeps whose trip this is, the rating and what to do about
              it, and the panel opens on what they actually said, with anyone
              else who has been underneath it. */}
          <CityPanel
            city={city}
            nights={nights}
            onNights={setNights}
            budgetId={budgetId}
            onBudget={setBudgetId}
            currentEntry={item.id}
            openOn="who"
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

      {/* Read-only here, and only when you have some. This is somebody else's
          trip to a city you may never have set foot in, so there is nothing to
          add from — spots start in the log flow, on a trip of your own. Yours
          still show, and still open to edit, because a page about the place is
          where you would look for them. */}
      {mySpots.length > 0 && (
        <>
          <div className="spots-head">
            <h2 style={{ border: "none", margin: 0, padding: 0 }}>Your spots</h2>
          </div>
          <p className="lede">What you kept from {city.name}.</p>
          <SpotList city={city} empty={null} />
        </>
      )}
    </section>
  );
}
