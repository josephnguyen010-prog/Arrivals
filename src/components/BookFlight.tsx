import { useEffect, useMemo, useState } from "react";
import { Calendar } from "./Calendar";
import { FlightList } from "./FlightList";
import { BOOKING_HORIZON_DAYS, bookingLinks, isoDate } from "../lib/booking";
import { addDays, formatDate, startOfDay } from "../lib/dates";
import {
  fetchLiveFlights,
  liveFlightsEnabled,
  type LiveFlights,
} from "../lib/liveFlights";

/**
 * The half of the ticket the app can't print. Everything on the pass beside
 * this is derived — a distance, a duration, a modelled fare — and none of it
 * can be bought. This is the handoff: pick the dates, then go where the seats
 * actually are.
 *
 * With `VITE_FLIGHTS_API` set it also lists what is actually flying — airline,
 * times, stops and price, through a serverless proxy holding the key. Without
 * it, and on every failure, the panel is exactly what it was: a modelled fare
 * and three search links. The fallback is the feature, not the consolation.
 * A visitor cannot act on "quota exhausted" and should never be shown it.
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

  const [live, setLive] = useState<LiveFlights | null>(null);
  const [loading, setLoading] = useState(false);

  // Keyed on the query rather than the Date objects, which are new on every
  // render and would refetch forever.
  const departKey = isoDate(depart);
  const backKey = back ? isoDate(back) : "";

  useEffect(() => {
    if (!to || !liveFlightsEnabled()) return;

    const controller = new AbortController();
    setLoading(true);
    setLive(null);

    fetchLiveFlights(
      { from, to, depart: departKey, back: backKey || undefined },
      { signal: controller.signal },
    ).then((result) => {
      if (controller.signal.aborted) return;
      setLive(result);
      setLoading(false);
    });

    return () => controller.abort();
  }, [from, to, departKey, backKey]);

  // Without both airports there is nothing to search for. The pass shows the
  // city's name on its own in that case, and this shows nothing at all.
  if (!to) return null;

  const links = bookingLinks({ from, to, depart, back });

  // The panel has one height, shared with the ticket, so the listings and the
  // three fallback buttons cannot both have it. Live wins when it has anything.
  const showLive = liveFlightsEnabled() && (loading || live !== null);

  return (
    <div className={picking ? "book picking" : "book"}>
      <div className="book-head">
        <p className="field-label">Book it</p>
        {showLive && (
          <span className="book-live-tag">
            Live · Google Flights
          </span>
        )}
      </div>

      {/* Depart and Nights sit side by side, and the calendar hangs off the pair
          rather than the flow. The panel is height-locked to the pass beside it,
          so a picker that pushed the layout would stretch the ticket open every
          time — and a stacked column of fields wouldn't fit the ticket's height
          at all. */}
      <div className="book-picker">
        <div className="book-fields">
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

          <div className="book-field nights">
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

          <div className="book-field book-back">
            <span className="book-label">Back</span>
            <span className="book-static" id="book-return">
              {back ? formatDate(back) : "One way"}
            </span>
          </div>
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

      {showLive && (
        <div className="book-live">
          {loading && (
            <p className="book-status">Checking what&rsquo;s flying&hellip;</p>
          )}
          {live && <FlightList flights={live.flights} cheapest={live.lowest} />}
        </div>
      )}

      <div className={showLive ? "book-links compact" : "book-links"}>
        {links.map((link) => (
          <a
            key={link.id}
            className={
              !showLive && link.id === "google" ? "book-go primary" : "book-go"
            }
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {link.label}
            {!showLive && link.id === "google" && (
              <span aria-hidden="true"> →</span>
            )}
          </a>
        ))}
      </div>

      {/* The list says where the numbers came from, so the note only earns its
          height when there is no list. */}
      {!showLive && (
        <p className="book-note">
          A live search for {cityName}. Arrivals doesn&rsquo;t sell tickets, so
          those prices are real.
        </p>
      )}
    </div>
  );
}

function clampNights(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(90, Math.max(0, Math.round(value)));
}
