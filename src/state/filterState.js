import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { del, get, set, keys } from "idb-keyval";
import { useEffect, useState } from "react";

export const initialFiltersList = [
  {
    name: "Basic Filters",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
    status: false,
  },
  {
    name: "Fake News",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts",
    status: false,
  },
  {
    name: "Gambling",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts",
    status: false,
  },
  {
    name: "Porn",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts",
    status: false,
  },
  {
    name: "Social",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts",
    status: false,
  },
];

const initialGlobalHostsList = {
  basic: [],
  fakeNews: [],
  gambling: [],
  porn: [],
  social: [],
};

const initialHostsList = [
  {
    name: "Basic Filters",
    date: "",
    hosts: [],
  },
  {
    name: "Fake News",
    date: "",
    hosts: [],
  },
  {
    name: "Gambling",
    date: "",
    hosts: [],
  },
  {
    name: "Porn",
    date: "",
    hosts: [],
  },
  {
    name: "Social",
    date: "",
    hosts: [],
  },
];

const IDBStorage = {
  getItem: async (key) => await get(key),
  setItem: async (key, value) => await set(key, value),
  removeItem: async (key) => await del(key),
};

const useFilterStore = create(
  persist(
    (set, get) => ({
      globalFilterStatus: false,
      filtersList: initialFiltersList,

      globalHostsList: initialGlobalHostsList,
      hostslist: initialHostsList,

      toggleGlobalFilterStatus: async (status) => {
        set((state) => {
          let globalHostsList = state.globalHostsList;

          const basicHostsList = state.hostslist[0].hosts;

          if (status) {
            globalHostsList = {
              ...initialGlobalHostsList,
              basic: basicHostsList,
            };
          } else {
            globalHostsList = initialGlobalHostsList;
          }

          return {
            globalFilterStatus: status,
            filtersList: state.filtersList.map((filter, index) => {
              return status
                ? { ...filter, status: index === 0 }
                : { ...filter, status: false };
            }),
            globalHostsList: globalHostsList,
          };
        });
      },
      toggleFilterStatus: (name) => {
        set((state) => {
          const updatedFiltersList = state.filtersList.map((filter) => {
            return filter.name === name
              ? { ...filter, status: !filter.status }
              : filter;
          });

          const globalFilterStatus = updatedFiltersList.some(
            (filter) => filter.status
          );

          let globalHostsList = state.globalHostsList;

          const hostsList = updatedFiltersList.find(
            (filter) => filter.name === name
          ).status
            ? state.hostslist.find((filter) => filter.name === name).hosts
            : [];

          switch (name) {
            case "Basic Filters":
              globalHostsList = {
                ...globalHostsList,
                basic: hostsList,
              };
              break;
            case "Fake News":
              globalHostsList = {
                ...globalHostsList,
                fakeNews: hostsList,
              };
              break;
            case "Gambling":
              globalHostsList = {
                ...globalHostsList,
                gambling: hostsList,
              };
              break;
            case "Porn":
              globalHostsList = {
                ...globalHostsList,
                porn: hostsList,
              };
              break;
            case "Social":
              globalHostsList = {
                ...globalHostsList,
                social: hostsList,
              };
              break;
          }

          return {
            filtersList: updatedFiltersList,
            globalFilterStatus: globalFilterStatus,
            globalHostsList: globalHostsList,
          };
        });
      },
      updateHostsList: (name, date, hosts) => {
        if (!hosts) return;

        const oldDate = get().hostslist.find(
          (filter) => filter.name === name
        ).date;

        if (oldDate === date) return;

        set((state) => {
          const updatedHostsList = state.hostslist.map((filter) => {
            return filter.name === name
              ? { name: filter.name, date: date, hosts: hosts }
              : filter;
          });

          return {
            hostslist: updatedHostsList,
          };
        });
      },
    }),
    {
      name: "filter-storage",
      storage: createJSONStorage(() => IDBStorage),
      onRehydrateStorage: (state) => {
        console.log("hydration starts", state);

        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished", state);
          }
        };
      },
    }
  )
);

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  const isStoreSaved = async () => {
    const keysList = await keys();
    const storeName = useFilterStore.persist.getOptions().name;

    return keysList.includes(storeName);
  };

  useEffect(() => {
    const unsubFinishHydration = useFilterStore.persist.onFinishHydration(
      () => {
        console.log("this is the event when hydration is finished");
        setHydrated(true);
      }
    );

    // setHydrated(useFilterStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return { hydrated, isStoreSaved };
};

export default useFilterStore;
