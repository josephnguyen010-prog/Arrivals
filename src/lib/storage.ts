import type { LogState, Visit } from "../types";
import { SEED_LOG } from "../data/seed";

const KEY = "arrivals.log.v1";
/** Pre-rename key. Read once so a rename doesn't wipe someone's log. */
const LEGACY_KEY = "postmark.log.v1";
/** Set once the seeded reviews have been offered to an older log. */
const REVIEWS_BACKFILLED = "arrivals.reviews.backfilled";
/** The same, for the trip lengths the seeded visits gained later. */
const NIGHTS_BACKFILLED = "arrivals.nights.backfilled";

/**
 * Local-only for now. Swapping this pair of functions for a Supabase table is
 * the whole migration — nothing above this file knows where the log lives.
 */
export function loadLog(): LogState {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return SEED_LOG;
    const parsed = JSON.parse(raw) as Partial<LogState>;
    if (!parsed || typeof parsed !== "object" || !parsed.rated || !Array.isArray(parsed.visits)) {
      return SEED_LOG;
    }
    const stored = parsed.reviews && typeof parsed.reviews === "object" ? parsed.reviews : {};
    return {
      rated: parsed.rated,
      visits: backfillNights(parsed.visits),
      // Logs written before Departures existed have no wishlist.
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      reviews: backfillReviews(stored),
    };
  } catch {
    // Corrupt or unavailable storage shouldn't cost you the app.
    return SEED_LOG;
  }
}

/**
 * The seeded reviews, handed to a log that predates them. Anyone who opened the
 * app before reviews existed had an empty map saved back over the seed on the
 * very first render, and every city read "Nothing yet" from then on.
 *
 * Once, and recorded, rather than any time the map is empty: deleting your last
 * review is a decision, and it shouldn't summon nine more back on the next
 * reload. Anything you have written wins the merge.
 *
 * Reads only. The marker is written by the save that follows, because this runs
 * inside a useState initializer — which StrictMode calls twice, and the second
 * call would have seen a marker the first one had just set, and handed back the
 * empty map it was meant to fill.
 */
function backfillReviews(stored: Record<string, string>): Record<string, string> {
  try {
    if (localStorage.getItem(REVIEWS_BACKFILLED)) return stored;
    return { ...SEED_LOG.reviews, ...stored };
  } catch {
    // No storage to read the marker from; leave the log exactly as it came.
    return stored;
  }
}

/**
 * The seeded trips' lengths, handed to a log that predates the field.
 *
 * Same shape of problem as the reviews above, and the same answer: anyone who
 * opened the app before `nights` existed has the seeded visits saved back
 * without it, so every screen that shows a length would show nothing for them
 * for ever — which reads as the feature being broken rather than the data
 * being old.
 *
 * Matched on id *and* city, and only where the stored visit has no length of
 * its own. Your own visits are keyed `v${Date.now()}` and cannot collide with
 * the seed's `v1`–`v13`, but a length you entered is an answer and must not be
 * overwritten by a default.
 */
function backfillNights(visits: Visit[]): Visit[] {
  try {
    if (localStorage.getItem(NIGHTS_BACKFILLED)) return visits;
  } catch {
    return visits;
  }

  const seeded = new Map(SEED_LOG.visits.map((visit) => [visit.id, visit]));

  return visits.map((visit) => {
    if (typeof visit.nights === "number") return visit;
    const seed = seeded.get(visit.id);
    if (!seed || seed.city !== visit.city || typeof seed.nights !== "number") return visit;
    return { ...visit, nights: seed.nights };
  });
}

export function saveLog(state: LogState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    // Whatever the log holds now, it was written by a version that has reviews,
    // so the backfill above has had its one chance.
    localStorage.setItem(REVIEWS_BACKFILLED, "1");
    localStorage.setItem(NIGHTS_BACKFILLED, "1");
  } catch {
    // Private browsing and full quotas both land here; the session still works.
  }
}

export function clearLog(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to do — the reset just won't persist.
  }
}
