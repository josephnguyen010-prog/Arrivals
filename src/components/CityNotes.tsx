import { factsFor } from "../data/facts";
import type { City } from "../types";

/**
 * The facts, in the column beside the title block: how the place got there,
 * what to eat, what to see, and one thing worth knowing.
 *
 * They're quiet by type rather than by position — mono labels, muted body,
 * ruled off — which is what keeps them subordinate to a name set in 36pt
 * beside them. A spell as a band under the header proved the point the wrong
 * way round: it read fine and left the column it came out of empty.
 */
export function CityNotes({ city, heading = true }: { city: City; heading?: boolean }) {
  const facts = factsFor(city.id);
  if (!facts) return null;

  return (
    <div className="city-notes">
      {/* The panel's tab is this pane's heading, so it asks for none of its
          own; the friend-visit page has no tabs and keeps it. */}
      {heading && <p className="field-label">Notes</p>}
      <p className="notes-history">{facts.history}</p>

      <div className="notes-cols">
        <NoteColumn heading="Eat" items={facts.dishes} />
        <NoteColumn heading="See" items={facts.landmarks} />
      </div>

      {/* Across the full width of the column rather than as a third of it: it
          is a sentence, and a sentence in a 150-point column is a word a line. */}
      <div className="notes-fact">
        <p className="notes-head">Fun fact</p>
        <p>{facts.fact}</p>
      </div>
    </div>
  );
}

function NoteColumn({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="notes-col">
      <p className="notes-head">{heading}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
