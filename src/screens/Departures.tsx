import { Fragment, useMemo, useState } from "react";
import { CityCard } from "../components/CityCard";
import { requireCity } from "../data/cities";
import { groupCities, initialOf, regionOf } from "../lib/grouping";
import { ratingOf } from "../lib/ranking";
import type { City } from "../types";
import { useLog } from "../state/LogContext";

type Sort = "added" | "name" | "region";

const SORT_LABELS: Record<Sort, string> = {
  added: "When added",
  name: "Name",
  region: "Region",
};

/**
 * What each order files its cards under. "When added" gets none: the board in
 * the sequence you picked things is a chronology, and a run of cards headed
 * with a date is not something anyone skims for.
 */
const SORT_HEADS: Record<Sort, ((city: City) => string) | null> = {
  added: null,
  name: initialOf,
  region: regionOf,
};

/**
 * Just the board. Adding happens from a city page or the search in the top
 * bar, the way a watchlist works — an add-anything grid on this screen made it
 * two screens wearing one hat.
 */
export function Departures() {
  const { log, toggleWishlist } = useLog();
  const [sort, setSort] = useState<Sort>("added");

  const groups = useMemo(() => {
    // The wishlist is stored newest first, which is the default order.
    const cities = log.wishlist.map((id) => requireCity(id));

    const sorted =
      sort === "name"
        ? [...cities].sort((a, b) => a.name.localeCompare(b.name))
        : sort === "region"
          ? [...cities].sort(
              (a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name),
            )
          : cities;

    return groupCities(sorted, SORT_HEADS[sort]);
  }, [log.wishlist, sort]);

  const count = log.wishlist.length;

  return (
    <section className="screen">
      <h2>
        {count === 0 ? "You haven't picked anywhere yet" : `You want to go to ${count} ${count === 1 ? "city" : "cities"}`}
      </h2>

      {/* One control, not two. A region *filter* beside a region *sort* put
          the same word at both ends of this bar for two different jobs, and
          the pair contradicted itself: with the filter set to Asia, sorting by
          region had nothing left to order. The sort is the one worth keeping
          — it shows every region at once where the filter could only ever show
          one — and the heads below reach a region by scrolling to its name. */}
      {count > 0 && (
        <div className="filterbar">
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

      {count === 0 ? (
        <p className="empty">
          Search for a city in the top bar, or open one and use <b>Add to Departures</b>.
        </p>
      ) : (
        <div className="grid">
          {groups.map((group, index) => (
            <Fragment key={`${group.key}-${index}`}>
              {/* Fragments, so the head and the cards stay direct children of
                  the grid and the head can span the row it opens. */}
              {group.key && <h3 className="group-head">{group.key}</h3>}
              {group.cities.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  to={`/city/${city.id}`}
                  rating={ratingOf(log, city.id)}
                  plain
                  wishMode="remove"
                  onToggleWish={() => toggleWishlist(city.id)}
                />
              ))}
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
