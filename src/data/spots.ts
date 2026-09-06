import type { Spot } from "../types";

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

/**
 * Sample spots, so the section isn't empty on first run.
 *
 * The places are real and well known; the opinions are written for the
 * prototype and are not anybody's actual recommendations. Links use Google's
 * documented Maps search URL, which resolves for any query — no invented place
 * ids, and nothing that can rot into a dead link.
 *
 * Photos are Wikimedia Commons files of the place itself, bundled rather than
 * inlined: a spot you add carries a data URL, but seeded ones are written back
 * to localStorage the first time you touch the list, and sixteen data URLs
 * would eat the storage budget on their own. A photo is only attached where
 * Commons actually has the place. See CREDITS.md.
 */
function maps(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

let counter = 0;
function spot(
  city: string,
  category: Spot["category"],
  name: string,
  note: string,
  mapsQuery?: string,
  photo?: string,
): Spot {
  counter += 1;
  return {
    id: `seed${counter}`,
    city,
    category,
    name,
    note,
    url: mapsQuery ? maps(mapsQuery) : undefined,
    photo,
  };
}

export const SEED_SPOTS: Spot[] = [
  // Ho Chi Minh City
  spot("hcmc", "Favourite restaurant", "Bánh Mì Huỳnh Hoa", "The queue moves fast. Ask for less pâté if you're new to it.", "Banh Mi Huynh Hoa Ho Chi Minh City"),
  spot("hcmc", "Hidden gem", "The Café Apartments, 42 Nguyễn Huệ", "A whole tower block of tiny cafés. Pay the lift fee, start at the top, walk down.", "42 Nguyen Hue Cafe Apartments Ho Chi Minh City"),
  spot("hcmc", "Must-see view", "Landmark 81 SkyView", "Go an hour before sunset and stay for the lights coming on.", "Landmark 81 SkyView Ho Chi Minh City", landmark81),
  spot("hcmc", "Skip it", "Bùi Viện walking street", "Loud, and priced for people who don't know better. One lap is plenty.", undefined, buivien),

  // Tokyo
  spot("tokyo", "Must-see view", "Tokyo Metropolitan Government Building", "The observation deck is free, and on a clear winter morning you get Fuji.", "Tokyo Metropolitan Government Building observation deck", tmg),
  spot("tokyo", "Hidden gem", "Omoide Yokocho", "Six seats per bar, smoke in the rafters. Go early or you won't get in.", "Omoide Yokocho Shinjuku Tokyo", omoide),
  spot("tokyo", "Favourite restaurant", "Tsukiji Outer Market", "The inner market moved; the outer one is still where you eat. Standing room, before ten.", "Tsukiji Outer Market Tokyo", tsukiji),

  // Istanbul
  spot("ist", "Favourite restaurant", "Çiya Sofrası", "Anatolian home cooking on the Asian side. Point at what looks good.", "Ciya Sofrasi Kadikoy Istanbul"),
  spot("ist", "Hidden gem", "The Kadıköy–Eminönü ferry", "Twenty minutes, a glass of tea, and you're on another continent. Cheapest thing in the city.", "Kadikoy ferry terminal Istanbul", ferry),
  spot("ist", "Must-see view", "Süleymaniye Mosque terrace", "The Golden Horn from above, and far quieter than the tower everyone queues for.", "Suleymaniye Mosque Istanbul", suleymaniye),

  // Lisbon
  spot("lisbon", "Must-see view", "Miradouro da Senhora do Monte", "The highest of the miradouros and the last to fill up. Bring something to drink.", "Miradouro da Senhora do Monte Lisbon", miradouro),
  spot("lisbon", "Hidden gem", "Feira da Ladra", "Tuesday and Saturday. Half junk, half genuinely good, all cheap before noon.", "Feira da Ladra Lisbon", ladra),
  spot("lisbon", "Skip it", "Tram 28 at midday", "Same route, standing, full of pickpockets. Walk it, or go at seven in the morning.", undefined, tram28),

  // Paris
  spot("paris", "Must-see view", "Tour Montparnasse rooftop", "The only view of Paris with the Eiffel Tower actually in it. That's the whole argument.", "Tour Montparnasse observation deck Paris", montparnasse),
  spot("paris", "Hidden gem", "Marché d'Aligre", "A covered market, an open one and a flea market on the same square. Mornings only.", "Marche d'Aligre Paris", aligre),

  // Mexico City
  spot("cdmx", "Favourite restaurant", "Mercado de Medellín", "Colombian, Cuban and Mexican counters side by side. Eat standing at whichever has the queue.", "Mercado de Medellin Mexico City"),
  spot("cdmx", "Must-see view", "Torre Latinoamericana", "Cheaper than the newer tower and the view includes the newer tower.", "Torre Latinoamericana Mexico City", torre),

  // Kyoto
  spot("kyoto", "Hidden gem", "Fushimi Inari before seven", "The gates are empty at dawn and unbearable by ten. It is genuinely worth the alarm.", "Fushimi Inari Taisha Kyoto", fushimi),

  // New York
  spot("nyc", "Hidden gem", "Roosevelt Island Tramway", "A cable car over the East River for the price of a subway ride.", "Roosevelt Island Tramway New York", roosevelt),

  // Bangkok
  spot("bangkok", "Favourite restaurant", "Or Tor Kor Market", "The produce market next to Chatuchak, with a food hall most visitors walk straight past.", "Or Tor Kor Market Bangkok"),

  // Copenhagen
  spot("cph", "Hidden gem", "Assistens Cemetery", "Locals sunbathe between the graves. Somehow it isn't strange.", "Assistens Cemetery Copenhagen", assistens),

  // The three cities in the seeded log that had nothing under them. A city you
  // have been to and written a review of, showing an empty Spots section, reads
  // as a bug rather than as a blank you are invited to fill.
  spot("osaka", "Favourite restaurant", "Dotonbori street stalls", "Takoyaki standing up, at a counter, from someone who has made nothing else for twenty years. Dinner here is a street rather than a room.", "Dotonbori Osaka", dotonbori),
  spot("osaka", "Must-see view", "Umeda Sky Building", "The escalator across the gap between the two towers is the ride; the floating garden on the roof is just where it puts you.", "Umeda Sky Building Osaka", umeda),
  spot("osaka", "Hidden gem", "Shinsekai", "Built in 1912 to look like the future, left alone ever since. The tower in the middle is a copy of the Eiffel one, and nobody is embarrassed about it.", "Shinsekai Osaka", shinsekai),
  spot("osaka", "Skip it", "Osaka Castle interior", "The grounds are worth an afternoon. The keep is a concrete rebuild from 1931 with a lift in it, and the queue does not know that yet.", "Osaka Castle", osakajo),

  spot("taipei", "Favourite restaurant", "Raohe Street Night Market", "Shorter and better than Shilin, and the pepper buns at the temple end are worth the queue and the burnt roof of your mouth.", "Raohe Street Night Market Taipei", raohe),
  spot("taipei", "Hidden gem", "Beitou hot springs", "Twenty-five minutes on the metro and you are in a valley that smells of sulphur, with a public bath at the top of it.", "Beitou Hot Spring Taipei", beitou),
  spot("taipei", "Must-see view", "Elephant Mountain", "Twenty minutes of steps for the photograph of Taipei 101 that everyone has. Go an hour before sunset and share the rock politely.", "Elephant Mountain Taipei", elephant),

  spot("bsas", "Hidden gem", "El Ateneo Grand Splendid", "A 1919 theatre that sells books from the stalls and serves coffee on the stage. The boxes are reading rooms.", "El Ateneo Grand Splendid Buenos Aires", ateneo),
  spot("bsas", "Favourite restaurant", "Parrillas of Palermo", "Dinner starts at eleven and the beef is the whole argument. Order less than you think; a portion is for two people who are lying about it.", "Parrilla Palermo Buenos Aires"),
  spot("bsas", "Must-see view", "Recoleta Cemetery", "Streets of marble mausoleums laid out like a small city, which is what it is. Free, and quieter at nine than at noon.", "Recoleta Cemetery Buenos Aires", recoleta),
  spot("bsas", "Skip it", "Caminito", "Three photogenic streets of painted tin with a tango dancer charging for the picture. The rest of La Boca is a working neighbourhood that would rather you didn't.", "Caminito Buenos Aires", caminito),
];
