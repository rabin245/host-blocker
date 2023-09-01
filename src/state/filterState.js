import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { del, get, set, keys } from "idb-keyval";
import { useEffect, useState } from "react";
import axios from "axios";

export const initialFiltersList = [
  {
    name: "Basic Filters",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
    status: false,
    key: "basic",
  },
  {
    name: "Fake News",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts",
    status: false,
    key: "fakeNews",
  },
  {
    name: "Gambling",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts",
    status: false,
    key: "gambling",
  },
  {
    name: "Porn",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts",
    status: false,
    key: "porn",
  },
  {
    name: "Social",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts",
    status: false,
    key: "socialMedia",
  },
];

const initialGlobalHostsList = {
  basic: [],
  fakeNews: [],
  gambling: [],
  porn: [],
  socialMedia: [],
};

const initialHostsList = [
  {
    name: "Basic Filters",
    date: "",
    hosts: [],
    key: "basic",
  },
  {
    name: "Fake News",
    date: "",
    hosts: [],
    key: "fakeNews",
  },
  {
    name: "Gambling",
    date: "",
    hosts: [],
    key: "gambling",
  },
  {
    name: "Porn",
    date: "",
    hosts: [],
    key: "porn",
  },
  {
    name: "Social",
    date: "",
    hosts: [],
    key: "socialMedia",
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

      cancelTokenSource: null,

      toggleGlobalFilterStatus: async (status) => {
        let cancelTokenSource = get().cancelTokenSource;
        console.log(cancelTokenSource);

        if (cancelTokenSource) {
          cancelTokenSource.cancel("Request canceled");
          set({ cancelTokenSource: null });
        }

        cancelTokenSource = axios.CancelToken.source();
        set({ cancelTokenSource: cancelTokenSource });
        console.log(cancelTokenSource);

        try {
          // axios.get("http://localhost:3000/", {
          // cancelToken: cancelTokenSource.token,
          // });
          axios.post(
            "http://localhost:3000/hosts/block-hosts",
            {
              basic: status ? true : false,
              fakeNews: false,
              gambling: false,
              porn: false,
              socialMedia: false,
            },
            {
              cancelToken: cancelTokenSource.token,
            }
          );
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          } else {
            console.log("Something went wrong: ", error.message);
          }
        }

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
          let cancelTokenSource = state.cancelTokenSource;
          console.log(cancelTokenSource);

          if (cancelTokenSource) {
            cancelTokenSource.cancel("Request canceled");
            set({ cancelTokenSource: null });
          }

          cancelTokenSource = axios.CancelToken.source();

          let updatedFilterIndex;
          const updatedFiltersList = state.filtersList.map((filter, index) => {
            const filterMatched = filter.name === name;

            if (filterMatched) updatedFilterIndex = index;

            return filterMatched
              ? { ...filter, status: !filter.status }
              : filter;
          });

          const globalFilterStatus = updatedFiltersList.some(
            (filter) => filter.status
          );

          let globalHostsList = state.globalHostsList;

          const hostsList = updatedFiltersList[updatedFilterIndex].status
            ? state.hostslist[updatedFilterIndex].hosts
            : [];

          globalHostsList = {
            ...globalHostsList,
            [updatedFiltersList.at(updatedFilterIndex).key]: hostsList,
          };

          const filtersStatus = Object.fromEntries(
            updatedFiltersList.map((filter) => [filter.key, filter.status])
          );
          try {
            // axios.get("http://localhost:3000/");
            axios.post(
              "http://localhost:3000/hosts/block-hosts",
              filtersStatus,
              {
                cancelToken: cancelTokenSource.token,
              }
            );
          } catch (error) {
            console.log("Something went wrong: ", error.message);
          }
          return {
            filtersList: updatedFiltersList,
            globalFilterStatus: globalFilterStatus,
            globalHostsList: globalHostsList,
            cancelTokenSource: cancelTokenSource,
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

      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== "cancelTokenSource")
        ),
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
