import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CityCard } from "../components/CityCard";
import { EditCity } from "../components/EditCity";
import { RateCity } from "../components/RateCity";
import { CITIES, REGIONS } from "../data/cities";
import { groupCities, initialOf } from "../lib/grouping";
import { RATING_STEPS, isWished, orderedIds, ratingOf, visitsFor } from "../lib/ranking";
import { useLog } from "../state/LogContext";
import type { City } from "../types";

type Sort = "rating" | "recent" | "visits" | "name";

/** "4.5+" means that rating and up; "=4.5" means exactly it. */
type RatingFilter = string;

const SORT_LABELS: Record<Sort, string> = {
  rating: "Your rating",
  recent: "Last visited",
  visits: "Times visited",
  name: "Name",
};

export function Cities() {
  const { log, toggleWishlist } = useLog();
  const [editing, setEditing] = useState<City | null>(null);
  const [rating, setRating] = useState<RatingFilter>("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState<Sort>("rating");
  const [tight, setTight] = useState(false);

  const rows = useMemo(() => {
    const order = orderedIds(log);

    const filtered = CITIES.filter((city) => {
      // Only places you've been. Everywhere else lives on Departures — a grid
      // of grey "not been" cards was noise, not a catalogue.
      const value = ratingOf(log, city.id);
      const been = value !== null || visitsFor(log, city.id).length > 0;
      if (!been) return false;

      if (region !== "all" && city.region !== region) return false;
      if (rating === "all") return true;
      if (rating.startsWith("=")) return value === parseFloat(rating.slice(1));
      return value !== null && value >= parseFloat(rating);
    });

    // Unrated cities sink to the bottom of every ordering except by name.
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "visits") return visitsFor(log, b.id).length - visitsFor(log, a.id).length;
      if (sort === "recent") {
        const ai = log.visits.findIndex((v) => v.city === a.id);
        const bi = log.visits.findIndex((v) => v.city === b.id);
        if (ai === -1) return bi === -1 ? 0 : 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      const ao = order.indexOf(a.id);
      const bo = order.indexOf(b.id);
      if (ao === -1) return bo === -1 ? 0 : 1;
      if (bo === -1) return -1;
      return ao - bo;
    });
  }, [log, rating, region, sort]);

  /* Only the alphabetical order files under anything. The other three are
     rankings, and a ranking is one run from best down — chopping it into
     headed sections would be chopping up the answer. The region filter stays:
     there is no region *sort* on this screen for it to collide with, so it is
     the only way to narrow the shelf to one continent. */
  const groups = useMemo(
    () => groupCities(rows, sort === "name" ? initialOf : null),
    [rows, sort],
  );

  return (
    <section className="screen">
      <div className="filterbar">
        <select
          className={rating === "all" ? "filter" : "filter on"}
          aria-label="Filter by rating"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          <option value="all">Rating</option>
          <optgroup label="At least">
            {["4.5", "4", "3.5", "3", "2"].map((step) => (
              <option key={step} value={step}>
                {stars(step)} and up
              </option>
            ))}
          </optgroup>
          <optgroup label="Exactly">
            {RATING_STEPS.map((step) => (
              <option key={step} value={`=${step}`}>
                {stars(step)}
              </option>
            ))}
          </optgroup>
        </select>

        <select
          className={region === "all" ? "filter" : "filter on"}
          aria-label="Filter by region"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        >
          <option value="all">Region</option>
          {REGIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <span className="spacer" />

        <span className="sort-label">Sort by</span>
        <select
          className="filter"
          aria-label="Sort by"
          value={sort}
          onChange={(event) => setSort(event.target.value as Sort)}
        >
          {(Object.keys(SORT_LABELS) as Sort[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        <button
          className="density"
          onClick={() => setTight((current) => !current)}
          aria-pressed={tight}
          title={tight ? "Show larger cards" : "Show smaller cards"}
        >
          {tight ? "▦" : "▤"}
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="empty">
          {orderedIds(log).length === 0 ? (
            <>
              Nowhere yet. <Link to="/departures">Departures</Link> has everywhere you haven't been,
              or log a visit to start.
            </>
          ) : (
            "Nothing matches those filters."
          )}
        </p>
      ) : (
        <div className={tight ? "grid tight" : "grid"}>
          {groups.map((group, index) => (
            <Fragment key={`${group.key}-${index}`}>
              {group.key && <h3 className="group-head">{group.key}</h3>}
              {group.cities.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  to={`/city/${city.id}`}
                  rating={ratingOf(log, city.id)}
                  visits={visitsFor(log, city.id).length}
                  wished={isWished(log, city.id)}
                  onToggleWish={() => toggleWishlist(city.id)}
                  onEdit={() => setEditing(city)}
                  stars={<RateCity city={city} size={13} />}
                />
              ))}
            </Fragment>
          ))}
        </div>
      )}

      {editing && <EditCity city={editing} onClose={() => setEditing(null)} />}
    </section>
  );
}

/** "4.5" reads as "4½" in a dropdown, where a real star row cannot go. */
function stars(step: string): string {
  const value = parseFloat(step);
  const whole = Math.floor(value);
  const half = value % 1 ? "½" : "";
  return `${whole || ""}${half} ★`;
}
