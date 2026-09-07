import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CityCard } from "../components/CityCard";
import { ListEditor } from "../components/ListEditor";
import { requireCity, REGIONS } from "../data/cities";
import { ratingOf, visitsFor } from "../lib/ranking";
import { useLists } from "../state/ListsContext";
import { useLog } from "../state/LogContext";

/**
 * A list is an argument and its order is part of it, so "As listed" is the
 * default and stays first. The rest are for finding something: seventy-two
 * cities in one list is a catalogue rather than a case, and nobody reads a
 * catalogue in the order it was written.
 */
type Sort = "listed" | "name" | "region" | "rating";

/** Below this a list is short enough to read whole, and the controls are noise. */
const FILTERABLE = 8;

const SORT_LABELS: Record<Sort, string> = {
  listed: "As listed",
  name: "Name",
  region: "Region",
  rating: "Your rating",
};

export function ListPage() {
  const { id = "" } = useParams();
  const { byId, update, remove } = useLists();
  const { log } = useLog();
  const [editing, setEditing] = useState(false);
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState<Sort>("listed");
  const navigate = useNavigate();

  const list = byId(id);

  if (!list) {
    return (
      <section className="screen">
        <Link className="back" to="/lists">
          ← All lists
        </Link>
        <p className="empty">That list has gone.</p>
      </section>
    );
  }

  const rated = list.cities.filter((cityId) => ratingOf(log, cityId) !== null);
  const missing = list.cities.length - rated.length;

  /* Filtered and sorted for display only — the list itself is untouched, so
     turning the page by region cannot quietly rewrite somebody's order. */
  const shown = (() => {
    const cities = list.cities.map(requireCity);
    const inRegion = region === "all" ? cities : cities.filter((city) => city.region === region);
    if (sort === "name") return [...inRegion].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "region") {
      return [...inRegion].sort(
        (a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name),
      );
    }
    if (sort === "rating") {
      // Unrated last rather than at the bottom of the scale: no rating is not
      // a low one, and burying them under half a star would say it was.
      return [...inRegion].sort((a, b) => {
        const left = ratingOf(log, a.id);
        const right = ratingOf(log, b.id);
        if (left === null && right === null) return a.name.localeCompare(b.name);
        if (left === null) return 1;
        if (right === null) return -1;
        return right - left || a.name.localeCompare(b.name);
      });
    }
    return inRegion;
  })();

  /* What each card is numbered. The position is the city's place in the list
     as written, so it survives filtering and sorting — a card that reads 12
     goes on reading 12 wherever it is shown. */
  const position = new Map(list.cities.map((cityId, index) => [cityId, index + 1]));

  return (
    <section className="screen">
      <Link className="back" to="/lists">
        ← All lists
      </Link>

      <div className="list-head">
        <div>
          <p className="eyebrow">
            {list.cities.length} {list.cities.length === 1 ? "city" : "cities"} · {list.by}
          </p>
          <h1>{list.title}</h1>
          {list.blurb && <p className="lede">{list.blurb}</p>}
          <p className="empty" style={{ margin: 0 }}>
            {missing === 0
              ? "You've been to every city on this list."
              : `You've been to ${rated.length} of ${list.cities.length}.`}
          </p>
        </div>
        {list.mine && (
          <div className="list-actions">
            <button className="ghost" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button
              className="ghost danger"
              onClick={() => {
                remove(list.id);
                navigate("/lists");
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Worth the room only once a list is long enough to lose something in.
          Six cities fit on a screen and sorting them is a solution to nothing;
          the catalogue is eighty. The same control the Departures board
          uses, so the two screens answer the same question the same way. */}
      {list.cities.length > FILTERABLE && (
        <div className="filterbar">
          <select
            className={region === "all" ? "filter" : "filter on"}
            aria-label="Filter by region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option value="all">Region</option>
            {REGIONS.filter((name) =>
              list.cities.some((cityId) => requireCity(cityId).region === name),
            ).map((name) => (
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
        </div>
      )}

      {list.cities.length === 0 ? (
        <p className="empty">No cities in this list yet.</p>
      ) : shown.length === 0 ? (
        <p className="empty">Nothing in this list is in {region}.</p>
      ) : (
        <ol className="list-grid">
          {shown.map((city) => (
            <li key={city.id}>
              <span className="list-pos">{position.get(city.id)}</span>
              <CityCard
                city={city}
                to={`/city/${city.id}`}
                rating={ratingOf(log, city.id)}
                visits={visitsFor(log, city.id).length}
              />
            </li>
          ))}
        </ol>
      )}

      {editing && (
        <ListEditor
          list={list}
          onClose={() => setEditing(false)}
          onSave={(patch) => {
            update(list.id, patch);
            setEditing(false);
          }}
        />
      )}
    </section>
  );
}
