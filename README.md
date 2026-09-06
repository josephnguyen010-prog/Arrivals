# Arrivals

Letterboxd, but for cities. Rate the places you've been, log every trip separately, and keep a
ranking that's built from comparisons rather than guesswork.

**Arrivals is a working title**, named for the arrival stamp in a passport and the board in an
airport. It replaced `Postmark`, which collided with ActiveCampaign's transactional email service —
a developer-facing product, and so the worst possible audience to share a name with.

Worth knowing if the name comes up again: the stamp-flavoured names are saturated by direct
competitors in exactly this category. **Stamped: Travel Tracker & Map**, **Stamp: Travel Tracker**,
**Stampie** and **WanderStamp** all already track places you've been, and **Passage** is a travel
app too. `Arrivals` and `Port of Entry` were the passport words left standing.

The trade-off: a common English word is hard to trademark and hard to search for. `Port of Entry` is
more ownable and more literally passport, but it's three words and shortens badly.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # ranking logic
npm run build    # typecheck + production build
```

## Where it's deployed

A copy of the build is served from the portfolio at `/arrivals/`. Two things make that work, and
both matter if you move it anywhere else:

- `base: "./"` in `vite.config.ts`, so asset paths are relative and survive any sub-path.
- `HashRouter` rather than `BrowserRouter`. GitHub Pages has no SPA fallback, so a real path like
  `/arrivals/cities` would 404 on refresh. The hash never reaches the server.

To update the copy in the portfolio: `npm run build`, then replace `public/arrivals/` there.

## The idea

Three decisions carry the design.

**A rating and a ranking are different things.** You give a city a star rating outright — tap the
stars on any city page, or the pencil on a card in Cities. But when
you land on a rating you've already given something else, the app asks which of the two you
preferred, and inserts the new city by binary search. Placing into a rating that holds *n* cities
costs `ceil(log2(n + 1))` questions — three for eight cities, four for sixteen — so it stays a
question or two in practice. The ordering that falls out is a real ranked list, not a pile of ties.

**You rate the city, but you log the trip.** Films get watched a hundred times a year; cities get
visited maybe three. A city-shaped log would be too quiet to be worth opening. So the unit is a
visit, and the MyPassport screen shows them in order, with repeat trips marked `↻ visit 2`. It's
ruled off by year rather than by month: at this rate of travel a month header sits over one row
almost every time, which splits the date in two and strands the day in the margin, a long way from
the header that gives it meaning. Years actually group, and each row carries its date whole.

**Cities are a finite, canonical catalogue.** That's the property Letterboxd relies on and
restaurant apps have to fight for. A few thousand cities from GeoNames or Wikidata and the
catalogue problem is solved.

## Profile

The landing screen: your four favourite cities, recent activity, and previews of Departures and
MyPassport down the side. Favourites are chosen and ordered by hand rather than taken from the top
of the ranking — the city you'd tell someone about isn't always the one you scored highest, and
that gap is the interesting part.

No bio block and no promo panel, which is what the reference had and this doesn't need.

## Two screens, split by whether you've been
**Cities** is only where you've been. A grid two-thirds full of grey `not been` cards was noise
rather than a catalogue, so unvisited cities are not there at all.

**Departures** is only where you're going: a count, a filter row, one grid. Nothing else. An earlier
version carried a search box and a second grid of the whole catalogue, which made one screen do
two jobs.

That leaves the catalogue needing a home, so it lives in **search in the top bar** — find any city,
open it, or add it to the board with the `+` without leaving the results. Same arrangement as a
watchlist: the list is the list, and finding things is a separate act.

Logging a visit moves a city across on its own — off the board, into Cities.

## Spots

Under every city, the things you'd actually tell someone about, filed under **Favourite restaurant**,
**Hidden gem**, **Must-see view** or **Skip it**. Each takes an optional link and an optional photo,
and each can be edited afterwards — the pencil reopens the form it was written in, category
included, so a spot can be re-filed as well as reworded. Removing lives inside that form now; the
only thing you could previously do to a spot you'd written was throw it away.

Two things worth knowing about how they're stored:

- **Photos are downscaled before they're stored, never after.** A phone photo is several megabytes
  and `localStorage` is a few for the whole origin, so `downscaleImage` caps the longest edge at
  900px and re-encodes as JPEG, which lands around 60–120KB. The total is checked against a budget
  before every write, and the form reports a full store instead of failing silently.
- **Pasted links are validated, not trusted.** `safeUrl` accepts a bare host and assumes https, but
  returns null for anything that doesn't resolve to http(s) — `javascript:` above all — so the save
  button stays disabled and nothing unsafe is ever put in an `href`. Links render with
  `rel="noreferrer noopener"`. It's tested.

The section ships with sample spots for a dozen cities. The places are real and well known; the
opinions are written for the prototype and are nobody's actual recommendations. Links use Google's
documented Maps search URL, which resolves for any query — no invented place ids to rot. Sixteen of
the twenty-one carry a Commons photograph of the place itself; the five Commons has nothing for are
left without one rather than illustrated with a stand-in.

`Skip it` was my addition to the three categories. A negative recommendation is genuinely useful
and rare in travel apps, but it changes the tone — drop it from `SPOT_CATEGORIES` if you'd rather
the section stayed positive.

## Notes on a city

The header runs in three columns: the stamp, the title block with your rating under the name, and
the facts beside them — how the place got there, what to eat, what to see, and one thing worth knowing. That
third column is where the title block was leaving the page empty, which for a city you haven't been
to is nearly all of it.

They stay subordinate by type rather than by position: mono labels, muted body, ruled off, against a
name set in 36pt. A spell as a band under the whole header tested the other theory and proved it the
wrong way round — it read fine, and left the column it came out of empty again.

The facts are a hand-written table in `data/facts.ts`, keyed by the same city ids as the catalogue,
and a test asserts every city has every field filled and no two cities share a fun fact. That's a
coverage check, not a fact check: the entries are deliberately kept to what's firmly established and
short enough to read in one pass. Like the catalogue itself, the real version of this comes from
Wikidata.

A separate line saying what the city was to its country — capital, former capital, second city —
came out again: the eyebrow above it already names the country, so on half the catalogue it was
saying Taiwan three times in three lines. The ones that said something the eyebrow doesn't went into
the history sentence instead, where they read as history rather than as a label: Kyoto was the
capital for a thousand years, Rio until Brasília, Istanbul's is Ankara now, and Parliament still
sits in Cape Town. The plain state capitals were left out — *Capital of Colorado* is true and inert,
and if the state matters the fix is a state in the catalogue, not a clause in the prose.

A column of names — people born in or made by the city — was there first and came out again. It
needed a caption to be honest, because for a lot of cities the person the place is known for arrived
rather than started there, and a caption on a list of three names is a lot of hedging for something
nobody asked about the city. One fact that's actually surprising does more.

## The ticket

Under every city page, what it costs to get there and what it costs to be there. Both are
estimates, and both say so — the interesting design problem is being useful without pretending to
be a booking engine.

**What it costs** is both halves, added up, with the total as the headline: a daily rate per city
from `data/costs.ts` times a pace and a number of nights, plus the modelled fare. It sits beside
the Departures button because that's the moment the question comes up.

It shares a panel with the facts, in the column beside the title block — one block you turn rather
than two that could never be made to line up. Both panes stay in the layout, stacked in a single
grid cell with the inactive one hidden, so turning it never resizes the page. The two panes are named tabs rather than dots. Dots said there was a second thing without saying
what, which is the standing complaint about carousels — whatever is past the first slide may as
well not exist. Naming them costs no height, because the tabs are the panes' headings: each pane
stopped printing its own.

**Getting there** below it is the ticket and the booking links.

Moving it also killed a duplicated number. The fare was printed twice on one page — once as
`Flights` in the breakdown and once as `Typical fare` on the pass stub, from the same call. The
stub carries the *range* now, which is something the breakdown doesn't say.

It used to price only the ground half and admit in eleven-pixel type that the flight wasn't in it —
while the flight sat priced on the boarding pass two hundred pixels further down. Which half
dominates flips city by city, so the caveat couldn't have saved it: from Greensboro, Bangkok is
$275 on the ground against a $1,260 flight and New York is $1,050 against $200, so the headline
number was a fifth of the answer in one direction and most of it in the other. `lib/tripCost.ts`
adds them, and the test that matters asserts both of those inversions.

There is one trip length on the page. The cost block owns it and the booking panel reads it, so
changing the nights moves the ground cost, the total and the return date together. They used to be
two independent fields — `Days: 5` and `Nights: 7` — describing two different journeys at once.

**Your ticket** is the flight, drawn as a boarding pass — the airmail stripe along the top edge,
the route across the middle, and the fare on a stub torn off down a perforation. The stub is where
the fare goes because that is the one number on the pass that is an estimate; the distance and the
flight time either side of it are arithmetic.

### There is no Google Flights API

The obvious way to fill the fare in is to ask Google, and you can't. Google retired **QPX Express**
in April 2018 and never replaced it; there is no public flight-search product in its developer
directory today, and the ITA fare engine behind Google Flights is an enterprise agreement. Every
service selling a "Google Flights API" — SerpApi, SearchAPI, Apify — is a scraper in front of the
same web page, on a monthly quota.

Three things ruled a live source out even so, and they're worth writing down because they are
properties of this app rather than of the vendors:

- **There is no server to keep a key on.** Arrivals is a static bundle. A `VITE_` variable is
  inlined into it, so anyone can read the key out of the page and spend the quota. Live fares mean
  a serverless proxy first, and then the app has a backend to keep alive.
- **The free tier that would have fitted is gone.** Amadeus Self-Service was the one legitimate
  free flight API a side project could use, and it shut down on 17 July 2026. What's left
  self-serve is a scraper at 250 searches a month, or an affiliate deal.
- **A quota is the wrong shape for this page.** 250 searches a month is eight a day, and the fare
  belongs on *every* city page — one person browsing the catalogue would exhaust a month before
  lunch. Worse, a fare is true for a few hours, and there is nothing here to book with, so the
  number would be both stale and unactionable.

So the fare is modelled instead, in `data/fares.ts`, and the pass says on its face that it is an
estimate.

### Booking is a handoff, not a feature

The thing that makes all of the above beside the point: **you don't need a flight API to send
someone to book a flight.** Google Flights takes a plain text query —
`google.com/travel/flights?q=Flights from GSO to HND on 2026-10-12` — and Skyscanner and Kayak both
take the route and the dates in the path. No key, no quota, no scraping, and nothing to go stale.

It's also the better product. Letterboxd doesn't sell you a film; it hands you off to whoever is
streaming it, and the reviews stay the point. Arrivals is the same shape — the friends' notes are
what you came for, and the ticket is somebody else's business. A listings table inside the pass
would mean quoting prices the app can't honour, through a booking flow it doesn't have, off a feed
that has gone stale between the fetch and the click. **The link is worth more than the table,
because what it opens is true.**

So the right-hand column of the ticket is **Book it**: a departure date, a number of nights, and
three links out, sharing a bottom edge with the ticket so the two read as one object.

The direction of that fit is the whole trick. Stretching the ticket down to meet a tall panel
ruined it — a boarding pass with a hand's width of nothing between the fare and the barcode. So the
panel is laid out to come in *under* the ticket's own height instead: the fields run across in
three columns rather than down in three rows, and the two comparison sites share the row beneath
Google. That took the panel from 388px to 250px against a ticket that is 262px, and the ticket now
sets the height while the panel stretches the last twelve pixels to meet it.

Widening the panel is what paid for that, and it was free: the row was 1034px inside a 1124px
column, so there were ninety pixels going spare on the right. More width means fewer wrapped lines
means less height.

The calendar hangs off the field row as a popover for the same reason — inline, it added four
hundred pixels to the panel and dragged the ticket open with it every time it was clicked.

### Live flights, when there's a key

Set `VITE_FLIGHTS_API` and the panel stops being only a handoff: it lists what is actually flying —
airline, times, duration, stops and price, cheapest marked — from `api/flights.js` in the portfolio
repo, a serverless function holding a SerpApi key and caching each route for six hours. `.env.example`
has the wiring. Unset, which is the default and what anyone cloning this gets, nothing is fetched
and the panel is exactly what it was.

Three things this had to get right, and they are all the same thing:

- **The key is never in the app.** Arrivals is a static bundle and Vite inlines `VITE_*` into
  readable page source, so the variable holds a URL and the function holds the secret. The function
  validates the route and dates against `^[A-Z]{3}$` and `^\d{4}-\d{2}-\d{2}$` before calling out,
  or it is an open proxy to any SerpApi engine on somebody else's quota.
- **A flight has to be the one you asked for.** The endpoint is a URL from an environment variable
  and the answer is cached by a CDN, so the app checks the airports on every flight against the
  route it requested and drops anything that disagrees. This is not hypothetical: pointing
  `VITE_FLIGHTS_API` at a static JSON fixture — which ignores the query string — served Tokyo's
  flights on every city in the catalogue, so Istanbul offered Japan Airlines at a Tokyo price.
  Contradictory airports are rejected; missing ones are not, because a flight that never reported
  its airports is thin data rather than the wrong route.
- **Every failure looks like no answer.** A 503 from a missing key, a 502 from a spent quota, an
  aborted fetch, a body that isn't the shape we expect, a response with an empty list — all of them
  return `null` and the panel falls back to the modelled fare and plain links. A visitor cannot act
  on *quota exhausted* and should never be shown it. The fallback is the feature.
- **The airline marks degrade twice.** The upstream's `airline_logo` first, then one derived from
  the carrier code on the flight number, since that field comes back empty for codeshares — and if
  the image itself 404s, an `onError` swaps in a lettered chip. Google has no mark for every airline
  that flies, and a missing file renders as the browser's broken-image icon, which reads as the app
  being broken rather than the logo being absent.
- **The list can never stretch the ticket.** A flight list is the one element here whose length
  nobody controls, so the panel is lifted out of the grid's height calculation entirely — the column
  is `position: relative` with no intrinsic height, the panel fills it absolutely, and the list takes
  the leftover with `flex: 1 1 0` and scrolls. The ticket sets the height; the list lives inside
  whatever is left, which is about three flights.

The cost is the honest part. SerpApi is 250 searches a month free, then $25/mo, and it is a scraper
in front of Google's page rather than an airline feed — so it breaks when Google changes, and that
is maintenance somebody owns. The six-hour cache is what makes the quota per-route-per-day instead
of per-visitor. If the key ever lapses, nothing breaks; the ticket goes back to estimating. `lib/booking.ts` builds them and is tested — including the one bug that would be
invisible and awful, which is `toISOString()` shifting a local midnight back a day and booking
everyone west of Greenwich onto the wrong flight.

The calendar came out of `LogVisitFlow` to make this work. It was hard-wired to refuse future
dates, which is right for logging a trip you've taken and exactly backwards for booking one you
haven't, so it now takes `min` and `max` instead: logging bounds it at today, booking bounds it at
today and a year out, because airlines don't load schedules further than that. Same control, both
directions, one date picker to keep good.

### What the model actually claims

Fare per kilometre falls as distance grows, because the fixed costs of a departure are shared over
more of it — a straight line through the origin prices a transatlantic hop like ten short ones and
is wrong by a factor of three. So the base is a table of anchors interpolated between, checked by a
test that asserts the *rate* falls even as the total rises.

Two things move it off that curve. A **market multiplier** by region, which is competition rather
than distance: Europe is dense with carriers undercutting each other, Africa's long-haul routes are
thin and mostly leave one airline setting the price. And a **season**, taken from the destination's
latitude rather than its continent — Rio and Rome sit in `Americas` and `Europe` and have opposite
summers, so the hemisphere has to come from the coordinates the flight path already uses. Inside
fifteen degrees of the equator there is no summer to price, and the dear months are the dry ones.

The seasonal rows are normalised to an average month of exactly 1, which is what lets them be tuned
by eye: nudging July doesn't quietly make every city dearer. It also makes the range on the stub
mean something specific — the low is the cheap season and the high is the peak, not a percentage
either side of a guess.

### The airport on the pass

A pass needs a code, and the catalogue stores cities. Rather than hand-type a column of codes that
would rot, `nearestAirport` joins the two by geography, with a radius past which it declines to
name one at all. Two wrinkles came out of that:

- **Nearest is not where you land.** New York's closest runway is LaGuardia, which flies almost no
  long haul, and Washington's is National, which flies none. So the airports that are a city's
  actual gateway are marked as such, and a gateway inside the radius beats anything closer.
- **Five cities had no airport in the list at all** — Berlin, Hanoi, Kyoto, Osaka and Porto. Four
  were added, because Kyoto and Osaka share Kansai, which is the honest answer rather than a tidy
  one: Kyoto has no airport, and the train from KIX is how you actually arrive.

A test asserts every city in the catalogue resolves to an arrival airport, so adding a
forty-fifth city fails loudly rather than printing a pass with a blank on it.

## Your own photo

Every city ships with a Commons photograph, and every one of them can be replaced from **Change
photo** on the city page. Yours then shows everywhere that city appears — the card, the stamp, the
passport row, the comparison screen — because it all resolves through one `CityPhoto` component
rather than reading `city.photo` directly.

Two details that matter more than the feature does:

- **The credit changes with the photo.** CC BY obliges the credit to reach whoever is looking at the
  picture. Once the picture is yours there's nobody to credit, and still naming the original
  photographer would be worse than saying nothing — so the line becomes *Your photo*, and comes back
  when you put the default back.
- **It reuses the spot-photo pipeline exactly.** Same 900px cap, same JPEG re-encode, same up-front
  budget check, now shared out of `lib/images.ts` and `lib/quota.ts` rather than living inside
  `lib/spots.ts`. A full set of 44 replacements sits inside the budget.

## Layout

```
src/
  lib/ranking.ts        the insertion logic, pure and tested
  lib/storage.ts        the only file that knows where the log lives
  lib/lists.ts          list persistence
  lib/search.ts         typeahead ranking and inline completion, pure and tested
  lib/dates.ts          calendar arithmetic, pure and tested
  lib/spots.ts          spot storage and link validation
  lib/photos.ts         per-city photo overrides
  lib/images.ts         downscaling, shared by spots, cities and avatars
  lib/quota.ts          the localStorage budget, and the error the forms report
  data/fares.ts         the fare curve, the market and the seasons, pure and tested
  lib/booking.ts        the search URLs the ticket hands off to, pure and tested
  lib/trips.ts          how long a trip was, and how long you have spent in a country
  data/coords.ts        city coordinates and great-circle distance
  data/airports.ts      airports, the gateway flag, and the nearest-airport join
  state/                LogContext, ListsContext, SpotsContext, PhotosContext, ProfileContext
  data/                 city catalogue, city facts, photo credits, seed data
  components/           Stars, CityCard, Stamp, Calendar, BoardingPass, BookFlight, the flows
  screens/              Profile, Activity, Cities, Departures, Passport, Lists, ListPage, CityPage
  styles/tokens.css     the palette, both themes
```

`ranking.ts` is pure functions over a `LogState`, so the interesting behaviour is testable without
rendering anything. `npm test` covers placement at the top, bottom and middle of a rating, the
question-count bound, re-rating a city, and the case where a city would otherwise be compared
against itself.

## Design

Airmail. Red and blue together as a barber stripe rather than a single accent colour, on kraft
paper or navy ink. Palatino for the wordmark, Helvetica for the interface, and Courier for
anything that's data — dates, countries, ratings — which is the vernacular of customs forms
and luggage tags. Both themes are first-class; the toggle in the top bar overrides the OS setting.

The perforated stamp is the one loud element, so it's kept to the city page and the moment a visit
is logged. Everywhere else cities are quiet rectangles, because a grid is for scanning.

**One loose end after the rename.** The identity was drawn for a postal name — the perforated edge
is a postage stamp, and the diagonal red-and-blue rule is an airmail envelope. The circular
cancellation mark survives the move intact, because a passport entry stamp genuinely looks like
that: a ring, the port of entry arced over the top, the date across the middle. The perforations and
the airmail stripe are the parts still arguing for the old name. Moving them to a visa-page
treatment — guilloche, a torn edge, a document number — would settle it, but that's a redesign
rather than a rename.

## State of it

Working: rating, the comparison flow, the ranking, filters and sorts, Departures, spots with links
and photos, city notes, replacing a city's photo with your own, the trip cost, the boarding pass
and the handoff to book it, the MyPassport screen, per-city pages, lists you can create and reorder, both themes, and
persistence to `localStorage`.

The sheet has no scroller of its own. A tall panel used to grow a bar down its own edge, inside the
sheet and beside the content; the veil scrolls the whole sheet instead, and its own bar is hidden.

The search shows nothing until you type. An untouched field used to open onto all 44 cities in
alphabetical order, which is a list nobody reads — and it left the first one highlighted, so Enter
logged a trip to Amsterdam you hadn't chosen. The sheet is pinned near the top of the veil rather
than centred, so growing as you type moves only its bottom edge.

Logging is two screens, not four: find the city, then say everything about the trip on one panel —
when you went, how it was, a note, and one spot worth remembering. Only the city is required. The
comparisons that follow are the app placing the rating, not another question about the visit.

The date is a field you open rather than a screen you pass through. Behind it is a calendar built
here rather than an `<input type="date">`, which brings the OS's own styling with it — the one
element on the page that can never be made to match. `‹ ›` steps a month, `«  »` a year, future days
are disabled, and the grid takes one tab stop with arrow keys inside it, because tabbing past
thirty-one days to reach the one you want is not a date picker. `lib/dates.ts` holds the arithmetic —
the month-step clamp that stops *Previous* from landing you forwards, and the leap-year cases — and
it's tested.

A typed date field above the calendar was tried and taken out again: it parsed a good spread of
formats and had to refuse `8/12` as ambiguous, which is a lot of apparatus in front of a control
that was already two clicks.

**Your review** sits directly under the city header, with **what people say** beneath it. Both are
about the place rather than about a trip, which is the same split the app makes with the rating: a
visit's note is what one trip was like, a review is what you make of the city. Writing one is a
sheet with a single field; it can be edited or deleted from the same place afterwards. It lives on
the log as `reviews`, keyed by city, and older saves without the field load with an empty one.

The **Activity** screen is one column of what happened — theirs and yours, newest first. A friend's
trip is the loud entry, because they wrote something; your own stamps are a line, because you
already know what you did.

They only actually mix because the feed carries real dates. It used to carry relative ages — `"2d"`,
`"5mo"` — which have a ceiling: nothing could be older than the oldest string anyone had written, so
all nineteen friend entries sorted above all thirteen of your trips and the screen read as two lists
stacked. Both kinds are dated `day` + `when` now and sort through one function, `daysAgo`.

**Who else has been** is the panel's third tab — who you follow that has been here — who you
follow that has been here, what they gave it, when they went and for how long, each row opening
their write-up rather than the city. The Activity feed answers *what has anyone been doing lately*,
which is a different question from *what do the people I follow make of this place*, and the second
one is the one you have while looking at a city. An earlier version of this README described this
section as though it existed; it didn't, and now it does.

A friend's write-up carries the whole of it now — the panel with all three tabs, the ticket, the
booking links and the spots — rather than a link to where those things live. It was three separate
half-fixes before: the link was hidden on unvisited cities, then shown, then the cost was moved
over but the ticket left behind. Reading somebody on a city you have never been to *is* the moment
you want to know what going costs and how to do it, and each click between that thought and the
answer was one nobody had a reason for. What stays on the city page is your own record — your
review and your visits — and that is what the line at the end of a friend's page now points at,
only when you have been.

The tab is only there when somebody has been. Twenty-six of the forty-four cities have no entry,
and a tab asks to be clicked in a way a section below the fold does not — one that opened on
*nobody you follow has been* would be worse than no tab. It costs no height either way: the cost
pane is the tallest of the three and sets the panel, so the third tab fits inside a box that was
already that size.

## How long you were there

Every visit can record a number of nights, and every country totals them. `lib/trips.ts` holds the
arithmetic and is tested.

The field is optional and stays optional, which is the only interesting decision in it. Trips logged
before it existed have no length, and a trip nobody measured is not a nought-night trip — so a blank
stays `undefined` rather than becoming `0`, `CountryStay` reports how many trips it *couldn't* count
alongside the total, and `longestStays` leaves out a country whose trips were never measured instead
of ranking it at zero. The log panel's field is likewise blank by default rather than pre-filled with
a guess.

The feed's friends have lengths too. They always did — buried in a tag string reading `"10 days"` —
which is why the tags now carry only what kind of trip it was.

It shows under each date in MyPassport, beside each visit on the city page, on your own lines in
Activity, and totalled per country on the region lists. A log saved before the field existed gets
the seeded trips' lengths handed back once, the same way `backfillReviews` does it and for the same
reason — otherwise every one of those screens shows nothing for ever, which reads as the feature
being broken rather than the data being old. Only the seeded ids, only where there is no length
already: a length you entered is an answer, and a trip of your own that predates the field stays
blank rather than being given an invented number.

Your note is the one thing the app used to give everyone but you. The feed's invented friends had
reviews from the start; your own log held a rating, some dates and a few spots, and nowhere to say
what a place was actually like. It shows on the city page beside each visit and under the city's
name in the passport.

Nothing in the log flow is thrown away once a rating is picked. The comparisons only decide where a
city sits inside its rating, so leaving them — Escape, the veil, **Skip the rest** — keeps the visit
and files it by the answers given so far, placed mid-bracket rather than at the top of the rating,
which is the least the answers claim. `settleEarly` in `ranking.ts` is that rule, and it's tested.

Not built yet:

- **Accounts and a real social graph.** The feed and the friends' notes are invented. Swapping
  `lib/storage.ts` for a Supabase table is the whole migration for the log itself; the social half
  is a real build.
- **More than 44 cities.** The catalogue is still a hand-written array; the real one is GeoNames.
  The facts table in `data/facts.ts` is hand-written against the same ids and has the same problem.
- **Sharing a list.** Lists exist and are editable, but only in your own browser. Making one
  shareable is the point of them and needs the backend.
- **Your own photo per visit.** Spots and cities take photos now; a single visit still doesn't, so
  ten years of trips to one city share one picture.
- **Spots for the other thirty-five cities.** Thirteen have them. A test asserts every city in the
  seeded *log* does, which is the line that matters — an empty Spots section on a city you have
  rated and reviewed reads as a bug — but the catalogue at large is still mostly bare.
- **A real fare on the pass.** The estimate is fine and the booking links are live, so this is
  now a nicety rather than a gap. If it's ever worth doing, the cheap version is not a live proxy
  but a build-time fetch: pull real fares once for a handful of origins, commit the table, ship it
  static. No key in the bundle, no quota burnt by traffic, and the estimator stays underneath for
  every route the table misses.

## Photos

All 44 default city photographs and the 26 spot photographs are CC0, public domain or
attribution-only, and the credit renders on the city page because CC BY requires it to reach
whoever is looking at the photo — until the photo is replaced with one of your own, at which point
there is nobody to credit and the line says so. Share-alike is deliberately excluded: it obliges derivative works to carry the same licence,
which is a problem once photos sit inside a product. [CREDITS.md](CREDITS.md) has both tables and
the rule for adding a city.

## The open question

Ratings bunch at the top. Nobody flies somewhere hoping to file it under two stars, so the upper
bands get long while the bottom stays empty, and the comparison work concentrates in a couple of
places. Beli avoids this because you eat somewhere mediocre every week.

A distribution chart on the Cities screen used to show this, but it earned too much room for
something you would look at twice, so it came out. The filter bar covers the same ground more
cheaply: `Rating` filters to a band or an exact value, which answers "how much is stacked at 4½"
by just showing you. If the top bands do swallow everything once there's real data, the fix is
probably finer resolution up there rather than more stars overall.
