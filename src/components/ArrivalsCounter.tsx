import { useEffect, useState } from "react";
import { visitorsPerYear } from "../data/visitors";
import { formatCount, msPerVisitor, visitorsSoFar } from "../lib/visitors";
import type { City } from "../types";

/**
 * How many people have arrived this year, counting up while you watch.
 *
 * The number is recomputed from the clock on every tick rather than
 * incremented, so it cannot drift: leave the tab in the background for an hour
 * and it comes back with the right figure instead of an hour of missed ticks.
 *
 * The interval is the city's own rate. Hong Kong gets a new arrival about once
 * a second and ticks along; Zanzibar gets one every fifty seconds and mostly
 * sits still, which is the truth about Zanzibar and not worth dressing up.
 */
export function ArrivalsCounter({ city }: { city: City }) {
  const perYear = visitorsPerYear(city.id);
  const [count, setCount] = useState(() => (perYear ? visitorsSoFar(perYear) : 0));

  useEffect(() => {
    if (!perYear) return;
    setCount(visitorsSoFar(perYear));

    /* A counter is motion, and someone who has asked for less of it should get
       the number without the movement — not a blank space where a fact was. */
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (still) return;

    const every = Math.max(400, msPerVisitor(perYear));
    const timer = window.setInterval(() => setCount(visitorsSoFar(perYear)), every);
    return () => window.clearInterval(timer);
  }, [perYear]);

  if (!perYear) return null;

  return (
    <p className="arrivals-count">
      {/* The digits change every second or two, and a screen reader announcing
          that would be a stream of noise. The moving number is hidden from the
          accessibility tree; the line underneath says the same thing once. */}
      <b aria-hidden="true">{formatCount(count)}</b>
      <span aria-hidden="true">Travelled here so far this year</span>
      <span className="sr-only">
        About {formatCount(count)} people have travelled to {city.name} so far this year.
      </span>
    </p>
  );
}
