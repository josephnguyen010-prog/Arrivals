import { useId, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { BOX, offsets, rowWidth, starPath } from "./starGeometry";

interface RateInlineProps {
  value: number | null;
  size?: number;
  /** Called with the picked rating; the caller decides what happens next. */
  onPick: (rating: number) => void;
  label: string;
  /**
   * Draws the same row but does not take a rating. The empty stars still have
   * to be shown — they are how a city says it is unrated — so this is not the
   * read-only `Stars`, which draws nothing at all for a null value.
   */
  readOnly?: boolean;
}

const GAP = 3;
const ROW = rowWidth(GAP);

/**
 * A star row you can click. Same geometry as the read-only Stars, so a rating
 * looks identical whether or not it happens to be editable — it just responds.
 * Hovering previews; leaving puts the real value back.
 */
export function RateInline({ value, size = 22, onPick, label, readOnly }: RateInlineProps) {
  const gradientId = useId();
  const [hover, setHover] = useState(0);
  const shown = hover || value || 0;
  const height = size * 1.15;

  function valueFrom(event: MouseEvent<SVGSVGElement>): number {
    const box = event.currentTarget.getBoundingClientRect();
    const fraction = (event.clientX - box.left) / box.width;
    return Math.min(5, Math.max(0.5, Math.ceil(fraction * 10) / 2));
  }

  function onKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const current = value ?? 0;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onPick(Math.min(5, current + 0.5));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onPick(Math.max(0.5, current - 0.5));
    }
  }

  /* Not a disabled slider but not a slider at all: there is no value to
     adjust and nothing a keyboard could do with it, so it announces itself as
     an image and leaves the tab order alone. The label says why. */
  const interaction = readOnly
    ? ({ role: "img", "aria-label": label } as const)
    : ({
        role: "slider",
        tabIndex: 0,
        "aria-label": label,
        "aria-valuemin": 0.5,
        "aria-valuemax": 5,
        "aria-valuenow": value ?? undefined,
        "aria-valuetext": value === null ? "Not rated" : `${value} out of 5 stars`,
        onMouseMove: (event: MouseEvent<SVGSVGElement>) => setHover(valueFrom(event)),
        onMouseLeave: () => setHover(0),
        onClick: (event: MouseEvent<SVGSVGElement>) => onPick(valueFrom(event)),
        onKeyDown,
      } as const);

  return (
    <svg
      className={readOnly ? "stars rate-inline locked" : "stars rate-inline"}
      viewBox={`0 0 ${ROW} ${BOX}`}
      height={height}
      width={(height * ROW) / BOX}
      {...interaction}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2={ROW} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset={`${(shown / 5) * 100}%`} style={{ stopColor: "var(--accent)" }} />
          <stop offset={`${(shown / 5) * 100}%`} style={{ stopColor: "var(--star-empty)" }} />
        </linearGradient>
      </defs>
      {offsets(GAP).map((offset) => (
        <path key={offset} d={starPath(offset)} fill={`url(#${gradientId})`} />
      ))}
    </svg>
  );
}
