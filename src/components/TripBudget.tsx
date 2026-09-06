import { Link } from "react-router-dom";
import { BUDGET_LEVELS, type BudgetLevelId } from "../data/costs";
import { tripCost } from "../lib/tripCost";
import { useProfile } from "../state/ProfileContext";
import type { City } from "../types";

/**
 * What the trip costs, both halves of it, with the total as the headline.
 *
 * This replaced a block that priced the days on the ground and then admitted
 * in eleven-pixel type that the flight was not in it — while the flight sat
 * priced on the boarding pass further down the same page. Which half is bigger
 * flips from city to city, so the reader had no way to know whether the number
 * they were looking at was most of the answer or a fifth of it.
 *
 * The length of the trip is owned by the page and shared with the booking
 * panel, so there is one trip on the screen rather than two that disagree.
 */
export function TripBudget({
  city,
  nights,
  onNights,
  budgetId,
  onBudget,
}: {
  city: City;
  nights: number;
  onNights: (nights: number) => void;
  budgetId: BudgetLevelId;
  onBudget: (id: BudgetLevelId) => void;
}) {
  const { profile } = useProfile();
  const cost = tripCost(city, profile.homeAirport, nights, budgetId);
  if (!cost) return null;

  return (
    <div className="budget">
      <div className="budget-head">
        <b>${cost.total.toLocaleString()}</b>
        <span>
          {nights} {nights === 1 ? "night" : "nights"} · {labelFor(budgetId)}
        </span>
      </div>

      <dl className="budget-split">
        <div>
          <dt>Flights</dt>
          <dd>
            {cost.flights !== null ? (
              `$${cost.flights.toLocaleString()}`
            ) : cost.alreadyThere ? (
              <span className="budget-none">you live there</span>
            ) : (
              <Link to="/">set your airport</Link>
            )}
          </dd>
        </div>
        <div>
          <dt>On the ground</dt>
          <dd>${cost.ground.toLocaleString()}</dd>
        </div>
      </dl>

      <div className="budget-controls">
        <div className="budget-toggle" role="radiogroup" aria-label={`How to travel in ${city.name}`}>
          {BUDGET_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              className={level.id === budgetId ? "budget-opt on" : "budget-opt"}
              role="radio"
              aria-checked={level.id === budgetId}
              onClick={() => onBudget(level.id)}
            >
              {level.label}
            </button>
          ))}
        </div>

        <label className="budget-nights">
          <span>Nights</span>
          <input
            type="number"
            min={1}
            max={60}
            value={nights}
            onChange={(event) => onNights(clampNights(Number(event.target.value)))}
          />
        </label>
      </div>

      <p className="cost-disclaimer">
        Both halves are estimates — ${cost.perNight}/night on the ground
        {cost.fromCode && cost.flights !== null && `, a return fare from ${cost.fromCode}`}. Not a
        quote.
      </p>
    </div>
  );
}

function labelFor(id: BudgetLevelId): string {
  return BUDGET_LEVELS.find((level) => level.id === id)?.label ?? "";
}

function clampNights(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(60, Math.max(1, Math.round(value)));
}
