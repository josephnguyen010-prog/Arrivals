import { useState } from "react";
import { MONTHS } from "../data/fares";
import type { SeasonSpread } from "../lib/tripCost";

/**
 * What the fare does across a year, as twelve bars.
 *
 * The page already names the cheapest month and says what it saves. What it
 * cannot say in words is the *shape*: that the dear season is a plateau rather
 * than a spike, that December has a bump of its own, and that below the equator
 * the whole thing is upside down. That is the one thing the seasonal model
 * knows and the rest of the page throws away.
 *
 * Deliberately without printed figures. Every number it could label — the
 * range, the extremes, the months themselves — is already somewhere else in
 * this section, and putting them here would be the fourth time this page has
 * printed the same value twice. The values arrive on hover, in the heading,
 * and in full for a screen reader.
 */
export function FareYear({ season, fromCode }: { season: SeasonSpread; fromCode: string | null }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const dearest = Math.max(...season.byMonth);
  if (!Number.isFinite(dearest) || dearest <= 0) return null;

  const reading = hovered === null ? null : `${MONTHS[hovered]} · $${season.byMonth[hovered].toLocaleString()}`;

  return (
    <div className="fareyear">
      <p className="field-label">
        {reading ?? "The year in fares"}
        {!reading && fromCode && <span className="fy-from">from {fromCode}</span>}
      </p>

      <ul
        className="fy-bars"
        onMouseLeave={() => setHovered(null)}
        role="img"
        aria-label={`Return fare by month${fromCode ? ` from ${fromCode}` : ""}: cheapest in ${season.cheapestMonth}, dearest in ${season.peakMonth}.`}
      >
        {season.byMonth.map((usd, index) => {
          const month = MONTHS[index];
          const low = month === season.cheapestMonth;
          const high = month === season.peakMonth;
          const mark = low ? "fy-col low" : high ? "fy-col high" : "fy-col";

          return (
            <li
              key={month}
              className={hovered === index ? `${mark} on` : mark}
              onMouseEnter={() => setHovered(index)}
            >
              {/* Anchored at nought, not at the cheapest month. Starting the
                  scale at the minimum would turn a fare that varies by half
                  into one that looks like it varies by all of it. */}
              <span className="fy-track">
                <span className="fy-bar" style={{ height: `${(usd / dearest) * 100}%` }} />
              </span>
              <span className="fy-month" aria-hidden="true">
                {month[0]}
              </span>
              <span className="sr-only">
                {month}: ${usd.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
