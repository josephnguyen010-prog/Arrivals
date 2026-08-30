import { useState } from "react";
import { BUDGET_LEVELS, dailyCostFor, type BudgetLevelId } from "../data/costs";
import type { City } from "../types";

/**
 * A number to plan against, not a quote: pick a pace and a length and see
 * what the trip runs. Sits by the wishlist button because that is the
 * moment the question comes up — before the city is on the board, not after.
 */
export function TripCost({ city }: { city: City }) {
  const [days, setDays] = useState(5);
  const [budgetId, setBudgetId] = useState<BudgetLevelId>("comfortable");

  const daily = dailyCostFor(city.id);
  if (daily === undefined) return null;

  const level = BUDGET_LEVELS.find((candidate) => candidate.id === budgetId)!;
  const perDay = Math.round(daily * level.multiplier);
  const total = perDay * days;

  return (
    <div className="trip-cost">
      <p className="field-label">Trip cost</p>

      <div className="cost-controls">
        <div className="budget-toggle" role="radiogroup" aria-label={`Budget level for ${city.name}`}>
          {BUDGET_LEVELS.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              className={candidate.id === budgetId ? "budget-opt on" : "budget-opt"}
              role="radio"
              aria-checked={candidate.id === budgetId}
              onClick={() => setBudgetId(candidate.id)}
            >
              {candidate.label}
            </button>
          ))}
        </div>

        <label className="days-field">
          <span>Days</span>
          <input
            type="number"
            min={1}
            max={60}
            value={days}
            onChange={(event) => setDays(clampDays(Number(event.target.value)))}
          />
        </label>
      </div>

      <div className="cost-total">
        <b>${total.toLocaleString()}</b>
        <span>
          ${perDay}/day · {days} {days === 1 ? "day" : "days"}
        </span>
      </div>

      <p className="cost-disclaimer">Rough estimate, not a live quote — flights aren't in it.</p>
    </div>
  );
}

function clampDays(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(60, Math.max(1, Math.round(value)));
}
