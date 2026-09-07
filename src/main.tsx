import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Hash routing: this gets served from a GitHub Pages sub-path, where a real
// path like /arrivals/cities would 404 on refresh because Pages has no SPA
// fallback. The hash never reaches the server.
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { ListsProvider } from "./state/ListsContext";
import { LogProvider } from "./state/LogContext";
import { PhotosProvider } from "./state/PhotosContext";
import { ProfileProvider } from "./state/ProfileContext";
import { SpotsProvider } from "./state/SpotsContext";
import "./styles/global.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    {/* Outside the providers as well as the screens: the state each one loads
        is read from localStorage in a useState initializer, which runs during
        render and takes the tree down with it if it throws. */}
    <ErrorBoundary>
      <HashRouter>
        {/* Inside the router and above everything else: it only needs to know
            the route changed, and nothing below it should have to care. */}
        <ScrollToTop />
        <ProfileProvider>
          <LogProvider>
            <ListsProvider>
              <SpotsProvider>
                {/* Innermost: every screen reads photos, nothing here writes to
                    the others, so it can sit closest to what renders. */}
                <PhotosProvider>
                  <App />
                </PhotosProvider>
              </SpotsProvider>
            </ListsProvider>
          </LogProvider>
        </ProfileProvider>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
