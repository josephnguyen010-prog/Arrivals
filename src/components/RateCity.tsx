import { useState } from "react";
import type { MouseEvent } from "react";
import { ratingOf, visitsFor } from "../lib/ranking";
import { useLog } from "../state/LogContext";
import type { City } from "../types";
import { RateFlow } from "./RateFlow";
import { RateInline } from "./RateInline";

interface RateCityProps {
  city: City;
  size?: number;
  /** Overrides the default "Rate Tokyo" / "Change your rating of Tokyo". */
  label?: string;
}

/**
 * A star row that rates the city it is showing, wherever it appears.
 *
 * Rating from a list means the comparison flow has to be able to open from a
 * list, so this owns the flow rather than making every screen repeat the
 * pending-rating plumbing. Most of these rows sit inside a link to the city, so
 * the click is stopped here: tapping a star rates, tapping anything else on the
 * row still navigates.
 */
export function RateCity({ city, size, label }: RateCityProps) {
  const { log } = useLog();
  const [pending, setPending] = useState<number | null>(null);
  const rating = ratingOf(log, city.id);
  /* A rating is what you made of a place, so it starts where the trip does.
     The log flow asks for one in the same breath as the dates and the spot;
     these stars are for changing it afterwards. Somewhere you have never been
     has nothing to rate, and being able to rank it against cities you have
     been to made the ranking mean less than it says it does. */
  const visited = visitsFor(log, city.id).length > 0;

  function swallow(event: MouseEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <span className="rate-cell" onClick={swallow}>
      <RateInline
        value={rating}
        size={size}
        onPick={setPending}
        readOnly={!visited}
        label={
          !visited
            ? `Log a visit to rate ${city.name}`
            : label ?? (rating === null ? `Rate ${city.name}` : `Change your rating of ${city.name}`)
        }
      />
      {pending !== null && <RateFlow city={city} rating={pending} onDone={() => setPending(null)} />}
    </span>
  );
}
