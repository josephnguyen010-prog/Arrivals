import { useMemo, useState } from "react";
import { airportByCode, searchAirports } from "../data/airports";

/**
 * A search box, not a dropdown of 43 cities — home is wherever you actually
 * fly from, which for most people isn't on Arrivals' own list. Type a city,
 * a region, or the code itself if you already know it.
 */
export function AirportPicker({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [term, setTerm] = useState("");
  const selected = value ? airportByCode(value) : undefined;
  const matches = useMemo(() => searchAirports(term).slice(0, 6), [term]);

  return (
    <div className="airport-picker">
      <input
        className="search"
        placeholder="Nearest city, region, or airport code"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />

      {selected && !term.trim() && (
        <p className="airport-current">
          Currently <b>{selected.city}</b> ({selected.code})
        </p>
      )}

      {term.trim() && (
        <div className="airport-matches">
          {matches.length === 0 && <p className="empty">No airport near “{term.trim()}” in this list.</p>}
          {matches.map((airport) => (
            <button
              key={airport.code}
              type="button"
              className="airport-opt"
              onClick={() => {
                onChange(airport.code);
                setTerm("");
              }}
            >
              <b>{airport.city}</b>
              <span>{airport.code}</span>
              <small>{airport.region}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
