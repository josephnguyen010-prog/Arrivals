import { useMemo, useState } from "react";
import { Calendar } from "./Calendar";
import { BOOKING_HORIZON_DAYS, bookingLinks } from "../lib/booking";
import { addDays, formatDate, startOfDay } from "../lib/dates";

/**
 * The half of the ticket the app can't print. Everything on the pass beside
 * this is derived — a distance, a duration, a modelled fare — and none of it
 * can be bought. This is the handoff: pick the dates, then go where the seats
 * actually are.
 *
 * Deliberately not a listings table. Rendering live flights would mean quoting
 * prices Arrivals can't honour, through a booking flow it doesn't have, off a
 * feed that costs money and goes stale between the fetch and the click. The
 * link is worth more than the table, because what it opens is true.
 */
export function BookFlight({
  from,
  to,
  cityName,
}: {
  from: string;
  to?: string;
  cityName: string;
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [depart, setDepart] = useState(() => addDays(today, 30));
  const [nights, setNights] = useState(7);
  const [picking, setPicking] = useState(false);

  const horizon = useMemo(() => addDays(today, BOOKING_HORIZON_DAYS), [today]);
  const back = nights > 0 ? addDays(depart, nights) : undefined;

  // Without both airports there is nothing to search for. The pass shows the
  // city's name on its own in that case, and this shows nothing at all.
  if (!to) return null;

  const links = bookingLinks({ from, to, depart, back });

  return (
    <div className={picking ? "book picking" : "book"}>
      <p className="field-label">Book it</p>

      {/* The calendar hangs off this rather than sitting in the flow: the panel
          is height-locked to the pass beside it, so a picker that pushed the
          layout would stretch the ticket every time it opened. */}
      <div className="book-date">
        <div className="book-field">
          <span className="book-label">Depart</span>
          <button
            className={picking ? "date-btn on" : "date-btn"}
            aria-expanded={picking}
            onClick={() => setPicking((open) => !open)}
          >
            {formatDate(depart)}
          </button>
        </div>

        {picking && (
          <Calendar
            value={depart}
            min={today}
            max={horizon}
            onPick={(next) => {
              setDepart(next);
              setPicking(false);
            }}
          />
        )}
      </div>

      <div className="book-field">
        <span className="book-label">Nights</span>
        <input
          type="number"
          min={0}
          max={90}
          value={nights}
          aria-describedby="book-return"
          onChange={(event) =>
            setNights(clampNights(Number(event.target.value)))
          }
        />
      </div>

      <p className="book-return" id="book-return">
        {back ? `Back ${formatDate(back)}` : "One way"}
      </p>

      <div className="book-links">
        {links.map((link) => (
          <a
            key={link.id}
            className={link.id === "google" ? "book-go primary" : "book-go"}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {link.label}
            {link.id === "google" && <span aria-hidden="true"> →</span>}
          </a>
        ))}
      </div>

      <p className="book-note">
        Opens a live search for {cityName}. Arrivals doesn't sell tickets, so
        the seats and the prices are theirs — and unlike the fare above, they're
        real.
      </p>
    </div>
  );
}

function clampNights(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(90, Math.max(0, Math.round(value)));
}
