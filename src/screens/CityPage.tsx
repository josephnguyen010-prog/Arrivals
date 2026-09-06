import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BoardingPass } from "../components/BoardingPass";
import { WhoElse } from "../components/WhoElse";
import { CityNotes } from "../components/CityNotes";
import { CityPhotoEditor } from "../components/CityPhotoEditor";
import { PhotoCreditLine } from "../components/PhotoCreditLine";
import { ReviewEditor } from "../components/ReviewEditor";
import { RateCity } from "../components/RateCity";
import { SpotForm } from "../components/SpotForm";
import { SpotList } from "../components/SpotList";
import { Stamp } from "../components/Stamp";
import { TripCost } from "../components/TripCost";
import { cityById } from "../data/cities";
import { isWished, rankOf, ratingOf, visitsFor } from "../lib/ranking";
import { formatNights, formatStay, stayInCity } from "../lib/trips";
import { useLog } from "../state/LogContext";

export function CityPage() {
  const { id = "" } = useParams();
  const { log, toggleWishlist } = useLog();
  const [addingSpot, setAddingSpot] = useState(false);
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
  const stay = stayInCity(log, city.id);
  const review = log.reviews[city.id];

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
              {rating === null && <small>Tap to rate</small>}
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
            <p className="empty city-line">
              {rating === null
                ? "Log a visit and it slots into your ranking."
                : `Ranked against the other cities you gave ${rating} stars.`}
            </p>

            <button
              className={wished ? "wish-btn on" : "wish-btn"}
              aria-pressed={wished}
              onClick={() => toggleWishlist(city.id)}
            >
              {wished ? "✓ On your Departures board" : "+ Add to Departures"}
            </button>

            <TripCost city={city} />
          </div>

          <CityNotes city={city} />
        </div>
      </div>

      <BoardingPass city={city} />

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
              {/* The count is what you did; the nights are how long it added
                  up to. Only shown once anything recorded a length. */}
              <span className="side-count">
                {stay.nights > 0 ? formatStay(stay.nights) : visits.length}
              </span>
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

      <WhoElse city={city.id} />

      <div className="spots-head">
        <h2 style={{ border: "none", margin: 0, padding: 0 }}>Spots</h2>
        <button className="ghost" onClick={() => setAddingSpot(true)}>
          + Add a spot
        </button>
      </div>
      <p className="lede">
        The things you'd actually tell someone about {city.name}, with a link or a photo if you have one.
      </p>
      <SpotList city={city} />

      {addingSpot && <SpotForm city={city} onClose={() => setAddingSpot(false)} />}
      {editingPhoto && <CityPhotoEditor city={city} onClose={() => setEditingPhoto(false)} />}
      {editingReview && visits.length > 0 && (
        <ReviewEditor city={city} onClose={() => setEditingReview(false)} />
      )}
    </section>
  );
}
