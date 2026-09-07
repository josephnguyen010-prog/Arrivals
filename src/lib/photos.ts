import type { City, CityId } from "../types";
import { writeCapped } from "./quota";

const KEY = "arrivals.photos.v1";
/**
 * Smaller than the spots budget on purpose: there are 75 cities and only one
 * photo each, so a full set at ~100KB a photo sits well inside this.
 */
const BUDGET_BYTES = 3_000_000;
const FULL_MESSAGE =
  "There isn't room to save that photo. Put another city back to its default and try again.";

/** City id to a downscaled JPEG data URL. Only cities you changed appear. */
export type CityPhotos = Record<CityId, string>;

export function loadPhotos(): CityPhotos {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    // Only data URLs, so a tampered store can't turn into a request off-origin.
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === "string" && entry[1].startsWith("data:image/"),
      ),
    );
  } catch {
    // Corrupt or unavailable storage costs you your photos, not the app.
    return {};
  }
}

export function savePhotos(photos: CityPhotos): void {
  writeCapped(KEY, JSON.stringify(photos), BUDGET_BYTES, FULL_MESSAGE);
}

/** Yours if you set one, otherwise the one the city shipped with. */
export function photoFor(photos: CityPhotos, city: City): string {
  return photos[city.id] ?? city.photo;
}
