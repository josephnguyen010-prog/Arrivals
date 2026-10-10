import { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { LogVisitFlow } from "./components/LogVisitFlow";
import { ProfileHeader } from "./components/ProfileHeader";
import { TopBar } from "./components/TopBar";
import { About } from "./screens/About";
import { Activity } from "./screens/Activity";
import { Cities } from "./screens/Cities";
import { CityPage } from "./screens/CityPage";
import { Departures } from "./screens/Departures";
import { CountryList } from "./screens/CountryList";
import { FriendVisit } from "./screens/FriendVisit";
import { ListPage } from "./screens/ListPage";
import { Lists } from "./screens/Lists";
import { Passport } from "./screens/Passport";
import { Profile } from "./screens/Profile";

export function App() {
  const [logging, setLogging] = useState(false);
  // Who you are belongs on your own tab. On every other screen it was a
  // letterhead: the same name and the same five numbers standing over a feed
  // of other people's trips, or over a city that isn't yours.
  //
  // Below the tabs rather than above them. Above, the strip sat at a different
  // height on Profile than everywhere else, so every tab change jolted it up
  // or down the page. Below, the one fixed thing on the screen is the row you
  // navigate with, and the block that comes and goes does it underneath.
  const path = useLocation().pathname;
  const onProfile = path === "/";

  return (
    <>
      <TopBar onLogVisit={() => setLogging(true)} />

      <div className="wrap">
        {onProfile && <ProfileHeader />}

        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />
          {/* A feed entry, not a city: what one person said about it. */}
          <Route path="/activity/:id" element={<FriendVisit />} />
          <Route path="/countries/:region" element={<CountryList />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/departures" element={<Departures />} />
          <Route path="/passport" element={<Passport />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/list/:id" element={<ListPage />} />
          <Route path="/city/:id" element={<CityPage />} />
          <Route path="/about" element={<About />} />
        </Routes>

        {/* One line under every screen; what it is and what is invented lives
            on the About page rather than repeated beneath each one. */}
        <p className="byline">
          By <b>Joseph Nguyen</b>
          {path !== "/about" && (
            <>
              {" · "}
              <Link to="/about">About this prototype</Link>
            </>
          )}
        </p>
      </div>

      {logging && <LogVisitFlow onClose={() => setLogging(false)} />}
    </>
  );
}
