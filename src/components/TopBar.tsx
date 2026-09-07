import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useTheme } from "../lib/useTheme";
import { CitySearch } from "./CitySearch";
import { NavTabs } from "./NavTabs";

interface TopBarProps {
  onLogVisit: () => void;
}

/**
 * The app's own bar: the wordmark, the sections, and the things you can do from
 * anywhere — one line, with the sections centred in the space between the two.
 *
 * The sections belong here rather than in the page: once the profile block
 * stopped sitting above them they were no longer one person's shelves under
 * their name, they were the app's navigation. Centred rather than tucked in
 * beside the wordmark, they read as their own group instead of as a tail on the
 * title, which is what lets them share a line with the one red button without
 * either losing. It holds to about 830px, where they drop to a line of their
 * own rather than squash.
 */
export function TopBar({ onLogVisit }: TopBarProps) {
  const { theme, toggle } = useTheme();
  const [searching, setSearching] = useState(false);

  return (
    <>
      <div className="airmail" />
      <header className="topbar">
        <div className="topbar-in">
          <Link className="wordmark" to="/">
            <Logo />
            <span className="wordmark-text">
              <b>Arrivals</b>
              <span>Cities, logged</span>
            </span>
          </Link>

          <span className="spacer" />

          <NavTabs />

          <span className="spacer" />

          <button
            className="theme-btn"
            onClick={() => setSearching(true)}
            aria-label="Search cities"
            title="Search cities"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10.8 10.8 L14.5 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <button
            className="theme-btn"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <button className="log-btn" onClick={onLogVisit}>
            Log a visit
          </button>
        </div>
      </header>

      {searching && <CitySearch onClose={() => setSearching(false)} />}
    </>
  );
}
