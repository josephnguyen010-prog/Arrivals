import { useState } from "react";
import { cityById } from "../data/cities";
import { LISTS } from "../data/seed";
import { yearOf } from "../lib/dates";
import { ratedCount } from "../lib/ranking";
import { useLog } from "../state/LogContext";
import { useProfile } from "../state/ProfileContext";
import { EditProfile } from "./EditProfile";

export function ProfileHeader() {
  const { log } = useLog();
  const { profile, initials } = useProfile();
  const [editing, setEditing] = useState(false);

  // Countries reached this calendar year, from the visits rather than the
  // ranking: a city you rated years ago is not somewhere you went this year.
  const year = new Date().getFullYear();
  const countriesThisYear = new Set(
    log.visits
      .filter((visit) => yearOf(visit.when) === year)
      .map((visit) => cityById(visit.city)?.country)
      .filter(Boolean),
  );

  return (
    <section className="profile">
      {profile.avatar ? (
        <img className="avatar-preview" src={profile.avatar} alt="" />
      ) : (
        <div className="avatar">{initials}</div>
      )}

      <div className="who-block">
        <h1>{profile.name}</h1>
        <span className="handle">{profile.handle}</span>
        {profile.bio && <p className="bio">{profile.bio}</p>}
        <button className="edit-profile" onClick={() => setEditing(true)}>
          ✎ Edit profile
        </button>
      </div>

      <div className="pstats">
        {/* "Cities 9 · Visits 13" read as two counts of the same thing. They
            are a place and an occasion, so the second label says which of the
            two it counts, and the year says what it is a year of. */}
        <Stat value={ratedCount(log)} label="Cities" />
        <Stat value={log.visits.length} label="Visits to them" />
        <Stat value={countriesThisYear.size} label="Countries this year" />
        <Stat value={log.wishlist.length} label="Departures" />
        <Stat value={LISTS.length} label="Lists" />
      </div>

      {editing && <EditProfile onClose={() => setEditing(false)} />}
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="pstat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
