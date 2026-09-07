import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

/**
 * The last line of defence, and specifically a defence against your own saved
 * data.
 *
 * Every screen reads the log back from localStorage on first render, and one
 * that maps over what it finds — the passport, Departures, your favourites —
 * throws outright if the log names a city the catalogue no longer carries.
 * Without a boundary that throw unmounts the whole tree: a blank page, the
 * reason only in the console, and the same blank page on every reload after,
 * because the thing causing it is saved. There is no way out of that from
 * inside the app, which is what makes it worth catching rather than fixing
 * once at the source.
 *
 * The loaders drop unknown cities now, so nobody should reach this. It is here
 * for what gets through anyway, and it offers the one thing that ends the
 * loop: throwing the saved state away.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Nowhere to report it to, but the console is where anyone looking for a
    // cause will look, and React's own message doesn't carry the component
    // stack once a boundary has handled the throw.
    console.error("Arrivals crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="wrap">
        <section className="screen">
          <h1>Something went wrong.</h1>
          <p className="lede">
            The app couldn't read what it had saved in this browser. Starting again clears your
            log, your lists, your spots and any photos you replaced — everything Arrivals keeps
            here — and puts it back to the sample account.
          </p>
          <button className="ghost" onClick={clearEverything}>
            Start again
          </button>
          <p className="note">
            <b>Prototype.</b> Nothing is stored anywhere but this browser, so there is no copy of
            it to restore from.
          </p>
        </section>
      </div>
    );
  }
}

/**
 * Every key this app has ever written, by prefix rather than by name: the
 * pre-rename `postmark.` keys are still read on load, so clearing only the
 * `arrivals.` ones would hand the same bad data straight back.
 */
function clearEverything(): void {
  try {
    const doomed = Object.keys(localStorage).filter(
      (key) => key.startsWith("arrivals.") || key.startsWith("postmark."),
    );
    for (const key of doomed) localStorage.removeItem(key);
  } catch {
    // Storage unreadable is its own kind of broken; the reload is still worth
    // trying, and a fresh load with no storage is exactly the seeded state.
  }
  location.reload();
}
