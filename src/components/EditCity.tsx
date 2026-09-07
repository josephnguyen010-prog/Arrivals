import { useState } from "react";
import { ratingOf, visitsFor } from "../lib/ranking";
import { useLog } from "../state/LogContext";
import type { City } from "../types";
import { Modal } from "./Modal";
import { RateFlow } from "./RateFlow";
import { RateInline } from "./RateInline";

interface EditCityProps {
  city: City;
  onClose: () => void;
}

/**
 * Changing your mind, without going back through logging a visit. Re-rating
 * hands off to RateFlow, which owns the comparison and the write — a rating
 * you did not place is just a tie waiting to happen, and it should behave the
 * same here as it does from a star on a card.
 */
export function EditCity({ city, onClose }: EditCityProps) {
  const { log, removeCity, removeVisit } = useLog();
  const [pending, setPending] = useState<number | null>(null);

  const rating = ratingOf(log, city.id);
  const visits = visitsFor(log, city.id);

  // Handed over entirely: RateFlow puts up its own sheet, and closes this one
  // with it once the rating is placed.
  if (pending !== null) {
    return <RateFlow city={city} rating={pending} onDone={onClose} />;
  }

  return (
    <Modal onClose={onClose} labelledBy="edit-title">
      <h2 id="edit-title">Edit</h2>
      <h3>{city.name}</h3>

      <div className="edit-row">
        <div>
          <b>Rating</b>
          {/* Editable in place — the same control as the city page, and gated
              the same way: a rating comes out of a trip, so there is nothing
              to change until one is logged. */}
          <RateInline
            value={rating}
            size={18}
            onPick={setPending}
            readOnly={visits.length === 0}
            label={visits.length === 0 ? `Log a visit to rate ${city.name}` : `Rate ${city.name}`}
          />
        </div>
        <span className="edit-hint">{visits.length === 0 ? "Log a visit first" : "Tap the stars"}</span>
      </div>

      <p className="field-label">Visits</p>
      {visits.length === 0 ? (
        <p className="empty">None logged.</p>
      ) : (
        <ul className="edit-visits">
          {visits.map((visit) => (
            <li key={visit.id}>
              <time>
                {visit.day} {visit.when}
              </time>
              <button
                className="ghost"
                onClick={() => removeVisit(visit.id)}
                aria-label={`Remove the visit on ${visit.day} ${visit.when}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="sheet-foot">
        <button
          className="ghost danger"
          onClick={() => {
            removeCity(city.id);
            onClose();
          }}
        >
          Remove from your log
        </button>
        <button className="ghost" onClick={onClose}>
          Done
        </button>
      </div>
    </Modal>
  );
}
