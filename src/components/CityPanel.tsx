import { useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { CityNotes } from "./CityNotes";
import { anyoneBeen, WhoElse } from "./WhoElse";
import { TripBudget } from "./TripBudget";
import type { BudgetLevelId } from "../data/costs";
import type { City } from "../types";

/**
 * The facts and the cost, in one panel you turn rather than two stacked down
 * the page.
 *
 * They were separate blocks in separate columns, and the page could never make
 * them agree: each sat under a different amount of content, so they started
 * out of step, and whichever column was shorter grew an obvious hole. Turning
 * one panel has no such problem — there is only ever one block, and its height
 * is whichever pane is taller.
 *
 * Semantically tabs rather than a carousel, because the panes are named things
 * you choose between and not a sequence you page through. The arrows are there
 * because it reads as a carousel, and they cycle.
 */
export function CityPanel({
  city,
  nights,
  onNights,
  budgetId,
  onBudget,
  currentEntry,
  openOn,
}: {
  city: City;
  nights: number;
  onNights: (nights: number) => void;
  budgetId: BudgetLevelId;
  onBudget: (id: BudgetLevelId) => void;
  /** The feed entry whose page this is, printed in full at the top of "Who
      else has been" instead of clamped and linked to itself. */
  currentEntry?: string;
  /** Which pane to open on. A friend's write-up opens on theirs, because on
      that screen the pane is the write-up — landing on the city's history
      would hide the thing the page was opened to read. */
  openOn?: string;
}) {
  const panes = [
    { id: "notes", label: "Notes", node: <CityNotes city={city} heading={false} /> },
    {
      id: "cost",
      label: "What it costs",
      node: (
        <TripBudget
          city={city}
          nights={nights}
          onNights={onNights}
          budgetId={budgetId}
          onBudget={onBudget}
        />
      ),
    },
  ];

  /* Only when somebody has. Sixty-two of the eighty cities have no entry,
     and an always-present tab would open on "nobody you follow has been" for
     most of the catalogue — a tab asks to be clicked in a way a section below
     the fold does not. */
  if (anyoneBeen(city.id)) {
    panes.push({
      id: "who",
      label: "Who else has been",
      node: <WhoElse city={city.id} heading={false} current={currentEntry} />,
    });
  }

  /* After the panes exist, so an opening tab can be named rather than counted;
     lazily, so turning the panel by hand isn't undone on the next render. */
  const [index, setIndex] = useState(() => {
    const wanted = panes.findIndex((pane) => pane.id === openOn);
    return wanted === -1 ? 0 : wanted;
  });

  const go = (next: number) => setIndex((next + panes.length) % panes.length);

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  }

  return (
    <div className="city-panel">
      {/* Named tabs rather than dots. Two 7px dots said there was a second
          thing without saying what, which is the whole problem with a
          carousel: the content past the first slide may as well not exist.
          The tabs double as each pane's heading, so naming them costs no
          height — the panes stopped printing their own. */}
      <div className="panel-tabs" role="tablist" aria-label="City details" onKeyDown={onKeyDown}>
        {panes.map((pane, i) => (
          <button
            key={pane.id}
            type="button"
            role="tab"
            id={`tab-${city.id}-${pane.id}`}
            aria-controls={`pane-${city.id}-${pane.id}`}
            aria-selected={i === index}
            // Only the selected tab is tabbable; the arrow keys move between
            // them, which is the pattern a tablist is supposed to follow.
            tabIndex={i === index ? 0 : -1}
            className={i === index ? "panel-tab on" : "panel-tab"}
            onClick={() => setIndex(i)}
          >
            {pane.label}
          </button>
        ))}
      </div>

      {/* Both panes stay in the layout, stacked in one grid cell, so the panel
          is always as tall as the taller of them. Showing one and unmounting
          the other would resize the page under the cursor on every turn. */}
      <div className="panel-stack">
        {panes.map((pane, i) => (
          <div
            key={pane.id}
            className={i === index ? "panel-pane on" : "panel-pane"}
            role="tabpanel"
            id={`pane-${city.id}-${pane.id}`}
            aria-labelledby={`tab-${city.id}-${pane.id}`}
            aria-hidden={i !== index}
          >
            {pane.node}
          </div>
        ))}
      </div>
    </div>
  );
}
