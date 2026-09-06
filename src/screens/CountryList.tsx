import { Link, useParams } from "react-router-dom";
import { REGIONS } from "../data/cities";
import { progressFor, slugOf } from "../lib/countries";
import { formatStay, stayInCountry } from "../lib/trips";
import { useLog } from "../state/LogContext";
import { useProfile } from "../state/ProfileContext";

/**
 * One continent's countries, ticked or not.
 *
 * The unticked half is the useful half: every line without a stamp is a
 * country this app has a city in, so it is somewhere you could log tomorrow —
 * which is why the cities are printed on the line rather than hidden behind
 * it, and why an empty country's cities link straight to their pages.
 */
export function CountryList() {
  const { region: slug = "" } = useParams();
  const { log } = useLog();
  const { profile } = useProfile();

  const region = REGIONS.find((name) => slugOf(name) === slug.toLowerCase());
  if (!region) {
    return (
      <section className="screen">
        <Link className="back" to="/">
          ← Profile
        </Link>
        <p className="empty">No such region.</p>
      </section>
    );
  }

  const { done, total, rows } = progressFor(region, log);

  return (
    <section className="screen">
      <Link className="back" to="/">
        ← Profile
      </Link>

      {/* The other four, so this reads as one of a set rather than as a page
          you have to go back to the profile to leave. */}
      <div className="rgtabs">
        {REGIONS.map((name) => {
          const other = progressFor(name, log);
          return (
            <Link
              key={name}
              to={`/countries/${slugOf(name)}`}
              className={name === region ? "on" : undefined}
            >
              {name} <i>{other.done}/{other.total}</i>
            </Link>
          );
        })}
      </div>

      <h2>
        {region} — {done} of {total} countries
      </h2>
      <p className="lede">
        {done === total
          ? `Every country ${profile.name.split(" ")[0]} can log here has a stamp in it.`
          : `Counted against the cities Arrivals carries, so every line without a stamp is somewhere you could log tomorrow.`}
      </p>

      <ul className="checklist">
        {rows.map(({ country, cities, visited }) => {
          const reached = visited.length > 0;
          const stay = stayInCountry(log, country);
          return (
            <li key={country} className={reached ? "done" : undefined}>
              <span className="ctick" aria-hidden="true">
                {reached ? "✓" : ""}
              </span>
              <span className="cname">
                {country}
                {/* How long you have actually spent there, across every trip.
                    Only where something recorded a length — a trip nobody
                    measured is not a nought-night one, so it says how many it
                    could not count instead of quietly averaging them in. */}
                {reached && (
                  <small className="cstay">
                    {stay.nights > 0 ? formatStay(stay.nights) : "length not logged"}
                    {stay.nights > 0 && stay.undated > 0 && ` + ${stay.undated} unmeasured`}
                  </small>
                )}
              </span>
              <span className="ccities">
                {cities.map((city) => {
                  const been = visited.includes(city);
                  return (
                    <Link
                      key={city.id}
                      to={`/city/${city.id}`}
                      className={been ? "cbeen" : undefined}
                      title={been ? `${city.name} — logged` : `${city.name} — not yet`}
                    >
                      {city.name}
                    </Link>
                  );
                })}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
