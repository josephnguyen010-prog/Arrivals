import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BoardingPass } from "../components/BoardingPass";
import { ArrivalsCounter } from "../components/ArrivalsCounter";
import { CityPanel } from "../components/CityPanel";
import { CityPhotoEditor } from "../components/CityPhotoEditor";
import { PhotoCreditLine } from "../components/PhotoCreditLine";
import { ReviewEditor } from "../components/ReviewEditor";
import { RateCity } from "../components/RateCity";
import { SpotForm } from "../components/SpotForm";
import { SpotList } from "../components/SpotList";
import { Stamp } from "../components/Stamp";
import { Stars } from "../components/Stars";
import { cityById } from "../data/cities";
import type { BudgetLevelId } from "../data/costs";
import { dailyCostFor } from "../data/costs";
import { isWished, rankOf, ratingOf, visitsFor } from "../lib/ranking";
import { cheapestMonth, friendsVerdict } from "../lib/cityStats";
import { tripCost } from "../lib/tripCost";
import { formatNights } from "../lib/trips";
import { useLog } from "../state/LogContext";
import { useProfile } from "../state/ProfileContext";

export function CityPage() {
  const { id = "" } = useParams();
  const { log, toggleWishlist } = useLog();
  const { profile } = useProfile();
  const [addingSpot, setAddingSpot] = useState(false);
  /* One trip, shared. The cost block and the booking panel both describe the
     same journey, so a length owned by either of them would let the page show
     two trips that disagree. */
  const [nights, setNights] = useState(5);
  const [budgetId, setBudgetId] = useState<BudgetLevelId>("comfortable");
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const city = cityById(id);

  if (!city) {
    return (
      <section className="screen">
        <Link className="back" to="/cities">
          ← All cities
        </Link>
        <p className="empty">No city with that name here yet.</p>
      </section>
    );
  }

  const rating = ratingOf(log, city.id);
  const wished = isWished(log, city.id);
  const rank = rankOf(log, city.id);
  const visits = visitsFor(log, city.id);
  /** Been, as against merely rated: a spot is something you found while there. */
  const visited = visits.length > 0;
  const review = log.reviews[city.id];
  /* What everyone else makes of it, beside what you make of it. There is no
     global user base to average — "people" here means the ones you follow. */
  const friends = friendsVerdict(city.id);
  const daily = dailyCostFor(city.id);
  const cheapest = cheapestMonth(city.id);
  /* A fixed week at the middle budget, not the panel's slider: this is a
     headline you read at a glance, and it should not move when someone drags
     something further down the page. Flights are in it only when there is a
     home airport to fly from; without one it is the ground half and says so. */
  const week = tripCost(city, profile.homeAirport, 7, "comfortable");

  return (
    <section className="screen">
      <Link className="back" to="/cities">
        ← All cities
      </Link>

      <div className="city-top">
        <div>
          <Stamp
            city={city}
            rating={rating}
            date={visits[0]?.when.toUpperCase()}
            stars={<RateCity city={city} size={14} label={`Rate ${city.name} on the stamp`} />}
          />
          {/* Credit and control on one line: whoever wants to change the photo
              is looking at the photo, not at a menu somewhere else. */}
          <div className="photo-line">
            <PhotoCreditLine city={city.id} />
            <button className="ghost" onClick={() => setEditingPhoto(true)}>
              Change photo
            </button>
          </div>
        </div>
        {/* Title block, and the facts in the column beside it. */}
        <div className="city-head">
          <div>
            <p className="eyebrow">
              {city.country} · {city.region}
            </p>
            <h1>{city.name}</h1>
            {/* On the line the country tidbit used to have. Out of the strip
                below, where it sat in a slot every other item labels and read
                as a column with its heading missing. */}
            <div className="city-rating">
              <RateCity city={city} />
              {rating === null && <small>{visited ? "Tap to rate" : "Log a visit to rate"}</small>}

              {/* Theirs beside yours, and labelled, because two rows of stars
                  on one line otherwise leaves you working out which is which.
                  Only on somewhere you have not been: once you have your own
                  visit and your own rank, an average of two friends is the
                  least interesting number on the page. */}
              {!visited && friends && (
                <span className="friends-avg">
                  <Stars value={friends.average} size={13} />
                  <small>
                    {round(friends.average)} from {friends.count}{" "}
                    {friends.count === 1 ? "friend" : "friends"}
                  </small>
                </span>
              )}
            </div>

            {/* Four of the same kind of thing: a number and what it counts. */}
            {rating !== null && (
              <div className="city-meta">
                <div className="pstat left">
                  <b>#{rank.pos}</b>
                  <span>of your {rank.total}</span>
                </div>
                <div className="pstat left">
                  <b>{visits.length}</b>
                  <span>{visits.length === 1 ? "Visit" : "Visits"}</span>
                </div>
                {/* The ends of the run. Every visit in between is listed further
                    down. Newest first, the order the passport reads them in. */}
                {visits.length > 1 && (
                  <div className="pstat left when">
                    <b>
                      {visits[visits.length - 1].day} {visits[visits.length - 1].when}
                    </b>
                    <span>First</span>
                  </div>
                )}
                {visits.length > 0 && (
                  <div className="pstat left when">
                    <b>
                      {visits[0].day} {visits[0].when}
                    </b>
                    <span>{visits.length === 1 ? "Stamped" : "Latest"}</span>
                  </div>
                )}
              </div>
            )}
            {/* Somewhere you have not been has no rank, no visits and no dates,
                which is the hole this fills — and the figures that belong there
                are the ones that answer "should I go" rather than "what did I
                make of it". A page about a city you have been to already has
                its own numbers and does not need these. */}
            {!visited && (
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
                    <span>{week.flights === null ? "A week, on the ground" : `A week from ${week.fromCode}`}</span>
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

            {/* The rank in cities rather than in arithmetic. It used to read
                "ranked against the other cities you gave 4.5 stars", which
                described the mechanism and told you nothing you had not just
                done yourself. */}
            {/* Where your ranking used to be explained back to you. A city page
                is about the city, and "you put it below Ho Chi Minh City" was
                the app talking about its own bookkeeping — true, and no reason
                to be interested. The arrivals counter is about the place. */}
            <ArrivalsCounter city={city} />

            <button
              className={wished ? "wish-btn on" : "wish-btn"}
              aria-pressed={wished}
              onClick={() => toggleWishlist(city.id)}
            >
              {wished ? "✓ On your Departures board" : "+ Add to Departures"}
            </button>

          </div>

          {/* One panel you turn. Only ever one block in this column, so there
              is nothing to line it up against and nothing to leave a hole
              under — which two blocks here never managed. */}
          <CityPanel
            city={city}
            nights={nights}
            onNights={setNights}
            budgetId={budgetId}
            onBudget={setBudgetId}
          />
        </div>
      </div>

      {/* One section for the whole of going: what it costs, the ticket, and
          where to buy it. These were three things in two places, and the fare
          was printed in two of them. */}
      <section className="going">
        <p className="field-label">Getting there</p>

        <BoardingPass city={city} nights={nights} />
      </section>

      {/* Both halves of what you have to say about the place, side by side: the
          verdict, and the dates it is based on. Each ran the full width alone
          and neither filled it — a three-line paragraph under a rule twice its
          length, then a column of dates under another. The visits take the
          measure the facts take above them, so the page keeps one right edge.
          Only for a city you have been to: a review is a verdict, and there is
          nothing to say about somewhere you haven't been. */}
      {visits.length > 0 && (
        <div className="yours">
          <section className="reviews">
            <div className="spots-head">
              <h2 style={{ border: "none", margin: 0, padding: 0 }}>Your review</h2>
              <button className="ghost" onClick={() => setEditingReview(true)}>
                {review ? "Edit" : "+ Write one"}
              </button>
            </div>
            {review ? (
              <p className="your-review">{review}</p>
            ) : (
              <p className="empty">
                Nothing yet. This is the city, not the trip — what you'd tell someone who asked
                about it.
              </p>
            )}
          </section>

          <section className="visits-col">
            <div className="spots-head">
              <h2 style={{ border: "none", margin: 0, padding: 0 }}>
                {visits.length === 1 ? "Your visit" : "Your visits"}
              </h2>
              {/* The number of trips. The total nights went here briefly and
                  said the same thing as the rows underneath it. */}
              <span className="side-count">{visits.length}</span>
            </div>
            <ul className="visit-log">
              {visits.map((visit) => (
                <li key={visit.id}>
                  <time>
                    {visit.day} {visit.when}
                    {typeof visit.nights === "number" && (
                      <small> · {formatNights(visit.nights)}</small>
                    )}
                  </time>
                  {/* Your own words about the trip, where there are some. The
                      feed's notes belong to other people; this is the column
                      the app had for everyone but you. */}
                  <span>{visit.note ?? "Stamped"}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}


      {/* A spot is something you found while you were there, so adding one is
          for cities you have actually been to. The way in is logging the trip
          — the log flow asks for a spot as you go — and this button is for the
          second and third, once the visit is on record. Before that there is
          nothing to add to, and offering it invited people to write notes on
          places they had never been. */}
      <div className="spots-head">
        <h2 style={{ border: "none", margin: 0, padding: 0 }}>Spots</h2>
        {visited && (
          <button className="ghost" onClick={() => setAddingSpot(true)}>
            + Add a spot
          </button>
        )}
      </div>
      <p className="lede">
        {visited
          ? `The things you'd actually tell someone about ${city.name}, with a link or a photo if you have one.`
          : `Spots come out of trips you've taken. Log a visit to ${city.name} and you can start keeping them.`}
      </p>
      <SpotList city={city} empty={visited ? undefined : null} />

      {addingSpot && visited && <SpotForm city={city} onClose={() => setAddingSpot(false)} />}
      {editingPhoto && <CityPhotoEditor city={city} onClose={() => setEditingPhoto(false)} />}
      {editingReview && visits.length > 0 && (
        <ReviewEditor city={city} onClose={() => setEditingReview(false)} />
      )}
    </section>
  );
}

/** One decimal, and no trailing ".0" on a whole number. */
function round(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}
