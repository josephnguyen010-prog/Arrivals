import { useId } from "react";

/**
 * The mark: an airmail stamp with a plane on it.
 *
 * It settles the thing the app was carrying two answers to. The bar wore type
 * only and the browser tab wore a globe crossed by a plane that appeared
 * nowhere in the product, so nothing a visitor saw on screen was the thing in
 * their tab. This is one drawing, and `public/favicon.svg` is the same one.
 *
 * The plane is not a new shape either. It is the silhouette already flying the
 * arc on the boarding pass, at the same angle the arc leaves the departure
 * port — the logo and the ticket are drawing the same aircraft.
 *
 * On colour: everything else in the palette swaps between themes, and this
 * deliberately doesn't. `--stamp-bg` is #f6f3eb in both, because a stamp is
 * paper whatever the light is, and once the ground is fixed the ink on it has
 * to be too — the dark theme's lighter red is tuned for navy and goes weak on
 * cream. So the ink is written out rather than tokenised. One drawing, one set
 * of values, the same on kraft, on navy, and on the favicon's tile.
 */

/** Airmail red and blue, at their on-paper values. See the note above. */
const INK = "#c8402f";
const FRAME = "#2e5f92";

/**
 * The plane from the boarding pass, nose up. `BoardingPass` rotates it +90 to
 * fly along the arc; here it banks 35 degrees, which is the angle the arc
 * itself leaves the port at.
 */
const PLANE =
  "M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5L21,16z";

/** Perforations along each edge, at the same pitch on all four. */
const TEETH = [5, 12, 19, 26, 33, 40];

export function Logo({ size = 34 }: { size?: number }) {
  // Two of these can share a page — the bar and a footer — and duplicate mask
  // ids would leave whichever rendered second punching against the first.
  const maskId = useId();

  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      role="img"
      aria-label="Arrivals"
    >
      {/* The teeth are cut out rather than drawn in a background colour: the
          mark sits on navy in the bar, kraft in the light theme and a rounded
          tile in the tab, and a scallop painted to match one of those would be
          a visible square of the wrong colour on the other two. */}
      <mask id={maskId}>
        <rect x="2" y="2" width="40" height="40" fill="#fff" />
        <g fill="#000">
          {TEETH.map((at) => (
            <g key={at}>
              <circle cx={at} cy="2" r="2.1" />
              <circle cx={at} cy="42" r="2.1" />
              <circle cx="2" cy={at} r="2.1" />
              <circle cx="42" cy={at} r="2.1" />
            </g>
          ))}
        </g>
      </mask>

      <g mask={`url(#${maskId})`}>
        <rect x="2" y="2" width="40" height="40" fill="var(--stamp-bg)" />
        {/* The printed frame every stamp has. Thin enough to read as engraving
            at 34px, heavy enough not to disappear entirely at 16. */}
        <rect
          x="5.2"
          y="5.2"
          width="33.6"
          height="33.6"
          fill="none"
          stroke={FRAME}
          strokeWidth="1.3"
        />
      </g>

      {/* The path fills about 19x20 of its 24-unit box, and banking that 35
          degrees swells it to 27 across, so the scale here is not a round
          number and is not chosen by eye: it is the favicon's plane-to-stamp
          ratio, 0.72, resolved against this box. The two files are the same
          drawing, and sizing them separately is how a mark ends up as two
          marks that merely resemble each other. */}
      <g transform="translate(22 22) rotate(35) scale(1.07) translate(-12 -12)">
        <path d={PLANE} fill={INK} />
      </g>
    </svg>
  );
}
