import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Every new page starts at the top of it.
 *
 * Changing the route does not move the window, so opening a friend's write-up
 * from halfway down the Activity feed left you halfway down the write-up —
 * next to the spots, or the prototype footnote, or nothing at all, depending
 * on how tall the page you landed on happened to be. That last part is why it
 * looked arbitrary: the browser clamps the old offset to the new page's
 * height, so the same click landed somewhere different for every city.
 *
 * Back and forward are left alone. A POP is a return to somewhere you have
 * already been, and the position you were at is part of what you are going
 * back to — scrolling to the top there would lose your place in the feed.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
}
