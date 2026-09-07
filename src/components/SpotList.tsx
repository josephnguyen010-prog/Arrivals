import { Fragment, useState } from "react";
import { SPOT_PHOTO_CREDITS, commonsUrl } from "../data/credits";
import { linkLabel } from "../lib/spots";
import { useSpots } from "../state/SpotsContext";
import { SPOT_CATEGORIES } from "../types";
import type { City, Spot } from "../types";
import { SpotForm } from "./SpotForm";

/** Grouped by category, because that is how you'd ask for one. */
export function SpotList({
  city,
  empty,
}: {
  city: City;
  /** What an empty list reads as. `null` prints nothing, for the screens where
      you cannot add one anyway — an invitation you can't accept is worse than
      no line at all. */
  empty?: string | null;
}) {
  const { forCity } = useSpots();
  const [editing, setEditing] = useState<Spot | null>(null);
  const spots = forCity(city.id);

  if (spots.length === 0) {
    if (empty === null) return null;
    return <p className="empty">{empty ?? "Nothing yet. The first one is usually where you ate."}</p>;
  }

  return (
    <>
      <div className="spot-groups">
        {SPOT_CATEGORIES.map((category) => {
          const inCategory = spots.filter((spot) => spot.category === category);
          if (inCategory.length === 0) return null;

          return (
            <div className="spot-group" key={category}>
              <p className={category === "Skip it" ? "spot-cat warn" : "spot-cat"}>{category}</p>
              <ul className="spot-list">
                {inCategory.map((spot) => (
                  <li key={spot.id}>
                    {spot.photo && <img className="spot-photo" src={spot.photo} alt="" loading="lazy" />}
                    <div className="spot-body">
                      <b>{spot.name}</b>
                      {spot.note && <p>{spot.note}</p>}
                      {spot.url && (
                        <a href={spot.url} target="_blank" rel="noreferrer noopener" className="spot-link">
                          {linkLabel(spot.url)} ↗
                        </a>
                      )}
                    </div>
                    {/* Edit rather than delete: a spot is a sentence you wrote,
                        and the only thing you could do to it was throw it away.
                        Removing lives inside the form now. */}
                    <button
                      className="ghost spot-edit"
                      onClick={() => setEditing(spot)}
                      aria-label={`Edit ${spot.name}`}
                    >
                      ✎
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <SpotPhotoCredits spots={spots} />

      {editing && <SpotForm city={city} spot={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

/**
 * One line for the whole section rather than a caption per thumbnail, which at
 * 84px would be several times longer than the photo is wide. Same obligation as
 * the city photo: CC BY has to name the photographer to whoever is looking.
 */
function SpotPhotoCredits({ spots }: { spots: Spot[] }) {
  const seen = new Set<string>();
  const credits = [];

  for (const spot of spots) {
    const credit = spot.photo ? SPOT_PHOTO_CREDITS[spot.photo] : undefined;
    if (!credit || seen.has(credit.file)) continue;
    seen.add(credit.file);
    credits.push(credit);
  }

  if (credits.length === 0) return null;

  return (
    <details className="photo-credit spot-credits">
      <summary>Photo credits</summary>
      <p>
        {credits.map((credit, index) => (
          <Fragment key={credit.file}>
            {index > 0 && " · "}
            <a href={commonsUrl(credit.file)} target="_blank" rel="noreferrer noopener">
              {credit.author}
            </a>{" ("}
            {credit.licenceUrl ? (
              <a href={credit.licenceUrl} target="_blank" rel="noreferrer noopener">
                {credit.licence}
              </a>
            ) : (
              credit.licence
            )}
            {")"}
          </Fragment>
        ))}
        , cropped
      </p>
    </details>
  );
}
