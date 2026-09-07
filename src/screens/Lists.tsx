import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CityPhoto } from "../components/CityPhoto";
import { ListEditor } from "../components/ListEditor";
import { requireCity } from "../data/cities";
import { useLists } from "../state/ListsContext";
import type { CityList } from "../types";

export function Lists() {
  const { mine, followed, catalogue, create } = useLists();
  const [making, setMaking] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="screen">
      <div className="section-head">
        <div>
          <h2 style={{ border: "none", margin: 0, padding: 0 }}>Your lists</h2>
        </div>
        <button className="log-btn" onClick={() => setMaking(true)}>
          New list
        </button>
      </div>
      <p className="lede">
        The shareable object. A list is a set of cities plus an argument for why they belong
        together, and the order is part of the argument.
      </p>

      {mine.length === 0 ? (
        <p className="empty">
          You haven't made one yet. A good list is narrower than "favourites".
        </p>
      ) : (
        <div className="lists">
          {mine.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "36px" }}>From people you follow</h2>
      <div className="lists">
        {followed.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </div>

      {/* Last, and under its own heading: it is the catalogue rather than a
          list somebody made, and filing it with the others would put a
          reference table among four arguments. */}
      <h2 style={{ marginTop: "36px" }}>Everywhere else</h2>
      <p className="lede">
        Nothing else shows you all of them — the board is what you've rated, Departures is what
        you mean to reach.
      </p>
      <div className="lists">
        <ListCard list={catalogue} />
      </div>

      {making && (
        <ListEditor
          onClose={() => setMaking(false)}
          onSave={({ title, blurb, cities }) => {
            const list = create(title, blurb, cities);
            setMaking(false);
            navigate(`/list/${list.id}`);
          }}
        />
      )}
    </section>
  );
}

function ListCard({ list }: { list: CityList }) {
  return (
    <Link className="list-card" to={`/list/${list.id}`}>
      <div className="strip">
        {list.cities.slice(0, 5).map((id) => (
          <CityPhoto key={id} city={requireCity(id)} loading="lazy" />
        ))}
        {list.cities.length === 0 && <div className="strip-empty" />}
      </div>
      <h3>{list.title}</h3>
      {list.blurb && <p>{list.blurb}</p>}
      <span className="by">
        {list.cities.length} {list.cities.length === 1 ? "city" : "cities"} · {list.by}
      </span>
    </Link>
  );
}
