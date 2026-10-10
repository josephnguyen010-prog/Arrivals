import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Profile", end: true },
  { to: "/activity", label: "Activity", end: false },
  { to: "/cities", label: "Cities", end: false },
  { to: "/departures", label: "Departures", end: false },
  { to: "/passport", label: "Passport", end: false },
  { to: "/lists", label: "Lists", end: false },
];

/**
 * Sits under the profile block rather than in the top bar. The bar is the app;
 * these tabs are the sections of one person's account, so they belong with the
 * name and the stats they describe.
 */
export function NavTabs() {
  return (
    <nav className="navtabs">
      {LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
