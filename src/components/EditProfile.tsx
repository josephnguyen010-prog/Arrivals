import { useState } from "react";
import type { ChangeEvent } from "react";
import { downscaleImage } from "../lib/images";
import { useProfile } from "../state/ProfileContext";
import { AirportPicker } from "./AirportPicker";
import { Modal } from "./Modal";

export function EditProfile({ onClose }: { onClose: () => void }) {
  const { profile, save, initials } = useProfile();
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [homeAirport, setHomeAirport] = useState(profile.homeAirport);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPickAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setAvatar(await downscaleImage(file));
    } catch {
      setError("That image could not be read. Try a JPEG or PNG.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose} labelledBy="edit-profile-title">
      <h2 id="edit-profile-title">Profile</h2>
      <h3>How you show up</h3>

      <div className="avatar-edit">
        {avatar ? (
          <img className="avatar-preview" src={avatar} alt="" />
        ) : (
          <div className="avatar">{initials}</div>
        )}
        <div className="avatar-actions">
          <label className="filepick">
            <input type="file" accept="image/*" onChange={onPickAvatar} />
            <span>{busy ? "Shrinking…" : avatar ? "Change photo" : "Add a photo"}</span>
          </label>
          {avatar && (
            <button className="ghost" onClick={() => setAvatar("")}>
              Use initials
            </button>
          )}
        </div>
      </div>

      <label className="field">
        <span>Name</span>
        <input className="search" value={name} onChange={(event) => setName(event.target.value)} />
      </label>

      <label className="field">
        <span>Handle</span>
        <input
          className="search"
          value={handle}
          onChange={(event) => setHandle(event.target.value.replace(/\s+/g, ""))}
        />
      </label>

      <label className="field">
        <span>Bio</span>
        <textarea
          className="search note-box"
          rows={3}
          value={bio}
          placeholder="Ninety countries behind, three ahead"
          onChange={(event) => setBio(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Home airport</span>
        <AirportPicker value={homeAirport} onChange={setHomeAirport} />
      </label>

      {error && <p className="field-error block">{error}</p>}

      <div className="sheet-foot">
        <button className="ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          className="log-btn"
          disabled={busy}
          onClick={() => {
            // Favourites are edited on the profile page, not here.
            save({ ...profile, name, handle, bio, avatar, homeAirport });
            onClose();
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
