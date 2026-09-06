import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { MONTH_NAMES, addDays, addMonths, daysInMonth } from "../lib/dates";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * The calendar, built here rather than handed to `<input type="date">`, which
 * brings the OS's own styling with it — the one element on a page that can
 * never be made to match.
 *
 * It runs in both directions. Logging a visit bounds it with a `max` of today,
 * because you cannot have been somewhere next week; booking a flight bounds it
 * with a `min` of today and a `max` a year out, because no airline sells
 * further ahead than that. Same control, opposite ends, so the app only has
 * one date picker to keep good.
 */
export function Calendar({
  value,
  min,
  max,
  onPick,
}: {
  value: Date;
  min?: Date;
  max?: Date;
  onPick: (date: Date) => void;
}) {
  const [cursor, setCursor] = useState(value);
  const gridRef = useRef<HTMLDivElement>(null);
  // Set by the arrow keys, read after the move. Asking where the focus is
  // afterwards doesn't work: crossing into a month whose days are out of
  // bounds disables the button that had it, and the browser blurs a disabled
  // element - so by then the focus is on <body> and the trail is cold.
  const chasing = useRef(false);

  // Arrow keys move the cursor in state; the focus has to follow it, or the
  // ring stays on the day you started from. Paging with the mouse leaves the
  // flag clear, so it doesn't yank focus off the arrow you just clicked.
  useEffect(() => {
    if (!chasing.current) return;
    chasing.current = false;
    gridRef.current?.querySelector<HTMLElement>("[data-cursor]")?.focus();
  }, [cursor]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const length = daysInMonth(year, month);
  // Monday first: getDay() is Sunday-based, so shift it.
  const blanks = (new Date(year, month, 1).getDay() + 6) % 7;

  const atMax = !!max && year === max.getFullYear() && month === max.getMonth();
  const atMin = !!min && year === min.getFullYear() && month === min.getMonth();

  /** Moves the cursor, refusing to leave the range it was given. */
  function moveTo(next: Date) {
    if (max && next > max) return setCursor(max);
    if (min && next < min) return setCursor(min);
    setCursor(next);
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    chasing.current = true;
    // The grid re-renders around the new cursor, so this walks into the
    // previous or next month at the edges without any special casing.
    moveTo(addDays(cursor, step));
  }

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          className="cal-step"
          aria-label="Previous year"
          disabled={atMin}
          onClick={() => moveTo(addMonths(cursor, -12))}
        >
          «
        </button>
        <button
          className="cal-step"
          aria-label="Previous month"
          disabled={atMin}
          onClick={() => moveTo(addMonths(cursor, -1))}
        >
          ‹
        </button>
        <span className="cal-title" aria-live="polite">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          className="cal-step"
          aria-label="Next month"
          disabled={atMax}
          onClick={() => moveTo(addMonths(cursor, 1))}
        >
          ›
        </button>
        <button
          className="cal-step"
          aria-label="Next year"
          disabled={atMax}
          onClick={() => moveTo(addMonths(cursor, 12))}
        >
          »
        </button>
      </div>

      {/* One tab stop for the whole grid, arrow keys inside it — tabbing
          through thirty-one days to reach the one you want is not a date
          picker, it's a punishment. */}
      <div className="cal-grid" role="grid" aria-label="Pick a date" ref={gridRef} onKeyDown={onKeyDown}>
        {WEEKDAYS.map((day, index) => (
          <span key={index} className="cal-dow" aria-hidden="true">
            {day}
          </span>
        ))}
        {Array.from({ length: blanks }, (_, index) => (
          <span key={`blank${index}`} />
        ))}
        {Array.from({ length }, (_, index) => {
          const day = index + 1;
          const date = new Date(year, month, day);
          const outOfRange = (!!max && date > max) || (!!min && date < min);
          const chosen = date.getTime() === value.getTime();
          const onCursor = day === cursor.getDate();
          return (
            <button
              key={day}
              className={chosen ? "cal-day today" : "cal-day"}
              disabled={outOfRange}
              // Only the cursor is tabbable, so Tab leaves the grid rather
              // than walking it. Arrow keys move within.
              tabIndex={onCursor ? 0 : -1}
              data-cursor={onCursor ? true : undefined}
              aria-label={`${day} ${MONTH_NAMES[month]} ${year}`}
              onClick={() => onPick(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
