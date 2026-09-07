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
  accra: credit("Ben Sutherland (on Flickr)", "CC BY 2.0", "Ghana 54th Pic002 B005.jpg"),
  addis: credit("Sailko", "CC BY 3.0", "Addis abeba, chiesa della trinità, esterno 02.jpg"),
  amsterdam: credit("Jorge Láscar", "CC BY 2.0", "Swans in a canal, Oudezijds Voorburgwal, with Bridge 105 (5822070926).jpg"),
  annarbor: credit("Dwight Burdette", "CC BY 3.0", "Ann Arbor, Michigan Skyline From Thompson Street Parking Structure.JPG"),
  athens: credit("Jebulon", "CC0", "Acropolis Parthenon Athens Greece.jpg"),
  auckland: credit("Pseudopanax", "Public domain", "Auckland CBD skyline from Waitemata Harbour entrance.jpg"),
  austin: credit("rutlo", "CC BY 2.0", "Austin Skyline From Mopac.JPG"),
  beijing: credit("Philip Nalangan", "CC BY 4.0", "Forbidden City Beijing China1.jpg"),
  blacksburg: credit("Eric T Gunther", "CC BY 3.0", "Virginia Tech Burruss Hall from Drillfield.JPG"),
  bogota: credit("No machine-readable author provided. Nelammog assumed (based on copyright claims).", "Public domain", "Bogota-centro.JPG"),
  boston: credit("Nelson48", "Public domain", "Boston Financial District skyline.jpg"),
  budapest: credit("Laurens R. Krol", "CC BY 4.0", "2016-10-14 Hungary, Budapest DSC 0047 DxO.jpg"),
  busan: credit("Bernard Gagnon", "CC0", "Gamcheon Culture Village.jpg"),
  chengdu: credit("George Lu", "CC BY 2.0", "Panda in Chengdu Research Base of Giant Panda Breeding - 7708872342.jpg"),
  chicago: credit("edward stojakovic", "CC BY 2.0", "Chicago Skyline (7819742226).jpg"),
  cusco: credit("Pavel Špindler", "CC BY 3.0", "Cusco - Plaza de Armas - panoramio.jpg"),
  dc: credit("Carol M. Highsmith", "Public domain", "July 4th fireworks, Washington, D.C. (LOC).jpg"),
  denver: credit("Quintin Soloviev", "CC BY 4.0", "Denver, Colorado skyline (cropped).jpg"),
  dubai: credit("Francisco Anzola", "CC BY 3.0", "Dubai Marina (222830069).jpeg"),
  dublin: credit("P. Hughes", "CC BY 4.0", "Dubln - River Liffey with Ha'Penny Bridge in distance.jpg"),
  dubrovnik: credit("dronepicr", "CC BY 2.0", "City wall in the Old Town of Dubrovnik, Croatia (48738652708).jpg"),
  honolulu: credit("Cumulus Clouds", "CC BY 2.5", "Waikiki Beach from Diamond Head.jpg"),
  jakarta: credit("Government of Jakarta", "Public domain", "SCBD at night.jpg"),
  kl: credit("ELIZABETH XIONG", "CC BY 4.0", "Kuala Lumpur skyline and Petronas Twin Towers night view from Kampung Baru.jpg 01.jpg"),
  krakow: credit("Craig Wyzik", "CC BY 2.0", "Krakow market Cloth Hall.jpg"),
  la: credit("Kevin Stanchfield", "CC BY 2.0", "Downtown LA at Sunset..jpg"),
  lima: credit("magicmonkey", "CC BY 2.0", "Lima Peru coast.jpg"),
  madrid: credit("Marek Ślusarczyk (Tupungato) Photo portfolio", "CC BY 3.0", "32 Plaza Mayor, Madrid - sidewalk cafes of Plaza Mayor square in Madrid, Spain Spanje.jpg"),
  manila: credit("Vyacheslav Argenberg", "CC BY 4.0", "Manila, Rizal Park skyline, Philippines.jpg"),
  miami: credit("P. Hughes", "CC BY 4.0", "Miami Beach - Ocean Drive (2023).jpg"),
  minneapolis: credit("Tony Webster", "CC BY 2.0", "Minneapolis Skyline and Stone Arch (15188008214).jpg"),
  montreal: credit("Taxiarchos228", "CC BY 3.0", "Montreal - QC - Skyline.jpg"),
  nairobi: credit("Jorge Láscar", "CC BY 2.0", "Lascar Nairobi's skyline from Uhuru Park (4519272483).jpg"),
  neworleans: credit("Nicolas Henderson", "CC BY 2.0", "New Orleans October 2019 - The French Quarter 01.jpg"),
  oxford: credit("Lumaag", "CC0", "High Street Oxford west from The Queen's College 2026-06-19.jpg"),
  philly: credit("Bronzeage10", "CC BY 4.0", "Philadelphia Skyline from the Camden Waterfront.jpg"),
  reykjavik: credit("Andrew Smales", "CC0", "Reykjavik, Iceland aerial cityscape (Unsplash).jpg"),
  santiago: credit("Ricardo Hurtubia", "CC BY 2.0", "Panorama de Santiago 2.jpg"),
  saopaulo: credit("Wilfredor", "CC0", "Avenue and the downtown skyline of Sao Paulo.jpg"),
  seattle: credit("Seattle Municipal Archives", "CC BY 2.0", "Space Needle and skyline from Kerry Park, 2000.jpg"),
  shanghai: credit("Ermell", "CC0", "Shanghai skyline waterfront pudong 5166168 69 70.jpg"),
  siemreap: credit("shankar s.", "CC BY 2.0", "A sweeping panorama of the Angkor Wat (pre-) sunrise scene (50232886447).jpg"),
  vancouver: credit("Jerry Meaden", "CC BY 2.0", "Over the Vancouver (15382980215).jpg"),
  vatican: credit("Vyacheslav Argenberg", "CC BY 4.0", "Rome, Vatican, Italy, Saint Peter's Square as seen from Michelangelo dome.jpg"),
  vegas: credit("Notdjey", "CC BY 2.0", "Las Vegas by night 2019 - 46671323131.jpg"),
  bangkok: credit("Swaminathan", "CC BY 2.0", "Statetower.jpg"),
  barcelona: credit("M McBey", "CC BY 2.0", "Evening light over Barcelona.jpg"),
  berlin: credit("Gary Todd", "CC0", "Berlin Brandenburg Gate (28150532233).jpg"),
  bsas: credit("Deensel", "CC BY 2.0", "Puerto Madero, Buenos Aires (40689219792) (cropped).jpg"),
  cairo: credit("someone10x", "CC BY 2.0", "Giza pyramid complex (9200944628).jpg"),
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
  paris: credit("Pierre Blaché", "CC0", "Eiffel Tower from Pont Alexandre-III, Paris 31 August 2019.jpg"),
  porto: credit("Dale Cruse", "CC BY 4.0", "Nighttime View of the Douro Riverfront in Porto, Portugal (54803354871).jpg"),
  prague: credit("Lucas Garron", "CC0", "Prague Castle at Night viewed from Charles Bridge.jpg"),
  rio: credit("Nan Palmero", "CC BY 2.0", "Rio de Janeiro at Night from Sugarloaf (16176006390).jpg"),
  rome: credit("Diliff", "CC BY 3.0", "Trevi Fountain, Rome, Italy 2 - May 2007.jpg"),
  seoul: credit("USAGI_POST", "CC0", "Han River Seoul skyline Pixabay 1214950.jpg"),
  sf: credit("Chris Leipelt", "CC0", "Above Golden Gate Bridge (Unsplash).jpg"),
  singapore: credit("cegoh (Jason Goh)", "CC0", "Skyline of the Central Business District of Singapore seen from across Marina Bay - 20140129.jpg"),
  sydney: credit("sv1ambo", "CC BY 2.0", "Sydney Opera House and Sydney Harbour Bridge (5106362112).jpg"),
  taipei: credit("Sinchen.Lin", "CC BY 2.0", "Taipei Skyline 2016.jpg"),
  tokyo: credit("Ville Miettinen", "CC BY 2.0", "Sunset in Shinjuku.jpg"),
  toronto: credit("Peter_Glyn", "CC0", "Toronto Skyline, Ontario Canada.jpg"),
  venice: credit("Dimitris Kamaras", "CC BY 2.0", "Grand Canal & the Rialto bridge, Venice (30963056685).jpg"),
  vienna: credit("Wetchup", "CC0", "Back View of Belvedere Palace and Garden.jpg"),
  xian: credit("xiquinhosilva", "CC BY 2.0", "51714-Terracota-Army.jpg"),
  zanzibar: credit("Dr. Ondřej Havelka (cestovatel)", "CC BY 4.0", "Harbour at the picturesque Stone Town.jpg"),
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
