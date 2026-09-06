import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "./Calendar";
import { CITIES, requireCity } from "../data/cities";
import { MONTH_NAMES, formatDate, startOfDay } from "../lib/dates";
import {
  nextOpponent,
  questionsLeft,
  rankOf,
  ratingOf,
  recordAnswer,
  settleEarly,
  visitsFor,
} from "../lib/ranking";
import { inlineCompletion, searchCities } from "../lib/search";
import { StorageFullError } from "../lib/quota";
import { useLog } from "../state/LogContext";
import { useSpots } from "../state/SpotsContext";
import { SPOT_CATEGORIES } from "../types";
import type { CityId, LogState, Placement, SpotCategory } from "../types";
import { CityCard } from "./CityCard";
import { CityPhoto } from "./CityPhoto";
import { Modal } from "./Modal";
import { Stamp } from "./Stamp";
import { StarPicker } from "./StarPicker";
import { Stars } from "./Stars";

/**
 * Two screens, not four: find the city, then say everything about the trip on
 * one panel. The comparisons that follow are the app placing the rating, not
 * another question about the visit.
 */
type Step =
  | { name: "city" }
  | { name: "details"; city: CityId }
  | {
      name: "duel";
      /** Everything the panel said about the trip, carried whole. The
          comparisons that follow are about the rating, not the trip, so this
          rides through them untouched rather than as four loose arguments. */
      trip: TripDetails;
      scratch: LogState;
      placement: Placement;
      /** Every earlier state of the placement, so Back can undo one answer. */
      past: Placement[];
    }
  | { name: "done"; city: CityId; rating: number | null; asked: number };

/** What the details panel settled, minus the rating, which the flow places. */
interface TripDetails {
  when: string;
  day: string;
  nights?: number;
  note?: string;
}

export function LogVisitFlow({ onClose }: { onClose: () => void }) {
  const { log, begin, commitVisit } = useLog();
  const [step, setStep] = useState<Step>({ name: "city" });
  const navigate = useNavigate();

  function commit(placement: Placement | null, trip: TripDetails) {
    const city = placement ? placement.cityId : (step.name === "details" ? step.city : "");
    commitVisit(placement, {
      city,
      when: trip.when,
      day: trip.day,
      nights: trip.nights,
      note: trip.note?.trim() || undefined,
    });
    setStep({
      name: "done",
      city,
      rating: placement?.rating ?? null,
      asked: placement?.asked ?? 0,
    });
  }

  /** Runs the bracket forward; settles immediately when nothing to compare. */
  function advance(scratch: LogState, placement: Placement, trip: TripDetails, past: Placement[]) {
    if (nextOpponent(scratch, placement)) {
      setStep({ name: "duel", trip, scratch, placement, past });
      return;
    }
    commit(placement, trip);
  }

  /**
   * Leaving during the comparisons keeps the visit. By then the city, the date
   * and the rating are all settled and only the order within that rating is
   * still open, so the answers given so far decide the slot. Bailing out three
   * questions in used to throw the whole log away.
   */
  function leave() {
    if (step.name === "duel") {
      const settled = settleEarly(step.placement);
      commitVisit(settled, {
        city: settled.cityId,
        when: step.trip.when,
        day: step.trip.day,
        nights: step.trip.nights,
        note: step.trip.note?.trim() || undefined,
      });
    }
    onClose();
  }

  // A new screen for every question too, so each one animates in and takes
  // focus rather than the cards swapping underneath the cursor.
  const stepKey = step.name === "duel" ? `duel-${step.placement.asked}` : step.name;

  return (
    <Modal onClose={leave} labelledBy="log-title" focusKey={stepKey}>
      <div className="step" key={stepKey}>
        {step.name === "city" && (
          <PickCity onPick={(city) => setStep({ name: "details", city })} onClose={leave} />
        )}

        {step.name === "details" && (
          <Details
            city={step.city}
            onBack={() => setStep({ name: "city" })}
            onClose={leave}
            onSave={({ rating, ...trip }) => {
              if (rating === null) {
                commit(null, trip);
                return;
              }
              const { state, placement } = begin(step.city, rating);
              advance(state, placement, trip, []);
            }}
          />
        )}

        {step.name === "duel" && (
          <Duel
            step={step}
            onAnswer={(challengerWon) => {
              const next = recordAnswer(step.placement, challengerWon);
              advance(step.scratch, next, step.trip, [...step.past, step.placement]);
            }}
            onBack={() => {
              const previous = step.past[step.past.length - 1];
              if (previous) {
                setStep({ ...step, placement: previous, past: step.past.slice(0, -1) });
              } else {
                setStep({ name: "details", city: step.placement.cityId });
              }
            }}
            onSkip={() => commit(settleEarly(step.placement), step.trip)}
          />
        )}

        {step.name === "done" && (
          <Done
            city={step.city}
            rating={step.rating}
            asked={step.asked}
            log={log}
            onDone={() => {
              onClose();
              navigate("/cities");
            }}
          />
        )}
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------- steps --- */

function PickCity({ onPick, onClose }: { onPick: (id: CityId) => void; onClose: () => void }) {
  const { log } = useLog();
  const [term, setTerm] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  /* Nothing until you type. An untouched field used to open onto the whole
     catalogue in alphabetical order, which is a list nobody is reading — and
     it left Amsterdam highlighted, so Enter logged a trip you hadn't chosen. */
  const typed = term.trim().length > 0;
  const matches = useMemo(() => (typed ? searchCities(CITIES, term) : []), [term, typed]);
  const completion = useMemo(() => inlineCompletion(matches, term), [matches, term]);

  // The best match is highlighted, so typing another letter has to reset it.
  useEffect(() => {
    setActive(0);
  }, [term]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(matches.length - 1, current + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
    } else if ((event.key === "Tab" || event.key === "ArrowRight") && completion) {
      // Accept the ghost text. Right-arrow only when the caret is at the end,
      // so it still moves through the text the rest of the time. Take the
      // city's own name rather than appending, or "bar" completes to
      // "barcelona" and keeps the casing you happened to type.
      const atEnd = event.currentTarget.selectionStart === term.length;
      if (event.key === "Tab" || atEnd) {
        event.preventDefault();
        setTerm(matches[0].city.name);
      }
    } else if (event.key === "Enter" && matches[active]) {
      event.preventDefault();
      onPick(matches[active].city.id);
    }
  }

  return (
    <>
      <h2 id="log-title">Step 1 of 2</h2>
      <h3>Where did you go?</h3>
      {/* The ghost sits under a transparent input so the two stay in step;
          both use the same font and padding, so the text lines up exactly. */}
      <div className="typeahead">
        <div className="ghost-text" aria-hidden="true">
          <span className="typed">{term}</span>
          <span className="rest">{completion}</span>
        </div>
        <input
          className="search"
          placeholder="Start typing a city"
          autoComplete="off"
          autoFocus
          role="combobox"
          aria-expanded={matches.length > 0}
          aria-controls="city-matches"
          aria-activedescendant={matches[active] ? `city-option-${matches[active].city.id}` : undefined}
          aria-autocomplete="both"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
      {completion && <p className="ghost-hint">Tab to complete</p>}
      <div className="options" id="city-matches" role="listbox" ref={listRef}>
        {matches.map((match, index) => {
          const { city, at } = match;
          const rating = ratingOf(log, city.id);
          return (
            <button
              key={city.id}
              id={`city-option-${city.id}`}
              className="option"
              role="option"
              aria-selected={index === active}
              data-active={index === active}
              onMouseEnter={() => setActive(index)}
              onClick={() => onPick(city.id)}
            >
              <CityPhoto city={city} />
              <span>
                <b>{at ? highlight(city.name, at) : city.name}</b>
                <small>{city.country}</small>
              </span>
              <span className="right">
                {rating === null ? <small>New</small> : <Stars value={rating} />}
              </span>
            </button>
          );
        })}
        {typed && matches.length === 0 && (
          <p className="empty" style={{ padding: "10px" }}>
            No city called “{term.trim()}”. In the real thing, this is where you would add one.
          </p>
        )}
      </div>
      <Foot onClose={onClose} />
    </>
  );
}

/** Wraps the matched span so you can see why a result is in the list. */
function highlight(name: string, [from, to]: [number, number]) {
  return (
    <>
      {name.slice(0, from)}
      <mark>{name.slice(from, to)}</mark>
      {name.slice(to)}
    </>
  );
}

interface Saved extends TripDetails {
  rating: number | null;
}

/**
 * Everything about the trip on one screen: when you went, how it was, what
 * you'd say about it, and one place worth remembering. Nothing here is
 * required — the screen before it already has the only thing that is.
 */
function Details({
  city,
  onSave,
  onBack,
  onClose,
}: {
  city: CityId;
  onSave: (saved: Saved) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const target = requireCity(city);
  const { log } = useLog();
  const { add: addSpot } = useSpots();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [date, setDate] = useState(today);
  const [picking, setPicking] = useState(false);
  const [rating, setRating] = useState<number | null>(ratingOf(log, city));
  const [nights, setNights] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<SpotCategory>(SPOT_CATEGORIES[0]);
  const [spot, setSpot] = useState("");
  const [error, setError] = useState<string | null>(null);

  function save() {
    // Spots are a separate store with its own quota; a full one shouldn't cost
    // you the visit, so it is written first and only its failure reported.
    if (spot.trim()) {
      try {
        addSpot({ city, category, name: spot.trim() });
      } catch (caught) {
        setError(caught instanceof StorageFullError ? caught.message : "That spot could not be saved.");
        return;
      }
    }
    onSave({
      when: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
      day: String(date.getDate()).padStart(2, "0"),
      // Blank stays blank rather than becoming nought: a trip you didn't
      // measure is not a day trip, and the country totals tell them apart.
      nights: parseNights(nights),
      rating,
      note,
    });
  }

  return (
    <>
      <h2 id="log-title">Step 2 of 2</h2>
      <h3>{target.name}</h3>

      <div className="log-top">
        <span className="log-shot">
          <CityPhoto city={target} alt={target.name} />
        </span>
        <div className="log-when">
          <span className="field-label">Visited on</span>
          {/* A field you open, not a screen you pass through. */}
          <button
            className={picking ? "date-btn on" : "date-btn"}
            aria-expanded={picking}
            data-autofocus
            onClick={() => setPicking((open) => !open)}
          >
            {formatDate(date)}
          </button>

          {/* Optional, and left blank rather than defaulted: the app would
              rather know nothing about a trip's length than assume it. */}
          <label className="log-nights">
            <span className="field-label">Nights</span>
            <input
              className="search"
              type="number"
              min={0}
              max={365}
              placeholder="—"
              value={nights}
              onChange={(event) => setNights(event.target.value)}
            />
          </label>
        </div>
      </div>

      {picking && (
        <Calendar
          value={date}
          max={today}
          onPick={(next) => {
            setDate(next);
            setPicking(false);
          }}
        />
      )}

      <div className="log-field">
        <span className="field-label">How was it?</span>
        <StarPicker value={rating ?? 0} initial={rating ?? 0} onPick={setRating} />
      </div>

      <label className="log-field">
        <span className="field-label">Your note</span>
        <textarea
          className="search note-box"
          rows={2}
          placeholder={`What was ${target.name} like?`}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      <div className="log-field">
        <span className="field-label">And a spot worth remembering</span>
        <div className="chips">
          {SPOT_CATEGORIES.map((option) => (
            <button
              key={option}
              className={option === category ? "chip on" : "chip"}
              aria-pressed={option === category}
              onClick={() => setCategory(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <input
          className="search"
          value={spot}
          placeholder="The one you would actually mention"
          aria-label="Spot name"
          onChange={(event) => setSpot(event.target.value)}
        />
      </div>

      {error && <p className="field-error block">{error}</p>}

      <div className="sheet-foot">
        <button className="ghost" onClick={onBack}>
          ← Back
        </button>
        <span className="foot-pair">
          <button className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="log-btn" onClick={save}>
            Save
          </button>
        </span>
      </div>
    </>
  );
}

/** The month grid. Opened from the date field rather than owning a step. */
function Duel({
  step,
  onAnswer,
  onBack,
  onSkip,
}: {
  step: Extract<Step, { name: "duel" }>;
  onAnswer: (challengerWon: boolean) => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const opponentId = nextOpponent(step.scratch, step.placement);

  // Left and right pick a side. The rest of the flow is keyboard-driven, so
  // reaching for the mouse only here was the one break in the run.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onAnswer(true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onAnswer(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onAnswer]);

  if (!opponentId) return null;

  const challenger = requireCity(step.placement.cityId);
  const opponent = requireCity(opponentId);
  const left = questionsLeft(step.placement);

  return (
    <>
      {/* Still step 3: the comparisons are how the rating is filed, not a
          fourth thing being asked of you. */}
      <h2 id="log-title">Step 3 of 3 · Placing it</h2>
      <h3>
        {challenger.name} or {opponent.name}?
      </h3>
      <p className="hint">
        You gave both {step.placement.rating} stars. Which did you prefer? Leave whenever — the visit
        is saved either way.
      </p>
      <div className="duel">
        <button onClick={() => onAnswer(true)} aria-label={`${challenger.name} was better`}>
          {/* The challenger already has this rating — it just isn't in the log yet. */}
          <CityCard city={challenger} rating={step.placement.rating} />
        </button>
        <span className="vs">OR</span>
        <button onClick={() => onAnswer(false)} aria-label={`${opponent.name} was better`}>
          <CityCard city={opponent} rating={step.placement.rating} />
        </button>
      </div>
      <span className="progress">
        Question {step.placement.asked + 1} · about {left} left · ← / → to choose
      </span>
      <div className="sheet-foot">
        <button className="ghost" onClick={onBack}>
          ← Back
        </button>
        <button className="ghost" onClick={onSkip}>
          Skip the rest →
        </button>
      </div>
    </>
  );
}

function Done({
  city,
  rating,
  asked,
  log,
  onDone,
}: {
  city: CityId;
  /** Null when the visit was logged without one; the stamp goes unfranked. */
  rating: number | null;
  asked: number;
  log: LogState;
  onDone: () => void;
}) {
  const target = requireCity(city);
  const rank = rankOf(log, city);
  const visits = visitsFor(log, city);

  return (
    <div className="result">
      <Stamp city={target} rating={rating} date={visits[0]?.when.toUpperCase()} />
      <p className="verdict-line">
        {rating === null ? `${target.name}, stamped` : `${target.name} is your #${rank.pos}`}
      </p>
      <p>
        {rating === null ? (
          `${visits.length} ${visits.length === 1 ? "visit" : "visits"} logged. Rate it whenever you like.`
        ) : (
          <>
            {rating} stars, {rank.pos} of {rank.total} cities
            {asked > 0 && `, settled in ${asked} ${asked === 1 ? "question" : "questions"}`}.
          </>
        )}
      </p>
      <button className="log-btn" style={{ width: "100%" }} onClick={onDone}>
        See your cities
      </button>
    </div>
  );
}

function Foot({ onBack, onClose }: { onBack?: () => void; onClose: () => void }) {
  return (
    <div className="sheet-foot">
      {onBack ? (
        <button className="ghost" onClick={onBack}>
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button className="ghost" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- when --- */

/** Monday first. Repeated letters are fine here; the cells carry a full label. */

/**
 * The nights field, which is allowed to be empty. Zero is a real answer — a
 * day trip — so it cannot be conflated with "didn't say", which is why this
 * returns undefined rather than 0 for a blank.
 */
function parseNights(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) return undefined;
  return Math.min(365, Math.round(value));
}
