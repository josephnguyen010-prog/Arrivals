import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CITIES } from "../data/cities";
import { LISTS } from "../data/seed";
import { loadMyLists, makeList, saveMyLists } from "../lib/lists";
import type { CityId, CityList } from "../types";

/**
 * Every city the app carries, as a list of its own.
 *
 * Not an argument like the others are — the catalogue itself, alphabetically.
 * Nothing else browses the whole thing: the Cities board is what you have
 * rated, Departures is what you mean to reach, and the only other place all
 * seventy-five appear is inside a search box you have to already be typing in.
 * Derived from CITIES rather than written out, so it cannot fall behind the
 * catalogue it is supposed to be.
 */
export const CATALOGUE: CityList = {
  id: "all",
  title: "Every city on Arrivals",
  by: "@arrivals",
  blurb: "The whole catalogue, in alphabetical order. Not a recommendation — just what there is.",
  cities: [...CITIES].sort((a, b) => a.name.localeCompare(b.name)).map((city) => city.id),
};

interface ListsContextValue {
  /** Yours first, then the seeded ones, then the catalogue. */
  all: CityList[];
  mine: CityList[];
  followed: CityList[];
  /** Every city there is, for the section that is not anybody's opinion. */
  catalogue: CityList;
  byId: (id: string) => CityList | undefined;
  create: (title: string, blurb: string, cities: CityId[]) => CityList;
  update: (id: string, patch: Partial<Pick<CityList, "title" | "blurb" | "cities">>) => void;
  remove: (id: string) => void;
}

const ListsContext = createContext<ListsContextValue | null>(null);

export function ListsProvider({ children }: { children: ReactNode }) {
  const [mine, setMine] = useState<CityList[]>(loadMyLists);

  useEffect(() => {
    saveMyLists(mine);
  }, [mine]);

  const create = useCallback((title: string, blurb: string, cities: CityId[]) => {
    const list = makeList(title, blurb, cities);
    setMine((current) => [list, ...current]);
    return list;
  }, []);

  const update = useCallback(
    (id: string, patch: Partial<Pick<CityList, "title" | "blurb" | "cities">>) => {
      setMine((current) =>
        current.map((list) => (list.id === id ? { ...list, ...patch } : list)),
      );
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setMine((current) => current.filter((list) => list.id !== id));
  }, []);

  const value = useMemo<ListsContextValue>(() => {
    const all = [...mine, ...LISTS, CATALOGUE];
    return {
      all,
      mine,
      followed: LISTS,
      catalogue: CATALOGUE,
      byId: (id: string) => all.find((list) => list.id === id),
      create,
      update,
      remove,
    };
  }, [mine, create, update, remove]);

  return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
}

export function useLists(): ListsContextValue {
  const value = useContext(ListsContext);
  if (!value) throw new Error("useLists must be used inside a ListsProvider");
  return value;
}
