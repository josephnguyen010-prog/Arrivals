import type { City, CityId } from "../types";

import amsterdam from "../assets/cities/amsterdam.jpg";
import austin from "../assets/cities/austin.jpg";
import bangkok from "../assets/cities/bangkok.jpg";
import barcelona from "../assets/cities/barcelona.jpg";
import berlin from "../assets/cities/berlin.jpg";
import boston from "../assets/cities/boston.jpg";
import bsas from "../assets/cities/bsas.jpg";
import chicago from "../assets/cities/chicago.jpg";
import dc from "../assets/cities/dc.jpg";
import denver from "../assets/cities/denver.jpg";
import honolulu from "../assets/cities/honolulu.jpg";
import la from "../assets/cities/la.jpg";
import miami from "../assets/cities/miami.jpg";
import neworleans from "../assets/cities/neworleans.jpg";
import philly from "../assets/cities/philly.jpg";
import seattle from "../assets/cities/seattle.jpg";
import vegas from "../assets/cities/vegas.jpg";
import cairo from "../assets/cities/cairo.jpg";
import capetown from "../assets/cities/capetown.jpg";
import cdmx from "../assets/cities/cdmx.jpg";
import cph from "../assets/cities/cph.jpg";
import delhi from "../assets/cities/delhi.jpg";
import hanoi from "../assets/cities/hanoi.jpg";
import hcmc from "../assets/cities/hcmc.jpg";
import hongkong from "../assets/cities/hongkong.jpg";
import ist from "../assets/cities/ist.jpg";
import kyoto from "../assets/cities/kyoto.jpg";
import lisbon from "../assets/cities/lisbon.jpg";
import london from "../assets/cities/london.jpg";
import marra from "../assets/cities/marra.jpg";
import nyc from "../assets/cities/nyc.jpg";
import osaka from "../assets/cities/osaka.jpg";
import paris from "../assets/cities/paris.jpg";
import porto from "../assets/cities/porto.jpg";
import prague from "../assets/cities/prague.jpg";
import rio from "../assets/cities/rio.jpg";
import rome from "../assets/cities/rome.jpg";
import seoul from "../assets/cities/seoul.jpg";
import sf from "../assets/cities/sf.jpg";
import singapore from "../assets/cities/singapore.jpg";
import sydney from "../assets/cities/sydney.jpg";
import taipei from "../assets/cities/taipei.jpg";
import tokyo from "../assets/cities/tokyo.jpg";
import toronto from "../assets/cities/toronto.jpg";
import beijing from "../assets/cities/beijing.jpg";
import chengdu from "../assets/cities/chengdu.jpg";
import shanghai from "../assets/cities/shanghai.jpg";
import xian from "../assets/cities/xian.jpg";
import accra from "../assets/cities/accra.jpg";
import addis from "../assets/cities/addis.jpg";
import athens from "../assets/cities/athens.jpg";
import bogota from "../assets/cities/bogota.jpg";
import budapest from "../assets/cities/budapest.jpg";
import busan from "../assets/cities/busan.jpg";
import cusco from "../assets/cities/cusco.jpg";
import dublin from "../assets/cities/dublin.jpg";
import jakarta from "../assets/cities/jakarta.jpg";
import kl from "../assets/cities/kl.jpg";
import krakow from "../assets/cities/krakow.jpg";
import lima from "../assets/cities/lima.jpg";
import madrid from "../assets/cities/madrid.jpg";
import manila from "../assets/cities/manila.jpg";
import minneapolis from "../assets/cities/minneapolis.jpg";
import nairobi from "../assets/cities/nairobi.jpg";
import reykjavik from "../assets/cities/reykjavik.jpg";
import santiago from "../assets/cities/santiago.jpg";
import saopaulo from "../assets/cities/saopaulo.jpg";
import siemreap from "../assets/cities/siemreap.jpg";
import vatican from "../assets/cities/vatican.jpg";
import venice from "../assets/cities/venice.jpg";
import vienna from "../assets/cities/vienna.jpg";
import zanzibar from "../assets/cities/zanzibar.jpg";
import annarbor from "../assets/cities/annarbor.jpg";
import blacksburg from "../assets/cities/blacksburg.jpg";
import oxford from "../assets/cities/oxford.jpg";

/**
 * A stand-in catalogue. The real one comes from GeoNames or Wikidata — cities
 * are a finite, canonical set, which is the property that makes this work.
 * Photographs are from Wikimedia Commons; see CREDITS.md.
 */
export const CITIES: City[] = [
  { id: "accra", name: "Accra", country: "Ghana", region: "Africa", photo: accra },
  { id: "addis", name: "Addis Ababa", country: "Ethiopia", region: "Africa", photo: addis },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", region: "Europe", photo: amsterdam },
  { id: "annarbor", name: "Ann Arbor", country: "United States", region: "Americas", photo: annarbor },
  { id: "athens", name: "Athens", country: "Greece", region: "Europe", photo: athens },
  { id: "austin", name: "Austin", country: "United States", region: "Americas", photo: austin },
  { id: "bangkok", name: "Bangkok", country: "Thailand", region: "Asia", photo: bangkok },
  { id: "barcelona", name: "Barcelona", country: "Spain", region: "Europe", photo: barcelona },
  { id: "beijing", name: "Beijing", country: "China", region: "Asia", photo: beijing },
  { id: "berlin", name: "Berlin", country: "Germany", region: "Europe", photo: berlin },
  { id: "blacksburg", name: "Blacksburg", country: "United States", region: "Americas", photo: blacksburg },
  { id: "bogota", name: "Bogota", country: "Colombia", region: "Americas", photo: bogota },
  { id: "boston", name: "Boston", country: "United States", region: "Americas", photo: boston },
  { id: "budapest", name: "Budapest", country: "Hungary", region: "Europe", photo: budapest },
  { id: "bsas", name: "Buenos Aires", country: "Argentina", region: "Americas", photo: bsas },
  { id: "busan", name: "Busan", country: "South Korea", region: "Asia", photo: busan },
  { id: "cairo", name: "Cairo", country: "Egypt", region: "Africa", photo: cairo },
  { id: "chengdu", name: "Chengdu", country: "China", region: "Asia", photo: chengdu },
  { id: "chicago", name: "Chicago", country: "United States", region: "Americas", photo: chicago },
  { id: "capetown", name: "Cape Town", country: "South Africa", region: "Africa", photo: capetown },
  { id: "cph", name: "Copenhagen", country: "Denmark", region: "Europe", photo: cph },
  { id: "cusco", name: "Cusco", country: "Peru", region: "Americas", photo: cusco },
  { id: "delhi", name: "Delhi", country: "India", region: "Asia", photo: delhi },
  { id: "denver", name: "Denver", country: "United States", region: "Americas", photo: denver },
  { id: "dublin", name: "Dublin", country: "Ireland", region: "Europe", photo: dublin },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", region: "Asia", photo: hanoi },
  { id: "hcmc", name: "Ho Chi Minh City", country: "Vietnam", region: "Asia", photo: hcmc },
  { id: "honolulu", name: "Honolulu", country: "United States", region: "Americas", photo: honolulu },
  { id: "hongkong", name: "Hong Kong", country: "Hong Kong", region: "Asia", photo: hongkong },
  { id: "ist", name: "Istanbul", country: "Türkiye", region: "Europe", photo: ist },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", region: "Asia", photo: jakarta },
  { id: "krakow", name: "Krakow", country: "Poland", region: "Europe", photo: krakow },
  { id: "kl", name: "Kuala Lumpur", country: "Malaysia", region: "Asia", photo: kl },
  { id: "kyoto", name: "Kyoto", country: "Japan", region: "Asia", photo: kyoto },
  { id: "vegas", name: "Las Vegas", country: "United States", region: "Americas", photo: vegas },
  { id: "lima", name: "Lima", country: "Peru", region: "Americas", photo: lima },
  { id: "lisbon", name: "Lisbon", country: "Portugal", region: "Europe", photo: lisbon },
  { id: "london", name: "London", country: "United Kingdom", region: "Europe", photo: london },
  { id: "la", name: "Los Angeles", country: "United States", region: "Americas", photo: la },
  { id: "madrid", name: "Madrid", country: "Spain", region: "Europe", photo: madrid },
  { id: "manila", name: "Manila", country: "Philippines", region: "Asia", photo: manila },
  { id: "marra", name: "Marrakesh", country: "Morocco", region: "Africa", photo: marra },
  { id: "cdmx", name: "Mexico City", country: "Mexico", region: "Americas", photo: cdmx },
  { id: "miami", name: "Miami", country: "United States", region: "Americas", photo: miami },
  { id: "minneapolis", name: "Minneapolis", country: "United States", region: "Americas", photo: minneapolis },
  { id: "nairobi", name: "Nairobi", country: "Kenya", region: "Africa", photo: nairobi },
  { id: "neworleans", name: "New Orleans", country: "United States", region: "Americas", photo: neworleans },
  { id: "nyc", name: "New York", country: "United States", region: "Americas", photo: nyc },
  { id: "osaka", name: "Osaka", country: "Japan", region: "Asia", photo: osaka },
  { id: "oxford", name: "Oxford", country: "United Kingdom", region: "Europe", photo: oxford },
  { id: "paris", name: "Paris", country: "France", region: "Europe", photo: paris },
  { id: "philly", name: "Philadelphia", country: "United States", region: "Americas", photo: philly },
  { id: "porto", name: "Porto", country: "Portugal", region: "Europe", photo: porto },
  { id: "prague", name: "Prague", country: "Czechia", region: "Europe", photo: prague },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", region: "Europe", photo: reykjavik },
  { id: "rio", name: "Rio de Janeiro", country: "Brazil", region: "Americas", photo: rio },
  { id: "rome", name: "Rome", country: "Italy", region: "Europe", photo: rome },
  { id: "sf", name: "San Francisco", country: "United States", region: "Americas", photo: sf },
  { id: "santiago", name: "Santiago", country: "Chile", region: "Americas", photo: santiago },
  { id: "saopaulo", name: "Sao Paulo", country: "Brazil", region: "Americas", photo: saopaulo },
  { id: "seattle", name: "Seattle", country: "United States", region: "Americas", photo: seattle },
  { id: "seoul", name: "Seoul", country: "South Korea", region: "Asia", photo: seoul },
  { id: "shanghai", name: "Shanghai", country: "China", region: "Asia", photo: shanghai },
  { id: "siemreap", name: "Siem Reap", country: "Cambodia", region: "Asia", photo: siemreap },
  { id: "singapore", name: "Singapore", country: "Singapore", region: "Asia", photo: singapore },
  { id: "sydney", name: "Sydney", country: "Australia", region: "Oceania", photo: sydney },
  { id: "taipei", name: "Taipei", country: "Taiwan", region: "Asia", photo: taipei },
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "Asia", photo: tokyo },
  { id: "toronto", name: "Toronto", country: "Canada", region: "Americas", photo: toronto },
  { id: "vatican", name: "Vatican City", country: "Vatican City", region: "Europe", photo: vatican },
  { id: "venice", name: "Venice", country: "Italy", region: "Europe", photo: venice },
  { id: "vienna", name: "Vienna", country: "Austria", region: "Europe", photo: vienna },
  { id: "dc", name: "Washington", country: "United States", region: "Americas", photo: dc },
  { id: "xian", name: "Xi'an", country: "China", region: "Asia", photo: xian },
  { id: "zanzibar", name: "Zanzibar City", country: "Tanzania", region: "Africa", photo: zanzibar },
];

const BY_ID = new Map<CityId, City>(CITIES.map((city) => [city.id, city]));

export function cityById(id: CityId): City | undefined {
  return BY_ID.get(id);
}

/**
 * Whether the catalogue still carries this id.
 *
 * Anything read back from localStorage has to pass through here first. A saved
 * log outlives the catalogue that produced it — this one is a stand-in, and the
 * ids will move when it is replaced by a real source — and every screen that
 * maps a stored id straight to `requireCity` would throw on the first one that
 * had gone, on every render, for good.
 */
export function isKnownCity(id: unknown): id is CityId {
  return typeof id === "string" && BY_ID.has(id);
}

/** Throws on an unknown id — callers validate before calling this. */
export function requireCity(id: CityId): City {
  const city = BY_ID.get(id);
  if (!city) throw new Error(`Unknown city: ${id}`);
  return city;
}

export const REGIONS = ["Asia", "Europe", "Americas", "Africa", "Oceania"] as const;
