import { Fragment } from "react";
import { Link } from "react-router-dom";
import { CityPhoto } from "../components/CityPhoto";
import { RateCity } from "../components/RateCity";
import { requireCity } from "../data/cities";
import { MONTH_NAMES } from "../lib/dates";
import { formatNights } from "../lib/trips";
import { inDateOrder, visitOrdinals } from "../lib/ranking";
import { useLog } from "../state/LogContext";
import type { Visit } from "../types";

export function Passport() {
  const { log } = useLog();
  // Dated order, not stored order — see inDateOrder. Grouping walks this list
  // and starts a new heading whenever the year changes, so an out-of-order
  // visit would open a second group for a year already printed above.
  const visits = inDateOrder(log.visits);
  const ordinals = visitOrdinals(visits);

  /* Grouped by year, not by month. A month header over a single row - which is
     what all but one of them was - splits a date in two and leaves the day
     stranded in the margin, a long way from the header that gives it meaning.
     Years actually group, and each row carries its own date whole. */
  const years: { year: string; visits: Visit[] }[] = [];
  for (const visit of visits) {
    const year = visit.when.slice(-4);
    const last = years[years.length - 1];
    if (last && last.year === year) last.visits.push(visit);
    else years.push({ year, visits: [visit] });
  }

  return (
    <section className="screen">
      <h2>Every visit, stamped in order</h2>
      <p className="lede">
        A city can appear here more than once. That is the whole point of the passport: you rate the
        city, but you stamp the trip.
      </p>

      {years.length === 0 && <p className="empty">No visits logged yet.</p>}

      {years.map((group) => (
        <Fragment key={group.year}>
          <div className="year">{group.year}</div>
          {group.visits.map((visit) => {
            const city = requireCity(visit.city);
            const nth = ordinals[visit.id] ?? 1;
            return (
              <Link className="drow" to={`/city/${city.id}`} key={visit.id}>
                <time className="day" dateTime={machineDate(visit)}>
                  {visit.day} {monthOnly(visit.when)}
                  {/* Under the date rather than beside it: the column is
                      narrow, and how long you stayed belongs with when you
                      went rather than with the city's name. */}
                  {typeof visit.nights === "number" && <small>{formatNights(visit.nights)}</small>}
                </time>
                <span className="thumb">
                  <CityPhoto city={city} loading="lazy" />
                </span>
                <span className="dname">
                  {city.name}
                  {/* Your words if you left any, the country if not. The note
                      is a sentence, so it drops the country's label styling. */}
                  <small className={visit.note ? "dnote" : undefined}>{visit.note ?? city.country}</small>
                </span>
                <span className="again">{nth > 1 ? `↻ visit ${nth}` : ""}</span>
                <RateCity city={city} size={15} />
              </Link>
            );
          })}
        </Fragment>
      ))}
    </section>
  );
}

/**
 * The month without its year, since the year is the heading this row sits
 * under. Anything that isn't a plain "Mon YYYY" is left whole rather than
 * chopped at a space.
 */
function monthOnly(when: string): string {
  return /^[A-Za-z]{3} \d{4}$/.test(when) ? when.slice(0, 3) : when;
}

/**
 * The date a `<time>` should carry, or nothing. Visits store the month as a
 * name, and older ones store vaguer things than a month, so this only answers
 * when it is sure.
 */
function machineDate(visit: Visit): string | undefined {
  const [name, year] = visit.when.split(" ");
  const month = MONTH_NAMES.indexOf(name);
  if (month === -1 || !/^\d{4}$/.test(year ?? "")) return undefined;
  return `${year}-${String(month + 1).padStart(2, "0")}-${visit.day}`;
}
