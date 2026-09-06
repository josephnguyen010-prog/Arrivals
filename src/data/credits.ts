import type { CityId } from "../types";

import buivien from "../assets/spots/hcmc-buivien.jpg";
import landmark81 from "../assets/spots/hcmc-landmark81.jpg";
import omoide from "../assets/spots/tokyo-omoide.jpg";
import tmg from "../assets/spots/tokyo-tmg.jpg";
import tsukiji from "../assets/spots/tokyo-tsukiji.jpg";
import ferry from "../assets/spots/ist-ferry.jpg";
import suleymaniye from "../assets/spots/ist-suleymaniye.jpg";
import ladra from "../assets/spots/lisbon-ladra.jpg";
import miradouro from "../assets/spots/lisbon-miradouro.jpg";
import tram28 from "../assets/spots/lisbon-tram28.jpg";
import aligre from "../assets/spots/paris-aligre.jpg";
import montparnasse from "../assets/spots/paris-montparnasse.jpg";
import torre from "../assets/spots/cdmx-torre.jpg";
import fushimi from "../assets/spots/kyoto-fushimi.jpg";
import roosevelt from "../assets/spots/nyc-tram.jpg";
import assistens from "../assets/spots/cph-assistens.jpg";
import dotonbori from "../assets/spots/osaka-dotonbori.jpg";
import umeda from "../assets/spots/osaka-umeda.jpg";
import shinsekai from "../assets/spots/osaka-shinsekai.jpg";
import osakajo from "../assets/spots/osaka-castle.jpg";
import raohe from "../assets/spots/taipei-raohe.jpg";
import beitou from "../assets/spots/taipei-beitou.jpg";
import elephant from "../assets/spots/taipei-elephant.jpg";
import ateneo from "../assets/spots/bsas-ateneo.jpg";
import recoleta from "../assets/spots/bsas-recoleta.jpg";
import caminito from "../assets/spots/bsas-caminito.jpg";

export interface PhotoCredit {
  author: string;
  licence: string;
  /** Absent for public domain, which needs no licence deed. */
  licenceUrl?: string;
  /** Commons filename, before cropping. */
  file: string;
}

const LICENCE_URLS: Record<string, string> = {
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 2.5": "https://creativecommons.org/licenses/by/2.5/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
};

function credit(author: string, licence: string, file: string): PhotoCredit {
  return { author, licence, licenceUrl: LICENCE_URLS[licence], file };
}

/**
 * Every photo is CC0, public domain or attribution-only. Share-alike is
 * deliberately excluded: it obliges derivative works to carry the same licence,
 * which is a problem once photos sit inside a product. See CREDITS.md.
 *
 * CC BY requires the credit to reach the person looking at the photo, which is
 * why this is rendered on the city page rather than left in a file.
 */
export const PHOTO_CREDITS: Record<CityId, PhotoCredit> = {
  amsterdam: credit("Jorge Láscar", "CC BY 2.0", "Swans in a canal, Oudezijds Voorburgwal, with Bridge 105 (5822070926).jpg"),
  austin: credit("rutlo", "CC BY 2.0", "Austin Skyline From Mopac.JPG"),
  boston: credit("Nelson48", "Public domain", "Boston Financial District skyline.jpg"),
  chicago: credit("Eric Pancer", "CC BY 2.0", "St. Charles Air Line Bridge and ex-B&O bridge with Chicago skyline.jpg"),
  dc: credit("Carol M. Highsmith", "Public domain", "July 4th fireworks, Washington, D.C. (LOC).jpg"),
  denver: credit("Quintin Soloviev", "CC BY 4.0", "Denver, Colorado skyline (cropped).jpg"),
  honolulu: credit("Cumulus Clouds", "CC BY 2.5", "Waikiki Beach from Diamond Head.jpg"),
  la: credit("Serouj", "Public domain", "Downtown Los Angeles California.jpg"),
  miami: credit("Averette", "CC BY 3.0", "Biscayne Bay south.jpg"),
  neworleans: credit("George Bannister", "CC BY 2.0", "New Orleans from the Air September 2019 - Central Business District Skyline (cropped).jpg"),
  philly: credit("Goldcup", "CC0", "Columbia Bridge Turn 2014.jpg"),
  seattle: credit("Seattle Municipal Archives", "CC BY 2.0", "Space Needle and skyline from Kerry Park, 2000.jpg"),
  vegas: credit("Notdjey", "CC BY 2.0", "Las Vegas by night 2019 - 46671323131.jpg"),
  bangkok: credit("Swaminathan", "CC BY 2.0", "Statetower.jpg"),
  barcelona: credit("M McBey", "CC BY 2.0", "Evening light over Barcelona.jpg"),
  berlin: credit("Bleppo", "Public domain", "Berlin Skyline voll.jpg"),
  bsas: credit("Deensel", "CC BY 2.0", "Puerto Madero, Buenos Aires (40689219792) (cropped).jpg"),
  cairo: credit("Jorge Láscar", "CC BY 2.0", "Cairo Opera House, Al Hurriyah Park and the Nile river (14797782354).jpg"),
  capetown: credit("Danie van der Merwe", "CC BY 2.0", "Table Mountain DanieVDM.jpg"),
  cdmx: credit("Gobierno CDMX", "CC0", "Sobrevuelos CDMX HJ2A4913 (25514321687) (cropped).jpg"),
  cph: credit("OleNeitzel", "CC BY 4.0", "Nyhavn houses and boats.jpg"),
  delhi: credit("Vyacheslav Argenberg", "CC BY 4.0", "Delhi, India, India Gate.jpg"),
  hanoi: credit("David McKelvey", "CC BY 2.0", "Street markets, Urban Discovery Tour, Hanoi (7060671921).jpg"),
  hcmc: credit("dronepicr", "CC BY 2.0", "Ho Chi Minh city (39514086172).jpg"),
  hongkong: credit("Diliff", "CC BY 3.0", "Hong Kong Skyline - Dec 2007.jpg"),
  ist: credit("Hunanuk", "CC0", "Historical peninsula and modern skyline of Istanbul.jpg"),
  kyoto: credit("Kovacs Bela", "CC BY 3.0", "Kiyomizu-dera Temple, Kyoto - panoramio.jpg"),
  lisbon: credit("Dale Cruse", "CC BY 4.0", "Alfama Rooftops and Tagus River View, Lisbon (54733828355).jpg"),
  london: credit("Dronepicr", "CC BY 3.0", "Tower Bridge London (193364901).jpeg"),
  marra: credit("Jorge Láscar", "CC BY 2.0", "Jemaa el-Fnaa (7346166250).jpg"),
  nyc: credit("Jakub Hałun", "CC BY 4.0", "Manhattan skyline from Upper New York Bay, 20231001 1041 0889.jpg"),
  osaka: credit("663highland", "CC BY 2.5", "Osaka Castle 03bs3200.jpg"),
  paris: credit("Jebulon", "CC0", "Pont Alexandre III depuis pont de la Concorde Paris.jpg"),
  porto: credit("Dale Cruse", "CC BY 4.0", "Nighttime View of the Douro Riverfront in Porto, Portugal (54803354871).jpg"),
  prague: credit("Lucas Garron", "CC0", "Prague Castle at Night viewed from Charles Bridge.jpg"),
  rio: credit("Nan Palmero", "CC BY 2.0", "Rio de Janeiro at Night from Sugarloaf (16176006390).jpg"),
  rome: credit("Diliff", "CC BY 3.0", "Trevi Fountain, Rome, Italy 2 - May 2007.jpg"),
  seoul: credit("USAGI_POST", "CC0", "Han River Seoul skyline Pixabay 1214950.jpg"),
  sf: credit("Craig Howell", "CC BY 2.0", "Zeppelin-ride-020100925-195 (5029394846).jpg"),
  singapore: credit("cegoh (Jason Goh)", "CC0", "Skyline of the Central Business District of Singapore seen from across Marina Bay - 20140129.jpg"),
  sydney: credit("sv1ambo", "CC BY 2.0", "Sydney Opera House and Sydney Harbour Bridge (5106362112).jpg"),
  taipei: credit("Sinchen.Lin", "CC BY 2.0", "Taipei Skyline 2016.jpg"),
  tokyo: credit("Ville Miettinen", "CC BY 2.0", "Sunset in Shinjuku.jpg"),
  toronto: credit("Peter_Glyn", "CC0", "Toronto Skyline, Ontario Canada.jpg"),
};

/**
 * Same rules for the seeded spot photos. Keyed by the bundled asset URL rather
 * than by spot id, so inserting a spot can't shift a credit onto the wrong
 * photograph. A photo you added yourself is a data URL, matches nothing here,
 * and is credited to nobody.
 */
export const SPOT_PHOTO_CREDITS: Record<string, PhotoCredit> = {
  [landmark81]: credit("Nick", "CC BY 2.0", "Vincom Landmark 81 (49012084043).jpg"),
  [buivien]: credit("trungydang", "CC BY 3.0", "Bui vien q1 Hcm - panoramio.jpg"),
  [tmg]: credit("Daderot", "CC0", "Tokyo Metropolitan Government Building No.1 - Shinjuku, Tokyo - DSC05442.jpg"),
  [omoide]: credit("Dick Thomas Johnson", "CC BY 2.0", "Omoide Yokocho (53149989529).jpg"),
  [tsukiji]: credit("Jonathan Forage", "CC0", "Sashimi at the Tsukiji Markets - Tokyo Japan (Unsplash).jpg"),
  [ferry]: credit("Antoloji", "CC0", "Istanbul car ferrie ŞH-Erguvan.jpg"),
  [suleymaniye]: credit("Jakub Hałun", "CC BY 4.0", "Süleymaniye Mosque, Istanbul, 20260606 0805 1307.jpg"),
  [miradouro]: credit("Sonse", "CC BY 2.0", "Lisbon panoramic view from Miradouro da Senhora do Monte (49648892693).jpg"),
  [ladra]: credit("Carlos Luis M C da Cruz", "Public domain", "Feira da ladra.jpg"),
  [tram28]: credit("Yann Cœuru", "CC BY 2.0", "Lisbon - Electrico N°28 (22914497662).jpg"),
  [montparnasse]: credit("Guilhem Vellut", "CC BY 2.0", "Tour Montparnasse @ Paris (23379715554).jpg"),
  [aligre]: credit("Mbzt", "CC BY 4.0", "CF1625 Paris 12e marche Aligre brocante rwk.jpg"),
  [torre]: credit("Fer9324", "CC BY 4.0", "Torre Latinoamericana de lejos.jpg"),
  [fushimi]: credit("Balon Greyjoy", "CC0", "20181110 Fushimi Inari Torii 12.jpg"),
  [roosevelt]: credit("Reinhard Dietrich", "CC0", "Roosevelt Island Tramway 1.jpg"),
  [assistens]: credit("Thue", "Public domain", "Assistens Kirkegård 2.jpg"),
  [dotonbori]: credit("chopstuey", "CC BY 2.0", "Food street in Dotonbori, Osaka; January 2016.jpg"),
  [umeda]: credit("Syced", "CC0", "Umeda Sky Buildng.jpg"),
  [shinsekai]: credit("Sakai Yayoi", "CC0", "Shinsekai and Tsutenkaku Tower.jpg"),
  [osakajo]: credit("663highland", "CC BY 2.5", "Osaka Castle 02bs3200.jpg"),
  [raohe]: credit("Banzai Hiroaki", "CC BY 2.0", "A corn vendor at the Raohe Street Night Market 20090320.jpg"),
  [beitou]: credit("Yusuke Kawasaki", "CC BY 2.0", "Beitou Hot Spring Museum 20110104.jpg"),
  [elephant]: credit("Balon Greyjoy", "CC0", "20190418 Elephant Mountain view-3.jpg"),
  [ateneo]: credit("Deensel", "CC BY 2.0", "El Ateneo Grand Splendid, Buenos Aires (38984631534).jpg"),
  [recoleta]: credit("amanderson2", "CC BY 2.0", "Corner Recoleta Cemetery Buenos Aires Argentina.jpg"),
  [caminito]: credit("Luis Argerich", "CC BY 2.0", "Buenos Aires - La Boca - Caminito - 200807b.jpg"),
};

export function commonsUrl(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
}
