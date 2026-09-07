/**
 * The arrivals counter: how many people have turned up this year, so far.
 *
 * Spread evenly across the year, which is not how tourism works — everywhere
 * has a season, and the fare model in `fares.ts` already knows that much. It is
 * even here on purpose. Weighting the count by the fare curve would make the
 * number move in a more convincing way without making it any more true, and
 * a counter that speeds up in July would be claiming a measurement the source
 * figure does not contain. What is honest is the annual total; the rest is
 * arithmetic anyone can check.
 */

/** Midnight on 1 January, local time, for whatever year `now` falls in. */
function startOfYear(now: Date): number {
  return new Date(now.getFullYear(), 0, 1).getTime();
}

function endOfYear(now: Date): number {
  return new Date(now.getFullYear() + 1, 0, 1).getTime();
}

/** How far through the year we are, 0 at midnight on 1 January and 1 at the end. */
export function yearProgress(now: Date = new Date()): number {
  const from = startOfYear(now);
  const span = endOfYear(now) - from;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (now.getTime() - from) / span));
}

/**
 * Arrivals so far this year. Floored rather than rounded: a counter that has
 * not yet reached a number should not be showing it.
 */
export function visitorsSoFar(perYear: number, now: Date = new Date()): number {
  if (!Number.isFinite(perYear) || perYear <= 0) return 0;
  return Math.floor(perYear * yearProgress(now));
}

/**
 * Milliseconds between one arrival and the next, which is how often the
 * counter has anything new to say.
 *
 * Hong Kong's twenty-six million works out at roughly one a second, which
 * ticks along nicely. Zanzibar's six hundred thousand is one every fifty
 * seconds, and there is no honest way to make that look busier — so the
 * component polls on this interval rather than on a fixed one, and a quiet
 * city simply sits still between arrivals.
 */
export function msPerVisitor(perYear: number): number {
  if (!Number.isFinite(perYear) || perYear <= 0) return Number.POSITIVE_INFINITY;
  const year = 365.2425 * 24 * 60 * 60 * 1000;
  return year / perYear;
}

/** "12,481,903" — grouped, because the point is to watch the digits move. */
export function formatCount(value: number): string {
  return Math.max(0, Math.floor(value)).toLocaleString("en-US");
}
