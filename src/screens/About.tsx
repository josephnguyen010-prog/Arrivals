const REPO = "https://github.com/josephnguyen010-prog/Arrivals";

/**
 * What this is and what in it is made up. It used to run as footnotes under
 * every screen, which put the same three paragraphs beneath a feed, a passport
 * and a city page alike; now each screen ends with one line pointing here.
 */
export function About() {
  return (
    <section className="screen about">
      <h2 style={{ border: "none", margin: "0 0 10px", padding: 0 }}>About this prototype</h2>
      <p className="lede">
        Arrivals is Letterboxd for cities: log the places you have been, rate them, and keep a
        ranking built from comparisons rather than guesswork.
      </p>

      <h3>How the ranking works</h3>
      <p>
        Ratings are yours to set, but the ordering is real. When you give a city the same star
        rating as one you have already logged, it runs a binary-search insertion to work out which
        of the two you actually preferred. That is why it only ever asks a question or two: three
        questions settle an eight-city band.
      </p>

      <h3>What is real and what is not</h3>
      <p>
        Your log is real and stays in this browser; nothing is sent anywhere. The friends, their
        notes and their trips are invented, and the arrivals counters are rounded estimates rather
        than a measured figure.
      </p>

      <h3>Photographs</h3>
      <p>
        Every photograph comes from Wikimedia Commons and is CC0 or attribution-only. Each is
        credited on its city's page, and the full list is in{" "}
        <a href={`${REPO}/blob/master/CREDITS.md`} target="_blank" rel="noreferrer">
          CREDITS.md
        </a>
        .
      </p>

      <h3>The name</h3>
      <p>
        <b>Arrivals</b> is a working title, after the stamp in a passport and the board in an
        airport.
      </p>

      <p className="about-links">
        <a href={REPO} target="_blank" rel="noreferrer">
          Source code on GitHub
        </a>
      </p>
    </section>
  );
}
